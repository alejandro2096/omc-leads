import Groq from "groq-sdk";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key no configurada" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const { leads } = body;

  if (!leads || !Array.isArray(leads)) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const total = leads.length;
  const byStatus = leads.reduce((acc: Record<string, number>, lead: { status: string }) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});
  const bySource = leads.reduce((acc: Record<string, number>, lead: { source: string }) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {});

  const prompt = `Eres un analista de ventas experto. Analiza estos datos de leads y genera un resumen ejecutivo en español, conciso y accionable (máximo 3 párrafos).

Datos del pipeline:
- Total de leads: ${total}
- Por estado: ${JSON.stringify(byStatus)}
- Por fuente: ${JSON.stringify(bySource)}

El resumen debe incluir:
1. Estado general del pipeline
2. Fuentes y estados con mejor rendimiento
3. Recomendaciones concretas para el equipo de ventas

Responde solo con el resumen ejecutivo, sin títulos ni markdown.`;

  try {
    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 512,
    });

    const summary = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ summary });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error al generar el resumen";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
