"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useCrm, uid } from "../lib/store";
import { quoteTotal } from "../lib/seed";
import { formatDate, formatMoney } from "../lib/format";
import { Badge, Btn, Card } from "../components/ui";
import { QuoteEditor } from "../components/QuoteEditor";
import type { Quote } from "../lib/types";

/** Siguiente número correlativo real: COT-<año>-NNN (evita duplicados al borrar). */
function nextQuoteNumber(quotes: Quote[]): string {
  const max = quotes.reduce((m, q) => {
    const n = Number(String(q.number).split("-").pop());
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return `COT-${new Date().getFullYear()}-${String(max + 1).padStart(3, "0")}`;
}

export default function QuotesPage() {
  const { state, dispatch } = useCrm();
  const [sel, setSel] = useState<string | null>(null);
  if (!state.hydrated) return <p className="p-8 text-slate-400">Cargando…</p>;
  const current = state.quotes.find((x) => x.id === sel) ?? null;
  if (current) return <QuoteEditor quote={current} onBack={() => setSel(null)} />;

  function createQuote() {
    const lead = state.leads.find((l) => l.pipelineId === state.settings.activePipelineId && l.status === "open") ?? state.leads[0];
    if (!lead) return alert("Crea un lead primero para poder cotizar.");
    const id = uid("q");
    dispatch({
      type: "ADD_QUOTE",
      quote: {
        id,
        leadId: lead.id,
        number: nextQuoteNumber(state.quotes),
        items: [{ id: uid("qi"), description: "Servicio base", qty: 1, price: 1000 }],
        discount: 0,
        tax: 19,
        status: "borrador",
        notes: "",
        createdAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 15 * 864e5).toISOString()
      }
    });
    setSel(id);
  }

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cotizaciones</h1>
          <p className="mt-1 text-sm text-slate-400">{state.quotes.length} cotizaciones</p>
        </div>
        <Btn onClick={createQuote}><span className="inline-flex items-center gap-1"><Plus size={14} /> Nueva</span></Btn>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {[...state.quotes].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).map((x) => {
          const lead = state.leads.find((l) => l.id === x.leadId);
          return (
            <Card key={x.id}>
              <div onClick={() => setSel(x.id)} className="cursor-pointer">
                <div className="flex items-center justify-between">
                  <p className="font-bold">{x.number}</p>
                  <Badge className="bg-amber-500/20 text-amber-300">{x.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-400">{lead?.company} · {formatDate(x.validUntil)}</p>
                <p className="mt-2 text-lg font-bold text-sky-300">{formatMoney(quoteTotal(x), state.settings.currency)}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
