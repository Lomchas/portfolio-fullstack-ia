import type { Activity, Quote } from "./types";
function iso(d: number): string {
  const x = new Date(); x.setDate(x.getDate() + d); return x.toISOString();
}
function past(d: number): string {
  const x = new Date(); x.setDate(x.getDate() - d); return x.toISOString();
}
export const seedActivities: Activity[] = [
  { id: "a-01", leadId: "l-03", type: "reunion", title: "Demo con gerente", detail: "Interés alto en cotizaciones.", date: past(0), done: true, createdBy: "u-vend1" },
  { id: "a-02", leadId: "l-03", type: "tarea", title: "Enviar propuesta final", detail: "Incluir descuento volumen.", date: iso(1), done: false, reminder: iso(1), createdBy: "u-vend1" },
  { id: "a-03", leadId: "l-01", type: "llamada", title: "Llamada discovery", detail: "12 sedes, decisora Marcela.", date: past(1), done: true, createdBy: "u-vend1" },
  { id: "a-04", leadId: "l-10", type: "email", title: "Seguimiento vencido", detail: "No responde hace 4 días.", date: past(4), done: false, reminder: past(1), createdBy: "u-vend1" },
  { id: "a-05", leadId: "l-04", type: "whatsapp", title: "Enviar catálogo", detail: "Pidió precios por WhatsApp.", date: iso(0), done: false, reminder: iso(0), createdBy: "u-vend2" }
];
export const seedQuotes: Quote[] = [
  {
    id: "q-01", leadId: "l-03", number: "COT-2026-001",
    items: [
      { id: "qi-01", description: "Licencias CRM (10 usuarios x 12 meses)", qty: 10, price: 490 },
      { id: "qi-02", description: "Onboarding + migración", qty: 1, price: 2900 },
      { id: "qi-03", description: "Integración WhatsApp + IA", qty: 1, price: 3200 }
    ],
    discount: 10, tax: 19, status: "enviada",
    notes: "Válida 15 días. Incluye soporte.",
    createdAt: past(2), validUntil: iso(13)
  },
  {
    id: "q-02", leadId: "l-01", number: "COT-2026-002",
    items: [
      { id: "qi-04", description: "Licencias CRM (12 sedes)", qty: 12, price: 290 },
      { id: "qi-05", description: "Capacitación fuerza de ventas", qty: 1, price: 900 }
    ],
    discount: 5, tax: 19, status: "borrador",
    notes: "Borrador inicial.",
    createdAt: past(1), validUntil: iso(14)
  }
];
