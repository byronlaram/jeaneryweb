/* ============================================================
   ECONICARAGUA — JAVASCRIPT INTERACTIVO
   Contaminación Ambiental en Nicaragua
   ============================================================ */

// ============================================================
// PARTICLE CANVAS — HERO BACKGROUND
// ============================================================
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  let animFrame;
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 0.5;
      this.life = 1;
      this.decay = Math.random() * 0.003 + 0.001;
      const types = [
        { r: 76, g: 175, b: 80 },
        { r: 2, g: 136, b: 209 },
        { r: 141, g: 110, b: 99 },
        { r: 200, g: 230, b: 201 }
      ];
      const t = types[Math.floor(Math.random() * types.length)];
      this.r = t.r; this.g = t.g; this.b = t.b;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
      if (this.life <= 0) this.reset();
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.r},${this.g},${this.b},${this.life * 0.6})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const alpha = (1 - dist / 100) * 0.12;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(76,175,80,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    animFrame = requestAnimationFrame(animate);
  }

  animate();
})();

// ============================================================
// FLOATING LEAVES — HERO
// ============================================================
(function initLeaves() {
  return; // Disabled per user request to clean up the Hero screen
  const container = document.getElementById('floatingLeaves');
  if (!container) return;
  const leafEmojis = ['🍃', '🌿', '🍂', '🍁', '🌱', '🍀'];

  function createLeaf() {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    leaf.textContent = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];
    leaf.style.cssText = `
      left: ${Math.random() * 100}%;
      font-size: ${Math.random() * 1.2 + 0.6}rem;
      animation-duration: ${Math.random() * 10 + 8}s;
      animation-delay: ${Math.random() * 5}s;
      opacity: ${Math.random() * 0.5 + 0.2};
    `;
    container.appendChild(leaf);
    leaf.addEventListener('animationend', () => leaf.remove());
  }

  for (let i = 0; i < 15; i++) {
    setTimeout(() => createLeaf(), i * 400);
  }

  setInterval(createLeaf, 1200);
})();

// ============================================================
// NAVBAR — SCROLL EFFECT & MOBILE TOGGLE
// ============================================================
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
    });
  });
})();

// ============================================================
// SCROLL TO TOP BUTTON
// ============================================================
(function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ============================================================
// INTERSECTION OBSERVER — REVEAL ANIMATIONS
// ============================================================
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-stagger, .timeline-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Animate indicator bars
        entry.target.querySelectorAll('.indicator-fill, .impact-fill').forEach(bar => {
          const w = bar.dataset.w || bar.dataset.width;
          if (w) {
            setTimeout(() => {
              bar.style.width = w.includes('%') ? w : w + '%';
            }, 400);
          }
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => observer.observe(el));

  // Animate indicator bars when element card becomes visible
  const elementCards = document.querySelectorAll('.element-card');
  const elObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.indicator-fill');
        if (fill) {
          const w = fill.dataset.width;
          setTimeout(() => { fill.style.width = w; }, 500);
        }
        elObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  elementCards.forEach(c => elObserver.observe(c));
})();

// ============================================================
// TABS — TIPOS DE CONTAMINACIÓN
// ============================================================
(function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const content = document.getElementById('content-' + target);
      if (content) content.classList.add('active');
    });
  });
})();

// ============================================================
// INTERACTIVE MAP — NICARAGUA REGIONS
// ============================================================
function selectRegion(regionId) {
  // ── Grupos SVG de región ──
  const regionGroups = document.querySelectorAll('.map-region-group');
  regionGroups.forEach(g => g.classList.remove('active'));

  const activeGroup = document.getElementById('svg-region-' + regionId);
  if (activeGroup) {
    activeGroup.classList.add('active');
    const stack = document.getElementById('mapSvgStack');
    if (stack) stack.classList.add('has-active');
  }

  // ── Paneles de información ──
  const panels = document.querySelectorAll('.region-panel');
  panels.forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('panel-' + regionId);
  if (panel) panel.classList.add('active');

  // ── Botones selectores ──
  const thumbs = document.querySelectorAll('.region-sel-btn');
  thumbs.forEach(t => t.classList.remove('active'));
  const thumb = document.getElementById('thumb-' + regionId);
  if (thumb) thumb.classList.add('active');
}

(function initMap() {
  selectRegion('pacifico');
})();


