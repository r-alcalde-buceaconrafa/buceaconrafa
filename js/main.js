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

// ─── AZOHÍA TOGGLE (MOBILE) ───
document.addEventListener('DOMContentLoaded', () => {
  const azBtn = document.getElementById('azToggleBtn');
  const azContent = document.getElementById('azMoreContent');
  
  if (azBtn && azContent) {
    azBtn.addEventListener('click', () => {
      const isExpanded = azBtn.classList.toggle('active');
      azContent.classList.toggle('show');
      
      const btnText = azBtn.querySelector('span:first-child');
      const btnIcon = azBtn.querySelector('.material-icons');
      
      if (isExpanded) {
        btnText.innerText = 'Leer menos';
      } else {
        btnText.innerText = 'Leer más sobre el entorno';
        // Scroll suave hacia arriba si el texto era muy largo
        const azSection = document.getElementById('azohia');
        if (azSection) {
          azSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  const sobreBtn = document.getElementById('sobreToggleBtn');
  const sobreContent = document.getElementById('sobreMoreContent');
  
  if (sobreBtn && sobreContent) {
    sobreBtn.addEventListener('click', () => {
      const isExpanded = sobreBtn.classList.toggle('active');
      sobreContent.classList.toggle('show');
      sobreBtn.querySelector('span:first-child').innerText = isExpanded ? 'Leer menos' : 'Conocer más sobre Rafa';
    });
  }

  // ─── DYNAMIC SKILL DOTS (HABILIDADES) ───
  const hgrid = document.querySelector('.hgrid');
  const hdots = document.querySelectorAll('.hdot');
  if (hgrid && hdots.length > 0) {
    const cards = hgrid.querySelectorAll('.fi');
    const observerOptions = {
      root: hgrid,
      threshold: 0.6
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = Array.from(cards).indexOf(entry.target);
          if (index !== -1) {
            hdots.forEach((dot, i) => {
              dot.classList.toggle('active', i === index);
            });
          }
        }
      });
    }, observerOptions);

    cards.forEach(card => observer.observe(card));
  }
});

// ─── PARTNER BAND ROTATOR ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const partnerBand = document.querySelector('.partner-band');
  if (!partnerBand) return;

  const fixedLine = partnerBand.querySelector('.partner-fixedline');
  const rotator = partnerBand.querySelector('.partner-rotator-line2');
  if (!fixedLine || !rotator) return;

  // Sticky fallback: en algunos layouts (p.ej. body flex + Tailwind) `position: sticky`
  // puede fallar. Este pin por JS asegura que se ancle bajo el menú.
  const setupPartnerBandPin = () => {
    const nav = document.querySelector('nav');
    const spacer = document.createElement('div');
    spacer.className = 'partner-band-spacer';
    partnerBand.insertAdjacentElement('afterend', spacer);

    const getNavHeight = () => {
      const fromVar = Number.parseFloat(
        window
          .getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-h')
          .trim()
      );
      if (Number.isFinite(fromVar) && fromVar > 0) return fromVar;
      const rect = nav?.getBoundingClientRect();
      return rect?.height ? rect.height : 72;
    };

    const update = () => {
      const navH = getNavHeight();
      const anchorRect = partnerBand.classList.contains('is-fixed')
        ? spacer.getBoundingClientRect()
        : partnerBand.getBoundingClientRect();
      const shouldFix = anchorRect.top <= navH + 0.5;

      if (shouldFix) {
        if (!partnerBand.classList.contains('is-fixed')) {
          spacer.style.display = 'block';
          spacer.style.height = `${partnerBand.offsetHeight}px`;
          partnerBand.classList.add('is-fixed');
        } else {
          spacer.style.height = `${partnerBand.offsetHeight}px`;
        }
        partnerBand.style.top = `${navH}px`;
      } else {
        partnerBand.classList.remove('is-fixed');
        partnerBand.style.top = '';
        spacer.style.display = 'none';
      }
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  };

  setupPartnerBandPin();

  const prefersReducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const phrases = [
    'VER DESDE 9€',
    'BUCEO RECREATIVO Y TECNICO',
    'HASTA 130 METROS',
    'BUCEO EN CUEVAS',
    'MEZCLA DE GASES',
    'INCLUYE COBERTURA PRE-INMERSIÓN',
    'VER DESDE 9€'
  ];

  let index = 0;
  let timeoutId = null;
  let started = false;
  let isVisible = false;

  const timings = {
    initialHoldMs: 1200,
    fadeInMs: 2300,
    holdMs: 1800,
    fadeOutMs: 2300
  };

  const clearTimer = () => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const stepToNext = () => {
    clearTimer();
    if (!started || !isVisible) return;

    rotator.classList.add('is-hidden');
    timeoutId = window.setTimeout(() => {
      index = (index + 1) % phrases.length;
      rotator.textContent = phrases[index];
      void rotator.offsetHeight;
      rotator.classList.remove('is-hidden');

      timeoutId = window.setTimeout(() => {
        stepToNext();
      }, timings.fadeInMs + timings.holdMs);
    }, timings.fadeOutMs);
  };

  const begin = () => {
    if (started) return;
    started = true;

    timeoutId = window.setTimeout(() => {
      if (!isVisible) return;
      stepToNext();
    }, timings.initialHoldMs + timings.holdMs);
  };

  rotator.classList.remove('is-hidden');
  rotator.textContent = phrases[index];

  const isDesktop =
    typeof window.matchMedia === 'function' &&
    !window.matchMedia('(max-width: 700px)').matches;

  if (isDesktop) {
    // En web: 2 líneas sólidas (título centrado + detalles), sin apariciones/rotación.
    rotator.style.display = 'none';

    partnerBand.classList.add('partner-band--twoline');
    fixedLine.innerHTML =
      '<span class="partner-web-stack">' +
      '<span class="partner-blue partner-web-title">SEGURO DE BUCEO SCUBAMEDIC</span>' +
      '<span class="partner-web-sub">' +
      '<span class="partner-web-item">DESDE 9€</span>' +
      '<span class="partner-web-item">RECREATIVO</span>' +
      '<span class="partner-web-item">TÉCNICO HASTA 130M</span>' +
      '<span class="partner-web-item">CUEVAS</span>' +
      '<span class="partner-web-item">MEZCLAS</span>' +
      '<span class="partner-web-item">PRE‑INMERSIÓN</span>' +
      '</span>' +
      '</span>';
    return;
  }

  if (prefersReducedMotion) return;

  if (!('IntersectionObserver' in window)) {
    isVisible = true;
    begin();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      const nowVisible = !!entry?.isIntersecting && entry.intersectionRatio >= 0.6;

      if (nowVisible) {
        isVisible = true;
        if (!started) {
          begin();
          return;
        }

        if (!timeoutId) {
          timeoutId = window.setTimeout(() => {
            stepToNext();
          }, 1200);
        }
      } else {
        isVisible = false;
        clearTimer();
      }
    },
    { threshold: [0, 0.6, 1] }
  );

  observer.observe(partnerBand);
});

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

