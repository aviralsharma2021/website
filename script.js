const root = document.documentElement;
const revealItems = document.querySelectorAll(".reveal");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const navLinks = document.querySelectorAll(".site-nav a");
const sections = [...document.querySelectorAll("main section[id]")];
const swipeRails = [...document.querySelectorAll(".metrics, .window-grid, .visual-teal")];

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.05,
    rootMargin: "0px 0px 0px 0px",
  }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 45, 180)}ms`;
  revealObserver.observe(item);
});

const updateMotion = () => {
  const hero = document.querySelector(".hero");
  if (hero) {
    const rect = hero.getBoundingClientRect();
    const progress = Math.min(Math.max((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0), 1);
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

const resetSwipeRails = () => {
  if (window.innerWidth <= 980) {
    swipeRails.forEach((rail) => {
      rail.scrollLeft = 0;
      try {
        rail.scrollTo(0, 0);
      } catch (error) {
        // Older mobile browsers may not support Element.scrollTo options/object.
      }
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
        try {
          entry.target.scrollTo(0, 0);
        } catch (error) {
          // Ignore unsupported Element.scrollTo signatures.
        }
      }
    });
  },
  {
    threshold: 0.2,
  }
);

swipeRails.forEach((rail) => railObserver.observe(rail));

window.addEventListener("mousemove", (event) => {
  root.style.setProperty("--pointer-x", `${(event.clientX / window.innerWidth) * 100}%`);
  root.style.setProperty("--pointer-y", `${(event.clientY / window.innerHeight) * 100}%`);
});

window.addEventListener("resize", () => {
  updateMotion();
  hardResetSwipeRails();
});
window.addEventListener("pageshow", hardResetSwipeRails);
window.addEventListener("load", hardResetSwipeRails);
updateMotion();
hardResetSwipeRails();
