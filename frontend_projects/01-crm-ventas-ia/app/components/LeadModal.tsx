"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { useCrm, uid } from "../lib/store";
import { Btn, Input, Select } from "./ui";
import type { Lead } from "../lib/types";

export default function LeadModal({ initial, onClose }: { initial?: Lead | null; onClose: () => void }) {
  const { state, dispatch } = useCrm();
  const pipeline = state.pipelines.find((p) => p.id === state.settings.activePipelineId);
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    company: initial?.company ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    value: initial?.value ?? 5000,
    stageId: initial?.stageId ?? pipeline?.stages[0]?.id ?? "",
    ownerId: initial?.ownerId ?? state.settings.activeUserId,
    expectedClose: initial?.expectedClose ? initial.expectedClose.slice(0, 10) : new Date().toISOString().slice(0, 10),
    tags: initial?.tags.join(", ") ?? "",
    source: initial?.source ?? "Web"
  });
  function set(k: string, v: string | number) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  function save() {
    if (!form.company.trim() || !form.name.trim()) return alert("Nombre y empresa son obligatorios");
    const base = {
      name: form.name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      value: Number(form.value) || 0,
      currency: state.settings.currency,
      pipelineId: state.settings.activePipelineId,
      stageId: form.stageId,
      ownerId: form.ownerId,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      source: form.source,
      expectedClose: new Date(form.expectedClose).toISOString(),
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
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-950 p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold">{initial ? "Editar lead" : "Nuevo lead"}</h3>
          <button onClick={onClose} aria-label="Cerrar"><X size={18} /></button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="col-span-1"><p className="mb-1 text-xs text-slate-400">Contacto *</p><Input value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
          <div className="col-span-1"><p className="mb-1 text-xs text-slate-400">Empresa *</p><Input value={form.company} onChange={(e) => set("company", e.target.value)} /></div>
          <div className="col-span-1"><p className="mb-1 text-xs text-slate-400">Email</p><Input value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
          <div className="col-span-1"><p className="mb-1 text-xs text-slate-400">Teléfono</p><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></div>
          <div className="col-span-1"><p className="mb-1 text-xs text-slate-400">Valor USD</p><Input type="number" value={form.value} onChange={(e) => set("value", Number(e.target.value))} /></div>
          <div className="col-span-1"><p className="mb-1 text-xs text-slate-400">Cierre esperado</p><Input type="date" value={form.expectedClose} onChange={(e) => set("expectedClose", e.target.value)} /></div>
          <div className="col-span-1"><p className="mb-1 text-xs text-slate-400">Etapa</p><Select value={form.stageId} onChange={(e) => set("stageId", e.target.value)}>{pipeline?.stages.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</Select></div>
          <div className="col-span-1"><p className="mb-1 text-xs text-slate-400">Responsable</p><Select value={form.ownerId} onChange={(e) => set("ownerId", e.target.value)}>{state.users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</Select></div>
          <div className="col-span-1"><p className="mb-1 text-xs text-slate-400">Tags (coma)</p><Input value={form.tags} onChange={(e) => set("tags", e.target.value)} /></div>
          <div className="col-span-1"><p className="mb-1 text-xs text-slate-400">Fuente</p><Input value={form.source} onChange={(e) => set("source", e.target.value)} /></div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
          <Btn onClick={save}>{initial ? "Guardar" : "Crear lead"}</Btn>
        </div>
      </div>
    </div>
  );
}
