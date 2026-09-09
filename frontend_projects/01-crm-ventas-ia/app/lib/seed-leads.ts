import type { Lead } from "./types";
function iso(d: number): string {
  const x = new Date(); x.setDate(x.getDate() + d); return x.toISOString();
}
function past(d: number): string {
  const x = new Date(); x.setDate(x.getDate() - d); return x.toISOString();
}
export const seedLeads: Lead[] = [
  { id: "l-01", name: "Marcela Ríos", company: "Café Andino — 12 sedes", email: "compras@cafeandino.com", phone: "+57 300 111 2233", value: 4800, currency: "USD", pipelineId: "p-smb", stageId: "s-nuevos", status: "open", ownerId: "u-vend1", tags: ["retail", "urgente"], source: "Web", expectedClose: iso(14), createdAt: past(6), updatedAt: past(1) },
  { id: "l-02", name: "Jorge Patiño", company: "Logística RápidoYa", email: "jorge@rapidoYa.com", phone: "+57 310 222 3344", value: 9200, currency: "USD", pipelineId: "p-smb", stageId: "s-nuevos", status: "open", ownerId: "u-vend2", tags: ["logística"], source: "Referido", expectedClose: iso(21), createdAt: past(5), updatedAt: past(2) },
  { id: "l-03", name: "Ana Beltrán", company: "Clínica Santa Fe", email: "ana@santafe.com", phone: "+57 320 333 4455", value: 15000, currency: "USD", pipelineId: "p-smb", stageId: "s-negociacion", status: "open", ownerId: "u-vend1", tags: ["salud", "prioridad"], source: "LinkedIn", expectedClose: iso(7), createdAt: past(20), updatedAt: past(0) },
  { id: "l-04", name: "Diego Cruz", company: "Retail Moda Sur", email: "diego@modasur.com", phone: "+57 315 444 5566", value: 6400, currency: "USD", pipelineId: "p-smb", stageId: "s-negociacion", status: "open", ownerId: "u-vend2", tags: ["retail"], source: "Feria", expectedClose: iso(10), createdAt: past(12), updatedAt: past(3) },
  { id: "l-05", name: "Paola Mora", company: "Hotel Miramar", email: "paola@miramar.com", phone: "+57 301 555 6677", value: 11300, currency: "USD", pipelineId: "p-smb", stageId: "s-ganados", status: "won", ownerId: "u-vend1", tags: ["hospitality"], source: "Web", expectedClose: past(2), createdAt: past(40), updatedAt: past(2) },
  { id: "l-06", name: "Carlos Ruiz", company: "Banco Andino Digital", email: "carlos@bancoandino.com", phone: "+57 322 666 7788", value: 45000, currency: "USD", pipelineId: "p-enterprise", stageId: "e-descubrimiento", status: "open", ownerId: "u-gerente", tags: ["banca", "enterprise"], source: "Outbound", expectedClose: iso(60), createdAt: past(10), updatedAt: past(1) },
  { id: "l-07", name: "Sofía Lema", company: "EduTech Aprende+", email: "sofia@aprendeplus.com", phone: "+57 300 777 8899", value: 22000, currency: "USD", pipelineId: "p-enterprise", stageId: "e-demo", status: "open", ownerId: "u-vend1", tags: ["educación"], source: "Web", expectedClose: iso(30), createdAt: past(15), updatedAt: past(0) }
];
