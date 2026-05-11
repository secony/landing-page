// Custom cursor
const cursor = document.getElementById("cursor");
const ring = document.getElementById("cursorRing");
let mouseX = 0,
  mouseY = 0;
let ringX = 0,
  ringY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX - 6 + "px";
  cursor.style.top = mouseY - 6 + "px";
});

function animateRing() {
  ringX += (mouseX - ringX - 18) * 0.12;
  ringY += (mouseY - ringY - 18) * 0.12;
  ring.style.left = ringX + "px";
  ring.style.top = ringY + "px";
  requestAnimationFrame(animateRing);
}
animateRing();

// Hover effect on interactive elements
document.querySelectorAll("a, button, .service-card").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursor.style.transform = "scale(2)";
    ring.style.transform = "scale(1.5)";
  });
  el.addEventListener("mouseleave", () => {
    cursor.style.transform = "scale(1)";
    ring.style.transform = "scale(1)";
  });
});

// Scroll reveal
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, i * 100);
      }
    });
  },
  { threshold: 0.1 },
);

reveals.forEach((el) => observer.observe(el));

// Nav scroll effect
window.addEventListener("scroll", () => {
  const nav = document.querySelector("nav");
  if (window.scrollY > 50) {
    nav.style.background = "rgba(13,13,13,0.97)";
    nav.style.borderBottom = "1px solid rgba(201,168,76,0.1)";
  } else {
    nav.style.background =
      "linear-gradient(to bottom, rgba(13,13,13,0.95), transparent)";
    nav.style.borderBottom = "none";
  }
});

// Ano dinâmico no footer
const yearEl = document.getElementById("footer-year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Marquee duplicado via JS para loop suave
const track = document.querySelector(".marquee-track");
if (track) {
  track.innerHTML += track.innerHTML;
}
