# OMC Leads

Aplicación frontend para gestionar leads de One Million Copy SAS. Permite visualizar, filtrar y administrar leads desde distintos embudos de marketing, con dashboard de estadísticas y resumen ejecutivo generado con IA.

## Demo

> URL de deploy disponible tras el despliegue en Vercel.

## Tecnologías elegidas

| Categoría | Tecnología | Razón |
|-----------|------------|-------|
| Framework | Next.js 16 + TypeScript | App Router para API routes seguras (clave para no exponer la API key de IA). Deploy en Vercel trivial. |
| Styling | Tailwind CSS v4 + Shadcn/ui | Velocidad máxima de desarrollo con calidad visual alta y accesibilidad incluida. |
| Estado global | Zustand + persist | Sin boilerplate. El middleware `persist` resuelve el bonus de localStorage automáticamente. |
| Async state | TanStack Query | Usado exclusivamente para el AI Summary — manejo de loading/error/retry limpio. |
| Formularios | React Hook Form + Zod | El estándar del ecosistema. Inferencia de tipos desde el schema al formulario sin duplicar lógica. |
| Charts | Recharts | Ligero, nativo de React, suficiente para las gráficas requeridas. |
| IA | Groq API (llama-3.1-8b-instant) | Free tier real y generoso. Integración real vía API route de Next.js — la key nunca se expone al cliente. |
| Tests | Vitest + React Testing Library | Cobertura de schema, store y componente. |
| Package manager | pnpm | Instalación rápida, estricto con phantom dependencies. |

## Requisitos previos

- Node.js >= 20.9.0 (recomendado: v22)
- pnpm >= 9

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd omc-leads

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tu API key de Groq
```

## Variables de entorno

```env
GROQ_API_KEY=your_groq_api_key_here
```

Obtén tu API key gratuita en [console.groq.com](https://console.groq.com).

## Cómo correr el proyecto

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Cómo probar la aplicación

```bash
# Correr todos los tests
pnpm test

# Tests en modo watch
pnpm test:watch
```

**Tests incluidos (15 tests, 3 archivos):**
- `lead.schema.test.ts` — Validaciones Zod del formulario
- `leadsStore.test.ts` — CRUD y filtros del store Zustand
- `StatsCard.test.tsx` — Render del componente de métricas

## Datos mock

La app usa **datos embebidos** (Opción C del enunciado). Los leads de ejemplo se encuentran en:

```
src/features/leads/data/mockLeads.ts
```

Son 15 leads precargados con todos los campos requeridos. Al crear, editar o eliminar leads, los cambios se persisten en `localStorage` gracias al middleware `persist` de Zustand. Al recargar la página, el estado se restaura automáticamente.

## Estructura de carpetas

```
src/
├── app/                        # Next.js App Router
│   ├── leads/page.tsx          # Vista principal de leads
│   ├── dashboard/page.tsx      # Dashboard y estadísticas
│   ├── ai-summary/page.tsx     # Resumen con IA
│   ├── api/ai-summary/route.ts # API route → Groq (server-side)
│   ├── layout.tsx
│   └── providers.tsx
│
├── features/                   # Lógica por dominio (feature-based)
│   ├── leads/
│   │   ├── components/         # LeadsTable, LeadForm, LeadDialog, LeadDetailDrawer...
│   │   ├── hooks/              # useLeads (filtros + paginación con useMemo)
│   │   ├── store/              # Zustand store con persist
│   │   ├── schemas/            # Zod schema
│   │   ├── types/              # TypeScript types
│   │   └── data/               # Mock leads
│   ├── dashboard/
│   │   └── components/         # StatsCard, LeadsByStatusChart, LeadsBySourceChart
│   └── ai-summary/
│       ├── components/
│       └── hooks/              # useAISummary (TanStack Query mutation)
│
├── components/
│   ├── ui/                     # Shadcn/ui (auto-generado)
│   ├── layout/                 # Sidebar responsive
│   └── shared/                 # EmptyState, LoadingSpinner
│
└── lib/
    └── utils.ts
```

## Decisiones técnicas relevantes

- **API key segura**: la key de Groq vive en `.env.local` y se consume únicamente desde `app/api/ai-summary/route.ts` (server-side). Nunca se expone al bundle del cliente.
- **Sin backend**: 100% frontend según el enunciado. Los datos se gestionan con Zustand + localStorage.
- **Filtros con useMemo**: se evitó llamar funciones dentro de selectores de Zustand para prevenir re-renders infinitos. Los filtros y la paginación se calculan con `useMemo` en el hook `useLeads`.
- **Orden por fecha**: los leads se ordenan automáticamente por `createdAt` descendente (más recientes primero) por defecto.
- **Sorting interactivo**: los encabezados de la tabla son clickeables para ordenar por cualquier columna (nombre, email, fuente, presupuesto, estado, fecha) de forma ascendente o descendente.
- **Dark mode**: implementado con `next-themes`. Respeta la preferencia del sistema por defecto y tiene toggle en el sidebar. Los colores usan tokens semánticos de Shadcn/ui para adaptarse automáticamente.
