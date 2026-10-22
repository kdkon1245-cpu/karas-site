/* Внутренние страницы: проекты, проект, плакаты, статьи, статья */
(function () {
  const K = window.KARAS, D = K.D, page = document.body.dataset.page;
  const $ = (s, r = document) => r.querySelector(s);
  const notFound = (what, back, label) => `<div class="wrap page"><a class="back" href="${back}">← ${label}</a><h1 class="detail-title">${what} не найден</h1></div>`;

  /* ---------- ПРОЕКТЫ ---------- */
  if (page === "projects") {
    $("[data-count]").textContent = K.pad(D.projects.length);
    const grid = $("[data-grid]");
    // направления вместо дюжины тегов: каждое собирает несколько тегов
    const DIRS = [
      { label: "Брендинг", tags: ["Брендинг", "Айдентика", "Логотипы", "Мерч"] },
      { label: "Плакаты и графика", tags: ["Плакаты", "Графика", "Иллюстрация", "Стикеры"] },
      { label: "Шрифт", tags: ["Шрифт", "Типографика"] },
      { label: "3D и анимация", tags: ["3D", "Анимация"] },
    ];
    const render = (label) => {
      const dir = DIRS.find((d) => d.label === label);
      const list = D.projects.filter((p) => !dir || p.tags.some((t) => dir.tags.includes(t)));
      grid.innerHTML = list.map((p) => K.projectCard(p, D.projects.indexOf(p))).join("");
      K.observe(grid);
    };
    K.pills($("[data-pills]"), D.projects, render, "Все", DIRS);
    render("");
  }

  /* ---------- ПРОЕКТ ---------- */
  if (page === "project") {
    const i = D.projects.findIndex((p) => p.id === K.qs("id"));
    const p = D.projects[i];
    const main = $("main");
    if (!p) { main.innerHTML = notFound("Проект", "projects.html", "Все проекты"); return; }
    document.title = `${p.title} — KARAS`;
    K.setBg(p.bg);
    const next = D.projects[(i + 1) % D.projects.length];
    const fact = (k, v) => (v ? `<div><dt>${k}</dt><dd>${v}</dd></div>` : "");
    const hasBody = !!(p.body && p.body.length); // нет описания — кнопки ставим под вводный текст, без пустого блока «О проекте»
    const links = (p.links || []).map((l) => `<a class="link-more" href="${K.esc(l.href)}" target="_blank" rel="noopener">${K.esc(l.label)} ${K.arrow}</a>`).join("");
    // содержимое кейса: картинки и видео по порядку (как на Dprofile)
    const flow = (p.blocks || []).map((b, k) => {
      if (b.img) return `<figure class="cf-item"><img src="${K.esc(b.img)}" width="${b.w}" height="${b.h}" alt="${K.esc(p.title)} — изображение ${k + 1}" loading="${k < 2 ? "eager" : "lazy"}" decoding="async"></figure>`;
      if (b.video) return `<div class="cf-item cf-video" style="aspect-ratio:${b.w} / ${b.h}"><iframe src="${K.esc(b.video)}" loading="lazy" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowfullscreen title="${K.esc(p.title)} — видео"></iframe></div>`;
      return "";
    }).join("");
    // старый формат (заглушки): gallery из seed
    const legacy = !flow && (p.gallery || []).length
      ? `<div class="gallery">${p.gallery.map((g, k) => `<div class="g-item js-reveal reveal">${window.KARAS_MEDIA(g, k === 0 ? 800 : 300, k === 0 ? 450 : 400, p.title)}</div>`).join("")}</div>` : "";
    main.innerHTML = `
      <article class="wrap page">
        <a class="back" href="projects.html">← Все проекты</a>
        <div class="detail-head">
          <div>
            <div class="cover-tags" style="position:static;margin-bottom:18px">${p.tags.map((t) => `<span class="tag">${K.esc(t)}</span>`).join("")}</div>
            <h1 class="detail-title project-title">${K.esc(p.title)}</h1>
            <p class="detail-lead">${K.esc(p.lead || p.subtitle)}</p>
            ${!hasBody && links ? `<div class="project-links project-links--head">${links}</div>` : ""}
          </div>
          <dl class="facts">
            ${fact("Год", p.year)}${fact("Клиент", K.esc(p.client))}${fact("Формат", K.esc(p.subtitle))}${fact("Направление", K.esc(p.role))}${fact("Команда", K.esc(p.team))}
          </dl>
        </div>
        ${hasBody ? `<div class="detail-body">
          <div class="mono muted" style="font-size:12px;text-transform:uppercase">О проекте</div>
          <div><div class="prose">${(p.body || []).map((t) => `<p>${K.esc(t)}</p>`).join("")}</div>${links ? `<div class="project-links">${links}</div>` : ""}</div>
        </div>` : ""}
        ${flow ? `<div class="case-flow">${flow}</div>` : legacy}
        ${p.source ? `<p class="case-source mono"><a href="${K.esc(p.source)}" target="_blank" rel="noopener">Этот кейс на Dprofile ${K.arrow}</a></p>` : ""}
        <a class="next-link" href="project.html?id=${encodeURIComponent(next.id)}">
          <span class="mono muted">Следующий проект</span><span class="nl-title">${K.esc(next.title)} →</span>
        </a>
      </article>`;
    K.observe(main);
  }

  /* ---------- СТАТЬИ ---------- */
  if (page === "articles") {
    $("[data-count]").textContent = K.pad(D.articles.length);
    const list = $("[data-list]");
    const render = (tag) => (list.innerHTML = D.articles.filter((a) => !tag || a.tags.includes(tag)).map((a) => K.articleRow(a, D.articles.indexOf(a))).join(""));
    K.pills($("[data-pills]"), D.articles, render);
    render("");
  }

  /* ---------- СТАТЬЯ ---------- */
  if (page === "article") {
    const i = D.articles.findIndex((a) => a.id === K.qs("id"));
    const a = D.articles[i];
    const main = $("main");
    if (!a) { main.innerHTML = notFound("Материал", "articles.html", "Все статьи"); return; }
    document.title = `${a.title} — KARAS`;
    const next = D.articles.length > 1 ? D.articles[(i + 1) % D.articles.length] : null;
    // короткие черновые статьи хранятся прямо в data.js (body), длинные — в отдельном файле (bodyScript)
    const block = (b) =>
      b.h ? `<h2>${K.esc(b.h)}</h2>` : b.q ? `<blockquote class="pull">${K.esc(b.q)}</blockquote>` : b.img ? `<figure><img src="${K.esc(b.img)}" alt="${K.esc(b.alt || "")}" loading="lazy"></figure>` : `<p>${K.esc(b.p)}</p>`;

    const render = (rich) => {
      const toc = rich && rich.toc && rich.toc.length
        ? `<nav class="toc" aria-label="Содержание"><details open><summary class="mono">Содержание</summary><ol>${rich.toc.map(([lvl, t, id]) => `<li class="toc-l${lvl}"><a href="#${id}">${K.esc(t)}</a></li>`).join("")}</ol></details></nav>`
        : "";
      main.innerHTML = `
        <article class="wrap page">
          <a class="back" href="articles.html">← Все статьи</a>
          <div class="cover-tags" style="position:static;margin-bottom:18px">${a.tags.map((t) => `<span class="tag tag--steel">${K.esc(t)}</span>`).join("")}</div>
          <h1 class="detail-title article-title">${K.esc(a.title)}</h1>
          <p class="mono muted article-meta">${K.fmtDate(a.date)} · ${a.read} мин чтения${a.author ? ` · ${K.esc(a.author)}` : ""}</p>
          <div class="cover detail-cover js-reveal">
            ${window.KARAS_MEDIA(a, 800, 450)}
            <div class="shutters">${[0, 120, 60, 200, 90].map((d) => `<i style="--d:${d}ms"></i>`).join("")}</div>
          </div>
          <div class="detail-body article-body">
            <aside class="article-side">
              <p class="detail-lead">${K.esc(a.lead)}</p>
              ${toc}
            </aside>
            <div class="prose">${rich ? rich.html : a.body.map(block).join("")}</div>
          </div>
          ${next ? `<a class="next-link" href="article.html?id=${encodeURIComponent(next.id)}">
            <span class="mono muted">Дальше читать</span><span class="nl-title" style="font-size:clamp(22px,3.4vw,48px)">${K.esc(next.title)} →</span>
          </a>` : ""}
        </article>`;
      K.observe(main);
      if (location.hash) { const t = document.getElementById(decodeURIComponent(location.hash.slice(1))); t && t.scrollIntoView(); }

      // кнопки «Скопировать» у промтов
      main.addEventListener("click", async (e) => {
        const btn = e.target.closest(".copy-btn"); if (!btn) return;
        const box = btn.closest(".prompt, .prompt-block");
        const text = (box.querySelector(".pt, p") || box).innerText.trim();
        try { await navigator.clipboard.writeText(text); }
        catch (err) { const ta = document.createElement("textarea"); ta.value = text; document.body.append(ta); ta.select(); document.execCommand("copy"); ta.remove(); }
        btn.textContent = "Скопировано"; btn.classList.add("is-done");
        setTimeout(() => { btn.textContent = "Скопировать"; btn.classList.remove("is-done"); }, 1600);
      });

      // подсветка текущего раздела в содержании
      const links = [...main.querySelectorAll(".toc a")];
      const heads = [...main.querySelectorAll(".prose h2[id], .prose h3[id]")];
      if (links.length) {
        const byId = new Map(links.map((l) => [decodeURIComponent(l.hash.slice(1)), l]));
        let ticking = false;
        const update = () => {
          ticking = false;
          const line = innerHeight * 0.3;
          let cur = null;
          for (const h of heads) { if (h.getBoundingClientRect().top - line <= 0) cur = h; else break; }
          links.forEach((l) => l.classList.remove("is-active"));
          if (cur) byId.get(cur.id)?.classList.add("is-active");
        };
        addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
        update();
        if (innerWidth < 860) main.querySelector(".toc details")?.removeAttribute("open");
      }
    };

    if (a.bodyScript) {
      const ready = () => render((window.KARAS_ARTICLE_BODIES || {})[a.id]);
      if ((window.KARAS_ARTICLE_BODIES || {})[a.id]) ready();
      else {
        const sc = document.createElement("script");
        sc.src = a.bodyScript; sc.onload = ready;
        sc.onerror = () => { main.innerHTML = notFound("Текст статьи", "articles.html", "Все статьи"); };
        document.body.append(sc);
      }
    } else render(null);
  }

  /* ---------- ПЛАКАТЫ ---------- */
  if (page === "posters") {
    const P = window.KARAS_POSTERS;
    const cap = $("[data-caption]");
    const stack = P.Stack($("[data-stack]"), D.posters, {
      onFocus(p, k, n) {
        cap.innerHTML = `<span class="sc-num">${K.pad(k + 1)} / ${K.pad(n)}</span><h2 class="sc-title">${K.esc(p.title)}</h2><div class="sc-tags">${p.tags.map((t) => `<span class="tag">${K.esc(t)}</span>`).join("")}${[p.series, p.year].filter(Boolean).map((x) => `<span class="tag tag--steel">${K.esc(x)}</span>`).join("")}</div>`;
      },
    });
    const cab = P.Cabinet($("[data-cabinet]"), D.posters);
    $("[data-total]").textContent = K.pad(D.posters.length, 3);

    // фильтр по вайбу (в двух видах синхронизирован) + фон под цветовую гамму
    const boxes = [...document.querySelectorAll("[data-pills]")];
    const vibes = D.vibes || [];
    const root = document.documentElement;
    const setBg = (v) => {
      root.style.setProperty("--va", v ? v.a : "transparent");
      root.style.setProperty("--vb", v ? v.b : "transparent");
      root.style.setProperty("--vbase", v ? v.base : "#090909");
      document.body.dataset.vibe = v ? v.name : "";
    };
    const apply = (name) => {
      stack.filter(name); cab.filter(name);
      boxes.forEach((b) => b.querySelectorAll(".pill").forEach((p) => p.setAttribute("aria-pressed", p.dataset.tag === name)));
      setBg(vibes.find((v) => v.name === name));
    };
    const pillsHTML = `<button class="pill" aria-pressed="true" data-tag="">Все<sup>${D.posters.length}</sup></button>` +
      vibes.map((v) => `<button class="pill pill--vibe" aria-pressed="false" data-tag="${K.esc(v.name)}" title="${K.esc(v.note || "")}" style="--dot:${v.a}">${K.esc(v.name)}<sup>${D.posters.filter((p) => p.vibe === v.name).length}</sup></button>`).join("");
    boxes.forEach((b) => {
      b.innerHTML = pillsHTML;
      b.addEventListener("click", (e) => { const t = e.target.closest(".pill"); if (t) apply(t.dataset.tag); });
    });
    setBg(null);

    // OVERVIEW / INDEX
    const btns = [...document.querySelectorAll("[data-view-btn]")];
    const setView = (v, push) => {
      document.body.dataset.view = v;
      btns.forEach((b) => b.setAttribute("aria-pressed", b.dataset.viewBtn === v));
      if (push) history.replaceState(null, "", v === "index" ? "#index" : location.pathname + location.search);
      if (v === "overview") { scrollTo(0, 0); $("[data-stack]").focus({ preventScroll: true }); }
      dispatchEvent(new Event("resize"));
    };
    btns.forEach((b) => b.addEventListener("click", () => setView(b.dataset.viewBtn, true)));
    setView(location.hash === "#index" ? "index" : "overview", false);
  }
})();
