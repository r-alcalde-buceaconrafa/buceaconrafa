// ─── NAV HAMBURGER ───
const ham = document.getElementById('ham');
const nmob = document.getElementById('nmob');
ham.addEventListener('click', () => {
  ham.classList.toggle('o');
  nmob.classList.toggle('o');
});
nmob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  ham.classList.remove('o'); nmob.classList.remove('o');
}));

// ─── FAQ ───
function tf(btn) {
  const item = btn.closest('.fitem');
  const isOpen = item.classList.contains('o');
  document.querySelectorAll('.fitem').forEach(i => i.classList.remove('o'));
  if (!isOpen) item.classList.add('o');
}

// ─── PHILOSOPHY ACCORDION ───
function tp(el) {
  const isOpen = el.classList.contains('o');
  document.querySelectorAll('.pf-item').forEach(i => i.classList.remove('o'));
  if (!isOpen) el.classList.add('o');
}

// ─── REVIEWS CAROUSEL ───
const REVIEWS = [
  { n: 'Pedro', i: 'P', t: 'Hace 5 meses', q: 'La profesionalidad, amabilidad y simpatía de Rafa te hacen estar a gusto desde el primer momento. Disfruté de la inmersión a pleno pulmón. Muy recomendable.' },
  { n: 'Natalia Pérez', i: 'N', t: 'Hace 6 meses', q: 'Una experiencia brutal que repetiré seguro. Me ha encantado Rafa como instructor, tremenda paciencia. Muy pendiente de mí en todo momento.' },
  { n: 'Pablo Vivancos', i: 'P', t: 'Hace 6 meses', q: 'Rafa es muy didáctico y profesional. Una magnífica experiencia que anima a continuar buceando. ¡Gracias!' },
  { n: 'Gloria Ahumada', i: 'G', t: 'Hace 6 meses', q: 'Experiencia de 10. Fuimos 3 personas, entre ellas un niño de 10 años, y fue inmejorable. Rafa nos explicó todo al detalle.' },
  { n: 'Sandra Bosque', i: 'S', t: 'Hace 7 meses', q: 'Iba muy nerviosa y fue un reto para mí. Gracias a Rafa por su excelente trato y paciencia infinita. Amenazo con repetir pronto.' },
  { n: 'Celia Martin', i: 'C', t: 'Hace 7 meses', q: 'Hicimos el bautizo con Rafa y lo recomendamos 100%. Fue super ameno y muy agradable. Lo explica todo con tranquilidad y buen rollo.' },
  { n: 'Fernando Cabanillas', i: 'F', t: 'Hace 7 meses', q: '1.000% recomendable. Rafa demostró su pasión, profesionalidad y, sobretodo, paciencia. Mil gracias.' },
  { n: 'Juanmi Martínez', i: 'J', t: 'Hace 7 meses', q: 'Mi primera experiencia con el buceo fue increíble. Rafa ha conseguido que mi pareja y yo nos enganchemos a este apasionante deporte.' },
  { n: 'Pedro Muñoz', i: 'P', t: 'Hace 7 meses', q: 'Una experiencia inolvidable. Rafa es un instructor de categoría. Seguiremos evolucionando con él muy pronto.' },
];

const slide = document.getElementById('rslide') || document.getElementById('reviewsSlider');
const dots = document.getElementById('rdots');

function card(r) {
  return `<div class="rc"><div class="stars"><i></i><i></i><i></i><i></i><i></i></div>
    <p class="rt">"${r.q}"</p>
    <div class="ra"><div class="rav">${r.i}</div>
    <div><strong>${r.n}</strong><small>Google · ${r.t}</small></div></div></div>`;
}

