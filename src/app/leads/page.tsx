"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadFilters } from "@/features/leads/components/LeadFilters";
import { LeadsTable } from "@/features/leads/components/LeadsTable";
import { LeadsPagination } from "@/features/leads/components/LeadsPagination";
import { LeadDialog } from "@/features/leads/components/LeadDialog";
import { useLeadsStore } from "@/features/leads/store/leadsStore";

export default function LeadsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const totalLeads = useLeadsStore((s) => s.leads.length);

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Leads</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{totalLeads} leads registrados</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2 cursor-pointer">
          <Plus className="w-4 h-4" />
          Nuevo Lead
        </Button>
      </div>

      <LeadFilters />
      <LeadsTable />
      <LeadsPagination />

      <LeadDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
