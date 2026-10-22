/* Главная */
(function () {
  const K = window.KARAS, D = K.D, B = window.KARAS_BRAND;
  const $ = (s, r = document) => r.querySelector(s);

  /* ---------- первый экран ---------- */
  const hero = $(".hero"), cur = $(".hero-cursor");
  let x = innerWidth * 0.55, y = innerHeight * 0.45, tx = x, ty = y, last = -1e9, touch = false;
  const set = (e) => { const r = hero.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top; last = performance.now(); };

  // предметы на столе: раскладка из Figma, физика и брелоки на шарнирах — js/table.js
  hero.addEventListener("pointerdown", (e) => { touch = e.pointerType !== "mouse"; set(e); });
  hero.addEventListener("pointermove", (e) => { touch = e.pointerType !== "mouse"; set(e); });
  window.KARAS_TABLE_INIT(hero, $("[data-table]"), { reduce: K.reduce, onEmpty: () => flash() });
  hero.style.touchAction = "pan-y";

  // вспышка по клику: свет на миг раскрывается
  let flashT = 0;
  function flash() { flashT = performance.now(); }

  const baseR = () => (innerWidth < 760 ? 170 : 240);
  function loop(t) {
    if (t - last > (touch ? 1800 : 2600)) { // никто не водит — свет гуляет сам
      const w = hero.clientWidth, h = hero.clientHeight;
      tx = w * (0.5 + 0.36 * Math.sin(t / 2100)); ty = h * (0.48 + 0.3 * Math.sin(t / 1300 + 1));
    }
    x += (tx - x) * 0.14; y += (ty - y) * 0.14;
    const f = Math.max(0, 1 - (t - flashT) / 900);
    const r = baseR() * (1 + f * f * 5);
    hero.style.setProperty("--x", x.toFixed(1) + "px");
    hero.style.setProperty("--y", y.toFixed(1) + "px");
    hero.style.setProperty("--r", r.toFixed(0) + "px");
    cur.style.setProperty("--cx", tx + "px"); cur.style.setProperty("--cy", ty + "px");
    requestAnimationFrame(loop);
  }
  if (!K.reduce) requestAnimationFrame(loop);

  // при скролле темнота рассеивается
  const onScroll = () => hero.style.setProperty("--dark", Math.max(0, 1 - scrollY / (innerHeight * 0.7)).toFixed(3));
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- блоки ---------- */
  document.querySelectorAll("[data-count]").forEach((el) => (el.textContent = K.pad(D[el.dataset.count].length)));
  document.querySelectorAll("[data-arrow]").forEach((el) => (el.innerHTML = K.arrow));

  const featured = D.projects.filter((p) => p.featured).slice(0, 4);
  $("[data-featured]").innerHTML = featured.map((p) => K.projectCard(p, D.projects.indexOf(p))).join("");

  window.KARAS_POSTERS.Stack($("[data-stack]"), D.posters, { compact: true });

  $("[data-articles]").innerHTML = D.articles.slice(0, 3).map(K.articleRow).join("");

  $("[data-about]").innerHTML = D.site.about.map((p) => `<p>${K.esc(p)}</p>`).join("");
  $("[data-services]").innerHTML = D.site.services.map((s) => `<span class="tag">${K.esc(s)}</span>`).join("");
  $("[data-contacts]").innerHTML = D.site.contacts
    .map((c) => `<a class="contact" href="${K.esc(c.href)}" target="_blank" rel="noopener"><span>${K.esc(c.label)}</span><b>${K.esc(c.value)}</b>${K.arrow}</a>`)
    .join("");

  K.observe();
})();
