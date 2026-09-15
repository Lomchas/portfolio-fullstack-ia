"use client";
import { useMemo, useState } from "react";
import { useCrm } from "../lib/store";
import { scoreLead } from "../lib/ai";
import { formatDate, formatMoney } from "../lib/format";
import { leadsToCSV, downloadText } from "../lib/csv";
import { Badge, Btn, Input, ScoreBadge, Select } from "../components/ui";
import LeadDetail from "../components/LeadDetail";
import type { LeadStatus } from "../lib/types";

const STATUS_LABEL: Record<LeadStatus, string> = {
  open: "Abierto",
  won: "Ganado",
  lost: "Perdido",
  archived: "Archivado"
};

export default function LeadsPage() {
  const { state } = useCrm();
  const [q, setQ] = useState("");
  const [owner, setOwner] = useState("all");
  const [minScore, setMinScore] = useState(0);
  const [sel, setSel] = useState<string | null>(null);
  const list = useMemo(() => {
    let l = state.leads.filter((x) => x.pipelineId === state.settings.activePipelineId);
    if (state.settings.activeRole === "vendedor") l = l.filter((x) => x.ownerId === state.settings.activeUserId);
    if (owner !== "all") l = l.filter((x) => x.ownerId === owner);
    if (q.trim()) {
      const s = q.toLowerCase();
      l = l.filter((x) => `${x.company} ${x.name} ${x.email}`.toLowerCase().includes(s));
    }
    const ws = l.map((x) => ({ x, s: scoreLead(x, state.activities).score }));
    return (minScore > 0 ? ws.filter((w) => w.s >= minScore) : ws).sort((a, b) => b.x.value - a.x.value).map((w) => w.x);
  }, [state.leads, state.activities, state.settings, q, owner, minScore]);
  if (!state.hydrated) return <p className="p-8 text-slate-400">Cargando…</p>;
  const current = state.leads.find((l) => l.id === sel) ?? null;
  if (current) return <LeadDetail leadId={current.id} onBack={() => setSel(null)} />;
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="mt-1 text-sm text-slate-400">{list.length} leads · click para detalle + IA</p>
        </div>
        <Btn variant="ghost" onClick={() => downloadText("leads.csv", leadsToCSV(list), "text/csv")}>Export CSV</Btn>
      </div>
      <div className="mt-4 grid gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 md:grid-cols-3">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar…" />
        <Select value={owner} onChange={(e) => setOwner(e.target.value)}>
          <option value="all">Todos</option>
          {state.users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </Select>
        <Select value={String(minScore)} onChange={(e) => setMinScore(Number(e.target.value))}>
          <option value="0">Score todos</option>
          <option value="70">Score 70+</option>
          <option value="85">Score 85+</option>
        </Select>
      </div>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[720px] text-sm">
          <thead><tr className="bg-white/5 text-left text-xs text-slate-400"><th className="p-3">Empresa</th><th className="p-3">Valor</th><th className="p-3">Score</th><th className="p-3">Cierre</th><th className="p-3">Estado</th></tr></thead>
          <tbody>
            {list.map((l) => {
              const { score } = scoreLead(l, state.activities);
              return (
                <tr key={l.id} onClick={() => setSel(l.id)} className="cursor-pointer border-t border-white/5 hover:bg-white/5">
                  <td className="p-3"><p className="font-semibold">{l.company}</p><p className="text-xs text-slate-400">{l.name}</p></td>
                  <td className="p-3 font-bold text-sky-300">{formatMoney(l.value, l.currency)}</td>
                  <td className="p-3"><ScoreBadge score={score} /></td>
                  <td className="p-3 text-xs">{formatDate(l.expectedClose)}</td>
                  <td className="p-3"><Badge className="bg-white/10">{STATUS_LABEL[l.status]}</Badge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
