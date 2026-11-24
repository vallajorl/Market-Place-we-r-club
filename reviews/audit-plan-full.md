# Full Spectrum Audit: web comercial we'r club (werclub-web)

**Fecha**: 23 de noviembre de 2026
**Modo**: Salud general del repo (Repo Health). La carpeta no es un repositorio git, así que no había diff ni rama que auditar.
**Fuente**: árbol de trabajo completo: 11 páginas HTML, `css/main.css` (1.967 líneas), `css/tokens.css`, 3 JS, assets y `serve.ps1`
**Verificación**: lectura completa del código y comprobación en el navegador sobre `http://localhost:8793`, a 375 px (móvil) y en escritorio
**Lentes ejecutadas**: 9/10
**Lentes omitidas**: Backend Engineer. No hay Rust/Tauri ni backend en este repo. Los stubs de `fetch` hacia Apps Script se revisan en Producción y Frontend.

> Nota de método: las lentes de audit-suite están pensadas para una app Tauri/React (“Orbit”). Aquí se han aplicado sus criterios a una web estática HTML/CSS/JS. Algunos apartados se han adaptado: por ejemplo, la lente DX revisa la experiencia de desarrollo de este repo y no la de una herramienta para desarrolladores.

---

## Veredicto global: NEEDS REWORK (antes de publicar)

La base visual y el copy están bien trabajados y el sistema de tokens es coherente, pero ahora mismo la web **no se puede publicar**. En móvil no hay navegación: el menú hamburguesa no abre nada y el CTA de la cabecera está oculto. Los tres formularios fingen éxito sin enviar datos. Dos CTAs llevan a 404 (`/demo` y `/contacto`). Hay textos legales en borrador con placeholders a la vista y varias promesas comerciales que se contradicen (precios, fechas de beta, contraseña frente a enlace mágico). Casi todo se arregla en uno o dos días. El problema de fondo es la duplicación del HTML en 11 páginas, que ya ha provocado desviaciones entre ellas.

## Veredicto por lente

| # | Lente | Veredicto | Críticos | Recomendaciones |
|---|------|---------|----------|-----------------|
| 1 | Design Engineer | APPROVE WITH CHANGES | 1 | 7 |
| 2 | UX Engineer | NEEDS REWORK | 4 | 7 |
| 3 | Frontend Engineer | NEEDS REWORK | 3 | 6 |
| 4 | Backend Engineer | Omitida | — | — |
| 5 | Structural Engineer | APPROVE WITH CHANGES | 0 | 5 |
| 6 | Repo Maintainer | APPROVE WITH CHANGES | 1 | 5 |
| 7 | Production Readiness | NEEDS REWORK | 5 | 6 |
| 8 | DX Engineer | APPROVE WITH CHANGES | 0 | 4 |
| 9 | Performance Engineer | APPROVE WITH CHANGES | 0 | 5 |
| 10 | Accessibility Engineer | NEEDS REWORK | 4 | 6 |

## Problemas críticos (hay que arreglarlos)

Deduplicados y ordenados por gravedad:

