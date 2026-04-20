import { Badge } from "@/components/ui/badge";
import { LeadStatus } from "../types/lead.types";
import { cn } from "@/lib/utils";

const statusStyles: Record<LeadStatus, string> = {
  Nuevo: "bg-blue-100 text-blue-700 border-blue-200",
  Contactado: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Calificado: "bg-green-100 text-green-700 border-green-200",
  Perdido: "bg-red-100 text-red-700 border-red-200",
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium", statusStyles[status])}
    >
      {status}
    </Badge>
  );
}
