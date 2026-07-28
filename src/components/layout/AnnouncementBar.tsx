import { useState, useEffect } from "react";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useOffers } from "@/hooks/use-offers";
import { supabase } from "@/integrations/supabase/client";

export function AnnouncementBar() {
  const { offers, loading } = useOffers();
  const [enabled, setEnabled] = useState<boolean>(true);
  const [settingLoaded, setSettingLoaded] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load announcement bar toggle from backend
  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("global_settings")
        .select("setting_value")
        .eq("setting_key", "announcement_bar_enabled")
        .maybeSingle();
      if (!active) return;
      if (data?.setting_value !== undefined && data?.setting_value !== null) {
        // stored as boolean or "true"/"false"
        const v = data.setting_value as unknown;
        setEnabled(v === true || v === "true");
      }
      setSettingLoaded(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  // Restore dismissed state per session
  useEffect(() => {
    if (sessionStorage.getItem("kdc-announcement-dismissed") === "1") {
      setDismissed(true);
    }
  }, []);

  // Only backend offers — no static fallback
  const announcements = offers;

  // Rotate every 5s
  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  if (!settingLoaded || loading) return null;
  if (!enabled || dismissed || announcements.length === 0) return null;

  const current = announcements[currentIndex];
  const text = current.badge_text || "Special Offer:";
  const highlight = current.title;
  const link = current.cta_link || "/contact";
  const linkText = current.cta_label || "Learn More";

  const handleDismiss = () => {
    sessionStorage.setItem("kdc-announcement-dismissed", "1");
    setDismissed(true);
  };

  return (
    <div className="bg-secondary text-secondary-foreground relative z-[60]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-2 sm:py-2.5 gap-2 sm:gap-4 min-h-[40px] sm:min-h-[44px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 sm:gap-3 text-center flex-1 justify-center"
            >
              <Sparkles className="w-4 h-4 text-primary flex-shrink-0 hidden sm:block" />
              <span className="text-xs sm:text-sm">
                <span className="text-secondary-foreground/80">{text}</span>{" "}
                <span className="font-semibold text-primary">{highlight}</span>
              </span>
              {link && (
                <Link
                  to={link}
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-primary hover:text-primary/80 transition-colors ml-1 sm:ml-2 whitespace-nowrap"
                >
                  {linkText}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </motion.div>
          </AnimatePresence>

          {announcements.length > 1 && (
            <div className="hidden sm:flex items-center gap-1.5 ml-4">
              {announcements.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentIndex
                      ? "bg-primary w-3"
                      : "bg-secondary-foreground/30 hover:bg-secondary-foreground/50"
                  }`}
                  aria-label={`Go to announcement ${idx + 1}`}
                />
              ))}
            </div>
          )}

          <button
            onClick={handleDismiss}
            className="p-1.5 hover:bg-secondary-foreground/10 rounded-full transition-colors flex-shrink-0 ml-2"
            aria-label="Close announcement"
          >
            <X className="w-4 h-4 text-secondary-foreground/60" />
          </button>
        </div>
      </div>
    </div>
  );
}
