# PROMPT PARA REPLIT AGENT — Web de Albaria Solutions
## Pega esto ENTERO en Replit Agent en tu cuenta nueva

---

Construye una web profesional de una sola página (index.html) para **Albaria Solutions**, una empresa de agentes de inteligencia artificial y automatización para empresas B2B industriales.

La web debe ser de máxima calidad visual — fondo oscuro, tipografía limpia, animaciones sutiles. Similar en estilo a las webs de empresas como Vercel, Linear o Anthropic. Sin Bootstrap. CSS propio puro.

---

## IDENTIDAD VISUAL

```
Fondo principal:     #0A0A0F
Fondo cards:         #111118
Fondo hover:         #1a1a2a
Acento principal:    #6366F1  (índigo eléctrico)
Acento secundario:   #10B981  (verde para CTAs activos)
Texto principal:     #F8FAFC
Texto secundario:    #94A3B8
Borde sutil:         #1e1e2e
Tipografía:          Inter (importar de Google Fonts)
Border radius:       8px cards, 6px botones
```

## LOGO

En el navbar, donde va el logo, pon el texto **"ALBARIA"** en Inter Bold, color blanco, tamaño 22px. Delante del texto pon un símbolo SVG inline simple — un círculo con 3 órbitas entrecruzadas en color #6366F1, tamaño 28px. Este símbolo representa el logo de Albaria.

El SVG del símbolo es este:
```svg
<svg width="28" height="28" viewBox="0 0 28 28" fill="none">
  <circle cx="14" cy="14" r="3" fill="#6366F1"/>
  <ellipse cx="14" cy="14" rx="12" ry="5" stroke="#6366F1" stroke-width="1.5" fill="none"/>
  <ellipse cx="14" cy="14" rx="12" ry="5" stroke="#6366F1" stroke-width="1.5" fill="none" transform="rotate(60 14 14)"/>
  <ellipse cx="14" cy="14" rx="12" ry="5" stroke="#6366F1" stroke-width="1.5" fill="none" transform="rotate(120 14 14)"/>
</svg>
```

---

## ESTRUCTURA DE LA WEB

### 1. NAVBAR (fijo en scroll)
- Logo (símbolo SVG + "ALBARIA") a la izquierda
- Links de navegación a la derecha: Herramientas · Demos · Contacto
- Botón CTA: "Hablar con Jaime" → abre mailto:jaime@albariasolutions.com
- Fondo: #0A0A0F con blur backdrop cuando hay scroll
- Borde inferior sutil: 1px solid #1e1e2e

### 2. HERO SECTION
Centrado. Padding top grande (120px).

Badge pequeño arriba: `⚡ Agentes de IA para empresas B2B` — fondo #1a1a2a, borde #6366F1 con opacidad 0.3, texto #6366F1, border-radius 20px, padding 6px 14px, font-size 13px.

Título principal (h1, 56px, font-weight 600, line-height 1.15):
```
Tu equipo de IA.
Ya funcionando.
```
La palabra "IA" en color #6366F1.

