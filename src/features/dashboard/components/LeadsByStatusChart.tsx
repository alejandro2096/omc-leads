"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useLeadsStore } from "@/features/leads/store/leadsStore";
import { LeadStatus } from "@/features/leads/types/lead.types";

const STATUS_COLORS: Record<LeadStatus, string> = {
  Nuevo: "#6366f1",
  Contactado: "#f59e0b",
  Calificado: "#10b981",
  Perdido: "#f43f5e",
};

export function LeadsByStatusChart() {
  const leads = useLeadsStore((s) => s.leads);

  const data = (["Nuevo", "Contactado", "Calificado", "Perdido"] as LeadStatus[]).map(
    (status) => ({
      name: status,
      total: leads.filter((l) => l.status === status).length,
      fill: STATUS_COLORS[status],
    })
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-900">Leads por Estado</p>
        <p className="text-xs text-gray-400 mt-0.5">Distribución del pipeline</p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barSize={36} barGap={8}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            width={24}
          />
          <Tooltip
            cursor={{ fill: "#f9fafb" }}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              fontSize: "12px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
            }}
            formatter={(value) => [`${value} leads`, "Total"]}
          />
          <Bar dataKey="total" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
