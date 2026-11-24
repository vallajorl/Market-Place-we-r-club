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
- `contacto/` — canales y formulario de contacto
- `legal/` — privacidad y condiciones
- `_partials/` + `tools/partials.mjs` — cabecera, pie y head compartidos
- `docs/arquitectura.md` — mapa del sitio y estructura de cada página
- `assets/` — logos SVG, favicons y OG image
- `css/` — tokens y main
- `js/` — nav, alta, entrar

## Desarrollo

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1 -Port 8793
```

O con el preview `werclub-web` de `.claude/launch.json`. Después, abre http://localhost:8793/.

### Cabecera, pie y `<head>` compartidos

Están en `_partials/` (`head.html`, `header.html`, `footer.html`). Cada página tiene marcadores
`<!-- partial:NOMBRE -->…<!-- /partial:NOMBRE -->` y su contenido se genera. **No lo edites a mano.**
Después de cambiar un parcial:

```powershell
node tools/partials.mjs
```

`node tools/partials.mjs --check` solo comprueba si alguna página está desactualizada.
El enlace de la sección activa se marca solo con `aria-current="page"`.

La arquitectura de la información (mapa del sitio, navegación y orden de cada página) está en
[`docs/arquitectura.md`](docs/arquitectura.md).

## Pendientes

- Precios finales en las tarjetas de planes.
- Datos del responsable (razón social, NIF, dirección, localidad del fuero) en los legales.
- ENDPOINT del Apps Script en `js/alta.js` y `js/entrar.js` cuando esté el backend en clubs-app.
- OG image específica por página.
- Revisión legal por abogado.