| # | Problema | Lente(s) | Archivo(s) | Impacto | Arreglo |
|---|-------|----------|---------|--------|-----|
| C1 | **En móvil no hay navegación.** `nav.js` añade `.is-open` a `.nav__links`, pero no existe ninguna regla CSS para `.is-open`, y además `.nav__cta .btn` se oculta por debajo de 720 px. Verificado a 375 px: tras pulsar el botón, la clase es `is-open` y `display` sigue en `none`. | UX, Frontend, A11y, Design | `css/main.css:1941`, `js/nav.js` | En móvil el visitante solo puede moverse con los CTAs del contenido. No puede llegar a Precios ni a Producto, ni encontrar “Entrar”. | Añadir el estilo del panel `.nav__links.is-open` (posición absoluta bajo la cabecera, columna, fondo `--c-ink`) e incluir dentro el CTA “Prueba gratis”. Añadir también `aria-controls`, `aria-expanded="false"` inicial, cierre con Esc y al pulsar un enlace. |
| C2 | **Los formularios fingen éxito.** `ENDPOINT = ''` en `alta.js` y `entrar.js` activa un “modo preview” que redirige a “Revisa tu email”. El formulario de contacto hace `action="#" method="post"`, sin JS. | Prod, UX, Frontend | `js/alta.js:20,86`, `js/entrar.js:11,23`, `legal/contacto/index.html` | Si se publica así, cada alta, login o consulta se pierde y el usuario cree que ha funcionado. Es el peor fallo posible en una web de captación. | Bloquear el modo preview fuera de `localhost` (o enseñar un error claro). Conectar el endpoint real. Para contacto, usar el mismo endpoint, un servicio de formularios o, como mínimo, un `mailto:`. |
| C3 | **CTAs rotos (404).** “Ver una demo de 2 minutos” lleva a `/demo` y el botón “Hablamos” del plan Federación lleva a `/contacto`. Verificados ambos con 404. | UX, Prod | `index.html:61`, `precios/index.html:125` | El CTA secundario de la home y el único CTA del plan más caro no llevan a ningún sitio. | `/contacto` → `/legal/contacto/`. Para `/demo`: grabar el vídeo, enlazar a contacto con motivo “demo” o quitar el enlace. |
| C4 | **Botones `btn--outline` sin estilo.** La clase solo está definida dentro de `.plan--featured`. Verificado: en Peña y Federación sale con `border: none` y fondo transparente, como texto suelto. | Design, Frontend | `css/main.css:1352`, `precios/index.html:82,125` | Dos de los tres CTAs de precios no parecen botones, justo en la página de conversión. | Definir `.btn--outline` globalmente (borde 1px `--c-ink`, hover) y dejar la variante oscura solo para el plan destacado. |
| C5 | **Legales en borrador y con placeholders públicos**: “[Razón social pendiente]”, “[NIF pendiente]”, “Versión 1.0 (borrador)”. Faltan también el aviso legal (LSSI art. 10) y una política de cookies. | Prod | `legal/*` | Sin titular identificado, la web incumple la LSSI y el RGPD, y transmite poca confianza justo al pedir datos. | Rellenar los datos del titular, añadir la página de aviso legal y pasar revisión de un abogado. Ya está en los pendientes del README, pero bloquea el lanzamiento. |
| C6 | **Mensajes comerciales contradictorios.** Precio “€—”. “Beta: gratis hasta 2026”, cuando ya estamos en noviembre de 2026. “Facturado anualmente” frente a la FAQ, que dice “mes a mes o año a año”. “Probar 30 días” frente a “Beta gratis”. La meta description promete “precios por confirmar en 2026”. Las condiciones dicen “cuida tu contraseña” en un producto sin contraseñas. | UX, Prod | `precios/index.html`, `legal/condiciones` | Resta credibilidad y puede dar problemas de consumo (lo que se ofrece no queda claro). | Decidir un único mensaje, por ejemplo: “Gratis durante la beta, sin tarjeta. Te avisamos 30 días antes de cobrar”. Quitar el “€—” y poner “Gratis en beta”. Alinear la facturación y las condiciones. |
| C7 | **El email del usuario viaja en la URL** (`/alta/enviada/?email=…`). | Prod, Frontend | `js/alta.js:113`, `js/entrar.js:52` | Datos personales en el historial, en los logs del servidor o de Cloudflare, en las analíticas y en el Referer. | Guardarlo en `sessionStorage` y leerlo en la página “enviada”. |
| C8 | **El logo no tiene nombre accesible.** Los `<span>` internos llevan `display:none`, así que el enlace queda vacío (verificado: `innerText === ""`). Pasa en la cabecera y en el pie de las 11 páginas. | A11y | `css/main.css:54`, todas las páginas | Un lector de pantalla anuncia “enlace” sin nombre. | `aria-label="we'r club, inicio"` en el enlace, o un `<img alt>` con el SVG en lugar del fondo CSS. |
| C9 | **Contraste insuficiente de blanco sobre naranja** (#F39200, 2,35:1). Afecta al CTA del plan destacado, la insignia “Recomendado”, los ticks y las etiquetas. El acento “club” en naranja sobre blanco tampoco llega a 3:1, ni siquiera en texto grande. | A11y, Design | `css/main.css:1345, 1254, 915…` | Falla WCAG AA. Es el CTA principal de la página de precios. | Para texto sobre naranja, usar `--c-ink` (8,9:1) o un naranja más oscuro (~#B86E00). Mantener #F39200 para superficies y decoración sin texto. |
| C10 | **Los mockups contaminan la estructura de la página.** En `producto/`, los `.appshot` llevan `aria-label` en un `div` sin rol (se ignora) y contienen `h2`/`h3` (“Socios”, “Hola, Jorge”, “Tienda”…) que se cuelan en el índice de encabezados. En la home, el `.phone` con `aria-hidden` contiene `<a href="#">` y `<button>` que se pueden enfocar. | A11y, Frontend | `producto/index.html`, `index.html:65-108` | Los usuarios de lector de pantalla navegan por títulos falsos, y el foco del teclado acaba en elementos invisibles para ellos. | Poner `role="img"` + `aria-label` en el contenedor y `aria-hidden="true"` en el contenido. Sustituir los `h2`/`h3` de los mockups por `div`, y los `a`/`button` por `span`, o añadir `inert`. |

## Problemas transversales

Problemas que señalan dos o más lentes:

| Problema | Señalado por | Causa de fondo | Arreglo conjunto |
|---------|-----------|------------|-------------|
| **Desviación entre páginas** (el CTA de cabecera falta en `*/enviada`, `alta` usa otro, el toggle no existe en las páginas de envío, las rutas CSS son relativas y las de assets absolutas) | Structural, Repo, UX, Frontend | Cabecera, pie y `<head>` copiados a mano en 11 archivos | Un generador estático mínimo (Eleventy, Astro o 11ty-like) con *layouts*/parciales, o como mínimo `<template>`/SSI. Así se arreglan C1 y C8 una sola vez. |
| **Promesas que el sitio no puede cumplir todavía** (formularios falsos, `/demo`, precios “—”, legales en borrador, “respondemos en 48 h”, “servidores europeos”, “Stripe (UE)”) | Prod, UX | La web se diseñó por delante del backend y del negocio | Una lista de “claims” revisada antes del lanzamiento. Lo que no sea cierto hoy se quita o se pone en futuro. |
| **Naranja sin rol definido** (#F39200 en tokens, #FF9500 en mockups, `theme-color`, manifest y favicon; #1C1B19 frente a `--c-ink` #0A0A0A) | Design, A11y | Los mockups de la app usan la paleta de la app y la web usa la suya | Fijar en `tokens.css` `--c-brand` y `--c-on-brand`. Usar los mismos valores en `theme-color` y en el manifest. Documentar que los mockups replican la app a propósito. |
| **Sin estados de foco ni de movimiento reducido propios** | A11y, Design, Frontend | No existe un sistema de estados interactivos | Una regla global `:focus-visible` con anillo de 2 px `--c-action` + offset, y `@media (prefers-reduced-motion)` que anule `scroll-behavior: smooth` y las transiciones. |
| **Privacidad incoherente con el propio sitio** (Google Fonts cargado desde Google sin mencionarlo, email en la URL, sin política de cookies) | Prod, Perf | Dependencias externas añadidas sin revisión legal | Alojar Inter (y Barlow) en el propio dominio. Así mejora además el rendimiento y desaparece una transferencia de datos. |

## Todas las recomendaciones

| # | Recomendación | Lente | Archivo(s) | Arreglo |
|---|---------------|------|---------|-----|
| R1 | La home es muy fina: hero y 3 pasos, sin prueba del producto, sin precios y sin confianza. Hay CSS ya escrito sin usar (`.stats-band`, `.features`). | UX, Design | `index.html` | Añadir un bloque de 3 funciones (material, cuotas, comunidad) con enlace a Producto, una franja de cifras o testimonio de un club piloto y un avance de precios. |
| R2 | El formulario de alta tiene 9 campos y promete “dos minutos”. | UX | `alta/index.html` | Dejar como obligatorios solo club, email, nombre y aceptación. Tipo, tamaño, cargo, teléfono y localidad pueden pedirse en el onboarding. |
| R3 | El plan Federación se puede elegir en el alta autoservicio, aunque su CTA dice “Hablamos”. | UX | `alta/index.html:159` | Quitarlo del `select`, o redirigir a contacto si se elige. |
| R4 | Los errores de formulario no se asocian a cada campo. | A11y, UX | `js/alta.js`, `js/entrar.js` | `aria-invalid`, `aria-describedby` con el mensaje junto al campo y foco en el primer campo con error. |
| R5 | El error `already_exists` ofrece “¿Quieres que te enviemos el enlace?” sin dar ninguna acción. | UX | `js/alta.js:118` | Añadir un enlace a `/entrar/` con el email ya rellenado. |
| R6 | La tabla de precios usa iconos SVG sin texto y “—” casi invisible (#E6E8EC sobre blanco, 1,2:1). | A11y | `precios/index.html` | `<span class="sr-only">Incluido</span>` / `No incluido`. Raya en `--c-mute`. Añadir `scope="col"`/`"row"` y `<caption>`. |
| R7 | Falta SEO básico: `og:title`, `og:description`, `og:url`, `canonical`, `robots.txt`, `sitemap.xml` y una página 404 propia. | Prod | todas | Añadirlos, mejor desde el layout compartido. |
| R8 | Hay unas 300 líneas de CSS sin usar (`vcard`, `qr-card`, `tesor`, `com-*`, `sal*`, `stats-band`, `features`). | Repo, Perf | `css/main.css` | Borrarlas o reutilizarlas en la home (R1). |
| R9 | Seis estilos de hero casi idénticos (`product-hero`, `p4c-hero`, `prc-hero`, `alta__title`, `login__title`, `sent__title`). | Structural, Design | `css/main.css` | Un componente `.page-hero` con modificadores. |
| R10 | `@import url("tokens.css")` encadena peticiones de forma bloqueante. | Perf | `css/main.css:1` | Concatenar los tokens en `main.css` o enlazar dos `<link>` en paralelo. |
| R11 | Estilos inline repartidos por el HTML (precios, enlaces de las páginas de envío, asteriscos). | Repo, Design | varias | Crear clases (`.plan__price-period`, `.req`, `.text-link`). |
| R12 | Fechas de los mockups mal calculadas: “Sáb 15 nov” cae en domingo en 2026, “martes 11 nov” en miércoles y “jueves 13 nov” en viernes. | Design, UX | `index.html`, `producto/` | Corregir o quitar el día de la semana. |
| R13 | Placeholders con un nombre y apellidos reales en los formularios. | UX, Prod | `alta/`, `legal/contacto/` | Usar un nombre genérico (“Ana García”). |
| R14 | El contacto vive en `/legal/contacto/`. | UX | estructura | Moverlo a `/contacto/` y redirigir. Así también se arregla C3. |
| R15 | `serve.ps1` muestra “Sirviendo…” y sale con código 0 aunque el puerto esté ocupado. El README habla de un `serve.pl` en Perl que no existe. | DX | `serve.ps1`, `README.md` | `try { $listener.Start() } catch { Write-Error …; exit 1 }`, y actualizar el README. |
| R16 | El proyecto no está bajo control de versiones (tiene `.gitignore`, pero no `git`). | Repo | raíz | `git init` y un primer commit antes de empezar los arreglos. |

---

# Informes por lente

---

## 1. Design Engineer

**Veredicto**: APPROVE WITH CHANGES

**Archivos revisados**: `css/tokens.css`, `css/main.css`, todas las páginas HTML y `assets/logo/*`.

### Críticos
| # | Problema | Archivo | Arreglo |
|---|---|---|---|
| D1 | `.btn--outline` sin estilo fuera del plan destacado (C4) | `main.css:1352` | Variante global |

### Recomendaciones
| # | Recomendación | Arreglo |
|---|---|---|
| D2 | El naranja aparece con tres valores (#F39200, #FF9500, `theme-color` #FF9500) y el negro con tres (#0A0A0A, #16181D, #1C1B19) | Tokens `--c-brand`/`--c-on-brand` y un valor por rol |
| D3 | Seis heros duplicados | `.page-hero` |
| D4 | Los mockups de la home (Inter, #F39200) y de producto (Barlow, #FF9500) parecen productos distintos | Unificar la home con el estilo `appshot`, que replica la app real |
| D5 | El `€—` de los precios parece un error de renderizado (visto en móvil) | Sustituirlo por un texto (“Gratis en beta”) |
| D6 | Estilos inline (`font-size:1rem;color:#B8BEC7` en el precio) saltándose los tokens | Clases |
| D7 | Sin estado `:focus-visible` diseñado | Anillo de foco con `--c-action` |
| D8 | El hover de `.club-type` declara una transición de `transform` que nunca se aplica | Quitarla, o dar un `translateY(-2px)` sutil |

### Cumplimiento del sistema de diseño
- Tokens de espaciado, radios y tipografía: **bien usados** en el 90 % del CSS.
- Los colores fuera de tokens se concentran en `.appshot*` (intencional, replica la app) y en `.alta__error`/`.alta__success`, que no tienen tokens semánticos de estado (`--c-danger`, `--c-success`).
- La regla “10 % color CTA = teal” se cumple salvo en el plan destacado (naranja con texto blanco, ver A11y).

### Cobertura de estados visuales
| Componente | Default | Hover | Focus | Active | Disabled | Error |
|---|---|---|---|---|---|---|
| `.btn--primary` | ✅ | ✅ | navegador | ❌ | ❌ (sin estilo de `disabled` mientras se envía) | — |
| `.btn--outline` | ❌ (solo en el plan destacado) | ❌ | navegador | ❌ | ❌ | — |
| `.btn--link` | ✅ | ✅ | navegador | ❌ | — | — |
| Inputs `.field` | ✅ | ❌ | ✅ | — | — | ❌ (sin `aria-invalid` ni borde rojo) |
| Menú móvil | ❌ | — | — | — | — | — |
| FAQ `details` | ✅ | ❌ | navegador | ✅ (rota la flecha) | — | — |

### Detalle del veredicto
- **Fidelidad a tokens**: buena.
- **Cobertura de estados**: floja (foco, disabled, error).
- **Modo oscuro**: no aplica. La web es clara a propósito, con bloques oscuros.
- **Animación**: mínima y correcta, aunque sin `prefers-reduced-motion`.
- **Consistencia**: rota entre páginas por la duplicación del HTML.

---

## 2. UX Engineer

**Veredicto**: NEEDS REWORK

### Mapa del recorrido del usuario
| Paso | Desktop | Móvil |
|---|---|---|
| Llega a la home | ✅ Mensaje claro, CTA visible | ✅ (el mockup se oculta) |
| Quiere ver más (Producto/Precios) | ✅ Nav | ❌ **El menú no abre** (C1) |
| “Ver demo” | ❌ 404 (C3) | ❌ 404 |
| Precios → elige plan | ⚠️ Los CTAs de Peña y Federación no parecen botones (C4), precio “€—” y mensaje beta contradictorio (C6) | ⚠️ ídem |
| Federación → “Hablamos” | ❌ 404 | ❌ 404 |
| Alta | ⚠️ 9 campos, Federación seleccionable | ⚠️ |
| Envío | ❌ Éxito simulado (C2) | ❌ |
| Página “Revisa tu email” | ✅ Clara | ⚠️ Sin menú ni CTA, la cabecera solo muestra el logo |
| Contacto | ❌ El formulario no envía nada | ❌ |

### Críticos
U1 = C1 (menú móvil), U2 = C2 (formularios simulados), U3 = C3 (404), U4 = C6 (mensajes contradictorios).

### Recomendaciones
R1 (home más completa), R2 (alta más corta), R3 (Federación), R5 (acción en `already_exists`), R12 (fechas), R13 (placeholders), R14 (`/contacto/`).

### Consistencia de interacción
- La cabecera cambia según la página: “Prueba gratis” en la mayoría, “Entrar” como `btn--link` en `alta`, nada en las páginas de envío.
- “Entrar” aparece a la vez como enlace de navegación y como CTA en `alta`.
- Los textos del CTA varían: “Prueba gratis”, “Prueba gratis 30 días”, “Empieza ahora”, “Probar 30 días”. Bien variar el tono, pero conviene que el CTA de la cabecera sea siempre el mismo.

### Detalle del veredicto
El copy es muy bueno: concreto, con voz propia y orientado al dolor (“grupo de WhatsApp con 180 personas”). Los fallos son de flujo, no de mensaje.

---

## 3. Frontend Engineer

**Veredicto**: NEEDS REWORK

### Análisis del flujo de renderizado
HTML estático, CSS único y JS con `defer`. Sin hidratación ni dependencias. `alta.js` y `entrar.js` son scripts clásicos con `const` de nivel superior, así que **no pueden convivir en una misma página** (las dos declaran `ENDPOINT`, `form`, `btn` y `showError`). Hoy no se cargan juntos, pero es frágil. Mejor `type="module"` o una IIFE como en `nav.js`.

### Seguridad de tipos y datos
- `form.club_name.value` y similares dependen de que exista cada `name`. Si se quita un campo (R2), el script falla con `TypeError` y deja de validar.
- `alta.js` no comprueba que `#alta-form` exista (`nav.js` sí lo hace).
- `res.json()` no está envuelto: si Apps Script devuelve HTML (pasa con los errores de despliegue), el usuario ve “Ha fallado la conexión”, que no es lo que ha ocurrido.
- `accepted_terms_at` se genera en el cliente y no vale como prueba del consentimiento. El backend debe registrar su propia hora, la versión de los textos aceptados y la IP.

### Críticos
F1 = C1 (falta la regla `.is-open`), F2 = C2 (modo preview que se publicaría tal cual), F3 = C10 (elementos enfocables dentro de `aria-hidden`).

### Recomendaciones
| # | Recomendación |
|---|---|
| F4 | Envolver `alta.js`/`entrar.js` en módulo o IIFE y protegerse con un `if (!form) return` |
| F5 | Leer los campos con `new FormData(form)` en vez de acceder por propiedad |
| F6 | Activar el modo preview solo si `location.hostname === 'localhost'` |
| F7 | Usar `AbortController` con *timeout* (~15 s) en el `fetch` |
| F8 | Email por `sessionStorage` (C7) |
| F9 | El script inline de las páginas `enviada` se debería mover a `js/` para poder aplicar una CSP sin `unsafe-inline` |

### Detalle del veredicto
El código es limpio y legible, pero el estado de “listo para producción” es engañoso: funciona en local precisamente porque simula el backend.

---

## 4. Backend Engineer

**Omitida**: no hay Rust/Tauri ni código de servidor en este repo. El contrato con el backend (Apps Script) está documentado en los comentarios de `alta.js` y `entrar.js`. Se revisa como frontera en Producción. Conviene que, al implementarlo, el backend valide todo de nuevo, limite peticiones por IP y por email (`entrar` puede usarse para mandar correos a terceros) y responda igual exista o no la cuenta (ya previsto en `entrar.js`).

---

## 5. Structural Engineer

**Veredicto**: APPROVE WITH CHANGES

### Mapa de dependencias
```
*.html ──► css/main.css ──@import──► css/tokens.css
       ──► js/nav.js (todas)
       ──► js/alta.js (alta) / js/entrar.js (entrar)
       ──► /assets/... (rutas absolutas)
       ──► fonts.googleapis.com (externo)
```

### Análisis de fronteras
- **HTML ↔ CSS**: BEM-ish consistente (`bloque__elemento--mod`), aunque con prefijos por página (`p4c-`, `prc-`, `cmp`), que mezclan “componente” con “página”.
- **Web ↔ backend**: el único punto de contacto es `ENDPOINT` en dos archivos. Conviene centralizarlo en `js/config.js`.
- **Rutas**: CSS y JS relativos (`../../css`) frente a assets absolutos (`/assets`). Hay que elegir uno; lo recomendable es absoluto en todo.

### Recomendaciones
| # | Recomendación |
|---|---|
| S1 | Layout compartido (cabecera, pie, `<head>`) mediante un generador estático: es el arreglo con más efecto |
| S2 | `main.css` (1.967 líneas) dividido en `base`, `components` y `pages/*`, o al menos con secciones ordenadas. Hoy hay dos bloques `@media (max-width: 920px)` separados |
| S3 | `.page-hero` común (R9) |
| S4 | `js/config.js` con `ENDPOINT` y helper `postJSON()` común a alta y entrar |
| S5 | Rutas absolutas en todo |

---

## 6. Repo Maintainer

**Veredicto**: APPROVE WITH CHANGES

### Lista de convenciones
| Convención | Estado |
|---|---|
| Control de versiones | ❌ No es repo git (hay `.gitignore`) |
| README al día | ⚠️ Menciona `serve.pl`/Perl y `../.claude/serve.pl`, que no existen. El `launch.json` usa `serve.ps1` |
| Pendientes documentados | ✅ README “Pendientes” (útil y honesto) |
| Sin código muerto | ❌ ~300 líneas de CSS sin uso (R8) |
| Sin estilos inline | ❌ (R11) |
| Nombres consistentes | ✅ BEM |
| Formato | ✅ Indentación coherente, aunque hay CSS en una línea mezclado con CSS en varias |

### Oportunidades de reutilización
- `.check`/tick SVG repetido 30 veces en la tabla de precios: mejor un pseudo-elemento, como ya hacen `.plan__list li::before`.
- Las listas con tick (`feat__list`, `plan__list`, `alta__bullets`, `compare__list`) repiten el mismo SVG en data-URI cuatro veces. Una utilidad `.list-check` bastaría.

### Crítico
RM1: sin git no hay historial ni forma de revisar o revertir los arreglos de esta auditoría. Hay que hacer `git init` antes de tocar nada.

---

## 7. Production Readiness

**Veredicto**: NEEDS REWORK

### Análisis de modos de fallo
| Escenario | Qué pasa hoy | Qué debería pasar |
|---|---|---|
| Se publica sin `ENDPOINT` | Altas y logins “exitosos” que se pierden | Error visible o formulario deshabilitado |
| Apps Script devuelve 302/HTML | `res.json()` lanza y se muestra “Ha fallado la conexión” | Mensaje genérico y log del error |
| Apps Script tarda más de 30 s | El botón se queda en “Creando tu club…” sin límite | *Timeout* y reintento |
| Alguien abusa de `/entrar` para mandar correos | Depende del backend (sin límite visible) | Límite de peticiones y captcha invisible |
| Ruta inexistente | Texto plano “404” en local. En producción depende del hosting | `404.html` con la marca |
| Envío de contacto | POST a `#`: se recarga la página y el usuario cree que se ha enviado | Envío real o `mailto:` |

### Checklist de entorno
| Elemento | Estado |
|---|---|
| `robots.txt` / `sitemap.xml` | ❌ |
| `canonical`, `og:title`, `og:description`, `og:url` | ❌ (solo `og:image`) |
| OG image por página | ❌ (pendiente en el README) |
| 404 propia | ❌ |
| Cabeceras de seguridad (CSP, HSTS, X-Content-Type-Options, Referrer-Policy) | ❌ No hay `_headers` (en Cloudflare Pages se configuran con ese archivo) |
| Caché de assets | ❌ (`serve.ps1` usa `no-store`, bien para desarrollo, pero falta la configuración de producción) |
| Analítica / medición de conversión | ❌ No hay nada. Hace falta saber si el embudo funciona (algo respetuoso con la privacidad: Plausible o Cloudflare Web Analytics) |
| Aviso legal LSSI y política de cookies | ❌ |
| `noindex` en alta, entrar y las páginas de envío | ✅ Bien hecho |

### Afirmaciones a verificar antes de publicar
“Cumplimos RGPD y los datos se alojan en servidores europeos”, “Stripe (UE)”, “Google LLC… (UE)”, “Respondemos en menos de 48 horas laborables”, “Soporte L–V de 9 a 18 h”, “cifrado en reposo, registro de auditoría, pruebas periódicas de restauración”, “Resend / Postmark” (hay que elegir uno). Hay que confirmar cada una o reformularla.

### Críticos
P1 = C2, P2 = C3, P3 = C5, P4 = C6, P5 = C7.

### Recomendaciones
R7, analítica, `_headers`, Google Fonts alojado en el propio dominio (recogido en la política de privacidad), `accepted_terms_at` registrado en el servidor, revisión de las afirmaciones.

---

## 8. DX Engineer

**Veredicto**: APPROVE WITH CHANGES

### Auditoría de mensajes de error
| Origen | Mensaje | Problema |
|---|---|---|
| `serve.ps1` con el puerto ocupado | Excepción en español con caracteres mal codificados, después “Sirviendo … en http://localhost:8793/” y salida con código 0 | Dice que funciona cuando no funciona (comprobado en esta auditoría). Hay que capturar la excepción, explicar “puerto ocupado, ¿ya hay otro servidor?” y salir con `exit 1` |
| `alta.js` sin endpoint | Silencio | Un `console.warn('[werclub] ENDPOINT vacío: modo preview')` evitaría sorpresas |

### Recorrido de un desarrollador
1. Lee el README: le dice que use Perl con una ruta que no existe. ❌
2. `launch.json` → `serve.ps1`: funciona. ✅
3. Cambia la cabecera: tiene que editar 11 archivos. ❌
4. Comprueba los enlaces: no hay ningún verificador. Se recomienda `lychee` o un script.

### Recomendaciones
R15, README actualizado, verificador de enlaces, `console.warn` en el modo preview.

---

## 9. Performance Engineer

**Veredicto**: APPROVE WITH CHANGES

### Presupuesto de recursos (home)
| Recurso | Tamaño aprox. | Nota |
|---|---|---|
| HTML | 6,5 KB | ✅ |
| `main.css` + `tokens.css` | ~50 KB sin comprimir, ~9 KB gzip | ⚠️ ~15 % es código muerto |
| CSS de Google Fonts + 5 pesos de Inter (woff2) | ~100–150 KB | ⚠️ Bloquea el renderizado y depende de un tercero |
| Barlow Condensed (solo producto) | +3 pesos | ⚠️ Solo se usa en los mockups |
| JS | <2 KB | ✅ |
| Imágenes | 0 en el cuerpo (mockups en CSS) | ✅ Excelente para LCP |

### Ruta crítica
`HTML → main.css → @import tokens.css` (segunda vuelta) `→ fonts.googleapis.com CSS → fonts.gstatic.com woff2`. Son cuatro saltos en serie antes de mostrar texto con la fuente final. `display=swap` evita el texto invisible, pero causa un salto de maquetación al cambiar de fuente.

### Recomendaciones
| # | Recomendación |
|---|---|
| PF1 | Fusionar los tokens en `main.css` (quita una vuelta de red) |
| PF2 | Alojar Inter como fuente variable (un solo woff2 de ~50 KB con subconjunto latino) con `preload` |
| PF3 | Ajustar la fuente de reserva (`size-adjust`) para reducir el salto de maquetación |
| PF4 | Borrar el CSS muerto |
| PF5 | Caché larga e inmutable para `/assets` y `/css` con nombres versionados, y `no-cache` para el HTML |

### Detalle del veredicto
Es una web muy ligera. Los únicos cuellos de botella son las fuentes y el `@import`.

---

## 10. Accessibility Engineer

**Veredicto**: NEEDS REWORK

### Recorrido con teclado (home, desktop)
1. Tab → logo: el foco se ve, pero el lector anuncia “enlace” sin nombre (C8). ❌
2. Inicio, Producto… ✅
3. “Prueba gratis” ✅
4. Hamburguesa (oculta en desktop) ✅
5. Hero CTAs ✅ (el segundo lleva a un 404)
6. **El foco entra en el mockup `aria-hidden`**: “Ver todo”, “Reservar kit”, “Coche compartido” (C10). ❌
7. Pie ✅
- **No hay enlace de “Saltar al contenido”.** ❌

### Móvil (375 px)
Hamburguesa sin `aria-expanded` inicial ni `aria-controls`. Al activarla no aparece nada (C1).

### Checklist ARIA y semántica
| Elemento | Estado |
|---|---|
| `lang="es"` | ✅ |
| Landmarks `header`/`nav`/`main`/`footer` | ✅ (el `footer-cta` queda fuera de `main`; es aceptable) |
| `nav` principal con `aria-label` | ❌ (el subnav de producto sí lo tiene) |
| `aria-current="page"` | ✅ |
| Jerarquía de encabezados | ❌ en producto (mockups) y en la home (`h3` del mockup) |
| Formularios: `label for` | ✅ en todos |
| `autocomplete` | ✅ en el alta. ❌ en contacto |
| Errores: `role="alert"` | ✅. ❌ falta `aria-invalid` y la asociación con cada campo |
| Tabla: `th` en filas | ✅. ❌ falta `scope` y `caption`, y los iconos no tienen texto |
| `autofocus` en entrar | ⚠️ Aceptable en una página de un solo campo |
| Contraste | ❌ blanco sobre naranja 2,35:1. ❌ guion de la tabla 1,2:1. ✅ `--c-mute` sobre blanco ~5,9:1. ✅ pie #9A9FA7 sobre #050505 ~7,6:1 |
| `prefers-reduced-motion` | ❌ |
| `:focus-visible` propio | ❌ (depende del navegador; aceptable, pero mejorable) |

### Críticos
A1 = C1, A2 = C8, A3 = C9, A4 = C10.

### Recomendaciones
Enlace de salto, `aria-label` en el `nav`, R4, R6, `:focus-visible` y `prefers-reduced-motion`.

---

# Plan de mejoras propuesto

## Fase 0 · Preparación (30 min)
1. `git init` y commit del estado actual.
2. Arreglar `serve.ps1` (salir con error si el puerto está ocupado) y el README.

## Fase 1 · Bloqueantes de lanzamiento (1–2 días)
1. **Menú móvil** funcional y accesible, con el CTA dentro (C1).
2. **`.btn--outline` global** (C4).
3. **Enlaces rotos**: `/contacto` → `/legal/contacto/` (o mover contacto a `/contacto/`). Decidir qué hacer con `/demo` (C3).
4. **Formularios**: modo preview solo en localhost, conectar el endpoint de Apps Script y dar un envío real al formulario de contacto (C2).
5. **Email fuera de la URL** (C7).
6. **Un único mensaje de precios y beta**: quitar “€—”, corregir “hasta 2026” y la facturación, y quitar “contraseña” de las condiciones (C6).
7. **Legales**: datos del titular, aviso legal LSSI, cookies y revisión de un abogado (C5).
8. **Accesibilidad mínima**: nombre del logo, mockups con `role="img"`/`inert` y contraste del naranja (C8–C10).

## Fase 2 · Calidad y conversión (2–4 días)
1. Layout compartido con un generador estático: cabecera, pie y `<head>` en un solo sitio, con meta OG y `canonical` por página.
2. Home más completa: funciones, prueba social y avance de precios (R1).
3. Alta en 4 campos y Federación hacia contacto (R2, R3, R5).
4. Errores por campo, `:focus-visible`, enlace de salto, `prefers-reduced-motion` y tabla accesible (R4, R6).
5. `robots.txt`, `sitemap.xml`, `404.html`, `_headers` con CSP y caché, y analítica respetuosa con la privacidad.

## Fase 3 · Mantenimiento y rendimiento (1–2 días)
1. Tokens `--c-brand`/`--c-on-brand`, un solo naranja y `theme-color` coherente.
2. `.page-hero`, `.list-check` y borrado de unas 300 líneas de CSS muerto.
3. Fuentes alojadas en el propio dominio (variable, subconjunto latino, `preload`) y tokens fusionados en `main.css`.
4. Revisión de todas las afirmaciones comerciales y legales frente a la realidad del producto.
5. Verificador de enlaces en el flujo de trabajo.
