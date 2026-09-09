"use client";
import { useCrm, uid } from "../lib/store";
import { useState } from "react";
import { Btn, Input, Select } from "./ui";
import { Plus } from "lucide-react";

export default function ActivityForm({ leadId }: { leadId: string }) {
  const { state, dispatch } = useCrm();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("tarea");
  const [detail, setDetail] = useState("");
  return (
    <div className="mt-3 grid gap-2 rounded-xl border border-white/10 p-3 md:grid-cols-4">
      <Select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="llamada">llamada</option>
        <option value="email">email</option>
        <option value="whatsapp">whatsapp</option>
        <option value="reunion">reunión</option>
        <option value="nota">nota</option>
        <option value="tarea">tarea</option>
      </Select>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título *" className="md:col-span-2" />
      <Btn onClick={() => {
        if (!title.trim()) return alert("Título requerido");
        dispatch({ type: "ADD_ACTIVITY", activity: { id: uid("a"), leadId, type: type as never, title: title.trim(), detail: detail.trim(), date: new Date().toISOString(), done: false, createdBy: state.settings.activeUserId } });
        setTitle(""); setDetail("");
      }}><span className="inline-flex items-center gap-1"><Plus size={14} /> Agregar</span></Btn>
      <Input value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="Detalle…" className="md:col-span-4" />
    </div>
  );
}
