"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLeadsStore } from "../store/leadsStore";
import { LeadStatus, LeadSource } from "../types/lead.types";

const STATUSES: { value: LeadStatus | "Todos"; label: string }[] = [
  { value: "Todos", label: "Todos los estados" },
  { value: "Nuevo", label: "Nuevo" },
  { value: "Contactado", label: "Contactado" },
  { value: "Calificado", label: "Calificado" },
  { value: "Perdido", label: "Perdido" },
];

const SOURCES: { value: LeadSource | "Todos"; label: string }[] = [
  { value: "Todos", label: "Todas las fuentes" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "landing_page", label: "Landing Page" },
  { value: "referido", label: "Referido" },
  { value: "otro", label: "Otro" },
];

export function LeadFilters() {
  const { filters, setSearch, setStatusFilter, setSourceFilter, setDateFrom, setDateTo, resetFilters } =
    useLeadsStore();

  const hasActiveFilters =
    filters.search !== "" ||
    filters.status !== "Todos" ||
    filters.source !== "Todos" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre, email o empresa..."
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 cursor-text"
          />
        </div>

        {/* Estado */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide px-1">Estado</span>
          <Select
            value={filters.status}
            onValueChange={(v) => setStatusFilter(v as LeadStatus | "Todos")}
          >
            <SelectTrigger className="w-40 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value} className="cursor-pointer">
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fuente */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide px-1">Fuente</span>
          <Select
            value={filters.source}
            onValueChange={(v) => setSourceFilter(v as LeadSource | "Todos")}
          >
            <SelectTrigger className="w-44 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SOURCES.map((s) => (
                <SelectItem key={s.value} value={s.value} className="cursor-pointer">
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="gap-1.5 cursor-pointer self-end"
          >
            <X className="w-3.5 h-3.5" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Date range */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-0.5">
          <Label className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
            Desde
          </Label>
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-40 cursor-pointer text-sm"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <Label className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
            Hasta
          </Label>
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-40 cursor-pointer text-sm"
          />
        </div>
      </div>
    </div>
  );
}
