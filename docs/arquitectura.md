# Arquitectura de la información — werclub.com

Documento vivo. Describe qué páginas hay, para qué sirve cada una y en qué orden cuenta las cosas. Antes de tocar contenido, ajusta este documento primero.

## Mapa del sitio

```
/                    Home: convencer y llevar a la prueba
├── /producto/       Qué hace la app, módulo a módulo
├── /para-clubs/     Si encaja en mi club (tipos de club y roles)
├── /precios/        Cuánto cuesta y qué plan elegir
├── /contacto/       Hablar con una persona (demos, dudas, Federación)
├── /alta/           Crear el club (conversión)
│   └── /alta/enviada/
├── /entrar/         Acceso de clubs que ya existen
│   └── /entrar/enviado/
└── /legal/
    ├── privacidad/
    └── condiciones/
```

Cambios respecto a la versión inicial:
- Contacto pasa de `/legal/contacto/` a `/contacto/`, porque es una página comercial y no legal.
- “Inicio” sale del menú (para eso está el logo) y entra “Contacto”.
- “Entrar” pasa a ser un enlace discreto junto al CTA, porque solo lo usan los clientes.
- El bloque “Antes / Después” pasa de Para clubs a la home: es el argumento principal y tiene que verse primero.
- Se quita el enlace a `/demo`, que no existía. Si se graba un vídeo, se puede recuperar.

## Navegación

| Zona | Contenido |
|---|---|
| Cabecera | Logo · Producto · Para clubs · Precios · Contacto · Entrar · **Prueba gratis** |
| Móvil (≤ 900 px) | La misma, desplegada desde el botón de menú |
| Pie | Marca + frase · Producto (6 módulos) · Clubs (Para clubs, Precios, Crear un club, Entrar) · Ayuda (Contacto, Privacidad, Condiciones) |

La cabecera, el pie y el `<head>` común se editan **solo** en `_partials/` y se copian con `node tools/partials.mjs`.

## Recorrido principal

```
Home ──► Producto / Para clubs ──► Precios ──► Alta ──► Revisa tu email
  └──────────────── CTA “Prueba gratis” en cada página ────────┘
Precios (Federación) ──► Contacto
```

## Estructura de cada página

### Home: “¿Esto es para mí y por qué?”
1. **Hero**: promesa (“Tu club, en orden. Y en el bolsillo.”) + CTA + mockup de la app.
2. **El problema**: Antes / Después. Excel, WhatsApp y cuaderno frente a una sola app.
3. **Producto**: los 6 módulos en tarjetas, cada una enlazada a su sección en /producto/.
4. **Para quién**: 4 tipos de club + enlace a /para-clubs/.
5. **Cómo empezar**: 3 pasos.
6. **Avance de precios**: 3 planes y prueba gratis, con enlace a /precios/.
7. **CTA final**.

### Producto: “¿Qué hace exactamente?”
Hero → subnavegación fija → 6 secciones (Socios, Material, Actividades, Comunidad, Merchandising, Escuela), cada una con texto, lista y captura → CTA.

### Para clubs: “¿Encaja en mi tipo de club?”
Hero → Tipos de club (4) → Roles (socio, monitor, tesorería, junta) → CTA.

### Precios: “¿Cuánto y cuál elijo?”
Hero → 3 planes → tabla comparativa → FAQ → CTA.

### Contacto
Canales (comercial, soporte, privacidad, prensa) + formulario.

## Pendiente de decidir (contenido)
- **Mensaje de precios y beta**: precio real o “gratis durante la beta”; facturación mensual o anual. Hoy se contradicen.
- **Prueba social**: ¿hay clubs piloto que se puedan nombrar? Encajaría entre “Producto” y “Para quién”.
- **Demo**: ¿vídeo de 2 minutos, demo en directo por contacto o nada?
- **Mockups**: el de la home (estilo web) y los de producto (estilo app real) no se parecen. Hay que elegir uno.

## Aplazado hasta preparar la publicación
Legales (titular, aviso legal, cookies), conexión de formularios al backend, email fuera de la URL, SEO (OG por página, canonical, sitemap, robots, 404), cabeceras de seguridad, analítica, fuentes alojadas en el propio dominio y revisión de las afirmaciones comerciales. Detalle completo en `reviews/audit-plan-full.md`.
