import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

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
              <Route path="reports/revenue" element={<AdminPlaceholder title="Revenue Analytics" />} />
              <Route path="reports/patients" element={<AdminPlaceholder title="Patient Analytics" />} />
              <Route path="reports/treatments" element={<AdminPlaceholder title="Treatment Analytics" />} />
              <Route path="reports/staff" element={<AdminPlaceholder title="Staff Performance" />} />
              <Route path="reports/export" element={<AdminPlaceholder title="Export Data" />} />

              {/* CMS - Pages */}
              <Route path="cms/pages" element={<AdminPlaceholder title="All Pages" />} />
              <Route path="cms/pages/new" element={<AdminPlaceholder title="Add New Page" />} />
              <Route path="cms/pages/builder" element={<AdminPlaceholder title="Page Builder" />} />
              <Route path="cms/templates" element={<AdminPlaceholder title="Page Templates" />} />

              {/* CMS - Blog */}
              <Route path="cms/blog" element={<AdminPlaceholder title="All Blog Posts" />} />
              <Route path="cms/blog/new" element={<AdminPlaceholder title="Add New Post" />} />
              <Route path="cms/blog/categories" element={<AdminPlaceholder title="Blog Categories" />} />

              {/* CMS - Team */}
              <Route path="cms/doctors" element={<AdminPlaceholder title="Doctors" />} />
              <Route path="cms/staff" element={<AdminPlaceholder title="Staff Directory" />} />
              <Route path="cms/specializations" element={<AdminPlaceholder title="Specializations" />} />

              {/* CMS - Testimonials */}
              <Route path="cms/testimonials" element={<AdminPlaceholder title="Reviews" />} />
              <Route path="cms/testimonials/videos" element={<AdminPlaceholder title="Video Testimonials" />} />
              <Route path="cms/testimonials/google" element={<AdminPlaceholder title="Google Reviews" />} />

              {/* CMS - Gallery */}
              <Route path="cms/gallery" element={<AdminPlaceholder title="Before/After Cases" />} />
              <Route path="cms/gallery/clinic" element={<AdminPlaceholder title="Clinic Photos" />} />
              <Route path="cms/gallery/categories" element={<AdminPlaceholder title="Gallery Categories" />} />

              {/* CMS - Navigation */}
              <Route path="cms/navigation/main" element={<AdminPlaceholder title="Main Menu" />} />
              <Route path="cms/navigation/footer" element={<AdminPlaceholder title="Footer Links" />} />
              <Route path="cms/navigation/mobile" element={<AdminPlaceholder title="Mobile Menu" />} />

              {/* Settings */}
              <Route path="settings" element={<AdminPlaceholder title="General Settings" />} />
              <Route path="settings/seo" element={<AdminPlaceholder title="SEO Defaults" />} />
              <Route path="settings/social" element={<AdminPlaceholder title="Social Links" />} />
              <Route path="settings/hours" element={<AdminPlaceholder title="Working Hours" />} />
              <Route path="settings/messaging" element={<AdminPlaceholder title="WhatsApp/Viber" />} />
              <Route path="settings/emails" element={<AdminPlaceholder title="Email Templates" />} />

              {/* Users & Roles */}
              <Route path="users" element={<UserManagement />} />
              <Route path="users/roles" element={<AdminPlaceholder title="Roles & Permissions" />} />
              <Route path="users/activity" element={<AdminPlaceholder title="Activity Logs" />} />

              {/* Profile */}
              <Route path="profile" element={<AdminPlaceholder title="My Profile" />} />
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
