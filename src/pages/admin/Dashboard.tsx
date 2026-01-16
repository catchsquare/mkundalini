import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  pendingPayments: number;
  monthlyRevenue: number;
  lowStockItems: number;
}

interface Appointment {
  id: string;
  patient: { first_name: string; last_name: string };
  start_time: string;
  treatment_type: string;
  status: string;
}

export default function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    todayAppointments: 0,
    pendingPayments: 0,
    monthlyRevenue: 0,
    lowStockItems: 0,
  });
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      const startOfMonth = format(new Date(new Date().setDate(1)), "yyyy-MM-dd");

      // Fetch patients count
      const { count: patientsCount } = await supabase
        .from("patients")
        .select("*", { count: "exact", head: true });

      // Fetch today's appointments
      const { data: appointments } = await supabase
        .from("appointments")
        .select(`
          id,
          start_time,
          treatment_type,
          status,
          patient:patients(first_name, last_name)
        `)
        .eq("appointment_date", today)
        .order("start_time");

      // Fetch pending invoices count
      const { count: pendingCount } = await supabase
        .from("invoices")
        .select("*", { count: "exact", head: true })
        .in("status", ["pending", "partial"]);

      // Fetch monthly revenue
      const { data: monthlyPayments } = await supabase
        .from("payments")
        .select("amount")
        .gte("payment_date", startOfMonth);

      const monthlyRevenue = monthlyPayments?.reduce(
        (sum, p) => sum + Number(p.amount),
        0
      ) || 0;

      // Fetch low stock items
      const { data: lowStockData } = await supabase
        .from("inventory_items")
        .select("id, quantity, min_stock_level")
        .eq("is_active", true);

      const lowStockCount = lowStockData?.filter(
        (item) => item.quantity <= item.min_stock_level
      ).length || 0;

      setStats({
        totalPatients: patientsCount || 0,
        todayAppointments: appointments?.length || 0,
        pendingPayments: pendingCount || 0,
        monthlyRevenue,
        lowStockItems: lowStockCount,
      });

      setTodayAppointments(appointments as unknown as Appointment[] || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: Users,
      color: "bg-blue-500",
      href: "/admin/patients",
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: Calendar,
      color: "bg-green-500",
      href: "/admin/appointments",
    },
    {
      title: "Pending Payments",
      value: stats.pendingPayments,
      icon: Clock,
      color: "bg-orange-500",
      href: "/admin/billing",
    },
    {
      title: "Monthly Revenue",
      value: `NPR ${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-primary",
      href: "/admin/reports",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-primary/10 text-primary";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {profile?.full_name?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening at the clinic today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.href}
            className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Low Stock Alert */}
      {stats.lowStockItems > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <div>
              <p className="font-medium text-orange-800">Low Stock Alert</p>
              <p className="text-sm text-orange-600">
                {stats.lowStockItems} items are running low on stock
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/inventory">View Inventory</Link>
          </Button>
        </div>
      )}

      {/* Today's Appointments */}
      <div className="bg-card rounded-xl border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Today's Appointments
            </h2>
            <p className="text-sm text-muted-foreground">
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/appointments">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="divide-y divide-border">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading...
            </div>
          ) : todayAppointments.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No appointments scheduled for today</p>
            </div>
          ) : (
            todayAppointments.slice(0, 5).map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-medium">
                      {appointment.patient?.first_name?.charAt(0)}
                      {appointment.patient?.last_name?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {appointment.patient?.first_name} {appointment.patient?.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.treatment_type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {appointment.start_time?.slice(0, 5)}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {appointment.status?.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
          <Link to="/admin/patients?action=new">
            <Users className="w-5 h-5" />
            <span>Add Patient</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
          <Link to="/admin/appointments?action=new">
            <Calendar className="w-5 h-5" />
            <span>New Appointment</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
          <Link to="/admin/billing?action=new">
            <DollarSign className="w-5 h-5" />
            <span>Create Invoice</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
          <Link to="/admin/inventory">
            <Package className="w-5 h-5" />
            <span>Check Inventory</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
