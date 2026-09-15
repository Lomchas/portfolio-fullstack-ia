"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useCrm, uid } from "../lib/store";
import { Btn, Input, Select } from "./ui";
import type { Lead } from "../lib/types";

/** Convierte un ISO a valor de <input type="date"> sin lanzar en fechas inválidas. */
function toDateInput(iso?: string): string {
  const today = new Date().toISOString().slice(0, 10);
  if (!iso) return today;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? today : d.toISOString().slice(0, 10);
}

export default function LeadModal({ initial, onClose }: { initial?: Lead | null; onClose: () => void }) {
  const { state, dispatch } = useCrm();
  const pipelineId = initial?.pipelineId ?? state.settings.activePipelineId;
  const pipeline = state.pipelines.find((p) => p.id === pipelineId) ?? state.pipelines[0];
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    company: initial?.company ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    value: initial?.value ?? 5000,
    stageId: initial?.stageId ?? pipeline?.stages[0]?.id ?? "",
    ownerId: initial?.ownerId ?? state.settings.activeUserId,
    expectedClose: toDateInput(initial?.expectedClose),
    tags: initial?.tags.join(", ") ?? "",
    source: initial?.source ?? "Web"
  });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function set(k: string, v: string | number) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function save() {
    if (!form.name.trim() || !form.company.trim()) return setError("Contacto y empresa son obligatorios.");
    const value = Number(form.value);
    if (!Number.isFinite(value) || value < 0) return setError("El valor debe ser un número mayor o igual a 0.");
    const closeDate = new Date(form.expectedClose);
    const expectedClose = Number.isNaN(closeDate.getTime()) ? new Date().toISOString() : closeDate.toISOString();
    const stageId = pipeline?.stages.some((s) => s.id === form.stageId) ? form.stageId : pipeline?.stages[0]?.id ?? form.stageId;
    const base = {
      name: form.name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      value,
      currency: state.settings.currency,
      pipelineId: pipeline?.id ?? state.settings.activePipelineId,
      stageId,
      ownerId: form.ownerId,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      source: form.source.trim() || "Web",
      expectedClose,
      updatedAt: new Date().toISOString()
    };
    if (initial) {
      dispatch({ type: "UPDATE_LEAD", lead: { ...initial, ...base } });
    } else {
      const now = new Date().toISOString();
      dispatch({ type: "ADD_LEAD", lead: { ...base, id: uid("l"), status: "open", createdAt: now } });
    }
    onClose();
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-slate-950 p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold">{initial ? "Editar lead" : "Nuevo lead"}</h3>
          <button onClick={onClose} aria-label="Cerrar"><X size={18} /></button>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sm:col-span-1"><p className="mb-1 text-xs text-slate-400">Contacto *</p><Input autoFocus value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
          <div className="sm:col-span-1"><p className="mb-1 text-xs text-slate-400">Empresa *</p><Input value={form.company} onChange={(e) => set("company", e.target.value)} /></div>
          <div className="sm:col-span-1"><p className="mb-1 text-xs text-slate-400">Email</p><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
          <div className="sm:col-span-1"><p className="mb-1 text-xs text-slate-400">Teléfono</p><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></div>
          <div className="sm:col-span-1"><p className="mb-1 text-xs text-slate-400">Valor {state.settings.currency}</p><Input type="number" min={0} value={form.value} onChange={(e) => set("value", Number(e.target.value))} /></div>
          <div className="sm:col-span-1"><p className="mb-1 text-xs text-slate-400">Cierre esperado</p><Input type="date" value={form.expectedClose} onChange={(e) => set("expectedClose", e.target.value)} /></div>
          <div className="sm:col-span-1"><p className="mb-1 text-xs text-slate-400">Etapa</p><Select value={form.stageId} onChange={(e) => set("stageId", e.target.value)}>{pipeline?.stages.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</Select></div>
          <div className="sm:col-span-1"><p className="mb-1 text-xs text-slate-400">Responsable</p><Select value={form.ownerId} onChange={(e) => set("ownerId", e.target.value)}>{state.users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</Select></div>
          <div className="sm:col-span-1"><p className="mb-1 text-xs text-slate-400">Tags (coma)</p><Input value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="retail, prioridad" /></div>
          <div className="sm:col-span-1"><p className="mb-1 text-xs text-slate-400">Fuente</p><Input value={form.source} onChange={(e) => set("source", e.target.value)} /></div>
        </div>
        {error && <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
          <Btn onClick={save}>{initial ? "Guardar cambios" : "Crear lead"}</Btn>
        </div>
      </div>
    </div>
  );
}
