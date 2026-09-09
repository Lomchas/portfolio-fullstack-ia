"use client";
import { useCrm } from "../lib/store";
import { Btn, Card, Input } from "../components/ui";

export default function ConfigPage() {
  const { state, dispatch } = useCrm();
  if (!state.hydrated) return <p className="p-8 text-slate-400">Cargando…</p>;
  return (
    <div>
      <h1 className="text-3xl font-bold">Config</h1>
      <p className="mt-1 text-sm text-slate-400">Empresa, pipelines y demo. (Multi-pipeline CRUD en Lote F)</p>
      <Card className="mt-4">
        <p className="text-xs text-slate-400">Nombre empresa</p>
        <Input value={state.settings.companyName} onChange={(e) => dispatch({ type: "SET_SETTINGS", settings: { ...state.settings, companyName: e.target.value } })} />
        <div className="mt-3 flex gap-2">
          <Btn variant="ghost" onClick={() => {
            const blob = new Blob([localStorage.getItem("crm-ia-v1") ?? "{}"], { type: "application/json" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob); a.download = "crm-backup.json"; a.click();
          }}>Exportar JSON</Btn>
          <Btn variant="ghost" onClick={() => { if (confirm("¿Resetear demo?")) dispatch({ type: "RESET_DEMO" }); }}>Reset demo</Btn>
        </div>
      </Card>
      <Card className="mt-3">
        <p className="font-semibold">Pipelines ({state.pipelines.length})</p>
        <ul className="mt-2 text-sm text-slate-400">{state.pipelines.map((p) => <li key={p.id}>• {p.name} — {p.stages.length} etapas</li>)}</ul>
      </Card>
    </div>
  );
}
