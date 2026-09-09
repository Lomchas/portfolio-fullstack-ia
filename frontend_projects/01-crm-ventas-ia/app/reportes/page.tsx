"use client";
import { useCrm } from "../lib/store";
import { formatMoney } from "../lib/format";
import { Card } from "../components/ui";
import { FunnelChart } from "../components/Charts";

export default function ReportsPage() {
  const { state } = useCrm();
  if (!state.hydrated) return <p className="p-8 text-slate-400">Cargando…</p>;
  const pipe = state.pipelines.find((p) => p.id === state.settings.activePipelineId);
  const open = state.leads.filter((l) => l.status === "open" && l.pipelineId === state.settings.activePipelineId);
  const won = state.leads.filter((l) => l.status === "won");
  const funnel = (pipe?.stages ?? []).map((s) => ({ name: s.name, value: open.filter((l) => l.stageId === s.id).reduce((a, b) => a + b.value, 0), count: open.filter((l) => l.stageId === s.id).length }));
  return (
    <div>
      <h1 className="text-3xl font-bold">Reportes</h1>
      <p className="mt-1 text-sm text-slate-400">Funnel + KPIs del pipeline activo</p>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <Card><p className="text-xs text-slate-400">Abierto</p><p className="text-2xl font-bold text-sky-300">{formatMoney(open.reduce((s, l) => s + l.value, 0))}</p></Card>
        <Card><p className="text-xs text-slate-400">Leads</p><p className="text-2xl font-bold">{open.length}</p></Card>
        <Card><p className="text-xs text-slate-400">Ganados global</p><p className="text-2xl font-bold text-emerald-300">{formatMoney(won.reduce((s, l) => s + l.value, 0))}</p></Card>
        <Card><p className="text-xs text-slate-400">Tasa cierre</p><p className="text-2xl font-bold">{state.leads.length ? Math.round((won.length / state.leads.length) * 100) : 0}%</p></Card>
      </div>
      <Card className="mt-3"><p className="font-semibold">Funnel por etapa (valor $)</p><FunnelChart data={funnel} /></Card>
    </div>
  );
}
