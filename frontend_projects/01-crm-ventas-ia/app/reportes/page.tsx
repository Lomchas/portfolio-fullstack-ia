"use client";
import { useCrm } from "../lib/store";
import { formatMoney } from "../lib/format";
import { Card } from "../components/ui";

export default function ReportsPage() {
  const { state } = useCrm();
  if (!state.hydrated) return <p className="p-8 text-slate-400">Cargando…</p>;
  const open = state.leads.filter((l) => l.status === "open");
  const won = state.leads.filter((l) => l.status === "won");
  const total = open.reduce((s, l) => s + l.value, 0);
  const wonTotal = won.reduce((s, l) => s + l.value, 0);
  return (
    <div>
      <h1 className="text-3xl font-bold">Reportes</h1>
      <p className="mt-1 text-sm text-slate-400">KPIs base. (Gráficos recharts en Lote F)</p>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <Card><p className="text-xs text-slate-400">Pipeline abierto</p><p className="text-2xl font-bold text-sky-300">{formatMoney(total)}</p></Card>
        <Card><p className="text-xs text-slate-400">Leads abiertos</p><p className="text-2xl font-bold">{open.length}</p></Card>
        <Card><p className="text-xs text-slate-400">Ganados</p><p className="text-2xl font-bold text-emerald-300">{formatMoney(wonTotal)}</p></Card>
        <Card><p className="text-xs text-slate-400">Tasa cierre</p><p className="text-2xl font-bold">{state.leads.length ? Math.round((won.length / state.leads.length) * 100) : 0}%</p></Card>
      </div>
    </div>
  );
}
