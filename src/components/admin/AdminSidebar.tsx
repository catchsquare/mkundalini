import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Receipt,
  BarChart3,
  Package,
  Settings,
  X,
  ChevronDown,
  ChevronRight,
  Stethoscope,
  UserPlus,
  CalendarDays,
  Clock,
  History,
  CreditCard,
  FileText,
  AlertCircle,
  TrendingUp,
  PieChart,
  Download,
  FileSpreadsheet,
  Boxes,
  AlertTriangle,
  ArrowLeftRight,
  // CMS Icons
  FileEdit,
  LayoutTemplate,
  PenTool,
  BookOpen,
  Tags,
  MessageSquare,
  UserCog,
  Award,
  Star,
  Image,
  Images,
  Navigation,
  Globe,
  Link2,
  Menu,
  Cog,
  Mail,
  Phone,
  Share2,
  Search,
  Bell,
  Shield,
  Activity,
  // Lead/CRM Icons
  Target,
  Inbox,
  Filter,
  PhoneCall,
} from "lucide-react";

export type UserRole = "super_admin" | "admin" | "manager" | "receptionist" | "dentist" | "content_editor";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
  roles?: UserRole[];
}

interface NavGroup {
  name: string;
  icon: React.ElementType;
  items: NavItem[];
  roles?: UserRole[];
  defaultOpen?: boolean;
}

// Define navigation structure with role-based access
const navigationGroups: NavGroup[] = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    defaultOpen: true,
    items: [
      { name: "Overview", href: "/admin", icon: LayoutDashboard },
      { name: "Quick Actions", href: "/admin/quick-actions", icon: Stethoscope },
    ],
  },
  {
    name: "CRM & Leads",
    icon: Target,
    roles: ["super_admin", "admin", "manager", "receptionist"],
    items: [
      { name: "All Leads", href: "/admin/leads", icon: Inbox },
      { name: "Lead Pipeline", href: "/admin/leads/pipeline", icon: Filter },
      { name: "Contact Forms", href: "/admin/leads/forms", icon: FileText },
      { name: "Follow-ups", href: "/admin/leads/followups", icon: PhoneCall, badge: "3" },
    ],
  },
  {
    name: "Appointments",
    icon: Calendar,
    roles: ["super_admin", "admin", "manager", "receptionist", "dentist"],
    items: [
      { name: "Calendar View", href: "/admin/appointments", icon: CalendarDays },
      { name: "Today's Schedule", href: "/admin/appointments/today", icon: Clock },
      { name: "Upcoming", href: "/admin/appointments/upcoming", icon: Calendar },
      { name: "History", href: "/admin/appointments/history", icon: History },
    ],
  },
  {
    name: "Patients",
    icon: Users,
    roles: ["super_admin", "admin", "manager", "receptionist", "dentist"],
    items: [
      { name: "Patient Directory", href: "/admin/patients", icon: Users },
      { name: "Add New Patient", href: "/admin/patients/new", icon: UserPlus },
      { name: "Treatment History", href: "/admin/patients/treatments", icon: FileText },
      { name: "Medical Records", href: "/admin/patients/records", icon: FileSpreadsheet, roles: ["super_admin", "admin", "dentist"] },
    ],
  },
  {
    name: "Billing",
    icon: Receipt,
    roles: ["super_admin", "admin", "manager", "receptionist"],
    items: [
      { name: "Invoices", href: "/admin/billing", icon: Receipt },
      { name: "Payments", href: "/admin/billing/payments", icon: CreditCard },
      { name: "Pending Dues", href: "/admin/billing/pending", icon: AlertCircle, badge: "5" },
      { name: "Payment Methods", href: "/admin/billing/methods", icon: CreditCard, roles: ["super_admin", "admin"] },
    ],
  },
  {
    name: "Inventory",
    icon: Package,
    roles: ["super_admin", "admin", "manager"],
    items: [
      { name: "Stock Overview", href: "/admin/inventory", icon: Boxes },
      { name: "Categories", href: "/admin/inventory/categories", icon: Tags },
      { name: "Low Stock Alerts", href: "/admin/inventory/alerts", icon: AlertTriangle, badge: "2" },
      { name: "Transactions", href: "/admin/inventory/transactions", icon: ArrowLeftRight },
    ],
  },
  {
    name: "Reports",
    icon: BarChart3,
    roles: ["super_admin", "admin", "manager"],
    items: [
      { name: "Revenue Analytics", href: "/admin/reports/revenue", icon: TrendingUp },
      { name: "Patient Analytics", href: "/admin/reports/patients", icon: PieChart },
      { name: "Treatment Analytics", href: "/admin/reports/treatments", icon: BarChart3 },
      { name: "Staff Performance", href: "/admin/reports/staff", icon: Award, roles: ["super_admin", "admin"] },
      { name: "Export Data", href: "/admin/reports/export", icon: Download },
    ],
  },
];

