"use client";
import { useState } from "react";
import { FileDown, Trash2, Plus } from "lucide-react";
import { useCrm, uid } from "../lib/store";
import { quoteTotal } from "../lib/seed";
import { downloadQuotePDF } from "../lib/pdf";
import { formatMoney } from "../lib/format";
import { Badge, Btn, Card, Input, Select } from "../components/ui";
import type { Quote } from "../lib/types";

export function QuoteEditor({ quote, onBack }: { quote: Quote; onBack: () => void }) {
  const { state, dispatch } = useCrm();
  const [q, setQ] = useState<Quote>(quote);
  const lead = state.leads.find((l) => l.id === q.leadId);
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <Btn variant="ghost" onClick={onBack}>← Volver</Btn>
        <h2 className="mt-2 text-2xl font-bold">{q.number}</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          <div><p className="text-xs text-slate-400">Lead</p><Select value={q.leadId} onChange={(e) => setQ({ ...q, leadId: e.target.value })}>{state.leads.map((l) => <option key={l.id} value={l.id}>{l.company}</option>)}</Select></div>
          <div><p className="text-xs text-slate-400">Estado</p><Select value={q.status} onChange={(e) => setQ({ ...q, status: e.target.value as never })}><option value="borrador">borrador</option><option value="enviada">enviada</option><option value="aprobada">aprobada</option><option value="rechazada">rechazada</option></Select></div>
          <div><p className="text-xs text-slate-400">Descuento %</p><Input type="number" value={q.discount} onChange={(e) => setQ({ ...q, discount: Number(e.target.value) })} /></div>
          <div><p className="text-xs text-slate-400">Impuesto %</p><Input type="number" value={q.tax} onChange={(e) => setQ({ ...q, tax: Number(e.target.value) })} /></div>
        </div>
        <div className="mt-4 space-y-2">
          {q.items.map((it) => (
            <div key={it.id} className="grid grid-cols-12 gap-2">
              <Input value={it.description} onChange={(e) => setQ({ ...q, items: q.items.map((x) => x.id === it.id ? { ...x, description: e.target.value } : x) })} className="col-span-6" />
              <Input type="number" value={it.qty} onChange={(e) => setQ({ ...q, items: q.items.map((x) => x.id === it.id ? { ...x, qty: Number(e.target.value) } : x) })} className="col-span-2" />
              <Input type="number" value={it.price} onChange={(e) => setQ({ ...q, items: q.items.map((x) => x.id === it.id ? { ...x, price: Number(e.target.value) } : x) })} className="col-span-3" />
              <button onClick={() => setQ({ ...q, items: q.items.filter((x) => x.id !== it.id) })} className="col-span-1 rounded-lg border border-white/10 p-2"><Trash2 size={14} /></button>
            </div>
          ))}
          <Btn variant="ghost" onClick={() => setQ({ ...q, items: [...q.items, { id: uid("qi"), description: "Nuevo ítem", qty: 1, price: 500 }] })}><span className="inline-flex items-center gap-1"><Plus size={14} /> Ítem</span></Btn>
        </div>
        <div className="mt-3"><p className="text-xs text-slate-400">Notas</p><Input value={q.notes} onChange={(e) => setQ({ ...q, notes: e.target.value })} /></div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Btn onClick={() => { dispatch({ type: "UPDATE_QUOTE", quote: q }); onBack(); }}>Guardar</Btn>
          <Btn variant="ghost" onClick={() => { if (lead) downloadQuotePDF(q, state.settings.companyName, lead.name, lead.company); }}><span className="inline-flex items-center gap-1"><FileDown size={14} /> PDF</span></Btn>
          <Btn variant="ghost" onClick={() => { if (confirm("¿Eliminar?")) { dispatch({ type: "DELETE_QUOTE", id: q.id }); onBack(); } }}><span className="text-red-300">Eliminar</span></Btn>
        </div>
      </Card>
      <Card>
        <p className="font-semibold">Total</p>
        <p className="mt-2 text-3xl font-bold text-sky-300">{formatMoney(quoteTotal(q), state.settings.currency)}</p>
        <Badge className="mt-2 bg-white/10">{q.status}</Badge>
        {lead && <p className="mt-3 text-xs text-slate-400">Cliente: {lead.company}</p>}
      </Card>
    </div>
  );
}
