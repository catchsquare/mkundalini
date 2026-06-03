import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

const STORAGE_KEY = "kdc_consent_v1";

type ConsentValue = "accepted" | "rejected";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        // small delay so it doesn't flash before first paint
        const t = setTimeout(() => setVisible(true), 400);
        return () => clearTimeout(t);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const handleChoice = (choice: ConsentValue) => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // ignore storage errors
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[9999] px-3 pb-3 sm:px-4 sm:pb-4 animate-in fade-in slide-in-from-bottom-4"
    >
      <div className="mx-auto max-w-4xl rounded-xl border border-border bg-background/95 backdrop-blur-md shadow-lg p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex-1 text-sm text-foreground/90 leading-relaxed">
            <p className="font-semibold mb-1 text-foreground">We value your privacy</p>
            <p className="text-muted-foreground">
              We use cookies to improve your experience, analyze site traffic, and personalize content.
              By clicking "Accept", you agree to our use of cookies.{" "}
              <Link to="/privacy" className="underline text-primary hover:opacity-80">
                Learn more
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-2 sm:flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleChoice("rejected")}
              className="flex-1 sm:flex-initial"
            >
              Reject
            </Button>
            <Button
              size="sm"
              onClick={() => handleChoice("accepted")}
              className="flex-1 sm:flex-initial"
            >
              Accept
            </Button>
            <button
              aria-label="Dismiss"
              onClick={() => handleChoice("rejected")}
              className="hidden sm:inline-flex p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
