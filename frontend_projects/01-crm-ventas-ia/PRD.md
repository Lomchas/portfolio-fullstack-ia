# 📋 PRD — 01 CRM Ventas IA (Fase 1 Enterprise Local)

> Confirmado por el dueño el 2026-09-09. Una sola fuente de verdad. No pasar a otro proyecto hasta completar Fase 1.

## 1. Visión
CRM comercial completo para SMB, **100% funcional en local + Vercel sin backend ni API keys**, con IA mock inteligente, que sirva como pieza estrella del portafolio fullstack + IA para ventas.

URL prod: https://portfolio-fullstack-ia.vercel.app/
Repo: https://github.com/Lomchas/portfolio-fullstack-ia
Root Directory Vercel: `frontend_projects/01-crm-ventas-ia`

## 2. Decisiones cerradas
- [x] Alcance: **Enterprise local** (todo completo: kanban + CRUD + actividades + cotizador PDF + plantillas IA + scoring + recordatorios + import/export + multi-pipeline + roles UI + reportes)
- [x] Datos: **Híbrido** → Fase 1 LocalStorage + export/import JSON/CSV. Fase 2 migrar a Supabase + Auth real.
- [x] IA: **Mock inteligente local** (plantillas + heurística, sin key). Dejar `lib/ai.ts` preparado con switch a OpenAI en Fase 2.
- [x] Roles: **Solo UI multi-usuario visual**. Selector Admin/Vendedor/Gerente que filtra/oculta acciones, sin auth real. Auth real en Fase 2.
- [x] Navegación: **Sidebar + App Router con rutas reales**: `/pipeline`, `/leads`, `/cotizaciones`, `/reportes`, `/config`. Kanban como home `/`.
- [x] Visual: **shadcn/ui style + lucide-react + recharts**, drag&drop Kanban, tema oscuro pro. Sin instalar shadcn CLI pesado: componentes propios estilo shadcn + lucide + recharts.

## 3. Alcance Fase 1 — Definición de DONE (no avanzar sin esto)
### 3.1 Pipeline (Kanban) `/` y `/pipeline`
- [ ] Columnas por etapa del pipeline activo, drag&drop real (dnd-kit o html5 nativo sin lib extra si es posible; preferimos `@dnd-kit/core` liviano).
- [ ] Cards con: nombre, empresa, valor, score IA, próxima acción, vencimiento, tags, avatar responsable.
- [ ] Mover cambia etapa + registra actividad automática.
- [ ] Crear/editar/eliminar lead en modal. Validación.
- [ ] Buscador + filtros (etapa, responsable, score, vencimiento, tags).
- [ ] Contadores + total ponderado por columna.

### 3.2 Leads `/leads`
- [ ] Tabla completa con sort, búsqueda, filtros, paginación simple.
- [ ] Drawer detalle: datos, timeline actividades, cotizaciones asociadas, notas, tareas.
- [ ] Acciones: cambiar etapa, asignar, archivar/ganar/perder con motivo.

### 3.3 Actividades / Seguimientos
- [ ] Tipos: llamada, email, WhatsApp, reunión, nota, tarea.
- [ ] Crear con fecha, resultado, próxima acción + recordatorio (vencidos / hoy / próximos).
- [ ] Timeline por lead + vista global "Hoy" con vencimientos.

### 3.4 Cotizaciones `/cotizaciones`
- [ ] CRUD cotización: cliente, items (desc, cant, precio), descuento, impuestos, total auto.
- [ ] Generar PDF en cliente (jspdf) + vista previa imprimible.
- [ ] Asociar a lead, cambiar estado (borrador/enviada/aprobada/rechazada).
- [ ] Plantillas de correo/WhatsApp auto-rellenadas con datos cotización.

### 3.5 IA mock `/api`-like local `lib/ai.ts`
- [ ] `scoreLead(lead)` heurístico 0-100 con explicación (valor, etapa, actividad reciente, vencimiento).
- [ ] `suggestNextAction(lead)` regla inteligente.
- [ ] `generateEmail(lead, tono)` + `generateWhatsApp(lead)` plantillas en ES con variables.
- [ ] `summarizeLead(lead, actividades)` resumen ejecutivo.
- [ ] UI: botón en card + panel en detalle con copiar al portapapeles. Badge "IA local — conecta OpenAI en Fase 2".

### 3.6 Multi-pipeline + Config `/config`
- [ ] Múltiples pipelines (ej: Ventas SMB, Enterprise, Postventa) con etapas editables (CRUD, color, orden, probabilidad).
- [ ] Cambiar pipeline activo filtra todo.
- [ ] Gestión: usuarios visuales (nombre, rol, avatar), etiquetas, motivos pérdida, moneda, empresa.
- [ ] Reset demo + cargar seed.

### 3.7 Roles UI
- [ ] Switcher Admin / Gerente / Vendedor en sidebar.
- [ ] Admin: todo. Gerente: todo menos config avanzada. Vendedor: solo sus leads, sin borrar pipeline ni ver reportes globales de otros.
- [ ] Banner "Modo demo — auth real en Fase 2".

### 3.8 Reportes `/reportes`
- [ ] KPIs: total pipeline, ganados, tasa cierre, ticket medio, ciclo medio, actividades hoy/vencidas.
- [ ] Gráficos recharts: funnel por etapa, ganados por mes (mock 6 meses + real), motivos pérdida, por responsable.
- [ ] Export CSV.

### 3.9 Datos
- [ ] `lib/store.ts`: contexto + reducer + persist LocalStorage versionado `crm-ia-v1`.
- [ ] Seed realista 12-15 leads, 3 pipelines, 4 usuarios demo, actividades, 2 cotizaciones.
- [ ] Export/Import JSON total + Import/Export CSV leads.
- [ ] No romper SSR: `useEffect` + `typeof window` guards.

### 3.10 Calidad
- [ ] `npm run build` pasa sin errores ni warnings bloqueantes.
- [ ] Responsive (sidebar colapsable en móvil).
- [ ] README del proyecto actualizado con capturas + alcance + roadmap Fase 2.
- [ ] Commits por módulo + push + redeploy Vercel verificado.

## 4. Stack Fase 1 (solo lo confirmado en codebase)
- Next.js 14 App Router + TypeScript + Tailwind (ya instalado).
- Nuevo: `lucide-react`, `recharts`, `jspdf`, `@dnd-kit/core` (+ sortable si hace falta). Nada más sin confirmar.
- Sin shadcn CLI, sin Supabase, sin OpenAI, sin Prisma en Fase 1.

## 5. Fases siguientes (NO hacer ahora)
- Fase 2: Supabase (Postgres + Auth + RLS) + migración store, OpenAI real vía Route Handlers, envío Resend/WhatsApp Cloud API.
- Fase 3: mobile_projects fuerza-ventas offline-sync contra Supabase.
- Fase 4: automation cotizador-auto n8n.

## 6. Plan de implementación por lotes
1. Lote A: tipos + seed + store + layout sidebar + rutas base.
2. Lote B: pipeline Kanban drag&drop + modal lead + filtros.
3. Lote C: leads tabla + detalle drawer + actividades.
4. Lote D: cotizaciones + PDF + plantillas.
5. Lote E: IA mock lib + UI.
6. Lote F: reportes recharts + config multi-pipeline + roles + import/export.
7. Lote G: pulido, build, README, commit, push, verificar Vercel.
