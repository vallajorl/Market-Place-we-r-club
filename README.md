# werclub-web

Sitio comercial de **we'r club** — `werclub.com`.

HTML + CSS + JS estático, sin build. Se sirve en local con el `serve.pl` de este workspace.

## Estructura

- `index.html` — home
- `producto/` — página de producto (6 secciones: socios, material, actividades, comunidad, merchandising, escuela)
- `para-clubs/` — tipos de club, roles y comparativa antes/después
- `precios/` — 3 planes + tabla comparativa + FAQ
- `alta/` — alta self-service con enlace mágico al email
- `entrar/` — login mágico
- `legal/` — privacidad, condiciones, contacto
- `assets/` — logos SVG, favicons y OG image
- `css/` — tokens y main
- `js/` — nav, alta, entrar

## Desarrollo

```bash
perl ../.claude/serve.pl 8793 .
```

O desde la raíz del workspace, con el preview del launch.json `werclub-web` (puerto 8793).

## Pendientes

- Precios finales en las tarjetas de planes.
- Datos del responsable (razón social, NIF, dirección, localidad del fuero) en los legales.
- ENDPOINT del Apps Script en `js/alta.js` y `js/entrar.js` cuando esté el backend en clubs-app.
- OG image específica por página.
- Revisión legal por abogado.
