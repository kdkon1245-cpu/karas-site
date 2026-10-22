/* Стол на первом экране: предметы с физикой.
   - Любой предмет тащится «за точку»: если взять за край, он разворачивается и тянется следом,
     как лист бумаги на столе. Если отпустить на ходу, он скользит по инерции и замедляется трением.
   - Брелоки собраны из частей на шарнирах (кольцо → карабин → узел → подвески…):
     части отстают, раскачиваются и возвращаются на место.
   Раскладка и маски прозрачности — js/table-data.js (генерируется из Figma),
   разметка частей брелоков — JOINTS ниже (координаты в пикселях макета внутри картинки). */
(function () {
  const T = window.KARAS_TABLE;

  // Части брелоков. poly — область картинки, которая принадлежит части; pivot — шарнир на родителе;
  // lim — насколько часть может провернуться на шарнире (градусы): цепочки свободные, шнурки почти жёсткие.
  const JOINTS = {
    keyring: { // 472×320: кольцо, открывашка, микрофон, подвеска «Резонанс»
      root: [[130, 0], [240, 0], [240, 58], [222, 70], [214, 76], [208, 84], [210, 102], [202, 111], [192, 111], [192, 99], [178, 99], [178, 111], [130, 111]],
      parts: [
        { id: "opener", parent: "root", pivot: [184, 100], lim: 50,
          poly: [[80, 111], [178, 111], [178, 99], [192, 99], [192, 111], [202, 111], [211, 116], [214, 125], [223, 140], [227, 152], [232, 165], [238, 180], [244, 200], [250, 320], [80, 320]] },
        { id: "mic", parent: "root", pivot: [212, 80], lim: 65,
          poly: [[208, 84], [214, 76], [222, 70], [240, 58], [250, 40], [420, 40], [420, 140], [372, 150], [252, 119], [226, 98], [214, 92]] },
        { id: "charm", parent: "root", pivot: [210, 90], lim: 65,
          poly: [[210, 102], [208, 84], [214, 92], [226, 98], [252, 119], [372, 150], [420, 140], [472, 140], [472, 320], [250, 320], [244, 200], [238, 180], [232, 165], [227, 152], [223, 140], [214, 125], [211, 116], [202, 111]] },
      ],
    },
    clover: { // 508×658: кольцо, карабин, узел, звёздочки, клевер, два шнурка
      root: [[190, 0], [380, 0], [380, 147], [190, 147]],
      parts: [
        { id: "clasp", parent: "root", pivot: [289, 142], lim: 70,
          poly: [[190, 147], [380, 147], [380, 209], [190, 209]] },
        { id: "knot", parent: "clasp", pivot: [284, 211], lim: 35,
          poly: [[60, 209], [460, 209], [460, 398], [322, 398], [322, 458], [255, 458], [255, 450], [179, 450], [179, 352], [60, 352]] },
        { id: "stars", parent: "knot", pivot: [173, 350], lim: 60,
          poly: [[40, 352], [179, 352], [179, 450], [150, 450], [150, 560], [40, 560]] },
        { id: "clover", parent: "knot", pivot: [343, 399], lim: 60,
          poly: [[322, 398], [460, 398], [460, 560], [322, 560]] },
        { id: "cordL", parent: "knot", pivot: [236, 448], lim: 9,
          poly: [[179, 450], [240, 450], [228, 658], [150, 658], [150, 450]] },
        { id: "cordR", parent: "knot", pivot: [247, 448], lim: 9,
          poly: [[240, 450], [255, 450], [255, 458], [322, 458], [322, 658], [228, 658]] },
      ],
    },
  };
  // насколько охотно предмет разворачивается, когда тянут за край (бумага — легко, камень — тяжело)
  const TURN = { tray: 0.3, "zip-rezonans": 0.45, poster: 0.5, notebook: 0.55, card: 0.6 };

  const rot = (x, y, a) => { const c = Math.cos(a), s = Math.sin(a); return [x * c - y * s, x * s + y * c]; };
  const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
  const inPoly = (x, y, P) => {
    let o = false;
    for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
      const [xi, yi] = P[i], [xj, yj] = P[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) o = !o;
    }
    return o;
  };
  const pct = (P, w, h) => "polygon(" + P.map(([x, y]) => `${((x / w) * 100).toFixed(3)}% ${((y / h) * 100).toFixed(3)}%`).join(",") + ")";

  window.KARAS_TABLE_INIT = function (hero, stage, opts = {}) {
    const reduce = !!opts.reduce;
    const objs = T.items.map((it, i) => {
      const bin = atob(it.mask), bits = new Uint8Array(bin.length);
      for (let k = 0; k < bin.length; k++) bits[k] = bin.charCodeAt(k);
      const o = { it, bits, z: i + 1, tx: 0, ty: 0, th: 0, vx: 0, vy: 0, w: 0, lift: 0, live: false,
        c0: [it.w / 2, it.h / 2], turn: TURN[it.id] ?? 0.65 };
      o.solid = (x, y) => { // непрозрачен ли пиксель картинки (координаты макета внутри предмета)
        const ci = Math.floor((x / it.w) * it.mw), cj = Math.floor((y / it.h) * it.mh);
        if (ci < 0 || cj < 0 || ci >= it.mw || cj >= it.mh) return false;
        const k = cj * it.mw + ci; return !!(bits[k >> 3] & (1 << (k & 7)));
      };
      const el = document.createElement("figure");
      el.className = "t-obj";
      el.style.cssText = `left:${(it.x / T.w) * 100}%;top:${(it.y / T.h) * 100}%;width:${(it.w / T.w) * 100}%;height:${(it.h / T.h) * 100}%;z-index:${o.z}`;
      const J = JOINTS[it.id];
      if (!J || !it.parts) el.innerHTML = `<img src="${it.src}" alt="" decoding="async" draggable="false">`;
      else {
        // брелок: каждая часть — своя картинка, вырезанная по контуру; дочерние части вложены в шарниры
        el.classList.add("t-rig");
        const pimg = (d) => `<img class="t-pimg" src="${d.src}" alt="" decoding="async" draggable="false" style="left:${(d.x / it.w) * 100}%;top:${(d.y / it.h) * 100}%;width:${(d.w / it.w) * 100}%;height:${(d.h / it.h) * 100}%">`;
        const prep = (d) => { // маска части + центр масс и «вес» по непрозрачным клеткам
          const b = atob(d.mask), mb = new Uint8Array(b.length); for (let k = 0; k < b.length; k++) mb[k] = b.charCodeAt(k);
          let sx = 0, sy = 0, n = 0;
          for (let j = 0; j < d.mh; j++) for (let i = 0; i < d.mw; i++) { const k = j * d.mw + i; if (mb[k >> 3] & (1 << (k & 7))) { sx += d.x + ((i + 0.5) / d.mw) * d.w; sy += d.y + ((j + 0.5) / d.mh) * d.h; n++; } }
          return { box: d, mb, cm: n ? [sx / n, sy / n] : [d.x + d.w / 2, d.y + d.h / 2], m: Math.max(1, n) };
        };
        const D = Object.fromEntries(it.parts.map((d) => [d.id, d]));
        o.parts = [{ id: "root", ...prep(D.root), phi: 0, kids: [] }];
        el.insertAdjacentHTML("beforeend", pimg(D.root));
        const node = { root: el };
        for (const p of J.parts) {
          const joint = document.createElement("div");
          joint.className = "t-joint";
          joint.style.transformOrigin = `${(p.pivot[0] / it.w) * 100}% ${(p.pivot[1] / it.h) * 100}%`;
          joint.innerHTML = pimg(D[p.id]);
          node[p.parent].appendChild(joint); node[p.id] = joint;
          const par = o.parts.find((q) => q.id === p.parent);
          const part = { ...p, ...prep(D[p.id]), el: joint, phi: 0, par, kids: [] };
          par.kids.push(part); o.parts.push(part);
        }
      }
      stage.appendChild(el);
      o.el = el;
      return o;
    });

    /* ---------- геометрия ---------- */
    let S = 1, SR = null; // масштаб сцены (px на пиксель макета) и её прямоугольник
    const measure = () => { SR = stage.getBoundingClientRect(); S = SR.width / T.w; };
    measure(); addEventListener("resize", () => { measure(); objs.forEach(render); });
    const toFrame = (cx, cy) => [(cx - SR.left) / S, (cy - SR.top) / S];
    const view = () => { const hr = hero.getBoundingClientRect(); const [x0, y0] = toFrame(hr.left, hr.top), [x1, y1] = toFrame(hr.right, hr.bottom); return [x0, y0, x1, y1]; };
    // локальная точка корня (пиксели макета внутри картинки) → мир (пиксели макета на столе)
    const L2W = (o, x, y) => { const [rx, ry] = rot(x - o.c0[0], y - o.c0[1], o.th); return [o.it.x + o.c0[0] + o.tx + rx, o.it.y + o.c0[1] + o.ty + ry]; };
    const W2L = (o, X, Y) => { const [rx, ry] = rot(X - o.it.x - o.c0[0] - o.tx, Y - o.it.y - o.c0[1] - o.ty, -o.th); return [rx + o.c0[0], ry + o.c0[1]]; };
    // точка части (в координатах картинки до поворотов) → мир, с учётом всех шарниров выше
    const partW = (o, part, x, y) => {
      for (let p = part; p && p.id !== "root"; p = p.par) { const [rx, ry] = rot(x - p.pivot[0], y - p.pivot[1], p.phi); x = p.pivot[0] + rx; y = p.pivot[1] + ry; }
      return L2W(o, x, y);
    };
    const chain = (part) => { const c = []; for (let p = part; p && p.id !== "root"; p = p.par) c.unshift(p); return c; };

    /* ---------- брелоки: твёрдые части на шарнирах (частицы + связи) ----------
       Каждая часть — жёсткая группа частиц: её центр масс и шарниры, которые на ней висят.
       Пружин нет: на столе части не болтаются, а волочатся следом из-за трения и остаются как легли.
       Шарнир ограничен по углу, поэтому брелок не выворачивается. */
    function buildRig(o) {
      const P = [], C = [];
      const add = (x, y) => { const [X, Y] = partW(o, null, x, y); P.push({ x: X, y: Y, px: X, py: Y, m: 0 }); return P.length - 1; };
      for (const part of o.parts) { part.ids = []; part.ic = add(part.cm[0], part.cm[1]); part.ids.push(part.ic); }
      for (const part of o.parts) if (part.par) { part.ip = add(part.pivot[0], part.pivot[1]); part.ids.push(part.ip); part.par.ids.push(part.ip); }
      for (const part of o.parts) { // «крыло»: точка сбоку от оси части
        const ax = part.par ? part.pivot : part.kids[0].pivot, dx = part.cm[0] - ax[0], dy = part.cm[1] - ax[1], L = Math.hypot(dx, dy) || 1;
        const r = Math.max(14, Math.min(part.box.w, part.box.h) * 0.35);
        part.iw = add(part.cm[0] - (dy / L) * r, part.cm[1] + (dx / L) * r); part.ids.push(part.iw);
      }
      for (const part of o.parts) {
        for (const id of part.ids) P[id].m += part.m / part.ids.length;
        for (let i = 0; i < part.ids.length; i++) for (let j = i + 1; j < part.ids.length; j++) {
          const a = P[part.ids[i]], b = P[part.ids[j]]; C.push({ a: part.ids[i], b: part.ids[j], d: Math.hypot(a.x - b.x, a.y - b.y) });
        }
      }
      P.forEach((q) => (q.w = 1 / Math.max(1, q.m)));
      // как часть направлена в покое: вектор шарнир → центр масс (у корня — центр масс → первый шарнир)
      const root = o.parts[0];
      root.ref = root.kids[0].ip; root.a0 = Math.atan2(P[root.ref].y - P[root.ic].y, P[root.ref].x - P[root.ic].x);
      for (const part of o.parts) if (part.par) part.a0 = Math.atan2(P[part.ic].y - P[part.ip].y, P[part.ic].x - P[part.ip].x);
      // для каждого шарнира: частицы «ниже» (сама часть и всё, что на ней висит) и «выше» — с их массами
      const subOf = (part) => { const ids = new Set(part.ids); for (const k of part.kids) subOf(k).forEach((i) => ids.add(i)); return ids; };
      for (const part of o.parts) if (part.par) {
        const sub = subOf(part); sub.delete(part.ip);
        part.sub = [...sub]; part.rest = P.map((_, i) => i).filter((i) => i !== part.ip && !sub.has(i));
        part.Ms = part.sub.reduce((a, i) => a + P[i].m, 0); part.Mr = part.rest.reduce((a, i) => a + P[i].m, 0);
        const below = new Set(); (function walk(q) { below.add(q); q.kids.forEach(walk); })(part); part.below = below;
      }
      o.rig = { P, C, G: null };
    }
    // повернуть группу частиц вокруг шарнира; prev — вместе с прошлыми позициями (не добавляя скорости)
    const turnAbout = (o, ids, pv, ang, prev) => {
      const P = o.rig.P;
      for (const id of ids) {
        const q = P[id];
        let [rx, ry] = rot(q.x - pv.x, q.y - pv.y, ang); q.x = pv.x + rx; q.y = pv.y + ry;
        if (prev) { [rx, ry] = rot(q.px - pv.px, q.py - pv.py, ang); q.px = pv.px + rx; q.py = pv.py + ry; }
      }
    };
    const partAngle = (o, part) => {
      const P = o.rig.P;
      if (!part.par) return Math.atan2(P[part.ref].y - P[part.ic].y, P[part.ref].x - P[part.ic].x) - part.a0;
      return Math.atan2(P[part.ic].y - P[part.ip].y, P[part.ic].x - P[part.ip].x) - part.a0;
    };
    function solve(o) {
      const { P, C, G } = o.rig;
      const all = G ? C.concat(G.C) : C;
      for (let it = 0; it < 14; it++) {
        for (const c of all) {
          const a = c.a === -1 ? G : P[c.a], b = P[c.b];
          const wa = c.a === -1 ? 0 : a.w, wb = b.w, ws = wa + wb; if (!ws) continue;
          const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1e-6, k = (d - c.d) / d / ws;
          a.x += dx * k * wa; a.y += dy * k * wa; b.x -= dx * k * wb; b.y -= dy * k * wb;
        }
        // упоры шарниров: поворачиваем часть и родителя навстречу друг другу вокруг шарнира
        for (const part of o.parts) {
          if (!part.par) continue;
          const d = wrap(partAngle(o, part) - partAngle(o, part.par)), lim = (part.lim * Math.PI) / 180;
          if (Math.abs(d) <= lim) continue;
          const ex = d - Math.sign(d) * lim, pv = P[part.ip], gp = o.rig.G && o.rig.G.part;
          const sh = gp ? (part.below.has(gp) ? 0 : 1) : part.Mr / (part.Ms + part.Mr);
          if (sh) turnAbout(o, part.sub, pv, -ex * sh, true);
          if (sh < 1) turnAbout(o, part.rest, pv, ex * (1 - sh), true);
        }
      }
    }
    // поза из частиц → углы для отрисовки и попадания
    function pose(o) {
      const P = o.rig.P, root = o.parts[0];
      o.th = partAngle(o, root);
      const [rx, ry] = rot(root.cm[0] - o.c0[0], root.cm[1] - o.c0[1], o.th);
      o.tx = P[root.ic].x - o.it.x - o.c0[0] - rx; o.ty = P[root.ic].y - o.it.y - o.c0[1] - ry;
      for (const part of o.parts) if (part.par) part.phi = wrap(partAngle(o, part) - partAngle(o, part.par));
    }

    /* ---------- попадание: только по непрозрачному ---------- */
    const hit = (cx, cy) => {
      const [X, Y] = toFrame(cx, cy);
      let best = null;
      for (const o of objs) {
        if (best && o.z < best.o.z) continue;
        let [x, y] = W2L(o, X, Y);
        if (!o.parts) { if (o.solid(x, y)) best = { o, lx: x, ly: y, X, Y }; continue; }
        for (let i = o.parts.length - 1; i >= 0; i--) { // сверху вниз
          const part = o.parts[i];
          let px = x, py = y;
          for (const p of chain(part)) { const [rx, ry] = rot(px - p.pivot[0], py - p.pivot[1], -p.phi); px = p.pivot[0] + rx; py = p.pivot[1] + ry; }
          const d = part.box, ci = Math.floor(((px - d.x) / d.w) * d.mw), cj = Math.floor(((py - d.y) / d.h) * d.mh);
          if (ci < 0 || cj < 0 || ci >= d.mw || cj >= d.mh) continue;
          const k = cj * d.mw + ci;
          if (part.mb[k >> 3] & (1 << (k & 7))) { best = { o, lx: x, ly: y, X, Y, part }; break; }
        }
      }
      return best;
    };

    /* ---------- отрисовка ---------- */
    function render(o) {
      const s = 1 + 0.035 * o.lift;
      o.el.style.transform = `translate(${(o.tx * S).toFixed(2)}px,${(o.ty * S).toFixed(2)}px) rotate(${o.th.toFixed(4)}rad) scale(${s.toFixed(4)})`;
      if (o.parts) for (const p of o.parts) if (p.el) p.el.style.transform = `rotate(${p.phi.toFixed(4)}rad)`;
    }

    /* ---------- перетаскивание ---------- */
    let zTop = objs.length, drag = null, raf = 0, last = 0, acc = 0;
    const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(step); } };
    hero.addEventListener("pointerdown", (e) => {
      const h = e.button > 0 ? null : hit(e.clientX, e.clientY);
      if (!h) { opts.onEmpty && opts.onEmpty(e); return; }
      e.preventDefault(); measure();
      const o = h.o;
      drag = { o, gl: [h.lx - o.c0[0], h.ly - o.c0[1]], p: [h.X, h.Y], hist: [] };
      if (o.parts) {
        if (!o.rig) buildRig(o);
        // «рука»: невесомая точка под пальцем, жёстко связанная с частями, за которую взяли
        const G = { x: h.X, y: h.Y, part: h.part }, P = o.rig.P;
        G.C = h.part.ids.map((id) => ({ a: -1, b: id, d: Math.hypot(P[id].x - h.X, P[id].y - h.Y) }));
        o.rig.G = G;
      }
      try { hero.setPointerCapture(e.pointerId); } catch (_) {}
      o.z = ++zTop; o.el.style.zIndex = o.z; o.el.classList.add("is-drag"); o.vx = o.vy = o.w = 0; o.live = true;
      hero.classList.add("is-grab"); kick();
    });
    hero.addEventListener("pointermove", (e) => {
      if (drag) { drag.p = toFrame(e.clientX, e.clientY); kick(); }
      else if (e.pointerType === "mouse") hero.classList.toggle("is-over", !!hit(e.clientX, e.clientY));
    });
    const end = () => {
      if (!drag) return;
      const o = drag.o, H = drag.hist;
      if (o.rig) {
        o.rig.G = null;
        // брелок бросили: скорость частиц уже есть (верле), только ограничим рывок
        for (const q of o.rig.P) { const vx = q.x - q.px, vy = q.y - q.py, v = Math.hypot(vx, vy), max = reduce ? 0 : 28; if (v > max) { q.px = q.x - (vx / v) * max; q.py = q.y - (vy / v) * max; } }
      } else if (!reduce && H.length > 1) {
        // скорость броска — по последним ~80 мс движения
        const a = H[0], b = H[H.length - 1], dt = Math.max(16, b.t - a.t) / 1000;
        if (performance.now() - b.t < 90) { o.vx = (b.x - a.x) / dt; o.vy = (b.y - a.y) / dt; o.w = wrap(b.th - a.th) / dt; }
        const sp = Math.hypot(o.vx, o.vy), max = 2600; if (sp > max) { o.vx *= max / sp; o.vy *= max / sp; }
        o.w = Math.max(-9, Math.min(9, o.w));
      }
      o.el.classList.remove("is-drag"); drag = null; hero.classList.remove("is-grab"); kick();
    };
    hero.addEventListener("pointerup", end); hero.addEventListener("pointercancel", end);
    // на телефоне: если палец попал в предмет — двигаем предмет, а не прокручиваем страницу
    hero.addEventListener("touchstart", (e) => { const t = e.touches[0]; if (t && hit(t.clientX, t.clientY)) e.preventDefault(); }, { passive: false });

    /* ---------- шаг физики ---------- */
    function stepRig(o, n) {
      const { P } = o.rig, held = drag && drag.o === o;
      const keep = held ? 0.5 : 0.84; // в руке части почти не размахиваются, брошенный брелок проезжает и тормозит
      const [x0, y0, x1, y1] = view();
      let moving = held;
      for (let s = 0; s < n; s++) {
        for (const q of P) { const vx = (q.x - q.px) * keep, vy = (q.y - q.py) * keep; q.px = q.x; q.py = q.y; q.x += vx; q.y += vy; }
        let gAng = 0;
        if (held) {
          const G = o.rig.G, f = 1 / (n - s); G.x += (drag.p[0] - G.x) * f; G.y += (drag.p[1] - G.y) * f;
          gAng = partAngle(o, G.part);
        }
        solve(o);
        if (held) {
          const G = o.rig.G, dA = wrap(partAngle(o, G.part) - gAng);
          let cx = 0, cy = 0, M = 0; for (const q of P) { cx += q.x * q.m; cy += q.y * q.m; M += q.m; }
          const k = 0.55 * Math.min(1, Math.hypot(cx / M - G.x, cy / M - G.y) / 90);
          if (dA) turnAbout(o, P.map((_, i) => i), G, -dA * (1 - k), false);
        }
        // отпустили — части плавно, без раскачки, ложатся обратно (как будто брелок встряхнули и положили)
        if (!held) for (const part of o.parts) {
          if (!part.par) continue;
          const d = wrap(partAngle(o, part) - partAngle(o, part.par));
          if (Math.abs(d) < 0.0005) continue;
          const a = -d * 0.06, sh = part.Mr / (part.Ms + part.Mr), pv = P[part.ip];
          turnAbout(o, part.sub, pv, a * sh, true);
          turnAbout(o, part.rest, pv, -a * (1 - sh), true);
        }
        // не даём уехать за край экрана: мягко возвращаем весь брелок
        let cx = 0, cy = 0, M = 0; for (const q of P) { cx += q.x * q.m; cy += q.y * q.m; M += q.m; }
        const c = { x: cx / M, y: cy / M }, m = 30; // общий центр масс брелока, а не кольцо
        const dx = c.x < x0 + m ? (x0 + m - c.x) * 0.2 : c.x > x1 - m ? (x1 - m - c.x) * 0.2 : 0;
        const dy = c.y < y0 + m ? (y0 + m - c.y) * 0.2 : c.y > y1 - m ? (y1 - m - c.y) * 0.2 : 0;
        if (dx || dy) for (const q of P) { q.x += dx; q.y += dy; }
      }
      for (const q of P) if (Math.abs(q.x - q.px) + Math.abs(q.y - q.py) > 0.03) { moving = true; break; }
      pose(o);
      if (!moving) for (const part of o.parts) if (part.par && Math.abs(part.phi) > 0.003) { moving = true; break; }
      return moving;
    }
    function step(t) {
      raf = 0;
      const dt = Math.max(0, Math.min(0.05, (t - last) / 1000)); last = t;
      acc = Math.min(acc + dt, 4 / 60);
      const n = Math.floor(acc * 60); acc -= n / 60; // шаги физики по 1/60 с — одинаково на 60 и 120 Гц
      let busy = !!drag;
      for (const o of objs) {
        if (!o.live) continue;
        const held = drag && drag.o === o;
        o.lift += ((held ? 1 : 0) - o.lift) * Math.min(1, dt * (held ? 14 : 10));
        let moving = o.lift > 0.005 && !held;
        if (o.rig) moving = stepRig(o, n) || moving;
        else if (held) {
          // тянем за точку: предмет едет за курсором и разворачивается «хвостом» назад
          const [gx, gy] = drag.p;
          const [ax, ay] = rot(drag.gl[0], drag.gl[1], o.th); // от центра к точке хвата
          const cx = o.it.x + o.c0[0] + o.tx, cy = o.it.y + o.c0[1] + o.ty;
          const len = Math.hypot(ax, ay);
          if (len > 1 && !reduce) o.th += wrap(Math.atan2(cy - gy, cx - gx) - Math.atan2(-ay, -ax)) * o.turn * Math.min(1, len / 90);
          const [nx, ny] = rot(drag.gl[0], drag.gl[1], o.th);
          o.tx = gx - nx - o.it.x - o.c0[0]; o.ty = gy - ny - o.it.y - o.c0[1];
          drag.hist.push({ t, x: o.tx, y: o.ty, th: o.th }); while (drag.hist.length > 2 && t - drag.hist[0].t > 80) drag.hist.shift();
        } else {
          // по инерции: скольжение с трением + мягкий возврат, если уехал за край экрана
          const f = Math.exp(-5.5 * dt);
          o.tx += o.vx * dt; o.ty += o.vy * dt; o.th += o.w * dt;
          o.vx *= f; o.vy *= f; o.w *= Math.exp(-6.5 * dt);
          const [x0, y0, x1, y1] = view(), m = 30;
          const cx = o.it.x + o.c0[0] + o.tx, cy = o.it.y + o.c0[1] + o.ty;
          if (cx < x0 + m) { o.tx += (x0 + m - cx) * 0.2; if (o.vx < 0) o.vx *= -0.45; }
          if (cx > x1 - m) { o.tx -= (cx - x1 + m) * 0.2; if (o.vx > 0) o.vx *= -0.45; }
          if (cy < y0 + m) { o.ty += (y0 + m - cy) * 0.2; if (o.vy < 0) o.vy *= -0.45; }
          if (cy > y1 - m) { o.ty -= (cy - y1 + m) * 0.2; if (o.vy > 0) o.vy *= -0.45; }
          if (Math.abs(o.vx) + Math.abs(o.vy) > 2 || Math.abs(o.w) > 0.01) moving = true;
        }
        render(o);
        if (held || moving) busy = true;
        else { o.vx = o.vy = o.w = 0; o.lift = 0; o.live = false; render(o); }
      }
      if (busy) raf = requestAnimationFrame(step);
    }

    return { hit, objs };
  };
})();
