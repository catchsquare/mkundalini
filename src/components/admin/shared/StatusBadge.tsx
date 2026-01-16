import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = 
  | "pending" 
  | "active" 
  | "completed" 
  | "cancelled" 
  | "paid" 
  | "partial" 
  | "draft" 
  | "published"
  | "scheduled"
  | "confirmed"
  | "in_progress"
  | "no_show"
  | "new"
  | "contacted"
  | "qualified"
  | "converted"
  | "lost"
  | "low_stock"
  | "in_stock"
  | "out_of_stock";

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  active: { label: "Active", className: "bg-green-100 text-green-800 border-green-200" },
  completed: { label: "Completed", className: "bg-green-100 text-green-800 border-green-200" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800 border-red-200" },
  paid: { label: "Paid", className: "bg-green-100 text-green-800 border-green-200" },
  partial: { label: "Partial", className: "bg-orange-100 text-orange-800 border-orange-200" },
  draft: { label: "Draft", className: "bg-gray-100 text-gray-800 border-gray-200" },
  published: { label: "Published", className: "bg-green-100 text-green-800 border-green-200" },
  scheduled: { label: "Scheduled", className: "bg-blue-100 text-blue-800 border-blue-200" },
  confirmed: { label: "Confirmed", className: "bg-primary/10 text-primary border-primary/20" },
  in_progress: { label: "In Progress", className: "bg-blue-100 text-blue-800 border-blue-200" },
  no_show: { label: "No Show", className: "bg-gray-100 text-gray-800 border-gray-200" },
  new: { label: "New", className: "bg-blue-100 text-blue-800 border-blue-200" },
  contacted: { label: "Contacted", className: "bg-purple-100 text-purple-800 border-purple-200" },
  qualified: { label: "Qualified", className: "bg-green-100 text-green-800 border-green-200" },
  converted: { label: "Converted", className: "bg-green-100 text-green-800 border-green-200" },
  lost: { label: "Lost", className: "bg-red-100 text-red-800 border-red-200" },
  low_stock: { label: "Low Stock", className: "bg-orange-100 text-orange-800 border-orange-200" },
  in_stock: { label: "In Stock", className: "bg-green-100 text-green-800 border-green-200" },
  out_of_stock: { label: "Out of Stock", className: "bg-red-100 text-red-800 border-red-200" },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, "_") as StatusType;
  const config = statusConfig[normalizedStatus] || {
    label: status,
    className: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <Badge
      variant="outline"
      className={cn(config.className, "capitalize", className)}
    >
      {config.label}
    </Badge>
  );
}