// ============================================================
// COMMITMENT CHECKLIST — INTERACTIVE
// ============================================================
(function initChecklist() {
  const checkInputs = document.querySelectorAll('.check-input');
  const progressRing = document.getElementById('progressRing');
  const progressLabel = document.getElementById('progressLabel');
  const completionBadge = document.getElementById('completionBadge');
  const healthBarFill = document.getElementById('healthBarFill');
  const healthPercentage = document.getElementById('healthPercentage');
  const ecoScore = document.getElementById('ecoScore');
  const ecoMessage = document.getElementById('ecoMessage');
  const ecoScoreCircle = document.getElementById('ecoScoreCircle');
  const transformBg = document.getElementById('transformBg');

  // Image transition elements
  const transformPristine = document.getElementById('transformPristine');
  const transformPolluted = document.getElementById('transformPolluted');
  const transformLabelText = document.getElementById('transformLabelText');
  const transformLabelIcon = document.querySelector('.transform-label-icon');

  const totalRingCircumference = 201;
  const totalEcoCircumference = 327;

  const ecoMessages = [
    'Comienza marcando tus compromisos',
    '¡Buen comienzo! Sigue adelante',
    '¡Vas muy bien! El planeta lo nota',
    '¡Excelente! Eres un ejemplo a seguir',
    '¡Increíble! Nicaragua te lo agradece',
    '¡Eres un guardián del medio ambiente! 🌿'
  ];

  // Label states based on progress
  const labelStates = [
    { icon: '🌫️', text: 'Nicaragua contaminada' },
    { icon: '🌥️', text: 'Iniciando la recuperación...' },
    { icon: '🌤️', text: 'Mejorando poco a poco' },
    { icon: '🌿', text: 'La naturaleza respira' },
    { icon: '🌳', text: 'Nicaragua se renueva' },
    { icon: '🌟', text: '¡Nicaragua limpia y verde!' }
  ];

  function updateChecklist() {
    const checked = document.querySelectorAll('.check-input:checked').length;
    const total = checkInputs.length;
    const percent = Math.round((checked / total) * 100);

    // Progress ring
    const offset = totalRingCircumference - (totalRingCircumference * percent / 100);
    if (progressRing) progressRing.style.strokeDashoffset = offset;
    if (progressLabel) progressLabel.textContent = percent + '%';

    // Health bar
    if (healthBarFill) healthBarFill.style.width = percent + '%';
    if (healthPercentage) healthPercentage.textContent = percent + '%';

    // Eco score
    const score = Math.round(percent);
    if (ecoScore) ecoScore.textContent = score;
    const ecoOffset = totalEcoCircumference - (totalEcoCircumference * score / 100);
    if (ecoScoreCircle) ecoScoreCircle.style.strokeDashoffset = ecoOffset;

    // Eco message
    const msgIndex = Math.floor(checked * (ecoMessages.length - 1) / total);
    if (ecoMessage) ecoMessage.textContent = ecoMessages[Math.min(msgIndex, ecoMessages.length - 1)];

    // ── IMAGE TRANSITION ──
    // The pristine image fades in proportionally to the % of completed items.
    // At 0% → fully polluted  |  At 100% → fully pristine
    if (transformPristine) {
      transformPristine.style.opacity = (percent / 100).toFixed(2);
    }

    // Update label
    if (transformLabelText && transformLabelIcon) {
      const stateIndex = Math.min(
        Math.floor((checked / total) * (labelStates.length - 1)),
        labelStates.length - 1
      );
      // Smooth label transition
      const state = labelStates[stateIndex];
      transformLabelIcon.textContent = state.icon;
      transformLabelText.textContent = state.text;
    }

    // Transform background glow (keeps the subtle gradient)
    if (transformBg) {
      const greenIntensity = percent / 100;
      transformBg.style.background = `radial-gradient(ellipse at 50% 50%, rgba(46,125,50,${greenIntensity * 0.25}) 0%, transparent 70%)`;
    }

    // Completion badge
    if (completionBadge) {
      if (checked === total) {
        completionBadge.classList.add('visible');
        triggerConfetti();
      } else {
        completionBadge.classList.remove('visible');
      }
    }
  }

  checkInputs.forEach(input => {
    input.addEventListener('change', () => {
      updateChecklist();

      // Ripple effect on label
      const label = input.closest('.check-item');
      if (label && input.checked) {
        label.style.borderColor = 'rgba(46,125,50,0.5)';
        label.style.background = 'rgba(46,125,50,0.08)';
        setTimeout(() => {
          label.style.borderColor = '';
          label.style.background = '';
        }, 600);
      }
    });
  });
})();


