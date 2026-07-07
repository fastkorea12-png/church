const header = document.querySelector(".site-header");
const revealTargets = document.querySelectorAll(
  ".section, .mission-band, .dark-section, .sample-section, .cta-section"
);

const syncHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();

window.addEventListener("load", () => {
  document.body.classList.add("is-loaded");
});

if ("IntersectionObserver" in window) {
  revealTargets.forEach((target) => target.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealTargets.forEach((target) => observer.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}
