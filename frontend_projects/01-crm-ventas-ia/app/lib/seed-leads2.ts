import type { Lead } from "./types";
function iso(d: number): string {
  const x = new Date(); x.setDate(x.getDate() + d); return x.toISOString();
}
function past(d: number): string {
  const x = new Date(); x.setDate(x.getDate() - d); return x.toISOString();
}
export const seedLeads2: Lead[] = [
  { id: "l-08", name: "Martín Vega", company: "Aseguradora Total", email: "martin@aseguradoratotal.com", phone: "+57 311 888 9900", value: 31000, currency: "USD", pipelineId: "p-enterprise", stageId: "e-propuesta", status: "open", ownerId: "u-gerente", tags: ["seguros"], source: "Partner", expectedClose: iso(18), createdAt: past(25), updatedAt: past(1) },
  { id: "l-09", name: "Laura Gil", company: "Supermercados El Ahorro", email: "laura@elahorro.com", phone: "+57 305 999 0011", value: 8700, currency: "USD", pipelineId: "p-smb", stageId: "s-contacto", status: "open", ownerId: "u-vend2", tags: ["retail"], source: "Llamada fría", expectedClose: iso(12), createdAt: past(4), updatedAt: past(0) },
  { id: "l-10", name: "Felipe Castro", company: "Constructora Vía Libre", email: "felipe@vialibre.com", phone: "+57 318 000 1122", value: 19800, currency: "USD", pipelineId: "p-smb", stageId: "s-contacto", status: "open", ownerId: "u-vend1", tags: ["construcción"], source: "Web", expectedClose: iso(-2), createdAt: past(9), updatedAt: past(4) },
  { id: "l-11", name: "Valeria Núñez", company: "Clínica Dental Sonrisa", email: "valeria@sonrisa.com", phone: "+57 316 111 2233", value: 5300, currency: "USD", pipelineId: "p-postventa", stageId: "pv-onboarding", status: "open", ownerId: "u-vend2", tags: ["salud"], source: "Cliente", expectedClose: iso(5), createdAt: past(30), updatedAt: past(2) },
  { id: "l-12", name: "Ricardo Sosa", company: "Hotel Miramar Upsell", email: "ricardo@miramar.com", phone: "+57 301 222 3344", value: 7200, currency: "USD", pipelineId: "p-postventa", stageId: "pv-upsell", status: "open", ownerId: "u-vend1", tags: ["hospitality", "upsell"], source: "Cliente", expectedClose: iso(9), createdAt: past(20), updatedAt: past(1) },
  { id: "l-13", name: "Elena Vidal", company: "Textiles del Sur", email: "elena@textilessur.com", phone: "+57 317 333 4455", value: 3900, currency: "USD", pipelineId: "p-smb", stageId: "s-nuevos", status: "lost", ownerId: "u-vend2", tags: ["manufactura"], source: "Web", expectedClose: past(5), createdAt: past(18), updatedAt: past(5), lostReason: "Precio" },
  { id: "l-14", name: "Hugo Díaz", company: "Farmacias Vida+", email: "hugo@vidamas.com", phone: "+57 312 444 5566", value: 7600, currency: "USD", pipelineId: "p-smb", stageId: "s-contacto", status: "open", ownerId: "u-vend1", tags: ["salud"], source: "Referido", expectedClose: iso(3), createdAt: past(3), updatedAt: past(0) }
];
