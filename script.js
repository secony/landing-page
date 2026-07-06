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

// ============================================================
// GALERIA — dados
// Para adicionar uma foto nova: acrescente um objeto aqui.
// Nada em index.html ou style.css precisa mudar.
// categoria: "cortes" | "barba" | "degrade" | "sobrancelha"
// tall: true deixa o card ocupando 2 linhas na grade (efeito mosaico)
// ============================================================
const GALLERY_ITEMS = [
  {
    src: "images/sobrancelha.png",
    label: "Sobrancelha",
    categoria: "sobrancelha",
    tall: true,
  },
  {
    src: "images/barba.png",
    label: "Barba Completa",
    categoria: "barba",
    tall: false,
  },
  {
    src: "images/fade+barba.png",
    label: "Fade + Barba",
    categoria: "cortes",
    tall: false,
  },
  {
    src: "images/social.png",
    label: "Social",
    categoria: "cortes",
    tall: false,
  },
  {
    src: "images/degrade11.png",
    label: "Degradê",
    categoria: "degrade",
    tall: true,
  },
  {
    src: "images/degrade.png",
    label: "Degradê + Freestyle",
    categoria: "degrade",
    tall: false,
  },
];

const GALLERY_FILTERS = [
  { key: "todos", label: "Todos" },
  { key: "cortes", label: "Cortes" },
  { key: "barba", label: "Barba" },
  { key: "degrade", label: "Degradê" },
  { key: "sobrancelha", label: "Sobrancelha" },
];

let galleryActiveFilter = "todos";
// itens atualmente visíveis na grade (respeitando o filtro) — é essa lista
// que o lightbox navega com as setas, não o GALLERY_ITEMS inteiro.
let galleryVisibleItems = [];
let lightboxIndex = 0;

function esc(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderGalleryFilters() {
  const wrap = document.getElementById("galleryFilters");
  if (!wrap) return;
  wrap.innerHTML = "";
  GALLERY_FILTERS.forEach((f) => {
    const btn = document.createElement("button");
    btn.className =
      "gallery-filter-btn" + (f.key === galleryActiveFilter ? " active" : "");
    btn.textContent = f.label;
    btn.addEventListener("click", () => {
      galleryActiveFilter = f.key;
      renderGalleryFilters();
      renderGalleryGrid();
    });
    wrap.appendChild(btn);
  });
}

function renderGalleryGrid() {
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;

  galleryVisibleItems =
    galleryActiveFilter === "todos"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((it) => it.categoria === galleryActiveFilter);

  grid.innerHTML = "";
  galleryVisibleItems.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "gallery-item reveal" + (item.tall ? " tall" : "");
    card.innerHTML = `
      <img src="${esc(item.src)}" alt="${esc(item.label)}" loading="lazy">
      <div class="gallery-overlay"><span>${esc(item.label)}</span></div>
    `;
    card.addEventListener("click", () => openLightbox(i));
    grid.appendChild(card);
  });

  // Reaplica o observer de scroll-reveal nos cards recém-criados
  // (o observer é criado mais abaixo neste arquivo e exposto em window.__revealObserver)
  if (window.__revealObserver) {
    grid.querySelectorAll(".reveal").forEach((el) => window.__revealObserver.observe(el));
  }
}

// ============================================================
// LIGHTBOX
// ============================================================
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxLabel = document.getElementById("lightboxLabel");
const lightboxCount = document.getElementById("lightboxCount");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

function openLightbox(index) {
  lightboxIndex = index;
  showLightboxItem();
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

function showLightboxItem() {
  const item = galleryVisibleItems[lightboxIndex];
  if (!item) return;
  lightboxImg.src = item.src;
  lightboxImg.alt = item.label;
  lightboxLabel.textContent = item.label;
  lightboxCount.textContent = `${lightboxIndex + 1} / ${galleryVisibleItems.length}`;
  lightboxPrev.disabled = lightboxIndex === 0;
  lightboxNext.disabled = lightboxIndex === galleryVisibleItems.length - 1;
}

function lightboxNav(delta) {
  const next = lightboxIndex + delta;
  if (next < 0 || next >= galleryVisibleItems.length) return;
  lightboxIndex = next;
  showLightboxItem();
}

if (lightbox) {
  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  document.getElementById("lightboxBg").addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", () => lightboxNav(-1));
  lightboxNext.addEventListener("click", () => lightboxNav(1));

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") lightboxNav(-1);
    if (e.key === "ArrowRight") lightboxNav(1);
  });

  // swipe no mobile
  let touchStartX = null;
  lightbox.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
    },
    { passive: true },
  );
  lightbox.addEventListener(
    "touchend",
    (e) => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) lightboxNav(dx < 0 ? 1 : -1);
      touchStartX = null;
    },
    { passive: true },
  );
}

// Monta a galeria antes do observer de scroll-reveal ser criado logo abaixo,
// assim os cards dinâmicos entram na primeira varredura de .reveal.
renderGalleryFilters();
renderGalleryGrid();

// Scroll reveal
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, i * 100);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 },
);
window.__revealObserver = observer;

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