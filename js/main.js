/* ============================================
   STOCK & TELL —SCRIPTS
   js/main.js
   ============================================ */

/* ── DATA ────────────────────────────────── */
const SLIDES = [
  { id: 's1',  label: 'Title' },
  { id: 's2',  label: 'Problem' },
  { id: 's3',  label: 'Solution' },
  { id: 's4',  label: 'Value Prop' },
  { id: 's5',  label: 'Users' },
  { id: 's6',  label: 'Journey' },
  { id: 's7',  label: 'Platform' },
  { id: 's8',  label: 'Architecture' },
  { id: 's9',  label: 'Interop' },
  { id: 's10', label: 'Testing' },
  { id: 's11', label: 'Demo' },
  { id: 's12', label: 'Challenges' },
  { id: 's13', label: 'Reflection' },
  { id: 's14', label: 'Final Pitch' },
];

const TICKERS = [
  { sym: 'AAPL',  price: '212.40', chg: '+1.2%',  pos: true  },
  { sym: 'TSLA',  price: '248.80', chg: '-0.8%',  pos: false },
  { sym: 'NVDA',  price: '875.30', chg: '+3.1%',  pos: true  },
  { sym: 'MSFT',  price: '418.50', chg: '+0.5%',  pos: true  },
  { sym: 'AMZN',  price: '189.70', chg: '-0.3%',  pos: false },
  { sym: 'GOOG',  price: '172.90', chg: '+1.7%',  pos: true  },
  { sym: 'META',  price: '524.10', chg: '+2.4%',  pos: true  },
  { sym: 'BRK.B', price: '410.20', chg: '+0.1%',  pos: true  },
  { sym: 'JPM',   price: '213.60', chg: '-0.6%',  pos: false },
  { sym: 'SPY',   price: '548.90', chg: '+0.9%',  pos: true  },
];

/* ── TICKER ──────────────────────────────── */
function buildTicker() {
  const track = document.getElementById('ticker-track');
  if (!track) return;
  [...TICKERS, ...TICKERS].forEach(t => {
    const el = document.createElement('div');
    el.className = 'ticker-item';
    el.innerHTML = `<span class="sym">${t.sym}</span>`
                 + `<span class="price">${t.price}</span> `
                 + `<span class="chg ${t.pos ? 'pos' : 'neg'}">${t.chg}</span>`;
    track.appendChild(el);
  });
}

/* ── NAV ─────────────────────────────────── */
function buildNav() {
  const container = document.getElementById('nav-slides');
  const total     = document.getElementById('nav-total');
  if (!container) return;

  SLIDES.forEach(s => {
    const btn = document.createElement('button');
    btn.className    = 'nav-slide-btn';
    btn.dataset.id   = s.id;
    btn.textContent  = s.label;
    btn.addEventListener('click', () =>
      document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })
    );
    container.appendChild(btn);
  });

  if (total) total.textContent = String(SLIDES.length).padStart(2, '0');
}

/* ── SCROLL OBSERVER ─────────────────────── */
function initObserver() {
  const sections = document.querySelectorAll('section');
  const navBtns  = document.querySelectorAll('.nav-slide-btn');
  const current  = document.getElementById('nav-current');

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // Reveal inner
      const inner = entry.target.querySelector('.slide-inner');
      if (inner) inner.classList.add('visible');

      // Nav highlight + counter
      const idx = Array.from(sections).indexOf(entry.target);
      navBtns.forEach(b => b.classList.remove('active'));
      if (navBtns[idx]) navBtns[idx].classList.add('active');
      if (current) current.textContent = String(idx + 1).padStart(2, '0');
    });
  }, { threshold: 0.22 });

  sections.forEach(s => io.observe(s));
}

/* ── PROGRESS BAR ────────────────────────── */
function initProgress() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
  }, { passive: true });
}

/* ── CUSTOM CURSOR ───────────────────────── */
function initCursor() {
  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx - 3.5}px, ${my - 3.5}px)`;
  }, { passive: true });

  (function animRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.transform = `translate(${rx - 15}px, ${ry - 15}px)`;
    requestAnimationFrame(animRing);
  })();

  // Grow ring on hover
  document.querySelectorAll('button, a, .card, .problem-list li').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width  = '48px';
      ring.style.height = '48px';
      ring.style.opacity = '0.7';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width  = '30px';
      ring.style.height = '30px';
      ring.style.opacity = '0.45';
    });
  });
}

/* ── ANIMATED COUNTER ────────────────────── */
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target  = parseFloat(el.dataset.count);
    const suffix  = el.dataset.suffix || '';
    const dur     = 1400;
    const start   = performance.now();

    const io = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();

      (function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * ease) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(performance.now());
    }, { threshold: 0.5 });

    io.observe(el);
  });
}

/* ── KEYBOARD NAV ────────────────────────── */
function initKeyboard() {
  const sections = document.querySelectorAll('section');
  let current = 0;

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      current = Math.min(current + 1, sections.length - 1);
      sections[current].scrollIntoView({ behavior: 'smooth' });
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      current = Math.max(current - 1, 0);
      sections[current].scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Keep current in sync with scroll
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting)
        current = Array.from(sections).indexOf(entry.target);
    });
  }, { threshold: 0.5 });
  sections.forEach(s => io.observe(s));
}

/* ── INIT ────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  buildTicker();
  buildNav();
  initObserver();
  initProgress();
  initCursor();
  animateCounters();
  initKeyboard();
});