Subtítulo (18px, color #94A3B8, max-width 560px, margin auto):
```
Agentes de inteligencia artificial para empresas industriales.
Detecta clientes, genera ofertas y automatiza soporte técnico
sin contratar ni un empleado más.
```

Dos botones centrados con gap 12px:
- Botón primario: "Ver demos en vivo →" — fondo #6366F1, texto blanco, hover fondo #5254cc
- Botón secundario: "Hablar con Jaime" — fondo transparente, borde #1e1e2e, texto #94A3B8, hover borde #6366F1 texto blanco

Debajo de los botones, a 48px: una línea de texto pequeño (13px, #94A3B8):
```
3 herramientas en producción · Empresas industriales B2B · Valencia, España
```

### 3. SECCIÓN "HERRAMIENTAS EN PRODUCCIÓN"
Título centrado (13px, uppercase, letter-spacing 2px, color #6366F1):
```
HERRAMIENTAS DISPONIBLES AHORA
```

Grid de 3 cards. Cada card: fondo #111118, borde 1px solid #1e1e2e, border-radius 12px, padding 28px, hover con borde #6366F1 opacity 0.4 y transform translateY(-2px), transition suave.

**Card 1 — Lead Generator Engine**
- Icono: 🎯 en círculo fondo #1a1a2a, 40px
- Título: "Lead Generator Engine" (16px, font-weight 500, blanco)
- Descripción: "Detecta empresas que encajan con tu perfil de cliente ideal — incluyendo las que ninguna herramienta estándar ve. Informes con fichas completas y estrategia de contacto." (14px, #94A3B8)
- Badge: "Ventas" — fondo #1a1a2a, texto #6366F1, borde #6366F1 opacity 0.3
- Botón al final: "Probar demo →" — texto #6366F1, sin fondo, hover underline
- El botón abre en nueva pestaña: https://lead-generation-engine-jaimearnaiz249.replit.app/

**Card 2 — Secure Doc AI**
- Icono: 🤖
- Título: "Secure Doc AI"
- Descripción: "Chatbot privado entrenado con tus manuales y documentación. Responde al instante en cualquier idioma, 24/7. Solo ve lo que tú le das — 100% privado y seguro."
- Badge: "Soporte Técnico"
- Botón: "Probar demo →" → https://secure-doc-ai.replit.app/

**Card 3 — Offer Configurator**
- Icono: 📋
- Título: "Offer Configurator"
- Descripción: "Configura tu producto de forma modular y genera automáticamente la oferta técnica y económica completa en PDF. Sin errores, sin llamar a ingeniería."
- Badge: "Comercial"
- Botón: "Probar demo →" → https://offer-configurator.replit.app/

### 4. SECCIÓN "CÓMO FUNCIONA"
Fondo ligeramente diferente: #0d0d14
Título centrado: "Así de simple" (36px)
Subtítulo: "Sin tecnicismos. Sin meses de implementación." (#94A3B8)

3 pasos en fila (o columna en móvil):

**Paso 1 — Briefing (1 hora)**
Número grande "01" en #6366F1 opacity 0.3.
Título: "Briefing"
Texto: "Nos reunimos. Entendemos tu proceso y lo que necesitas. Sin PowerPoints de 40 slides."

**Paso 2 — Configuración (1-2 semanas)**
Número: "02"
Título: "Configuración"
Texto: "Albaria construye y personaliza el agente para tu empresa. Tú revisas y ajustamos."

**Paso 3 — En producción**
Número: "03"
Título: "En producción"
Texto: "Tu equipo lo usa desde el primer día. Albaria lo mantiene y mejora cada mes."

### 5. SECCIÓN "POR QUÉ ALBARIA"
Título: "No vendemos promesas" (36px)
Subtítulo: "Llegamos con herramientas que ya funcionan." (#94A3B8)

Grid 2x2 de cards pequeñas con icono + título + texto:

- ⚡ **Ya funcionando** — "Todas las herramientas están en producción. Las puedes probar ahora mismo antes de decidir nada."
- 🎯 **Especialistas B2B industrial** — "Maquinaria, impresión industrial, packaging, distribución. Entendemos tu sector."
- 🔒 **Tus datos son tuyos** — "Los agentes se entrenan con tu documentación. Nadie más tiene acceso."
- 📈 **ROI desde el primer mes** — "La mayoría de clientes recuperan la inversión en las primeras semanas de uso."

### 6. SECCIÓN "PRECIOS"
Título: "Transparente desde el primer día" (36px)

3 cards de pricing en fila:

**Starter — desde 290€/mes**
- Setup: 190€
- 1 agente configurado
- Soporte por email
- Botón: "Empezar →"

**Professional — desde 590€/mes** (destacado con borde #6366F1 2px)
- Badge "Más elegido" en #6366F1
- Setup: 390€
- Hasta 3 agentes
- Integraciones CRM/ERP
- Soporte prioritario
- Botón primario: "Empezar →"

**Enterprise — desde 990€/mes**
- Setup: desde 790€
- Agentes ilimitados
- Onboarding completo
- SLA garantizado
- Botón: "Hablar con Jaime →"

### 7. SECCIÓN CONTACTO / CTA FINAL
Fondo: gradiente sutil de #0A0A0F a #0f0f1a
Centrado. Padding grande.

Título (42px): "¿Tu empresa necesita esto?"
Subtítulo: "Reserva 20 minutos. Sin compromiso. Si no veo cómo ayudarte, te lo digo en la primera reunión."

Botón grande: "Reservar reunión gratuita →" — fondo #6366F1, texto blanco, padding 16px 32px, font-size 16px

Debajo: jaime@albariasolutions.com en texto pequeño, color #94A3B8, clickable mailto

### 8. FOOTER
Fondo: #0A0A0F, borde top 1px solid #1e1e2e
Logo pequeño a la izquierda
Texto centro: "© 2025 Albaria Solutions · Valencia, España"
Texto derecha: jaime@albariasolutions.com

---

## ANIMACIONES Y DETALLES

- Fade in suave (opacity 0 → 1, translateY 20px → 0) en todas las secciones al hacer scroll — usar Intersection Observer
- Hover en cards: transform translateY(-2px), transition 0.2s ease
- Botones: hover con brightness(1.1), transition 0.15s
- Navbar: cuando hay scroll, añadir backdrop-filter blur(12px) y background rgba(10,10,15,0.8)
- Cursor normal — sin efectos de cursor custom

---

## RESPONSIVE

- Mobile: navbar con menú hamburguesa, grid de cards en 1 columna, hero font-size reducido (36px), botones full width
- Tablet: grid de 2 columnas en cards
- Desktop: todo como está descrito

---

## REQUISITOS TÉCNICOS

- Un solo archivo: index.html (HTML + CSS + JS todo dentro)
- Sin librerías externas excepto Google Fonts (Inter)
- Sin Bootstrap, sin Tailwind, sin jQuery
- CSS custom properties para los colores
- Semánticamente correcto (nav, main, section, footer)
- Meta tags: title "Albaria Solutions — Agentes de IA para empresas B2B", description, viewport
- Favicon: emoji 🤖 usando <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><text y='32' font-size='32'>🤖</text></svg>">

---

## AL TERMINAR

Cuando termines dime:
1. Que el archivo index.html está listo
2. Cómo descargarlo
3. Confirma que los 3 enlaces de demo están correctamente incluidos
