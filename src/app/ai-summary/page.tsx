"use client";

import { Sparkles, RefreshCw, Users, CheckCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useAISummary } from "@/features/ai-summary/hooks/useAISummary";
import { useLeadsStore } from "@/features/leads/store/leadsStore";

export default function AISummaryPage() {
  const leads = useLeadsStore((s) => s.leads);
  const { mutate: generateSummary, data: summary, isPending, error, reset } = useAISummary();

  const handleGenerate = () => {
    reset();
    generateSummary(leads);
  };

  const calificados = leads.filter((l) => l.status === "Calificado").length;
  const conversionRate =
    leads.length > 0
      ? ((calificados / leads.length) * 100).toFixed(1)
      : "0";

  const stats = [
    { label: "Leads analizados", value: leads.length, icon: Users, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/50" },
    { label: "Calificados", value: calificados, icon: CheckCircle, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/50" },
    { label: "Tasa de conversión", value: `${conversionRate}%`, icon: TrendingUp, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/50" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 rounded-2xl p-6 md:p-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-indigo-200" />
            <span className="text-indigo-200 text-sm font-medium">Powered by Groq AI</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">AI Summary</h1>
          <p className="text-indigo-200 text-sm mt-1">
            Análisis ejecutivo de tu pipeline generado con inteligencia artificial
          </p>
          <Button
            onClick={handleGenerate}
            disabled={isPending}
            className="mt-5 bg-white text-indigo-600 hover:bg-indigo-50 cursor-pointer font-semibold gap-2 shadow-md"
          >
            {isPending ? (
              <>
                <LoadingSpinner className="w-4 h-4 text-indigo-500" />
                Generando...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                {summary ? "Regenerar resumen" : "Generar resumen"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-card rounded-xl border border-border shadow-sm p-4">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Summary card */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <p className="text-sm font-semibold text-foreground">Análisis del Pipeline</p>
        </div>
        <div className="p-5 min-h-[180px] flex items-center justify-center">
          {!summary && !isPending && !error && (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-indigo-400" />
              </div>
              <p className="text-sm font-medium text-foreground">Tu resumen aparecerá aquí</p>
              <p className="text-xs text-muted-foreground mt-1">
                Haz clic en <span className="font-medium text-indigo-500">Generar resumen</span> para comenzar
              </p>
            </div>
          )}

          {isPending && (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <LoadingSpinner className="w-6 h-6 text-indigo-500" />
              </div>
              <p className="text-sm text-muted-foreground">Analizando {leads.length} leads del pipeline...</p>
            </div>
          )}

          {error && (
            <div className="w-full px-4 py-3 bg-rose-50 border border-rose-100 rounded-lg text-sm text-rose-600">
              {error.message}
            </div>
          )}

          {summary && !isPending && (
            <div className="w-full space-y-3">
              {summary.split("\n\n").filter(Boolean).map((paragraph, i) => (
                <p key={i} className="text-sm text-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
