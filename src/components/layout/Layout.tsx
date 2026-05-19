import { ReactNode, lazy, Suspense } from "react";
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
}

export function Layout({ children, showAnnouncement = true }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {showAnnouncement && <AnnouncementBar />}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingCallButton />
      <Suspense fallback={null}>
        <DentalAssistantWidget />
      </Suspense>
      <ConsentBanner />
      <OffersPopup />
    </div>
  );
}