import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AdminSidebar, UserRole } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { cn } from "@/lib/utils";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  // Map profile role to UserRole type
  const getUserRole = (): UserRole => {
    if (!profile?.role) return "receptionist";
    const role = profile.role.toLowerCase();
    if (role === "admin") return "admin";
    if (role === "dentist") return "dentist";
    if (role === "receptionist") return "receptionist";
    if (role === "manager") return "manager";
    if (role === "content_editor") return "content_editor";
    if (role === "super_admin") return "super_admin";
    return "receptionist";
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole={getUserRole()}
        userName={profile?.full_name || "User"}
        userEmail={profile?.email}
      />

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top header */}
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
          userName={profile?.full_name || "User"}
          userRole={getUserRole()}
          onSignOut={handleSignOut}
        />

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