// ============================================================
// CONFETTI ANIMATION
// ============================================================
function triggerConfetti() {
  const colors = ['#4CAF50', '#2E7D32', '#0288D1', '#FFD740', '#FF6D00', '#E040FB'];
  const container = document.querySelector('.compromiso-section');
  if (!container) return;

  for (let i = 0; i < 60; i++) {
    const conf = document.createElement('div');
    conf.style.cssText = `
      position: absolute;
      width: ${Math.random() * 8 + 4}px;
      height: ${Math.random() * 8 + 4}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      left: ${Math.random() * 100}%;
      top: 50%;
      z-index: 10;
      pointer-events: none;
      animation: confettiFall ${Math.random() * 2 + 1.5}s ease-out forwards;
      animation-delay: ${Math.random() * 0.8}s;
    `;
    container.style.position = 'relative';
    container.appendChild(conf);
    setTimeout(() => conf.remove(), 4000);
  }

  // Inject confetti keyframes if not already present
  if (!document.getElementById('confettiStyle')) {
    const style = document.createElement('style');
    style.id = 'confettiStyle';
    style.textContent = `
      @keyframes confettiFall {
        0% { transform: translateY(-200px) rotate(0deg) scale(1); opacity: 1; }
        100% { transform: translateY(300px) rotate(${Math.random() * 720 + 360}deg) scale(0.3); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

// ============================================================
// PARALLAX EFFECT — HERO
// ============================================================
(function initParallax() {
  const content = document.querySelector('.hero-content');
  const polluted = document.getElementById('pollutedLandscape');
  const landscapes = document.querySelectorAll('.hero-landscape');
  const indicator = document.querySelector('.scroll-indicator');

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroHeight = window.innerHeight;

        if (scrollY <= heroHeight) {
          // 1. Pollution landscape fades in completely by 50% scroll of hero height
          const pollutionRatio = Math.min(scrollY / (heroHeight * 0.5), 1);
          if (polluted) {
            polluted.style.opacity = pollutionRatio;
          }

          // 2. Text content parallax and fade out
          const textOpacity = Math.max(1 - scrollY / (heroHeight * 0.45), 0);
          if (content) {
            content.style.transform = `translateY(${scrollY * 0.25}px)`;
            content.style.opacity = textOpacity;
            content.style.pointerEvents = textOpacity < 0.1 ? 'none' : 'auto';
          }

          // 3. Cinematic zoom
          const scale = 1 + (scrollY / heroHeight) * 0.08;
          landscapes.forEach(img => {
            img.style.transform = `scale(${scale})`;
          });

          // 4. Scroll indicator fade
          if (indicator) {
            indicator.style.opacity = Math.max(1 - scrollY / 100, 0);
          }
        } else {
          // Lock to final polluted state when deep in other sections
          if (polluted) polluted.style.opacity = 1;
          if (content) {
            content.style.opacity = 0;
            content.style.pointerEvents = 'none';
          }
          if (indicator) indicator.style.opacity = 0;
          landscapes.forEach(img => {
            img.style.transform = `scale(1.08)`;
          });
        }

        ticking = false;
      });
      ticking = true;
    }
  });
})();


// ============================================================
// COUNTER ANIMATIONS — STATS
// ============================================================
(function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const numMatch = text.match(/[\d,.]+/);
        if (!numMatch) return;

        const rawNum = parseFloat(numMatch[0].replace(/,/g, ''));
        const prefix = text.before || '';
        const suffix = text.slice(numMatch[0].length + numMatch.index);
        const start = 0;
        const duration = 2000;
        const startTime = performance.now();

        function update(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(start + (rawNum - start) * eased);
          el.textContent = current.toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
})();

// ============================================================
// SMOOTH ACTIVE NAV LINK ON SCROLL
// ============================================================
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + id) {
            link.style.color = 'var(--green-light)';
          }
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-20% 0px -20% 0px' });

  sections.forEach(s => observer.observe(s));
})();

// ============================================================
// SHARE PAGE
// ============================================================
function sharePage() {
  const data = {
    title: 'Contaminación Ambiental en Nicaragua',
    text: '🌿 Aprende sobre la contaminación ambiental en Nicaragua y cómo podemos proteger nuestro futuro. ¡Comparte este mensaje!',
    url: window.location.href
  };

  if (navigator.share) {
    navigator.share(data).catch(console.error);
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      const btn = document.getElementById('shareBtn');
      if (btn) {
        const original = btn.innerHTML;
        btn.innerHTML = '<span>¡Enlace copiado!</span><span>✅</span>';
        setTimeout(() => { btn.innerHTML = original; }, 2500);
      }
    }).catch(() => {
      alert('Comparte esta página: ' + window.location.href);
    });
  }
}

// ============================================================
// ANIMATED NATURE CARDS — HOVER EFFECT
// ============================================================
(function initNatureCards() {
  const cards = document.querySelectorAll('.nature-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// ============================================================
// TYPEWRITER EFFECT — HERO SUBTITLE
// ============================================================
(function initTypewriter() {
  const subtitle = document.querySelector('.hero-subtitle');
  if (!subtitle) return;

  const text = subtitle.innerHTML;
  subtitle.innerHTML = '';
  subtitle.style.opacity = '1';

  let i = 0;
  const speed = 30;

  function type() {
    if (i < text.length) {
      subtitle.innerHTML = text.slice(0, i + 1);
      i++;
      setTimeout(type, speed);
    }
  }

  setTimeout(type, 1800);
})();

// ============================================================
// ROTATING ECO FACTS — FOOTER
// ============================================================
(function initEcoFacts() {
  const facts = [
    'Plantar un árbol absorbe aproximadamente 22 kg de CO₂ al año.',
    'Nicaragua tiene el 7% de la biodiversidad del planeta en solo 0.09% de la superficie terrestre.',
    'El Lago Cocibolca (Nicaragua) es el segundo lago más grande de Latinoamérica.',
    'Reciclar una tonelada de papel salva 17 árboles y ahorra 4,000 kWh de energía.',
    'El 71% del agua potable de Nicaragua proviene de fuentes subterráneas.',
    'BOSAWÁS es la segunda reserva de biosfera más grande del hemisferio occidental.',
    'Cerrar el grifo al cepillarse los dientes ahorra hasta 12 litros de agua por minuto.',
    'Nicaragua tiene más de 19 volcanes activos y 700 especies de aves registradas.'
  ];

  const factEl = document.getElementById('footerFact');
  if (!factEl) return;

  let idx = 0;

  setInterval(() => {
    factEl.style.opacity = '0';
    factEl.style.transform = 'translateY(-10px)';
    factEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

    setTimeout(() => {
      idx = (idx + 1) % facts.length;
      factEl.textContent = facts[idx];
      factEl.style.opacity = '1';
      factEl.style.transform = 'translateY(0)';
    }, 450);
  }, 6000);
})();

// ============================================================
// SCROLL PROGRESS INDICATOR
// ============================================================
(function initScrollProgress() {
  const progress = document.createElement('div');
  progress.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 3px;
    background: linear-gradient(90deg, #2E7D32, #4CAF50, #0288D1);
    z-index: 9999;
    width: 0;
    transition: width 0.1s linear;
    box-shadow: 0 0 10px rgba(76,175,80,0.5);
  `;
  document.body.appendChild(progress);

  window.addEventListener('scroll', () => {
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / totalHeight) * 100;
    progress.style.width = Math.min(scrolled, 100) + '%';
  });
})();

