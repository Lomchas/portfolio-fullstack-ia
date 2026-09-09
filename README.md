# 💼 Portfolio Projects — Fullstack + IA + Automatización para Ventas

Monorepo de portafolio de **Daniel Losada**: proyectos Fullstack (Web y Mobile) + Automatización de procesos + Integración de IA para negocios y equipos de ventas.

> 🎯 Objetivo: demostrar que puedo construir productos completos (frontend + backend + mobile), automatizar ventas/operaciones e integrar IA (chatbots, RAG, agentes, CRM inteligente).

## 🗂️ Estructura (monorepo)

```text
portfolioProjects/
├── frontend_projects/        → Apps web desplegables en Vercel / Netlify (una por subcarpeta)
├── backend_projects/         → APIs desplegables en Render / Railway / Fly.io
├── mobile_projects/          → Apps Expo / React Native (build con EAS, no se despliegan en Vercel)
├── automation_ai_projects/   → Automatizaciones n8n / scripts / agentes IA / bots WhatsApp
├── shared/                   → UI kit, utils y tipos compartidos (opcional)
├── docs/                     → Guías de despliegue y arquitectura
└── README.md
```

> ✅ Este repo es un **monorepo**: UN solo repositorio de GitHub, MUCHOS despliegues. Cada subcarpeta = 1 proyecto = 1 sitio/servicio en Vercel/Render/etc.

## 🚀 Cómo se despliega desde subcarpetas (resumen)

| Hosting | ¿Soporta subcarpeta? | Cómo se configura |
|---|---|---|
| **Vercel (frontend)** | ✅ Sí | Importas el MISMO repo N veces → en cada proyecto pones `Root Directory = frontend_projects/mi-app` |
| **Netlify (frontend)** | ✅ Sí | `Base directory = frontend_projects/mi-app` + `Build command` + `Publish directory` |
| **Render (backend)** | ✅ Sí | `Root Directory = backend_projects/mi-api` + `Build/Start Command` |
| **Railway (backend)** | ✅ Sí | `Settings → Source → Root Directory` |
| **GitHub Pages** | ⚠️ Solo 1 sitio por repo | No recomendado para monorepo. Usa Vercel mejor. |
| **Expo EAS (mobile)** | ✅ Sí | `app.config.js` por app en `mobile_projects/mi-app` |

📖 Guía completa paso a paso: [`docs/GUIA_DESPLIEGUE.md`](./docs/GUIA_DESPLIEGUE.md)

## 🧠 Proyectos sugeridos para tu perfil (los creamos aquí)

1. **CRM de Ventas con IA** (web fullstack) → Next.js + Supabase + OpenAI. Kanban, scoring de leads, asistente que redacta correos.
2. **E-commerce + Chatbot vendedor** (web + IA) → Catálogo + carrito + bot RAG que vende por WhatsApp/Web.
3. **App Móvil de Fuerza de Ventas** (mobile) → Expo + catálogo offline + pedidos + sincronización.
4. **Automatizador de Cotizaciones** (automatización) → Form → genera PDF → envía por email/WhatsApp + guarda en CRM (n8n + API).
5. **Dashboard de Ventas con predicción IA** (web + backend) → KPIs + forecast + alertas.
6. **API de Integración IA** (backend) → Endpoints para embeddings, transcripción, scoring.

## 🛠️ Stack recomendado

- **Web:** Next.js 14 (App Router) + Tailwind + TypeScript → ideal para Vercel
- **Backend:** Node.js (NestJS/Express) o Python (FastAPI) + PostgreSQL (Supabase/Neon)
- **Mobile:** Expo (React Native)
- **IA/Automatización:** OpenAI API, LangChain, n8n, WhatsApp Cloud API, Stripe, Resend

## ▶️ Cómo usar este repo en local

```bash
# 1. Clonar (cuando ya esté en GitHub)
git clone https://github.com/TU-USUARIO/TU-REPO.git
cd TU-REPO

# 2. Entrar a un proyecto y correrlo
cd frontend_projects/01-crm-ventas-ia
npm install
npm run dev
```

## 📦 Convención de nombres (importante para Vercel)

Usa `kebab-case`, sin espacios, sin tildes, sin mayúsculas:

- ✅ `01-crm-ventas-ia`
- ❌ `1. Proyecto` ← renombrar (los espacios y puntos rompen builds)

---
Hecho con ❤️ para conseguir clientes y empleo Fullstack + IA.
