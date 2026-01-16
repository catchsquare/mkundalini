import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Construction } from "lucide-react";
import { Link } from "react-router-dom";

interface AdminPlaceholderProps {
  title: string;
  description?: string;
}

export function AdminPlaceholder({ title, description }: AdminPlaceholderProps) {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground">
            {description || "This module is under development"}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/admin">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Placeholder content */}
      <Card className="border-dashed">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Construction className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground max-w-md mx-auto">
            This module is currently being developed. Check back soon for full functionality.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button variant="outline" asChild>
              <Link to="/admin">Go to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Module status indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <div>
                <p className="font-medium text-sm">Database Ready</p>
                <p className="text-xs text-muted-foreground">Tables configured</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div>
                <p className="font-medium text-sm">UI In Progress</p>
                <p className="text-xs text-muted-foreground">Building interface</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-muted border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-muted-foreground/50" />
              <div>
                <p className="font-medium text-sm">Features Pending</p>
                <p className="text-xs text-muted-foreground">Coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
