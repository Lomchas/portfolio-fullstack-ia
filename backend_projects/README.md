# Backend Projects (desplegables en Render / Railway)

Cada subcarpeta aquí es **1 API independiente** con su propio `package.json` o `requirements.txt`.

## Reglas:
1. Nombre `kebab-case`: `01-api-ventas-ia`, `02-api-cotizador`, etc.
2. Debe exponer `GET /health` para healthchecks del hosting.
3. Usa variables de entorno (`process.env` / `os.getenv`), nunca hardcodees keys.

## Próximos proyectos a crear:
- [ ] `01-api-ventas-ia` — leads, scoring, emails con IA
- [ ] `02-api-cotizador-pdf` — genera PDF + envía WhatsApp/email
