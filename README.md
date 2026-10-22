# Portfolio — Hamilton Ramírez

Portfolio de **Hamilton Ramírez Hernández**, frontend developer (HTML, CSS, JavaScript y WordPress) y especialista en sistemas de diseño. Tema oscuro, gradientes animados y micro‑interacciones al estilo Awwwards, construido **sin dependencias**: solo HTML, CSS y JavaScript nativo.

## Verlo en local

```bash
npx serve .
```

O simplemente abre `index.html` en el navegador (funciona también con `file://`).

## Estructura

```
.
├── index.html          # Marcado completo de la web
├── css/
│   ├── base.css        # Reset, tokens de diseño, tipografía
│   ├── components.css  # Botones, eyebrows, líneas, toast, skeletons
│   ├── sections.css    # Layout de cada sección
│   └── animations.css  # Keyframes y estados de animación
├── js/
│   ├── utils.js        # Helpers + split de texto en palabras
│   ├── cursor.js       # Cursor personalizado con modo link/view
│   ├── scroll.js       # Smooth scroll, reveals, nav-spy, tilt
│   ├── preloader.js    # Contador de carga
│   ├── projects.js     # Filtro de proyectos + preview de servicios
│   ├── contact.js      # Formulario, validación y copiar email
│   └── main.js         # Menú móvil, año, marquee, contadores
└── assets/
    ├── favicon.svg
    └── projects/       # Capturas reales de los 13 proyectos en producción
        ├── rolex-el-cronometro.jpg
        ├── fp-ceu.jpg
        ├── vantia-capital.jpg
        ├── joyeria-torrico.jpg
        ├── ceu-doctorado.jpg
        ├── uf3-ceu.jpg
        ├── perodri.jpg
        ├── ideal-joyeros.jpg
        ├── aec-consultoras.jpg
        ├── finnovista.jpg
        ├── omexon.jpg
        ├── leap-nttdata.jpg
        └── coches-net-hyundai.jpg
```

## Secciones

`Hero` · `Sobre mí` · `Servicios & Skills` · `Proyectos` · `Experiencia` · `Contacto` · `Footer`

## Personalizar

### Colores, tipografía y espaciado

Todo está controlado por variables CSS en `css/base.css`:

```css
:root {
  --violet: #6d5efc;
  --pink:   #ff4d8d;
  --amber:  #ffc247;
  --mint:   #2de2a6;

  --grad-primary: linear-gradient(120deg, var(--violet), var(--pink) 55%, var(--amber));
  --font-display: "Clash Display", "Space Grotesk", system-ui, sans-serif;
  --font-body: "Satoshi", "Inter", system-ui, sans-serif;
}
```

Cambia esos valores y toda la web se adapta. Las tipografías se cargan desde Fontshare y Google Fonts; si prefieres self‑hosting, descarga las `.woff2` y sustituye los `<link>` por reglas `@font-face`.

### Contenido

- **Nombre, email y redes** → `index.html` (logo `.logo__mark`, `.copy-email`, lista `.socials`) y `js/contact.js` (destinatario del `mailto:`).
- **Sobre mí** → sección `#sobre-mi`.
- **Experiencia** → items `.tl-item` dentro de `.timeline` (Indegene, Compideal, Buleboo Studio y Harvey & Lluch).
- **Servicios** → items `.service` dentro de `.services__list`. Cada uno necesita su `data-media="1..4"` para enlazarlo con el preview flotante `#svcPreview`.
- **Contadores del hero** → atributos `data-count` y `data-suffix` en `.stat__num`.

### Añadir proyectos

Copia un bloque `.work` y cambia `data-category`, el contenido y la clase del medio:

```html
<article class="work reveal" data-reveal data-category="wordpress">
  <a class="work__link" href="https://tuproyecto.com" target="_blank" rel="noopener noreferrer" data-cursor="view">
    <div class="work__media work__media--1">
      <img class="work__shot" src="assets/projects/tuproyecto.jpg" alt="Descripción accesible del proyecto" loading="lazy" decoding="async" width="900" height="462" />
      <span class="work__scrim"></span>
      <span class="work__label">WordPress</span>
    </div>
    <div class="work__info">
      <h3 class="work__title">Nombre del proyecto</h3>
      <p class="work__desc">Descripción breve del proyecto.</p>
      <span class="work__meta">WordPress · WooCommerce</span>
    </div>
  </a>
</article>
```

- `data-category="wordpress"` o `data-category="producto"` — el filtro los cuenta y muestra automáticamente.
- `work--wide` hace que la tarjeta ocupe dos columnas de la retícula.
- `work__media--1` … `work__media--8` son los fondos degradados, para las tarjetas sin captura.
- Si la tarjeta no lleva imagen, sustituye `work__shot` + `work__scrim` por `<span class="work__glow"></span>` y un `<span class="work__mono">KIA</span>` con el monograma.

Las capturas están optimizadas a **900 px de ancho y JPEG progresivo (~475 KB los 13 archivos)**. Para añadir una nueva, recórtala a 900 px antes de subirla.

### Cambiar el email de destino

En `js/contact.js`:

```js
window.location.href = `mailto:cala_ham12@hotmail.com?subject=...`;
```

Y en `index.html`, el atributo `data-copy` del botón de email.

### Formulario

Ahora mismo abre el cliente de correo (`mailto:`). Para enviarlo a un servidor, cambia el `submit` de `js/contact.js` por un `fetch()` a Formspree, Netlify Forms o tu propia API.

## Publicar

| Plataforma | Pasos |
|---|---|
| **Netlify** | Sube la carpeta tal cual. Ya funciona. |
| **Vercel** | Importa el repo, deja el build en vacío y la salida en `.`. |
| **GitHub Pages** | Sube el repo y activa Pages sobre la rama `main`, raíz `/`. |
| **Cloudflare Pages** | Proyecto → build command vacío, output `/`. |

## Detalles técnicos

- **Smooth scroll** propio (`js/scroll.js`) con lerp; se desactiva automáticamente en táctil y con `prefers-reduced-motion`.
- **Reveals** basados en posición de scroll, no en `IntersectionObserver`: así nada queda invisible aunque se entre por un ancla directo.
- **Cursor personalizado** con `mix-blend-mode`, desactivado en dispositivos táctiles.
- **Split de texto** por palabras preservando etiquetas internas (`<em>`, `<strong>`) para el título con degradado.
- **Rendimiento**: los desenfoques grandes se han sustituido por degradados radiales y `mask`, y los `backdrop-filter` están limitados al header. Medido ×6 más rápido en rasterizado por software.
- **Accesibilidad**: navegación por teclado, `aria-label` en controles, foco visible, contraste alto y soporte para `prefers-reduced-motion`.
- **SEO**: `title`, `description`, Open Graph, marcado semántico y `favicon`.

## Compatibilidad

Chrome, Edge, Firefox y Safari actuales (desktop y móvil). En navegadores sin `animation-timeline: scroll()` la maqueta del navegador simplemente no rota al hacer scroll; el resto funciona igual.
