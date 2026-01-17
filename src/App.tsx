import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ScrollToTop } from "@/components/ScrollToTop";

// Public pages
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import DoctorsPage from "./pages/DoctorsPage";
import DentalTourismPage from "./pages/DentalTourismPage";
import ContactPage from "./pages/ContactPage";
import PricingPage from "./pages/PricingPage";
import ReviewsPage from "./pages/ReviewsPage";
import DentalImplantsPage from "./pages/treatments/DentalImplantsPage";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Patients from "./pages/admin/Patients";
import Appointments from "./pages/admin/Appointments";
import Billing from "./pages/admin/Billing";
import Inventory from "./pages/admin/Inventory";
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

// Reports
import Revenue from "./pages/admin/reports/Revenue";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/dental-implants" element={<DentalImplantsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/dental-tourism" element={<DentalTourismPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/contact" element={<ContactPage />} />

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

              {/* Appointments */}
              <Route path="appointments" element={<Appointments />} />
              <Route path="appointments/today" element={<AdminPlaceholder title="Today's Schedule" />} />
              <Route path="appointments/upcoming" element={<AdminPlaceholder title="Upcoming Appointments" />} />
              <Route path="appointments/history" element={<AdminPlaceholder title="Appointment History" />} />

              {/* Patients */}
              <Route path="patients" element={<Patients />} />
              <Route path="patients/new" element={<AdminPlaceholder title="Add New Patient" />} />
              <Route path="patients/treatments" element={<AdminPlaceholder title="Treatment History" />} />
              <Route path="patients/records" element={<AdminPlaceholder title="Medical Records" />} />

              {/* Billing */}
              <Route path="billing" element={<Billing />} />
              <Route path="billing/payments" element={<AdminPlaceholder title="Payments" />} />
              <Route path="billing/pending" element={<AdminPlaceholder title="Pending Dues" />} />
              <Route path="billing/methods" element={<AdminPlaceholder title="Payment Methods" />} />

              {/* Inventory */}
              <Route path="inventory" element={<Inventory />} />
              <Route path="inventory/categories" element={<Inventory />} />
              <Route path="inventory/alerts" element={<Inventory />} />
              <Route path="inventory/transactions" element={<Inventory />} />

              {/* Reports */}
              <Route path="reports/revenue" element={<Revenue />} />
              <Route path="reports/patients" element={<Revenue />} />
              <Route path="reports/treatments" element={<Revenue />} />
              <Route path="reports/staff" element={<Revenue />} />
              <Route path="reports/export" element={<Revenue />} />

              {/* CMS - Pages */}
              <Route path="cms/pages" element={<CMSPages />} />
              <Route path="cms/pages/home" element={<HomePageEditor />} />
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
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
