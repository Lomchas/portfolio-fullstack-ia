# Frontend Projects (desplegables en Vercel / Netlify)

Cada subcarpeta aquí es **1 app web independiente** con su propio `package.json`.

## Reglas:
1. Nombre `kebab-case`: `01-crm-ventas-ia`, `02-ecommerce-chatbot`, etc.
2. Cada app debe poder correr sola:
   ```bash
   cd frontend_projects/01-crm-ventas-ia
   npm install
   npm run dev
   ```
3. Cada app se conecta a Vercel como proyecto separado (mismo repo, distinto `Root Directory`).

## Próximos proyectos a crear:
- [ ] `01-crm-ventas-ia` — Kanban + scoring + asistente IA
- [ ] `02-ecommerce-chatbot` — Tienda + bot vendedor
- [ ] `03-dashboard-ventas-ia` — KPIs + forecast
