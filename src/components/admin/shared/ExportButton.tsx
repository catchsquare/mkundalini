import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet } from "lucide-react";

interface ExportButtonProps {
  onExport: () => void;
  disabled?: boolean;
  label?: string;
}

export function ExportButton({
  onExport,
  disabled = false,
  label = "Export CSV",
}: ExportButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onExport}
      disabled={disabled}
    >
      <Download className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
}

interface ExportDropdownProps {
  onExportCSV: () => void;
  onExportFiltered?: () => void;
  disabled?: boolean;
}

export function ExportDropdown({
  onExportCSV,
  onExportFiltered,
  disabled = false,
}: ExportDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onExportCSV}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export All (CSV)
        </DropdownMenuItem>
        {onExportFiltered && (
          <DropdownMenuItem onClick={onExportFiltered}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export Filtered (CSV)
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
