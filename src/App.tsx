import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { PageLoader } from "@/components/ui/page-loader";

// Public pages
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import DoctorsPage from "./pages/DoctorsPage";
import DoctorProfilePage from "./pages/doctors/DoctorProfilePage";
import DentalTourismPage from "./pages/DentalTourismPage";
import ContactPage from "./pages/ContactPage";
import PricingPage from "./pages/PricingPage";
import ReviewsPage from "./pages/ReviewsPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import RefundPage from "./pages/RefundPage";
import FaqPage from "./pages/FaqPage";
import BookPage from "./pages/BookPage";
import NotFound from "./pages/NotFound";

// Admin pages
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Leads = lazy(() => import("./pages/admin/Leads"));
const Appointments = lazy(() => import("./pages/admin/Appointments"));
const Patients = lazy(() => import("./pages/admin/Patients"));
const BookingSettings = lazy(() => import("./pages/admin/BookingSettings"));

// Placeholder components for new admin pages
const AdminPlaceholder = lazy(() => import("./pages/admin/AdminPlaceholder").then(m => ({ default: m.AdminPlaceholder })));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const AuditLogs = lazy(() => import("./pages/admin/AuditLogs"));

// CMS Pages
const CMSPages = lazy(() => import("./pages/admin/cms/Pages"));
const Navigation = lazy(() => import("./pages/admin/cms/Navigation"));
const Doctors = lazy(() => import("./pages/admin/cms/Doctors"));
const Blog = lazy(() => import("./pages/admin/cms/Blog"));
const Testimonials = lazy(() => import("./pages/admin/cms/Testimonials"));
const Gallery = lazy(() => import("./pages/admin/cms/Gallery"));
const Offers = lazy(() => import("./pages/admin/cms/Offers"));
const Team = lazy(() => import("./pages/admin/cms/Team"));
const HomePageEditor = lazy(() => import("./pages/admin/cms/HomePageEditor"));
const AboutPageEditor = lazy(() => import("./pages/admin/cms/AboutPageEditor"));
const ServicesPageEditor = lazy(() => import("./pages/admin/cms/ServicesPageEditor"));
const ContactPageEditor = lazy(() => import("./pages/admin/cms/ContactPageEditor"));
const DoctorsPageEditor = lazy(() => import("./pages/admin/cms/DoctorsPageEditor"));
const PricingPageEditor = lazy(() => import("./pages/admin/cms/PricingPageEditor"));
const ReviewsPageEditor = lazy(() => import("./pages/admin/cms/ReviewsPageEditor"));
const DentalTourismPageEditor = lazy(() => import("./pages/admin/cms/DentalTourismPageEditor"));
const HeroSlides = lazy(() => import("./pages/admin/cms/HeroSlides"));
const ContentBlocks = lazy(() => import("./pages/admin/cms/ContentBlocks"));
const Faqs = lazy(() => import("./pages/admin/cms/Faqs"));
const PricingPackages = lazy(() => import("./pages/admin/cms/PricingPackages"));
const LegalPages = lazy(() => import("./pages/admin/cms/LegalPages"));

// Reports

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Suspense fallback={<PageLoader text="Loading..." />}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:slug" element={<ServiceDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/doctors" element={<DoctorsPage />} />
              <Route path="/doctors/:slug" element={<DoctorProfilePage />} />
              <Route path="/dental-tourism" element={<DentalTourismPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/refund" element={<RefundPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/book" element={<BookPage />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                {/* Dashboard */}
                <Route index element={<Dashboard />} />
                <Route path="quick-actions" element={<AdminPlaceholder title="Quick Actions" />} />

                {/* CRM & Leads */}
                <Route path="appointments" element={<Appointments />} />
                <Route path="patients" element={<Patients />} />
                <Route path="booking-settings" element={<BookingSettings />} />
                <Route path="leads" element={<Leads />} />
                <Route path="leads/pipeline" element={<Leads />} />
                <Route path="leads/forms" element={<Leads />} />
                <Route path="leads/followups" element={<Leads />} />






                {/* CMS - Pages */}
                <Route path="cms/pages" element={<CMSPages />} />
                <Route path="cms/pages/home" element={<HomePageEditor />} />
                <Route path="cms/pages/about" element={<AboutPageEditor />} />
                <Route path="cms/pages/services" element={<ServicesPageEditor />} />
                <Route path="cms/pages/contact" element={<ContactPageEditor />} />
                <Route path="cms/pages/doctors" element={<DoctorsPageEditor />} />
                <Route path="cms/pages/pricing" element={<PricingPageEditor />} />
                <Route path="cms/pages/reviews" element={<ReviewsPageEditor />} />
                <Route path="cms/pages/dental-tourism" element={<DentalTourismPageEditor />} />
                <Route path="cms/pages/new" element={<CMSPages />} />
                <Route path="cms/pages/builder" element={<CMSPages />} />
                <Route path="cms/templates" element={<CMSPages />} />

                {/* CMS - Blog */}
                <Route path="cms/blog" element={<Blog />} />
                <Route path="cms/blog/new" element={<Blog />} />
                <Route path="cms/blog/categories" element={<Blog />} />

                {/* CMS - Team */}
                <Route path="cms/doctors" element={<Doctors />} />
                <Route path="cms/team" element={<Team />} />
                <Route path="cms/staff" element={<Team />} />
                <Route path="cms/specializations" element={<Doctors />} />

                {/* CMS - Offers */}
                <Route path="cms/offers" element={<Offers />} />

                {/* CMS - Testimonials */}
                <Route path="cms/testimonials" element={<Testimonials />} />
                <Route path="cms/testimonials/videos" element={<Testimonials />} />
                <Route path="cms/testimonials/google" element={<Testimonials />} />

                {/* CMS - Gallery */}
                <Route path="cms/gallery" element={<Gallery />} />
                <Route path="cms/gallery/clinic" element={<Gallery />} />
                <Route path="cms/gallery/categories" element={<Gallery />} />

                {/* CMS - Navigation */}
                <Route path="cms/navigation/main" element={<Navigation />} />
                <Route path="cms/navigation/footer" element={<Navigation />} />
                <Route path="cms/navigation/mobile" element={<Navigation />} />

                {/* CMS - Direct Editors */}
                <Route path="cms/hero-slides" element={<HeroSlides />} />
                <Route path="cms/content-blocks" element={<ContentBlocks />} />
                <Route path="cms/faqs" element={<Faqs />} />
                <Route path="cms/pricing-packages" element={<PricingPackages />} />
                <Route path="cms/legal-pages" element={<LegalPages />} />
                <Route path="cms/services" element={<ServicesPageEditor />} />
                <Route path="cms/team-members" element={<Team />} />
                <Route path="cms/global-settings" element={<Settings />} />

                {/* Settings */}
                <Route path="settings" element={<Settings />} />
                <Route path="settings/seo" element={<Settings />} />
                <Route path="settings/social" element={<Settings />} />
                <Route path="settings/hours" element={<Settings />} />
                <Route path="settings/messaging" element={<Settings />} />
                <Route path="settings/emails" element={<Settings />} />

                {/* Users & Roles */}
                <Route path="users" element={<UserManagement />} />
                <Route path="users/roles" element={<UserManagement />} />
                <Route path="users/activity" element={<AuditLogs />} />

                {/* Profile */}
                <Route path="profile" element={<Settings />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </Suspense>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
