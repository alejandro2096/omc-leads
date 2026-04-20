"use client";

import { useMemo, useState } from "react";
import { useLeadsStore } from "../store/leadsStore";
import { Lead } from "../types/lead.types";

export type SortKey = keyof Pick<Lead, "name" | "email" | "phone" | "source" | "status" | "presupuesto" | "createdAt">;
export type SortDir = "asc" | "desc";

function compareLeads(a: Lead, b: Lead, key: SortKey, dir: SortDir): number {
  let valA = a[key];
  let valB = b[key];

  if (valA === null || valA === undefined) return 1;
  if (valB === null || valB === undefined) return -1;

  if (key === "createdAt") {
    valA = new Date(valA as string).getTime() as never;
    valB = new Date(valB as string).getTime() as never;
  }

  const result = valA < valB ? -1 : valA > valB ? 1 : 0;
  return dir === "asc" ? result : -result;
}

export function useLeads() {
  const leads = useLeadsStore((s) => s.leads);
  const search = useLeadsStore((s) => s.filters.search);
  const statusFilter = useLeadsStore((s) => s.filters.status);
  const sourceFilter = useLeadsStore((s) => s.filters.source);
  const dateFrom = useLeadsStore((s) => s.filters.dateFrom);
  const dateTo = useLeadsStore((s) => s.filters.dateTo);
  const currentPage = useLeadsStore((s) => s.currentPage);
  const pageSize = useLeadsStore((s) => s.pageSize);

  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filteredLeads = useMemo(
    () =>
      leads
        .filter((lead) => {
          const matchesSearch =
            search === "" ||
            lead.name.toLowerCase().includes(search.toLowerCase()) ||
            lead.email.toLowerCase().includes(search.toLowerCase()) ||
            lead.company.toLowerCase().includes(search.toLowerCase());
          const matchesStatus =
            statusFilter === "Todos" || lead.status === statusFilter;
          const matchesSource =
            sourceFilter === "Todos" || lead.source === sourceFilter;
          const leadDate = new Date(lead.createdAt);
          const matchesDateFrom =
            dateFrom === "" || leadDate >= new Date(dateFrom);
          const matchesDateTo =
            dateTo === "" || leadDate <= new Date(dateTo + "T23:59:59");
          return matchesSearch && matchesStatus && matchesSource && matchesDateFrom && matchesDateTo;
        })
        .sort((a, b) => compareLeads(a, b, sortKey, sortDir)),
    [leads, search, statusFilter, sourceFilter, dateFrom, dateTo, sortKey, sortDir]
  );

  const totalPages = Math.ceil(filteredLeads.length / pageSize);

  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage, pageSize]);

  return {
    paginatedLeads,
    filteredLeads,
    totalPages,
    totalItems: filteredLeads.length,
    currentPage,
    pageSize,
    sortKey,
    sortDir,
    handleSort,
  };
}
