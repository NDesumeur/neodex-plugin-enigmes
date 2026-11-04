// Valcendre : l'horloge aux énigmes. La grande horloge de Valcendre s'est arrêtée ; chaque énigme résolue rend un rouage.
// 30 énigmes en trois quartiers (le Marché, le Port, la Tour), des indices payés en bougies, des énigmes à manipuler.
// Tout est en pixel art dessiné ici, pixel par pixel (cadres, boutons, personnages, ville, horloge), agrandi sans lissage.
// Plugin autonome : seulement la permission « storage » (il tourne dans le bac à sable de NeoDex).
export default async function (ctx) {
  const el = ctx.el;
  const SC = 3;  // un pixel du dessin = 3 pixels à l'écran

  /* ---------- la palette ---------- */
  const C = {
    k: '#140c1c', d: '#2b1d33', D: '#3e2a4a', n: '#0d1430', N: '#172452', m: '#24346e', M: '#34488c',
    y: '#f2c25b', Y: '#c48a2c', z: '#7a4e1c', p: '#f3e2b8', P: '#d9bf8c', q: '#a8875a', Q: '#6b5434',
    w: '#fff4dc', W: '#c9b8a0', f: '#f2c9a0', F: '#c9926a', r: '#d8584a', R: '#8a2c2c', g: '#5fbf6a', G: '#2e7a46',
    a: '#d9a13a', c: '#28406e', b: '#8a5a34', s: '#e8e0d0', S: '#3d6b9a', h: '#5a3424', v: '#6a3f8a', V: '#9a6ac0', l: '#ffd86b', o: '#ff9b3d',
  };
  const cv = (w, h) => Object.assign(document.createElement('canvas'), { width: w, height: h });
  // un dessin en lettres (une lettre = une couleur de la palette, « . » = transparent), agrandi sans lissage
  function sprite(rows, scale = SC, pal = C) {
    const c = cv(rows[0].length * scale, rows.length * scale), g = c.getContext('2d');
    rows.forEach((r, y) => [...r].forEach((ch, x) => { if (pal[ch]) { g.fillStyle = pal[ch]; g.fillRect(x * scale, y * scale, scale, scale); } }));
    c.className = 'spr'; return c;
  }
  // un cadre de 12 x 12 pixels pour border-image : coins coupés, contour noir, liseré clair en haut à gauche, sombre en bas à droite
  function frame(fill, light, dark, rivet) {
    const c = cv(12, 12), g = c.getContext('2d');
    for (let y = 0; y < 12; y++) for (let x = 0; x < 12; x++) {
      const dx = Math.min(x, 11 - x), dy = Math.min(y, 11 - y); let col;
      if (dx + dy < 2) continue;
      if (dx === 0 || dy === 0 || dx + dy === 2) col = C.k;
      else if (dx === 1 || dy === 1) col = (y === 10 || x === 10) ? dark : light;
      else col = fill;
      if (rivet && dx === 2 && dy === 2) col = rivet;
      g.fillStyle = col; g.fillRect(x, y, 1, 1);
    }
    return c.toDataURL();
  }
  const F = {
    parch: frame(C.p, C.w, C.P, C.q), brass: frame(C.Y, C.y, C.z, C.l), brassH: frame(C.y, C.l, C.Y, C.w), brassP: frame(C.z, C.Y, C.k, C.y),
    night: frame(C.N, C.M, C.n, C.Y), nightH: frame(C.m, C.M, C.n, C.y), dark: frame(C.d, C.D, C.k, C.Y), green: frame(C.G, C.g, C.k, C.l), well: frame(C.P, C.q, C.w),
  };
  const bi = (u, w = 4) => `border:${w * SC}px solid transparent;border-image:url(${u}) 4 fill / ${w * SC}px stretch`;

  /* ---------- le style ---------- */
  const font = document.createElement('link'); font.rel = 'stylesheet'; font.href = 'https://fonts.googleapis.com/css2?family=Jersey+10&family=VT323&display=swap'; document.head.append(font);
  const css = el('style');
  css.textContent = `
  html,body{margin:0;min-height:100%;background:${C.n}}
  .vc{position:relative;min-height:100vh;box-sizing:border-box;padding:18px 16px 40px;color:${C.p};font:22px/24px VT323,monospace;image-rendering:pixelated;-webkit-font-smoothing:none;user-select:none;overflow:hidden}
  .vc *{box-sizing:border-box;image-rendering:pixelated}
  .vc canvas.sky{position:absolute;left:0;top:0;width:100%;height:100%;z-index:0}
  .vc .wrap{position:relative;z-index:1;max-width:900px;margin:0 auto}
  .vc .spr{display:block;flex:none}
  .vc h1,.vc h2,.vc .big{font-family:'Jersey 10',VT323,monospace;font-weight:400;letter-spacing:1px;margin:0}
  .vc h1{font-size:72px;line-height:64px;color:${C.y};text-shadow:4px 4px 0 ${C.k},-2px 0 0 ${C.k},2px 0 0 ${C.k},0 -2px 0 ${C.k}}
  .vc h2{font-size:34px;line-height:34px;color:${C.y};text-shadow:3px 3px 0 ${C.k}}
  .vc .parch h2{color:${C.R};text-shadow:2px 2px 0 ${C.P}}
  .vc .sub{color:${C.l};text-shadow:2px 2px 0 ${C.k};font-size:26px}
  .vc .parch{${bi(F.parch)};color:${C.k};padding:6px 10px}
  .vc .plaque{${bi(F.brass)};color:${C.k};padding:0 8px}
  .vc .night{${bi(F.night)};padding:4px 8px}
  .vc .bar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:0 0 14px}
  .vc .bar .sp{flex:1}
  .vc .chip{display:inline-flex;align-items:center;gap:6px;${bi(F.dark, 3)};padding:0 6px;color:${C.l};text-shadow:2px 2px 0 ${C.k};font-size:22px;line-height:22px}
  .vc button{font:24px/24px VT323,monospace;color:${C.k};${bi(F.brass)};padding:2px 10px;min-height:44px;cursor:pointer;background:none;text-shadow:1px 1px 0 ${C.l}}
  .vc button:hover{border-image-source:url(${F.brassH})}
  .vc button:active{border-image-source:url(${F.brassP});color:${C.l};text-shadow:1px 1px 0 ${C.k};transform:translateY(${SC}px)}
  .vc button.dark{border-image-source:url(${F.night});color:${C.l};text-shadow:2px 2px 0 ${C.k}}
  .vc button.dark:hover{border-image-source:url(${F.nightH})}
  .vc button:disabled{cursor:default;filter:saturate(.3) brightness(.8);transform:none}
  .vc .title{text-align:center;padding:30px 0 10px;display:flex;flex-direction:column;align-items:center;gap:10px}
  .vc .title p{max-width:600px;margin:8px auto 14px;font-size:24px;line-height:26px}
  .vc .districts{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}
  .vc .dist{cursor:pointer;display:flex;flex-direction:column;gap:6px}
  .vc .dist:hover{transform:translateY(-${SC}px)}
  .vc .dist.lock{cursor:default;filter:grayscale(1) brightness(.55)} .vc .dist.lock:hover{transform:none}
  .vc .who{display:flex;gap:10px;align-items:center}
  .vc .blurb{color:${C.Q};font-size:21px;line-height:22px}
  .vc .prog{display:flex;gap:${SC}px;margin-top:4px} .vc .prog i{flex:1;height:${3 * SC}px;background:${C.P};box-shadow:0 0 0 ${SC}px ${C.q}} .vc .prog i.on{background:${C.g};box-shadow:0 0 0 ${SC}px ${C.G}}
  .vc .meds{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin-top:14px}
  .vc .med{cursor:pointer;display:flex;flex-direction:column;align-items:center;text-align:center;${bi(F.night)};padding:4px 4px 6px}
  .vc .med:hover{border-image-source:url(${F.nightH})}
  .vc .med.ok{border-image-source:url(${F.green})}
  .vc .med .cog{position:relative;width:${24 * SC}px;height:${24 * SC}px}
  .vc .med .cog b{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:40px 'Jersey 10',monospace;color:${C.k};padding-top:4px}
  .vc .med span{font-size:20px;line-height:20px;color:${C.p};text-shadow:2px 2px 0 ${C.k};margin-top:2px}
  .vc .med small{font-size:18px;color:${C.l};text-shadow:2px 2px 0 ${C.k}}
  .vc .pz .head{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding-bottom:6px;margin-bottom:8px;box-shadow:0 ${SC}px 0 ${C.q}}
  .vc .pz .num{font:56px/48px 'Jersey 10',monospace;color:${C.R};text-shadow:3px 3px 0 ${C.P}}
  .vc .pz .val{margin-left:auto;color:${C.Q}}
  .vc .pz .q{font-size:24px;line-height:26px;white-space:pre-line}
  .vc .says{display:flex;gap:10px;align-items:center;margin-bottom:10px}
  .vc .bubble{position:relative;${bi(F.well, 3)};padding:2px 8px;color:${C.Q}}
  .vc .fig{display:flex;justify-content:center;align-items:flex-end;gap:12px;margin:12px 0;flex-wrap:wrap}
  .vc .fig .lab{display:flex;flex-direction:column;align-items:center;gap:4px;font:24px 'Jersey 10',monospace;color:${C.k}}
  .vc .ans{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:14px}
  .vc input{font:26px VT323,monospace;color:${C.k};${bi(F.well, 3)};padding:2px 6px;width:190px;outline:none;background:none}
  .vc input:focus{border-image-source:url(${F.brassH})}
  .vc .opts{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px;width:100%}
  .vc .stamp{position:absolute;right:20px;top:54px;font:44px/40px 'Jersey 10',monospace;padding:4px 10px;transform:rotate(-8deg) scale(2);opacity:0;pointer-events:none;transition:transform .2s steps(4),opacity .2s steps(2);
      box-shadow:0 0 0 ${SC}px currentColor,0 0 0 ${2 * SC}px ${C.p},0 0 0 ${3 * SC}px currentColor}
  .vc .stamp.on{opacity:1;transform:rotate(-8deg) scale(1)} .vc .stamp.good{color:${C.G}} .vc .stamp.bad{color:${C.R}}
  .vc .hints{display:flex;gap:8px;flex-wrap:wrap}
  .vc .hint{flex:1 1 230px;${bi(F.dark, 3)};padding:2px 6px;color:${C.p};font-size:22px;line-height:23px;display:flex;gap:8px;align-items:flex-start}
  .vc .hint.closed{cursor:pointer;color:${C.l};text-shadow:2px 2px 0 ${C.k};align-items:center}
  .vc .hint.closed:hover{border-image-source:url(${F.nightH})}
  .vc .why{margin-top:12px;${bi(F.green, 3)};padding:2px 8px;color:${C.w};text-shadow:2px 2px 0 ${C.k}}
  .vc .msg{min-height:24px;margin-top:6px;color:${C.R}}
  .vc .label{font:28px 'Jersey 10',monospace;color:${C.y};text-shadow:2px 2px 0 ${C.k};margin:14px 0 6px}
  .vc .board{display:inline-grid;gap:${2 * SC}px;${bi(F.dark)};padding:${2 * SC}px}
  .vc .board .cell{cursor:pointer;position:relative}
  .vc .board .cell:active{transform:translateY(${SC}px)}
  .vc .tile b{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:44px 'Jersey 10',monospace;color:${C.k};text-shadow:2px 2px 0 ${C.y}}
  .vc .magic input{width:${22 * SC}px;height:${22 * SC}px;text-align:center;font:44px 'Jersey 10',monospace;padding:0}
  .vc .final{text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px}
  @media (max-width:600px){ .vc h1{font-size:54px;line-height:50px} }`;
  document.head.append(css);

  /* ---------- les personnages, 16 x 16 ---------- */
  const FACES = {
    brindille: ['....kkkkkkkk....', '...kwwwwwwwwk...', '..kwwwwwwwwwwk..', '..kwwWwwwwWwwk..', '...kwwwwwwwwk...', '...kWWWWWWWWk...', '...kffffffffk...', '..kfffffffffFk..',
      '..kffkfffkffFk..', '..kfrffffffrFk..', '..kfffkkkfffFk..', '...kffffffffk...', '....kkffffkk....', '..kkaaakkaaakk..', '.kaaaaaaaaaaaak.', '.kaaaaaaaaaaaak.'],
    octave: ['................', '....kkkkkkkk....', '...kccccccccck..', '..kcccccccccck..', '.kkkkkkkkkkkkkk.', '...kffffffffk...', '..kfffffffffFk..', '..kffkfffkffFk..',
      '..kfffffffffFk..', '..kbbffffffbbk..', '..kbbbkkkkbbbk..', '...kbbbbbbbbk...', '....kkbbbbkk....', '..kkssskkssskk..', '.ksSsSsSsSsSsSk.', '.kSsSsSsSsSsSsk.'],
    yse: ['.....kkkkkk.....', '....khhhhhhk....', '...khhhhhhhhk...', '..khhhhhhhhhhk..', '..khhffffffhhk..', '..khffffffffhk..', '..khyyyfyyyFhk..', '..khykyfykyFhk..',
      '..khyyyfyyyFhk..', '..khffffffffhk..', '..khfffkkfffhk..', '...hkffffffkh...', '...hhkkkkkkhh...', '..kkvvvkkvvvkk..', '.kvvvvvyyvvvvvk.', '.kvvvvvvvvvvvvk.'],
  };
  const face = (who, s = 4) => { const box = el('div'); box.style.cssText = `${bi(F.night, 3)};padding:0;flex:none`; box.append(sprite(FACES[who], s)); return box; };
  const CANDLE = ['..o..', '.oly.', '.lwl.', '..y..', '.kwk.', '.kWk.', '.kWk.', '.kWk.', 'kkkkk'];
  const candle = () => sprite(CANDLE, 3);

  /* ---------- dessiner au pixel ---------- */
  const px = (g, x, y, col) => { g.fillStyle = col; g.fillRect(x, y, 1, 1); };
  function line(g, x0, y0, x1, y1, col) { x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1); const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1; let e = dx + dy; for (;;) { px(g, x0, y0, col); if (x0 === x1 && y0 === y1) break; const e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx; } if (e2 <= dx) { e += dx; y0 += sy; } } }
  const big = (c, s = SC) => { c.style.width = c.width * s + 'px'; c.style.height = c.height * s + 'px'; c.className = 'spr'; return c; };
  // une roue dentée de rayon r (dents carrées), utilisée pour les médailles, l'horloge et les figures
  function gear(g, cx, cy, r, teeth, body, light, dark, phase = 0) {
    for (let y = -r - 3; y <= r + 3; y++) for (let x = -r - 3; x <= r + 3; x++) {
      const d = Math.hypot(x + .5, y + .5), a = (Math.atan2(y + .5, x + .5) / (Math.PI * 2) * teeth + phase + 10) % 1;
      if (d > r + 2.5 || (d > r && a > .5)) continue;
      const edge = d > r - 1 && (d > r || a > .5) || d > r + 1.5;
      px(g, cx + x, cy + y, edge ? C.k : d > r - 2 ? (x + y < 0 ? light : dark) : body);
    }
    for (let y = -2; y <= 2; y++) for (let x = -2; x <= 2; x++) if (x * x + y * y <= 5) px(g, cx + x, cy + y, x * x + y * y > 2 ? C.k : C.z);
  }
  // l'horloge de Valcendre : 48 x 48, aiguilles arrêtées, ou qui tournent une fois réparée
  function clock(repaired, s = 4) {
    const c = cv(48, 48), g = c.getContext('2d');
    const draw = () => {
      g.clearRect(0, 0, 48, 48);
      gear(g, 24, 24, 20, 16, C.Y, C.y, C.z);
      for (let y = -17; y <= 17; y++) for (let x = -17; x <= 17; x++) { const d = Math.hypot(x + .5, y + .5); if (d <= 17) px(g, 24 + x, 24 + y, d > 16 ? C.k : d > 15 ? C.P : C.p); }
      for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; px(g, 24 + Math.round(Math.sin(a) * 13.5) - (Math.sin(a) < 0 ? 1 : 0), 24 - Math.round(Math.cos(a) * 13.5), i % 3 ? C.q : C.k); }
      const t = repaired ? Date.now() / 1000 : 0, am = repaired ? t / 4 % 1 * Math.PI * 2 : -.66, ah = repaired ? t / 48 % 1 * Math.PI * 2 : 1.95;
      line(g, 24, 24, 24 + Math.sin(am) * 12, 24 - Math.cos(am) * 12, C.k);
      line(g, 24, 24, 24 + Math.sin(ah) * 8, 24 - Math.cos(ah) * 8, C.R);
      px(g, 24, 24, C.y); px(g, 23, 24, C.Y);
      if (!repaired) { line(g, 13, 13, 18, 20, C.q); line(g, 18, 20, 16, 24, C.q); }
    };
    draw(); if (repaired) { const t = setInterval(() => c.isConnected ? draw() : clearInterval(t), 250); }
    return big(c, s);
  }
  // une médaille-rouage avec le numéro de l'énigme
  function cog(ok) { const c = cv(24, 24), g = c.getContext('2d'); gear(g, 12, 12, 9, 10, ok ? C.g : C.Y, ok ? '#9fe8a8' : C.y, ok ? C.G : C.z, .25); for (let y = -5; y <= 5; y++) for (let x = -5; x <= 5; x++) if (Math.hypot(x + .5, y + .5) <= 5.5) px(g, 12 + x, 12 + y, C.p); return big(c); }

  /* ---------- le ciel de Valcendre : nuit, étoiles, toits et la tour de l'horloge ---------- */
  const sky = cv(10, 10); sky.className = 'sky';
  function rnd(seed) { let x = seed; return () => (x = (x * 16807) % 2147483647) / 2147483647; }
  function drawSky() {
    const W = Math.ceil(sky.offsetWidth / SC / 1) || 300, H = Math.ceil(sky.offsetHeight / SC) || 200;
    if (sky.width !== W || sky.height !== H) { sky.width = W; sky.height = H; }
    const g = sky.getContext('2d'), R = rnd(7), bands = [C.n, '#101a3c', C.N, '#1e2d5e', C.m];
    for (let y = 0; y < H; y++) { const f = Math.min(bands.length - 1, y / H * 1.6 * bands.length), i = Math.floor(f), fr = f - i; for (let x = 0; x < W; x++) px(g, x, y, bands[Math.min(bands.length - 1, i + ((x + y) % 2 === 0 && fr > .5 ? 1 : 0) + ((x % 4 === 0 && y % 2 === 0 && fr > .75) ? 1 : 0))] || C.m); }
    const tw = Math.floor(Date.now() / 700);
    for (let i = 0; i < W * H / 260; i++) { const x = Math.floor(R() * W), y = Math.floor(R() * H * .55), on = (i * 7 + tw) % 9; px(g, x, y, on === 0 ? C.N : on < 3 ? C.l : C.w); if (i % 11 === 0 && on > 2) { px(g, x - 1, y, C.M); px(g, x + 1, y, C.M); px(g, x, y - 1, C.M); px(g, x, y + 1, C.M); } }
    // la lune
    const mx = Math.floor(W * .82), my = Math.floor(H * .14);
    for (let y = -6; y <= 6; y++) for (let x = -6; x <= 6; x++) { const d = Math.hypot(x, y); if (d <= 6) px(g, mx + x, my + y, Math.hypot(x + 3, y - 2) <= 5 ? '#101a3c' : d > 5 ? C.y : C.l); }
    // les toits
    const base = Math.floor(H * .72); let x = 0; const R2 = rnd(31);
    while (x < W) {
      const w = 10 + Math.floor(R2() * 14), h = 10 + Math.floor(R2() * 22), top = base - h;
      for (let yy = top; yy < H; yy++) for (let xx = x; xx < Math.min(W, x + w); xx++) px(g, xx, yy, xx === x ? C.k : C.d);
      for (let k = 0; k < w / 2 + 1; k++) for (let xx = x + k; xx < x + w - k; xx++) px(g, xx, top - k, k === Math.floor(w / 2) || xx === x + k || xx === x + w - k - 1 ? C.k : C.D);
      for (let yy = top + 3; yy < base - 2; yy += 5) for (let xx = x + 2; xx < x + w - 3; xx += 4) if (R2() < .45) { px(g, xx, yy, C.l); px(g, xx + 1, yy, C.o); px(g, xx, yy + 1, C.o); px(g, xx + 1, yy + 1, C.o); }
      x += w;
    }
    // la tour de l'horloge, au milieu
    const tx = Math.floor(W / 2), tw2 = 14, ttop = Math.floor(H * .3);
    for (let yy = ttop; yy < H; yy++) for (let xx = tx - tw2 / 2; xx < tx + tw2 / 2; xx++) px(g, xx, yy, xx === tx - tw2 / 2 || xx === tx + tw2 / 2 - 1 ? C.k : C.D);
    for (let k = 0; k < 12; k++) for (let xx = tx - tw2 / 2 + Math.floor(k / 2); xx < tx + tw2 / 2 - Math.floor(k / 2); xx++) px(g, xx, ttop - k, C.k);
    for (let y = -5; y <= 5; y++) for (let xx = -5; xx <= 5; xx++) { const d = Math.hypot(xx, y); if (d <= 5) px(g, tx + xx, ttop + 8 + y, d > 4 ? C.Y : C.p); }
    px(g, tx, ttop + 8, C.k); px(g, tx, ttop + 5, C.k); px(g, tx + 1, ttop + 8, C.k); px(g, tx + 2, ttop + 8, C.k);
  }
  const skyTimer = setInterval(() => sky.isConnected ? drawSky() : clearInterval(skyTimer), 700);
  addEventListener('resize', () => drawSky());

  const D = [
    { id: 'marche', name: 'Le Marché', who: 'brindille', whoName: 'Mme Brindille, boulangère', blurb: 'Sous les auvents, les marchands ont toujours une question en réserve.' },
    { id: 'port', name: 'Le Port', who: 'octave', whoName: 'Octave, le passeur', blurb: 'Les quais sentent le sel et les cordages. Octave n\'aide que ceux qui réfléchissent.' },
    { id: 'tour', name: 'La Tour de l\'Horloge', who: 'yse', whoName: 'Ysé, l\'archiviste', blurb: 'Tout en haut, les rouages attendent. Ysé garde les clés et les dernières énigmes.' },
  ];
  const P = [
    // le Marché
    { d: 'marche', t: 'Le pain et la brioche', pts: 20, type: 'num', a: 5, unit: 'centimes', q: 'Un pain et une brioche coûtent ensemble 1,10 €.\nLe pain coûte exactement 1 € de plus que la brioche.\n\nCombien coûte la brioche, en centimes ?', hints: ['La réponse « 10 centimes » est un piège : vérifie-la.', 'Si la brioche coûte b, le pain coûte b + 1 €.', 'b + (b + 100) = 110 centimes.'], why: 'Brioche 5 c, pain 1,05 € : la différence fait bien 1 € et le total 1,10 €.' },
    { d: 'marche', t: 'Les trois paniers', pts: 30, type: 'choice', fig: 'baskets', opts: ['Le panier « POMMES »', 'Le panier « POIRES »', 'Le panier « MÉLANGE »', 'Impossible avec un seul fruit'], a: 2, q: 'Trois paniers : l\'un ne contient que des pommes, l\'autre que des poires, le dernier un mélange. Un farceur a mis TOUTES les étiquettes au mauvais endroit.\n\nTu peux tirer un seul fruit d\'un seul panier, sans regarder dedans. Dans quel panier tirer pour remettre toutes les étiquettes en place ?', hints: ['Le panier étiqueté « MÉLANGE » ne peut pas contenir un mélange.', 'Il contient donc uniquement des pommes, ou uniquement des poires.', 'Un seul fruit suffit à dire lequel ; les deux autres se déduisent.'], why: 'Le panier « MÉLANGE » est pur. Si tu y tires une pomme, ce sont les pommes ; le panier « POIRES » ne peut alors être que le mélange, et le dernier les poires.' },
    { d: 'marche', t: 'La file du matin', pts: 20, type: 'num', a: 11, unit: 'personnes', q: 'Devant l\'étal de Mme Brindille, Lou est la 7ᵉ de la file en partant du début, et la 5ᵉ en partant de la fin.\n\nCombien de personnes y a-t-il dans la file ?', hints: ['Lou est comptée deux fois si tu additionnes 7 et 5.', 'Il y a 6 personnes devant Lou et 4 derrière.'], why: '6 devant, Lou, 4 derrière : 11 personnes.' },
    { d: 'marche', t: 'Les œufs durs', pts: 15, type: 'num', a: 4, unit: 'minutes', q: 'Il faut 4 minutes pour cuire un œuf dans une casserole d\'eau bouillante.\n\nCombien de minutes faut-il pour cuire 3 œufs ensemble, dans la même casserole ?', hints: ['Les œufs cuisent en même temps.'], why: 'Ils cuisent ensemble : toujours 4 minutes.' },
    { d: 'marche', t: 'Les chaussettes du mercier', pts: 25, type: 'num', a: 3, unit: 'chaussettes', q: 'Dans un tiroir plongé dans le noir, le mercier a 10 chaussettes noires et 10 blanches, toutes mélangées.\n\nCombien doit-il en prendre, au minimum, pour être SÛR d\'avoir une paire de la même couleur ?', hints: ['Il n\'y a que deux couleurs.', 'Avec deux chaussettes, tu peux avoir une noire et une blanche. Et avec une de plus ?'], why: 'Avec 3 chaussettes et seulement 2 couleurs, deux sont forcément de la même couleur.' },
    { d: 'marche', t: 'L\'âge du neveu', pts: 25, type: 'num', a: 12, unit: 'ans', q: 'Le neveu du fromager dit : « Dans 6 ans, j\'aurai le double de l\'âge que j\'avais il y a 3 ans. »\n\nQuel âge a-t-il aujourd\'hui ?', hints: ['Appelle son âge x.', 'x + 6 = 2 × (x − 3).'], why: 'x + 6 = 2x − 6, donc x = 12. Dans 6 ans : 18 ; il y a 3 ans : 9. 18 = 2 × 9.' },
    { d: 'marche', t: 'Les lanternes du marché', pts: 40, type: 'lights', seed: [0, 4, 8], q: 'À la tombée de la nuit, toutes les lanternes doivent briller. Mais chaque lanterne est reliée à ses voisines : en toucher une change son état ET celui des lanternes juste au-dessus, au-dessous, à gauche et à droite.\n\nAllume les neuf lanternes.', hints: ['Toucher deux fois la même lanterne revient à ne rien faire.', 'L\'ordre des touches ne compte pas : seul compte quelles lanternes tu touches.', 'Essaie les coins : ils ne touchent que trois lanternes.'], why: 'Il suffit de retoucher les trois lanternes du départ : chaque touche s\'annule quand on la refait.' },
    { d: 'marche', t: 'La pièce trop lourde', pts: 35, type: 'num', a: 2, unit: 'pesées', q: 'Le changeur a 9 pièces identiques en apparence. L\'une est un peu plus lourde que les autres. Il a une balance à deux plateaux, sans poids.\n\nCombien de pesées lui faut-il, au minimum, pour être sûr de trouver la lourde ?', hints: ['Une pesée a trois issues : à gauche, à droite, ou équilibre.', 'Fais trois tas de trois.'], why: 'Trois contre trois : le tas lourd est celui qui penche, ou celui qui reste si c\'est équilibré. Puis une contre une parmi ces trois : 2 pesées.' },
    { d: 'marche', t: 'Les poignées de main', pts: 25, type: 'num', a: 15, unit: 'poignées de main', q: 'Six marchands se retrouvent à l\'ouverture. Chacun serre la main de chacun des autres, une seule fois.\n\nCombien de poignées de main en tout ?', hints: ['Chaque marchand serre 5 mains.', '6 × 5 compte chaque poignée deux fois.'], why: '6 × 5 ÷ 2 = 15.' },
    { d: 'marche', t: 'Le dernier croissant', pts: 45, type: 'num', a: 1, unit: 'croissant(s)', q: 'Il reste 22 croissants. Mme Brindille te propose un jeu : chacun votre tour, on prend 1, 2 ou 3 croissants. Celui qui prend LE DERNIER croissant a perdu.\n\nTu commences. Combien en prends-tu pour être sûr de gagner, quoi qu\'elle fasse ensuite ?', hints: ['Tu veux qu\'elle se retrouve face à 1 seul croissant.', 'Si elle en a 5 devant elle, quoi qu\'elle prenne, tu peux lui en laisser 1.', 'Les positions perdantes pour elle : 1, 5, 9, 13, 17, 21…'], why: 'Prends 1 : il en reste 21. Ensuite, complète toujours son coup à 4 (elle prend 3, tu prends 1…). Elle tombe sur 17, 13, 9, 5, puis 1.' },
    // le Port
    { d: 'port', t: 'Les caisses du quai', pts: 45, type: 'slide', seed: 7, q: 'Les dockers ont mélangé les caisses. Range-les dans l\'ordre, de 1 à 8, en laissant la place vide en bas à droite.\n\nTouche une caisse voisine de la place vide pour la faire glisser.', hints: ['Range d\'abord la première ligne, puis ne la touche plus.', 'Puis la colonne de gauche.', 'Les quatre dernières caisses tournent en rond autour de la place vide.'], why: 'La méthode : ligne du haut, colonne de gauche, puis le petit carré restant.' },
    { d: 'port', t: 'La traversée du chat', pts: 35, type: 'num', a: 7, unit: 'traversées', q: 'Octave doit faire passer un chat, une souris et un fromage de l\'autre côté du fleuve. Sa barque n\'emporte qu\'un seul passager avec lui. Laissés seuls, le chat mange la souris, et la souris mange le fromage.\n\nCombien de traversées (aller OU retour) faut-il, au minimum ?', hints: ['La souris est le problème : elle ne peut rester ni avec le chat, ni avec le fromage.', 'On peut ramener quelqu\'un en arrière.', 'Souris d\'abord ; plus tard, ramène-la.'], why: 'Souris (1), retour seul (2), chat (3), retour avec la souris (4), fromage (5), retour seul (6), souris (7).' },
    { d: 'port', t: 'L\'escargot du puits', pts: 30, type: 'num', a: 8, unit: 'jours', fig: 'well', q: 'Un escargot est au fond d\'un puits de 10 mètres. Le jour, il monte de 3 mètres ; la nuit, il glisse de 2 mètres.\n\nAu bout de combien de jours sort-il du puits ?', hints: ['Il ne glisse plus une fois sorti.', 'Le matin du 8ᵉ jour, où est-il ?'], why: 'Chaque jour complet, il gagne 1 m. Le matin du 8ᵉ jour il est à 7 m ; il monte de 3 m et sort.' },
    { d: 'port', t: 'Les deux bacs', pts: 30, type: 'choice', opts: ['9 h 30', '9 h 36', '9 h 54', '10 h 12'], a: 1, q: 'Le bac du nord part toutes les 12 minutes, celui du sud toutes les 18 minutes. Ils sont partis ensemble à 9 h pile.\n\nÀ quelle heure repartiront-ils ensemble pour la première fois ?', hints: ['Cherche le premier nombre qui est à la fois un multiple de 12 et de 18.'], why: 'Le plus petit multiple commun de 12 et 18 est 36 : 9 h 36.' },
    { d: 'port', t: 'Le phare', pts: 30, type: 'num', a: 15, unit: 'secondes', q: 'Le phare lance 3 éclairs en 6 secondes : un au début, un au milieu, un à la fin, régulièrement.\n\nCombien de secondes lui faut-il pour lancer 6 éclairs ?', hints: ['Compte les intervalles, pas les éclairs.', '3 éclairs = 2 intervalles.'], why: '2 intervalles en 6 s : 3 s chacun. 6 éclairs = 5 intervalles = 15 s.' },
    { d: 'port', t: 'Le filet', pts: 30, type: 'num', a: 14, unit: 'carrés', fig: 'grid', q: 'Octave répare un filet carré, tendu en 3 × 3 cases.\n\nCombien de carrés, de toutes les tailles, peux-tu y voir ?', hints: ['Il y a des carrés de 1 case, de 2 × 2 et de 3 × 3.', 'Les carrés de 2 × 2 se chevauchent.'], why: '9 petits, 4 moyens, 1 grand : 14.' },
    { d: 'port', t: 'Le message de la bouteille', pts: 30, type: 'text', a: ['phare'], q: 'Une bouteille flotte contre le quai. Dedans, un mot : QIBSF.\nEn bas, d\'une autre main : « chaque lettre a avancé d\'un pas ».\n\nQuel est le mot d\'origine ?', hints: ['Recule chaque lettre d\'une place dans l\'alphabet.', 'Q devient P.'], why: 'Q→P, I→H, B→A, S→R, F→E : PHARE.' },
    { d: 'port', t: 'Le poisson volé', pts: 40, type: 'choice', opts: ['Anouk', 'Basile', 'Céleste', 'On ne peut pas savoir'], a: 2, q: 'Un poisson a disparu de la caisse d\'Octave. Trois mousses répondent :\n• Anouk : « C\'est Basile. »\n• Basile : « Ce n\'est pas moi. »\n• Céleste : « Ce n\'est pas moi. »\n\nUn seul des trois dit la vérité. Qui a volé le poisson ?', hints: ['Essaie chaque coupable et compte les phrases vraies.', 'Si c\'est Anouk, Basile et Céleste disent vrai : deux vérités, impossible.'], why: 'Si c\'est Céleste : Anouk ment, Céleste ment, seul Basile dit vrai. C\'est le seul cas avec une vérité.' },
    { d: 'port', t: 'La caisse de sel', pts: 30, type: 'num', a: 20, unit: 'kg', q: 'Une caisse de sel pèse 10 kg plus la moitié de son propre poids.\n\nCombien pèse-t-elle ?', hints: ['Si elle pèse x, alors x = 10 + x ÷ 2.', 'Les 10 kg sont donc l\'autre moitié.'], why: 'x = 10 + x/2, donc x/2 = 10 et x = 20 kg.' },
    { d: 'port', t: 'L\'échelle de la goélette', pts: 35, type: 'num', a: 10, unit: 'barreaux', q: 'Une échelle de corde pend le long d\'une goélette. 10 barreaux sont hors de l\'eau, espacés de 20 cm. La marée monte de 1 mètre.\n\nCombien de barreaux restent hors de l\'eau ?', hints: ['Un bateau flotte.'], why: 'La goélette monte avec la marée, et l\'échelle avec elle : toujours 10 barreaux.' },
    // la Tour
    { d: 'tour', t: 'Les aiguilles de trois heures', pts: 40, type: 'num', a: 7.5, unit: 'degrés', q: 'Il est 3 h 15. Quel angle, en degrés, font l\'aiguille des heures et celle des minutes ?', hints: ['L\'aiguille des minutes est pile sur le 3.', 'Mais celle des heures a avancé depuis 3 h : d\'un quart du chemin vers le 4.', 'Entre deux chiffres, il y a 30°.'], why: 'L\'aiguille des heures a fait un quart de 30°, soit 7,5° au-delà du 3.' },
    { d: 'tour', t: 'Les aiguilles qui se croisent', pts: 40, type: 'num', a: 11, unit: 'fois', q: 'Entre midi et minuit (sans compter minuit), combien de fois les deux aiguilles sont-elles exactement l\'une sur l\'autre ?', hints: ['Ce n\'est pas 12 : entre 11 h et 13 h, elles ne se croisent qu\'à midi.', 'L\'aiguille des minutes rattrape celle des heures toutes les 1 h 05 min 27 s environ.'], why: '12 h ÷ (12/11 h) = 11 rencontres : midi compris, minuit exclu.' },
    { d: 'tour', t: 'La suite d\'Ysé', pts: 30, type: 'num', a: 33, q: 'Sur un registre, Ysé a noté : 2, 3, 5, 9, 17, …\n\nQuel nombre vient ensuite ?', hints: ['Regarde l\'écart entre deux nombres.', 'Les écarts sont 1, 2, 4, 8…'], why: 'Les écarts doublent : 17 + 16 = 33.' },
    { d: 'tour', t: 'Le train d\'engrenages', pts: 30, type: 'choice', fig: 'gears', opts: ['Dans le sens des aiguilles', 'Dans l\'autre sens', 'Elle ne tourne pas'], a: 0, q: 'Cinq roues dentées A, B, C, D, E s\'engrènent l\'une après l\'autre. La roue A tourne dans le sens des aiguilles d\'une montre.\n\nDans quel sens tourne la roue E ?', hints: ['Deux roues qui s\'engrènent tournent en sens contraire.'], why: 'A horaire, B contraire, C horaire, D contraire, E horaire.' },
    { d: 'tour', t: 'Le carillon', pts: 40, type: 'num', a: 90, unit: 'coups', q: 'Le carillon sonne autant de coups que l\'heure : 1 coup à 1 h, 2 à 2 h… 12 à midi. Il sonne aussi un seul coup à chaque demi-heure.\n\nCombien de coups sonne-t-il de midi et demi à midi suivant inclus (12 heures) ?', hints: ['1 + 2 + … + 12 = ?', 'Il y a 12 demi-heures en 12 heures.'], why: '1 + 2 + … + 12 = 78, plus 12 demi-heures : 90.' },
    { d: 'tour', t: 'Les marches de la tour', pts: 30, type: 'num', a: 80, unit: 'marches', q: 'Du rez-de-chaussée au 1er étage de la tour, il y a 20 marches. Tous les étages sont pareils.\n\nCombien de marches du rez-de-chaussée au 4ᵉ étage ?', hints: ['Du rez-de-chaussée au 1er : une volée de marches. Au 2ᵉ : deux volées…', 'Combien de volées jusqu\'au 4ᵉ ?'], why: 'On monte 4 volées de 20 marches : 80. Le piège inverse existe aussi : du 1er au 4ᵉ, il n\'y en aurait que 3.' },
    { d: 'tour', t: 'La grande et la petite roue', pts: 30, type: 'num', a: 3, unit: 'tours', q: 'Une roue de 30 dents entraîne une roue de 10 dents.\n\nQuand la grande roue fait un tour complet, combien de tours fait la petite ?', hints: ['Les dents passent une à une : 30 dents de la grande poussent 30 dents de la petite.'], why: '30 dents ÷ 10 dents = 3 tours.' },
    { d: 'tour', t: 'Le carré magique', pts: 50, type: 'magic', q: 'La porte des archives porte un carré de 3 × 3 cases. Place les nombres de 1 à 9, chacun une fois, pour que chaque ligne, chaque colonne et les deux diagonales fassent la même somme.', hints: ['Les nombres de 1 à 9 font 45 en tout : chaque ligne fait donc 15.', 'Le 5 va au centre.', 'Les nombres pairs vont dans les coins.'], why: 'Par exemple : 2 7 6 / 9 5 1 / 4 3 8. Chaque ligne, colonne et diagonale fait 15.' },
    { d: 'tour', t: 'La devinette de la porte', pts: 30, type: 'text', a: ['horloge', 'une horloge', 'l horloge', 'pendule', 'une pendule', 'montre', 'une montre'], q: 'Gravé au-dessus de la dernière porte :\n« J\'ai des aiguilles mais je ne couds pas.\nJ\'ai un visage mais pas de bouche.\nJe marche sans jamais avancer. »\n\nQui suis-je ?', hints: ['Tu la cherches depuis le début.'], why: 'Une horloge : des aiguilles, un cadran, et elle « marche ».' },
    { d: 'tour', t: 'Le dernier rouage', pts: 60, type: 'num', a: 30, unit: 'tours par minute', q: 'Pour remettre l\'horloge en marche, trois rouages s\'entraînent. Le premier tourne 2 fois plus vite que le deuxième, et le deuxième 3 fois plus vite que le troisième. Le troisième fait 5 tours par minute.\n\nCombien de tours par minute fait le premier ?', hints: ['Pars du troisième et remonte.'], why: 'Deuxième : 3 × 5 = 15. Premier : 2 × 15 = 30 tours par minute.' },
  ];
  P.forEach((p, i) => { p.n = i + 1; p.id = 'e' + p.n; });
  const TOTAL = P.length, UNLOCK = 7;

  /* ---------- la partie, gardée par NeoDex ---------- */
  let st = (await ctx.storage.get().catch(() => null)) || {};
  st = { solved: {}, tries: {}, hints: {}, bougies: 5, ...st };
  const save = () => ctx.storage.set(st).catch(() => {});
  const solvedIn = d => P.filter(p => p.d === d && st.solved[p.id]).length;
  const unlocked = i => i === 0 || solvedIn(D[i - 1].id) >= UNLOCK;
  const score = () => Object.values(st.solved).reduce((s, v) => s + v, 0);
  const worth = p => Math.max(Math.ceil(p.pts / 2), p.pts - Math.round(p.pts * .1) * (st.tries[p.id] || 0));
  const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/['’-]/g, ' ').replace(/\s+/g, ' ').trim();

  const root = el('div', 'vc'); ctx.view.replaceChildren(root);
  const wrap = el('div', 'wrap'); root.append(sky, wrap);
  requestAnimationFrame(drawSky);
  const COG_ICON = ['..k.k..', '.kykyk.', 'kyyyyyk', '.ykkky.', 'kyyyyyk', '.kykyk.', '..k.k..'];
  const chip = (icon, text) => { const c = el('span', 'chip'); c.append(icon, text); return c; };
  const top = (back, label) => {
    const b = el('div', 'bar'); if (back) { const k = el('button', 'dark', '< ' + label); k.onclick = back; b.append(k); }
    b.append(el('span', 'sp'), chip(sprite(COG_ICON, 3), Object.keys(st.solved).length + '/' + TOTAL), chip(sprite(['..l..', '.lyl.', 'lyYyl', '.lyl.', '..l..'], 3), score() + ' étincelles'), chip(candle(), st.bougies + ' bougies'));
    return b;
  };
  const scrollTop = () => { try { root.scrollIntoView({ block: 'start' }); } catch {} };

  function title() {
    const t = el('div', 'title'), done = Object.keys(st.solved).length;
    t.append(clock(done === TOTAL, 5), el('h1', '', 'VALCENDRE'), el('div', 'sub', 'l\'horloge aux énigmes'));
    const p = el('div', 'parch'); p.style.maxWidth = '640px';
    p.append(el('p', '', done === TOTAL ? 'La grande horloge bat de nouveau. Valcendre te doit une fière chandelle : reviens quand tu veux revoir une énigme.' : 'Cette nuit, la grande horloge de Valcendre s\'est arrêtée. Ses 30 rouages ont roulé dans toute la ville. Les habitants les ont ramassés… mais chacun ne rend le sien qu\'à qui résout son énigme.'));
    const go = el('button', '', done ? 'CONTINUER' : 'COMMENCER'); go.onclick = map;
    t.append(p, go); wrap.replaceChildren(t);
  }
  function map() {
    const g = el('div', 'districts');
    D.forEach((d, i) => {
      const open = unlocked(i), n = solvedIn(d.id), c = el('div', 'parch dist' + (open ? '' : ' lock'));
      const who = el('div', 'who'), txt = el('div'); txt.append(el('h2', '', d.name), el('div', 'blurb', d.whoName));
      who.append(face(d.who, 4), txt);
      const pr = el('div', 'prog'); for (let k = 0; k < 10; k++) pr.append(el('i', k < n ? 'on' : ''));
      c.append(who, el('div', 'blurb', open ? d.blurb : 'Résous ' + UNLOCK + ' énigmes de « ' + D[i - 1].name + ' » pour y entrer.'), pr, el('div', 'blurb', n + ' / 10 rouages'));
      if (open) c.onclick = () => district(d);
      g.append(c);
    });
    wrap.replaceChildren(top(title, 'Titre'), g);
    if (Object.keys(st.solved).length === TOTAL && !st.ending) { st.ending = true; save(); ending(); }
  }
  function district(d) {
    const m = el('div', 'meds');
    for (const p of P.filter(x => x.d === d.id)) {
      const ok = st.solved[p.id], b = el('div', 'med' + (ok ? ' ok' : '')), cg = el('div', 'cog');
      cg.append(cog(!!ok), el('b', '', String(p.n)));
      b.append(cg, el('span', '', p.t), el('small', '', ok ? ok + ' étincelles' : 'vaut ' + worth(p)));
      b.onclick = () => puzzle(p, d); m.append(b);
    }
    const h = el('div', 'parch'), who = el('div', 'who'), txt = el('div'); txt.append(el('h2', '', d.name), el('div', 'blurb', d.blurb)); who.append(face(d.who, 4), txt); h.append(who);
    wrap.replaceChildren(top(map, 'Carte'), h, m); scrollTop();
  }

  /* ---------- les figures des énigmes, au pixel ---------- */
  const FIG = {
    gears() { const box = el('div', 'fig'); ['A', 'B', 'C', 'D', 'E'].forEach((L, i) => { const c = cv(30, 30), g = c.getContext('2d'); gear(g, 15, 15, 11, 10, i % 2 ? C.Y : C.a, C.y, C.z, i % 2 ? .5 : 0); const lab = el('div', 'lab'); lab.append(big(c), L); box.append(lab); }); return box; },
    grid() { const c = cv(40, 40), g = c.getContext('2d'); g.fillStyle = C.P; g.fillRect(0, 0, 40, 40); for (const k of [0, 13, 26, 39]) { line(g, k, 0, k, 39, C.h); line(g, 0, k, 39, k, C.h); } const box = el('div', 'fig'); box.append(big(c, 4)); return box; },
    baskets() {
      const B = ['..kkkkkkkkkkkk..', '.k............k.', 'k..............k', 'kkkkkkkkkkkkkkkk', 'kbbbbbbbbbbbbbbk', 'kbhbhbhbhbhbhbhk', '.kbbbbbbbbbbbbk.', '.kbhbhbhbhbhbhk.', '.kbbbbbbbbbbbbk.', '..kbhbhbhbhbhk..', '..kkkkkkkkkkkk..'];
      const box = el('div', 'fig'); for (const t of ['POMMES', 'POIRES', 'MÉLANGE']) { const lab = el('div', 'lab'); lab.append(sprite(B, 5), el('span', 'plaque', t)); box.append(lab); } return box;
    },
    well() { const c = cv(30, 46), g = c.getContext('2d'); for (let y = 0; y < 46; y++) for (let x = 0; x < 30; x++) px(g, x, y, x < 4 || x > 25 ? ((y + (x < 4 ? 0 : 2)) % 4 === 0 ? C.k : C.q) : y > 42 ? C.S : C.k); for (let m = 0; m <= 10; m++) { const y = 42 - m * 4; line(g, 4, y, 6, y, C.y); } const snail = ['..kk..', '.kyyk.', 'kyokyk', 'kykkyk', 'gggggg']; snail.forEach((r, y) => [...r].forEach((ch, x) => C[ch] && px(g, 12 + x, 38 + y, C[ch]))); const box = el('div', 'fig'), lab = el('div', 'lab'); lab.append(big(c, 4), '10 m'); box.append(lab); return box; },
  };

  /* ---------- les énigmes à manipuler ---------- */
  function rng(seed) { let x = seed * 9301 + 49297; return () => (x = (x * 9301 + 49297) % 233280) / 233280; }
  const LANTERN = [['...kk...', '..kzzk..', '.kkkkkk.', '.kDDDDk.', '.kDddDk.', '.kDddDk.', '.kDddDk.', '.kDDDDk.', '.kkkkkk.', '..kzzk..'], ['...kk...', '..kzzk..', '.kkkkkk.', '.kyyyyk.', '.kylwyk.', '.kowlok.', '.kyooyk.', '.kyyyyk.', '.kkkkkk.', '..kzzk..']];
  function lights(p, win) {
    const N = 3, on = Array(N * N).fill(true), PL = { ...C, O: C.o };
    const press = (i, s) => { const r = Math.floor(i / N), c = i % N; for (const [dr, dc] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) { const rr = r + dr, cc = c + dc; if (rr >= 0 && rr < N && cc >= 0 && cc < N) s[rr * N + cc] = !s[rr * N + cc]; } };
    const b = el('div', 'board'); b.style.gridTemplateColumns = `repeat(${N},auto)`;
    const draw = () => b.replaceChildren(...on.map((v, i) => { const l = el('div', 'cell lamp' + (v ? ' on' : '')); l.append(sprite(LANTERN[v ? 1 : 0], 7, PL)); l.onclick = () => { if (b.dataset.done) return; press(i, on); draw(); if (on.every(Boolean)) { b.dataset.done = 1; win(); } }; return l; }));
    const reset = () => { on.fill(true); p.seed.forEach(i => press(i, on)); draw(); };
    reset();
    const again = el('button', 'dark', 'RECOMMENCER'); again.onclick = () => { delete b.dataset.done; reset(); };
    return [b, again];
  }
  const CRATE = ['kkkkkkkkkkkkkkkkkkkk', 'kyyyyyyyyyyyyyyyyyzk', 'kyYYYYYYYYYYYYYYYYzk', 'kyYbbbbbbbbbbbbbbYzk', 'kyYbhhhhhhhhhhhhbYzk', 'kyYbhbbbbbbbbbbhbYzk', 'kyYbhbbbbbbbbbbhbYzk', 'kyYbhbbbbbbbbbbhbYzk', 'kyYbhbbbbbbbbbbhbYzk', 'kyYbhbbbbbbbbbbhbYzk',
    'kyYbhbbbbbbbbbbhbYzk', 'kyYbhbbbbbbbbbbhbYzk', 'kyYbhbbbbbbbbbbhbYzk', 'kyYbhbbbbbbbbbbhbYzk', 'kyYbhbbbbbbbbbbhbYzk', 'kyYbhhhhhhhhhhhhbYzk', 'kyYbbbbbbbbbbbbbbYzk', 'kyYYYYYYYYYYYYYYYYzk', 'kzzzzzzzzzzzzzzzzzzk', 'kkkkkkkkkkkkkkkkkkkk'];
  function slide(p, win) {
    const s = [1, 2, 3, 4, 5, 6, 7, 8, 0], r = rng(p.seed);
    const nb = i => [i - 3, i + 3, i % 3 ? i - 1 : -1, i % 3 < 2 ? i + 1 : -1].filter(j => j >= 0 && j < 9);
    const shuffle = () => { s.splice(0, 9, 1, 2, 3, 4, 5, 6, 7, 8, 0); let e = 8, prev = -1; for (let k = 0; k < 80; k++) { const o = nb(e).filter(j => j !== prev), j = o[Math.floor(r() * o.length)]; [s[e], s[j]] = [s[j], s[e]]; prev = e; e = j; } if (s.join() === '1,2,3,4,5,6,7,8,0') shuffle(); };
    const b = el('div', 'board'); b.style.gridTemplateColumns = 'repeat(3,auto)';
    const draw = () => b.replaceChildren(...s.map((v, i) => { const t = el('div', 'cell tile'); if (v) t.append(sprite(CRATE, 4), el('b', '', String(v))); else { t.style.cssText = `width:${80}px;height:${80}px;cursor:default`; } t.onclick = () => { if (!v || b.dataset.done) return; const e = s.indexOf(0); if (!nb(e).includes(i)) return; [s[e], s[i]] = [s[i], s[e]]; draw(); if (s.join() === '1,2,3,4,5,6,7,8,0') { b.dataset.done = 1; win(); } }; return t; }));
    shuffle(); draw();
    const again = el('button', 'dark', 'REMÉLANGER'); again.onclick = () => { delete b.dataset.done; shuffle(); draw(); };
    return [b, again];
  }
  function magic(p, win, lose) {
    const b = el('div', 'board magic'); b.style.gridTemplateColumns = 'repeat(3,auto)';
    const ins = Array.from({ length: 9 }, () => { const i = el('input'); i.inputMode = 'numeric'; i.maxLength = 1; i.oninput = () => { i.value = i.value.replace(/[^1-9]/g, ''); }; return i; });
    b.append(...ins);
    const check = el('button', '', 'VÉRIFIER'); check.onclick = () => {
      const v = ins.map(i => +i.value);
      if (v.some(x => !x) || new Set(v).size !== 9) return lose('Il faut les neuf nombres de 1 à 9, chacun une fois.', true);
      const L = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]].map(l => l.reduce((s, k) => s + v[k], 0));
      L.every(x => x === L[0]) ? win() : lose();
    };
    return [b, check];
  }

  /* ---------- une énigme ---------- */
  const SAYS = ['Voyons si tu es aussi malin qu\'on le dit.', 'Prends ton temps, la marée attendra.', 'Les archives ne s\'ouvrent qu\'aux esprits patients.'];
  function puzzle(p, d) {
    const card = el('div', 'parch pz'), head = el('div', 'head'), msg = el('div', 'msg'), stamp = el('div', 'stamp'), after = el('div');
    const solved = () => st.solved[p.id], val = el('span', 'val');
    const setVal = () => { val.textContent = solved() ? 'résolue : ' + solved() + ' étincelles' : 'vaut ' + worth(p) + ' étincelles'; };
    head.append(el('span', 'num', String(p.n)), el('h2', '', p.t), val); setVal();
    const says = el('div', 'says'); says.append(face(d.who, 3), el('div', 'bubble', d.whoName.split(',')[0] + ' : « ' + SAYS[D.indexOf(d)] + ' »'));
    card.append(head, says, el('div', 'q', p.q), stamp);
    if (p.fig) card.append(FIG[p.fig]());
    const showWhy = () => {
      after.replaceChildren(el('div', 'why', p.why));
      const nx = P[P.indexOf(p) + 1], row = el('div', 'ans'), back = el('button', 'dark', 'RETOUR AU QUARTIER'); back.onclick = () => district(d); row.append(back);
      if (nx && nx.d === p.d) { const go = el('button', '', 'ÉNIGME SUIVANTE >'); go.onclick = () => puzzle(nx, d); row.append(go); }
      after.append(row);
    };
    const flash = good => { stamp.className = 'stamp ' + (good ? 'good' : 'bad'); stamp.textContent = good ? 'JUSTE !' : 'RATÉ'; requestAnimationFrame(() => stamp.classList.add('on')); setTimeout(() => stamp.classList.remove('on'), good ? 1600 : 900); };
    const ans = el('div', 'ans');
    const win = () => {
      if (!solved()) { st.solved[p.id] = worth(p); st.bougies += 1; save(); }
      setVal(); msg.textContent = ''; flash(true); ans.querySelectorAll('button,input').forEach(x => { if (!x.closest('.board')) x.disabled = true; }); showWhy(); refreshBar(); drawHints();
    };
    const lose = (text, noCost) => { if (!noCost && !solved()) { st.tries[p.id] = (st.tries[p.id] || 0) + 1; save(); setVal(); } flash(false); msg.textContent = text || 'Ce n\'est pas ça. Réfléchis encore, ou allume une bougie.'; };
    if (p.type === 'num' || p.type === 'text') {
      const i = el('input'); i.placeholder = p.type === 'num' ? 'ta réponse' : 'ton mot'; if (p.type === 'num') i.inputMode = 'decimal';
      const ok = el('button', '', 'RÉPONDRE');
      const go = () => { const v = i.value.trim(); if (!v) return; const right = p.type === 'num' ? Math.abs(parseFloat(v.replace(',', '.').replace(/[^\d.-]/g, '')) - p.a) < 1e-9 : p.a.some(a => norm(a) === norm(v)); right ? win() : lose(); };
      ok.onclick = go; i.onkeydown = e => { if (e.key === 'Enter') go(); };
      ans.append(i); if (p.unit) ans.append(el('span', '', p.unit)); ans.append(ok);
      setTimeout(() => i.focus(), 50);
    } else if (p.type === 'choice') {
      const o = el('div', 'opts'); p.opts.forEach((t, k) => { const b = el('button', '', t); b.onclick = () => k === p.a ? win() : lose(); o.append(b); }); ans.append(o);
    } else {
      const parts = { lights, slide, magic }[p.type](p, win, lose), box = el('div'); box.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:10px;width:100%'; box.append(...parts); ans.append(box);
    }
    card.append(ans, msg, after);
    // les bougies : chacune éclaire un indice
    const hints = el('div', 'hints'), opened = () => st.hints[p.id] || 0;
    function drawHints() {
      hints.replaceChildren(...p.hints.map((h, k) => {
        if (k < opened() || solved()) { const c = el('div', 'hint'); c.append(candle(), el('span', '', h)); return c; }
        const c = el('div', 'hint closed'); c.append(candle(), el('span', '', k === opened() ? (st.bougies ? 'Allumer une bougie (il t\'en reste ' + st.bougies + ')' : 'Plus de bougies : résous une énigme pour en gagner une') : 'Indice ' + (k + 1)));
        if (k === opened() && st.bougies) c.onclick = () => { st.bougies--; st.hints[p.id] = opened() + 1; save(); drawHints(); refreshBar(); };
        return c;
      }));
    }
    drawHints();
    let bar = top(() => district(d), d.name);
    const refreshBar = () => { const nb = top(() => district(d), d.name); bar.replaceWith(nb); bar = nb; };
    wrap.replaceChildren(bar, card, el('div', 'label', 'INDICES'), hints); scrollTop();
    if (solved()) { ans.querySelectorAll('button,input').forEach(x => { if (!x.closest('.board')) x.disabled = true; }); showWhy(); }
  }
  function ending() {
    const f = el('div', 'final parch');
    f.append(clock(true, 5), el('h2', '', 'La grande horloge bat de nouveau'),
      el('p', '', 'Le dernier rouage s\'est enclenché avec un « clac » sonore. Dans toute la ville, on a levé la tête : les aiguilles repartaient. Ysé a refermé son registre en souriant : « Valcendre n\'oubliera pas ton nom. »'),
      el('p', 'big', score() + ' étincelles sur ' + P.reduce((s, p) => s + p.pts, 0)));
    const b = el('button', '', 'REVENIR À LA CARTE'); b.onclick = map; f.append(b);
    wrap.replaceChildren(f);
  }
  title();
}