// ============================================================
// IMPACT BARS OBSERVER
// ============================================================
(function initImpactBars() {
  const impactFills = document.querySelectorAll('.impact-fill[data-w]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const w = el.dataset.w;
        setTimeout(() => {
          el.style.width = w + '%';
          el.style.transition = 'width 1.5s cubic-bezier(0.4,0,0.2,1)';
        }, 200);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  impactFills.forEach(el => observer.observe(el));
})();

// ============================================================
// CAUSA CARDS — MICRO INTERACTION
// ============================================================
(function initCausaCards() {
  const cards = document.querySelectorAll('.causa-card:not(.causa-card-summary)');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      card.style.transform = 'scale(0.97)';
      setTimeout(() => { card.style.transform = ''; }, 150);
    });
  });
})();

// ============================================================
// REGION MAP LABELS — SVG HOVER
// ============================================================
(function initMapHover() {
  const svgRegions = document.querySelectorAll('.map-region');

  svgRegions.forEach(region => {
    region.addEventListener('mouseenter', function() {
      this.style.filter = 'brightness(1.35)';
    });

    region.addEventListener('mouseleave', function() {
      if (!this.classList.contains('selected')) {
        this.style.filter = '';
      }
    });
  });
})();

// ============================================================
// SOLUTION CARDS — STAGGER ANIMATION ON SCROLL
// ============================================================
(function initSolutionAnimation() {
  const cards = document.querySelectorAll('.solucion-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  cards.forEach(card => observer.observe(card));
})();

// ============================================================
// HERO EXPLORE BUTTON — SMOOTH SCROLL
// ============================================================
(function initExploreBtn() {
  const btn = document.getElementById('exploreBtn');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById('intro');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
})();

// ============================================================
// LAZY LOADING — PERFORMANCE
// ============================================================
(function initLazyLoading() {
  if ('loading' in HTMLImageElement.prototype) return;

  const imgs = document.querySelectorAll('img[loading="lazy"]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        observer.unobserve(img);
      }
    });
  });

  imgs.forEach(img => observer.observe(img));
})();

