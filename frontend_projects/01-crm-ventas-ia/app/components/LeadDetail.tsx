"use client";
import { useMemo } from "react";
import { ArrowLeft, Trash2, Check } from "lucide-react";
import { X } from "lucide-react";
import { useCrm } from "../lib/store";
import { formatDate, formatMoney } from "../lib/format";
import { Btn, Card, Select } from "./ui";
import AiPanel from "./AiPanel";
import ActivityForm from "./ActivityForm";

export default function LeadDetail({ leadId, onBack }: { leadId: string; onBack: () => void }) {
  const { state, dispatch } = useCrm();
  const lead = state.leads.find((l) => l.id === leadId);
  const acts = useMemo(() => state.activities.filter((a) => a.leadId === leadId).sort((a, b) => +new Date(b.date) - +new Date(a.date)), [state.activities, leadId]);
  if (!lead) return <p className="p-8">Lead no encontrado. <button className="underline" onClick={onBack}>Volver</button></p>;
  const pipe = state.pipelines.find((p) => p.id === lead.pipelineId);
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <Btn variant="ghost" onClick={onBack}><span className="inline-flex items-center gap-2"><ArrowLeft size={14} /> Volver</span></Btn>
        <h2 className="mt-3 text-2xl font-bold">{lead.company}</h2>
        <p className="text-sm text-slate-400">{lead.name} · {lead.email} · {lead.phone} · {lead.source}</p>
        <p className="mt-2 text-lg font-bold text-sky-300">{formatMoney(lead.value, lead.currency)}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Select value={lead.stageId} onChange={(e) => dispatch({ type: "MOVE_LEAD", id: lead.id, stageId: e.target.value })} className="!w-48">
            {pipe?.stages.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
          <Select value={lead.ownerId} onChange={(e) => dispatch({ type: "UPDATE_LEAD", lead: { ...lead, ownerId: e.target.value, updatedAt: new Date().toISOString() } })} className="!w-48">
            {state.users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </Select>
          <Select value={lead.status} onChange={(e) => dispatch({ type: "UPDATE_LEAD", lead: { ...lead, status: e.target.value as never, updatedAt: new Date().toISOString() } })} className="!w-36">
            <option value="open">open</option><option value="won">won</option><option value="lost">lost</option><option value="archived">archived</option>
          </Select>
          <Btn variant="ghost" onClick={() => { if (confirm("¿Eliminar lead?")) { dispatch({ type: "DELETE_LEAD", id: lead.id }); onBack(); } }}>
            <span className="inline-flex items-center gap-1 text-red-300"><Trash2 size={14} /> Eliminar</span>
          </Btn>
        </div>
        <h3 className="mt-5 font-semibold">Timeline ({acts.length})</h3>
        <div className="mt-2 space-y-2">
          {acts.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-slate-900/60 p-3 text-sm">
              <div className="min-w-0"><p className="font-semibold">{a.title} <span className="text-xs font-normal text-slate-500">· {a.type} · {formatDate(a.date)}</span></p><p className="truncate text-xs text-slate-400">{a.detail}</p></div>
              <div className="flex shrink-0 gap-1">
                <button onClick={() => dispatch({ type: "TOGGLE_ACTIVITY", id: a.id })} className="rounded-lg border border-white/10 p-2">{a.done ? <Check size={14} className="text-emerald-300" /> : <span className="block h-3.5 w-3.5 rounded-full border border-slate-500" />}</button>
                <button onClick={() => dispatch({ type: "DELETE_ACTIVITY", id: a.id })} className="rounded-lg border border-white/10 p-2"><X size={14} /></button>
              </div>
            </div>
          ))}
          {acts.length === 0 && <p className="text-xs text-slate-500">Sin actividades.</p>}
        </div>
        <ActivityForm leadId={lead.id} />
      </Card>
      <AiPanel lead={lead} />
    </div>
  );
}
