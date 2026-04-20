import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Ingresa un email válido"),
  phone: z.string().optional().default(""),
  company: z.string().min(2, "El nombre de la empresa es requerido"),
  source: z.enum(["instagram", "facebook", "landing_page", "referido", "otro"], "Selecciona una fuente"),
  status: z.enum(["Nuevo", "Contactado", "Calificado", "Perdido"], "Selecciona un estado"),
  producto_interes: z.string().optional().default(""),
  presupuesto: z
    .union([z.number().min(0, "El presupuesto debe ser mayor o igual a 0"), z.null()])
    .optional()
    .nullable()
    .default(null),
  notes: z.string().max(500, "Las notas no pueden superar 500 caracteres").optional().default(""),
});

export type LeadSchema = z.infer<typeof leadSchema>;
