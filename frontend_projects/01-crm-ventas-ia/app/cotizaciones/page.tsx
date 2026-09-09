"use client";
import { useCrm } from "../lib/store";
import { quoteTotal } from "../lib/seed";
import { formatDate, formatMoney } from "../lib/format";
import { Badge, Card } from "../components/ui";

export default function QuotesPage() {
  const { state } = useCrm();
  if (!state.hydrated) return <p className="p-8 text-slate-400">Cargando…</p>;
  return (
    <div>
      <h1 className="text-3xl font-bold">Cotizaciones</h1>
      <p className="mt-1 text-sm text-slate-400">{state.quotes.length} cotizaciones. (CRUD + PDF en Lote D)</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {state.quotes.map((q) => {
          const lead = state.leads.find((l) => l.id === q.leadId);
          return (
            <Card key={q.id}>
              <div className="flex items-center justify-between">
                <p className="font-bold">{q.number}</p>
                <Badge className="bg-amber-500/20 text-amber-300">{q.status}</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-400">{lead?.company} · vence {formatDate(q.validUntil)}</p>
              <p className="mt-2 text-lg font-bold text-sky-300">{formatMoney(quoteTotal(q))}</p>
              <ul className="mt-2 text-xs text-slate-400">{q.items.map((it) => <li key={it.id}>• {it.description} x{it.qty} — ${it.price}</li>)}</ul>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
