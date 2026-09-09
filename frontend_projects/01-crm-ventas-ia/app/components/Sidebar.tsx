"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BarChart3, FileText, KanbanSquare, Settings, Users, Menu, X, Sparkles } from "lucide-react";
import { useCrm } from "../lib/store";

const links = [
  { href: "/", label: "Pipeline", icon: KanbanSquare },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/cotizaciones", label: "Cotizaciones", icon: FileText },
  { href: "/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/config", label: "Config", icon: Settings }
];

export default function Sidebar() {
  const pathname = usePathname();
  const { state, dispatch } = useCrm();
  const [open, setOpen] = useState(false);

  const activeUser = state.users.find((u) => u.id === state.settings.activeUserId);

  return (
    <>
      <button
        className="fixed left-4 top-4 z-50 rounded-lg border border-white/10 bg-slate-900 p-2 md:hidden"
        onClick={() => setOpen(!open)}
        aria-label="Menú"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <aside
        className={`fixed z-40 flex h-screen w-64 flex-col border-r border-white/10 bg-slate-950/95 p-4 backdrop-blur transition-transform md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2 px-2 pt-10 md:pt-0">
          <div className="rounded-xl bg-gradient-to-br from-sky-500 to-violet-600 p-2">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold">CRM Ventas IA</p>
            <p className="text-[11px] text-slate-500">{state.settings.companyName}</p>
          </div>
        </div>

        <nav className="mt-6 space-y-1">
          {links.map((l) => {
            const active = pathname === l.href;
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  active ? "bg-sky-500/15 text-sky-300" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <Icon size={18} />
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-[11px] uppercase tracking-widest text-slate-500">Pipeline activo</p>
          <select
            value={state.settings.activePipelineId}
            onChange={(e) => dispatch({ type: "SET_SETTINGS", settings: { ...state.settings, activePipelineId: e.target.value } })}
            className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 px-2 py-2 text-sm"
          >
            {state.pipelines.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <p className="mt-3 text-[11px] uppercase tracking-widest text-slate-500">Rol demo (UI)</p>
          <select
            value={state.settings.activeUserId}
            onChange={(e) => {
              const u = state.users.find((x) => x.id === e.target.value);
              if (u) dispatch({ type: "SET_SETTINGS", settings: { ...state.settings, activeUserId: u.id, activeRole: u.role } });
            }}
            className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 px-2 py-2 text-sm"
          >
            {state.users.map((u) => (
              <option key={u.id} value={u.id}>{u.name} — {u.role}</option>
            ))}
          </select>
          {activeUser && <p className="mt-2 text-[11px] text-amber-300/80">Modo demo — auth real en Fase 2</p>}
        </div>

        <div className="mt-auto rounded-xl border border-violet-500/20 bg-violet-500/10 p-3 text-xs text-violet-200">
          🤖 IA local activa. Conecta OpenAI en Fase 2 vía <code>lib/ai.ts</code>.
        </div>
      </aside>
    </>
  );
}
