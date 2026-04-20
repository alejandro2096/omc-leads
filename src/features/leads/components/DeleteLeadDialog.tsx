"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLeadsStore } from "../store/leadsStore";

interface DeleteLeadDialogProps {
  leadId: string | null;
  leadName: string;
  onClose: () => void;
}

export function DeleteLeadDialog({
  leadId,
  leadName,
  onClose,
}: DeleteLeadDialogProps) {
  const deleteLead = useLeadsStore((s) => s.deleteLead);

  const handleConfirm = () => {
    if (leadId) deleteLead(leadId);
    onClose();
  };

  return (
    <AlertDialog open={!!leadId} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar lead?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente el
            lead <span className="font-semibold text-gray-900">{leadName}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
