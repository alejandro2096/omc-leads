"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LeadForm } from "./LeadForm";
import { LeadSchema } from "../schemas/lead.schema";
import { Lead } from "../types/lead.types";
import { useLeadsStore } from "../store/leadsStore";

interface LeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead;
}

export function LeadDialog({ open, onOpenChange, lead }: LeadDialogProps) {
  const { addLead, updateLead } = useLeadsStore();

  const handleSubmit = (values: LeadSchema) => {
    if (lead) {
      updateLead(lead.id, values);
    } else {
      addLead(values);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{lead ? "Editar Lead" : "Nuevo Lead"}</DialogTitle>
        </DialogHeader>
        <LeadForm
          defaultValues={lead}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