if (slide) {
  // 1. Inyectar todas las cards una sola vez
  slide.innerHTML = REVIEWS.map(card).join('');
  slide.querySelectorAll('.rc').forEach(el => el.classList.add('show'));

  // Limpiar dots ya que usaremos scroll continuo
  if (dots) dots.style.display = 'none';

  // 2. Control de Auto-Scroll para Escritorio
  let isAutoSliding = true;
  let autoScrollInterval;

  const startAutoScroll = () => {
    if (!autoScrollInterval) {
      autoScrollInterval = setInterval(() => {
        if (!isAutoSliding || window.innerWidth <= 900) return;

        // Calcular la anchura de una card + gap para el scroll
        const scrollAmount = slide.querySelector('.rc').offsetWidth + 24; // 24px es el gap

        // Si llegamos al final, volver al principio suavemente
        if (slide.scrollLeft + slide.clientWidth >= slide.scrollWidth - 10) {
          slide.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          slide.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }, 5000);
    }
  };

  const stopAutoScroll = () => {
    clearInterval(autoScrollInterval);
    autoScrollInterval = null;
  };

  // Iniciar por defecto
  startAutoScroll();

  // Flechas de navegación
  const btnPrev = document.getElementById('rnav-prev');
  const btnNext = document.getElementById('rnav-next');

  const scrollManual = (dir) => {
    isAutoSliding = false; // Pausar
    const scrollAmount = slide.querySelector('.rc').offsetWidth + 24;
    slide.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' });

    // Reactivar tras 4s de inactividad
    setTimeout(() => isAutoSliding = true, 4000);
  };

  if (btnPrev) btnPrev.addEventListener('click', () => scrollManual(-1));
  if (btnNext) btnNext.addEventListener('click', () => scrollManual(1));

  // Pausar auto-scroll al interactuar
  slide.addEventListener('mouseenter', () => isAutoSliding = false);
  slide.addEventListener('mouseleave', () => isAutoSliding = true);
  slide.addEventListener('touchstart', () => isAutoSliding = false, { passive: true });
  slide.addEventListener('touchend', () => {
    setTimeout(() => isAutoSliding = true, 2000);
  }, { passive: true });

  // Permitir scroll horizontal con la rueda del ratón (desktop)
  slide.addEventListener('wheel', (e) => {
    if (window.innerWidth > 900 && e.deltaY !== 0) {
      e.preventDefault();
      slide.scrollBy({
        left: e.deltaY > 0 ? 100 : -100,
        behavior: 'auto'
      });
    }
  }, { passive: false });
}

// ─── MODAL & FORM ───
const modal = document.getElementById('guide-modal');
const guideForm = document.getElementById('guide-form');

function openModal() {
  if (modal) modal.classList.add('o');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (modal) modal.classList.remove('o');
  document.body.style.overflow = '';
}

if (guideForm) {
  guideForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = guideForm.querySelector('button[type="submit"]');
    const originalText = btn.innerText;

    // Captura de datos
    const formData = new FormData(guideForm);
    const data = Object.fromEntries(formData.entries());

    // Bot protection: check honeypot
    if (data.hp_field) {
      console.warn("Bot detected (Guide Form)");
      return;
    }
    delete data.hp_field;

    data.source = 'Home - Guía La Azohía';
    data.timestamp = new Date().toISOString();

    btn.innerText = 'Enviando...';
    btn.disabled = true;

    try {
      const response = await fetch('https://formspree.io/f/xlgpgbaz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        btn.innerText = '¡Guía enviada!';
        btn.style.background = '#28a745';

        setTimeout(() => {
          closeModal();
          guideForm.reset();
          btn.innerText = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      } else {
        throw new Error('Formspree returned ' + response.status);
      }
    } catch (err) {
      console.error(err);
      btn.innerText = 'Error al enviar';
      btn.style.background = '#dc3545';
      setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }
  });
}

// ─── CONTACT FORM ───
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.innerText;

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    // Bot protection: check honeypot
    if (data.hp_field) {
      console.warn("Bot detected (Contact Form)");
      return;
    }
    delete data.hp_field;

    btn.innerText = 'Enviando...';
    btn.disabled = true;

    try {
      const response = await fetch('https://formspree.io/f/mreyeqrq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        btn.innerText = '¡Mensaje enviado!';
        btn.style.background = '#28a745';
        setTimeout(() => {
          contactForm.reset();
          btn.innerText = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      } else {
        throw new Error('Formspree returned ' + response.status);
      }
    } catch (err) {
      console.error(err);
      btn.innerText = 'Error al enviar';
      btn.style.background = '#dc3545';
      setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }
  });
}

// ─── FADE IN ───
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('v'); io.unobserve(en.target); } });
}, { threshold: 0.07 });
document.querySelectorAll('.fi').forEach(el => io.observe(el));
setTimeout(() => {
  document.querySelectorAll('#hero .fi').forEach((el, i) =>
    setTimeout(() => el.classList.add('v'), 150 + i * 120));
}, 60);

// ─── COOKIE BANNER & GOOGLE ANALYTICS 4 (CONSENT MODE V2) ───
// 1. Inicializar la capa de datos de Google obligatoria
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

// 2. Establecer el consentimiento por defecto como DENEGADO (Ley Europea RGPD)
gtag('consent', 'default', {
  'analytics_storage': 'denied',
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied'
});

// 3. Inyectar el script principal de GA4
const gaScript = document.createElement('script');
gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-PCZK4ZWVYP';
gaScript.async = true;
document.head.appendChild(gaScript);

// 4. Configurar la propiedad
gtag('js', new Date());
gtag('config', 'G-PCZK4ZWVYP');

document.addEventListener('DOMContentLoaded', () => {
  const cookieConsent = localStorage.getItem('buceaconrafa_cookies');

  // Si el usuario ya aceptó en una visita anterior, actualizamos el permiso a CONCEDIDO
  if (cookieConsent === 'accepted') {
    gtag('consent', 'update', {
      'analytics_storage': 'granted',
      'ad_storage': 'granted',
      'ad_user_data': 'granted',
      'ad_personalization': 'granted'
    });
  }

  // Si no hay decisión, mostramos el banner
  if (!cookieConsent) {
    // Inyectar HTML del banner al final del body
    const bannerHTML = `
      <div id="cookie-banner">
        <div class="cb-content">
          <div class="cb-text">
            <p>Utilizamos cookies propias y de terceros para fines analíticos y para mostrarte contenido personalizado. Puedes aceptarlas todas o configurarlas. Más información en nuestra <a href="/politica-cookies">Política de Cookies</a>.</p>
          </div>
          <div class="cb-btns">
            <button id="cb-reject" class="cb-btn cb-reject">Rechazar</button>
            <button id="cb-accept" class="cb-btn cb-accept">Aceptar Todas</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', bannerHTML);

    const banner = document.getElementById('cookie-banner');
    const btnAccept = document.getElementById('cb-accept');
    const btnReject = document.getElementById('cb-reject');

    // Animar entrada tras 1s
    setTimeout(() => {
      banner.classList.add('show');
    }, 1000);

    const closeBanner = (status) => {
      localStorage.setItem('buceaconrafa_cookies', status);
      banner.classList.remove('show');
      setTimeout(() => banner.remove(), 500);

      // Si le da a Aceptar, disparamos el permiso a Google Analytics
      if (status === 'accepted') {
        gtag('consent', 'update', {
          'analytics_storage': 'granted',
          'ad_storage': 'granted',
          'ad_user_data': 'granted',
          'ad_personalization': 'granted'
        });
      }
    };

    btnAccept.addEventListener('click', () => closeBanner('accepted'));
    btnReject.addEventListener('click', () => closeBanner('rejected'));
  }
});