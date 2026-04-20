"use client";

import { Users, TrendingUp, CheckCircle, DollarSign, Clock } from "lucide-react";
import { StatsCard } from "@/features/dashboard/components/StatsCard";
import { LeadsBySourceChart } from "@/features/dashboard/components/LeadsBySourceChart";
import { LeadsByStatusChart } from "@/features/dashboard/components/LeadsByStatusChart";
import { useLeadsStore } from "@/features/leads/store/leadsStore";

export default function DashboardPage() {
  const leads = useLeadsStore((s) => s.leads);

  const total = leads.length;
  const calificados = leads.filter((l) => l.status === "Calificado").length;
  const conversionRate = total > 0 ? ((calificados / total) * 100).toFixed(1) : "0";

  const leadsConPresupuesto = leads.filter((l) => l.presupuesto !== null && l.presupuesto !== undefined);
  const avgPresupuesto =
    leadsConPresupuesto.length > 0
      ? Math.round(leadsConPresupuesto.reduce((acc, l) => acc + (l.presupuesto ?? 0), 0) / leadsConPresupuesto.length)
      : 0;

  const hace7dias = new Date();
  hace7dias.setDate(hace7dias.getDate() - 7);
  const leadsUltimos7dias = leads.filter((l) => new Date(l.createdAt) >= hace7dias).length;

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 md:p-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent" />
        <div className="relative">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-1">Panel de control</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Resumen general de <span className="text-indigo-400 font-medium">{total} leads</span> registrados
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Total Leads"
          value={total}
          description="Leads registrados"
          icon={Users}
          accentColor="bg-indigo-500"
          iconBg="bg-indigo-50 dark:bg-indigo-950/50"
          iconColor="text-indigo-600 dark:text-indigo-400"
        />
        <StatsCard
          title="Calificados"
          value={calificados}
          description="Listos para cerrar"
          icon={CheckCircle}
          accentColor="bg-emerald-500"
          iconBg="bg-emerald-50 dark:bg-emerald-950/50"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatsCard
          title="Conversión"
          value={`${conversionRate}%`}
          description="Calificados / Total"
          icon={TrendingUp}
          accentColor="bg-blue-500"
          iconBg="bg-blue-50 dark:bg-blue-950/50"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatsCard
          title="Presupuesto prom."
          value={`$${avgPresupuesto.toLocaleString()}`}
          description="Promedio en USD"
          icon={DollarSign}
          accentColor="bg-amber-500"
          iconBg="bg-amber-50 dark:bg-amber-950/50"
          iconColor="text-amber-600 dark:text-amber-400"
        />
        <StatsCard
          title="Últimos 7 días"
          value={leadsUltimos7dias}
          description="Leads recientes"
          icon={Clock}
          accentColor="bg-purple-500"
          iconBg="bg-purple-50 dark:bg-purple-950/50"
          iconColor="text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LeadsByStatusChart />
        <LeadsBySourceChart />
      </div>
    </div>
  );
}
