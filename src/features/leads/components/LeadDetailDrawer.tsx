"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LeadStatusBadge } from "./LeadStatusBadge";
import { LeadDialog } from "./LeadDialog";
import { Lead } from "../types/lead.types";

const SOURCE_LABELS: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  landing_page: "Landing Page",
  referido: "Referido",
  otro: "Otro",
};

interface LeadDetailDrawerProps {
  lead: Lead | null;
  onClose: () => void;
}

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{label}</p>
      <p className="text-sm text-foreground mt-0.5">{value ?? <span className="text-muted-foreground/30">—</span>}</p>
    </div>
  );
}

export function LeadDetailDrawer({ lead, onClose }: LeadDetailDrawerProps) {
  const [editOpen, setEditOpen] = useState(false);

  if (!lead) return null;

  const createdAt = new Date(lead.createdAt).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Drawer open={!!lead} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="flex flex-row items-start justify-between gap-4 pb-3">
            <div>
              <DrawerTitle className="text-lg">{lead.name}</DrawerTitle>
              <p className="text-sm text-muted-foreground mt-0.5">{lead.email}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <LeadStatusBadge status={lead.status} />
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 cursor-pointer"
                onClick={() => setEditOpen(true)}
              >
                <Pencil className="w-3.5 h-3.5" />
                Editar
              </Button>
            </div>
          </DrawerHeader>

          <div className="px-4 pb-8 overflow-y-auto space-y-5">
            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <Field label="Teléfono" value={lead.phone || null} />
              <Field label="Empresa" value={lead.company} />
              <Field label="Fuente" value={SOURCE_LABELS[lead.source] ?? lead.source} />
              <Field label="Fecha de registro" value={createdAt} />
              <Field label="Producto de interés" value={lead.producto_interes || null} />
              <Field
                label="Presupuesto"
                value={lead.presupuesto != null ? `$${lead.presupuesto.toLocaleString()} USD` : null}
              />
            </div>

            {lead.notes && (
              <>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1.5">Notas</p>
                  <p className="text-sm text-foreground leading-relaxed">{lead.notes}</p>
                </div>
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      <LeadDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) onClose();
        }}
        lead={lead}
      />
    </>
  );
}