// ============================================================
// KEYBOARD ACCESSIBILITY — TABS
// ============================================================
(function initTabKeyboard() {
  const tabBtns = document.querySelectorAll('.tab-btn');

  tabBtns.forEach((btn, i) => {
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        const next = tabBtns[(i + 1) % tabBtns.length];
        next.focus();
        next.click();
      } else if (e.key === 'ArrowLeft') {
        const prev = tabBtns[(i - 1 + tabBtns.length) % tabBtns.length];
        prev.focus();
        prev.click();
      }
    });
  });
})();

// ============================================================
// INIT — DOMContentLoaded
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🌿 EcoNicaragua — Página cargada correctamente');
  console.log('🌊 Contaminación Ambiental en Nicaragua');
  console.log('♻️ Educando para un futuro más verde');

  // Animate pollution dots on map after delay
  setTimeout(() => {
    const dots = document.querySelectorAll('.pollution-dot');
    dots.forEach((dot, i) => {
      dot.style.animationDelay = `${i * 0.5 + 2}s`;
    });
  }, 1000);
});

// ============================================================
// SECTION 8: VISOR DE CAPÍTULOS
// ============================================================
const CHAPTERS_DATA = [
  {
    num: "01",
    title: "Introducción al Reporte Ambiental",
    text: `La contaminación ambiental en Nicaragua es un problema que afecta de manera integral el bienestar de las personas, los animales, la vegetación, los acuíferos y la calidad del aire respirable. Aunque nuestra nación posee una inmensa dotación de recursos naturales y áreas boscosas protegidas, estos activos se han degradado progresivamente.<br><br>Este deterioro es impulsado por la dispersión descontrolada de basura, la deforestación desmedida, las quemas agrícolas, la emisión de gases vehiculares y la negligencia cívica e industrial. El estudio de este fenómeno busca concienciar sobre sus efectos perjudiciales.<br><br>La contaminación no solo distorsiona la belleza escénica del paisaje nacional, sino que constituye un detonante de epidemias bronquiales agudas, infecciones estomacales severas por aguas contaminadas y la degradación generalizada de la capacidad agrícola de nuestro suelo.`,
    source: "Sección 1: Informe Escolar de Ciencias Naturales (Pág. 3)"
  },
  {
    num: "02",
    title: "La Crisis de la Contaminación Hídrica",
    text: `Nicaragua cuenta con una red hidrográfica invaluable, liderada por el Gran Lago de Nicaragua (Cocibolca) y el Lago de Managua (Xolotlán). Lamentablemente, un alto porcentaje de estos reservorios y ríos asociados reciben descargas crudas de aguas negras domésticas y desechos industriales sin previo filtrado.<br><br>El Ministerio de Salud (MINSA, 2011) en su Normativa 066 señala expresamente que la vigilancia y el control sanitario de las fuentes de agua dulce son obligatorios para mitigar brotes infecciosos severos en el consumo de la población.<br><br>Las aguas contaminadas por lixiviados y desechos sólidos son vehículos de parásitos, cólera y hepatitis, afectando principalmente a comunidades de áreas rurales donde el acceso a acueductos potables es limitado y dependen de pozos vulnerables.`,
    source: "Sección 2: Normativa 066 MINSA / Banco de Datos de OPS"
  },
  {
    num: "03",
    title: "Monóxido y Calidad de Aire Atmosférico",
    text: `La pureza del aire se ve amenazada por las emisiones de motores vehiculares antiguos, el polvo en suspensión de áreas erosionadas y la combustión abierta de basura doméstica e industrial. En zonas suburbanas, la cocción de alimentos utilizando leña húmeda empeora este escenario.<br><br>El Banco Mundial (2024) advierte en sus informes ecológicos regionales que la mala calidad del aire interno y externo constituye un factor crítico de salud en Nicaragua, provocando un impacto desfavorable sobre la esperanza de vida.<br><br>Las quemas agrícolas implementadas para preparar cosechas liberan miles de toneladas de material particulado a la atmósfera, el cual es inhalado de forma continua por comunidades residenciales vecinas.`,
    source: "Sección 3: Estadísticas del Banco Mundial (2024)"
  },
  {
    num: "04",
    title: "Infiltración y Toxicidad de los Suelos",
    text: `El suelo se ve agredido de manera directa por la aplicación irresponsable de pesticidas, fungicidas y herbicidas de síntesis química en la agricultura masiva, además del descarte de aceites automotrices usados sobre la tierra.<br><br>La pérdida de los nutrientes orgánicos superiores debilita la retención de agua y causa erosión. Adicionalmente, durante la temporada lluviosa de Nicaragua, las corrientes pluviales arrastran los depósitos de tóxicos del suelo directamente hacia las cuencas de ríos inferiores.<br><br>Cuidar los suelos no solo protege los ecosistemas locales, sino que garantiza la viabilidad del sector agrícola, el cual representa una piedra angular para la economía, el sustento y el bienestar de los hogares nicaragüenses.`,
    source: "Sección 4: Marco de Suelos y Agroquímicos (Pág. 4)"
  },
  {
    num: "05",
    title: "Gestión Inadecuada de Residuos Sólidos",
    text: `Una de las expresiones más preocupantes de contaminación visual y sanitaria es la persistencia de focos informales de basura en calles céntricas, cauces secos, predios abandonados y lagunas urbanas.<br><br>La falta de clasificación de plásticos y metales obstruye los sistemas de drenaje pluvial, provocando inundaciones severas en el invierno de Managua. Además, la descomposición desatendida genera lixiviados que percolan hacia los acuíferos subterráneos de consumo.<br><br>El Ministerio del Ambiente y los Recursos Naturales (MARENA) destaca la urgencia de modernizar los rellenos sanitarios y clausurar botaderos informales para resguardar la salud ambiental general.`,
    source: "Informes GEO Nicaragua - MARENA"
  },
  {
    num: "06",
    title: "La Pérdida del Patrimonio Forestal",
    text: `La deforestación y la degradación forestal avanzan a paso firme en zonas críticas como la Reserva de Biosfera Bosawás e Indio Maíz debido a la ganadería extensiva ilegal y la conversión de bosques vírgenes en cultivos de subsistencia.<br><br>El Sistema de la Integración Centroamericana (SICA) indica en sus estudios territoriales que la pérdida acelerada de los bosques nativos limita la captura de dióxido de carbono y desprotege las cuencas de agua, agudizando la sequía local.<br><br>Los árboles actúan como barreras contra la erosión del viento y de la lluvia. La tala inmoderada resulta en suelos desertificados imposibles de cultivar a largo plazo.`,
    source: "Diagnóstico de Paisaje Forestal - SICA"
  },
  {
    num: "07",
    title: "Impacto en Salud y Pérdida de Biodiversidad",
    text: `Los ecosistemas de Nicaragua albergan miles de especies endémicas de fauna silvestre, orquídeas y microorganismos. Al contaminar las reservas, lagunas y bosques primarios, se elimina su sustento biológico provocando su migración o muerte sistemática.<br><br>La FAO (2015) afirma que los ecosistemas sanos son esenciales para mitigar los desastres naturales y conservar la estabilidad agrícola. El equilibrio biológico de la nación se rompe al deteriorar los biomas locales.<br><br>De forma paralela, las poblaciones humanas ven disminuida su calidad de vida ante la prevalencia de alergias, tos crónica y gastroenteritis agudas desencadenadas por la degradación del entorno.`,
    source: "FAO (2015) / Determinantes Ambientales de Salud OPS"
  },
  {
    num: "08",
    title: "Rol del Estado, Leyes y Acción Ciudadana",
    text: `La preservación de los recursos naturales y el manejo integral de desechos sólidos es un deber compartido. Si bien el Estado y las Municipalidades formulan normativas ambientales y coordinan camiones colectores, la labor es infructuosa sin participación ciudadana.<br><br>Cada persona puede generar aportes inmensos desde sus rutinas en el hogar, la escuela y la oficina. Acciones sencillas como deponer el uso del fuego para deshacerse de malezas, ahorrar el agua de pozos y reciclar plásticos provocan cambios sustanciales.<br><br>El fomento de la educación ecológica comunitaria representa la única vía para infundir valores de conservación sustentables en las futuras generaciones de estudiantes nicaragüenses.`,
    source: "Compendio de Leyes Ambientales de Nicaragua - MARENA"
  }
];

