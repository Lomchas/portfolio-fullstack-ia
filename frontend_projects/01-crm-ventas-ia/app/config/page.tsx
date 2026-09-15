"use client";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useCrm, uid } from "../lib/store";
import { downloadText } from "../lib/csv";
import { Btn, Card, Input } from "../components/ui";

export default function ConfigPage() {
  const { state, dispatch } = useCrm();
  const [newStage, setNewStage] = useState("");
  const [msg, setMsg] = useState("");
  if (!state.hydrated) return <p className="p-8 text-slate-400">Cargando…</p>;
  const pipe = state.pipelines.find((p) => p.id === state.settings.activePipelineId);
  const orderedStages = pipe ? [...pipe.stages].sort((a, b) => a.order - b.order) : [];

  function deleteStage(stageId: string) {
    if (!pipe) return;
    if (pipe.stages.length <= 1) return alert("Debe quedar al menos 1 etapa en el pipeline.");
    const remaining = pipe.stages.filter((x) => x.id !== stageId);
    dispatch({ type: "SET_PIPELINES", pipelines: state.pipelines.map((p) => (p.id === pipe.id ? { ...p, stages: remaining } : p)) });
    const orphans = state.leads.filter((l) => l.pipelineId === pipe.id && l.stageId === stageId);
    orphans.forEach((l) => dispatch({ type: "UPDATE_LEAD", lead: { ...l, stageId: remaining[0].id, updatedAt: new Date().toISOString() } }));
    setMsg(orphans.length ? `Etapa eliminada. ${orphans.length} lead(s) movidos a "${remaining[0].name}".` : "Etapa eliminada.");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Config</h1>
      <p className="mt-1 text-sm text-slate-400">Empresa · etapas del pipeline activo · backup</p>
      <Card className="mt-4">
        <p className="text-xs text-slate-400">Nombre empresa</p>
        <Input value={state.settings.companyName} onChange={(e) => dispatch({ type: "SET_SETTINGS", settings: { ...state.settings, companyName: e.target.value } })} />
        <p className="mt-3 text-xs text-slate-400">Moneda</p>
        <Input value={state.settings.currency} onChange={(e) => dispatch({ type: "SET_SETTINGS", settings: { ...state.settings, currency: e.target.value } })} />
        <div className="mt-3 flex flex-wrap gap-2">
          <Btn variant="ghost" onClick={() => downloadText("crm-backup.json", localStorage.getItem("crm-ia-v1") ?? "{}", "application/json")}>Export JSON</Btn>
          <Btn variant="ghost" onClick={() => { if (confirm("¿Resetear demo?")) dispatch({ type: "RESET_DEMO" }); }}>Reset demo</Btn>
        </div>
      </Card>
      <Card className="mt-3">
        <p className="font-semibold">Etapas — {pipe?.name}</p>
        <p className="mt-1 text-xs text-slate-500">Renombrar es directo. Si borras una etapa, sus leads pasan a la primera etapa.</p>
        <div className="mt-2 space-y-2">
          {orderedStages.map((s) => (
            <div key={s.id} className="flex items-center gap-2 text-sm">
              <Input value={s.name} onChange={(e) => {
                if (!pipe) return;
                const stages = pipe.stages.map((x) => x.id === s.id ? { ...x, name: e.target.value } : x);
                dispatch({ type: "SET_PIPELINES", pipelines: state.pipelines.map((p) => p.id === pipe.id ? { ...p, stages } : p) });
              }} />
              <span className="w-20 text-xs text-slate-400">{s.probability}%</span>
              <button onClick={() => deleteStage(s.id)} className="rounded-lg border border-white/10 p-2" aria-label={`Eliminar etapa ${s.name}`}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        {msg && <p className="mt-2 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-xs text-sky-200">{msg}</p>}
        <div className="mt-3 flex gap-2">
          <Input value={newStage} onChange={(e) => setNewStage(e.target.value)} placeholder="Nueva etapa…" />
          <Btn onClick={() => {
            if (!newStage.trim() || !pipe) return;
            const stages = [...pipe.stages, { id: uid("s"), name: newStage.trim(), color: "bg-white/10 text-slate-200", probability: 50, order: pipe.stages.length }];
            dispatch({ type: "SET_PIPELINES", pipelines: state.pipelines.map((p) => p.id === pipe.id ? { ...p, stages } : p) });
            setNewStage("");
          }}><span className="inline-flex items-center gap-1"><Plus size={14} /> Etapa</span></Btn>
        </div>
      </Card>
    </div>
  );
}
