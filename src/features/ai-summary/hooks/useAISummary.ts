import { useMutation } from "@tanstack/react-query";
import { Lead } from "@/features/leads/types/lead.types";

async function fetchAISummary(leads: Lead[]): Promise<string> {
  const response = await fetch("/api/ai-summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ leads }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error ?? "Error al generar el resumen");
  }

  const data = await response.json();
  return data.summary;
}

export function useAISummary() {
  return useMutation({
    mutationFn: fetchAISummary,
  });
}
