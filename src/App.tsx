import { Suspense } from "react";
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
import DentalTourismPage from "./pages/DentalTourismPage";
import ContactPage from "./pages/ContactPage";
import PricingPage from "./pages/PricingPage";
import ReviewsPage from "./pages/ReviewsPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import RefundPage from "./pages/RefundPage";
import FaqPage from "./pages/FaqPage";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Leads from "./pages/admin/Leads";

// Placeholder components for new admin pages
import { AdminPlaceholder } from "./pages/admin/AdminPlaceholder";
import UserManagement from "./pages/admin/UserManagement";
import Settings from "./pages/admin/Settings";
import AuditLogs from "./pages/admin/AuditLogs";

// CMS Pages
import CMSPages from "./pages/admin/cms/Pages";
import Navigation from "./pages/admin/cms/Navigation";
import Doctors from "./pages/admin/cms/Doctors";
import Blog from "./pages/admin/cms/Blog";
import Testimonials from "./pages/admin/cms/Testimonials";
import Gallery from "./pages/admin/cms/Gallery";
import Offers from "./pages/admin/cms/Offers";
import Team from "./pages/admin/cms/Team";
import HomePageEditor from "./pages/admin/cms/HomePageEditor";
import AboutPageEditor from "./pages/admin/cms/AboutPageEditor";
import ServicesPageEditor from "./pages/admin/cms/ServicesPageEditor";
import ContactPageEditor from "./pages/admin/cms/ContactPageEditor";
import DoctorsPageEditor from "./pages/admin/cms/DoctorsPageEditor";
import PricingPageEditor from "./pages/admin/cms/PricingPageEditor";
import ReviewsPageEditor from "./pages/admin/cms/ReviewsPageEditor";
import DentalTourismPageEditor from "./pages/admin/cms/DentalTourismPageEditor";
import HeroSlides from "./pages/admin/cms/HeroSlides";
import ContentBlocks from "./pages/admin/cms/ContentBlocks";
import Faqs from "./pages/admin/cms/Faqs";
import PricingPackages from "./pages/admin/cms/PricingPackages";
import LegalPages from "./pages/admin/cms/LegalPages";

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
              <Route path="/dental-tourism" element={<DentalTourismPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/refund" element={<RefundPage />} />
              <Route path="/faq" element={<FaqPage />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                {/* Dashboard */}
                <Route index element={<Dashboard />} />
                <Route path="quick-actions" element={<AdminPlaceholder title="Quick Actions" />} />

                {/* CRM & Leads */}
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
