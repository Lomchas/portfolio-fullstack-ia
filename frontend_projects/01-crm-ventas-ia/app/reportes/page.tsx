"use client";
import { useCrm } from "../lib/store";
import { formatMoney } from "../lib/format";
import { Card } from "../components/ui";
import { FunnelChart } from "../components/Charts";

export default function ReportsPage() {
  const { state } = useCrm();
  if (!state.hydrated) return <p className="p-8 text-slate-400">Cargando…</p>;
  const currency = state.settings.currency;
  const pipe = state.pipelines.find((p) => p.id === state.settings.activePipelineId);
  const pipeLeads = state.leads.filter((l) => l.pipelineId === state.settings.activePipelineId);
  const open = pipeLeads.filter((l) => l.status === "open");
  const won = pipeLeads.filter((l) => l.status === "won");
  const lost = pipeLeads.filter((l) => l.status === "lost");
  const closed = won.length + lost.length;
  const winRate = closed ? Math.round((won.length / closed) * 100) : 0;
  const avgTicket = won.length ? won.reduce((s, l) => s + l.value, 0) / won.length : 0;
  const leadIds = new Set(pipeLeads.map((l) => l.id));
  const today = new Date().toISOString().slice(0, 10);
  const pending = state.activities.filter((a) => leadIds.has(a.leadId) && !a.done);
  const overdue = pending.filter((a) => a.date.slice(0, 10) < today).length;
  const funnel = (pipe?.stages ?? [])
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((s) => ({ name: s.name, value: open.filter((l) => l.stageId === s.id).reduce((a, b) => a + b.value, 0), count: open.filter((l) => l.stageId === s.id).length }));
  return (
    <div>
      <h1 className="text-3xl font-bold">Reportes</h1>
      <p className="mt-1 text-sm text-slate-400">Funnel + KPIs del pipeline activo ({pipe?.name ?? "—"})</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Card><p className="text-xs text-slate-400">Abierto</p><p className="text-2xl font-bold text-sky-300">{formatMoney(open.reduce((s, l) => s + l.value, 0), currency)}</p></Card>
        <Card><p className="text-xs text-slate-400">Leads abiertos</p><p className="text-2xl font-bold">{open.length}</p></Card>
        <Card><p className="text-xs text-slate-400">Ganados</p><p className="text-2xl font-bold text-emerald-300">{formatMoney(won.reduce((s, l) => s + l.value, 0), currency)}</p></Card>
        <Card><p className="text-xs text-slate-400">Tasa de cierre</p><p className="text-2xl font-bold">{winRate}%</p><p className="mt-1 text-[11px] text-slate-500">{won.length} ganados / {lost.length} perdidos</p></Card>
        <Card><p className="text-xs text-slate-400">Ticket medio ganado</p><p className="text-2xl font-bold">{formatMoney(Math.round(avgTicket), currency)}</p></Card>
        <Card><p className="text-xs text-slate-400">Actividades vencidas</p><p className="text-2xl font-bold text-red-300">{overdue}</p><p className="mt-1 text-[11px] text-slate-500">{pending.length} pendientes en total</p></Card>
      </div>
      <Card className="mt-3"><p className="font-semibold">Funnel por etapa (valor $)</p><FunnelChart data={funnel} /></Card>
    </div>
  );
}
