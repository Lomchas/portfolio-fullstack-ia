const PIPELINE = [
  {
    stage: "Nuevos",
    color: "bg-sky-500/20 text-sky-300",
    leads: [
      { name: "Café Andino — 12 sedes", value: "$4.800", score: 82, next: "Enviar cotización PDF" },
      { name: "Logística RápidoYa", value: "$9.200", score: 76, next: "Llamada discovery" }
    ]
  },
  {
    stage: "En negociación",
    color: "bg-amber-500/20 text-amber-300",
    leads: [
      { name: "Clínica Santa Fe", value: "$15.000", score: 91, next: "Demo con gerente" },
      { name: "Retail Moda Sur", value: "$6.400", score: 68, next: "Enviar propuesta IA" }
    ]
  },
  {
    stage: "Ganados",
    color: "bg-emerald-500/20 text-emerald-300",
    leads: [{ name: "Hotel Miramar", value: "$11.300", score: 95, next: "Onboarding + upsell" }]
  }
];

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-widest text-sky-400">Portafolio · Fullstack + IA para ventas</p>
          <h1 className="mt-2 text-4xl font-bold">CRM de Ventas con IA</h1>
          <p className="mt-2 max-w-2xl text-slate-400">
            Kanban comercial con scoring automático de leads y asistente que redacta correos de seguimiento.
            Demo inicial (sin base de datos) lista para desplegar en Vercel desde esta subcarpeta.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="rounded-full bg-sky-500/15 px-4 py-2 text-sm text-sky-300">Next.js 14</span>
          <span className="rounded-full bg-violet-500/15 px-4 py-2 text-sm text-violet-300">Tailwind</span>
          <span className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm text-emerald-300">Listo para Vercel</span>
        </div>
      </header>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {PIPELINE.map((col) => (
          <div key={col.stage} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{col.stage}</h2>
              <span className={`rounded-full px-3 py-1 text-xs ${col.color}`}>{col.leads.length} leads</span>
            </div>
            <div className="mt-4 space-y-3">
              {col.leads.map((l) => (
                <article key={l.name} className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium leading-snug">{l.name}</h3>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        l.score >= 85 ? "bg-emerald-500/20 text-emerald-300" : l.score >= 70 ? "bg-amber-500/20 text-amber-300" : "bg-red-500/20 text-red-300"
                      }`}
                      title="Score IA: probabilidad de cierre"
                    >
                      IA {l.score}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{l.value} · Siguiente: {l.next}</p>
                  <div className="mt-3 flex gap-2">
                    <button className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-400">
                      ✉️ Generar correo IA
                    </button>
                    <button className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10">
                      Mover →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-r from-sky-500/10 to-violet-500/10 p-6">
        <h2 className="text-lg font-semibold">🤖 Asistente IA (siguiente paso)</h2>
        <p className="mt-1 text-sm text-slate-400">
          Conectaremos este botón a <code>/api/generar-correo</code> con OpenAI + datos del lead guardados en Supabase.
          Roadmap: Supabase → auth → API → scoring real → WhatsApp.
        </p>
      </section>

      <footer className="mt-8 text-xs text-slate-500">
        Root Directory para Vercel: <code>frontend_projects/01-crm-ventas-ia</code> · Build: <code>npm run build</code>
      </footer>
    </main>
  );
}
