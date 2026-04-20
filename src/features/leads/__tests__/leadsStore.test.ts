import { describe, it, expect, beforeEach } from "vitest";
import { useLeadsStore } from "../store/leadsStore";

beforeEach(() => {
  useLeadsStore.setState({
    leads: [
      {
        id: "1",
        name: "Lead Test",
        email: "test@test.com",
        phone: "3001234567",
        company: "Empresa Test",
        source: "instagram",
        status: "Nuevo",
        producto_interes: "",
        presupuesto: null,
        notes: "",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Segundo Lead",
        email: "segundo@empresa.com",
        phone: "3009876543",
        company: "Segunda Empresa",
        source: "referido",
        status: "Calificado",
        producto_interes: "Plan Pro",
        presupuesto: 1000,
        notes: "",
        createdAt: new Date().toISOString(),
      },
    ],
    filters: { search: "", status: "Todos", source: "Todos", dateFrom: "", dateTo: "" },
    currentPage: 1,
  });
});

describe("leadsStore", () => {
  it("agrega un lead correctamente", () => {
    const { addLead, leads } = useLeadsStore.getState();
    const countBefore = leads.length;

    addLead({
      name: "Nuevo Lead",
      email: "nuevo@test.com",
      phone: "3001112233",
      company: "Nueva Empresa",
      source: "facebook",
      status: "Nuevo",
      producto_interes: "",
      presupuesto: null,
      notes: "",
    });

    expect(useLeadsStore.getState().leads.length).toBe(countBefore + 1);
  });

  it("elimina un lead por id", () => {
    const { deleteLead } = useLeadsStore.getState();
    deleteLead("1");
    const leads = useLeadsStore.getState().leads;
    expect(leads.find((l) => l.id === "1")).toBeUndefined();
  });

  it("actualiza un lead existente", () => {
    const { updateLead } = useLeadsStore.getState();
    updateLead("1", {
      name: "Lead Actualizado",
      email: "test@test.com",
      phone: "3001234567",
      company: "Empresa Test",
      source: "instagram",
      status: "Contactado",
      producto_interes: "",
      presupuesto: null,
      notes: "",
    });
    const lead = useLeadsStore.getState().leads.find((l) => l.id === "1");
    expect(lead?.name).toBe("Lead Actualizado");
    expect(lead?.status).toBe("Contactado");
  });

  it("filtra por búsqueda de texto", () => {
    const { setSearch, getFilteredLeads } = useLeadsStore.getState();
    setSearch("segundo@empresa.com");
    const filtered = getFilteredLeads();
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe("Segundo Lead");
  });

  it("filtra por estado", () => {
    const { setStatusFilter, getFilteredLeads } = useLeadsStore.getState();
    setStatusFilter("Calificado");
    const filtered = getFilteredLeads();
    expect(filtered.every((l) => l.status === "Calificado")).toBe(true);
  });

  it("resetea filtros correctamente", () => {
    const { setSearch, setStatusFilter, resetFilters } = useLeadsStore.getState();
    setSearch("algo");
    setStatusFilter("Perdido");
    resetFilters();
    const { filters: newFilters } = useLeadsStore.getState();
    expect(newFilters.search).toBe("");
    expect(newFilters.status).toBe("Todos");
  });
});
