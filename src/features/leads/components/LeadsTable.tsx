"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LeadStatusBadge } from "./LeadStatusBadge";
import { LeadDialog } from "./LeadDialog";
import { DeleteLeadDialog } from "./DeleteLeadDialog";
import { LeadDetailDrawer } from "./LeadDetailDrawer";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useLeads, SortKey } from "../hooks/useLeads";
import { Lead } from "../types/lead.types";

const SOURCE_LABELS: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  landing_page: "Landing Page",
  referido: "Referido",
  otro: "Otro",
};

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: "asc" | "desc" }) {
  if (col !== sortKey) return <ArrowUpDown className="w-3 h-3 ml-1 text-muted-foreground/40" />;
  return sortDir === "asc"
    ? <ArrowUp className="w-3 h-3 ml-1 text-foreground" />
    : <ArrowDown className="w-3 h-3 ml-1 text-foreground" />;
}

function SortableHead({ label, col, sortKey, sortDir, onSort }: {
  label: string;
  col: SortKey;
  sortKey: SortKey;
  sortDir: "asc" | "desc";
  onSort: (key: SortKey) => void;
}) {
  return (
    <TableHead
      className="cursor-pointer select-none whitespace-nowrap"
      onClick={() => onSort(col)}
    >
      <span className="inline-flex items-center gap-0.5">
        {label}
        <SortIcon col={col} sortKey={sortKey} sortDir={sortDir} />
      </span>
    </TableHead>
  );
}

export function LeadsTable() {
  const { paginatedLeads, sortKey, sortDir, handleSort } = useLeads();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [detailLead, setDetailLead] = useState<Lead | null>(null);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (paginatedLeads.length === 0) return <EmptyState />;

  return (
    <>
      <div className="border border-border rounded-lg overflow-x-auto bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <SortableHead label="Nombre" col="name" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <SortableHead label="Email" col="email" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <SortableHead label="Teléfono" col="phone" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <SortableHead label="Fuente" col="source" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <TableHead>Producto</TableHead>
              <SortableHead label="Presupuesto" col="presupuesto" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <SortableHead label="Estado" col="status" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <SortableHead label="Fecha" col="createdAt" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLeads.map((lead) => (
              <TableRow
                key={lead.id}
                className="cursor-pointer"
                onClick={() => setDetailLead(lead)}
              >
                <TableCell className="font-medium">
                  <div>
                    <p className="text-foreground">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.company}</p>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{lead.email}</TableCell>
                <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                  {lead.phone || <span className="text-muted-foreground/30">—</span>}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {SOURCE_LABELS[lead.source] ?? lead.source}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-[120px] truncate">
                  {lead.producto_interes || <span className="text-muted-foreground/30">—</span>}
                </TableCell>
                <TableCell className="text-foreground text-sm font-medium">
                  {lead.presupuesto != null
                    ? `$${lead.presupuesto.toLocaleString()}`
                    : <span className="text-muted-foreground/30">—</span>}
                </TableCell>
                <TableCell>
                  <LeadStatusBadge status={lead.status} />
                </TableCell>
                <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                  {new Date(lead.createdAt).toLocaleDateString("es-CO", {
                    day: "2-digit", month: "short", year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 cursor-pointer"
                      onClick={() => setEditLead(lead)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      onClick={() => setDeleteTarget({ id: lead.id, name: lead.name })}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <LeadDetailDrawer lead={detailLead} onClose={() => setDetailLead(null)} />

      <LeadDialog
        open={!!editLead}
        onOpenChange={(open) => !open && setEditLead(null)}
        lead={editLead ?? undefined}
      />

      <DeleteLeadDialog
        leadId={deleteTarget?.id ?? null}
        leadName={deleteTarget?.name ?? ""}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}