// CMS Navigation Groups
const cmsNavigationGroups: NavGroup[] = [
  {
    name: "Pages",
    icon: FileEdit,
    roles: ["super_admin", "admin", "content_editor"],
    items: [
      { name: "All Pages", href: "/admin/cms/pages", icon: FileEdit },
      { name: "Add New Page", href: "/admin/cms/pages/new", icon: FileText },
      { name: "Page Builder", href: "/admin/cms/pages/builder", icon: LayoutTemplate },
      { name: "Templates", href: "/admin/cms/templates", icon: LayoutTemplate },
    ],
  },
  {
    name: "Blog",
    icon: PenTool,
    roles: ["super_admin", "admin", "content_editor"],
    items: [
      { name: "All Posts", href: "/admin/cms/blog", icon: BookOpen },
      { name: "Add New Post", href: "/admin/cms/blog/new", icon: PenTool },
      { name: "Categories", href: "/admin/cms/blog/categories", icon: Tags },
    ],
  },
  {
    name: "Team",
    icon: UserCog,
    roles: ["super_admin", "admin", "content_editor"],
    items: [
      { name: "Doctors", href: "/admin/cms/doctors", icon: Stethoscope },
      { name: "Staff Directory", href: "/admin/cms/staff", icon: Users },
      { name: "Specializations", href: "/admin/cms/specializations", icon: Award },
    ],
  },
  {
    name: "Testimonials",
    icon: MessageSquare,
    roles: ["super_admin", "admin", "content_editor"],
    items: [
      { name: "Reviews", href: "/admin/cms/testimonials", icon: Star },
      { name: "Video Testimonials", href: "/admin/cms/testimonials/videos", icon: MessageSquare },
      { name: "Google Reviews", href: "/admin/cms/testimonials/google", icon: Globe },
    ],
  },
  {
    name: "Gallery",
    icon: Images,
    roles: ["super_admin", "admin", "content_editor"],
    items: [
      { name: "Before/After Cases", href: "/admin/cms/gallery", icon: Image },
      { name: "Clinic Photos", href: "/admin/cms/gallery/clinic", icon: Images },
      { name: "Categories", href: "/admin/cms/gallery/categories", icon: Tags },
    ],
  },
  {
    name: "Navigation",
    icon: Navigation,
    roles: ["super_admin", "admin", "content_editor"],
    items: [
      { name: "Main Menu", href: "/admin/cms/navigation/main", icon: Menu },
      { name: "Footer Links", href: "/admin/cms/navigation/footer", icon: Link2 },
      { name: "Mobile Menu", href: "/admin/cms/navigation/mobile", icon: Menu },
    ],
  },
];

// Settings Navigation
const settingsNavigation: NavGroup[] = [
  {
    name: "Settings",
    icon: Settings,
    roles: ["super_admin", "admin"],
    items: [
      { name: "General", href: "/admin/settings", icon: Cog },
      { name: "SEO Defaults", href: "/admin/settings/seo", icon: Search },
      { name: "Social Links", href: "/admin/settings/social", icon: Share2 },
      { name: "Working Hours", href: "/admin/settings/hours", icon: Clock },
      { name: "WhatsApp/Viber", href: "/admin/settings/messaging", icon: Phone },
      { name: "Email Templates", href: "/admin/settings/emails", icon: Mail },
    ],
  },
  {
    name: "Users & Roles",
    icon: Shield,
    roles: ["super_admin", "admin"],
    items: [
      { name: "All Users", href: "/admin/users", icon: Users },
      { name: "Roles & Permissions", href: "/admin/users/roles", icon: Shield },
      { name: "Activity Logs", href: "/admin/users/activity", icon: Activity },
    ],
  },
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
  userRole: UserRole;
  userName: string;
  userEmail?: string;
}

function NavGroupComponent({
  group,
  userRole,
  onItemClick,
}: {
  group: NavGroup;
  userRole: UserRole;
  onItemClick?: () => void;
}) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(group.defaultOpen ?? false);

  // Check if group is accessible to user
  if (group.roles && !group.roles.includes(userRole)) {
    return null;
  }

  // Filter items by role
  const accessibleItems = group.items.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  if (accessibleItems.length === 0) return null;

  // Check if any item in this group is active
  const isGroupActive = accessibleItems.some(
    (item) => location.pathname === item.href || location.pathname.startsWith(item.href + "/")
  );

  // Auto-expand if active
  if (isGroupActive && !isOpen) {
    setIsOpen(true);
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            isGroupActive
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          <div className="flex items-center gap-3">
            <group.icon className="w-4 h-4" />
            <span>{group.name}</span>
          </div>
          {isOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-4 mt-1 space-y-1">
        {accessibleItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onItemClick}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "px-1.5 py-0.5 text-xs font-medium rounded-full",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function AdminSidebar({
  open,
  onClose,
  userRole,
  userName,
  userEmail,
}: AdminSidebarProps) {
  // Check if user has CMS access
  const hasCMSAccess = ["super_admin", "admin", "content_editor"].includes(userRole);
  const hasSettingsAccess = ["super_admin", "admin"].includes(userRole);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transform transition-transform lg:translate-x-0 flex flex-col",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border flex-shrink-0">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <span className="font-bold text-foreground block leading-tight">KDC Admin</span>
            <span className="text-xs text-muted-foreground">Clinic Management</span>
          </div>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <div className="px-3 space-y-6">
          {/* Main Navigation */}
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Clinic Management
            </p>
            {navigationGroups.map((group) => (
              <NavGroupComponent
                key={group.name}
                group={group}
                userRole={userRole}
                onItemClick={onClose}
              />
            ))}
          </div>

          {/* CMS Navigation */}
          {hasCMSAccess && (
            <div className="space-y-1">
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Content Management
              </p>
              {cmsNavigationGroups.map((group) => (
                <NavGroupComponent
                  key={group.name}
                  group={group}
                  userRole={userRole}
                  onItemClick={onClose}
                />
              ))}
            </div>
          )}

          {/* Settings Navigation */}
          {hasSettingsAccess && (
            <div className="space-y-1">
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Administration
              </p>
              {settingsNavigation.map((group) => (
                <NavGroupComponent
                  key={group.name}
                  group={group}
                  userRole={userRole}
                  onItemClick={onClose}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* User info at bottom */}
      <div className="flex-shrink-0 p-4 border-t border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {userName?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{userName}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {userRole.replace("_", " ")}
            </p>
          </div>
          <Link to="/" className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted" title="View Website">
            <Globe className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
