/* =========================================================
   KARAS — плакаты
   OVERVIEW: 3D-стопка (рефы UNVEIL / every:second)
   INDEX:    картотека-ящик (реф sam's secret files)
   ========================================================= */
(function () {
  const K = window.KARAS;
  const { esc, pad } = K;

  /* ---------------- ЛАЙТБОКС ---------------- */
  let lb, lbList = [], lbIndex = 0;
  function ensureLightbox() {
    if (lb) return lb;
    lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.innerHTML = `
      <button class="lb-close mono" aria-label="Закрыть">Закрыть ✕</button>
      <button class="lb-nav lb-prev" aria-label="Предыдущий">←</button>
      <figure class="lb-fig"><div class="lb-media"></div>
        <figcaption class="lb-cap"><span class="mono lb-num"></span><h2 class="lb-title"></h2><div class="lb-tags"></div><span class="mono muted lb-year"></span></figcaption>
      </figure>
      <button class="lb-nav lb-next" aria-label="Следующий">→</button>`;
    document.body.append(lb);
    lb.querySelector(".lb-close").onclick = closeLB;
    lb.querySelector(".lb-prev").onclick = () => showLB(lbIndex - 1);
    lb.querySelector(".lb-next").onclick = () => showLB(lbIndex + 1);
    lb.addEventListener("click", (e) => { if (e.target === lb) closeLB(); });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLB();
      if (e.key === "ArrowLeft") showLB(lbIndex - 1);
      if (e.key === "ArrowRight") showLB(lbIndex + 1);
    });
    return lb;
  }
  function showLB(i) {
    lbIndex = (i + lbList.length) % lbList.length;
    const p = lbList[lbIndex];
    const media = lb.querySelector(".lb-media");
    media.innerHTML = window.KARAS_MEDIA(p, 300, 400, p.title, true);
    media.classList.toggle("is-img", !!(p.image || p.cover));
    lb.querySelector(".lb-num").textContent = `${pad(lbIndex + 1)} / ${pad(lbList.length)}`;
    lb.querySelector(".lb-title").textContent = p.title;
    lb.querySelector(".lb-year").textContent = [p.series, p.year].filter(Boolean).join(" · ");
    lb.querySelector(".lb-tags").innerHTML = p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("");
  }
  function openLB(list, i) {
    ensureLightbox(); lbList = list; showLB(i);
    lb.classList.add("is-open"); document.body.style.overflow = "hidden";
    lb.querySelector(".lb-close").focus({ preventScroll: true });
  }
  function closeLB() { lb.classList.remove("is-open"); document.body.style.overflow = ""; }

  /* ---------------- 3D-СТОПКА ---------------- */
  function Stack(root, all, opt = {}) {
    const compact = !!opt.compact;
    root.classList.add("stack");
    if (compact) root.classList.add("stack--compact");
    root.innerHTML = `<div class="stack-scene"></div>`;
    const scene = root.querySelector(".stack-scene");
    // ползунок: тянешь — листаешь стопку
    const scrub = document.createElement("div");
    scrub.className = "stack-scrub";
    scrub.innerHTML = `
      <button class="ss-btn" type="button" data-step="-1" aria-label="Предыдущий плакат">←</button>
      <div class="ss-track" role="slider" tabindex="0" aria-label="Листать плакаты" aria-valuemin="1">
        <div class="ss-ticks"></div><div class="ss-fill"></div>
        <div class="ss-thumb"><span class="ss-num mono"></span></div>
      </div>
      <button class="ss-btn" type="button" data-step="1" aria-label="Следующий плакат">→</button>`;
    root.append(scrub);
    const track = scrub.querySelector(".ss-track"), thumb = scrub.querySelector(".ss-thumb"),
      fill = scrub.querySelector(".ss-fill"), ticks = scrub.querySelector(".ss-ticks"), num = scrub.querySelector(".ss-num");
    const els = all.map((p, i) => {
      const el = document.createElement("button");
      el.className = "sp";
      el.type = "button";
      el.setAttribute("aria-label", [p.title, p.year].filter(Boolean).join(", "));
      el.innerHTML = `<span class="sp-media">${window.KARAS_MEDIA(p, 300, 400)}</span>`;
      el._p = p; el._i = i;
      scene.append(el);
      return el;
    });

    let list = els.slice();      // отфильтрованные
    let pos = 0, target = 0, hover = null, raf = 0, touched = false;
    let W = 300, P = {};

    function measure() {
      const r = root.getBoundingClientRect();
      const mobile = r.width < 760;
      if (compact) W = Math.max(150, Math.min(r.width * (mobile ? 0.38 : 0.17), 260));
      else W = Math.max(180, Math.min(r.width * (mobile ? 0.58 : 0.235), 420, (r.height - (mobile ? 420 : 330)) / 1.45)); // по высоте окна: плакат не наезжает на подпись
      P = mobile
        ? { dx: W * 0.15, dy: W * (compact ? 0.13 : 0.09), dz: W * 0.62, ry: -14, bx: -W * 0.12, by: compact ? W * 0.05 : -W * 0.08, far: 9 } // телефон: пологий хвост — не лезет под фильтры и не наезжает на слайдер
        : compact ? { dx: W * 0.46, dy: W * 0.13, dz: W * 0.72, ry: -24, bx: -r.width * 0.3, by: W * 0.05, far: 12 }
          // галерея: хвост стопки пологий, чтобы дальние плакаты не уходили за верхний край; подпись — по центру под стопкой
          : { dx: W * 0.34, dy: W * 0.075, dz: W * 0.72, ry: -24, bx: -r.width * 0.1, by: -W * 0.12, far: 11 };
      root.style.setProperty("--sp-w", W + "px");
      // у каждого плаката свои пропорции: площадь примерно одинаковая
      els.forEach((el) => {
        const ar = el._p.ratio || 0.75;
        const w = W * Math.min(1.45, Math.sqrt(ar / 0.75)), h = w / ar;
        el.style.width = w.toFixed(1) + "px"; el.style.height = h.toFixed(1) + "px";
        el.style.left = (-w / 2).toFixed(1) + "px"; el.style.top = (-h / 2).toFixed(1) + "px";
      });
    }

    function layout() {
      list.forEach((el, k) => {
        const rel = k - pos;
        let x = P.bx + rel * P.dx, y = P.by - rel * P.dy, z = -rel * P.dz, o = 1, s = 1;
        if (rel < 0) { // улетает к зрителю
          x += rel * P.dx * 1.4; y -= rel * P.dy * 1.6; z = -rel * P.dz * 2.1;
          o = Math.max(0, 1 + rel * (compact ? 2.4 : 2)); // уходящий плакат гаснет быстро — не спорит с подписью слева
        } else if (rel > P.far) o = Math.max(0, 1 - (rel - P.far) / 3);
        if (el === hover) { y -= W * 0.03; z += W * 0.3; s = 1.02; }
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${P.ry}deg) scale(${s})`;
        el.style.opacity = o.toFixed(3);
        el.style.setProperty("--d", Math.max(0, Math.min(14, rel)).toFixed(2)); // глубина: для затенения в светлой теме
        el.style.pointerEvents = o < 0.3 ? "none" : "";
        el.classList.toggle("is-dim", !!hover && el !== hover);
      });
      syncScrub();
    }
    function buildTicks() {
      const n = list.length;
      ticks.innerHTML = list.map((el, k) => `<i style="left:${n > 1 ? (k / (n - 1)) * 100 : 0}%"></i>`).join("");
      track.setAttribute("aria-valuemax", n);
    }
    function syncScrub() {
      const n = list.length, f = n > 1 ? pos / (n - 1) : 0;
      thumb.style.left = f * 100 + "%"; fill.style.width = f * 100 + "%";
      const k = Math.round(pos) + 1;
      num.textContent = `${pad(k)} / ${pad(n)}`;
      track.setAttribute("aria-valuenow", k);
    }
    let scrubbing = false;
    const fromX = (x) => { const r = track.getBoundingClientRect(); return Math.max(0, Math.min(1, (x - r.left) / r.width)) * (list.length - 1); };
    track.addEventListener("pointerdown", (e) => {
      e.preventDefault(); e.stopPropagation(); touched = true; scrubbing = true;
      track.setPointerCapture(e.pointerId); scrub.classList.add("is-active");
      target = fromX(e.clientX); kick();
    });
    track.addEventListener("pointermove", (e) => { if (scrubbing) { target = fromX(e.clientX); kick(); } });
    const stopScrub = () => { if (!scrubbing) return; scrubbing = false; scrub.classList.remove("is-active"); go(Math.round(target)); };
    track.addEventListener("pointerup", stopScrub); track.addEventListener("pointercancel", stopScrub);
    track.addEventListener("keydown", (e) => {
      const d = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
      if (d) { e.preventDefault(); e.stopPropagation(); touched = true; go(Math.round(target) + d); }
      if (e.key === "Home") { e.preventDefault(); go(0); }
      if (e.key === "End") { e.preventDefault(); go(list.length - 1); }
    });
    scrub.querySelectorAll(".ss-btn").forEach((b) => b.addEventListener("click", (e) => { e.stopPropagation(); touched = true; go(Math.round(target) + +b.dataset.step); }));
    scrub.addEventListener("click", (e) => e.stopPropagation());

    function frame() {
      pos += (target - pos) * 0.11;
      if (Math.abs(target - pos) < 0.001) pos = target;
      layout();
      raf = pos !== target ? requestAnimationFrame(frame) : 0;
      emit();
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const clamp = (v) => Math.max(0, Math.min(list.length - 1, v));
    function go(v) { target = clamp(v); kick(); }

    let lastEmit = null;
    function emit() {
      const el = hover || list[Math.round(pos)];
      if (!el || el === lastEmit) return;
      lastEmit = el;
      opt.onFocus && opt.onFocus(el._p, list.indexOf(el), list.length);
    }

    /* фильтр */
    function filter(tag) {
      list = els.filter((el) => !tag || el._p.vibe === tag || el._p.tags.includes(tag));
      els.forEach((el) => {
        const on = list.includes(el);
        el.classList.toggle("is-out", !on);
        if (!on) { el.style.opacity = 0; el.style.pointerEvents = "none"; }
      });
      pos = Math.min(pos, list.length - 1) + 1.5; target = 0; hover = null; lastEmit = null;
      buildTicks();
      kick();
    }

    /* управление */
    if (!compact) {
      root.addEventListener("wheel", (e) => {
        const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
        const atEnd = (d > 0 && target >= list.length - 1) || (d < 0 && target <= 0);
        if (atEnd) return; // отпускаем скролл страницы на краях
        e.preventDefault();
        go(target + d * 0.0042);
      }, { passive: false });
      root.tabIndex = 0;
      root.addEventListener("keydown", (e) => {
        if (["ArrowDown", "ArrowRight"].includes(e.key)) { e.preventDefault(); go(Math.round(target) + 1); }
        if (["ArrowUp", "ArrowLeft"].includes(e.key)) { e.preventDefault(); go(Math.round(target) - 1); }
      });
    }
    // свайп / перетаскивание
    let drag = null;
    root.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".stack-scrub")) return;
      touched = true;
      drag = { x: e.clientX, y: e.clientY, t: target, moved: false };
    });
    window.addEventListener("pointermove", (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.hypot(dx, dy) > 6) drag.moved = true;
      const d = Math.abs(dy) > Math.abs(dx) ? -dy : -dx;
      if (drag.moved) go(drag.t + d / (W * 0.42));
    });
    window.addEventListener("pointerup", () => { if (drag) { if (drag.moved) { root._justDragged = true; setTimeout(() => (root._justDragged = false), 60); go(Math.round(target)); } drag = null; } });

    scene.addEventListener("pointerover", (e) => {
      const el = e.target.closest(".sp"); if (!el || e.pointerType !== "mouse") return;
      hover = el; lastEmit = null; kick(); layout(); emit();
    });
    scene.addEventListener("pointerout", (e) => {
      const el = e.target.closest(".sp"); if (!el || el.contains(e.relatedTarget)) return;
      hover = null; lastEmit = null; layout(); emit();
    });
    // карточка, на которой нажали (при наведении карточки двигаются, и click может «промахнуться»)
    let downEl = null;
    scene.addEventListener("pointerdown", (e) => { downEl = e.target.closest(".sp"); });
    scene.addEventListener("click", (e) => {
      const el = e.target.closest(".sp") || downEl; downEl = null;
      if (!el || root._justDragged) return;
      const k = list.indexOf(el);
      // на тач-устройствах первый тап — вывести вперёд, второй — открыть
      if (!hover && Math.round(target) !== k) { go(k); return; }
      openLB(list.map((x) => x._p), k);
    });

    buildTicks(); measure(); layout(); emit();
    window.addEventListener("resize", () => { measure(); layout(); });

    if (compact && !K.reduce) { // лёгкий дрейф, пока никто не трогает
      let t0 = performance.now();
      const drift = (t) => {
        if (!touched && !root.matches(":hover") && !drag) { target = ((Math.sin((t - t0) / 5200) + 1) / 2) * (list.length - 1) * 0.6; kick(); }
        requestAnimationFrame(drift);
      };
      requestAnimationFrame(drift);
    }
    return { filter, go, get list() { return list; } };
  }

  /* ---------------- КАРТОТЕКА ---------------- */
  const tabPath = `<svg class="cab-tab-bg" viewBox="0 0 220 32" preserveAspectRatio="none" aria-hidden="true"><path d="M0 32 C8 32 9 30 11 24 L16 7 C18 1 20 0 28 0 H192 C200 0 202 1 204 7 L209 24 C211 30 212 32 220 32" vector-effect="non-scaling-stroke"/></svg>`;

  function Cabinet(root, all) {
    root.classList.add("cabinet");
    // разделители — по сериям (если серии нет — по году)
    const groupOf = (p) => String(p.series || p.year || "Разное");
    const groups = [...new Set(all.map(groupOf))];
    const rows = [];
    let n = 0;
    groups.forEach((g, gi) => {
      const items = all.filter((p) => groupOf(p) === g);
      rows.push({ divider: true, group: g, count: items.length, slot: gi % 3 });
      items.forEach((p) => rows.push({ p, num: ++n, slot: n % 3 }));
    });
    const total = rows.length;
    root.innerHTML = `
      <div class="cab-drawer">
        <div class="cab-cards">
          ${rows.map((r, i) => {
            const inset = ((total - 1 - i) / (total - 1)) * 100; // задние карточки уже
            if (r.divider)
              return `<div class="cab-row cab-row--div" data-group="${esc(r.group)}" style="--inset:${inset.toFixed(2)};--slot:${r.slot};--slot2:${r.slot % 2};--i:${i}">
                <div class="cab-tab">${tabPath}<span class="cab-t cab-g">${esc(r.group)}</span><span class="cab-n">${pad(r.count, 3)}</span></div>
                <div class="cab-body"></div></div>`;
            return `<div class="cab-row" data-idx="${all.indexOf(r.p)}" data-group="${esc(groupOf(r.p))}" style="--inset:${inset.toFixed(2)};--slot:${r.slot};--slot2:${r.slot % 2};--i:${i}">
                <button class="cab-tab" type="button">${tabPath}<span class="cab-n">${pad(r.num)}</span><span class="cab-t">${esc(r.p.title)}</span></button>
                <div class="cab-body"></div></div>`;
          }).join("")}
        </div>
        <div class="cab-front"><span class="cab-label">архив karas · ${pad(all.length, 3)}</span></div>
      </div>
      <div class="cab-preview" aria-hidden="true"></div>`;

    const prev = root.querySelector(".cab-preview");
    let shown = all;
    root.addEventListener("pointermove", (e) => {
      const row = e.target.closest(".cab-row:not(.cab-row--div)");
      if (!row || e.pointerType !== "mouse") { prev.classList.remove("is-on"); return; }
      const p = all[+row.dataset.idx];
      if (prev._id !== p.id) { prev.innerHTML = window.KARAS_MEDIA(p, 300, 400); prev._id = p.id; prev.style.aspectRatio = String(p.ratio || 0.75); }
      prev.style.transform = `translate(${e.clientX + 24}px, ${e.clientY - 120}px) rotate(3deg)`;
      prev.classList.add("is-on");
    });
    root.addEventListener("pointerleave", () => prev.classList.remove("is-on"));
    root.addEventListener("click", (e) => {
      const row = e.target.closest(".cab-row:not(.cab-row--div)"); if (!row) return;
      const p = all[+row.dataset.idx];
      openLB(shown, shown.indexOf(p));
    });

    function filter(tag) {
      shown = all.filter((p) => !tag || p.vibe === tag || p.tags.includes(tag));
      root.querySelectorAll(".cab-row").forEach((row) => {
        if (row.classList.contains("cab-row--div")) {
          const cnt = shown.filter((p) => groupOf(p) === row.dataset.group).length;
          row.hidden = !cnt;
          row.querySelector(".cab-n").textContent = pad(cnt, 3);
        } else row.hidden = !shown.includes(all[+row.dataset.idx]);
      });
      root.querySelector(".cab-label").textContent = `архив karas · ${pad(shown.length, 3)}`;
    }
    return { filter };
  }

  window.KARAS_POSTERS = { Stack, Cabinet, openLB };
})();