const slide = document.getElementById('rslide'); // Only grab 'rslide' if it exists, leave 'reviewsSlider' for static HTML
const dots = document.getElementById('rdots');

function card(r) {
  return `<div class="rc"><div class="stars"><i></i><i></i><i></i><i></i><i></i></div>
    <p class="rt">"${r.q}"</p>
    <div class="ra"><div class="rav">${r.i}</div>
    <div><strong>${r.n}</strong><small>Google · ${r.t}</small></div></div></div>`;
}

if (slide && slide.id === 'rslide') {
  // 1. Inyectar todas las cards una sola vez SOLO si es rslide (evitar reviewsSlider del index.html que ahora es estático)
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

  // Auto-scroll deshabilitado intencionadamente para modo cuadrícula.

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

// ─── INTRO OVERLAY REVEAL ───
document.addEventListener('DOMContentLoaded', () => {
  // Asegurar que la página siempre cargue arriba (Hero)
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  const overlay = document.getElementById('intro-overlay');
  if (!overlay) return;

  const logo = overlay.querySelector('.intro-logo');
  const brand = overlay.querySelector('.intro-brand');
  const tag = overlay.querySelector('.intro-tag');
  const heroVideo = document.querySelector('#hero video'); // Referencia al primer video del hero

  // T=0ms: Logo In (2.5s)
  setTimeout(() => {
    if (logo) logo.classList.add('v');
  }, 0);

  // T=1500ms: Marca In (3.0s)
  setTimeout(() => {
    if (brand) brand.classList.add('v');
  }, 1500);

  // T=2600ms: Intro-Tag In (3.0s) -> Formación individualizada
  setTimeout(() => {
    if (tag) tag.classList.add('v');
  }, 2600);

  // T=4200ms: Arrancar videos PRE-NITIDEZ (Ajuste V13)
  setTimeout(() => {
    const videos = document.querySelectorAll('#hero video');
    videos.forEach(v => {
      v.play().catch(e => console.log("Video playback waiting for user context"));
    });
  }, 4200);

  // T=4400ms: GRAN FINAL -> FOCUS + FADE OUT (Texto ya visible)
  setTimeout(() => {
    revealSite();
  }, 4400);

  function revealSite() {
    if (!document.body.classList.contains('locked')) return;

    // Nitidez orgánica (80px -> 0) + Aparición del contenedor Hero
    const heroSection = document.getElementById('hero');
    if (heroSection) heroSection.classList.add('focused');

    // Fade out overlay textos intro
    overlay.classList.add('fade-out');

    // Desbloqueo de scroll tras la nitidez (T=4.4s + 2.4s = 6.8s)
    setTimeout(() => {
      document.body.classList.remove('locked');
    }, 2400);
  }
});



