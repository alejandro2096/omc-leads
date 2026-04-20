export type LeadSource = "instagram" | "facebook" | "landing_page" | "referido" | "otro";
export type LeadStatus = "Nuevo" | "Contactado" | "Calificado" | "Perdido";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: LeadSource;
  status: LeadStatus;
  producto_interes: string;
  presupuesto: number | null;
  notes: string;
  createdAt: string;
}

export type LeadFormValues = Omit<Lead, "id" | "createdAt">;
