import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Receipt,
  CreditCard,
  Loader2,
  Download,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, subMonths } from "date-fns";
import { exportToCSV } from "@/lib/csv-export";
import { useToast } from "@/hooks/use-toast";

interface RevenueData {
  date: string;
  revenue: number;
  invoices: number;
}

interface PaymentMethodData {
  method: string;
  amount: number;
}

interface TopTreatmentData {
  name: string;
  revenue: number;
  count: number;
}

export default function Revenue() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30");
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodData[]>([]);
  const [topTreatments, setTopTreatments] = useState<TopTreatmentData[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalInvoices: 0,
    avgInvoiceValue: 0,
    pendingAmount: 0,
    paidInvoices: 0,
    percentChange: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchRevenueData();
  }, [period]);

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const days = parseInt(period);
      const startDate = format(subDays(new Date(), days), "yyyy-MM-dd");
      const endDate = format(new Date(), "yyyy-MM-dd");
      const prevStartDate = format(subDays(new Date(), days * 2), "yyyy-MM-dd");

      // Fetch payments for current period
      const { data: payments } = await supabase
        .from("payments")
        .select("*")
        .gte("payment_date", startDate)
        .lte("payment_date", endDate);

      // Fetch payments for previous period (for comparison)
      const { data: prevPayments } = await supabase
        .from("payments")
        .select("amount")
        .gte("payment_date", prevStartDate)
        .lt("payment_date", startDate);

      // Fetch invoices
      const { data: invoices } = await supabase
        .from("invoices")
        .select("*")
        .gte("created_at", startDate)
        .lte("created_at", endDate);

      // Fetch invoice items with treatments
      const { data: invoiceItems } = await supabase
        .from("invoice_items")
        .select(`
          *,
          invoice:invoices!inner(created_at)
        `)
        .gte("invoice.created_at", startDate);

      // Calculate stats
      const totalRevenue = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      const prevTotalRevenue = prevPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      const percentChange = prevTotalRevenue > 0 
        ? ((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100 
        : 0;

      const totalInvoices = invoices?.length || 0;
      const paidInvoices = invoices?.filter((i) => i.status === "paid").length || 0;
      const pendingAmount = invoices
        ?.filter((i) => i.status !== "paid")
        .reduce((sum, i) => sum + Number(i.total), 0) || 0;

      setStats({
        totalRevenue,
        totalInvoices,
        avgInvoiceValue: totalInvoices > 0 ? totalRevenue / totalInvoices : 0,
        pendingAmount,
        paidInvoices,
        percentChange,
      });

      // Aggregate daily revenue
      const dateRange = eachDayOfInterval({
        start: subDays(new Date(), days),
        end: new Date(),
      });

      const dailyRevenue = dateRange.map((date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        const dayPayments = payments?.filter(
          (p) => format(new Date(p.payment_date), "yyyy-MM-dd") === dateStr
        );
        const dayInvoices = invoices?.filter(
          (i) => format(new Date(i.created_at), "yyyy-MM-dd") === dateStr
        );

        return {
          date: format(date, "MMM d"),
          revenue: dayPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0,
          invoices: dayInvoices?.length || 0,
        };
      });

      setRevenueData(dailyRevenue);

      // Payment methods breakdown
      const methodsMap: Record<string, number> = {};
      payments?.forEach((p) => {
        const method = p.payment_method || "other";
        methodsMap[method] = (methodsMap[method] || 0) + Number(p.amount);
      });

      setPaymentMethods(
        Object.entries(methodsMap).map(([method, amount]) => ({
          method: method.charAt(0).toUpperCase() + method.slice(1),
          amount,
        }))
      );

      // Top treatments by revenue
      const treatmentsMap: Record<string, { revenue: number; count: number }> = {};
      invoiceItems?.forEach((item) => {
        const name = item.description || "Other";
        if (!treatmentsMap[name]) {
          treatmentsMap[name] = { revenue: 0, count: 0 };
        }
        treatmentsMap[name].revenue += Number(item.total);
        treatmentsMap[name].count += 1;
      });

      setTopTreatments(
        Object.entries(treatmentsMap)
          .map(([name, data]) => ({ name, ...data }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5)
      );
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    exportToCSV(revenueData, "revenue-report", [
      { key: "date", label: "Date" },
      { key: "revenue", label: "Revenue (NPR)" },
      { key: "invoices", label: "Invoices" },
    ]);
    toast({ title: "Revenue report exported" });
  };

  const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Revenue Analytics</h1>
          <p className="text-muted-foreground">Track income and financial performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              NPR {stats.totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs mt-1">
              {stats.percentChange >= 0 ? (
                <>
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-green-600">+{stats.percentChange.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-3 h-3 text-red-500" />
                  <span className="text-red-600">{stats.percentChange.toFixed(1)}%</span>
                </>
              )}
              <span className="text-muted-foreground">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Invoices
            </CardTitle>
            <Receipt className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInvoices}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.paidInvoices} paid, {stats.totalInvoices - stats.paidInvoices} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Invoice Value
            </CardTitle>
            <CreditCard className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              NPR {Math.round(stats.avgInvoiceValue).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Per invoice</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Amount
            </CardTitle>
            <DollarSign className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              NPR {stats.pendingAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting payment</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    formatter={(value: number) => [`NPR ${value.toLocaleString()}`, "Revenue"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethods}
                    dataKey="amount"
                    nameKey="method"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ method, percent }) =>
                      `${method} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {paymentMethods.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`NPR ${value.toLocaleString()}`]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Treatments */}
        <Card>
          <CardHeader>
            <CardTitle>Top Treatments by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topTreatments} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    className="text-xs"
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value: number) => [`NPR ${value.toLocaleString()}`, "Revenue"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Invoices Created</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="invoices" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Invoices" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
