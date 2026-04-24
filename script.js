const root = document.documentElement;
const revealItems = document.querySelectorAll(".reveal");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const navLinks = document.querySelectorAll(".site-nav a");
const sections = [...document.querySelectorAll("main section[id]")];

/* ─── Reveal on scroll ─── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.04, rootMargin: "0px 0px -20px 0px" }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 40, 160)}ms`;
  revealObserver.observe(item);
});

/* ─── Metric counter animation ─── */
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || "";
  const duration = 1100;
  let startTime = null;

  el.classList.add("is-counting");

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = Math.min(timestamp - startTime, duration);
    const progress = easeOutCubic(elapsed / duration);
    el.textContent = Math.round(target * progress) + suffix;
    if (elapsed < duration) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target + suffix;
    }
  }

  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.dataset.count) {
          animateCounter(el);
          counterObserver.unobserve(el);
        }
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".metric-value[data-count]").forEach((el) => {
  counterObserver.observe(el);
});

/* ─── Parallax + active nav on scroll ─── */
const updateMotion = () => {
  const hero = document.querySelector(".hero");
  if (hero) {
    const rect = hero.getBoundingClientRect();
    const progress = Math.min(
      Math.max((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0),
      1
    );
    root.style.setProperty("--hero-shift", `${progress * 30}px`);
  }

  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.parallax || 0.15);
    const rect = item.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const offset = (midpoint - window.innerHeight / 2) * speed;
    item.style.setProperty("--parallax-y", `${offset * -0.12}px`);
  });

  let activeId = "";
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 140 && rect.bottom >= 140) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    link.classList.toggle("is-active", href === `#${activeId}`);
  });
};

let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateMotion();
      ticking = false;
    });
    ticking = true;
  }
});

/* ─── Mouse-tracked ambient glow ─── */
window.addEventListener("mousemove", (event) => {
  root.style.setProperty("--pointer-x", `${(event.clientX / window.innerWidth) * 100}%`);
  root.style.setProperty("--pointer-y", `${(event.clientY / window.innerHeight) * 100}%`);
});

/* ─── Swipe rails reset ─── */
const swipeRails = [...document.querySelectorAll(".metrics, .window-grid, .visual-teal")];

const resetSwipeRails = () => {
  if (window.innerWidth <= 980) {
    swipeRails.forEach((rail) => {
      rail.scrollLeft = 0;
      try { rail.scrollTo(0, 0); } catch (_) {}
    });
  }
};

const hardResetSwipeRails = () => {
  resetSwipeRails();
  window.requestAnimationFrame(resetSwipeRails);
  window.setTimeout(resetSwipeRails, 120);
  window.setTimeout(resetSwipeRails, 320);
  window.setTimeout(resetSwipeRails, 650);
};

const railObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && window.innerWidth <= 980) {
        entry.target.scrollLeft = 0;
        try { entry.target.scrollTo(0, 0); } catch (_) {}
      }
    });
  },
  { threshold: 0.2 }
);

swipeRails.forEach((rail) => railObserver.observe(rail));

window.addEventListener("resize", () => { updateMotion(); hardResetSwipeRails(); });
window.addEventListener("pageshow", hardResetSwipeRails);
window.addEventListener("load", hardResetSwipeRails);

updateMotion();
hardResetSwipeRails();

/* ── Mobile hamburger menu ── */
(function () {
  const btn = document.getElementById('hamburger');
  const drawer = document.getElementById('mobile-nav');
  if (!btn || !drawer) return;

  // Set drawer top to match actual header height
  function setDrawerTop() {
    const header = document.querySelector('.site-header');
    if (header) {
      const rect = header.getBoundingClientRect();
      // Position just below the header card with a small gap
      drawer.style.top = (rect.bottom + 8) + 'px';
    }
  }

  // Reposition on scroll (header is sticky so rect changes)
  window.addEventListener('scroll', function() {
    if (drawer.classList.contains('is-open')) {
      setDrawerTop();
    }
  }, { passive: true });

  function closeMenu() {
    btn.classList.remove('is-open');
    drawer.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
  }

  function openMenu() {
    setDrawerTop();
    btn.classList.add('is-open');
    drawer.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
  }

  btn.addEventListener('click', function () {
    if (drawer.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close when a nav link is tapped
  drawer.querySelectorAll('.mobile-nav-link').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside tap
  document.addEventListener('click', function (e) {
    if (!btn.contains(e.target) && !drawer.contains(e.target)) {
      closeMenu();
    }
  });
})();
