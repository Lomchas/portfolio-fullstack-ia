"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useCrm, uid } from "../lib/store";
import { quoteTotal } from "../lib/seed";
import { formatDate, formatMoney } from "../lib/format";
import { Badge, Btn, Card } from "../components/ui";
import { QuoteEditor } from "../components/QuoteEditor";

export default function QuotesPage() {
  const { state, dispatch } = useCrm();
  const [sel, setSel] = useState<string | null>(null);
  if (!state.hydrated) return <p className="p-8 text-slate-400">Cargando…</p>;
  const current = state.quotes.find((x) => x.id === sel) ?? null;
  if (current) return <QuoteEditor quote={current} onBack={() => setSel(null)} />;
  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cotizaciones</h1>
          <p className="mt-1 text-sm text-slate-400">{state.quotes.length} cotizaciones</p>
        </div>
        <Btn onClick={() => {
          const lead = state.leads[0];
          if (!lead) return alert("Crea un lead primero");
          dispatch({ type: "ADD_QUOTE", quote: { id: uid("q"), leadId: lead.id, number: "COT-2026-" + String(state.quotes.length + 1).padStart(3, "0"), items: [{ id: uid("qi"), description: "Servicio base", qty: 1, price: 1000 }], discount: 0, tax: 19, status: "borrador", notes: "", createdAt: new Date().toISOString(), validUntil: new Date(Date.now() + 15 * 864e5).toISOString() } });
        }}><span className="inline-flex items-center gap-1"><Plus size={14} /> Nueva</span></Btn>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {state.quotes.map((x) => {
          const lead = state.leads.find((l) => l.id === x.leadId);
          return (
            <Card key={x.id}>
              <div onClick={() => setSel(x.id)} className="cursor-pointer">
                <div className="flex items-center justify-between">
                  <p className="font-bold">{x.number}</p>
                  <Badge className="bg-amber-500/20 text-amber-300">{x.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-400">{lead?.company} · {formatDate(x.validUntil)}</p>
                <p className="mt-2 text-lg font-bold text-sky-300">{formatMoney(quoteTotal(x))}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
