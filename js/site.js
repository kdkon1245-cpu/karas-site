/* =========================================================
   KARAS — общее для всех страниц:
   шапка с глазом, меню, часы, футер, появление блоков
   ========================================================= */
(function () {
  const D = window.KARAS_DATA;
  // черновики (draft: true) на сайте не показываем
  D.articles = D.articles.filter((a) => !a.draft);
  D.projects = D.projects.filter((p) => !p.draft);
  const B = window.KARAS_BRAND;
  const page = document.body.dataset.page || "";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n, l = 2) => String(n).padStart(l, "0");
  const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  const fmtDate = (iso) => { const d = new Date(iso + "T12:00:00"); return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`; };
  const arrow = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 16 16 4M7 4h9v9"/></svg>`;
  const qs = (k) => new URLSearchParams(location.search).get(k);

  /* ---------- шапка ---------- */
  const NAV = [
    { id: "projects", href: "projects.html", label: "Проекты", n: D.projects.length },
    { id: "posters", href: "posters.html", label: "Плакаты", n: D.posters.length },
    { id: "articles", href: "articles.html", label: "Статьи", n: D.articles.length },
    { id: "about", href: "index.html#about", label: "Обо мне" },
  ];
  const section = { project: "projects", article: "articles" }[page] || page;
  const cur = (id) => (id === section ? ' aria-current="page"' : "");

  const eyeSVG = `
    <svg viewBox="37 41 287 134" aria-hidden="true">
      <defs><clipPath id="hdr-eye-clip"><path d="${B.almond}"/></clipPath></defs>
      <g class="eye-lid">
        <path d="${B.almond}" fill="#BEFF1D"/>
        <g clip-path="url(#hdr-eye-clip)"><g class="eye-star"><path d="${B.star}" fill="#000"/></g></g>
      </g>
    </svg>`;
  const wordSVG = `<svg viewBox="396 34 756 148" aria-hidden="true"><path d="${B.word}" fill="currentColor"/></svg>`;

  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <a class="logo" href="index.html" aria-label="KARAS — на главную">
      <span class="logo-eye">${eyeSVG}</span>
      <span class="logo-word">${wordSVG}</span>
    </a>
    <nav class="nav" aria-label="Разделы">
      ${NAV.map((n) => `<a href="${n.href}"${cur(n.id)}>${n.label}${n.n ? `<sup>${pad(n.n)}</sup>` : ""}</a>`).join("")}
    </nav>
    ${(() => { const tg = D.site.contacts.find((c) => c.label === "Telegram"); return tg ? `<a class="write-btn" href="${esc(tg.href)}" target="_blank" rel="noopener">Написать ${arrow}</a>` : ""; })()}
    <button class="theme-btn" type="button" aria-label="Сменить тему" title="Сменить тему">
      <svg class="ti-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M5.3 18.7 7 17M17 7l1.7-1.7"/></svg>
      <svg class="ti-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 14.6A8.5 8.5 0 0 1 9.4 4a8.5 8.5 0 1 0 10.6 10.6Z"/></svg>
      <span class="theme-label"></span>
    </button>
    <button class="menu-btn" aria-expanded="false" aria-controls="mobile-menu">Меню</button>`;
  document.body.prepend(header);

  const mm = document.createElement("div");
  mm.className = "mobile-menu"; mm.id = "mobile-menu";
  mm.innerHTML = `
    <a href="index.html"${cur("home")}>Главная</a>
    ${NAV.map((n) => `<a href="${n.href}"${cur(n.id)}>${n.label}${n.n ? `<sup>${pad(n.n)}</sup>` : ""}</a>`).join("")}
    <div class="mm-foot">${D.site.contacts.slice(0, 2).map((c) => `<a href="${esc(c.href)}" style="font:inherit;border:0;padding:0;text-transform:none">${esc(c.value)}</a>`).join("")}</div>`;
  header.after(mm);
  const mbtn = header.querySelector(".menu-btn");
  mbtn.addEventListener("click", () => {
    const open = mm.classList.toggle("is-open");
    mbtn.setAttribute("aria-expanded", open);
    mbtn.textContent = open ? "Закрыть" : "Меню";
    document.body.style.overflow = open ? "hidden" : "";
  });
  mm.addEventListener("click", (e) => { if (e.target.closest("a")) { mm.classList.remove("is-open"); document.body.style.overflow = ""; mbtn.textContent = "Меню"; } });

  /* ---------- тема: тёмная / светлая ---------- */
  const themeBtn = header.querySelector(".theme-btn");
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  const applyTheme = (t) => {
    document.documentElement.dataset.theme = t;
    themeBtn.querySelector(".theme-label").textContent = t === "light" ? "Тёмная" : "Светлая";
    themeBtn.setAttribute("aria-pressed", t === "light");
    if (metaTheme) metaTheme.content = t === "light" ? "#efeee9" : "#000000";
  };
  applyTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  themeBtn.addEventListener("click", () => {
    const t = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.classList.add("theme-anim");
    applyTheme(t);
    try { localStorage.setItem("karas-theme", t); } catch (e) {}
    setTimeout(() => document.documentElement.classList.remove("theme-anim"), 500);
  });

  /* ---------- глаз следит за курсором ---------- */
  (function eye() {
    const svg = header.querySelector(".logo-eye svg");
    const star = svg.querySelector(".eye-star");
    const lid = svg.querySelector(".eye-lid");
    let tx = 0, ty = 0, x = 0, y = 0, rot = 0, trot = 0, lastMove = 0;
    const MAX_X = 26, MAX_Y = 13;
    const aim = (cx, cy) => {
      const r = svg.getBoundingClientRect();
      const ex = r.left + r.width / 2, ey = r.top + r.height / 2;
      const dx = cx - ex, dy = cy - ey, dist = Math.hypot(dx, dy) || 1;
      const k = Math.min(dist / 380, 1);
      tx = (dx / dist) * MAX_X * k; ty = (dy / dist) * MAX_Y * k;
      trot = Math.max(-14, Math.min(14, dx / 60));
      lastMove = performance.now();
    };
    window.addEventListener("pointermove", (e) => aim(e.clientX, e.clientY), { passive: true });
    window.addEventListener("touchstart", (e) => { const t = e.touches[0]; if (t) aim(t.clientX, t.clientY); }, { passive: true });
    if (reduce) return;
    const loop = (t) => {
      if (t - lastMove > 3500) { // скучает — смотрит по сторонам
        const s = Math.sin(t / 1600);
        tx = s * MAX_X * 0.7; ty = Math.cos(t / 2300) * MAX_Y * 0.4; trot = s * 6;
      }
      x += (tx - x) * 0.12; y += (ty - y) * 0.12; rot += (trot - rot) * 0.1;
      star.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${rot.toFixed(2)} 196 106)`);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    const blink = () => {
      lid.classList.add("is-blink");
      setTimeout(() => lid.classList.remove("is-blink"), 140);
      if (Math.random() < 0.25) setTimeout(() => { lid.classList.add("is-blink"); setTimeout(() => lid.classList.remove("is-blink"), 120); }, 320);
      setTimeout(blink, 2600 + Math.random() * 4200);
    };
    setTimeout(blink, 1800);
  })();

  /* ---------- футер ---------- */
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="wrap">
      <div class="footer-row">
        <span>${esc(D.site.name)} — ${esc(D.site.role)}</span>
        <span class="footer-links">${D.site.contacts.map((c) => `<a href="${esc(c.href)}" target="_blank" rel="noopener">${esc(c.label)}</a>`).join("")}</span>
      </div>
      <div class="footer-word">${wordSVG}</div>
      <div class="footer-row"><span>© ${new Date().getFullYear()} KARAS</span><span>${esc(D.site.city)}</span></div>
    </div>`;
  document.body.append(footer);

  /* ---------- появление: шторки и reveal ---------- */
  const io = "IntersectionObserver" in window && !reduce
    ? new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-revealed"); io.unobserve(e.target); } }), { threshold: 0.22, rootMargin: "0px 0px -6% 0px" })
    : null;
  function observe(root = document) {
    root.querySelectorAll(".js-reveal:not(.is-revealed)").forEach((el) => (io ? io.observe(el) : el.classList.add("is-revealed")));
  }

  /* ---------- общие кусочки разметки ---------- */
  function projectCard(p, i) {
    const delays = [0, 90, 160, 60, 220].map((d) => d + Math.round(Math.random() * 120));
    return `
      <a class="project-card js-reveal" href="project.html?id=${encodeURIComponent(p.id)}" data-tags="${esc(p.tags.join("|"))}">
        <div class="cover">
          ${window.KARAS_MEDIA(p, 400, 300)}
          <div class="shutters">${delays.map((d) => `<i style="--d:${d}ms"></i>`).join("")}</div>
          <div class="cover-tags">${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        </div>
        <div class="card-meta">
          <span class="card-num">${pad(i + 1)}</span>
          <h3 class="card-title">${esc(p.title)}</h3>
          <span class="card-year">${p.year}</span>
          <p class="card-sub">${esc(p.subtitle)}</p>
        </div>
      </a>`;
  }
  function articleRow(a, i) {
    return `
      <a class="article-row" href="article.html?id=${encodeURIComponent(a.id)}">
        <span class="mono muted">${pad(i + 1, 3)}</span>
        <h3>${esc(a.title)}</h3>
        <span class="ar-tags">${a.tags.map((t) => `<span class="tag tag--steel">${esc(t)}</span>`).join("")}</span>
        <span class="mono muted ar-date">${fmtDate(a.date)}</span>
        <span class="arrow">${arrow}</span>
      </a>`;
  }
  /* фильтр-пилюли: items — массив объектов с tags */
  // groups (необязательно): [{label, tags}] — несколько тегов под одной кнопкой, чтобы фильтров было мало
  function pills(container, items, onChange, allLabel = "Все", groups) {
    const counts = {};
    if (groups) groups.forEach((g) => (counts[g.label] = items.filter((it) => it.tags.some((t) => g.tags.includes(t))).length));
    else items.forEach((it) => it.tags.forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
    const tags = groups ? groups.map((g) => g.label).filter((l) => counts[l]) : Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    container.innerHTML =
      `<button class="pill" aria-pressed="true" data-tag="">${allLabel}<sup>${items.length}</sup></button>` +
      tags.map((t) => `<button class="pill" aria-pressed="false" data-tag="${esc(t)}">${esc(t)}<sup>${counts[t]}</sup></button>`).join("");
    container.addEventListener("click", (e) => {
      const b = e.target.closest(".pill"); if (!b) return;
      container.querySelectorAll(".pill").forEach((p) => p.setAttribute("aria-pressed", p === b));
      onChange(b.dataset.tag);
    });
  }

  /* ---------- цветной фон страницы (проекты, галерея) ---------- */
  function setBg(bg) {
    const r = document.documentElement.style;
    r.setProperty("--va", bg ? bg.a : "transparent");
    r.setProperty("--vb", bg ? bg.b : "transparent");
    r.setProperty("--vbase", bg ? bg.base : "#090909");
    document.body.classList.toggle("has-bg", !!bg);
  }
  // свечение фона медленно плывёт за прокруткой
  const onScrollBg = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    document.documentElement.style.setProperty("--sp", max > 0 ? (scrollY / max).toFixed(3) : 0);
    document.body.classList.toggle("is-scrolled", scrollY > 24);
  };
  addEventListener("scroll", onScrollBg, { passive: true });
  addEventListener("load", onScrollBg); onScrollBg();

  window.KARAS = { setBg, D, esc, pad, fmtDate, arrow, qs, observe, projectCard, articleRow, pills, reduce, wordSVG, eyeSVG };
  document.addEventListener("DOMContentLoaded", () => observe());
})();
