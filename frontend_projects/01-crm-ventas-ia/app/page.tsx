"use client";
import { useMemo, useState } from "react";
import { DndContext, DragEndEvent, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { Plus, Search } from "lucide-react";
import { useCrm, uid } from "./lib/store";
import { scoreLead, suggestNextAction } from "./lib/ai";
import { formatMoney, formatDate } from "./lib/format";
import { Badge, Btn, Card, ScoreBadge } from "./components/ui";
import LeadModal from "./components/LeadModal";
import type { Lead } from "./lib/types";

function DraggableCard({ lead, onOpen }: { lead: Lead; onOpen: (l: Lead) => void }) {
  const { state } = useCrm();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: lead.id });
  const acts = state.activities.filter((a) => a.leadId === lead.id);
  const { score } = scoreLead(lead, state.activities);
  const owner = state.users.find((u) => u.id === lead.ownerId);
  return (
    <article
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => onOpen(lead)}
      style={transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined}
      className="cursor-grab rounded-xl border border-white/10 bg-slate-900/70 p-3 active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{lead.company}</p>
          <p className="truncate text-xs text-slate-400">{lead.name} · {owner?.name.split(" ")[0]}</p>
        </div>
        <ScoreBadge score={score} />
      </div>
      <p className="mt-2 text-sm font-bold text-sky-300">{formatMoney(lead.value, lead.currency)}</p>
      <p className="mt-1 truncate text-xs text-slate-400">→ {suggestNextAction(lead, acts)}</p>
      <p className="mt-1 text-[11px] text-slate-500">Cierre: {formatDate(lead.expectedClose)}</p>
    </article>
  );
}

function Column({ stageId, title, badge, children, count, total }: { stageId: string; title: string; badge: string; children: React.ReactNode; count: number; total: number }) {
  const { setNodeRef, isOver } = useDroppable({ id: stageId });
  return (
    <div ref={setNodeRef} className={`rounded-2xl border p-3 transition ${isOver ? "border-sky-400 bg-sky-500/10" : "border-white/10 bg-white/5"}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">{title}</h2>
        <Badge className={badge}>{count}</Badge>
      </div>
      <p className="mt-1 text-xs text-slate-400">{formatMoney(total)}</p>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}


export default function Page() {
  const { state, dispatch } = useCrm();
  const [q, setQ] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Lead | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const pipeline = state.pipelines.find((p) => p.id === state.settings.activePipelineId);

  const visibleLeads = useMemo(() => {
    let list = state.leads.filter((l) => l.pipelineId === state.settings.activePipelineId && l.status === "open");
    if (state.settings.activeRole === "vendedor") list = list.filter((l) => l.ownerId === state.settings.activeUserId);
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter((l) => `${l.company} ${l.name} ${l.tags.join(" ")}`.toLowerCase().includes(s));
    }
    return list;
  }, [state.leads, state.settings, q]);

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over) return;
    const leadId = String(active.id);
    const stageId = String(over.id);
    const lead = state.leads.find((l) => l.id === leadId);
    if (lead && lead.stageId !== stageId) dispatch({ type: "MOVE_LEAD", id: leadId, stageId });
  }

  if (!state.hydrated) return <p className="p-8 text-slate-400">Cargando CRM…</p>;
  if (!pipeline) return <p className="p-8">Sin pipeline. Ve a Config.</p>;

  const totalPipe = visibleLeads.reduce((s, l) => s + l.value, 0);

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-sky-400">Pipeline · {pipeline.name}</p>
          <h1 className="mt-1 text-3xl font-bold">Kanban de ventas</h1>
          <p className="mt-1 text-sm text-slate-400">{visibleLeads.length} leads abiertos · {formatMoney(totalPipe)} en juego. Arrastra cards entre etapas. Click para editar.</p>
        </div>
        <Btn onClick={() => { setEditing(null); setModalOpen(true); }}><span className="inline-flex items-center gap-2"><Plus size={16} /> Nuevo lead</span></Btn>
      </header>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
        <Search size={16} className="text-slate-500" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar empresa, contacto o tag…" className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" />
      </div>

      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <section className="mt-4 grid gap-3 xl:grid-cols-4 md:grid-cols-2">
          {pipeline.stages.sort((a, b) => a.order - b.order).map((st) => {
            const inStage = visibleLeads.filter((l) => l.stageId === st.id);
            const tot = inStage.reduce((s, l) => s + l.value, 0);
            return (
              <Column key={st.id} stageId={st.id} title={st.name} badge={st.color} count={inStage.length} total={tot}>
                {inStage.map((lead) => (
                  <DraggableCard key={lead.id} lead={lead} onOpen={(l) => { setEditing(l); setModalOpen(true); }} />
                ))}
                {inStage.length === 0 && <p className="rounded-xl border border-dashed border-white/10 p-4 text-center text-xs text-slate-500">Suelta aquí</p>}
              </Column>
            );
          })}
        </section>
      </DndContext>

      <Card className="mt-4 border-violet-500/20 bg-gradient-to-r from-sky-500/10 to-violet-500/10">
        <p className="text-sm font-semibold">🤖 IA local activa (mock inteligente)</p>
        <p className="mt-1 text-xs text-slate-400">Score heurístico por ticket + actividad + vencimiento. Plantillas de correo/WhatsApp en detalle del lead. En Fase 2 se conecta OpenAI cambiando solo <code>lib/ai.ts</code>.</p>
      </Card>

      {modalOpen && <LeadModal initial={editing} onClose={() => { setModalOpen(false); setEditing(null); }} />}
    </div>
  );
}
