import { useState, useEffect } from "react";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface Announcement {
  id: string;
  text: string;
  link?: string;
  linkText?: string;
  highlight?: string;
}

const announcements: Announcement[] = [
  {
    id: "1",
    text: "Limited Time Offer:",
    highlight: "20% OFF on All Dental Implants",
    link: "/services/dental-implants",
    linkText: "Book Now",
  },
  {
    id: "2",
    text: "International Patients:",
    highlight: "Free Airport Pickup + Hotel Assistance",
    link: "/dental-tourism",
    linkText: "Learn More",
  },
  {
    id: "3",
    text: "New Year Special:",
    highlight: "Free Consultation for Smile Makeovers",
    link: "/contact",
    linkText: "Claim Offer",
  },
];

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Rotate announcements every 5 seconds
  useEffect(() => {
    if (announcements.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const current = announcements[currentIndex];

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
                <span className="text-secondary-foreground/80">{current.text}</span>{" "}
                <span className="font-semibold text-primary">{current.highlight}</span>
              </span>
              {current.link && (
                <Link
                  to={current.link}
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-primary hover:text-primary/80 transition-colors ml-1 sm:ml-2 whitespace-nowrap"
                >
                  {current.linkText}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
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

          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
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