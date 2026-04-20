"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useLeadsStore } from "@/features/leads/store/leadsStore";
import { LeadSource } from "@/features/leads/types/lead.types";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#14b8a6"];

const SOURCES: LeadSource[] = ["instagram", "facebook", "landing_page", "referido", "otro"];

const SOURCE_LABELS: Record<LeadSource, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  landing_page: "Landing Page",
  referido: "Referido",
  otro: "Otro",
};

export function LeadsBySourceChart() {
  const leads = useLeadsStore((s) => s.leads);

  const data = SOURCES
    .map((source, i) => ({
      name: SOURCE_LABELS[source],
      value: leads.filter((l) => l.source === source).length,
      color: COLORS[i],
    }))
    .filter((d) => d.value > 0);

  const total = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-900">Leads por Fuente</p>
        <p className="text-xs text-gray-400 mt-0.5">Origen de los leads</p>
      </div>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "12px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
              }}
              formatter={(value) => [`${value} leads`, ""]}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="space-y-2 shrink-0">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-gray-600">{entry.name}</span>
              <span className="text-xs font-semibold text-gray-900 ml-auto pl-3">
                {total > 0 ? Math.round((entry.value / total) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
