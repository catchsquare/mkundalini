import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AnnouncementBar } from "./AnnouncementBar";

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
    </div>
  );
}