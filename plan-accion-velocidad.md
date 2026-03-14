# Plan de Acción: Velocidad, Estructura y Core Web Vitals

## 1. El Cuello de Botella Principal: "Intro Overlay Reveal"
**Problema:** El script de introducción (`js/main.js` líneas 578-636) tiene paradas obligatorias de hasta 4.4 segundos (LCP) y 6.8 segundos para poder hacer scroll. Google penaliza severamente las páginas que tardan más de 2.5s en renderizar su mayor contenido.
**Acción:** 
- Acelerar transición o usar animaciones nativas CSS sin bloquear la página completa. 
- Reducir el LCP del hero de 4.4s a 1s-1.5s máximo.

## 2. Archivos CSS y Optimización del DOM
**Problema:** Se está enlazando a `styles.css` (115 KB) en todos los documentos HTML en lugar de aprovechar la versión optimizada `styles.min.css` (56 KB).
**Acción:** 
- Remplazar `<link rel="stylesheet" href="css/styles.css">` por `<link rel="stylesheet" href="css/styles.min.css">` en el `<head>` de TODAS las páginas.

## 3. Fuentes y Terceros
**Problema:** Falta orden de preconexión DNS a los servidores de fuentes de Google.
**Acción:**
- Añadir preconexión antes de las declaraciones de font:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  ```

## 4. Etiquetado Problemático Above the Fold (LCP)
**Problema:** Etiquetas `loading="lazy"` en logos, imágenes de Hero y elementos visibles de la primera carga perjudican en lugar de ayudar. Elementos como los videos del inicio obligan al usuario a derrochar recursos de red que bloquean el resto al tener `preload="auto"`.
**Acción:**
- Cambiar logo introductorio en el HTML: quitar `loading="lazy"` y añadir `fetchpriority="high"`.
- Modificar el preload de vídeo principal a `preload="metadata"`.
- En las cabeceras de los cursos (como en `curso-open-water-v2.html`), aplicar este cambio: pre-cargar mediante el `<head>` su primera imagen `(<link rel="preload" as="image" href="...">)`. Quitar lazy-loading en esas primeras imágenes.

## 5. Scripts Bloqueantes 
**Problema:** El JavaScript detiene el renderizado progresivo de HTML.
**Acción:** 
- Cambiar `<script src="js/main.js"></script>` por `<script defer src="js/main.js"></script>` en todas las páginas.

---
**Siguiente Paso:** Implementar todos los cambios descritos página a página.
