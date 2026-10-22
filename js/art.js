/*
  Фирменные заглушки KARAS.
  Пока нет настоящих картинок, сайт рисует плакаты и обложки сам —
  из знака, плашки, звезды и прямоугольных блоков. Когда у работы появится
  cover/image, вместо заглушки покажется файл.
*/
(function () {
  const C = { B: "#000", L: "#BEFF1D", S: "#BBC4D0", W: "#fff", G: "#363636", D: "#141414" };
  let uidN = 0;

  function rng(seed) {
    let a = (seed * 9301 + 49297) >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* Символы бренда кладём в документ один раз */
  function ensureSprite() {
    if (document.getElementById("k-sprite") || !window.KARAS_BRAND) return;
    const b = window.KARAS_BRAND;
    const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("id", "k-sprite");
    s.setAttribute("aria-hidden", "true");
    s.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
    s.innerHTML =
      `<symbol id="k-logo" viewBox="0 0 1188 216"><rect width="360" height="216" fill="#000"/><rect x="360" width="828" height="216" fill="#BEFF1D"/><path d="${b.eye}" fill="#BEFF1D"/><path d="${b.word}" fill="#000"/></symbol>` +
      `<symbol id="k-eye" viewBox="37 41 287 134"><path d="${b.eye}" fill="currentColor"/></symbol>` +
      `<symbol id="k-almond" viewBox="37 41 287 134"><path d="${b.almond}" fill="currentColor"/></symbol>` +
      `<symbol id="k-star" viewBox="136 11 150 194"><path d="${b.star}" fill="currentColor"/></symbol>` +
      `<symbol id="k-spark" viewBox="0 0 100 100"><path d="M47 2 L56 36 L97 22 L63 52 L99 97 L52 64 L33 98 L37 58 L2 47 L39 38 Z" fill="currentColor" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></symbol>` +
      `<symbol id="k-word" viewBox="396 34 756 148"><path d="${b.word}" fill="currentColor"/></symbol>`;
    document.body.prepend(s);
  }

  const use = (id, x, y, w, h, color, extra = "") =>
    `<use href="#${id}" x="${x}" y="${y}" width="${w}" height="${h}" ${color ? `style="color:${color}"` : ""} ${extra}/>`;
  const rect = (x, y, w, h, f, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" ${extra}/>`;
  const text = (x, y, s, size, f, opts = {}) =>
    `<text x="${x}" y="${y}" font-family="${opts.mono ? "JetBrains Mono, monospace" : opts.body ? "Inter, sans-serif" : "Rubik, sans-serif"}" font-weight="${opts.w || 700}" font-size="${size}" fill="${f}" ${opts.anchor ? `text-anchor="${opts.anchor}"` : ""} ${opts.t ? `transform="${opts.t}"` : ""} letter-spacing="${opts.ls || 0}">${s}</text>`;
  const plate = (x, y, h) => use("k-logo", x, y, h * 5.5, h);
  const starAt = (cx, cy, size, rot, color) =>
    `<g transform="translate(${cx} ${cy}) rotate(${rot})">${use("k-spark", -size / 2, -size / 2, size, size, color)}</g>`;
  const pick = (r, arr) => arr[Math.floor(r() * arr.length)];

  function halftone(id, w, h, r, dark) {
    // имитация фото: градиент + растровые точки
    const g1 = pick(r, ["#d9d9d9", "#9a9a9a", "#c4c9d1", "#7d7d7d"]);
    const g2 = dark ? "#0b0b0b" : "#2a2a2a";
    const fx = (0.2 + r() * 0.6).toFixed(2), fy = (0.15 + r() * 0.5).toFixed(2);
    return (
      `<defs><radialGradient id="${id}g" cx="${fx}" cy="${fy}" r="0.9"><stop offset="0" stop-color="${g1}"/><stop offset="0.55" stop-color="#555"/><stop offset="1" stop-color="${g2}"/></radialGradient>` +
      `<pattern id="${id}p" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="1.25" fill="#000" opacity=".55"/></pattern></defs>` +
      rect(0, 0, w, h, `url(#${id}g)`) + rect(0, 0, w, h, `url(#${id}p)`)
    );
  }

  function blobPath(r, cx, cy, rad) {
    const n = 7, pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, k = 0.55 + r() * 0.7;
      pts.push([cx + Math.cos(a) * rad * k, cy + Math.sin(a) * rad * k * 1.25]);
    }
    let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < n; i++) {
      const p0 = pts[i], p1 = pts[(i + 1) % n];
      const mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2;
      d += `Q${p0[0].toFixed(1)},${p0[1].toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)}`;
    }
    return `<path d="${d}Z" fill="${C.L}"/>`;
  }

  const ART = {
    eye(r, w, h, id) {
      const ew = w * 1.05, eh = ew * 134 / 287, ey = h * 0.42 - eh / 2;
      return rect(0, 0, w, h, C.B) +
        rect(0, h * 0.2, w, h * 0.45, C.S) +
        `<clipPath id="${id}c">${use("k-almond", (w - ew) / 2, ey, ew, eh)}</clipPath>` +
        use("k-almond", (w - ew) / 2, ey, ew, eh, C.L) +
        `<g clip-path="url(#${id}c)"><circle cx="${w / 2}" cy="${h * 0.42}" r="${eh * 0.42}" fill="#000"/></g>` +
        starAt(w * (0.45 + r() * 0.1), h * 0.44, h * 0.5, -15 + r() * 30, C.W) +
        rect(0, h * 0.78, w, h * 0.22, C.B) +
        text(w * 0.08, h * 0.86, "BRAND", h * 0.045, C.W) +
        text(w * 0.62, h * 0.86, String(2024 + Math.floor(r() * 3)), h * 0.045, C.W) +
        text(w * 0.14, h * 0.94, "IDENTITY", h * 0.045, C.W) +
        rect(w * 0.7, h * 0.88, w * 0.3, h * 0.12, C.S) +
        plate(w * 0.06, h * 0.05, h * 0.07);
    },
    star(r, w, h) {
      const rot = -30 + r() * 60;
      return rect(0, 0, w, h, C.S) +
        rect(w * 0.1, h * 0.12, w * 0.12, h * 0.6, C.B) +
        rect(w * 0.82, h * 0.05, w * 0.12, h * 0.6, C.B) +
        starAt(w * 0.52, h * 0.42, h * 0.62, rot, C.B) +
        rect(w * (0.55 + r() * 0.1), h * 0.12, w * 0.12, h * 0.05, C.W, `transform="rotate(${-40 + r() * 20} ${w * 0.6} ${h * 0.14})"`) +
        rect(w * 0.6, h * 0.62, w * 0.1, h * 0.05, C.W, `transform="rotate(${-30} ${w * 0.65} ${h * 0.64})"`) +
        text(0, 0, "творчество начинается", h * 0.032, C.W, { t: `translate(${w * 0.18} ${h * 0.7}) rotate(-90)` }) +
        text(0, 0, "там, где заканчивается лень", h * 0.032, C.W, { t: `translate(${w * 0.86} ${h * 0.08}) rotate(90)` }) +
        rect(w * 0.06, h * 0.82, w * 0.88, h * 0.13, C.B) +
        plate(w * 0.1, h * 0.845, h * 0.08);
    },
    smotri(r, w, h) {
      let s = rect(0, 0, w, h, C.B);
      for (let i = 0; i < 4; i++) {
        s += rect(w * r() * 0.6, h * (0.12 + r() * 0.6), w * (0.3 + r() * 0.5), h * (0.06 + r() * 0.12), i % 2 ? C.S : C.G);
      }
      s += plate(w * 0.06, h * 0.05, h * 0.07);
      s += text(w * 0.08, h * 0.24, "Чтобы", h * 0.03, C.W) + text(w * 0.36, h * 0.2, "выйти за рамки своего", h * 0.026, C.W) + text(w * 0.62, h * 0.27, "восприятия", h * 0.026, C.W);
      for (let i = 0; i < 16; i++) {
        s += text(w * (0.05 + r() * 0.75), h * (0.35 + r() * 0.6), "смотри", h * 0.028, C.W, { t: r() > 0.85 ? `rotate(${-6 + r() * 12} ${w / 2} ${h / 2})` : "" });
      }
      s += starAt(w * (0.3 + r() * 0.4), h * 0.55, h * 0.26, r() * 40, C.W);
      return s;
    },
    stickers(r, w, h) {
      let s = rect(0, 0, w, h, C.S) + plate(w * 0.06, h * 0.05, h * 0.075);
      s += text(w * 0.06, h * 0.22, "Здесь", h * 0.06, C.B, { w: 500, body: true }) + text(w * 0.06, h * 0.29, "говорят", h * 0.06, C.B, { w: 500, body: true }) + text(w * 0.06, h * 0.36, "про", h * 0.06, C.B, { w: 500, body: true });
      for (let i = 0; i < 22; i++) {
        const x = w * (-0.05 + r() * 0.85), y = h * (0.42 + r() * 0.55), rot = -50 + r() * 100;
        s += `<g transform="rotate(${rot.toFixed(1)} ${x} ${y})">${rect(x, y, w * 0.34, h * 0.06, C.L)}${text(x + w * 0.1, y + h * 0.045, "дизайн", h * 0.04, C.B, { w: 500, body: true })}</g>`;
        if (i % 3 === 0) s += starAt(x + w * 0.05, y + h * 0.03, h * 0.07, rot, C.B);
      }
      return s;
    },
    blob(r, w, h) {
      return rect(0, 0, w, h, C.B) +
        rect(w * 0.04, h * 0.15, w * 0.9, h * 0.13, C.S) + rect(w * 0.6, h * 0.38, w * 0.4, h * 0.25, C.S) +
        rect(w * 0.04, h * 0.66, w * 0.25, h * 0.03, C.S) + rect(w * 0.7, h * 0.72, w * 0.26, h * 0.18, C.S) +
        blobPath(r, w * 0.5, h * 0.55, w * 0.32) +
        starAt(w * (0.55 + r() * 0.2), h * 0.45, h * 0.2, r() * 90, C.W) + starAt(w * 0.3, h * 0.78, h * 0.14, r() * 90, C.W) +
        text(w * 0.06, h * 0.23, "В дизайне —", h * 0.035, C.B, { body: true, w: 600 }) +
        text(w * 0.06, h * 0.6, "как рыба", h * 0.035, C.W, { body: true, w: 600 }) +
        text(w * 0.74, h * 0.84, "в воде", h * 0.035, C.B, { body: true, w: 600 }) +
        plate(w * 0.06, h * 0.04, h * 0.075);
    },
    photo(r, w, h, id) {
      let s = halftone(id, w, h, r, false);
      for (let i = 0; i < 6; i++) s += rect(w * r(), h * r(), w * (0.08 + r() * 0.25), h * (0.03 + r() * 0.12), C.B);
      s += rect(0, h * 0.82, w, h * 0.18, C.B);
      s += text(w * 0.62, h * 0.88, "20", h * 0.06, C.L) + text(w * 0.62, h * 0.94, "26", h * 0.06, C.L);
      s += text(w * 0.82, h * 0.94, "скоро", h * 0.03, C.L, { body: true, w: 600 });
      s += rect(w * 0.04, h * 0.05, h * 0.07 * 5.5 + 4, h * 0.07 + 4, C.B) + plate(w * 0.04 + 2, h * 0.05 + 2, h * 0.07);
      s += rect(w * 0.7, h * 0.18, w * 0.28, h * 0.12, C.B) + text(w * 0.72, h * 0.22, "в ролях:", h * 0.022, C.W, { body: true, w: 500 }) + text(w * 0.72, h * 0.26, "заяц, король", h * 0.022, C.W, { body: true, w: 500 });
      return s;
    },
    beam(r, w, h, id) {
      const by = h * (0.35 + r() * 0.2);
      return rect(0, 0, w, h, C.B) +
        `<g opacity=".9">${halftone(id, w, h, r, true).replace(`width="${w}" height="${h}"`, `width="${w}" height="${h}"`)}</g>` +
        rect(0, 0, w, h * 0.22, C.B) +
        `<defs><linearGradient id="${id}b" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".4" stop-color="${C.L}" stop-opacity=".8"/><stop offset="1" stop-color="${C.L}" stop-opacity="0"/></linearGradient></defs>` +
        `<polygon points="${w * 0.35},${by} ${w * 1.1},${by - h * 0.12} ${w * 1.1},${by + h * 0.1}" fill="url(#${id}b)"/>` +
        rect(w * 0.3, by - 4, 10, h - by, C.W, 'opacity=".85"') +
        plate(w * 0.06, h * 0.06, h * 0.07) +
        text(w * 0.06, h * 0.9, "смотри", h * 0.026, C.W) + text(w * 0.4, h * 0.94, "смотри", h * 0.026, C.W) + text(w * 0.7, h * 0.88, "смотри", h * 0.026, C.W);
    },
    plate(r, w, h) {
      let s = rect(0, 0, w, h, C.L);
      for (let i = 0; i < 9; i++) s += text(w * 0.06, h * (0.08 + i * 0.035), "KARAS — KARAS — KARAS — KARAS", h * 0.018, C.B, { mono: true, w: 500 });
      s += rect(w * 0.06, h * 0.45, w * 0.88, w * 0.88 * 216 / 1188 + 0.001, C.B);
      s += use("k-logo", w * 0.06, h * 0.45, w * 0.88, w * 0.88 * 216 / 1188);
      s += starAt(w * 0.7, h * 0.72, h * 0.3, 15 + r() * 40, C.B);
      s += text(w * 0.06, h * 0.93, "visual system", h * 0.03, C.B, { body: true, w: 600 });
      return s;
    },
  };

  /* Главная функция: вернуть разметку SVG-заглушки */
  window.KARAS_ART = function (art, seed, w = 300, h = 400) {
    ensureSprite();
    const id = "ka" + (++uidN);
    const r = rng(seed || 1);
    const fn = ART[art] || ART.plate;
    return `<svg class="k-art" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${fn(r, w, h, id)}</svg>`;
  };

  /* Обложка: если есть файл — картинка, иначе заглушка */
  window.KARAS_MEDIA = function (item, w = 300, h = 400, alt = "", full = false) {
    const src = full ? item.image || item.cover : item.cover || item.image;
    if (src) return `<img src="${src}" alt="${(alt || item.title || "").replace(/"/g, "&quot;")}" loading="lazy" decoding="async">`;
    return window.KARAS_ART(item.art, item.seed, w, h);
  };
  window.KARAS_ENSURE_SPRITE = ensureSprite;
})();
