// === Einstellungen ===
const SCROLL_DURATION = 800; // ms

// Fixer Header; Höhe aus CSS-Var holen:
function getHeaderOffset() {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--header-h');
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

// Easing
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Smooth scroll zu Y-Position
function smoothScrollTo(targetY, duration = SCROLL_DURATION) {
  return new Promise((resolve) => {
    const startY = window.scrollY || window.pageYOffset;
    const delta = targetY - startY;
    if (Math.abs(delta) < 1) {
      resolve();
      return;
    }

    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeInOutQuad(t);
      window.scrollTo(0, startY + delta * eased);
      if (t < 1) requestAnimationFrame(step);
      else resolve();
    }
    requestAnimationFrame(step);
  });
}

// Aktuelle Section: die, deren top am nächsten an 0 liegt
function getCurrentSectionIndex(sections) {
  let idx = 0,
    best = Infinity;
  for (let i = 0; i < sections.length; i++) {
    const dist = Math.abs(sections[i].getBoundingClientRect().top);
    if (dist < best) {
      best = dist;
      idx = i;
    }
  }
  return idx;
}

let isAnimating = false;

function initSnapScroll() {
  const sections = Array.from(document.querySelectorAll('section'));
  if (sections.length < 2) return;

  window.addEventListener(
    'wheel',
    async (e) => {
      // Wenn schon animiert, weitere Räder ignorieren
      if (isAnimating) {
        e.preventDefault();
        return;
      }

      // Nur bei deutlicher Vertikalbewegung übernehmen
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;

      // Browser-Scroll stoppen, wir animieren selbst
      e.preventDefault();

      const headerOffset = getHeaderOffset();
      const cur = getCurrentSectionIndex(sections);
      const direction = e.deltaY > 0 ? 1 : -1;

      let targetIdx = Math.max(0, Math.min(sections.length - 1, cur + direction));
      if (targetIdx === cur) return;

      const rect = sections[targetIdx].getBoundingClientRect();
      const targetY = window.scrollY + rect.top - headerOffset;

      isAnimating = true;
      try {
        await smoothScrollTo(targetY, SCROLL_DURATION);
      } finally {
        // Mini-Cooldown gegen Mehrfach-Trigger (Trackpads)
        setTimeout(() => {
          isAnimating = false;
        }, 60);
      }
    },
    { passive: false }
  ); // wichtig für preventDefault
}

// Wenn du <script defer> benutzt, ist DOM bis hierhin da:
initSnapScroll();
