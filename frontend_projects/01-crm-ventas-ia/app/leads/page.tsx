"use client";
import { useMemo, useState } from "react";
import { useCrm } from "../lib/store";
import { scoreLead } from "../lib/ai";
import { formatDate, formatMoney } from "../lib/format";
import { Badge, Input, ScoreBadge } from "../components/ui";

export default function LeadsPage() {
  const { state } = useCrm();
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    let l = state.leads.filter((x) => x.pipelineId === state.settings.activePipelineId);
    if (state.settings.activeRole === "vendedor") l = l.filter((x) => x.ownerId === state.settings.activeUserId);
    if (q.trim()) {
      const s = q.toLowerCase();
      l = l.filter((x) => `${x.company} ${x.name} ${x.email}`.toLowerCase().includes(s));
    }
    return l;
  }, [state.leads, state.settings, q]);
  if (!state.hydrated) return <p className="p-8 text-slate-400">Cargando…</p>;
  return (
    <div>
      <h1 className="text-3xl font-bold">Leads</h1>
      <p className="mt-1 text-sm text-slate-400">{list.length} leads. (Detalle completo + IA en Lote C)</p>
      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar…" />
      </div>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[720px] text-sm">
          <thead><tr className="bg-white/5 text-left text-xs text-slate-400"><th className="p-3">Empresa</th><th className="p-3">Valor</th><th className="p-3">Score</th><th className="p-3">Cierre</th><th className="p-3">Estado</th></tr></thead>
          <tbody>
            {list.map((l) => {
              const { score } = scoreLead(l, state.activities);
              return (
                <tr key={l.id} className="border-t border-white/5">
                  <td className="p-3"><p className="font-semibold">{l.company}</p><p className="text-xs text-slate-400">{l.name}</p></td>
                  <td className="p-3 font-bold text-sky-300">{formatMoney(l.value)}</td>
                  <td className="p-3"><ScoreBadge score={score} /></td>
                  <td className="p-3 text-xs">{formatDate(l.expectedClose)}</td>
                  <td className="p-3"><Badge className="bg-white/10">{l.status}</Badge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
