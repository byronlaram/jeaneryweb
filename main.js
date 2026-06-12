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
  // ── Imágenes PNG de región ──
  const regionImgs = document.querySelectorAll('.map-region-img');
  regionImgs.forEach(img => img.classList.remove('active'));

  const activeImg = document.getElementById('region-' + regionId);
  if (activeImg) {
    activeImg.classList.add('active');
    const stack = document.getElementById('mapImgStack');
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
  const growingTrees = document.querySelectorAll('.grow-tree');
  const transformBg = document.getElementById('transformBg');

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

  function updateChecklist() {
    const checked = document.querySelectorAll('.check-input:checked').length;
    const total = checkInputs.length;
    const percent = Math.round((checked / total) * 100);

    // Progress ring
    const offset = totalRingCircumference - (totalRingCircumference * percent / 100);
    progressRing.style.strokeDashoffset = offset;
    progressLabel.textContent = percent + '%';

    // Health bar
    healthBarFill.style.width = percent + '%';
    healthPercentage.textContent = percent + '%';

    // Eco score
    const score = Math.round(percent);
    ecoScore.textContent = score;
    const ecoOffset = totalEcoCircumference - (totalEcoCircumference * score / 100);
    ecoScoreCircle.style.strokeDashoffset = ecoOffset;

    // Eco message
    const msgIndex = Math.floor(checked * (ecoMessages.length - 1) / total);
    ecoMessage.textContent = ecoMessages[Math.min(msgIndex, ecoMessages.length - 1)];

    // Growing trees
    growingTrees.forEach((tree, i) => {
      if (i < checked * Math.ceil(growingTrees.length / total)) {
        tree.style.opacity = '1';
        tree.style.transform = 'scale(1)';
      } else {
        tree.style.opacity = '0';
        tree.style.transform = 'scale(0)';
      }
    });

    // Transform background
    if (transformBg) {
      const greenIntensity = percent / 100;
      transformBg.style.background = `radial-gradient(ellipse at 50% 50%, rgba(46,125,50,${greenIntensity * 0.3}) 0%, transparent 70%)`;
    }

    // Completion badge
    if (checked === total) {
      completionBadge.classList.add('visible');
      triggerConfetti();
    } else {
      completionBadge.classList.remove('visible');
    }
  }

  checkInputs.forEach(input => {
    input.addEventListener('change', () => {
      updateChecklist();

      // Ripple effect on label
      const label = input.closest('.check-item');
      if (label && input.checked) {
        label.style.borderColor = 'rgba(76,175,80,0.5)';
        label.style.background = 'rgba(46,125,50,0.1)';
        setTimeout(() => {
          label.style.borderColor = '';
          label.style.background = '';
        }, 600);
      }
    });
  });

  // Initialize tree transforms
  growingTrees.forEach(tree => {
    tree.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
    tree.style.opacity = '0';
    tree.style.transform = 'scale(0)';
    tree.style.transformOrigin = 'bottom center';
    tree.removeAttribute('opacity'); // Remove SVG opacity attr, use CSS
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
