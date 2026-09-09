import type { Activity, Lead } from "./types";

function daysBetween(a: Date, b: Date): number {
  return Math.floor((a.getTime() - b.getTime()) / 86400000);
}

// Mock inteligente local. En Fase 2 se cambia el interior por fetch a /api/ai con OpenAI.
export function scoreLead(lead: Lead, activities: Activity[]): { score: number; reasons: string[] } {
  let score = 50;
  const reasons: string[] = [];
  if (lead.value >= 20000) { score += 12; reasons.push("Ticket alto (+12)"); }
  else if (lead.value >= 8000) { score += 7; reasons.push("Ticket medio-alto (+7)"); }
  else if (lead.value < 4000) { score -= 5; reasons.push("Ticket bajo (-5)"); }

  const recent = activities.filter((a) => a.leadId === lead.id && daysBetween(new Date(), new Date(a.date)) <= 7);
  if (recent.length >= 2) { score += 10; reasons.push("Actividad reciente alta (+10)"); }
  else if (recent.length === 0) { score -= 10; reasons.push("Sin actividad 7 días (-10)"); }

  const daysToClose = daysBetween(new Date(lead.expectedClose), new Date());
  if (daysToClose < 0) { score -= 12; reasons.push("Cierre vencido (-12)"); }
  else if (daysToClose <= 7) { score += 6; reasons.push("Cierre esta semana (+6)"); }

  if (lead.tags.includes("prioridad") || lead.tags.includes("urgente")) { score += 5; reasons.push("Tag prioritario (+5)"); }
  if (lead.status === "lost") { score = 5; reasons.push("Perdido"); }
  if (lead.status === "won") { score = 98; reasons.push("Ganado"); }

  score = Math.max(5, Math.min(98, score));
  return { score, reasons };
}

export function suggestNextAction(lead: Lead, activities: Activity[]): string {
  const pending = activities.filter((a) => a.leadId === lead.id && !a.done);
  if (pending.length > 0) return `Retomar: ${pending[0].title} (${pending[0].type})`;
  const daysToClose = daysBetween(new Date(lead.expectedClose), new Date());
  if (daysToClose < 0) return "Reactivar con llamada + nueva fecha de cierre";
  if (lead.value >= 15000) return "Agendar demo con decisor + propuesta formal";
  return "Enviar seguimiento por WhatsApp + correo";
}

export function generateEmail(lead: Lead, tone: "formal" | "cercano" = "cercano"): string {
  const hi = tone === "formal" ? `Estimado/a ${lead.name}:` : `Hola ${lead.name},`;
  return `${hi}\n\nTe escribo por la propuesta para ${lead.company} por $${lead.value.toLocaleString()} ${lead.currency}.\n\nResumen: podemos ayudarte a ordenar tu pipeline, automatizar seguimientos y generar cotizaciones en minutos con IA.\n\n¿Te sirve una llamada de 20 min esta semana para mostrarte cómo quedaría para tu equipo?\n\nSaludos,\nEquipo Comercial`;
}

export function generateWhatsApp(lead: Lead): string {
  return `Hola ${lead.name} 👋 Soy del equipo comercial. Te preparé una propuesta para ${lead.company} ($${lead.value.toLocaleString()}). ¿Te la comparto por aquí + una demo de 15 min?`;
}

export function summarizeLead(lead: Lead, activities: Activity[]): string {
  const done = activities.filter((a) => a.leadId === lead.id && a.done).length;
  const pending = activities.filter((a) => a.leadId === lead.id && !a.done).length;
  return `${lead.company}: ${lead.name}, ticket $${lead.value.toLocaleString()}, etapa ${lead.stageId}, ${done} actividades hechas, ${pending} pendientes. Fuente: ${lead.source}. Cierre esperado ${new Date(lead.expectedClose).toLocaleDateString()}.`;
}
