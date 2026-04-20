import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Lead, LeadFormValues, LeadStatus, LeadSource } from "../types/lead.types";
import { mockLeads } from "../data/mockLeads";

interface LeadFilters {
  search: string;
  status: LeadStatus | "Todos";
  source: LeadSource | "Todos";
  dateFrom: string;
  dateTo: string;
}

interface LeadsState {
  leads: Lead[];
  filters: LeadFilters;
  currentPage: number;
  pageSize: number;
  error: string | null;

  addLead: (values: LeadFormValues) => void;
  updateLead: (id: string, values: LeadFormValues) => void;
  deleteLead: (id: string) => void;
  setSearch: (search: string) => void;
  setStatusFilter: (status: LeadStatus | "Todos") => void;
  setSourceFilter: (source: LeadSource | "Todos") => void;
  setDateFrom: (date: string) => void;
  setDateTo: (date: string) => void;
  setCurrentPage: (page: number) => void;
  resetFilters: () => void;

  getFilteredLeads: () => Lead[];
  getPaginatedLeads: () => Lead[];
  getTotalPages: () => number;
}

const defaultFilters: LeadFilters = {
  search: "",
  status: "Todos",
  source: "Todos",
  dateFrom: "",
  dateTo: "",
};

export const useLeadsStore = create<LeadsState>()(
  persist(
    (set, get) => ({
      leads: mockLeads,
      filters: defaultFilters,
      currentPage: 1,
      pageSize: 8,
      error: null,

      addLead: (values) => {
        const newLead: Lead = {
          ...values,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ leads: [newLead, ...state.leads] }));
      },

      updateLead: (id, values) => {
        set((state) => ({
          leads: state.leads.map((lead) =>
            lead.id === id ? { ...lead, ...values } : lead
          ),
        }));
      },

      deleteLead: (id) => {
        set((state) => ({
          leads: state.leads.filter((lead) => lead.id !== id),
        }));
      },

      setSearch: (search) =>
        set((state) => ({ filters: { ...state.filters, search }, currentPage: 1 })),

      setStatusFilter: (status) =>
        set((state) => ({ filters: { ...state.filters, status }, currentPage: 1 })),

      setSourceFilter: (source) =>
        set((state) => ({ filters: { ...state.filters, source }, currentPage: 1 })),

      setDateFrom: (dateFrom) =>
        set((state) => ({ filters: { ...state.filters, dateFrom }, currentPage: 1 })),

      setDateTo: (dateTo) =>
        set((state) => ({ filters: { ...state.filters, dateTo }, currentPage: 1 })),

      setCurrentPage: (page) => set({ currentPage: page }),

      resetFilters: () => set({ filters: defaultFilters, currentPage: 1 }),

      getFilteredLeads: () => {
        const { leads, filters } = get();
        return leads
          .filter((lead) => {
            const matchesSearch =
              filters.search === "" ||
              lead.name.toLowerCase().includes(filters.search.toLowerCase()) ||
              lead.email.toLowerCase().includes(filters.search.toLowerCase()) ||
              lead.company.toLowerCase().includes(filters.search.toLowerCase());

            const matchesStatus =
              filters.status === "Todos" || lead.status === filters.status;

            const matchesSource =
              filters.source === "Todos" || lead.source === filters.source;

            const leadDate = new Date(lead.createdAt);
            const matchesDateFrom =
              filters.dateFrom === "" || leadDate >= new Date(filters.dateFrom);
            const matchesDateTo =
              filters.dateTo === "" || leadDate <= new Date(filters.dateTo + "T23:59:59");

            return matchesSearch && matchesStatus && matchesSource && matchesDateFrom && matchesDateTo;
          })
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getPaginatedLeads: () => {
        const { currentPage, pageSize } = get();
        const filtered = get().getFilteredLeads();
        const start = (currentPage - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
      },

      getTotalPages: () => {
        const { pageSize } = get();
        return Math.ceil(get().getFilteredLeads().length / pageSize);
      },
    }),
    {
      name: "omc-leads-storage",
      partialize: (state) => ({ leads: state.leads }),
    }
  )
);
