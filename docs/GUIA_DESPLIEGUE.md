# Guía de Despliegue desde Subcarpetas (Monorepo)

Sí: **GitHub + Vercel (y Render/Railway/Netlify) soportan desplegar desde subcarpetas**. El truco se llama `Root Directory`.

## 1. Crear el repo en GitHub (lo haces tú)

1. Ve a https://github.com/new
2. `Repository name`: `portfolio-fullstack-ia` (o el que quieras)
3. `Public` (para portafolio mejor público)
4. **NO marques** `Add a README` ni `.gitignore` (ya los tenemos aquí) → `Create repository`
5. GitHub te mostrará la URL, ej: `https://github.com/daniellosada17/portfolio-fullstack-ia.git`
6. Luego pegas aquí esa URL y yo te conecto el push, o ejecutas tú:

```bash
cd "c:\Users\px06974\OneDrive - Renault\Escritorio\portfolioProjects"
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git branch -M main
git push -u origin main
```

## 2. Desplegar un frontend en Vercel desde subcarpeta

Repite esto por CADA app web:

1. https://vercel.com/new → `Import` tu repo `portfolio-fullstack-ia`
2. En `Configure Project`:
   - `Framework Preset`: Next.js (o Vite/React según el proyecto)
   - **`Root Directory`: `frontend_projects/01-crm-ventas-ia`** ← CLAVE. Dale a `Edit` y elígela.
   - `Build Command`: `npm run build` (por defecto)
   - `Output`: por defecto
3. `Environment Variables`: agrega las de esa app (`NEXT_PUBLIC_API_URL`, `OPENAI_API_KEY`, etc.)
4. `Deploy` → te da URL: `https://01-crm-ventas-ia.vercel.app`
5. Para la 2ª app: `Add New → Project → Import` **el MISMO repo** → `Root Directory`: `frontend_projects/02-ecommerce-chatbot` → Deploy.

> 💡 Vercel detecta pushes a `main` y redespliega solo el proyecto cuya `Root Directory` cambió (si activas `Ignored Build Step` o con Turborepo, aún mejor).

## 3. Desplegar backend en Render (ejemplo)

1. https://dashboard.render.com → `New → Web Service` → conecta el repo.
2. **`Root Directory`: `backend_projects/01-api-ventas-ia`**
3. `Build Command`: `npm install && npm run build` (o `pip install -r requirements.txt` si es Python)
4. `Start Command`: `npm start` (o `uvicorn main:app --host 0.0.0.0 --port $PORT`)
5. Agrega `Environment Variables` + `Health Check Path`: `/health`
6. Deploy → te da `https://mi-api.onrender.com`

En Railway es igual: `Settings → Source → Root Directory`.

## 4. Qué NO hacer

- ❌ No pongas un solo `package.json` en la raíz que intente buildear todo junto.
- ❌ No uses espacios/acentos en carpetas: `1. Proyecto` → renombrar a `01-crm-ventas-ia`.
- ❌ No subas `.env` con keys reales. Usa `.env.example` + variables en Vercel/Render.
- ❌ No intentes múltiples sitios con GitHub Pages en el mismo repo (solo permite 1).

## 5. Estructura ideal por proyecto frontend (para que Vercel no falle)

```text
frontend_projects/01-crm-ventas-ia/
├── package.json      ← obligatorio (name, scripts dev/build/start)
├── next.config.js    ← o vite.config.ts
├── public/
├── src/
├── .env.example      ← ejemplo sin secretos
└── README.md         ← qué es + link demo + capturas
```

## 6. Comandos Git de todos los días (monorepo)

```bash
# ver estado
git status

# agregar solo un proyecto (mejor que git add .)
git add frontend_projects/01-crm-ventas-ia

# commit por proyecto (portafolio limpio)
git commit -m "feat(crm): kanban inicial + scoring IA"

# subir
git push
```
