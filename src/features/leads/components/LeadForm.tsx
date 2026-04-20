"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema, LeadSchema } from "../schemas/lead.schema";
import { Lead } from "../types/lead.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SOURCES = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "landing_page", label: "Landing Page" },
  { value: "referido", label: "Referido" },
  { value: "otro", label: "Otro" },
];

const STATUSES = ["Nuevo", "Contactado", "Calificado", "Perdido"];

interface LeadFormProps {
  defaultValues?: Partial<Lead>;
  onSubmit: (values: LeadSchema) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function LeadForm({ defaultValues, onSubmit, onCancel, isSubmitting }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LeadSchema>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(leadSchema) as any,
    defaultValues: {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      phone: defaultValues?.phone ?? "",
      company: defaultValues?.company ?? "",
      source: defaultValues?.source,
      status: defaultValues?.status,
      producto_interes: defaultValues?.producto_interes ?? "",
      presupuesto: defaultValues?.presupuesto ?? null,
      notes: defaultValues?.notes ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nombre *</Label>
          <Input id="name" {...register("name")} placeholder="Juan Pérez" />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" {...register("email")} placeholder="juan@empresa.com" />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" {...register("phone")} placeholder="3001234567" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="company">Empresa *</Label>
          <Input id="company" {...register("company")} placeholder="Empresa S.A.S" />
          {errors.company && <p className="text-xs text-red-500">{errors.company.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Fuente *</Label>
          <Controller
            name="source"
            control={control}
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {SOURCES.map((s) => (
                    <SelectItem key={s.value} value={s.value} className="cursor-pointer">
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.source && <p className="text-xs text-red-500">{errors.source.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Estado *</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="cursor-pointer">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="producto_interes">Producto de interés</Label>
          <Input id="producto_interes" {...register("producto_interes")} placeholder="Ej: Plan Empresarial" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="presupuesto">Presupuesto (USD)</Label>
          <Input
            id="presupuesto"
            type="number"
            min={0}
            step={0.01}
            placeholder="0.00"
            {...register("presupuesto", {
              setValueAs: (v) => (v === "" || v === null ? null : Number(v)),
            })}
          />
          {errors.presupuesto && <p className="text-xs text-red-500">{errors.presupuesto.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notas</Label>
        <Textarea
          id="notes"
          {...register("notes")}
          placeholder="Notas adicionales sobre el lead..."
          rows={3}
        />
        {errors.notes && <p className="text-xs text-red-500">{errors.notes.message}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="cursor-pointer">
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
          {isSubmitting ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  );
}
