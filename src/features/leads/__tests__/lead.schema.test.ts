import { describe, it, expect } from "vitest";
import { leadSchema } from "../schemas/lead.schema";

describe("leadSchema", () => {
  const validLead = {
    name: "Carlos Ramírez",
    email: "carlos@empresa.com",
    phone: "3001234567",
    company: "TechCorp",
    source: "instagram" as const,
    status: "Nuevo" as const,
    producto_interes: "Plan Empresarial",
    presupuesto: 500,
    notes: "",
  };

  it("valida un lead correcto", () => {
    const result = leadSchema.safeParse(validLead);
    expect(result.success).toBe(true);
  });

  it("rechaza email inválido", () => {
    const result = leadSchema.safeParse({ ...validLead, email: "no-es-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("email");
    }
  });

  it("rechaza nombre muy corto", () => {
    const result = leadSchema.safeParse({ ...validLead, name: "A" });
    expect(result.success).toBe(false);
  });

  it("rechaza fuente inválida", () => {
    const result = leadSchema.safeParse({ ...validLead, source: "Desconocida" });
    expect(result.success).toBe(false);
  });

  it("rechaza presupuesto negativo", () => {
    const result = leadSchema.safeParse({ ...validLead, presupuesto: -1 });
    expect(result.success).toBe(false);
  });

  it("acepta notas vacías (campo opcional)", () => {
    const result = leadSchema.safeParse({ ...validLead, notes: undefined });
    expect(result.success).toBe(true);
  });
});
