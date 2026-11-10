import { ReactNode, lazy, Suspense, useEffect, useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AnnouncementBar } from "./AnnouncementBar";
import { ConsentBanner } from "./ConsentBanner";
import { OffersPopup } from "./OffersPopup";
import { FloatingCallButton } from "@/components/ui/floating-call-button";

const DentalAssistantWidget = lazy(() =>
  import("@/components/dental-assistant/DentalAssistantWidget").then((m) => ({
    default: m.DentalAssistantWidget,
  }))
);

interface LayoutProps {
  children: ReactNode;
  showAnnouncement?: boolean;
  /** Chat bubble, call button and offer popup. Off on pages with a form to fill in. */
  showFloatingWidgets?: boolean;
}

const CONSENT_KEY = "kdc_consent_v1";

export function Layout({ children, showAnnouncement = true, showFloatingWidgets = true }: LayoutProps) {
  const [consentResolved, setConsentResolved] = useState(true);

  useEffect(() => {
    const check = () => {
      try {
        setConsentResolved(!!localStorage.getItem(CONSENT_KEY));
      } catch {
        setConsentResolved(true);
      }
    };
    check();
    const onResolved = () => setConsentResolved(true);
    window.addEventListener("kdc-consent-resolved", onResolved);
    window.addEventListener("storage", check);
    return () => {
      window.removeEventListener("kdc-consent-resolved", onResolved);
      window.removeEventListener("storage", check);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {showAnnouncement && <AnnouncementBar />}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      {consentResolved && showFloatingWidgets && (
        <>
          <FloatingCallButton />
          <Suspense fallback={null}>
            <DentalAssistantWidget />
          </Suspense>
        </>
      )}
      <ConsentBanner />
      {showFloatingWidgets && <OffersPopup />}
    </div>
  );
}