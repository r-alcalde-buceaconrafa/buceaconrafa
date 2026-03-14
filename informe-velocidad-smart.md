# 🚀 Auditoría Global de Rendimiento y Velocidad (BuceaConRafa)

**Análisis Sistémico (Aplica al 100% de los HTML, CSS y JS de la web)**
**Fecha:** Marzo 2026
**Especialista:** Senior SEO / Técnico Web
**Enfoque:** Optimización extrema de Core Web Vitals (LCP, INP, CLS) sin alterar un solo píxel del diseño visual final.

---

## 🛑 PROBLEMA SISTÉMICO 1: El Secuestro de Renderizado (Intro Overlay)

### 📊 ¿Qué ocurre actualmente?
La secuencia de introducción ("Intro Overlay Reveal") que tienes programada en `js/main.js` (desde la línea 578) bloquea la navegación de todo el sitio web de forma deliberada a través de temporizadores (`setTimeout`) de hasta 4.4 segundos.

Esto destruye la métrica SEO principal en la actualidad: **Largest Contentful Paint (LCP)**. 
- Googlebot ve esto: *"El contenido principal ha tardado casi 5 segundos en aparecer"*.
- El usuario móvil en 3G/4G ve esto: *"Entro a la web, veo un fondo bloqueado 5 segundos, y luego ya me deja hacer scroll"*.

Este patrón se repite **en todas las páginas** (Index, Cursos, Instructor, Contacto) porque todas comparten el archivo `main.js`. 

### 🔧 Solución Precisa
- Refactorizar el "Intro Overlay" a **CSS puro** usando animaciones `@keyframes`.
- El navegador puede calcular y ejecutar transparencias CSS de fondo por hardware sin congelar el hilo principal del DOM, bajando el peso lógico en los móviles.
- Reducir el LCP programado (`body.locked`) de **4.400 ms a un máximo absoluto de 1.500 ms**, dejando la web perfectamente operativa pero inmersiva.

### 🎯 Objetivo SMART esperado
**Reducir el LCP (Largest Contentful Paint) de ~4.8s actuales a < 1.5s** en el 100% de las páginas, logrando una clasificación "Buena" en PageSpeed Insights.

---

## 🔥 PROBLEMA SISTÉMICO 2: Sobrecarga Extrema de GPU en Móviles (Filtros CSS)

### 📊 ¿Qué ocurre actualmente?
En tu archivo `styles.css` (línea 518), para lograr el efecto de revelado, estás utilizando la propiedad `filter: blur(80px);`. 

Hacer un desenfoque de **80 píxeles a pantalla completa** sobre un `<video>` de fondo requiere un esfuerzo de cálculo matemático masivo por parte de la tarjeta gráfica y la CPU. En móviles de gama baja y media esto genera pérdida de FPS (caída de fotogramas), calentamiento del dispositivo y latencia severa (INP).

### 🔧 Solución Precisa
- Reemplazar el costoso `filter: blur(80px)` por una sencilla máscara opaca utilizando `opacity`.
- En lugar de desenfocar matemáticamente la capa 80 veces por píxel por frame, simplemente pondremos un velo negro al 100% encima (`opacity: 1`) y lo bajaremos al 0% en la entrada (`opacity: 0`).
- Visualmente el resultado ("revelar la escena lentamente") es idéntico, pero computacionalmente es 100 veces más ligero.

### 🎯 Objetivo SMART esperado
**Reducir el TBT (Total Blocking Time) de GPU en un 70%** (de >600ms a <150ms) en la carga inicial de dispositivos móviles (Moto G4 limitadores), eliminando fotogramas caídos ("jank").

---

## 🐌 PROBLEMA SISTÉMICO 3: Inversión del Patrón "Lazy Loading" (LCP Asesinado)

### 📊 ¿Qué ocurre actualmente?
En **todas las páginas de tus cursos** (Ej: Bautizo, Open Water, Nitrox, Instructor) y en el logo de entrada del Hero, has insertado el atributo `loading="lazy"`. 

Este atributo está **diseñado exclusivamente para imágenes que están muy abajo** en el scroll de una página. Como has puesto `lazy` en las imágenes cabeceras principales (Above the Fold), le estás diciendo a los navegadores: *"No te des prisa en cargar esta imagen, puedes esperar."*.
Al esperar a cargar la imagen principal del Hero de un curso, provocas que el usuario (y Google) vean un parche vacío arriba.

### 🔧 Solución Precisa
- **Cirugía LCP en los Cursos:** Quitar brutalmente el atributo `loading="lazy"` de todas y cada una de las imágenes que estén "Above the Fold" (cabecera hero, primera imagen de la entrada, logo inicial).
- Sustituirlo por `fetchpriority="high"`.
- Añadir la etiqueta `<link rel="preload" as="image" href="...">` en el `<head>` de los HTML de cursos dictando al inicio qué imagen es la portada hero.

### 🎯 Objetivo SMART esperado
**Acelerar la carga de la primera imagen ("First Contentful Paint") bajo 1.2 segundos** de media en 3G rápido. Esto bajará inmediatamente el porcentaje de rebote de los usuarios provenientes de tráfico PADI / Genérico desde Google.

---

## 🧱 PROBLEMA SISTÉMICO 4: Carga de Archivos de Recursos ("Render-Blocking")

### 📊 ¿Qué ocurre actualmente?
- Estás llamando al archivo grueso `<link rel="stylesheet" href="css/styles.css">` de 115 KB en cada HTML en lugar del que tienes comprimido (minified).
- Google Fonts llama a 3 tipografías con múltiples grosores sin estar conectado el DNS antes.
- El script de analítica y de cookies (`main.js` completo al final sin 'defer') detiene las secuencias del parser HTML al ser cargado pasmando la descarga concurrente.

### 🔧 Solución Precisa
1. Cambiar la referencia global de CSS en todos los HTML para que dirijan a **`css/styles.min.css`**. (Reducción del peso de recursos web del **50.8%**).
2. Forzar un salto asíncrono en todos tus archivos añadiendo `defer` a la carga de `<script src="js/main.js"></script>`. 
3. Añadir preconexión a los dominios de fuentes `.googleapis.com` en los HTMLs.

### 🎯 Objetivo SMART esperado
**Reducir en 59 KB directos la transferencia inicial por página** y lograr paralelizar la lectura de Javascript y HTML reduciendo en un **40% el tiempo de encolado (Time to Interactive)** en el hilo del navegador.

---

## 📑 RESUMEN DE EJECUCIÓN 
1. Eliminar `blur(80px)` por `opacity` en `css/styles.css`.
2. Bajar temporizador de `main.js` de 4400 a 1000 y usar animaciones de hardware.
3. Modificar `<link>` y agregar `defer` a los `<script>` en los 12 archivos HTML de la web.
4. Quitar `lazy` + Añadir `fetchpriority="high"` en la primera imagen del Hero en los 12 archivos HTML.
5. Inyectar `styles.min.css`.

**NINGUNO DE ESTOS CAMBIOS AFECTARÁ LA PINTA, DISEÑO, TAMAÑO O CALIDAD INMERSIVA ACTUAL DE LA WEB.** Es pura manipulación a nivel máquina-Google.
