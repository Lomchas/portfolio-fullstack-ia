"use client";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useCrm, uid } from "../lib/store";
import { downloadText } from "../lib/csv";
import { Btn, Card, Input } from "../components/ui";

export default function ConfigPage() {
  const { state, dispatch } = useCrm();
  const [newStage, setNewStage] = useState("");
  if (!state.hydrated) return <p className="p-8 text-slate-400">Cargando…</p>;
  const pipe = state.pipelines.find((p) => p.id === state.settings.activePipelineId);
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
        <div className="mt-2 space-y-2">
          {pipe?.stages.sort((a, b) => a.order - b.order).map((s) => (
            <div key={s.id} className="flex items-center gap-2 text-sm">
              <Input value={s.name} onChange={(e) => {
                if (!pipe) return;
                const stages = pipe.stages.map((x) => x.id === s.id ? { ...x, name: e.target.value } : x);
                dispatch({ type: "SET_PIPELINES", pipelines: state.pipelines.map((p) => p.id === pipe.id ? { ...p, stages } : p) });
              }} />
              <span className="w-20 text-xs text-slate-400">{s.probability}%</span>
              <button onClick={() => {
                if (!pipe) return;
                if (pipe.stages.length <= 1) return alert("Mínimo 1 etapa");
                dispatch({ type: "SET_PIPELINES", pipelines: state.pipelines.map((p) => p.id === pipe.id ? { ...p, stages: p.stages.filter((x) => x.id !== s.id) } : p) });
              }} className="rounded-lg border border-white/10 p-2"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
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