(function initChapterVisor() {
  const navList = document.getElementById('visorNavList');
  const displayTag = document.getElementById('visorChapterTag');
  const displayTitle = document.getElementById('visorChapterTitle');
  const displayText = document.getElementById('visorChapterText');
  const displaySource = document.getElementById('visorChapterSource');
  const displayPane = document.getElementById('visorDisplay');

  if (!navList || !displayPane) return;

  window.selectChapter = function(index) {
    const ch = CHAPTERS_DATA[index];
    if (!ch) return;

    // Toggle active state of buttons
    const buttons = navList.querySelectorAll('.visor-nav-btn');
    buttons.forEach((btn, idx) => {
      if (idx === index) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Add fade-out animation class
    displayPane.classList.add('visor-fade-out');

    setTimeout(() => {
      displayTag.textContent = `Capítulo ${index + 1}`;
      displayTitle.textContent = ch.title;
      displayText.innerHTML = ch.text;
      displaySource.innerHTML = `<strong>Fuente:</strong> ${ch.source}`;

      displayPane.classList.remove('visor-fade-out');
      displayPane.classList.add('visor-fade-in');

      setTimeout(() => {
        displayPane.classList.remove('visor-fade-in');
      }, 300);
    }, 250);
  };
})();

// ============================================================
// SECTION 10: PRUEBA DE APRENDIZAJE (DESAFÍO ECO-CONSCIENTE)
// ============================================================
const QUIZ_QUESTIONS = [
  {
    question: "¿Qué institución sanitaria regula la vigilancia del agua para consumo humano en Nicaragua?",
    options: [
      "El Ministerio de Educación (MINED)",
      "El Ministerio de Salud (MINSA) a través de la Normativa 066",
      "El Banco Mundial directamente",
      "La Organización de las Naciones Unidas (ONU)"
    ],
    answer: 1,
    explanation: "La Normativa 066 del MINSA establece expresamente el control sanitario obligatorio de las fuentes de agua dulce en Nicaragua."
  },
  {
    question: "¿Qué factor crítico advierte el Banco Mundial (2024) sobre la salud y la esperanza de vida en Nicaragua?",
    options: [
      "La calidad y conservación de áreas urbanas",
      "La mala calidad del aire interno y externo",
      "La escasez de producción pesquera",
      "El retroceso de glaciares andinos"
    ],
    answer: 1,
    explanation: "El Banco Mundial (2024) indica que la mala calidad del aire constituye un factor crítico de salud en Nicaragua, impactando directamente la esperanza de vida."
  },
  {
    question: "¿Cuáles son los principales contaminantes del suelo causados por la agricultura masiva en Nicaragua?",
    options: [
      "Emisiones de azufre volcánico",
      "Pesticidas, fungicidas y herbicidas de síntesis química",
      "Residuos plásticos domésticos no clasificados",
      "Aguas grises urbanas filtradas"
    ],
    answer: 1,
    explanation: "El uso excesivo e irresponsable de pesticidas, fungicidas y herbicidas sintéticos contamina la capa fértil superior del suelo y las cuencas bajas."
  },
  {
    question: "¿Qué efecto directo provoca la acumulación de basura y plásticos en los drenajes pluviales de Managua durante el invierno?",
    options: [
      "Erosión costera acelerada",
      "Inundaciones urbanas severas",
      "Disminución de la sismicidad regional",
      "Fertilidad del manto freático superior"
    ],
    answer: 1,
    explanation: "La falta de clasificación y la acumulación de plásticos en cauces obstruyen el sistema de drenaje, lo que provoca inundaciones severas en el invierno de Managua."
  },
  {
    question: "¿Cuáles son las dos áreas de reserva de biosfera nicaragüenses más amenazadas por la ganadería extensiva ilegal y la deforestación?",
    options: [
      "Volcán Masaya y Reserva Chocoyero",
      "Reserva de Biosfera Bosawás e Indio Maíz",
      "Lago Cocibolca y Reserva Laguna de Apoyo",
      "Volcán Mombacho y Selva Negra"
    ],
    answer: 1,
    explanation: "Tanto Bosawás como Indio Maíz enfrentan graves riesgos por invasión agrícola y ganadera ilegal, reduciendo drásticamente nuestro patrimonio forestal."
  }
];

(function initQuiz() {
  let currentIdx = 0;
  let score = 0;
  let hasAnswered = false;

  const quizCard = document.getElementById('quizCard');
  const scoreboard = document.getElementById('quizScoreboard');
  const questionText = document.getElementById('quizQuestion');
  const optionsContainer = document.getElementById('quizOptions');
  const feedbackBox = document.getElementById('quizFeedback');
  const feedbackIcon = document.getElementById('feedbackIcon');
  const feedbackTitle = document.getElementById('feedbackTitle');
  const feedbackText = document.getElementById('feedbackText');
  const nextBtn = document.getElementById('quizNextBtn');
  const currentText = document.getElementById('quizCurrentText');
  const scoreText = document.getElementById('quizScoreText');
  const progressFill = document.getElementById('quizProgressFill');

  if (!questionText || !optionsContainer) return;

  function loadQuestion(index) {
    hasAnswered = false;
    const q = QUIZ_QUESTIONS[index];
    if (!q) return;

    // Update stats
    currentText.textContent = index + 1;
    scoreText.textContent = score;
    progressFill.style.width = `${((index + 1) / QUIZ_QUESTIONS.length) * 100}%`;

    // Load Question Text
    questionText.textContent = q.question;

    // Render Options
    optionsContainer.innerHTML = '';
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt-btn';
      btn.innerHTML = `
        <span class="opt-letter">${String.fromCharCode(65 + idx)}</span>
        <span class="opt-text">${opt}</span>
        <span class="opt-status-icon"></span>
      `;
      btn.onclick = () => selectOption(idx, btn);
      optionsContainer.appendChild(btn);
    });

    // Reset Feedback and Next Button
    feedbackBox.style.display = 'none';
    nextBtn.disabled = true;
    nextBtn.querySelector('span').textContent = index === QUIZ_QUESTIONS.length - 1 ? "Ver Resultados" : "Siguiente Pregunta";
  }

  function selectOption(selectedIdx, btnElement) {
    if (hasAnswered) return;
    hasAnswered = true;

    const q = QUIZ_QUESTIONS[currentIdx];
    const isCorrect = selectedIdx === q.answer;

    // Disable all options
    const options = optionsContainer.querySelectorAll('.quiz-opt-btn');
    options.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.answer) {
        btn.classList.add('correct');
        btn.querySelector('.opt-status-icon').textContent = '✅';
      } else if (idx === selectedIdx) {
        btn.classList.add('incorrect');
        btn.querySelector('.opt-status-icon').textContent = '❌';
      }
    });

    if (isCorrect) {
      score++;
      scoreText.textContent = score;
      feedbackIcon.textContent = '🌱';
      feedbackTitle.textContent = '¡Correcto!';
      feedbackBox.className = 'quiz-feedback correct-feedback';
    } else {
      feedbackIcon.textContent = '⚠️';
      feedbackTitle.textContent = 'Incorrecto';
      feedbackBox.className = 'quiz-feedback incorrect-feedback';
    }

    // Set feedback text and show box
    feedbackText.textContent = q.explanation;
    feedbackBox.style.display = 'block';
    
    // Enable Next Button
    nextBtn.disabled = false;
  }

  window.nextQuestion = function() {
    currentIdx++;
    if (currentIdx < QUIZ_QUESTIONS.length) {
      // Transition animation
      quizCard.classList.add('quiz-fade-out');
      setTimeout(() => {
        loadQuestion(currentIdx);
        quizCard.classList.remove('quiz-fade-out');
        quizCard.classList.add('quiz-fade-in');
        setTimeout(() => quizCard.classList.remove('quiz-fade-in'), 300);
      }, 250);
    } else {
      showScoreboard();
    }
  };

  function showScoreboard() {
    quizCard.style.display = 'none';
    
    const percent = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    document.getElementById('scorePercent').textContent = `${percent}%`;
    document.getElementById('scoreFraction').textContent = `(${score} de ${QUIZ_QUESTIONS.length} aciertos)`;

    const emojiEl = document.getElementById('scoreEmoji');
    const titleEl = document.getElementById('scoreTitle');
    const msgEl = document.getElementById('scoreMsg');

    if (score === QUIZ_QUESTIONS.length) {
      emojiEl.textContent = '🏆';
      titleEl.textContent = '¡Desafío Completado!';
      msgEl.textContent = '¡Eco-Héroe Perfecto! Tienes un conocimiento científico impecable sobre el medio ambiente en Nicaragua.';
    } else if (score >= 3) {
      emojiEl.textContent = '🌱';
      titleEl.textContent = '¡Excelente Guardián!';
      msgEl.textContent = 'Tu nivel de conciencia ecológica es alto, sigue promoviendo el cambio.';
    } else {
      emojiEl.textContent = '🍂';
      titleEl.textContent = '¡Sigue Aprendiendo!';
      msgEl.textContent = 'Vuelve a leer los capítulos para mejorar tu puntaje y ayudar a proteger Nicaragua.';
    }

    scoreboard.style.display = 'block';
    scoreboard.classList.add('quiz-fade-in');
  }

  window.restartQuiz = function() {
    currentIdx = 0;
    score = 0;
    scoreboard.style.display = 'none';
    quizCard.style.display = 'block';
    loadQuestion(0);
  };

  // Init first question
  loadQuestion(0);
})();
