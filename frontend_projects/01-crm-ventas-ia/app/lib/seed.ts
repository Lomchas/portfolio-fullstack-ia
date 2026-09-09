import type { Pipeline, User, AppSettings, Quote } from "./types";

export const seedUsers: User[] = [
  { id: "u-admin", name: "Daniel Losada", role: "admin", email: "admin@demo.com", avatarColor: "bg-sky-500" },
  { id: "u-gerente", name: "Carolina Méndez", role: "gerente", email: "gerente@demo.com", avatarColor: "bg-violet-500" },
  { id: "u-vend1", name: "Andrés Torres", role: "vendedor", email: "andres@demo.com", avatarColor: "bg-emerald-500" },
  { id: "u-vend2", name: "Lucía Paz", role: "vendedor", email: "lucia@demo.com", avatarColor: "bg-amber-500" }
];

export const seedPipelines: Pipeline[] = [
  {
    id: "p-smb", name: "Ventas SMB", description: "Ciclo corto pymes",
    stages: [
      { id: "s-nuevos", name: "Nuevos", color: "bg-sky-500/20 text-sky-300", probability: 10, order: 0 },
      { id: "s-contacto", name: "Contacto", color: "bg-cyan-500/20 text-cyan-300", probability: 25, order: 1 },
      { id: "s-negociacion", name: "En negociación", color: "bg-amber-500/20 text-amber-300", probability: 60, order: 2 },
      { id: "s-ganados", name: "Ganados", color: "bg-emerald-500/20 text-emerald-300", probability: 100, order: 3 }
    ]
  },
  {
    id: "p-enterprise", name: "Enterprise", description: "Ciclo largo corporativo",
    stages: [
      { id: "e-descubrimiento", name: "Descubrimiento", color: "bg-sky-500/20 text-sky-300", probability: 15, order: 0 },
      { id: "e-demo", name: "Demo / POC", color: "bg-violet-500/20 text-violet-300", probability: 40, order: 1 },
      { id: "e-propuesta", name: "Propuesta", color: "bg-amber-500/20 text-amber-300", probability: 65, order: 2 },
      { id: "e-cierre", name: "Cierre", color: "bg-emerald-500/20 text-emerald-300", probability: 100, order: 3 }
    ]
  },
  {
    id: "p-postventa", name: "Postventa / Upsell", description: "Expansión cuentas",
    stages: [
      { id: "pv-onboarding", name: "Onboarding", color: "bg-sky-500/20 text-sky-300", probability: 80, order: 0 },
      { id: "pv-upsell", name: "Upsell", color: "bg-amber-500/20 text-amber-300", probability: 50, order: 1 },
      { id: "pv-renovacion", name: "Renovación", color: "bg-emerald-500/20 text-emerald-300", probability: 100, order: 2 }
    ]
  }
];

export const seedSettings: AppSettings = {
  companyName: "Mi Empresa Demo",
  currency: "USD",
  lossReasons: ["Precio", "Competencia", "Sin presupuesto", "Timing", "Sin respuesta"],
  tags: ["retail", "salud", "urgente", "prioridad", "enterprise", "upsell"],
  activePipelineId: "p-smb",
  activeRole: "admin",
  activeUserId: "u-admin"
};

export function quoteTotal(q: Quote): number {
  const sub = q.items.reduce((s, it) => s + it.qty * it.price, 0);
  const withDisc = sub * (1 - q.discount / 100);
  return Math.round(withDisc * (1 + q.tax / 100) * 100) / 100;
}
