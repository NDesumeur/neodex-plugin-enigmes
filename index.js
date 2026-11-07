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
  .vc .pz .q{font-size:22px;line-height:26px;white-space:pre-line;opacity:.85}
  .vc .pz .goal{font-size:24px;line-height:28px;white-space:pre-line;background:#ead39e;border:3px solid #6b5434;box-shadow:inset 4px 0 0 #c48a2c,3px 3px 0 #140c1c;padding:10px 14px 10px 18px;margin:4px 0}
  .vc .pz .goal b{display:block;font-size:16px;letter-spacing:2px;color:#8a2c2c;margin-bottom:2px}
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
  .vc .scene{${bi(F.brass)};padding:0;margin:0 0 10px;display:flex;justify-content:center;background:${C.k}}
  .vc .scene canvas{width:100%!important;height:auto!important;max-width:${120 * 5}px}
  .vc .kind{display:inline-flex;align-items:center;gap:6px;${bi(F.dark, 2)};padding:0 6px;color:${C.l};font-size:20px;line-height:20px;text-shadow:2px 2px 0 ${C.k}}
  .vc button.small{min-height:34px;font-size:20px;padding:0 8px}
  .vc .med em{font-style:normal;font-size:17px;color:${C.V};text-shadow:2px 2px 0 ${C.k}}
  .vc .note{font-size:21px;color:${C.Q};text-align:center}
  .vc .row2{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
  .vc .deck{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
  .vc .tok{cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px;${bi(F.well, 3)};padding:2px 4px;min-width:64px;color:${C.k};font-size:20px;line-height:20px}
  .vc .tok:hover{border-image-source:url(${F.brassH})} .vc .tok.sel{border-image-source:url(${F.green});color:${C.w}}
  .vc .tok.wide canvas{width:${40 * 3}px!important;height:auto!important}
  .vc .wheels{display:flex;gap:6px} .vc .wheel{display:flex;flex-direction:column;align-items:center;gap:4px}
  .vc .wheel b{font:48px/48px 'Jersey 10',monospace;color:${C.l};${bi(F.night, 3)};width:64px;text-align:center;text-shadow:3px 3px 0 ${C.k}}
  .vc .wheel button{min-height:32px;padding:0 14px}
  .vc .board:focus{outline:none} .vc .board canvas{display:block}
  .vc .memo{margin-top:12px;${bi(F.dark, 3)};padding:4px;display:flex;flex-direction:column;gap:6px}
  .vc .memo .label{margin:0}
  .vc .big{font:40px 'Jersey 10',monospace;color:${C.R}}
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

  // <dessins>
  /* ---------- la bibliothèque de dessins : chaque objet dessiné pixel par pixel ---------- */
  Object.assign(C, { e: '#7fb8e0', E: '#4a7fb0', x: '#a9a3a0', X: '#5e5a66', j: '#e86fa0', J: '#a83a6a', t: '#b8e070', T: '#6a9a3a', u: '#ffffff' });
  const SPR = {
    apple: ['....kk....', '.....kGG..', '..kkkkkk..', '.krrrrrrk.', 'krwrrrrrrk', 'krwrrrrrRk', 'krrrrrrrRk', 'krrrrrrRRk', '.kRrrrRRk.', '..kkkkkk..'],
    pear: ['....k.....', '....kGG...', '...kkk....', '..ktttk...', '..kttTk...', '.kttttTk..', 'ktwttttTk.', 'kttttttTk.', 'kttttttTk.', 'kTttttTTk.', '.kTTTTTk..', '..kkkkk...'],
    bread: ['....kkkkkkkkkk..', '..kkaaaaaaaaaakk', '.kaayaaayaaayaak', 'kaaYyaYyaaYyaaak', 'kaaaaaaaaaaaaaYk', '.kYaaaaaaaaaaYk.', '..kkkkkkkkkkkk..'],
    brioche: ['...kkkk...', '..kaayak..', '.kkkkkkkk.', 'kaaaaaaaak', 'kayaaayaak', 'kaaaaaaaYk', '.kYaaaaYk.', '..kkkkkk..'],
    croissant: ['....kkkk....', '..kkaaaakk..', '.kaYayyaYak.', 'kaYkaaaakYak', 'kak.kkkk.kak', 'kk........kk'],
    egg: ['..kk..', '.kwwk.', 'kwwwwk', 'kwwwWk', 'kwwwWk', 'kwwWWk', '.kWWk.', '..kk..'],
    sock: ['.kkkk...', '.kwwk...', '.kRRk...', '.kwwk...', '.kwwk...', '.kwwkk..', 'kwwwwwk.', 'kwwwwwwk', 'kWwwwwWk', '.kkkkkk.'],
    sockb: ['.kkkk...', '.kddk...', '.kRRk...', '.kddk...', '.kddk...', '.kddkk..', 'kdddddk.', 'kddddddk', 'kDddddDk', '.kkkkkk.'],
    coin: ['..kkk..', '.kyyyk.', 'kylyyYk', 'kyyYyYk', 'kyyyyYk', '.kYYYk.', '..kkk..'],
    cheese: ['......kkk.', '...kkklyk.', '.kklylyyk.', 'kyyyyyyyYk', 'kyYyyyYyYk', 'kyyyYyyyYk', 'kyyyyyyyYk', 'kkkkkkkkkk'],
    cat: ['k...k.......', 'kk.kk.......', 'kDkDk.......', 'kDDDk.......', 'kdDdk...kk..', 'kDDDkkkkDk..', '.kDDDDDDDk..', '.kDDDDDDDk..', '.kDkDDDkDk.k', '.kk.kkk.kkkk'],
    mouse: ['...kk.....', '..kWWk....', '.kWWWWkk..', 'kWkWWWWWk.', 'kWWWWWWWWk', '.kkkkkkkk.k'],
    fish: ['....kkkk....', '..kkeeeekk.k', '.keukeeeeEkk', 'keeeeeeEEeEk', '.kEEEEEEEkkk', '..kkkkkkk..k'],
    boat: ['.......k........', '.......kww......', '.......kwwww....', '.......kwwwwww..', '.......kwwww....', '.......k........', 'kkkkkkkkkkkkkkkk', '.kbbbbbbbbbbbbk.', '..khbhbhbhbhbk..', '...kkkkkkkkkk...'],
    lighthouse: ['...kk...', '..kllk..', '.kkkkkk.', '.kyllyk.', '.kkkkkk.', '..kwwk..', '..krrk..', '..kwwk..', '.kwwwwk.', '.krrrrk.', '.kwwwwk.', '.kwwwwk.', 'krrrrrrk', 'kwwwwwwk', 'kwwwwwwk', 'kkkkkkkk'],
    anchor: ['...kkk...', '...kXk...', '...kkk...', '.kkkXkkk.', '....X....', '....X....', 'k...X...k', 'kX..X..Xk', '.kXXXXXk.', '..kkkkk..'],
    bottle: ['..kk..', '..kk..', '.keek.', '.keek.', 'keeeek', 'kewwek', 'kewwek', 'keeeek', 'keeeek', 'kEEEEk', '.kkkk.'],
    key: ['.kkk......', 'kyyyk.....', 'kykykkkkkk', 'kyyyyyyyyk', '.kkk.kyk.k', '.....kk...'],
    padlock: ['..kkkk..', '.kXkkXk.', '.kX..Xk.', 'kkkkkkkk', 'kyyyyyYk', 'kyykkyYk', 'kyyykyYk', 'kyyyyyYk', 'kYYYYYYk', 'kkkkkkkk'],
    book: ['.kkkkkkkk.', 'kRrrrrrrrk', 'kRrlllllrk', 'kRrrrrrrrk', 'kRrlllllrk', 'kRrrrrrrrk', 'kRrrrrrrrk', 'kRwwwwwwwk', 'kkkkkkkkkk'],
    bell: ['....kk....', '...kyyk...', '..kylyyk..', '..kyyyYk..', '.kylyyyYk.', '.kyyyyyYk.', 'kylyyyyyYk', 'kyyyyyyyYk', 'kkkkkkkkkk', '....kk....'],
    star: ['...k...', '..kyk..', 'kkylykk', 'kyyyyyk', '.kyyYk.', '.kyk.kk', '.kk....'],
    moon: ['..kkkk..', '.kllkk..', 'kllk....', 'klyk....', 'klyk....', 'klyyk...', '.klyykkk', '..kkkk..'],
    sun: ['....o.....', '.o..o..o..', '..kkkkk...', '.kyyyyyk..', 'okylyyyko.', '.kyyyyYk..', '.kyyyYYk..', '..kkkkk...', '.o..o..o..', '....o.....'],
    planet: ['.....kkk....', '...kkVVVkk..', 'kkkVVvVVVkkk', 'k.kVvVVVVk.k', '.kkkkkkkkkk.', '...kVVVVk...', '....kkkk....'],
    telescope: ['..........kk..', '........kkwwk.', '......kkcccck.', '....kkccccck..', '..kkcccccck...', 'kkcccccck.....', 'kwccccck......', '.kkkkkk.......', '....kXk.......', '...kX.Xk......'],
    flower: ['..kkk..', '.kjjjk.', 'kjjyjjk', 'kjyyyjk', 'kjjyjjk', '.kjjjk.', '..kGk..', 'k.kGk..', 'kGkGk..', '.kGGk..', '..kGk..'],
    flowerb: ['..kkk..', '.kVVVk.', 'kVVyVVk', 'kVyyyVk', 'kVVyVVk', '.kVVVk.', '..kGk..', '..kGk.k', '..kGkGk', '..kGGk.', '..kGk..'],
    tree: ['....kkkk....', '..kkggggkk..', '.kggtgggggk.', 'kggtggggGgGk', 'kgggggggGGgk', 'kggggGggggGk', '.kgGgggGGGk.', '..kkGGGGkk..', '....kbbk....', '....kbhk....', '....kbhk....', '...kbbbhk...', '..kkkkkkkk..'],
    frog: ['..kk..kk..', '.kgukkugk.', '.kgkggkgk.', 'kggggggggk', 'kgrrrrrrgk', 'kgGggggGgk', 'kGk.kk.kGk'],
    frogb: ['..kk..kk..', '.kauakkuak', '.kakaakak.', 'kaaaaaaaak', 'karrrrrrak', 'kaYaaaaYak', 'kYk.kk.kYk'],
    butterfly: ['.kk.....kk.', 'kjjk...kjjk', 'kjyjk.kjyjk', 'kjjjjkjjjjk', '.kjjjkjjjk.', '.kJjkkkjJk.', '..kkk.kkk..'],
    mushroom: ['...kkkk...', '.kkrrwrkk.', 'krrwrrrrrk', 'krrrrrwrrk', 'kwrrrrrrRk', 'kkkkkkkkkk', '...kwwk...', '...kwWk...', '...kwWk...', '...kkkk...'],
    can: ['..kkkkk.....', '.kXxxxXk...k', 'kXxxxxxXk.kx', 'kxxxxxxxkkxk', 'kxxxxxxxxxk.', 'kxxxxxxxXk..', 'kXxxxxxXXk..', '.kXXXXXXk...', '..kkkkkk....'],
    bucket: ['.kkkkkkk.', 'k.......k', 'kkkkkkkkk', 'kbbbbbbhk', 'kbXXXXXhk', '.kbbbbhk.', '.kbXXXhk.', '.kbbbbhk.', '..kkkkk..'],
    pickaxe: ['..kkkkkkk..', '.kxxxxxxxk.', 'kxk.kbk.kxk', 'k...kbk...k', '....kbk....', '....kbk....', '....kbk....', '....kbk....', '....kbk....', '....khk....', '....kkk....'],
    wagon: ['.kkkkkkkkkkkk.', '.kXXXXXXXXXXk.', 'kXxxxxxxxxxxXk', 'kXxkXXXXXXkxXk', 'kXxxxxxxxxxxXk', '.kkkkkkkkkkkk.', '..kxk....kxk..', '..kkk....kkk..'],
    gem: ['.kkkkk.', 'kewweek', 'keeeeEk', '.keeEk.', '..kEk..', '...k...'],
    gemr: ['.kkkkk.', 'kjuujjk', 'kjjjjJk', '.kjjJk.', '..kJk..', '...k...'],
    rock: ['...kkkk...', '.kkxxxxkk.', 'kxxxxxxxXk', 'kxxXxxxxXk', 'kxxxxxXXXk', '.kXXXXXXk.', '..kkkkkk..'],
    mask: ['.kkkkkkkk.', 'kwwwwwwwwk', 'kwkkwwkkwk', 'kwkkwwkkwk', 'kwwwwwwwwk', 'kwwwwwwwwk', 'kwrwwwwrwk', '.kwrrrrwk.', '..kwwwwk..', '...kkkk...'],
    ticket: ['kkkkkkkkkk', 'kyyykyyyyk', 'kyrykyRRyk', 'kyyykyyyyk', 'kyrykyRRyk', 'kkkkkkkkkk'],
    chair: ['.kkkkkk.', '.kbbbbk.', '.kbhhbk.', '.kbbbbk.', '.kbhhbk.', 'kkkkkkkk', 'krrrrrrk', 'kkkkkkkk', '.kk..kk.', '.kk..kk.'],
    cup: ['.kkkkk.', 'kwwwwwkk', 'kwwwwwkk', 'kwwwwwk.', '.kWWWk..', '..kkk...'],
    jug: ['..kkkkk..', '..kpppk..', '...kpk...', '..kpppkk.', '.kpppppkk', 'kpppppppk', 'kpqpppppk', 'kpqppppPk', 'kppppppPk', '.kPPPPPk.', '..kkkkk..'],
    valve: ['...kkk...', '.kkrrrkk.', 'krrkkkrrk', 'krk.k.krk', 'krkkXkkrk', 'krk.k.krk', 'krrkkkrrk', '.kkrrrkk.', '...kkk...'],
    duck: ['...kkk...', '..kyyyk..', '..kykyko.', '..kyyykoo', 'kkkyyyk..', 'kyyyyyyk.', 'kyyyyyYk.', '.kYYYYk..'],
    person: ['..kkkk..', '.khhhhk.', '.kffffk.', '.kfkfkk.', '.kffffk.', '..kffk..', '.kAAAAk.', 'kAAAAAAk', 'kfAAAAfk', '.kAAAAk.', '.kBk.kBk', '.kkk.kkk'],
    hourglass: ['kkkkkkk', '.kwwwk.', '.kyyyk.', '..kyk..', '..kyk..', '.kwywk.', '.kyyyk.', 'kkkkkkk'],
    bird: ['..kk....', '.kVVk...', 'kVuVVkk.', 'okVVVVVk', '.kVVVVk.', '..kkkk..'],
    die: ['kkkkkkk', 'kwwwwwk', 'kwkwwwk', 'kwwkwwk', 'kwwwkwk', 'kwwwwwk', 'kkkkkkk'],
    card: ['kkkkkkk', 'kwwwwwk', 'kwrwwwk', 'kwwrwwk', 'kwrrrwk', 'kwwrwwk', 'kwwwrwk', 'kwwwwwk', 'kkkkkkk'],
    box: ['kkkkkkkkkk', 'kbbbbbbbbk', 'kkkkkkkkkk', 'kbhbbbbhbk', 'kbhbbbbhbk', 'kbhbbbbhbk', 'kbbbbbbbbk', 'kkkkkkkkkk'],
    scroll: ['.kkkkkkkkkk.', 'kPkppppppkPk', 'kPkpqqqqpkPk', '.kkppppppkk.', '..kpqqqqpk..', '..kppppppk..', '..kpqqqpPk..', '.kkkkkkkkkk.', 'kPkkkkkkkkPk'],
    potion: ['..kk..', '..kk..', '.kwwk.', 'kvvvvk', 'kvVvvk', 'kvvvvk', 'kVvvVk', '.kkkk.'],
    sack: ['...kk....', '..kPPk...', '...kk....', '.kkpppkk.', 'kpppppppk', 'kpppQpppk', 'kppQpQppk', 'kpppppPPk', '.kkkkkkk.'],
    ladder: ['kk..kk', 'kbkkbk', 'kbbbbk', 'kbkkbk', 'kb..bk', 'kbkkbk', 'kbbbbk', 'kbkkbk', 'kb..bk', 'kbkkbk', 'kbbbbk', 'kbkkbk'],
    rope: ['..kkkk..', '.kbhbhk.', 'kbk..kbk', 'khk..khk', 'kbk..kbk', '.khbhbk.', '..kkkk..'],
    lamp: ['...kk...', '..kzzk..', '.kkkkkk.', '.kylwyk.', '.kowlok.', '.kyooyk.', '.kkkkkk.', '..kzzk..'],
    snail: ['..kkk...', '.kyyyk..', 'kyokyyk.', 'kykkkyk.', '.kyyyk.k', 'ktttttttk'],
    crate: ['kkkkkkkkkk', 'kyyyyyyyzk', 'kybbbbbbzk', 'kybhbbhbzk', 'kybbhhbbzk', 'kybhbbhbzk', 'kybbbbbbzk', 'kzzzzzzzzk', 'kkkkkkkkkk'],
    basket: ['..kkkkkk..', '.k......k.', 'kkkkkkkkkk', 'kbbbbbbbbk', 'kbhbhbhbhk', '.kbbbbbbk.', '.kbhbhbhk.', '..kkkkkk..'],
    candle: ['..o..', '.oly.', '.lwl.', '..y..', '.kwk.', '.kWk.', '.kWk.', 'kkkkk'],
    heart: ['.kk.kk.', 'krrkrrk', 'krwrrRk', 'krrrrRk', '.krrRk.', '..kRk..', '...k...'],
    arrow: ['....k..', '....kk.', 'kkkkkyk', 'kyyyyyk', 'kkkkkyk', '....kk.', '....k..'],
  };
  // les figurants : même dessin, autres couleurs (A : habit, B : chaussures)
  const PEOPLE = { person: { A: C.c, B: C.k }, personr: { A: C.r, B: C.k }, persong: { A: C.G, B: C.h }, personv: { A: C.v, B: C.k }, persony: { A: C.Y, B: C.h } };
  // une toute petite police 3 x 5 pour écrire dans les dessins
  const MINI = { 0: '111101101101111', 1: '010110010010111', 2: '111001111100111', 3: '111001111001111', 4: '101101111001001', 5: '111100111001111', 6: '111100111101111', 7: '111001010010010', 8: '111101111101111', 9: '111101111001111',
    A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110', E: '111100110100111', F: '111100110100100', G: '011100101101011', H: '101101111101101', I: '111010010010111',
    J: '001001001101010', K: '101110100110101', L: '100100100100111', M: '101111111101101', N: '110101101101101', O: '010101101101010', P: '110101110100100', Q: '010101101011001', R: '110101110110101',
    S: '011100010001110', T: '111010010010010', U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101', Y: '101101010010010', Z: '111001010100111',
    '+': '000010111010000', '-': '000000111000000', '=': '000111000111000', '?': '110001010000010', '×': '000101010101000', ':': '000010000010000', '.': '000000000000010', '%': '101001010100101', '!': '010010010000010', '/': '001001010100100', ' ': '000000000000000', "'": '010010000000000', 'É': '010111110100111' };
  function mini(g, text, x, y, col = C.k) { [...String(text).toUpperCase()].forEach((ch, i) => { const m = MINI[ch] || MINI['?']; for (let k = 0; k < 15; k++) if (m[k] === '1') px(g, x + i * 4 + k % 3, y + Math.floor(k / 3), col); }); }
  const miniW = t => String(t).length * 4 - 1;
  function stamp(g, rows, x, y, pal = C, flip = false) { rows.forEach((r, yy) => [...r].forEach((ch, xx) => { const col = pal[ch]; if (col) px(g, x + (flip ? r.length - 1 - xx : xx), y + yy, col); })); }
  // les décors des quartiers, 120 x 44, au pixel près
  const BACK = {
    marche(g, W, H) { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) px(g, x, y, y < 8 ? ((Math.floor(x / 6) % 2) ? C.w : C.r) : y === 8 ? (x % 6 < 3 ? C.r : C.w) : y < H - 10 ? (y % 8 === 0 || (x + (Math.floor(y / 8) % 2) * 4) % 8 === 0 ? C.P : C.p) : ((x + (y % 2) * 3) % 6 === 0 || y % 3 === 0 ? C.q : C.P)); for (let x = 0; x < W; x += 6) px(g, x + 2, 9, C.R); },
    port(g, W, H) { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) px(g, x, y, y < H - 16 ? (y < 6 ? C.e : '#a8d4f0') : y < H - 12 ? (((x + y) % 7 === 0) ? C.w : C.S) : y < H - 8 ? ((x + y * 3) % 9 === 0 ? C.e : C.E) : (x % 10 === 0 || y === H - 8 ? C.h : C.b)); for (const [cx, cy] of [[18, 6], [70, 10], [100, 5]]) for (let k = -3; k <= 3; k++) { px(g, cx + k, cy, C.w); if (Math.abs(k) < 2) px(g, cx + k, cy - 1, C.w); } },
    tour(g, W, H) { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) px(g, x, y, (y % 6 === 5 || (x + (Math.floor(y / 6) % 2) * 5) % 10 === 0) ? C.X : ((x * 7 + y * 3) % 11 === 0 ? C.x : '#8a8490')); for (let y = 6; y < 22; y++) for (let x = 96; x < 110; x++) px(g, x, y, x === 96 || x === 109 || y === 6 || y === 21 || x === 103 || y === 14 ? C.k : C.n); px(g, 99, 9, C.l); px(g, 106, 17, C.w); },
    jardins(g, W, H) { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) px(g, x, y, y < 14 ? (y < 5 ? C.e : '#c4e6f6') : y < 24 ? (((x * 5 + y * 3) % 7 === 0) ? C.T : C.G) : ((x * 3 + y * 7) % 13 === 0 ? C.T : (x + y) % 17 === 0 ? C.j : C.g)); for (let x = 4; x < W; x += 13) { px(g, x, 23, C.l); px(g, x + 1, 22, C.j); } },
    thermes(g, W, H) { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) px(g, x, y, y < H - 12 ? ((x % 8 === 0 || y % 8 === 0) ? C.E : ((Math.floor(x / 8) + Math.floor(y / 8)) % 2 ? C.e : C.s)) : y === H - 12 ? C.k : ((x + y) % 5 === 0 ? C.e : C.S)); for (let i = 0; i < 6; i++) for (let k = 0; k < 5; k++) px(g, 10 + i * 19 + (k % 2), H - 14 - k * 2, C.w); },
    mines(g, W, H) { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) px(g, x, y, ((x * 13 + y * 7) % 23 === 0) ? C.X : ((x * 3 + y * 5) % 17 === 0) ? '#2a2430' : y > H - 8 ? (x % 4 === 0 ? C.Q : C.h) : C.d); for (const bx of [6, 58, 110]) for (let y = 0; y < H - 8; y++) for (let x = 0; x < 4; x++) px(g, bx + x, y, x === 0 || x === 3 ? C.k : C.b); for (let x = 0; x < W; x++) for (let y = 0; y < 3; y++) px(g, x, y, y === 2 ? C.k : C.b); },
    theatre(g, W, H) { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) px(g, x, y, y > H - 9 ? ((x + y) % 8 === 0 ? C.h : C.b) : (x < 14 || x > W - 15) ? ((x % 4 === 0) ? C.R : C.r) : y < 6 ? (y === 5 ? C.y : (x % 4 < 2 ? C.R : C.r)) : C.k); for (let x = 20; x < W - 20; x += 16) px(g, x, 8, C.l); },
    observatoire(g, W, H) { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) px(g, x, y, y > H - 7 ? (x % 6 === 0 ? C.k : C.X) : y < 14 ? C.n : y < 26 ? ((x + y) % 2 ? C.n : C.N) : C.N); for (let i = 0; i < 40; i++) px(g, (i * 37) % W, (i * 23) % (H - 9), i % 5 ? C.w : C.l); },
  };
  // un dessin d'énigme : le décor du quartier et les objets posés dessus. it : [nom, x, y, nombre, écart, retourné] ou ['#texte', x, y, couleur]
  function scene(d, items, W = 120, H = 44) {
    const c = cv(W, H), g = c.getContext('2d');
    (BACK[d] || BACK.tour)(g, W, H);
    for (const [name, x, y, n = 1, dx = 0, flip, dy = 0] of items) {
      if (name[0] === '#') { const t = name.slice(1), col = n === 1 ? C.k : C[n] || n; g.fillStyle = C.w; g.fillRect(x - 1, y - 1, miniW(t) + 2, 7); mini(g, t, x, y, col); continue; }
      if (name === 'gear') { gear(g, x, y, n, Math.max(6, Math.round(n * 1.1)), dx || C.Y, C.y, C.z); continue; }
      if (name === 'clock') { clockFace(g, x, y, n, dx); continue; }
      const rows = SPR[name] || SPR[name.replace(/[rgvy]$/, '')], pal = PEOPLE[name] ? { ...C, ...PEOPLE[name] } : C;
      for (let i = 0; i < n; i++) stamp(g, rows, x + i * dx, y + i * dy, pal, flip);
    }
    return big(c, SC);
  }
  // un cadran de rayon r à l'heure donnée « h:mm »
  function clockFace(g, cx, cy, r, hm = '12:00') {
    const [h, m] = String(hm).split(':').map(Number);
    for (let y = -r - 1; y <= r + 1; y++) for (let x = -r - 1; x <= r + 1; x++) { const d = Math.hypot(x + .5, y + .5); if (d <= r + 1) px(g, cx + x, cy + y, d > r ? C.k : d > r - 1 ? C.Y : C.p); }
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; px(g, cx + Math.round(Math.sin(a) * (r - 2)), cy - Math.round(Math.cos(a) * (r - 2)), i % 3 ? C.q : C.k); }
    const am = m / 60 * Math.PI * 2, ah = ((h % 12) + m / 60) / 12 * Math.PI * 2;
    line(g, cx, cy, cx + Math.sin(am) * (r - 2), cy - Math.cos(am) * (r - 2), C.k);
    line(g, cx, cy, cx + Math.sin(ah) * (r * .55), cy - Math.cos(ah) * (r * .55), C.R);
    px(g, cx, cy, C.y);
  }
  Object.assign(FACES, {
    capucine: ['....kkkkkkkk....', '...kGGGGGGGGk...', '..kGjGGGGGjGGk..', '.kkkkkkkkkkkkkk.', '...khffffffhk...', '..khfffffffFhk..', '..khfkfffkfFhk..', '..khffffffffhk..',
      '..khfjffffjfhk..', '..khffkkkkffhk..', '...kffffffffk...', '....kkffffkk....', '..kkgggkkgggkk..', '.kggggTggTggggk.', '.kgggggggggggggk', '.kkkkkkkkkkkkkk.'],
    hector: ['................', '.....kkkkkk.....', '....kwwwwwwk....', '...kffffffffk...', '..kfffffffffFk..', '..kffkfffkffFk..', '..kfffffffffFk..', '..khhhhhhhhhhk..',
      '..khhkkkkkkhhk..', '...khhhhhhhhk...', '....kkkkkkkk....', '...kssskksssk...', '..ksesesesesek..', '.kseseseseseesk.', '.ksesesesesesek.', '.kkkkkkkkkkkkkk.'],
    gaspard: ['.....kkkkkk.....', '....kYYYYYYk....', '...kYYYllYYYk...', '..kkkkkkkkkkkk..', '...kffffffffk...', '..kfffffffffFk..', '..kffkfffkffFk..', '..kXfffffffXFk..',
      '..kfXfffffXfFk..', '..kffXkkkXffFk..', '...kffffffffk...', '....kkffffkk....', '..kkbbbkkbbbkk..', '.kbbbbhbbhbbbbk.', '.kbbbbhbbhbbbbk.', '.kkkkkkkkkkkkkk.'],
    lyre: ['....kkkkkkkk....', '...kvvvvvvvvk...', '..kvvjvvvvjvvk..', '..kvkkkkkkkkvk..', '..kkwwwwwwwwkk..', '..kwwkwwwwkwwk..', '..kwkukwwkukwk..', '..kwwkwwwwkwwk..',
      '..kwwwwwwwwwwk..', '..kwwrwwwwrwwk..', '...kwwrrrrwwk...', '....kkwwwwkk....', '..kkyyykkyyykk..', '.kyyyyRyyRyyyyk.', '.kyyyyyyyyyyyyk.', '.kkkkkkkkkkkkkk.'],
    selene: ['......kkkk......', '....kkcccckk....', '...kcclcccccck..', '..kccccccccclck.', '..kkkkkkkkkkkk..', '...kVffffffVk...', '..kVfffffffFVk..', '..kVfwkfwkfFVk..',
      '..kVffffffffVk..', '..kVfffffffFVk..', '..kVffkkkkffVk..', '...kVffffffVk...', '..kkcccyycckk...', '.kcccccyycccck..', '.kccccccccccccck', '.kkkkkkkkkkkkkk.'],
  });
  // </dessins>
  /* ---------- le ciel de Valcendre : nuit, étoiles, toits et la tour de l'horloge ---------- */
  const sky = cv(10, 10); sky.className = 'sky';
  function rnd(seed) { let x = seed; return () => (x = (x * 16807) % 2147483647) / 2147483647; }
  // le décor : ciel tramé (trame ordonnée 4×4, pas de bandes), étoiles, lune et son halo, montagnes, deux rangées de toits, la tour de l'horloge
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  const hex = h => { const n = parseInt(h.slice(1), 16); return 0xff000000 | (n & 255) << 16 | (n >> 8 & 255) << 8 | n >> 16; };  // en ABGR pour Uint32Array
  function drawSky() {
    const W = Math.ceil(sky.offsetWidth / SC) || 300, H = Math.ceil(sky.offsetHeight / SC) || 200;
    if (sky.width !== W || sky.height !== H) { sky.width = W; sky.height = H; }
    const g = sky.getContext('2d'), img = g.createImageData(W, H), d32 = new Uint32Array(img.data.buffer);
    const put = (x, y, c) => { if (x >= 0 && y >= 0 && x < W && y < H) d32[y * W + x] = c; };
    const SKY = ['#0a0f26', '#0d1430', '#121c42', '#172452', '#1e2d5e', '#2a3a72', '#3a3f78', '#57487e'].map(hex);
    for (let y = 0; y < H; y++) { const f = Math.min(.999, y / (H * .78)) * (SKY.length - 1); for (let x = 0; x < W; x++) { const i = Math.floor(f), fr = f - i; d32[y * W + x] = SKY[Math.min(SKY.length - 1, i + (fr * 16 > BAYER[(y & 3) * 4 + (x & 3)] ? 1 : 0))]; } }
    const R = rnd(7), tw = Math.floor(Date.now() / 700), cl = hex(C.l), cw = hex(C.w), cN = hex(C.M);
    for (let i = 0; i < W * H / 300; i++) { const x = Math.floor(R() * W), y = Math.floor(R() * R() * H * .6), on = (i * 7 + tw) % 11; put(x, y, on === 0 ? cN : on < 3 ? cl : cw); if (i % 13 === 0 && on > 3) { put(x - 1, y, cN); put(x + 1, y, cN); put(x, y - 1, cN); put(x, y + 1, cN); } }
    // la lune, avec un halo tramé
    const mx = Math.floor(W * .82), my = Math.floor(H * .14), halo = hex('#2c3a78'), cy = hex(C.y);
    for (let y = -14; y <= 14; y++) for (let x = -14; x <= 14; x++) { const r = Math.hypot(x, y); if (r > 7 && r <= 14 && (14 - r) / 7 * 16 > BAYER[((my + y) & 3) * 4 + ((mx + x) & 3)]) put(mx + x, my + y, halo); }
    for (let y = -7; y <= 7; y++) for (let x = -7; x <= 7; x++) { const r = Math.hypot(x, y); if (r <= 7) put(mx + x, my + y, r > 6 ? cy : Math.hypot(x - 2, y + 2) < 2 || Math.hypot(x + 3, y - 3) < 1.5 ? hex(C.y) : cl); }
    // les montagnes, au loin
    const mnt = hex('#26285a'), mntL = hex('#33356e'), base = Math.floor(H * .72);
    for (let x = 0; x < W; x++) { const h = Math.floor(H * .16 + Math.sin(x * .021) * H * .06 + Math.sin(x * .057 + 1) * H * .03); for (let y = base - h; y < H; y++) put(x, y, y < base - h + 2 && Math.sin(x * .057 + 1) > .3 ? mntL : mnt); }
    // deux rangées de toits : au fond (sombres, peu de fenêtres), devant (fenêtres chaudes, cheminées)
    const rows = [{ base: base - 6, hmin: 8, hmax: 22, wall: hex('#1d1a3e'), roof: hex('#25224c'), edge: hex('#151230'), lit: .12, seed: 19 },
      { base, hmin: 10, hmax: 26, wall: hex(C.d), roof: hex(C.D), edge: hex(C.k), lit: .42, seed: 31 }];
    for (const row of rows) {
      const R2 = rnd(row.seed); let x = -Math.floor(R2() * 8);
      while (x < W) {
        const w = 10 + Math.floor(R2() * 14), h = row.hmin + Math.floor(R2() * (row.hmax - row.hmin)), top = row.base - h, kind = R2();
        for (let yy = top; yy < H; yy++) for (let xx = x; xx < x + w; xx++) put(xx, yy, xx === x || xx === x + w - 1 ? row.edge : row.wall);
        if (kind < .55) for (let k = 0; k <= w / 2; k++) for (let xx = x + k; xx < x + w - k; xx++) put(xx, top - k, xx === x + k || xx === x + w - k - 1 ? row.edge : row.roof);  // toit pointu
        else if (kind < .8) { for (let xx = x; xx < x + w; xx++) put(xx, top - 1, row.edge); const cx = x + 2 + Math.floor(R2() * (w - 5)); for (let yy = top - 5; yy < top; yy++) { put(cx, yy, row.edge); put(cx + 1, yy, row.roof); put(cx + 2, yy, row.edge); } }  // toit plat, cheminée
        else for (let k = 0; k < 3; k++) for (let xx = x + k; xx < x + w - k; xx++) put(xx, top - 1 - k, k === 2 || xx === x + k || xx === x + w - k - 1 ? row.edge : row.roof);  // toit en croupe
        for (let yy = top + 3; yy < row.base + 20 && yy < H - 2; yy += 5) for (let xx = x + 2; xx < x + w - 3; xx += 4) {
          const on = R2() < row.lit && (Math.floor(xx * 3 + yy * 7 + tw / 9) % 23) !== 0;  // de temps en temps, une lumière s'éteint
          const a = on ? hex(C.l) : row.edge, b2 = on ? hex(C.o) : row.edge; put(xx, yy, a); put(xx + 1, yy, b2); put(xx, yy + 1, b2); put(xx + 1, yy + 1, b2);
        }
        x += w;
      }
    }
    // la tour de l'horloge, au milieu : briques, créneaux, toit pointu, cadran éclairé
    const tx = Math.floor(W / 2), tw2 = 18, ttop = Math.floor(H * .3), tk = hex(C.k), tD = hex(C.D), td = hex(C.d);
    for (let yy = ttop; yy < H; yy++) for (let xx = tx - tw2 / 2; xx < tx + tw2 / 2; xx++) { const e = xx === tx - tw2 / 2 || xx === tx + tw2 / 2 - 1; put(xx, yy, e ? tk : ((yy - ttop) % 4 === 0 || (xx + ((yy - ttop) >> 2) * 2) % 6 === 0) ? td : tD); }
    for (let xx = tx - tw2 / 2 - 1; xx <= tx + tw2 / 2; xx++) { put(xx, ttop, tk); if (((xx - tx) & 3) < 2) { put(xx, ttop - 1, tk); put(xx, ttop - 2, tk); } }
    for (let k = 0; k < 14; k++) for (let xx = tx - tw2 / 2 + 1 + Math.floor(k / 2); xx < tx + tw2 / 2 - 1 - Math.floor(k / 2); xx++) put(xx, ttop - 3 - k, xx === tx - tw2 / 2 + 1 + Math.floor(k / 2) ? tk : tD);
    for (let y = -6; y <= 6; y++) for (let xx = -6; xx <= 6; xx++) { const r = Math.hypot(xx, y); if (r <= 6) put(tx + xx, ttop + 10 + y, r > 5 ? hex(C.Y) : hex(C.p)); }
    put(tx, ttop + 10, tk); put(tx, ttop + 7, tk); put(tx, ttop + 8, tk); put(tx + 1, ttop + 10, tk); put(tx + 2, ttop + 10, tk);
    g.putImageData(img, 0, 0);
  }
  const skyTimer = setInterval(() => sky.isConnected ? drawSky() : clearInterval(skyTimer), 700);
  addEventListener('resize', () => drawSky());

  const D = [
    { id: 'marche', name: 'Le Marché', who: 'brindille', whoName: 'Mme Brindille, boulangère', blurb: 'Sous les auvents, les marchands ont toujours une question en réserve.' },
    { id: 'port', name: 'Le Port', who: 'octave', whoName: 'Octave, le passeur', blurb: 'Les quais sentent le sel et les cordages. Octave n\'aide que ceux qui réfléchissent.' },
    { id: 'tour', name: 'La Tour de l\'Horloge', who: 'yse', whoName: 'Ysé, l\'archiviste', blurb: 'Tout en haut, les rouages attendent. Ysé garde les clés et les dernières énigmes.' },
    { id: 'jardins', name: 'Les Jardins suspendus', who: 'capucine', whoName: 'Capucine, la jardinière', blurb: 'Des terrasses de fleurs accrochées aux remparts. Capucine taille ses haies en casse-tête.' },
    { id: 'thermes', name: 'Les Thermes', who: 'hector', whoName: 'Hector, le maître des bains', blurb: 'Vapeur, vasques et tuyaux de cuivre. Hector mesure tout, à la goutte près.' },
    { id: 'mines', name: 'Les Mines de cuivre', who: 'gaspard', whoName: 'Gaspard, le mineur', blurb: 'Sous la ville, des galeries à perte de vue. Gaspard connaît chaque wagonnet.' },
    { id: 'theatre', name: 'Le Théâtre des automates', who: 'lyre', whoName: 'Madame Lyre, l\'automate', blurb: 'Les marionnettes de cuivre jouent toutes les nuits. Leur directrice adore les énigmes de logique.' },
    { id: 'observatoire', name: 'L\'Observatoire', who: 'selene', whoName: 'Sélène, l\'astronome', blurb: 'Au sommet de la colline, la lunette regarde les étoiles. Sélène y garde le tout dernier rouage.' },
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
  // <enigmes>
  // les dessins des 30 premières énigmes
  [
    [['bread', 22, 24], ['brioche', 66, 24], ['#1,10 E', 48, 8]],
    [['basket', 12, 28], ['basket', 54, 28], ['basket', 96, 28], ['apple', 14, 16], ['pear', 56, 13], ['apple', 98, 16], ['pear', 106, 13]],
    [['person', 4, 26, 11, 10], ['personr', 64, 26], ['#LOU', 61, 16]],
    [['egg', 30, 30, 3, 9], ['jug', 64, 24], ['clock', 100, 20, 10, '12:04']],
    [['sock', 16, 22, 3, 11], ['sockb', 66, 22, 3, 11]],
    [['persong', 40, 26], ['personr', 64, 26], ['#?', 56, 10]],
    [['lamp', 14, 22, 5, 21]],
    [['coin', 18, 30, 9, 9], ['#1 PLUS LOURDE', 34, 10]],
    [['person', 6, 26], ['personr', 26, 26], ['persong', 46, 26], ['personv', 66, 26], ['persony', 86, 26], ['person', 106, 26]],
    [['croissant', 6, 30, 8, 14], ['#22', 54, 10]],
    [['crate', 10, 26, 4, 12], ['boat', 82, 26]],
    [['boat', 50, 26], ['cat', 10, 24], ['mouse', 28, 28], ['cheese', 100, 26]],
    [['snail', 46, 32], ['bucket', 84, 26], ['#10 M', 10, 10]],
    [['boat', 12, 26], ['boat', 88, 26], ['clock', 60, 16, 10, '9:00']],
    [['lighthouse', 54, 12], ['#3 ECLAIRS', 72, 6]],
    [['fish', 14, 30, 3, 34], ['rope', 52, 12]],
    [['bottle', 56, 26], ['#QIBSF', 48, 8]],
    [['personr', 18, 24], ['persong', 54, 24], ['personv', 90, 24], ['fish', 68, 36]],
    [['crate', 54, 26], ['#10 KG + ?', 40, 8]],
    [['boat', 34, 22], ['ladder', 60, 26]],
    [['clock', 60, 22, 18, '3:15']],
    [['clock', 34, 22, 16, '12:00'], ['clock', 86, 22, 16, '1:05']],
    [['book', 14, 26], ['#2 3 5 9 17 ?', 36, 16]],
    [['gear', 16, 22, 8], ['gear', 37, 22, 8], ['gear', 58, 22, 8], ['gear', 79, 22, 8], ['gear', 100, 22, 8]],
    [['bell', 26, 20], ['bell', 84, 20], ['clock', 60, 24, 12, '12:30']],
    [['ladder', 52, 6], ['ladder', 52, 18], ['person', 70, 30]],
    [['gear', 44, 22, 14], ['gear', 72, 26, 6]],
    [['padlock', 56, 24], ['candle', 34, 28], ['candle', 82, 28]],
    [['candle', 30, 28], ['padlock', 56, 24], ['candle', 84, 28], ['#?', 58, 10]],
    [['gear', 28, 22, 12], ['gear', 58, 22, 9], ['gear', 82, 22, 6]],
  ].forEach((sc, i) => { P[i].sc = sc; });

  P.push(
    // le Marché, suite
    { d: 'marche', t: 'Les allumettes du boulanger', pts: 30, type: 'match', eq: '6+4=4', moves: 1, k: 'Astuce', sc: [['bread', 50, 30]], q: 'Mme Brindille a écrit son calcul avec des allumettes… et il est faux.\n\nDéplace UNE seule allumette pour que l\'égalité soit juste.\nTouche une allumette pour la prendre, puis une place vide pour la poser.', hints: ['Le « + » et le « = » peuvent rester tels quels.', 'Regarde le 6 : il suffit de déplacer sa barre du milieu.'], why: 'La barre du milieu du 6 monte en haut à droite : 0 + 4 = 4.' },
    { d: 'marche', t: 'Le calcul du fromager', pts: 35, type: 'match', eq: '5+7=2', moves: 1, k: 'Astuce', sc: [['cheese', 54, 28]], q: 'Sur l\'ardoise du fromager : 5 + 7 = 2. Impossible !\n\nDéplace UNE allumette pour que le calcul devienne juste.', hints: ['Un « + » privé de sa barre debout devient un « − ».', 'Où poser cette barre ? Sur le 5.'], why: 'La barre debout du « + » va compléter le 5 en 9 : 9 − 7 = 2.' },
    { d: 'marche', t: 'La file chez le fromager', pts: 35, type: 'order', items: [['persong', 'Didier'], ['personr', 'Anna'], ['person', 'Basile'], ['personv', 'Chloé']], start: [2, 0, 3, 1], a: [0, 1, 2, 3], k: 'Déduction', q: 'Quatre clients attendent chez le fromager.\n• Anna est juste devant Basile.\n• Chloé est quelque part derrière Basile.\n• Didier n\'est pas le dernier, et il n\'est pas juste derrière Basile.\n\nRange-les du premier (à gauche) au dernier. Touche deux clients pour les échanger.', hints: ['Anna et Basile se suivent : où peut se placer ce duo ?', 'Si Anna et Basile sont en tête, Didier serait soit juste derrière Basile, soit dernier.'], why: 'Didier, Anna, Basile, Chloé : c\'est la seule file qui respecte les trois phrases.' },
    { d: 'marche', t: 'Les cagettes', pts: 40, type: 'latin', size: 4, box: [2, 2], syms: ['apple', 'egg', 'coin', 'cheese'], given: ['....', '.41.', '2..3', '....'], k: 'Logique', q: 'Le marchand range ses cagettes : une pomme, un œuf, une pièce et un fromage.\n\nChaque ligne, chaque colonne et chaque carré de 2 × 2 doit contenir les quatre, une fois chacun. Touche une case vide pour changer ce qu\'elle contient.', hints: ['Deuxième ligne : il manque l\'œuf et la pièce… et la colonne de gauche a déjà un œuf plus bas.', 'Commence par la case qui n\'a plus qu\'une seule possibilité, puis recommence.'], why: 'Ligne par ligne : pomme œuf pièce fromage / pièce fromage pomme œuf / œuf pomme fromage pièce / fromage pièce œuf pomme.' },
    { d: 'marche', t: 'L\'enseigne effacée', pts: 40, type: 'picross', pic: ['...GG...', '....G...', '.rrrrrr.', 'rwrrrrrr', 'rrrrrrrR', 'rrrrrrRR', '.rrrrRR.', '..rrRR..'], k: 'Logique', q: 'La pluie a effacé l\'enseigne du primeur. Il reste les nombres peints au bord.\n\nChaque nombre dit combien de cases noircir à la suite, dans l\'ordre, sur la ligne ou la colonne. Noircis les cases (bouton MODE pour poser des croix sur les cases vides).', hints: ['Une ligne marquée « 8 » est entièrement noire.', 'Commence par les plus grands nombres.'], why: 'C\'était une pomme bien rouge : l\'enseigne du primeur.' },
    { d: 'marche', t: 'Le prix des pommes', pts: 35, type: 'num', a: 30, unit: 'centimes', sc: [['apple', 20, 26, 3, 11], ['pear', 64, 24, 2, 11], ['#1,30 E', 96, 10]], q: '3 pommes et 2 poires coûtent 1,30 €.\n2 pommes et 3 poires coûtent 1,20 €.\n\nCombien coûte une pomme, en centimes ?', hints: ['Additionne les deux achats : 5 pommes et 5 poires.', 'Une pomme et une poire coûtent donc 50 centimes ensemble.', 'Compare les deux achats : une pomme de plus et une poire de moins, ça fait 10 centimes de plus.'], why: 'Pomme + poire = 50 c, pomme − poire = 10 c : la pomme coûte 30 c, la poire 20 c.' },
    { d: 'marche', t: 'Le vase du brocanteur', pts: 30, type: 'num', a: 20, unit: '€', sc: [['jug', 54, 24], ['coin', 20, 30, 3, 8], ['coin', 84, 30, 3, 8]], q: 'Le brocanteur achète un vase 60 €, le revend 70 €, le rachète 80 € puis le revend 90 €.\n\nCombien a-t-il gagné en tout ?', hints: ['Compte l\'argent qui sort et l\'argent qui rentre.', 'Il a dépensé 60 + 80 et reçu 70 + 90.'], why: 'Il a reçu 160 € et dépensé 140 € : 20 € de bénéfice.' },
    { d: 'marche', t: 'La balance de l\'épicier', pts: 30, type: 'choice', opts: ['6 pommes', '8 pommes', '12 pommes', '18 pommes'], a: 2, sc: [['cheese', 20, 28], ['#=', 34, 30], ['pear', 40, 26, 2, 11], ['pear', 76, 26], ['#=', 88, 30], ['apple', 94, 28, 2, 11]], q: 'Sur la balance de l\'épicier :\n• un fromage pèse autant que 2 poires ;\n• une poire pèse autant que 3 pommes.\n\nCombien de pommes faut-il pour équilibrer 2 fromages ?', hints: ['Remplace d\'abord les fromages par des poires.'], why: '2 fromages = 4 poires = 4 × 3 = 12 pommes.' },
    { d: 'marche', t: 'Le coffre du changeur', pts: 50, type: 'lock', a: '042', sc: [['box', 54, 30], ['coin', 30, 32, 2, 8], ['coin', 74, 32, 2, 8]], q: 'Le coffre du changeur s\'ouvre avec trois chiffres. Il a laissé ces notes :\n• 682 : un chiffre est bon et bien placé.\n• 614 : un chiffre est bon mais mal placé.\n• 206 : deux chiffres sont bons mais mal placés.\n• 738 : aucun chiffre n\'est bon.\n• 870 : un chiffre est bon mais mal placé.', hints: ['738 ne contient rien de bon : oublie le 7, le 3 et le 8.', '870 n\'a donc que le 0 de bon, et il n\'est pas au dernier rang.', 'Compare 682 et 614 : le 6 ne peut pas être à la fois bien et mal placé.'], why: 'Le 6 et le 8 sont exclus : le 2 est bon et bien placé au dernier rang (682). 614 donne le 4, mal placé ; 206 confirme le 2 et le 0. Le code est 042.' },
    { d: 'marche', t: 'La douzaine d\'œufs', pts: 25, type: 'pick', bg: 'marche', a: 1, k: 'Observation', opts: [[[['egg', 3, 3, 4, 7], ['egg', 6, 12, 3, 8], ['egg', 3, 21, 3, 9]], 'A'], [[['egg', 2, 3, 4, 9], ['egg', 5, 12, 4, 8], ['egg', 3, 21, 4, 9]], 'B'], [[['egg', 3, 3, 5, 7], ['egg', 2, 12, 4, 9], ['egg', 5, 21, 4, 7]], 'C'], [[['egg', 2, 3, 6, 6], ['egg', 4, 12, 5, 6]], 'D']], q: 'La fermière livre ses œufs dans quatre paniers. Un seul contient exactement une douzaine d\'œufs.\n\nLequel ?', hints: ['Une douzaine, c\'est 12.', 'Compte ligne par ligne.'], why: 'Le panier B : 4 + 4 + 4 = 12 œufs. A en a 10, C en a 13, D en a 11.' },
    // le Port, suite
    { d: 'port', t: 'Le chat, le canard et le grain', pts: 40, type: 'river', ferry: true, cap: 1, max: 7, items: [['chat', 'cat', 'le chat'], ['canard', 'duck', 'le canard'], ['sac', 'sack', 'le sac de grain']], bad: [['chat', 'canard', 'Laissé seul, le chat a croqué le canard !'], ['canard', 'sac', 'Laissé seul, le canard a picoré le grain !']], k: 'Manipulation', q: 'Octave doit faire passer un chat, un canard et un sac de grain. Sa barque n\'emporte qu\'un passager avec lui.\nSans lui, le chat croque le canard, et le canard picore le grain.\n\nTouche un passager pour le faire monter ou descendre, puis TRAVERSER.', hints: ['Le canard ne peut rester avec personne.', 'On a le droit de ramener quelqu\'un sur la première rive.'], why: 'Canard, retour seul, chat, retour avec le canard, sac, retour seul, canard : 7 traversées.' },
    { d: 'port', t: 'La famille du passeur', pts: 50, type: 'river', ferry: false, cap: 2, maxW: 80, max: 9, items: [['pere', 'person', 'le père', 80], ['mere', 'personr', 'la mère', 80], ['fils', 'persong', 'le fils', 40], ['fille', 'personv', 'la fille', 40]], k: 'Manipulation', q: 'Une famille doit traverser sans Octave : le père (80 kg), la mère (80 kg), le fils et la fille (40 kg chacun).\nLa barque porte 80 kg au plus, et il faut toujours quelqu\'un pour ramer.\n\nFais passer tout le monde en 9 traversées au plus.', hints: ['Les enfants peuvent traverser ensemble.', 'Un enfant doit toujours ramener la barque.'], why: 'Les enfants passent, un revient ; le père passe, l\'autre enfant revient ; les enfants repassent, un revient ; la mère passe, l\'enfant revient ; les enfants passent : 9 traversées.' },
    { d: 'port', t: 'Les deux seaux', pts: 35, type: 'jugs', caps: [5, 3], start: [0, 0], goal: 4, tap: true, k: 'Manipulation', q: 'Octave doit rapporter exactement 4 litres d\'eau douce. Il n\'a qu\'un seau de 5 litres et un de 3 litres, sans graduation, et la fontaine.\n\nRemplis, vide et verse jusqu\'à avoir 4 litres dans un seau.', hints: ['Remplis le grand seau et verse-le dans le petit.', 'Il reste 2 litres dans le grand : garde-les précieusement.'], why: '5 → 3 (reste 2), vide le 3, verse les 2 dedans, remplis le 5 et complète le 3 : il reste 4 litres.' },
    { d: 'port', t: 'Le partage du cidre', pts: 45, type: 'jugs', caps: [8, 5, 3], start: [8, 0, 0], goalAll: [4, 4, 0], k: 'Manipulation', q: 'Deux marins veulent partager équitablement un tonnelet de 8 litres de cidre. Ils n\'ont qu\'un pot de 5 litres et un de 3 litres.\n\nFais-en deux parts de 4 litres (le pot de 3 doit finir vide). Touche le récipient à verser, puis celui où verser.', hints: ['Verse le tonnelet dans le pot de 5, puis le 5 dans le 3.', 'Remets les 3 litres dans le tonnelet et recommence.'], why: '8→5, 5→3, 3→8, 5→3, 8→5, 5→3, 3→8 : 4 et 4.' },
    { d: 'port', t: 'Les ruelles du port', pts: 40, type: 'maze', tiles: 'stone', maze: ['#############', '#S..#.....#.#', '#.#.#.###.#.#', '#.#...#k#...#', '#.#####.#.###', '#.......#...#', '###.#.#####.#', '#.....#....dE', '#############'], k: 'Manipulation', q: 'La nuit tombe sur le port. Rejoins la porte des quais (en bas à droite).\nElle est fermée : il te faut la clé, perdue quelque part dans les ruelles.', hints: ['La clé est au fond d\'une impasse.', 'Passe par le bas du dédale pour l\'atteindre.'], why: 'Il fallait faire le détour par la clé avant de rejoindre la porte.' },
    { d: 'port', t: 'Les mouettes et les canards', pts: 45, type: 'frogs', row: 'RRR.BBB', sprR: 'bird', sprB: 'duck', k: 'Manipulation', q: 'Sur le ponton, trois mouettes à gauche, trois canards à droite, une planche libre au milieu. Chacun veut passer de l\'autre côté.\n\nUn oiseau avance seulement vers l\'autre bord : d\'une planche s\'il y a de la place, ou en sautant par-dessus UN voisin. On ne recule jamais.', hints: ['Évite que deux oiseaux de la même espèce se retrouvent collés devant un trou.', 'Alterne : un pas, un saut, un saut…'], why: 'En alternant les espèces à chaque coup, il faut 15 déplacements.' },
    { d: 'port', t: 'Les cordages', pts: 25, type: 'num', a: 9, unit: 'minutes', sc: [['rope', 20, 22], ['rope', 46, 22], ['rope', 72, 22], ['#30 M', 96, 10]], q: 'Octave coupe une corde de 30 mètres en morceaux de 3 mètres. Chaque coupe lui prend 1 minute.\n\nCombien de minutes lui faut-il ?', hints: ['Combien de morceaux ? Et combien de coupes pour les obtenir ?'], why: '10 morceaux, mais seulement 9 coupes : le dernier morceau est déjà là.' },
    { d: 'port', t: 'Le courant du fleuve', pts: 30, type: 'num', a: 2, unit: 'km/h', sc: [['boat', 20, 26], ['arrow', 50, 30], ['boat', 84, 26, 1, 0, true]], q: 'La barque descend le fleuve à 12 km/h, aidée par le courant. Elle le remonte à 8 km/h, freinée par lui.\n\nQuelle est la vitesse du courant ?', hints: ['La vitesse de la barque seule est au milieu, entre 8 et 12.'], why: 'La barque va à 10 km/h ; le courant ajoute ou enlève 2 km/h.' },
    { d: 'port', t: 'Les deux matelots', pts: 30, type: 'choice', opts: ['Jo seulement', 'Max seulement', 'Les deux', 'Aucun des deux'], a: 0, sc: [['person', 40, 26], ['persong', 70, 26], ['#JO', 39, 14], ['#MAX', 67, 14]], q: 'Chacun de ces matelots dit toujours la vérité, ou ment toujours.\nJo affirme : « Nous mentons tous les deux. »\n\nQui ment ?', hints: ['Jo peut-il dire la vérité en disant qu\'il ment ?'], why: 'Si Jo disait vrai, il mentirait : impossible. Jo ment, donc ils ne mentent pas tous les deux : Max dit la vérité.' },
    { d: 'port', t: 'Les conduites du quai', pts: 40, type: 'pipes', grid: ['2AC69', '535AC', 'A63C5', '9C538'], src: [0, 0], dst: [3, 4], seed: 11, k: 'Manipulation', q: 'Il faut de l\'eau douce au bout du quai. Tourne les tuyaux pour relier la vanne (en haut à gauche) à la vasque (en bas à droite).', hints: ['Pars de la vanne et avance tuyau par tuyau.', 'Un coude relie deux côtés voisins, un tuyau droit deux côtés opposés.'], why: 'L\'eau passe par le haut, descend au milieu puis file vers la droite jusqu\'à la vasque.' },
    // la Tour, suite
    { d: 'tour', t: 'Les poids de l\'horloge', pts: 40, type: 'hanoi', disks: 3, max: 7, k: 'Manipulation', q: 'Les trois poids de l\'horloge sont empilés sur le premier crochet. Il faut les mettre sur le dernier.\n\nOn déplace un seul poids à la fois, et jamais un poids sur un plus petit. Réussis en 7 déplacements.', hints: ['Le petit poids va d\'abord sur le dernier crochet.', 'Le gros poids ne bouge qu\'une fois.'], why: 'Petit → 3, moyen → 2, petit → 2, gros → 3, petit → 1, moyen → 3, petit → 3.' },
    { d: 'tour', t: 'Le rendez-vous d\'Ysé', pts: 30, type: 'clockset', a: '1:15', k: 'Calcul', q: 'Ysé t\'attend 2 h 45 après 10 h 30.\n\nRègle l\'horloge sur l\'heure du rendez-vous.', hints: ['10 h 30 + 2 h = 12 h 30.', 'Il reste 45 minutes à ajouter.'], why: '10 h 30 + 2 h 45 = 13 h 15, soit 1 h 15 sur le cadran.' },
    { d: 'tour', t: 'L\'horloge qui retarde', pts: 35, type: 'clockset', a: '5:30', k: 'Calcul', q: 'Une vieille horloge prend 5 minutes de retard chaque heure. On l\'a mise à l\'heure à midi pile.\n\nIl est maintenant 18 h. Règle l\'horloge sur ce qu\'elle affiche.', hints: ['Combien d\'heures se sont écoulées depuis midi ?'], why: '6 heures × 5 minutes = 30 minutes de retard : elle affiche 17 h 30.' },
    { d: 'tour', t: 'Le coffre des archives', pts: 45, type: 'lock', a: '4652', q: 'Le coffre d\'Ysé a un code de quatre chiffres, tous différents :\n• le premier est le double du dernier ;\n• le deuxième est la somme du premier et du dernier ;\n• le troisième vaut un de moins que le deuxième ;\n• les quatre chiffres font 17 en tout.', hints: ['Appelle d le dernier chiffre : le premier vaut 2d, le deuxième 3d.', 'Le troisième vaut 3d − 1. Additionne tout.'], why: '2d + 3d + (3d − 1) + d = 9d − 1 = 17, donc d = 2 : le code est 4652.' },
    { d: 'tour', t: 'Les six veilleurs', pts: 50, type: 'queens', size: 6, piece: 'dame', count: 6, k: 'Logique', q: 'Six veilleurs gardent la salle des rouages, dallée de 6 × 6. Chacun surveille sa ligne, sa colonne et ses deux diagonales, aussi loin qu\'il voit.\n\nPlace les six veilleurs sans qu\'aucun n\'en surveille un autre.', hints: ['Un veilleur par ligne et par colonne.', 'Sur la première ligne, essaie la deuxième case.'], why: 'Par exemple : colonnes 2, 4, 6, 1, 3, 5 de haut en bas. Aucun veilleur ne partage ligne, colonne ou diagonale.' },
    { d: 'tour', t: 'L\'enveloppe du vitrier', pts: 35, type: 'oneline', bg: 'tour', nodes: [[20, 54], [76, 54], [20, 30], [76, 30], [48, 8]], edges: [[0, 1], [0, 2], [1, 3], [2, 3], [2, 1], [3, 0], [2, 4], [3, 4]], k: 'Astuce', q: 'Le vitrier doit poser le plomb de ce vitrail d\'un seul geste : passer par chaque trait une seule fois, sans jamais repasser.\n\nTouche le point de départ, puis les points un à un.', hints: ['Compte combien de traits partent de chaque point.', 'Il faut partir d\'un des deux points du bas.'], why: 'Les deux points du bas ont trois traits chacun : on part de l\'un et on finit sur l\'autre.' },
    { d: 'tour', t: 'Le vitrail brisé', pts: 35, type: 'mirror', left: ['....y', '...yr', '..yrr', '.ySrr', 'ySSrr', '.ySrr', '..yrr', '...yr'], k: 'Observation', q: 'La moitié droite du vitrail est tombée. Ysé veut la refaire exactement en miroir de la gauche.\n\nTouche une case pour changer sa couleur.', hints: ['La case juste à droite du trait rouge reflète celle juste à gauche.'], why: 'Chaque case de droite reprend la couleur de sa jumelle, à la même distance du trait.' },
    { d: 'tour', t: 'Le registre chiffré', pts: 40, type: 'latin', size: 4, box: [2, 2], given: ['43..', '.2..', '..2.', '...1'], k: 'Logique', q: 'Une page du registre d\'Ysé : une grille de 4 × 4 à compléter avec les chiffres 1, 2, 3 et 4.\n\nChaque ligne, chaque colonne et chaque carré de 2 × 2 contient chaque chiffre une fois.', hints: ['Le carré en haut à gauche a déjà 4, 3 et 2 : la case qui reste ne peut être que 1.', 'Ensuite, regarde quelle colonne interdit déjà le 2.'], why: 'La grille complète : 4 3 1 2 / 1 2 4 3 / 3 1 2 4 / 2 4 3 1.' },
    { d: 'tour', t: 'Le balancier', pts: 30, type: 'num', a: 1800, unit: 'allers-retours', sc: [['clock', 60, 16, 12, '12:00'], ['#1 S', 82, 30]], q: 'Le balancier de l\'horloge met une seconde pour un aller, et une seconde pour un retour.\n\nCombien d\'allers-retours complets fait-il en une heure ?', hints: ['Une heure, c\'est 3 600 secondes.', 'Un aller-retour dure 2 secondes.'], why: '3 600 secondes ÷ 2 = 1 800 allers-retours.' },
    { d: 'tour', t: 'Les chiffres du cadran', pts: 25, type: 'num', a: 5, unit: 'fois', sc: [['clock', 60, 22, 18, '10:10']], q: 'Le cadran de la tour porte les nombres de 1 à 12.\n\nCombien de fois le chiffre 1 y est-il peint ?', hints: ['N\'oublie pas les nombres à deux chiffres.', 'Combien de « 1 » dans 11 ?'], why: '1, 10, 11 (deux fois) et 12 : cinq fois.' },
  );
  P.push(
    // les Jardins suspendus (Capucine)
    { d: 'jardins', t: 'La fleur de Capucine', pts: 30, type: 'picross', pic: ['...jjj...', '.jjjjjjj.', '.jjjyjjj.', 'jjjyyyjjj', '.jjjyjjj.', '.jjjjjjj.', '...jjj...', '....G.gg.', '.gg.G.g..', '..g.G....'], k: 'Logique', q: 'Capucine a caché le plan de son plus beau massif dans une grille.\n\nNoircis les cases : chaque nombre donne la longueur d\'un bloc de cases noires, dans l\'ordre. Le bouton MODE pose des croix sur les cases sûres d\'être vides.', hints: ['La ligne du milieu est presque entière : 9 cases d\'un coup.', 'La tige est une seule colonne, tout en bas.'], why: 'Une fleur rose au cœur jaune, avec sa tige et ses deux feuilles.' },
    { d: 'jardins', t: 'Le champignon du sous-bois', pts: 35, type: 'picross', pic: ['..rrrr..', '.rwrrwr.', 'rrrrrrrr', 'rwrrrwrr', '..wwww..', '..w..w..', '..wwww..', '.gwwwwg.'], k: 'Logique', q: 'Sous les haies pousse quelque chose de rouge à pois blancs… Dessine-le d\'après les nombres.', hints: ['La troisième ligne est entièrement noire.', 'Le pied est étroit : quatre cases au milieu.'], why: 'Un champignon rouge à pois. Joli, mais Capucine ne le mange pas !' },
    { d: 'jardins', t: 'Le papillon des roses', pts: 40, type: 'picross', pic: ['.jj....jj.', 'jjjj..jjjj', 'jyjjkkjjyj', 'jjjjkkjjjj', '.jjjkkjjj.', '..jjkkjj..', '.jj.kk.jj.', '....kk....'], k: 'Logique', q: 'Un visiteur se pose sur les roses. Révèle-le avec les nombres de la grille.', hints: ['Le corps est une colonne double, au centre.', 'Les ailes sont symétriques : ce que tu trouves à gauche vaut à droite.'], why: 'Un papillon aux ailes roses, symétrique de part et d\'autre de son corps.' },
    { d: 'jardins', t: 'Les parterres de l\'entrée', pts: 35, type: 'color', k: 4, map: ['AAABBBCC', 'ADDBBECC', 'ADDDEECF', 'GGDHEEFF', 'GGHHHIIF', 'GJJHIIIF'], q: 'Capucine plante des fleurs rouges, jaunes, bleues et vertes. Deux parterres qui se touchent par un côté ne doivent jamais avoir la même couleur.\n\nTouche un parterre pour changer sa couleur.', hints: ['Commence par le parterre qui touche le plus de voisins.', 'Si un parterre touche deux voisins de couleurs différentes, il ne lui reste qu\'une couleur.'], why: 'Avec trois couleurs bien choisies, aucun parterre ne touche son jumeau.' },
    { d: 'jardins', t: 'Le grand jardin', pts: 45, type: 'color', k: 4, map: ['AAAABBBCCC', 'ADDDBBECCC', 'ADDFFEEEGC', 'HHDFFFEGGG', 'HHIIFJJJGK', 'HLIIIJJKKK', 'LLLMMMNKKK', 'LLMMMNNNKK'], q: 'Tout le jardin est à replanter, avec quatre couleurs de fleurs. Deux massifs voisins (par un côté) ne doivent pas avoir la même couleur.', hints: ['Quatre couleurs suffisent toujours pour une carte : il n\'y a pas de piège.', 'Avance de proche en proche, sans laisser de trou derrière toi.'], why: 'Quatre couleurs suffisent pour n\'importe quelle carte : c\'est un célèbre théorème de mathématiques.' },
    { d: 'jardins', t: 'La rosace', pts: 40, type: 'color', k: 2, map: ['..AAAA..', '.ABBBBA.', 'ABBCCBBA', 'ABCDDCBA', 'ABCDDCBA', 'ABBCCBBA', '.ABBBBA.', '..AAAA..'], q: 'Au centre des jardins, une rosace de quatre anneaux. Avec seulement deux couleurs, peux-tu la fleurir sans que deux anneaux voisins se ressemblent ?', hints: ['Chaque anneau ne touche que celui de dedans et celui de dehors.', 'Alterne.'], why: 'Les anneaux alternent : rouge, jaune, rouge, jaune. Deux couleurs suffisent.' , fixed: {} },
    { d: 'jardins', t: 'Le labyrinthe de haies', pts: 35, type: 'maze', tiles: 'hedge', maze: ['###############', '#S....#.......#', '#.###.#.#####.#', '#.#...#.#...#.#', '#.#.###.#.#.#.#', '#.#...#...#.#.#', '#.###.#####.#.#', '#...#.....#...#', '###.#####.###.#', '#.......#....E#', '###############'], k: 'Manipulation', q: 'Capucine a planté un labyrinthe de haies. Trouve la sortie, en bas à droite.', hints: ['Les longs couloirs du haut ne mènent nulle part.', 'Descends tôt sur la gauche.'], why: 'Il fallait descendre par la gauche, puis traverser par le bas.' },
    { d: 'jardins', t: 'La clé du potager', pts: 45, type: 'maze', tiles: 'hedge', maze: ['#############', '#S#.....#..k#', '#.#.###.#.###', '#...#.#...#.#', '###.#.#####.#', '#...#.....#.#', '#.#####.#.#.#', '#.#...#.#...#', '#.#.#.#.#####', '#...#...d...E', '#############'], k: 'Manipulation', q: 'Le potager est fermé par une barrière. La clé est accrochée dans un coin du labyrinthe.\n\nVa la chercher, puis ouvre la barrière.', hints: ['La clé est en haut à droite.', 'Pour l\'atteindre, il faut passer par le milieu du labyrinthe.'], why: 'Clé d\'abord, barrière ensuite : la sortie était juste derrière.' },
    { d: 'jardins', t: 'Les plates-bandes', pts: 40, type: 'order', items: [['tree', 'Pommier'], ['flower', 'Rose'], ['flowerb', 'Iris'], ['pear', 'Poirier'], ['mushroom', 'Cèpe']], start: [4, 2, 0, 1, 3], a: [0, 1, 2, 3, 4], k: 'Déduction', q: 'Capucine a noté l\'ordre de sa plate-bande, de gauche à droite :\n• le pommier est contre le mur, tout à gauche ;\n• la rose est juste à côté du pommier ;\n• l\'iris est quelque part entre la rose et le cèpe ;\n• le poirier n\'est pas à côté de la rose ;\n• l\'iris n\'est pas à côté du cèpe.\n\nRemets les plantes en ordre.', hints: ['Pommier, puis rose : les deux premières places sont sûres.', 'Le poirier ne peut pas être en troisième place.'], why: 'Pommier, rose, iris, poirier, cèpe.' },
    { d: 'jardins', t: 'Le panier du goûter', pts: 30, type: 'order', items: [['cheese', 'Fromage'], ['egg', 'Œuf'], ['apple', 'Pomme'], ['pear', 'Poire']], start: [3, 0, 2, 1], a: [0, 1, 2, 3], k: 'Déduction', q: 'Range le goûter du plus léger (à gauche) au plus lourd :\n• la poire pèse plus que la pomme ;\n• le fromage pèse moins que l\'œuf ;\n• la pomme pèse plus que l\'œuf.', hints: ['Cherche qui est plus lourd que deux autres.'], why: 'Fromage, œuf, pomme, poire.' },
    { d: 'jardins', t: 'Les grenouilles de la mare', pts: 40, type: 'frogs', row: 'RRR.BBB', k: 'Manipulation', q: 'Trois grenouilles vertes et trois brunes sur des nénuphars, une feuille libre au milieu. Chaque équipe veut passer de l\'autre côté.\n\nUne grenouille avance d\'une feuille, ou saute par-dessus UNE voisine. Jamais en arrière.', hints: ['Ne bloque pas deux grenouilles de la même couleur face à face.', 'Le premier coup peut être un simple pas.'], why: 'En alternant pas et sauts, les équipes se croisent en 15 coups.' },
    { d: 'jardins', t: 'Trois contre deux', pts: 35, type: 'frogs', row: 'RRR.BB', k: 'Manipulation', q: 'Cette fois, trois grenouilles vertes contre deux brunes. Même règle : avancer d\'une feuille ou sauter par-dessus une voisine, jamais reculer.\n\nÉchange les deux équipes.', hints: ['Les brunes doivent passer assez tôt.', 'Après un saut, regarde qui peut sauter à son tour.'], why: 'Les équipes se croisent en alternant les sauts : 11 coups.' },
    { d: 'jardins', t: 'Le carré fleuri', pts: 40, type: 'latin', size: 4, box: [2, 2], syms: ['flower', 'flowerb', 'mushroom', 'apple'], given: ['12..', '.4..', '..4.', '...1'], k: 'Logique', q: 'Un carré de 16 pots : roses, iris, champignons et pommes.\n\nChaque ligne, chaque colonne et chaque carré de 2 × 2 en contient un de chaque.', hints: ['Repère le symbole qui n\'est encore nulle part dans un carré.', 'Une case qui voit déjà trois symboles différents est décidée.'], why: 'Chaque symbole une fois par ligne, colonne et carré : la grille n\'a qu\'une solution.' },
    { d: 'jardins', t: 'Les semis en rangs', pts: 50, type: 'latin', size: 5, given: ['.....', '.5.1.', '412..', '3....', '..34.'], k: 'Logique', q: 'Cinq rangs, cinq graines (de 1 à 5). Chaque rang et chaque colonne doit recevoir chaque graine une seule fois.', hints: ['Il n\'y a pas de carrés ici : seulement les lignes et les colonnes.', 'Regarde où le 1 peut encore aller dans chaque colonne.'], why: 'Une seule façon de tout semer : chaque graine une fois par rang et par colonne.' },
    { d: 'jardins', t: 'Les nénuphars', pts: 30, type: 'num', a: 29, unit: 'jours', sc: [['frog', 30, 32], ['flower', 56, 28], ['frogb', 84, 32]], q: 'Sur la mare, les nénuphars doublent de surface chaque jour. Il leur faut 30 jours pour couvrir toute la mare.\n\nAu bout de combien de jours en couvrent-ils la moitié ?', hints: ['La veille du jour où la mare est couverte…'], why: 'Ils doublent chaque jour : la veille du 30ᵉ jour, ils en couvraient la moitié. 29 jours.' },
    { d: 'jardins', t: 'L\'allée des tilleuls', pts: 25, type: 'num', a: 11, unit: 'arbres', sc: [['tree', 4, 28, 9, 13]], q: 'Capucine plante une allée de 100 mètres, avec un arbre tous les 10 mètres, un à chaque bout compris.\n\nCombien d\'arbres lui faut-il ?', hints: ['Dessine une allée de 20 m : combien d\'arbres ?'], why: '10 intervalles de 10 m, et un arbre de plus pour fermer l\'allée : 11 arbres.' },
    { d: 'jardins', t: 'Le poulailler', pts: 30, type: 'num', a: 4, unit: 'lapins', sc: [['bird', 20, 30, 3, 12], ['#10 TETES', 70, 8], ['#28 PATTES', 70, 16]], q: 'Dans la cour, des poules et des lapins. Capucine compte 10 têtes et 28 pattes.\n\nCombien y a-t-il de lapins ?', hints: ['Si tous étaient des poules, combien de pattes ?', '20 pattes : il en manque 8. Chaque lapin en ajoute 2.'], why: '4 lapins (16 pattes) et 6 poules (12 pattes) : 10 têtes et 28 pattes.' },
    { d: 'jardins', t: 'L\'arrosoir', pts: 30, type: 'num', a: 1, unit: 'kg', sc: [['can', 54, 28], ['#7 KG', 30, 10], ['#4 KG', 78, 10]], q: 'L\'arrosoir de Capucine, plein d\'eau, pèse 7 kg. À moitié plein, il pèse 4 kg.\n\nCombien pèse-t-il vide ?', hints: ['La différence entre les deux pesées, c\'est une demi-eau.'], why: 'La moitié de l\'eau pèse 3 kg, toute l\'eau 6 kg : l\'arrosoir vide pèse 1 kg.' },
    { d: 'jardins', t: 'Les escargots gourmands', pts: 35, type: 'num', a: 12, unit: 'salades', sc: [['snail', 20, 34, 3, 10], ['flower', 70, 28, 3, 10]], q: 'Trois escargots mangent trois salades en trois jours.\n\nCombien de salades mangent six escargots en six jours ?', hints: ['Un escargot mange une salade en trois jours.', 'En six jours, il en mange deux.'], why: 'Un escargot mange 2 salades en 6 jours ; six escargots en mangent 12.' },
    { d: 'jardins', t: 'Le hérisson et la tortue', pts: 45, type: 'choice', opts: ['Lundi', 'Jeudi', 'Samedi', 'Dimanche'], a: 1, sc: [['snail', 30, 34], ['#?', 58, 14], ['frogb', 80, 32]], q: 'Le hérisson ment le lundi, le mardi et le mercredi, et dit vrai les autres jours.\nLa tortue ment le jeudi, le vendredi et le samedi, et dit vrai les autres jours.\n\nUn jour, tous les deux disent : « Hier, je mentais. »\nQuel jour sommes-nous ?', hints: ['Le hérisson ne peut le dire que le lundi ou le jeudi.', 'Et la tortue ?'], why: 'Le hérisson le dit le lundi (il ment) ou le jeudi (il dit vrai). La tortue le dit le jeudi (elle ment) ou le dimanche. Le seul jour commun : jeudi.' },
    { d: 'jardins', t: 'Les roses rouges', pts: 30, type: 'choice', opts: ['Oui, forcément', 'Non, forcément pas', 'On ne peut pas savoir'], a: 2, sc: [['flower', 30, 28, 3, 10], ['flowerb', 80, 28, 2, 10]], q: 'Toutes les roses du jardin sont rouges.\nCertaines fleurs rouges fanent vite.\n\nPeut-on dire que certaines roses fanent vite ?', hints: ['Les fleurs rouges qui fanent vite sont-elles forcément des roses ?'], why: 'Les fleurs rouges qui fanent vite peuvent être des tulipes ou des coquelicots : on ne peut rien dire des roses.' },
    { d: 'jardins', t: 'La haie à tailler', pts: 30, type: 'choice', opts: ['3 heures', '4 heures', '6 heures', '8 heures'], a: 1, sc: [['personr', 30, 26], ['tree', 54, 22], ['person', 84, 26]], q: 'Capucine taille 8 mètres de haie en 4 heures. Son apprenti va deux fois moins vite.\n\nEnsemble, combien de temps pour 12 mètres de haie ?', hints: ['Capucine taille 2 mètres par heure. Et l\'apprenti ?'], why: 'Ensemble, 2 + 1 = 3 mètres par heure : 12 mètres en 4 heures.' },
    { d: 'jardins', t: 'Le papillon de la serre', pts: 30, type: 'mirror', left: ['jj...', 'jjjj.', 'jyjjk', 'jjjjk', '.jjjk', '..jjk', '.jj.k', '....k'], k: 'Observation', q: 'Il ne reste que la moitié du papillon sur la vitre de la serre.\n\nComplète l\'autre aile, exactement en miroir.', hints: ['Le corps noir touche le trait du milieu.'], why: 'Une aile identique, retournée comme dans un miroir.' },
    { d: 'jardins', t: 'Le bouquet équilibré', pts: 25, type: 'pick', bg: 'jardins', a: 1, k: 'Observation', opts: [[[['flower', 2, 2], ['flowerb', 11, 2], ['flower', 20, 2], ['flowerb', 8, 16], ['flower', 17, 16]], 'A'], [[['flowerb', 2, 2], ['flower', 11, 2], ['flowerb', 20, 2], ['flower', 29, 2], ['flower', 6, 16], ['flowerb', 15, 16]], 'B'], [[['flower', 2, 2], ['flowerb', 11, 2], ['flowerb', 20, 2], ['flower', 8, 16], ['flowerb', 17, 16]], 'C'], [[['flower', 2, 2], ['flower', 11, 2], ['flowerb', 20, 2], ['flower', 29, 2], ['flowerb', 6, 16], ['flower', 15, 16], ['flowerb', 24, 16]], 'D']], q: 'Une cliente veut un bouquet avec AUTANT de fleurs roses que de fleurs violettes.\n\nLequel lui donner ?', hints: ['Compte les roses, puis les violettes, dans chaque bouquet.'], why: 'Le bouquet B : 3 roses et 3 violettes. A : 3 et 2, C : 2 et 3, D : 4 et 3.' },
  );
  P.push(
    // les Thermes (Hector)
    { d: 'thermes', t: 'La source tiède', pts: 35, type: 'jugs', caps: [9, 4], start: [0, 0], goal: 6, tap: true, k: 'Manipulation', q: 'Hector doit verser exactement 6 litres d\'eau de source dans le bain de pieds. Il n\'a qu\'une cruche de 9 litres et une de 4 litres, sans graduation.\n\nRemplis, vide et verse jusqu\'à avoir 6 litres dans une cruche.', hints: ['Remplis la grande, puis vide-la deux fois dans la petite.', 'Il reste 1 litre : garde-le dans la petite cruche.'], why: '9 − 4 − 4 = 1 litre, posé dans la petite. On remplit la grande et on complète la petite : 9 − 3 = 6 litres.' },
    { d: 'thermes', t: 'Le partage des sels', pts: 50, type: 'jugs', caps: [12, 7, 5], start: [12, 0, 0], goalAll: [6, 6, 0], k: 'Manipulation', q: 'Douze litres d\'eau salée, une jarre de 12 litres, une de 7 et une de 5. Pas de fontaine ici : on ne peut que verser d\'une jarre à l\'autre.\n\nPartage l\'eau en deux moitiés de 6 litres, dans la grande et dans la moyenne.', hints: ['Commence par remplir la petite jarre.', 'La petite sert de mesure : remplis-la, vide-la dans la moyenne, recommence.'], why: 'En faisant tourner l\'eau grande → petite → moyenne, on finit par isoler 6 litres dans la grande et 6 dans la moyenne.' },
    { d: 'thermes', t: 'Le bain de vapeur', pts: 35, type: 'jugs', caps: [7, 3], start: [0, 0], goal: 5, tap: true, k: 'Manipulation', q: 'Pour la pierre chaude, il faut verser exactement 5 litres d\'eau. Hector a un seau de 7 litres et un de 3 litres.\n\nObtiens 5 litres dans un seau.', hints: ['Remplis le petit seau trois fois de suite, en vidant dans le grand.', 'Quand le grand est plein, ce qui reste dans le petit compte.'], why: '3 + 3 = 6 dans le grand, le troisième petit seau n\'y met qu\'un litre : il en reste 2. Vide le grand, verse les 2, ajoute 3 : 5 litres.' },
    { d: 'thermes', t: 'Les trois amphores', pts: 50, type: 'jugs', caps: [10, 7, 3], start: [10, 0, 0], goalAll: [5, 5, 0], k: 'Manipulation', q: 'Une amphore de 10 litres pleine d\'huile de massage, et deux vides : 7 litres et 3 litres.\n\nPartage l\'huile en deux parts de 5 litres, dans la grande et la moyenne, sans rien jeter.', hints: ['La petite amphore fait des allers-retours vers la moyenne.', 'Quand la moyenne est pleine, reverse-la dans la grande.'], why: 'On fait passer l\'huile de la petite vers la moyenne, en reversant la moyenne dans la grande quand elle déborde : 5 et 5.' },
    { d: 'thermes', t: 'Les canalisations chaudes', pts: 35, type: 'pipes', grid: ['2AC65', '535AC', '963AC', '3A961'], src: [0, 0], dst: [3, 4], seed: 21, k: 'Manipulation', q: 'Le grand bassin est froid ! Tourne les tuyaux pour relier la chaudière (en haut à gauche) à la bouche du bassin (en bas à droite).', hints: ['Depuis la chaudière, l\'eau part vers la droite.', 'Le chemin descend au milieu, puis repart à droite.'], why: 'L\'eau file à droite, descend par la colonne du milieu, repart à droite et tombe dans le bassin.' },
    { d: 'thermes', t: 'Le serpentin', pts: 45, type: 'pipes', grid: ['4C6AAC', '535695', '3A95C5', '6A96A9', '3C53A8'], src: [0, 0], dst: [4, 5], seed: 5, k: 'Manipulation', q: 'Le serpentin chauffe l\'eau en la faisant beaucoup tourner. Relie la chaudière (en haut à gauche) à la sortie (en bas à droite).', hints: ['L\'eau descend d\'abord, puis remonte au milieu.', 'Elle fait tout le tour par la droite avant de redescendre.'], why: 'Un long serpentin : il descend, remonte, longe le haut, redescend à droite et finit en bas.' },
    { d: 'thermes', t: 'La salle des vannes', pts: 45, type: 'pipes', grid: ['6E6AC', '7C5B5', '2A965', '3DA55', '962A9'], src: [2, 0], dst: [4, 2], seed: 9, k: 'Manipulation', q: 'Cette fois, la vanne est au milieu à gauche, et la vasque en bas au milieu. Attention aux tuyaux à trois bouches : ils peuvent tromper.', hints: ['L\'eau monte d\'abord vers le haut.', 'Elle fait le tour par la droite et revient par le bas.'], why: 'L\'eau monte au milieu, longe le haut vers la droite, descend tout le bord et revient vers la vasque.' },
    { d: 'thermes', t: 'Le grand circuit', pts: 55, type: 'pipes', grid: ['6AC6A8', '56953C', '6AA955', '53EC96', '3AAAC5', '3A9638'], src: [0, 5], dst: [5, 5], seed: 31, k: 'Manipulation', q: 'Le circuit complet des Thermes ! La chaudière est en haut à droite, le grand bain en bas à droite. L\'eau doit faire un long détour par la gauche.', hints: ['Depuis la chaudière, l\'eau part vers la gauche.', 'Elle descend tout le bord gauche avant de revenir.'], why: 'Gauche, descente, gauche toute, descente le long du bord, puis une longue ligne droite vers le grand bain.' },
    { d: 'thermes', t: 'Les lampes du hammam', pts: 35, type: 'lights', seed: [4], q: 'Dans le hammam, les neuf lampes doivent briller. Toucher une lampe change son état et celui de ses voisines du haut, du bas, de gauche et de droite.\n\nAllume les neuf lampes.', hints: ['Il suffit d\'une seule touche.', 'Celle qui a le plus de voisines…'], why: 'Une seule touche au centre : elle rallume la croix qui s\'était éteinte.' },
    { d: 'thermes', t: 'Les veilleuses', pts: 45, type: 'lights', seed: [0, 2, 6, 8], q: 'Les veilleuses de la salle de repos sont en désordre. Même règle : toucher une veilleuse change aussi ses voisines directes.\n\nAllume les neuf.', hints: ['Les coins seuls ne suffisent pas.', 'Toucher deux fois la même veilleuse ne sert à rien.'], why: 'Toucher les quatre coins rétablit tout : chaque coin éteint par erreur est rallumé par sa propre touche.' },
    { d: 'thermes', t: 'Les deux robinets', pts: 30, type: 'num', a: 12, unit: 'minutes', sc: [['valve', 30, 22], ['bucket', 54, 30], ['valve', 78, 22, 1, 0, 1]], q: 'Le robinet d\'eau chaude remplit la baignoire en 20 minutes. Le robinet d\'eau froide la remplit en 30 minutes.\n\nSi Hector ouvre les deux en même temps, combien de minutes pour la remplir ?', hints: ['En une minute, quelle part de baignoire remplit chaque robinet ?', '1/20 + 1/30 = ?'], why: 'En une minute : 3/60 + 2/60 = 5/60 = 1/12 de baignoire. Il faut 12 minutes.' },
    { d: 'thermes', t: 'Les serviettes au soleil', pts: 25, type: 'num', a: 1, unit: 'heure', sc: [['#SOLEIL', 6, 6], ['sun', 14, 14], ['scroll', 50, 28, 3, 14]], q: 'Hector étend 5 serviettes sur la terrasse : elles sèchent en 1 heure.\n\nCombien de temps pour faire sécher 10 serviettes, s\'il y a assez de place pour toutes les étendre ?', hints: ['Les serviettes sèchent-elles chacune leur tour ?'], why: 'Elles sèchent toutes en même temps : 1 heure, qu\'il y en ait 5 ou 10.' },
    { d: 'thermes', t: 'Les tickets de bain', pts: 40, type: 'num', a: 14, unit: 'bains', sc: [['ticket', 20, 30, 4, 12], ['#3 = 1', 76, 20]], q: 'Hector offre une promotion : trois tickets usagés s\'échangent contre un ticket neuf.\n\nLéon achète 10 tickets. Combien de bains pourra-t-il prendre en tout, au plus ?', hints: ['10 bains, 10 tickets usagés : combien de tickets neufs ?', 'N\'oublie pas les tickets neufs, une fois usagés à leur tour.'], why: '10 bains → 10 usagés → 3 neufs (reste 1). 3 bains → 4 usagés → 1 neuf (reste 1). 1 bain → 2 usagés : plus d\'échange. 10 + 3 + 1 = 14 bains.' },
    { d: 'thermes', t: 'Le mélange parfait', pts: 40, type: 'num', a: 50, unit: 'degrés', sc: [['jug', 30, 28], ['#80', 26, 16, 'r'], ['jug', 78, 28, 2, 8], ['#35', 80, 16, 'S']], q: 'Hector verse 10 litres d\'eau à 80 degrés et 20 litres d\'eau à 35 degrés dans le même bassin.\n\nQuelle est la température du bain ?', hints: ['C\'est une moyenne, mais pas une moyenne simple : il y a deux fois plus d\'eau à 35.', '(10 × 80 + 20 × 35) ÷ 30'], why: '(800 + 700) ÷ 30 = 1500 ÷ 30 = 50 degrés.' },
    { d: 'thermes', t: 'Les canards en caoutchouc', pts: 25, type: 'num', a: 3, unit: 'canards', sc: [['duck', 26, 32], ['duck', 50, 32], ['duck', 74, 32]], q: 'Dans le bassin des enfants, il y a :\n• deux canards devant un canard,\n• deux canards derrière un canard,\n• et un canard au milieu.\n\nCombien de canards, au minimum ?', hints: ['Mets-les en file, et relis chaque phrase.'], why: 'Trois canards en file : les deux premiers sont devant le dernier, les deux derniers derrière le premier, et celui du milieu… au milieu.' },
    { d: 'thermes', t: 'Les bulles', pts: 25, type: 'num', a: 8, unit: 'bulles', sc: [['#1', 14, 18], ['#2', 40, 18], ['#4', 66, 18], ['#?', 92, 18]], q: 'Dans le bain moussant, chaque bulle se coupe en deux toutes les minutes.\n\nHector souffle une seule bulle. Combien y en a-t-il au bout de 3 minutes ?', hints: ['Une, puis deux, puis…'], why: '1 → 2 → 4 → 8 : chaque minute double le nombre de bulles.' },
    { d: 'thermes', t: 'Les trois casiers', pts: 40, type: 'choice', opts: ['Le casier d\'or', 'Le casier d\'argent', 'Le casier de bronze'], a: 1, sc: [['box', 24, 28], ['box', 54, 28], ['box', 84, 28], ['#OR', 20, 12, 'y'], ['#ARGENT', 42, 12, 'W'], ['#BRONZE', 74, 12, 'o']], q: 'La clé du coffre est dans l\'un des trois casiers. Sur chacun, une étiquette. UNE SEULE dit vrai.\n• Or : « La clé est ici. »\n• Argent : « La clé n\'est pas ici. »\n• Bronze : « La clé n\'est pas dans le casier d\'or. »\n\nOù est la clé ?', hints: ['Suppose que la clé est dans l\'or : combien d\'étiquettes disent vrai ?', 'Essaie les trois cas un par un.'], why: 'Si elle est dans l\'argent : l\'or ment, l\'argent ment, seul le bronze dit vrai. Dans les deux autres cas, deux étiquettes diraient vrai.' },
    { d: 'thermes', t: 'Chacun son bain', pts: 35, type: 'choice', opts: ['Ana', 'Bruno', 'Célia'], a: 0, sc: [['personr', 24, 26], ['person', 54, 26], ['persong', 84, 26]], q: 'Ana, Bruno et Célia prennent chacun un bain : un chaud, un tiède, un froid.\n• Bruno n\'aime pas le froid, et il n\'est pas dans le chaud.\n• Célia n\'est pas dans le froid.\n\nQui est dans le bain froid ?', hints: ['Où est Bruno, s\'il n\'est ni au chaud ni au froid ?'], why: 'Bruno est au tiède. Célia n\'est pas au froid : elle est au chaud. Il reste le froid pour Ana.' },
    { d: 'thermes', t: 'Les deux fontaines', pts: 35, type: 'choice', opts: ['1 h 30', '2 heures', '4 h 30', '9 heures'], a: 1, sc: [['valve', 24, 22], ['bucket', 54, 32], ['valve', 84, 22, 1, 0, 1]], q: 'La première fontaine remplit le grand bassin en 3 heures. La seconde le remplit en 6 heures.\n\nSi on ouvre les deux, combien de temps faut-il ?', hints: ['En une heure : un tiers, plus un sixième.'], why: '1/3 + 1/6 = 1/2 bassin par heure : il faut 2 heures.' },
    { d: 'thermes', t: 'La devinette du miroir', pts: 30, type: 'text', a: ['vapeur', 'la vapeur', 'buée', 'la buée', 'buee', 'la buee', 'brume'], sc: [['#?', 54, 20]], q: 'Gravé sur le grand miroir des Thermes :\n« Je nais de l\'eau chaude,\nje monte sans escalier,\nje cache ton visage sans jamais te toucher. »\n\nQui suis-je ?', hints: ['Regarde le miroir après un bain chaud.'], why: 'La vapeur (ou la buée) : elle sort de l\'eau chaude, s\'élève et couvre le miroir.' },
    { d: 'thermes', t: 'Le coffre des sels', pts: 35, type: 'lock', a: '456', sc: [['box', 54, 30]], q: 'Le coffre des sels de bain a un code à trois chiffres. Hector se souvient :\n• les trois chiffres se suivent, du plus petit au plus grand ;\n• leur somme fait 15.', hints: ['Trois nombres qui se suivent : celui du milieu est leur moyenne.'], why: '15 ÷ 3 = 5 au milieu : 4, 5, 6.' },
    { d: 'thermes', t: 'Le casier d\'Hector', pts: 40, type: 'lock', a: '630', sc: [['box', 54, 30], ['key', 80, 34]], q: 'Le casier d\'Hector s\'ouvre avec trois chiffres :\n• le premier est le double du deuxième ;\n• le dernier est zéro ;\n• les trois font 9 en tout.', hints: ['Le premier et le deuxième font donc 9 à eux deux.', 'Le premier vaut deux fois le deuxième : 3 parts en tout.'], why: 'Premier + deuxième = 9, avec premier = 2 × deuxième : deuxième = 3, premier = 6. Code 630.' },
    { d: 'thermes', t: 'Du froid au chaud', pts: 35, type: 'order', items: [['cup', 'Bleu'], ['jug', 'Vert'], ['bucket', 'Jaune'], ['bottle', 'Rouge']], start: [3, 1, 0, 2], a: [0, 1, 2, 3], k: 'Déduction', q: 'Quatre bassins, du plus froid (à gauche) au plus chaud. Hector les a mélangés sur son plan :\n• le bassin rouge est le plus chaud ;\n• le bleu est plus froid que le vert ;\n• le jaune est plus chaud que le vert.\n\nRemets les bassins dans l\'ordre.', hints: ['Le rouge va tout à droite.', 'Le vert est entre le bleu et le jaune.'], why: 'Bleu, vert, jaune, rouge.' },
    { d: 'thermes', t: 'Les canards perdus', pts: 25, type: 'pick', bg: 'thermes', a: 2, k: 'Observation', opts: [[[['duck', 2, 4], ['duck', 13, 4], ['duck', 24, 4], ['duck', 6, 18], ['duck', 17, 18], ['duck', 28, 18]], 'A'], [[['duck', 2, 4], ['duck', 13, 4], ['duck', 24, 4], ['duck', 35, 4], ['duck', 6, 18], ['duck', 17, 18], ['duck', 28, 18], ['duck', 39, 18]], 'B'], [[['duck', 2, 4], ['duck', 13, 4], ['duck', 24, 4], ['duck', 35, 4], ['duck', 6, 18], ['duck', 17, 18], ['duck', 28, 18]], 'C'], [[['duck', 2, 4], ['duck', 13, 4], ['duck', 24, 4], ['duck', 6, 18], ['duck', 17, 18]], 'D']], q: 'Un enfant a perdu SEPT canards en caoutchouc. Hector en trouve des groupes dans quatre bassins.\n\nDans quel bassin sont exactement les sept ?', hints: ['Compte la rangée du haut, puis celle du bas.'], why: 'Le bassin C : 4 en haut et 3 en bas, 7 canards. A en a 6, B 8 et D 5.' },
  );
  P.push(
    // les Mines d'argent (Gaspard)
    { d: 'mines', t: 'La galerie effondrée', pts: 35, type: 'maze', tiles: 'rock', maze: ['#############', '#S..#.......#', '###.#.#####.#', '#...#.#...#.#', '#.###.#.#.#.#', '#.....#.#...#', '#######.#####', '#...........E', '#############'], k: 'Manipulation', q: 'Un éboulement a bouché le grand couloir. Gaspard doit rejoindre la sortie par les vieilles galeries.\n\nGuide-le jusqu\'à la sortie, en bas à droite.', hints: ['Le seul passage vers le bas est au milieu.', 'Il faut d\'abord monter tout en haut à droite.'], why: 'Un long détour par le haut, puis le puits du milieu descend jusqu\'au dernier couloir.' },
    { d: 'mines', t: 'La grille du filon', pts: 45, type: 'maze', tiles: 'rock', maze: ['###############', '#S....#.....k.#', '#.###.#.###.###', '#.#...#...#...#', '#.#.#####.###.#', '#.#...........#', '#.###########.#', '#.....#.......#', '#####.#####.###', '#.........#d..E', '###############'], k: 'Manipulation', q: 'Le filon est derrière une grille, et la clé pend à un clou tout au fond d\'une galerie.\n\nRécupère la clé, puis ouvre la grille.', hints: ['La clé est en haut à droite.', 'Après la clé, redescends par le bord droit.'], why: 'Clé en haut à droite, retour par les couloirs du milieu, et la grille s\'ouvre juste avant la sortie.' },
    { d: 'mines', t: 'Les puits jumeaux', pts: 40, type: 'maze', tiles: 'rock', maze: ['###########', '#S#.......#', '#.#.#####.#', '#.#.#...#.#', '#.#.#.#.#.#', '#...#.#...#', '#####.#####', '#.....#...#', '#.#####.#.#', '#.......#.E', '###########'], k: 'Manipulation', q: 'Deux puits mènent au niveau du bas, mais un seul est praticable. Trouve le bon chemin jusqu\'à la sortie.', hints: ['Le passage vers le bas est au centre.', 'En bas, il faut repartir vers la gauche avant de revenir.'], why: 'On fait le tour du haut, on descend par le centre, on file à gauche, puis on remonte en zigzag vers la sortie.' },
    { d: 'mines', t: 'Les étais', pts: 45, type: 'queens', size: 5, piece: 'tour', count: 5, holes: ['0,0', '1,3', '2,2', '3,1', '4,4'], k: 'Logique', q: 'Gaspard doit poser 5 étais dans une galerie de 5 × 5. Deux étais sur la même ligne ou la même colonne se gênent. Et certaines cases sont de la roche : impossible d\'y poser quoi que ce soit.\n\nPose les 5 étais.', hints: ['Un étai par ligne, un par colonne.', 'Commence par la ligne qui a le moins de cases libres.'], why: 'Un étai par ligne et par colonne, en évitant la roche : plusieurs placements marchent.' },
    { d: 'mines', t: 'Les lampes des mineurs', pts: 50, type: 'queens', size: 6, piece: 'lamp', rule: 'roi', count: 9, k: 'Logique', q: 'Neuf lampes à poser dans une salle de 6 × 6. Deux lampes ne doivent jamais se toucher, même par un coin.\n\nPose les neuf lampes.', hints: ['Découpe la salle en carrés de 2 × 2.', 'Chaque carré de 2 × 2 ne peut avoir qu\'une lampe.'], why: 'Neuf carrés de 2 × 2, une lampe dans chacun, sans qu\'elles se touchent : c\'est le maximum possible.' },
    { d: 'mines', t: 'Les wagonnets du dépôt', pts: 45, type: 'slide', seed: 13, q: 'Les wagonnets numérotés sont en désordre dans le dépôt. Range-les de 1 à 8, la place vide en bas à droite.\n\nTouche un wagonnet voisin de la place vide pour le faire rouler.', hints: ['Range d\'abord la ligne du haut.', 'Puis la colonne de gauche ; le reste tourne en rond.'], why: 'Ligne du haut, colonne de gauche, puis les quatre derniers en les faisant tourner.' },
    { d: 'mines', t: 'Le tri du minerai', pts: 50, type: 'slide', seed: 42, q: 'Huit caisses de minerai, triées par numéro. Un éboulis les a toutes déplacées.\n\nRemets-les de 1 à 8.', hints: ['Ne défais pas une ligne finie.', 'Pour placer le 3, amène-le sous la place du 3 puis fais tourner le coin.'], why: 'On range ligne par ligne, et le dernier carré de 2 × 2 se résout en tournant.' },
    { d: 'mines', t: 'Le compte du contremaître', pts: 35, type: 'match', eq: '0+7=1', moves: 1, k: 'Astuce', sc: [['lamp', 54, 28]], q: 'Le contremaître a écrit ses comptes avec des allumettes : 0 + 7 = 1. C\'est faux !\n\nDéplace UNE allumette pour que le calcul soit juste.', hints: ['Le « + » peut devenir un « − ».', 'Le 0 peut gagner une allumette en son milieu.'], why: 'La barre debout du « + » va au milieu du 0 : 8 − 7 = 1.' },
    { d: 'mines', t: 'Les sept wagons', pts: 40, type: 'match', eq: '7+1=0', moves: 1, k: 'Astuce', sc: [['wagon', 54, 30]], q: 'Sur le tableau du dépôt : 7 + 1 = 0.\n\nDéplace UNE allumette pour corriger.', hints: ['Le 1 est fait de deux allumettes, comme le bas du 7.', 'Que manque-t-il au 1 pour devenir un 7 ?'], why: 'La barre debout du « + » devient le chapeau du 1 : 7 − 7 = 0.' },
    { d: 'mines', t: 'L\'ardoise de la cantine', pts: 35, type: 'match', eq: '4-1=5', moves: 1, k: 'Astuce', sc: [['cup', 54, 30]], q: 'À la cantine, l\'ardoise annonce : 4 − 1 = 5.\n\nDéplace UNE allumette pour que ce soit juste.', hints: ['C\'est le résultat qui se trompe.', 'Le 5 et le 3 se ressemblent beaucoup.'], why: 'Une allumette du 5 change de côté : 4 − 1 = 3.' },
    { d: 'mines', t: 'Les quatre lingots', pts: 50, type: 'hanoi', disks: 4, max: 15, k: 'Manipulation', q: 'Quatre lingots empilés du plus gros au plus petit, sur le premier socle. Il faut les porter sur le dernier.\n\nUn lingot à la fois, jamais sur un plus petit. Réussis en 15 déplacements.', hints: ['Avec 4 lingots, le plus petit part d\'abord sur le socle du MILIEU.', 'Il faut déplacer les trois du dessus, puis le gros, puis les trois encore.'], why: 'On déplace les 3 petits (7 coups), le gros (1 coup), puis les 3 petits par-dessus (7 coups) : 15.' },
    { d: 'mines', t: 'Le wagonnet', pts: 35, type: 'oneline', bg: 'mines', nodes: [[16, 20], [48, 20], [80, 20], [16, 48], [48, 48], [80, 48]], edges: [[0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5], [0, 4], [1, 5]], k: 'Astuce', q: 'Gaspard veut tracer les rails de ce plan d\'un seul trait, sans repasser deux fois par le même rail.\n\nTouche le point de départ, puis les points un à un.', hints: ['Compte les rails qui partent de chaque point.', 'Pars d\'un point qui a un nombre impair de rails.'], why: 'Seuls le coin en haut à gauche et le coin en bas à droite ont trois rails : on part de l\'un, on finit sur l\'autre.' },
    { d: 'mines', t: 'L\'étoile du filon', pts: 40, type: 'oneline', bg: 'mines', nodes: [[48, 4], [84, 26], [70, 56], [26, 56], [12, 26]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 2], [2, 4], [4, 1], [1, 3], [3, 0]], k: 'Astuce', q: 'Le plus beau filon a la forme d\'une étoile dans un pentagone. Trace-le d\'un seul trait, sans repasser.', hints: ['Ici, chaque point a quatre traits.', 'Tu peux partir de n\'importe où : tu reviendras au départ.'], why: 'Tous les points ont un nombre pair de traits : on peut partir de n\'importe lequel et y revenir.' },
    { d: 'mines', t: 'Les casiers de gemmes', pts: 45, type: 'latin', size: 4, box: [2, 2], syms: ['gem', 'gemr', 'rock', 'pickaxe'], given: ['2...', '..1.', '..3.', '4...'], k: 'Logique', q: 'Seize casiers : saphirs, rubis, pierres et pioches. Chaque ligne, chaque colonne et chaque carré de 2 × 2 en contient un de chaque.', hints: ['Seulement quatre objets posés : avance pas à pas.', 'Une case qui voit déjà trois objets différents est décidée.'], why: 'Chaque objet une fois par ligne, colonne et carré : il n\'y a qu\'une solution.' },
    { d: 'mines', t: 'Les mineurs et les trolls', pts: 55, type: 'river', ferry: false, cap: 2, max: 11, outnumber: ['mineur', 'troll'], items: [['mineur1', 'persony', 'un mineur'], ['mineur2', 'persony', 'un mineur'], ['mineur3', 'persony', 'un mineur'], ['troll1', 'persong', 'un troll'], ['troll2', 'persong', 'un troll'], ['troll3', 'persong', 'un troll']], k: 'Manipulation', q: 'Trois mineurs et trois trolls doivent traverser le lac souterrain. La barque porte deux personnes, et il faut quelqu\'un pour ramer.\n\nSi, sur une rive, les trolls sont plus nombreux que les mineurs (quand il y a des mineurs), ils leur volent leurs pépites !\n\nFais passer tout le monde en 11 traversées.', hints: ['Commence par faire passer deux trolls.', 'Au milieu, un mineur et un troll reviennent ensemble.'], why: 'Deux trolls passent, un revient, deux trolls passent, un revient ; deux mineurs passent, un mineur et un troll reviennent ; deux mineurs passent, un troll revient chercher les autres.' },
    { d: 'mines', t: 'Le wagon et son chargement', pts: 35, type: 'num', a: 100, unit: 'kg', sc: [['wagon', 54, 30], ['#1200 KG', 40, 8]], q: 'Un wagon et son chargement pèsent 1 200 kg. Le chargement pèse 1 000 kg de plus que le wagon.\n\nCombien pèse le wagon vide ?', hints: ['Ce n\'est pas 200 kg : vérifie !', 'Wagon + (wagon + 1000) = 1200.'], why: 'Deux wagons + 1000 = 1200 : le wagon pèse 100 kg et le chargement 1 100 kg.' },
    { d: 'mines', t: 'Les bouts de chandelle', pts: 40, type: 'num', a: 4, unit: 'bougies', sc: [['candle', 20, 30, 5, 10], ['#4 = 1', 82, 14]], q: 'Gaspard a 15 bougies. Avec quatre bouts de bougie usée, il fabrique une bougie neuve.\n\nCombien de bougies neuves pourra-t-il fabriquer en tout ?', hints: ['15 bouts : combien de bougies neuves, et combien de bouts en trop ?', 'Les bougies neuves laissent aussi des bouts.'], why: '15 bouts → 3 neuves (reste 3 bouts). Les 3 neuves brûlent : 6 bouts → 1 neuve (reste 2). Elle brûle : 3 bouts, pas assez. 3 + 1 = 4 bougies neuves.' },
    { d: 'mines', t: 'La descente du puits', pts: 35, type: 'num', a: 60, unit: 'secondes', sc: [['ladder', 54, 8]], q: 'Le puits compte 4 paliers. La cage met 20 secondes pour passer d\'un palier au suivant.\n\nCombien de secondes pour aller du premier palier (en haut) au quatrième (au fond) ?', hints: ['Combien d\'intervalles entre 4 paliers ?'], why: 'Entre le palier 1 et le palier 4, il n\'y a que 3 trajets : 3 × 20 = 60 secondes.' },
    { d: 'mines', t: 'La pépite trop légère', pts: 45, type: 'num', a: 3, unit: 'pesées', sc: [['gem', 20, 30, 3, 10], ['#?', 64, 16], ['gem', 76, 30, 3, 10]], q: 'Gaspard a 27 pépites identiques… sauf une, fausse, un peu plus légère. Il a une balance à deux plateaux, sans poids.\n\nEn combien de pesées, au minimum, est-il sûr de trouver la fausse ?', hints: ['Une pesée peut couper les pépites en TROIS groupes, pas deux.', '27 → 9 → 3 → 1.'], why: 'Trois tas de 9 : la balance dit lequel est léger. Puis trois tas de 3, puis trois pépites seules. 3 pesées.' },
    { d: 'mines', t: 'Le tunnel', pts: 30, type: 'num', a: 8, unit: 'heures', sc: [['pickaxe', 20, 28], ['#16 M', 50, 14], ['pickaxe', 88, 28, 1, 0, 1]], q: 'Deux équipes creusent un tunnel de 16 mètres, chacune depuis un bout. Chaque équipe avance d\'un mètre par heure.\n\nAu bout de combien d\'heures se rejoignent-elles ?', hints: ['Ensemble, elles creusent 2 mètres par heure.'], why: '2 mètres par heure à elles deux : 16 ÷ 2 = 8 heures.' },
    { d: 'mines', t: 'Le cristal qui pousse', pts: 30, type: 'num', a: 81, unit: 'cristaux', sc: [['gem', 16, 30], ['gem', 40, 30, 3, 8], ['#X3', 92, 16]], q: 'Dans la grotte, chaque cristal se divise en trois chaque nuit.\n\nGaspard trouve un cristal seul. Combien y en a-t-il au bout de 4 nuits ?', hints: ['1, 3, 9…'], why: '1 → 3 → 9 → 27 → 81 : on multiplie par 3 chaque nuit.' },
    { d: 'mines', t: 'Les trois galeries', pts: 40, type: 'choice', opts: ['La galerie 1', 'La galerie 2', 'La galerie 3'], a: 2, sc: [['#1', 20, 12], ['#2', 54, 12], ['#3', 88, 12], ['lamp', 18, 26], ['lamp', 52, 26], ['lamp', 86, 26]], q: 'Trois galeries, une seule mène à la sortie. Sur chacune, un panneau. Exactement UN panneau ment.\n• Galerie 1 : « La sortie n\'est pas ici. »\n• Galerie 2 : « La sortie est dans la galerie 1. »\n• Galerie 3 : « La sortie est ici. »\n\nQuelle galerie prendre ?', hints: ['Essaie chaque galerie et compte les panneaux qui disent vrai.'], why: 'Sortie en 3 : le panneau 1 dit vrai, le 2 ment, le 3 dit vrai. Un seul menteur ! Sortie en 1 ou en 2 : deux panneaux mentiraient.' },
    { d: 'mines', t: 'Les deux wagons', pts: 30, type: 'choice', opts: ['4 tonnes', '5 tonnes', '6 tonnes', '7 tonnes'], a: 1, sc: [['wagon', 30, 30], ['wagon', 78, 30], ['#12 T', 46, 10]], q: 'Le wagon rouge pèse 2 tonnes de plus que le wagon bleu. À eux deux, ils pèsent 12 tonnes.\n\nCombien pèse le wagon bleu ?', hints: ['Enlève les 2 tonnes en trop, puis partage.'], why: '12 − 2 = 10, partagé en deux : le bleu pèse 5 tonnes et le rouge 7.' },
    { d: 'mines', t: 'La pépite volée', pts: 45, type: 'choice', opts: ['Le mineur A', 'Le mineur B', 'Le mineur C'], a: 1, sc: [['persony', 24, 26], ['persony', 54, 26], ['persony', 84, 26], ['#A', 26, 8], ['#B', 56, 8], ['#C', 86, 8]], q: 'Une pépite a disparu. Trois mineurs sont interrogés, et EXACTEMENT UN ment.\n• A : « C\'est B. »\n• B : « C\'est C. »\n• C : « B ment. »\n\nQui a pris la pépite ?', hints: ['Si B ment, alors C dit vrai.', 'Essaie chacun comme coupable et compte les menteurs.'], why: 'Si c\'est B : A dit vrai, B ment, C dit vrai. Un seul menteur ! Avec A ou C coupable, il y en aurait deux.' },
  );
  P.push(
    // le Théâtre des Lanternes (Lyre)
    { d: 'theatre', t: 'Le salut final', pts: 40, type: 'order', items: [['personr', 'Ana'], ['person', 'Basile'], ['persong', 'Coline'], ['personv', 'Damien'], ['persony', 'Élise']], start: [1, 4, 3, 0, 2], a: [4, 0, 2, 3, 1], k: 'Déduction', q: 'Pour le salut final, cinq comédiens se tiennent en ligne. Lyre a noté :\n• Coline est au centre ;\n• Ana est juste à gauche de Coline ;\n• Damien n\'est pas à côté d\'Ana ;\n• Élise est à un bout de la ligne ;\n• Basile est quelque part à droite de Damien.\n\nPlace-les de gauche à droite.', hints: ['Coline au milieu, Ana juste avant : deux places sont déjà prises.', 'Damien ne peut pas être tout à gauche.'], why: 'Élise, Ana, Coline, Damien, Basile.' },
    { d: 'theatre', t: 'Le programme de la soirée', pts: 35, type: 'order', items: [['die', 'Jongleur'], ['card', 'Magicien'], ['mask', 'Tragédie'], ['bell', 'Musique']], start: [2, 0, 3, 1], a: [3, 2, 0, 1], k: 'Déduction', q: 'Quatre numéros ce soir. L\'affiche s\'est déchirée, mais Lyre se souvient :\n• la tragédie n\'est ni la première ni la dernière ;\n• le magicien passe juste après le jongleur ;\n• la musique passe avant la tragédie.\n\nRetrouve l\'ordre du programme.', hints: ['Jongleur puis magicien : ils sont collés.', 'Essaie la tragédie en deuxième place.'], why: 'Musique, tragédie, jongleur, magicien.' },
    { d: 'theatre', t: 'Les décors', pts: 40, type: 'order', items: [['tree', 'Forêt'], ['moon', 'Nuit'], ['lighthouse', 'Port'], ['book', 'Bibliothèque'], ['sun', 'Jour']], start: [1, 0, 4, 2, 3], a: [2, 4, 3, 0, 1], k: 'Déduction', q: 'Les cinq décors doivent descendre dans l\'ordre de la pièce :\n• la nuit est le dernier décor ;\n• la forêt vient juste avant la nuit ;\n• le port vient avant la bibliothèque ;\n• le jour vient juste après le port.\n\nRange les décors.', hints: ['Les deux derniers sont sûrs.', 'Port et jour sont collés.'], why: 'Port, jour, bibliothèque, forêt, nuit.' },
    { d: 'theatre', t: 'Les accessoires', pts: 40, type: 'latin', size: 4, box: [2, 2], syms: ['mask', 'ticket', 'card', 'die'], given: ['.4..', '.2..', '...4', '...1'], k: 'Logique', q: 'Sur l\'étagère des accessoires, seize cases : masques, billets, cartes et dés.\n\nChaque ligne, chaque colonne et chaque carré de 2 × 2 en contient un de chaque.', hints: ['Seulement quatre accessoires posés : cherche la case qui n\'a plus qu\'un choix.', 'Avance carré par carré.'], why: 'Chaque accessoire une fois par ligne, colonne et carré : une seule façon de ranger.' },
    { d: 'theatre', t: 'La grande malle', pts: 55, type: 'latin', size: 5, syms: ['mask', 'ticket', 'card', 'die', 'bell'], given: ['...5.', '....4', '.13..', '5...1', '..54.'], k: 'Logique', q: 'La grande malle a 25 compartiments, et cinq sortes d\'accessoires.\n\nChaque ligne et chaque colonne doit contenir chaque accessoire une seule fois.', hints: ['Pas de carrés ici : seulement les lignes et les colonnes.', 'Cherche où peut aller le dé dans chaque ligne.'], why: 'Une seule solution : chaque accessoire une fois par ligne et par colonne.' },
    { d: 'theatre', t: 'Le masque brisé', pts: 30, type: 'mirror', left: ['..kkk', '.kwww', 'kwwww', 'kwkkw', 'kwwww', 'kwwwr', '.kwwr', '..kkk'], k: 'Observation', q: 'Le masque de la comédie est tombé et s\'est cassé en deux. Lyre veut refaire la moitié droite.\n\nComplète-le exactement en miroir.', hints: ['L\'œil et la joue rose sont aussi en miroir.'], why: 'Une moitié droite identique, retournée comme dans un miroir.' },
    { d: 'theatre', t: 'La couronne du roi', pts: 30, type: 'mirror', left: ['y....', 'yy..y', 'yyyyy', 'yryyy', 'yyyyy', 'ooooo'], k: 'Observation', q: 'La couronne du roi de théâtre a perdu sa moitié droite.\n\nRefais-la en miroir.', hints: ['La pierre rouge est sur la gauche… donc aussi sur la droite.'], why: 'La couronne est symétrique : ses pointes et ses pierres se répondent.' },
    { d: 'theatre', t: 'Le masque caché', pts: 35, type: 'picross', pic: ['.wwwwww.', 'wwwwwwww', 'wkkwwkkw', 'wwwwwwww', 'wwwwwwww', 'wkwwwwkw', '.wkkkkw.', '..wwww..'], k: 'Logique', q: 'Sur le rideau, Lyre a caché un dessin. Noircis les cases selon les nombres.', hints: ['Deux lignes sont pleines d\'un bord à l\'autre.', 'Le bas se resserre.'], why: 'Le masque blanc de la comédie, avec ses yeux et son sourire.' },
    { d: 'theatre', t: 'L\'étoile de la troupe', pts: 40, type: 'picross', pic: ['....y....', '...yyy...', '...yyy...', 'yyyyyyyyy', '.yyyyyyy.', '..yyyyy..', '..yy.yy..', '.yy...yy.', '.y.....y.'], k: 'Logique', q: 'Sur la porte de la loge principale, un dessin à retrouver.', hints: ['La quatrième ligne est pleine.', 'Le dessin est symétrique.'], why: 'L\'étoile, peinte sur la loge de la vedette.' },
    { d: 'theatre', t: 'Le grand chassé-croisé', pts: 55, type: 'frogs', row: 'RRRR.BBBB', sprR: 'heart', sprB: 'die', k: 'Manipulation', q: 'Pour la dernière scène, quatre comédiens portent un cœur à gauche, quatre autres portent un dé à droite, une place libre au milieu. Chaque équipe doit traverser la scène.\n\nOn avance d\'une place, ou on saute par-dessus UN voisin. Jamais en arrière.', hints: ['Ne bloque jamais deux comédiens de la même équipe face à face.', 'Alterne : un pas, des sauts, un pas…'], why: 'En alternant pas et sauts, toute la troupe se croise en 24 mouvements.' },
    { d: 'theatre', t: 'La loge équilibrée', pts: 25, type: 'pick', bg: 'theatre', a: 3, k: 'Observation', opts: [[[['mask', 2, 2], ['mask', 12, 2], ['ticket', 22, 2], ['ticket', 6, 16], ['ticket', 16, 16]], 'A'], [[['mask', 2, 2], ['ticket', 12, 2], ['mask', 22, 2], ['mask', 6, 16], ['ticket', 16, 16]], 'B'], [[['ticket', 2, 2], ['mask', 12, 2], ['ticket', 22, 2], ['mask', 32, 2], ['ticket', 6, 16]], 'C'], [[['ticket', 2, 2], ['mask', 12, 2], ['mask', 22, 2], ['ticket', 6, 16], ['mask', 16, 16], ['ticket', 26, 16]], 'D']], q: 'Chaque comédien doit avoir son masque ET son billet. Dans quelle loge y a-t-il exactement autant de masques que de billets ?', hints: ['Compte les masques, puis les billets, loge par loge.'], why: 'La loge D : 3 masques et 3 billets. A : 2 et 3, B : 3 et 2, C : 2 et 3.' },
    { d: 'theatre', t: 'La table de jeu', pts: 30, type: 'pick', bg: 'theatre', a: 0, k: 'Observation', opts: [[[['die', 2, 2], ['card', 12, 2], ['die', 22, 2], ['card', 6, 16], ['die', 16, 16]], 'A'], [[['die', 2, 2], ['die', 12, 2], ['die', 22, 2], ['card', 6, 16], ['die', 16, 16]], 'B'], [[['card', 2, 2], ['die', 12, 2], ['card', 22, 2], ['card', 6, 16], ['die', 16, 16]], 'C'], [[['die', 2, 2], ['card', 12, 2], ['die', 22, 2], ['die', 32, 2], ['card', 6, 16], ['card', 16, 16]], 'D']], q: 'Pour la scène du tripot, il faut sur la table exactement 3 dés et 2 cartes.\n\nQuelle table est la bonne ?', hints: ['Une seule table a 5 objets ET le bon partage.'], why: 'La table A : 3 dés et 2 cartes. B : 4 dés, C : 2 dés, D : 3 dés mais 3 cartes.' },
    { d: 'theatre', t: 'Les places du théâtre', pts: 30, type: 'choice', opts: ['11', '12', '13', '16'], a: 2, sc: [['#1 1 2 3 5 8 ?', 22, 16]], q: 'Les places réservées à la troupe portent les numéros 1, 1, 2, 3, 5, 8…\n\nQuel est le numéro suivant ?', hints: ['Regarde les deux numéros juste avant.'], why: 'Chaque numéro est la somme des deux précédents : 5 + 8 = 13.' },
    { d: 'theatre', t: 'La troupe qui chante', pts: 30, type: 'choice', opts: ['Lyre est dans la troupe', 'Lyre n\'est pas dans la troupe', 'On ne peut pas savoir'], a: 1, sc: [['bell', 30, 28], ['personv', 70, 26]], q: 'Tous les comédiens de la troupe savent chanter.\nLyre ne sait pas chanter.\n\nQue peut-on en conclure ?', hints: ['Si elle était dans la troupe, que saurait-elle faire ?'], why: 'Tout membre de la troupe chante. Lyre ne chante pas : elle n\'en fait donc pas partie.' },
    { d: 'theatre', t: 'La famille du metteur en scène', pts: 35, type: 'choice', opts: ['3 enfants', '4 enfants', '6 enfants', '7 enfants'], a: 1, sc: [['personr', 20, 28, 3, 12], ['person', 76, 28]], q: 'Le metteur en scène a trois filles. Chacune de ses filles a un frère.\n\nCombien d\'enfants a-t-il ?', hints: ['Les trois filles ont-elles chacune un frère différent ?'], why: 'Les trois filles ont le même frère : 3 filles + 1 garçon = 4 enfants.' },
    { d: 'theatre', t: 'Le jour de la première', pts: 30, type: 'choice', opts: ['Vendredi', 'Samedi', 'Dimanche', 'Lundi'], a: 1, sc: [['scroll', 54, 24]], q: 'La première a lieu dans trois jours. Avant-hier, on était lundi.\n\nQuel jour aura lieu la première ?', hints: ['Si avant-hier était lundi, aujourd\'hui est…'], why: 'Avant-hier lundi : aujourd\'hui mercredi. Dans trois jours : samedi.' },
    { d: 'theatre', t: 'Les trois masques', pts: 50, type: 'choice', opts: ['Le Rire', 'Le Pleur', 'La Colère'], a: 2, sc: [['mask', 24, 28], ['mask', 54, 28], ['mask', 84, 28]], q: 'Un seul des trois masques est le vrai masque ancien. Le vrai dit toujours la vérité ; les deux faux mentent toujours.\n• Le Rire : « Le vrai, c\'est moi. »\n• Le Pleur : « Le Rire dit vrai. »\n• La Colère : « Le Pleur ment. »\n\nLequel est le vrai ?', hints: ['Si le Rire était le vrai, que dirait honnêtement le Pleur ?', 'Le Pleur ne peut pas être le vrai : il dirait que le Rire, un faux, dit vrai.'], why: 'Si le Rire est vrai, le Pleur (un faux) dirait vrai : impossible. Si le Pleur est vrai, le Rire aussi : impossible. C\'est la Colère : elle dit vrai, et les deux autres mentent bien.' },
    { d: 'theatre', t: 'Les lettres mêlées', pts: 25, type: 'text', a: ['scene', 'scène', 'la scene', 'la scène'], sc: [['#C E N E S', 36, 18]], q: 'Le panneau au-dessus du rideau est tombé, et ses lettres se sont mélangées : C · E · N · E · S.\n\nRemets-les dans l\'ordre : c\'est l\'endroit où jouent les comédiens.', hints: ['Elle est derrière le rideau.', 'Le mot commence par un S.'], why: 'C, E, N, E, S donnent SCÈNE.' },
    { d: 'theatre', t: 'La lettre de l\'auteur', pts: 35, type: 'text', a: ['secret', 'le secret', 'un secret'], sc: [['scroll', 54, 24]], q: 'L\'auteur a glissé un mot dans sa lettre à Lyre :\n« Silence, ce soir, dans la salle.\nEntre sans bruit par la loge.\nCherche sous le dernier fauteuil.\nRegarde bien ce qui brille.\nEt garde tout pour toi :\nTon rôle en dépend. »\n\nQuel mot l\'auteur a-t-il caché ?', hints: ['Lis la lettre autrement que de gauche à droite.', 'Regarde la première lettre de chaque ligne.'], why: 'Les premières lettres des lignes donnent S, E, C, R, E, T : SECRET.' },
    { d: 'theatre', t: 'Les lettres du souffleur', pts: 40, type: 'text', a: ['n'], sc: [['#U D T Q C S S H ?', 14, 18]], q: 'Le souffleur compte les répliques avec des lettres : U, D, T, Q, C, S, S, H…\n\nQuelle est la lettre suivante ?', hints: ['Compte à voix haute : un, deux, trois…'], why: 'Ce sont les initiales de un, deux, trois, quatre, cinq, six, sept, huit… puis NEUF : N.' },
    { d: 'theatre', t: 'Les fauteuils rouges', pts: 25, type: 'num', a: 252, unit: 'fauteuils', sc: [['chair', 8, 30, 8, 13]], q: 'La salle compte 12 rangs de 21 fauteuils.\n\nCombien de fauteuils en tout ?', hints: ['12 × 20, et encore 12.'], why: '12 × 21 = 12 × 20 + 12 = 240 + 12 = 252 fauteuils.' },
    { d: 'theatre', t: 'Les mains des comédiens', pts: 35, type: 'num', a: 10, unit: 'poignées', sc: [['personr', 10, 28], ['person', 30, 28], ['persong', 50, 28], ['personv', 70, 28], ['persony', 90, 28]], q: 'Avant le spectacle, les cinq comédiens se serrent la main, chacun une seule fois avec chacun des autres.\n\nCombien de poignées de main en tout ?', hints: ['Le premier serre 4 mains, le deuxième en serre encore 3…'], why: '4 + 3 + 2 + 1 = 10 poignées de main.' },
    { d: 'theatre', t: 'La recette du soir', pts: 25, type: 'num', a: 150, unit: 'spectateurs', sc: [['ticket', 30, 30], ['#10 SOUS', 54, 14], ['coin', 84, 30, 3, 6]], q: 'Un billet coûte 10 sous. Ce soir, la caisse contient 1 500 sous.\n\nCombien de spectateurs sont venus ?', hints: ['Combien de fois 10 dans 1 500 ?'], why: '1 500 ÷ 10 = 150 spectateurs.' },
    { d: 'theatre', t: 'Les entractes', pts: 25, type: 'num', a: 4, unit: 'entractes', sc: [['#ACTE', 12, 10], ['mask', 20, 28, 5, 18]], q: 'La pièce de ce soir a cinq actes. Entre deux actes, il y a toujours un entracte.\n\nCombien d\'entractes en tout ?', hints: ['Pas d\'entracte avant le premier acte, ni après le dernier.'], why: 'Cinq actes, et un entracte entre chaque paire : 4 entractes.' },
  );
  P.push(
    // l'Observatoire (Sélène)
    { d: 'observatoire', t: 'Le passage de la comète', pts: 30, type: 'clockset', a: '9:35', k: 'Calcul', sc: [['telescope', 30, 26], ['star', 80, 10]], q: 'Sélène a calculé que la comète passera 4 h 50 après 4 h 45.\n\nRègle l\'horloge de l\'observatoire sur l\'heure du passage.', hints: ['4 h 45 + 4 h = 8 h 45.', 'Il reste 50 minutes à ajouter.'], why: '4 h 45 + 4 h 50 = 9 h 35.' },
    { d: 'observatoire', t: 'La nuit d\'observation', pts: 35, type: 'clockset', a: '9:40', k: 'Calcul', sc: [['moon', 20, 10], ['telescope', 60, 26]], q: 'Sélène commence à observer à 19 h 15, et elle observe pendant 2 h 25.\n\nRègle l\'horloge sur l\'heure où elle s\'arrête.', hints: ['19 h 15 + 2 h = 21 h 15.', 'Sur un cadran, 21 h s\'affiche comme 9 h.'], why: '19 h 15 + 2 h 25 = 21 h 40, soit 9 h 40 sur le cadran.' },
    { d: 'observatoire', t: 'La Grande Casserole', pts: 30, type: 'oneline', bg: 'observatoire', nodes: [[8, 12], [26, 10], [42, 16], [58, 22], [86, 20], [84, 46], [56, 48]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]], k: 'Astuce', q: 'Sélène veut relier les étoiles de la Grande Casserole d\'un seul trait, sans repasser par un même trait.\n\nTouche l\'étoile de départ, puis les étoiles une à une.', hints: ['Une étoile n\'a qu\'un seul trait : c\'est un bout.', 'Pars du bout du manche.'], why: 'On part du bout du manche, on longe le manche, puis on fait le tour de la casserole.' },
    { d: 'observatoire', t: 'La Croix du Sud', pts: 40, type: 'oneline', bg: 'observatoire', nodes: [[48, 4], [84, 30], [48, 56], [12, 30], [48, 30]], edges: [[0, 4], [1, 4], [2, 4], [3, 4], [0, 1], [1, 2], [2, 3]], k: 'Astuce', q: 'La Croix du Sud, avec trois côtés de son losange. Trace-la d\'un seul trait.', hints: ['Compte les traits de chaque étoile.', 'Les deux étoiles de droite et du bas ont un nombre impair de traits.'], why: 'L\'étoile de droite et celle du bas ont 3 traits : on part de l\'une, on finit sur l\'autre.' },
    { d: 'observatoire', t: 'Le sablier céleste', pts: 40, type: 'oneline', bg: 'observatoire', nodes: [[16, 6], [80, 6], [48, 30], [16, 56], [80, 56]], edges: [[0, 1], [0, 2], [1, 2], [2, 3], [2, 4], [3, 4], [0, 3]], k: 'Astuce', q: 'Cette constellation ressemble à un sablier. Relie-la d\'un seul trait, sans repasser.', hints: ['L\'étoile du milieu a quatre traits.', 'Pars d\'une étoile de gauche.'], why: 'Les deux étoiles de gauche ont 3 traits : on part de l\'une et on termine sur l\'autre.' },
    { d: 'observatoire', t: 'La carte du ciel', pts: 35, type: 'color', k: 3, map: ['AAABBCC', 'ADDBBEC', 'ADDFFEE', 'GGFFHHE', 'GIIIHHJ'], q: 'Sur la carte du ciel, Sélène colorie les constellations avec trois couleurs. Deux constellations qui se touchent par un côté n\'ont jamais la même couleur.', hints: ['Commence par la constellation qui a le plus de voisines.', 'Un voisin de deux couleurs différentes n\'a plus qu\'un choix.'], why: 'Trois couleurs suffisent pour cette carte, en partant du centre.' },
    { d: 'observatoire', t: 'Le grand atlas', pts: 45, type: 'color', k: 4, map: ['AAABBCCCD', 'AEEBBFCDD', 'GEEHHFFDI', 'GGJHHKKII', 'LGJJMMKKI', 'LLLJMMNNN'], q: 'La grande carte de l\'atlas des étoiles, avec quatre couleurs. Deux régions voisines (par un côté) ne doivent pas avoir la même couleur.', hints: ['Avance de proche en proche.', 'Si tu bloques, change la couleur d\'une région déjà posée.'], why: 'Quatre couleurs suffisent toujours pour colorier une carte.' },
    { d: 'observatoire', t: 'Les cinq étoiles', pts: 45, type: 'queens', size: 5, piece: 'star', rule: 'dame', count: 5, k: 'Logique', q: 'Sélène veut poser cinq étoiles sur une carte de 5 × 5. Deux étoiles ne doivent jamais être sur la même ligne, la même colonne ou la même diagonale.\n\nPose les cinq étoiles.', hints: ['Une étoile par ligne et par colonne.', 'Essaie la première étoile dans le coin.'], why: 'Par exemple colonnes 1, 3, 5, 2, 4 de haut en bas : aucune diagonale partagée.' },
    { d: 'observatoire', t: 'Les six fous', pts: 50, type: 'queens', size: 4, piece: 'fou', count: 6, k: 'Logique', q: 'Sur un petit échiquier de 4 × 4, place SIX fous. Un fou menace toute sa diagonale, aussi loin qu\'il voit. Aucun fou ne doit en menacer un autre.', hints: ['Les fous n\'aiment que les diagonales : lignes et colonnes sont libres.', 'Remplis presque entièrement le bord du haut et le bord du bas.'], why: 'Par exemple quatre fous sur la ligne du haut et deux au milieu de la ligne du bas : aucune diagonale partagée.' },
    { d: 'observatoire', t: 'Les tiroirs des astres', pts: 40, type: 'latin', size: 4, box: [2, 2], syms: ['star', 'moon', 'sun', 'planet'], given: ['.3..', '2...', '..3.', '.4.2'], k: 'Logique', q: 'Seize tiroirs pour ranger les plaques gravées : étoiles, lunes, soleils et planètes.\n\nChaque ligne, chaque colonne et chaque carré de 2 × 2 en contient une de chaque.', hints: ['Commence par le carré qui a le plus de plaques.', 'Une case qui voit déjà trois symboles est décidée.'], why: 'Une seule façon de ranger les plaques : chacune une fois par ligne, colonne et carré.' },
    { d: 'observatoire', t: 'La planète à anneau', pts: 35, type: 'picross', pic: ['...yyyy...', '..yyyyyy..', 'ooyyyyyyoo', '.oooooooo.', '..yyyyyy..', '...yyyy...'], k: 'Logique', q: 'Dans la lunette, Sélène a aperçu quelque chose. Retrouve-le grâce aux nombres.', hints: ['La troisième ligne est entièrement noire.', 'Le dessin est symétrique.'], why: 'Une planète entourée de son anneau.' },
    { d: 'observatoire', t: 'L\'étoile coupée', pts: 30, type: 'mirror', left: ['....y', '...yy', 'yyyyy', '.yyyY', '..yyy', '.yy.y', 'yy...'], k: 'Observation', q: 'Il ne reste que la moitié gauche de l\'étoile gravée sur la coupole.\n\nRedessine l\'autre moitié en miroir.', hints: ['La pointe du haut touche le trait du milieu.'], why: 'Une étoile à cinq branches est symétrique de part et d\'autre de son axe.' },
    { d: 'observatoire', t: 'Les étoiles en rang', pts: 25, type: 'num', a: 13, unit: '', sc: [['#1 4 7 10 ?', 30, 18]], q: 'Sélène numérote les étoiles d\'une ligne : 1, 4, 7, 10…\n\nQuel est le numéro suivant ?', hints: ['De combien augmente-t-on à chaque fois ?'], why: 'On ajoute 3 à chaque fois : 10 + 3 = 13.' },
    { d: 'observatoire', t: 'Les étoiles filantes', pts: 25, type: 'num', a: 32, unit: 'étoiles', sc: [['star', 14, 20], ['star', 40, 16, 2, 6], ['star', 72, 12, 3, 6]], q: 'Pendant la grande pluie d\'étoiles, Sélène en voit une le premier soir, deux le deuxième, quatre le troisième… Le nombre double chaque soir.\n\nCombien en verra-t-elle le sixième soir ?', hints: ['1, 2, 4, 8…'], why: '1 → 2 → 4 → 8 → 16 → 32 : le sixième soir, 32 étoiles filantes.' },
    { d: 'observatoire', t: 'La pyramide du jardin', pts: 25, type: 'num', a: 5, unit: 'faces', sc: [['#?', 54, 18]], q: 'Dans le jardin de l\'observatoire, une pyramide de pierre a une base carrée.\n\nCombien de faces a-t-elle en tout ?', hints: ['N\'oublie pas la face posée au sol.'], why: 'Quatre faces triangulaires sur les côtés, et la base carrée : 5 faces.' },
    { d: 'observatoire', t: 'La tirelire de Sélène', pts: 25, type: 'num', a: 30, unit: 'jours', sc: [['telescope', 30, 26], ['coin', 70, 30, 3, 8]], q: 'Le nouveau télescope coûte 120 sous. Sélène met 4 sous de côté chaque jour.\n\nCombien de jours lui faut-il ?', hints: ['Combien de fois 4 dans 120 ?'], why: '120 ÷ 4 = 30 jours.' },
    { d: 'observatoire', t: 'La comète de jadis', pts: 40, type: 'num', a: 1834, unit: '', sc: [['star', 60, 14], ['#76 ANS', 20, 30]], q: 'Une grande comète revient tous les 76 ans. On l\'a vue en 1986.\n\nEn quelle année l\'a-t-on vue DEUX passages avant celui de 1986 ?', hints: ['Un passage avant 1986, c\'était en 1910.'], why: '1986 − 76 = 1910, puis 1910 − 76 = 1834.' },
    { d: 'observatoire', t: 'Les neuf du registre', pts: 40, type: 'num', a: 20, unit: 'fois', sc: [['book', 54, 26]], q: 'Sélène numérote les pages de son registre de 1 à 100.\n\nCombien de fois écrit-elle le chiffre 9 ?', hints: ['Compte les 9 des unités : 9, 19, 29…', 'Puis ceux des dizaines : 90, 91…'], why: '10 fois aux unités (9, 19, … 99) et 10 fois aux dizaines (90 à 99) : 20 fois, car 99 en compte deux.' },
    { d: 'observatoire', t: 'Les pages marquées', pts: 40, type: 'num', a: 19, unit: 'pages', sc: [['book', 54, 26]], q: 'Sélène colle une étoile sur chaque page du registre dont le numéro contient au moins un 9, de 1 à 100.\n\nCombien d\'étoiles colle-t-elle ?', hints: ['Attention : 99 ne compte qu\'une fois.'], why: '9, 19, …, 89 (9 pages), 90 à 99 (10 pages) : 19 pages.' },
    { d: 'observatoire', t: 'La cinquième fille', pts: 25, type: 'choice', opts: ['Nunu', 'Nina', 'Sélène', 'Nanou'], a: 2, sc: [['telescope', 30, 26], ['#?', 76, 16]], q: 'Le père de Sélène a cinq filles : Nana, Néné, Nini, Nono…\n\nComment s\'appelle la cinquième ?', hints: ['Relis le début de la question.'], why: 'C\'est Sélène elle-même : c\'est son père !' },
    { d: 'observatoire', t: 'La Lune est-elle une planète ?', pts: 30, type: 'choice', opts: ['Oui, forcément', 'Non, pas forcément'], a: 1, sc: [['planet', 30, 26], ['moon', 76, 22]], q: 'Toutes les planètes sont rondes.\nLa Lune est ronde.\n\nPeut-on en conclure que la Lune est une planète ?', hints: ['Une balle aussi est ronde…'], why: 'Être rond ne suffit pas : les planètes sont rondes, mais tout ce qui est rond n\'est pas une planète.' },
    { d: 'observatoire', t: 'Les trois lunettes', pts: 35, type: 'choice', opts: ['La lunette A', 'La lunette B', 'La lunette C'], a: 2, sc: [['telescope', 14, 26], ['telescope', 50, 26], ['telescope', 86, 26], ['#A', 18, 8], ['#B', 54, 8], ['#C', 90, 8]], q: 'La lunette A grossit 10 fois. Elle grossit deux fois plus que la lunette B. La lunette C grossit trois fois plus que la lunette B.\n\nLaquelle grossit le plus ?', hints: ['Commence par trouver combien grossit B.'], why: 'B grossit 5 fois (10 ÷ 2), C grossit 15 fois (5 × 3) : C gagne.' },
    { d: 'observatoire', t: 'Le coffre de la comète', pts: 35, type: 'lock', a: '2062', sc: [['box', 54, 30], ['star', 80, 10]], q: 'Le coffre de Sélène s\'ouvre avec l\'année du prochain passage de la grande comète.\n\nElle revient tous les 76 ans, et on l\'a vue en 1986.', hints: ['1986 + 76 = ?'], why: '1986 + 76 = 2062.' },
    { d: 'observatoire', t: 'Le cadenas de la coupole', pts: 45, type: 'lock', a: '210', sc: [['padlock', 54, 28]], q: 'Le cadenas de la coupole a un code à trois chiffres.\n• C\'est le produit de trois nombres entiers qui se suivent (comme 2 × 3 × 4).\n• Il est compris entre 200 et 300.', hints: ['4 × 5 × 6 = 120, trop petit.', 'Essaie le suivant.'], why: '5 × 6 × 7 = 210. Le suivant, 6 × 7 × 8 = 336, est trop grand.' },
  );
  // </enigmes>
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
    p.append(el('p', '', done === TOTAL ? 'La grande horloge bat de nouveau. Valcendre te doit une fière chandelle : reviens quand tu veux revoir une énigme.' : 'Cette nuit, la grande horloge de Valcendre s\'est arrêtée. Ses ' + TOTAL + ' rouages ont roulé dans toute la ville, des jardins jusqu\'aux mines. Les habitants les ont ramassés… mais chacun ne rend le sien qu\'à qui résout son énigme.'));
    const go = el('button', '', done ? 'CONTINUER' : 'COMMENCER'); go.onclick = map;
    t.append(p, go); wrap.replaceChildren(t);
  }
  function map() {
    const g = el('div', 'districts');
    D.forEach((d, i) => {
      const open = unlocked(i), n = solvedIn(d.id), c = el('div', 'parch dist' + (open ? '' : ' lock'));
      const who = el('div', 'who'), txt = el('div'); txt.append(el('h2', '', d.name), el('div', 'blurb', d.whoName));
      who.append(face(d.who, 4), txt);
      const size = P.filter(p => p.d === d.id).length, pr = el('div', 'prog'); for (let k = 0; k < size; k++) pr.append(el('i', k < n ? 'on' : ''));
      c.append(who, el('div', 'blurb', open ? d.blurb : 'Résous ' + UNLOCK + ' énigmes de « ' + D[i - 1].name + ' » pour y entrer.'), pr, el('div', 'blurb', n + ' / ' + size + ' rouages'));
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
      b.append(cg, el('span', '', p.t), el('em', '', kindOf(p)), el('small', '', ok ? ok + ' étincelles' : 'vaut ' + worth(p)));
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

  // <moteurs>
  /* ---------- les énigmes à manipuler, à la manière des grands casse-tête : chacune dessinée au pixel ---------- */
  // un canevas cliquable : f(x, y) reçoit la position en pixels du dessin, quelle que soit la taille affichée
  function pad(w, h, s, onTap) {
    const c = cv(w, h); c.style.cssText = `width:${w * s}px;max-width:100%;height:auto;image-rendering:pixelated;cursor:pointer;touch-action:manipulation`; c.className = 'spr';
    c.onclick = e => { const r = c.getBoundingClientRect(); onTap(Math.floor((e.clientX - r.left) / r.width * w), Math.floor((e.clientY - r.top) / r.height * h), e); };
    return c;
  }
  const btn = (t, f, cls = 'dark') => { const b = el('button', cls, t); b.onclick = f; return b; };
  const note = t => el('div', 'note', t), row2 = (...k) => { const d = el('div', 'row2'); d.append(...k); return d; };
  const solvedOnce = (b, win) => () => { if (b.dataset.done) return; b.dataset.done = 1; win(); };

  // les allumettes : déplace des allumettes pour rendre l'égalité juste
  const SEG7 = { 0: 'abcdef', 1: 'bc', 2: 'abdeg', 3: 'abcdg', 4: 'bcfg', 5: 'acdfg', 6: 'acdefg', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg' };
  const OPS = { '+': 'mv', '-': 'm', '=': 'pq' };
  const SEGXY = { a: [3, 1, 'h'], b: [11, 3, 'v'], c: [11, 13, 'v'], d: [3, 21, 'h'], e: [1, 13, 'v'], f: [1, 3, 'v'], g: [3, 11, 'h'], m: [2, 11, 'h'], v: [5, 7, 'v'], p: [2, 8, 'h'], q: [2, 14, 'h'] };
  function evalSticks(slots) {
    let s = '';
    for (const { kind, on } of slots) {
      const k = [...on].sort().join('');
      if (kind === 'd') { const d = Object.keys(SEG7).find(n => [...SEG7[n]].sort().join('') === k); if (d == null) return false; s += d; }
      else { const o = Object.keys(OPS).find(n => [...OPS[n]].sort().join('') === k); if (!o) return false; s += o; }
    }
    const parts = s.split('='); if (parts.length !== 2 || parts.some(x => !/^\d+([+-]\d+)*$/.test(x))) return false;
    const val = x => x.match(/[+-]?\d+/g).reduce((a, b) => a + +b, 0);
    return val(parts[0]) === val(parts[1]);
  }
  function match(p, win) {
    const orig = [...p.eq].map(ch => ({ kind: /\d/.test(ch) ? 'd' : 'o', on: new Set(/\d/.test(ch) ? SEG7[ch] : OPS[ch]) }));
    let slots, hand = 0;
    const W = orig.reduce((w, s) => w + (s.kind === 'd' ? 16 : 13), 2), H = 25, info = note('');
    const xs = []; { let x = 2; for (const s of orig) { xs.push(x); x += s.kind === 'd' ? 16 : 13; } }
    const reset = () => { slots = orig.map(s => ({ kind: s.kind, on: new Set(s.on) })); hand = 0; draw(); };
    const segRect = (i, k) => { const [x, y, o] = SEGXY[k]; return o === 'h' ? [xs[i] + x, y, 8, 2] : [xs[i] + x, y, 2, 8]; };
    const draw = () => {
      const g = c.getContext('2d'); g.fillStyle = C.n; g.fillRect(0, 0, W, H);
      slots.forEach((s, i) => { for (const k of (s.kind === 'd' ? 'abcdefg' : 'mvpq')) {
        const [x, y, w, h] = segRect(i, k);
        if (s.on.has(k)) { g.fillStyle = C.p; g.fillRect(x, y, w, h); g.fillStyle = C.P; w > h ? g.fillRect(x, y + 1, w, 1) : g.fillRect(x + 1, y, 1, h); g.fillStyle = C.r; w > h ? g.fillRect(x + w - 2, y, 2, 2) : g.fillRect(x, y, 2, 2); }
        else { g.fillStyle = C.N; w > h ? (g.fillRect(x, y, 1, 1), g.fillRect(x + w - 1, y, 1, 1)) : (g.fillRect(x, y, 1, 1), g.fillRect(x, y + h - 1, 1, 1)); }
      } });
      const moved = orig.reduce((n, s, i) => n + [...s.on].filter(k => !slots[i].on.has(k)).length, 0);
      info.textContent = `Allumettes en main : ${hand} · déplacées : ${moved} sur ${p.moves}`;
    };
    const c = pad(W, H, 5, (x, y) => {
      if (b.dataset.done) return;
      let best = null, bd = 9;
      slots.forEach((s, i) => { for (const k of (s.kind === 'd' ? 'abcdefg' : 'mvpq')) { const [rx, ry, w, h] = segRect(i, k), d = Math.hypot(x - (rx + w / 2), y - (ry + h / 2)); if (d < bd) { bd = d; best = [i, k]; } } });
      if (!best) return; const [i, k] = best, s = slots[i];
      if (s.on.has(k)) { s.on.delete(k); hand++; } else if (hand) { s.on.add(k); hand--; }
      draw();
      const moved = orig.reduce((n, o, j) => n + [...o.on].filter(q => !slots[j].on.has(q)).length, 0);
      if (!hand && moved && moved <= p.moves && evalSticks(slots)) solvedOnce(b, win)();
    });
    const b = el('div', 'board'); b.append(c); reset();
    return [b, info, btn('RECOMMENCER', () => { delete b.dataset.done; reset(); })];
  }

  // la traversée : fais passer tout le monde sur l'autre rive
  function river(p, win, lose) {
    const W = 128, H = 60, pos = {}, info = note(''); let boat = 0, load = [], trips = 0;
    const by = id => p.items.find(i => i[0] === id);
    const reset = () => { for (const [id] of p.items) pos[id] = 0; boat = 0; load = []; trips = 0; draw(); };
    const spots = [];
    const draw = () => {
      const g = c.getContext('2d'); spots.length = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) px(g, x, y, x < 36 || x >= 92 ? (y > H - 6 ? C.h : (x * 3 + y * 5) % 11 === 0 ? C.T : C.g) : ((x + y * 2) % 9 === 0 ? C.e : C.S));
      const bx = boat ? 64 : 37; stamp(g, ['kkkkkkkkkkkkkkkkkkkkkkkkkk', '.kbbbbbbbbbbbbbbbbbbbbbbk.', '..khbhbhbhbhbhbhbhbhbhbk..', '...kkkkkkkkkkkkkkkkkkkkk...'], bx, 40);
      if (p.ferry) stamp(g, SPR.person, bx + 1, 28, { ...C, A: C.c, B: C.k });
      const put = (id, x, y) => { const [, sp] = by(id), rows = SPR[sp] || SPR.person, pal = PEOPLE[sp] ? { ...C, ...PEOPLE[sp] } : C; stamp(g, rows, x, y, pal); spots.push([id, x, y, rows[0].length, rows.length]); if (load.includes(id)) { g.fillStyle = C.l; g.fillRect(x, y + rows.length + 1, rows[0].length, 1); } };
      load.forEach((id, k) => put(id, bx + (p.ferry ? 10 : 2) + k * 12, 40 - (SPR[by(id)[1]] || SPR.person).length));
      const banks = [[], []]; for (const [id] of p.items) if (!load.includes(id)) banks[pos[id]].push(id);
      banks.forEach((list, side) => list.forEach((id, k) => { const col = k % 2, row = Math.floor(k / 2), rows = SPR[by(id)[1]] || SPR.person; put(id, (side ? 94 : 2) + col * 17, 6 + row * 17 + (14 - rows.length)); }));
      info.textContent = `Traversées : ${trips}${p.max ? ' (en ' + p.max + ' au plus)' : ''}${p.maxW ? ' · charge : ' + load.reduce((s, id) => s + (by(id)[3] || 0), 0) + ' / ' + p.maxW + ' kg' : ''}`;
    };
    const c = pad(W, H, 4, (x, y) => {
      if (b.dataset.done) return;
      const hit = spots.find(([, sx, sy, w, h]) => x >= sx - 1 && x <= sx + w && y >= sy - 1 && y <= sy + h); if (!hit) return; const id = hit[0];
      if (load.includes(id)) load = load.filter(q => q !== id);
      else if (pos[id] === boat && load.length < p.cap) load.push(id);
      draw();
    });
    const cross = () => {
      if (b.dataset.done) return;
      if (!p.ferry && !load.length) return lose('Il faut quelqu\'un dans la barque pour ramer.', true);
      if (p.rowers && !load.some(id => p.rowers.includes(id))) return lose('Personne dans la barque ne sait ramer.', true);
      if (p.maxW && load.reduce((s, id) => s + (by(id)[3] || 0), 0) > p.maxW) return lose('La barque coulerait : trop lourd !', true);
      boat = 1 - boat; for (const id of load) pos[id] = boat; trips++; const arrived = load; load = []; draw();
      for (const side of [0, 1]) {
        const here = p.items.map(i => i[0]).filter(id => pos[id] === side), guarded = (p.ferry && boat === side);
        for (const [a, z, msg, guard] of p.bad || []) if (here.includes(a) && here.includes(z) && !guarded && !(guard && here.includes(guard))) { lose(msg, true); setTimeout(reset, 1400); return; }
        if (p.outnumber) { const [A, Z, msg] = p.outnumber, na = here.filter(id => id.startsWith(A)).length, nz = here.filter(id => id.startsWith(Z)).length; if (na && nz > na) { lose(msg, true); setTimeout(reset, 1400); return; } }
      }
      void arrived;
      if (p.items.every(([id]) => pos[id] === 1)) { if (p.max && trips > p.max) lose('Tout le monde est passé, mais en ' + trips + ' traversées : on peut faire mieux.', true); else solvedOnce(b, win)(); }
    };
    const b = el('div', 'board'); b.append(c); reset();
    return [b, info, row2(btn('TRAVERSER', cross, ''), btn('RECOMMENCER', () => { delete b.dataset.done; reset(); }))];
  }

  // les vases : verse de l'un dans l'autre pour mesurer la bonne quantité
  function jugs(p, win) {
    let v, sel = -1, moves = 0; const info = note(''), N = p.caps.length, W = N * 30 + 6, H = 58;
    const reset = () => { v = [...p.start]; sel = -1; moves = 0; draw(); };
    const draw = () => {
      const g = c.getContext('2d'); g.fillStyle = C.d; g.fillRect(0, 0, W, H); g.fillStyle = C.D; g.fillRect(0, H - 6, W, 6);
      const top = Math.max(...p.caps);
      p.caps.forEach((cap, i) => {
        const x = 5 + i * 30, h = Math.round(cap / top * 40) + 4, y = H - 7 - h;
        for (let yy = y; yy < H - 6; yy++) for (let xx = x; xx < x + 22; xx++) { const edge = xx === x || xx === x + 21 || yy === H - 7; px(g, xx, yy, edge ? (sel === i ? C.l : C.k) : C.N); }
        const lvl = Math.round(v[i] / cap * (h - 1)); for (let yy = H - 7 - lvl; yy < H - 7; yy++) for (let xx = x + 1; xx < x + 21; xx++) px(g, xx, yy, yy === H - 7 - lvl ? C.e : (xx + yy) % 7 === 0 ? C.e : C.S);
        for (let k = 1; k < cap; k++) { const yy = H - 7 - Math.round(k / cap * (h - 1)); px(g, x + 1, yy, C.W); px(g, x + 2, yy, C.W); }
        mini(g, v[i] + '/' + cap, x + 11 - miniW(v[i] + '/' + cap) / 2, Math.max(1, y - 7), C.l);
      });
      info.textContent = `Gestes : ${moves}${p.max ? ' (en ' + p.max + ' au plus)' : ''} · ` + (sel < 0 ? 'touche un vase à verser' : 'touche le vase où verser');
    };
    const check = () => { if ((p.goal != null && v.includes(p.goal)) || (p.goalAll && p.goalAll.every((x, i) => x == null || v[i] === x))) { if (!p.max || moves <= p.max) solvedOnce(b, win)(); } };
    const c = pad(W, H, 5, x => {
      if (b.dataset.done) return; const i = Math.floor((x - 3) / 30); if (i < 0 || i >= N) return;
      if (sel < 0) { if (v[i]) sel = i; } else if (sel === i) sel = -1; else { const q = Math.min(v[sel], p.caps[i] - v[i]); if (q) { v[sel] -= q; v[i] += q; moves++; } sel = -1; }
      draw(); check();
    });
    const b = el('div', 'board'); b.append(c); reset();
    const row = el('div', 'row2'); if (p.tap) p.caps.forEach((cap, i) => row.append(btn('REMPLIR ' + (i + 1), () => { v[i] = cap; moves++; sel = -1; draw(); check(); }), btn('VIDER ' + (i + 1), () => { v[i] = 0; moves++; sel = -1; draw(); check(); })));
    row.append(btn('RECOMMENCER', () => { delete b.dataset.done; reset(); }));
    return [b, info, row];
  }

  // les pièces à placer : aucune ne doit en menacer une autre
  const PIECES = { dame: ['..k.k.k..', '..kykyk..', '.kyyyyyk.', '..kyyyk..', '..kyYyk..', '.kyyyyYk.', 'kkkkkkkkk'], tour: ['k.k.k.k..', 'kkkkkkk..', '.kyyyk...', '.kyyYk...', '.kyyYk...', 'kyyyyYk..', 'kkkkkkk..'],
    fou: ['...k.....', '..kyk....', '.kyyyk...', '.kykyk...', '..kyk....', '.kyyYk...', 'kkkkkkk..'], cavalier: ['..kkk....', '.kyyyk...', 'kykyyyk..', 'kkkyyk...', '..kyyk...', '.kyyYYk..', 'kkkkkkk..'],
    roi: ['...k.....', '..kkk....', '...k.....', '.kyyyk...', '.kyyYk...', 'kyyyyYk..', 'kkkkkkk..'], star: SPR.star, lamp: SPR.lamp, flower: SPR.flower };
  const attacks = (piece, [r1, c1], [r2, c2]) => { const dr = Math.abs(r1 - r2), dc = Math.abs(c1 - c2);
    return piece === 'tour' ? (dr === 0 || dc === 0) : piece === 'fou' ? dr === dc : piece === 'cavalier' ? (dr * dc === 2) : piece === 'roi' ? Math.max(dr, dc) === 1 : (dr === 0 || dc === 0 || dr === dc); };
  function queens(p, win) {
    const N = p.size, S = 11, W = N * S + 2, on = new Set(p.fixed || []), holes = new Set(p.holes || []), info = note(''), rule = p.rule || p.piece;
    const conflicts = () => { const list = [...on].map(k => k.split(',').map(Number)), bad = new Set(); list.forEach((a, i) => list.forEach((z, j) => { if (i < j && attacks(rule, a, z)) { bad.add(a.join()); bad.add(z.join()); } })); return bad; };
    const draw = () => {
      const g = c.getContext('2d'), bad = conflicts();
      for (let r = 0; r < N; r++) for (let q = 0; q < N; q++) { const k = r + ',' + q, x = 1 + q * S, y = 1 + r * S; g.fillStyle = holes.has(k) ? C.k : (r + q) % 2 ? C.P : C.p; g.fillRect(x, y, S, S); if (bad.has(k)) { g.fillStyle = C.r; g.fillRect(x, y, S, 1); g.fillRect(x, y + S - 1, S, 1); g.fillRect(x, y, 1, S); g.fillRect(x + S - 1, y, 1, S); } if (on.has(k)) stamp(g, PIECES[p.piece] || PIECES.dame, x + 1, y + 2); }
      g.strokeStyle = C.k; g.lineWidth = 1; g.strokeRect(.5, .5, W - 1, W - 1);
      info.textContent = `${on.size} / ${p.count} placées` + (bad.size ? ' · certaines se menacent' : '');
      if (on.size === p.count && !bad.size) solvedOnce(b, win)();
    };
    const c = pad(W, W, Math.max(3, Math.floor(36 / N)), (x, y) => { if (b.dataset.done) return; const q = Math.floor((x - 1) / S), r = Math.floor((y - 1) / S), k = r + ',' + q; if (r < 0 || q < 0 || r >= N || q >= N || holes.has(k) || (p.fixed || []).includes(k)) return; on.has(k) ? on.delete(k) : on.size < p.count && on.add(k); draw(); });
    const b = el('div', 'board'); b.append(c); draw();
    return [b, info, btn('TOUT ENLEVER', () => { delete b.dataset.done; on.clear(); (p.fixed || []).forEach(k => on.add(k)); draw(); })];
  }

  // les parterres : colorie chaque zone, deux zones voisines jamais de la même couleur
  function color(p, win) {
    const M = p.map, R = M.length, Q = M[0].length, S = 8, cols = [C.r, C.y, C.S, C.g, C.v].slice(0, p.k), col = { ...(p.fixed || {}) }, info = note('');
    const regions = [...new Set(M.join('').replace(/\./g, ''))], adj = new Set();
    for (let r = 0; r < R; r++) for (let q = 0; q < Q; q++) for (const [dr, dq] of [[0, 1], [1, 0]]) { const a = M[r][q], z = M[r + dr]?.[q + dq]; if (z && a !== z && a !== '.' && z !== '.') adj.add([a, z].sort().join('')); }
    const draw = () => {
      const g = c.getContext('2d'); g.fillStyle = C.k; g.fillRect(0, 0, Q * S + 2, R * S + 2);
      for (let r = 0; r < R; r++) for (let q = 0; q < Q; q++) { const a = M[r][q]; if (a === '.') continue; const x = 1 + q * S, y = 1 + r * S, f = col[a] != null ? cols[col[a]] : C.p;
        for (let yy = 0; yy < S; yy++) for (let xx = 0; xx < S; xx++) { const edge = (xx === 0 && M[r][q - 1] !== a) || (yy === 0 && M[r - 1]?.[q] !== a) || (xx === S - 1 && M[r][q + 1] !== a) || (yy === S - 1 && M[r + 1]?.[q] !== a); px(g, x + xx, y + yy, edge ? C.k : col[a] == null && (xx + yy) % 4 === 0 ? C.P : f); } }
      const clash = [...adj].filter(k => col[k[0]] != null && col[k[0]] === col[k[1]]).length, left = regions.filter(a => col[a] == null).length;
      info.textContent = `${left} zone(s) à colorier` + (clash ? ` · ${clash} voisinage(s) de même couleur` : '') + ` · ${p.k} couleurs`;
      if (!left && !clash) solvedOnce(b, win)();
    };
    const c = pad(Q * S + 2, R * S + 2, 4, (x, y) => { if (b.dataset.done) return; const a = M[Math.floor((y - 1) / S)]?.[Math.floor((x - 1) / S)]; if (!a || a === '.' || (p.fixed && a in p.fixed)) return; col[a] = col[a] == null ? 0 : col[a] + 1 >= p.k ? undefined : col[a] + 1; if (col[a] === undefined) delete col[a]; draw(); });
    const b = el('div', 'board'); b.append(c); draw();
    return [b, info, btn('TOUT EFFACER', () => { delete b.dataset.done; for (const k in col) if (!(p.fixed && k in p.fixed)) delete col[k]; draw(); })];
  }

  // les tuyaux : tourne les tuiles pour mener l'eau de la source à la vasque
  const rotM = m => ((m << 1) | (m >> 3)) & 15;
  function pipes(p, win) {
    const R = p.grid.length, Q = p.grid[0].length, S = 12, r0 = rng(p.seed || 3), info = note('');
    let m = p.grid.map(row => [...row].map(ch => parseInt(ch, 16)));
    const fixed = (r, q) => (r === p.src[0] && q === p.src[1]) || (r === p.dst[0] && q === p.dst[1]);
    const scramble = () => { m = p.grid.map(row => [...row].map(ch => parseInt(ch, 16))); for (let r = 0; r < R; r++) for (let q = 0; q < Q; q++) if (!fixed(r, q)) { let k = 1 + Math.floor(r0() * 3); while (k--) m[r][q] = rotM(m[r][q]); } };
    const flow = () => { const seen = new Set([p.src.join()]), st = [p.src]; while (st.length) { const [r, q] = st.pop(); for (const [bit, dr, dq, back] of [[1, -1, 0, 4], [2, 0, 1, 8], [4, 1, 0, 1], [8, 0, -1, 2]]) { const rr = r + dr, qq = q + dq; if (m[r][q] & bit && m[rr]?.[qq] != null && m[rr][qq] & back && !seen.has(rr + ',' + qq)) { seen.add(rr + ',' + qq); st.push([rr, qq]); } } } return seen; };
    const draw = () => {
      const g = c.getContext('2d'), wet = flow();
      for (let r = 0; r < R; r++) for (let q = 0; q < Q; q++) {
        const x = q * S, y = r * S, w = wet.has(r + ',' + q), mm = m[r][q];
        for (let yy = 0; yy < S; yy++) for (let xx = 0; xx < S; xx++) px(g, x + xx, y + yy, xx === 0 || yy === 0 ? C.E : (xx + yy * 3) % 13 === 0 ? C.e : C.s);
        const body = w ? C.S : C.Y, hi = w ? C.e : C.y, lo = w ? C.E : C.z;
        const seg = (x0, y0, ww, hh) => { for (let yy = 0; yy < hh; yy++) for (let xx = 0; xx < ww; xx++) px(g, x + x0 + xx, y + y0 + yy, (ww > hh ? yy === 0 : xx === 0) ? hi : (ww > hh ? yy === hh - 1 : xx === ww - 1) ? lo : body); };
        if (mm) seg(4, 4, 4, 4);
        if (mm & 1) seg(4, 0, 4, 5); if (mm & 4) seg(4, 7, 4, 5); if (mm & 8) seg(0, 4, 5, 4); if (mm & 2) seg(7, 4, 5, 4);
        if (r === p.src[0] && q === p.src[1]) stamp(g, SPR.valve, x + 1, y + 1);
        if (r === p.dst[0] && q === p.dst[1]) stamp(g, ['kkkkkkkkkk', 'kxxxxxxxxk', '.k' + (w ? 'eeeeee' : 'XXXXXX') + 'k.', '.kxxxxxxk.', '..kkkkkk..'], x + 1, y + 4);
      }
      const ok = wet.has(p.dst.join()); info.textContent = ok ? 'L\'eau arrive !' : 'Touche une tuile pour la tourner.'; if (ok) solvedOnce(b, win)();
    };
    const c = pad(Q * S, R * S, 4, (x, y) => { if (b.dataset.done) return; const r = Math.floor(y / S), q = Math.floor(x / S); if (m[r]?.[q] == null || fixed(r, q) || !m[r][q]) return; m[r][q] = rotM(m[r][q]); draw(); });
    const b = el('div', 'board'); b.append(c); scramble(); draw();
    return [b, info, btn('REMÉLANGER', () => { delete b.dataset.done; scramble(); draw(); })];
  }

  // remettre dans l'ordre : touche deux cartes pour les échanger
  function order(p, win, lose) {
    let cur = p.start || p.items.map((_, i) => i), sel = -1; const row = el('div', 'deck');
    const draw = () => row.replaceChildren(...cur.map((it, k) => { const [sp, lab] = p.items[it], d = el('div', 'tok' + (sel === k ? ' sel' : '')); const cvs = cv(16, 16), g = cvs.getContext('2d'); const rows = SPR[sp] || SPR.person, pal = PEOPLE[sp] ? { ...C, ...PEOPLE[sp] } : C; stamp(g, rows, Math.floor((16 - rows[0].length) / 2), 16 - rows.length, pal); d.append(big(cvs, 3), el('span', '', lab)); d.onclick = () => { if (b.dataset.done) return; if (sel < 0) sel = k; else { [cur[sel], cur[k]] = [cur[k], cur[sel]]; sel = -1; } draw(); }; return d; }));
    const b = el('div'); b.append(row); draw();
    return [b, btn('VÉRIFIER', () => { if (b.dataset.done) return; (p.answers || [p.a]).some(a => a.every((x, i) => x === cur[i])) ? solvedOnce(b, win)() : lose(); }, '')];
  }

  // l'image cachée (picross) : noircis les cases selon les nombres des lignes et des colonnes
  function picross(p, win) {
    const pic = p.pic, R = pic.length, Q = pic[0].length, S = 7, runs = a => { const o = []; let n = 0; for (const v of a) { if (v) n++; else if (n) { o.push(n); n = 0; } } if (n) o.push(n); return o.length ? o : [0]; };
    const rowsC = pic.map(r => runs([...r].map(ch => ch !== '.'))), colsC = [...Array(Q)].map((_, q) => runs(pic.map(r => r[q] !== '.')));
    const LW = Math.max(...rowsC.map(r => r.length)) * 4 + 2, TH = Math.max(...colsC.map(c => c.length)) * 6 + 2, W = LW + Q * S + 1, H = TH + R * S + 1;
    const st = pic.map(r => [...r].map(() => 0)); let mode = 1, won = false; const info = note('');
    const draw = () => {
      const g = c.getContext('2d'); g.fillStyle = C.p; g.fillRect(0, 0, W, H);
      rowsC.forEach((r, i) => { const t = r.join(' '); mini(g, t, LW - 2 - miniW(t), TH + i * S + 1, C.k); });
      colsC.forEach((cc, q) => cc.forEach((n, k) => mini(g, n, LW + q * S + 2 - (n > 9 ? 2 : 0), TH - 2 - (cc.length - k) * 6 + 1, C.k)));
      for (let r = 0; r < R; r++) for (let q = 0; q < Q; q++) { const x = LW + q * S, y = TH + r * S, s = st[r][q];
        for (let yy = 0; yy <= S; yy++) for (let xx = 0; xx <= S; xx++) { const edge = xx === 0 || yy === 0 || xx === S || yy === S; const thick = (edge && ((xx === 0 && q % 5 === 0) || (yy === 0 && r % 5 === 0))); if (edge) px(g, x + xx, y + yy, thick ? C.k : C.q); else px(g, x + xx, y + yy, won ? (C[pic[r][q]] || C.w) : s === 1 ? C.d : C.w); }
        if (!won && s === 2) { line(g, x + 2, y + 2, x + S - 2, y + S - 2, C.r); line(g, x + S - 2, y + 2, x + 2, y + S - 2, C.r); } }
      info.textContent = won ? 'L\'image apparaît !' : `Mode : ${mode === 1 ? 'noircir' : 'croix (case vide)'}`;
    };
    const check = () => st.every((r, i) => runs(r.map(v => v === 1)).join() === rowsC[i].join()) && colsC.every((cc, q) => runs(st.map(r => r[q] === 1)).join() === cc.join());
    const c = pad(W, H, 3, (x, y) => { if (won) return; const q = Math.floor((x - LW) / S), r = Math.floor((y - TH) / S); if (r < 0 || q < 0 || r >= R || q >= Q) return; st[r][q] = st[r][q] === mode ? 0 : mode; if (check()) { won = true; solvedOnce(b, win)(); } draw(); });
    c.oncontextmenu = e => { e.preventDefault(); mode = 3 - mode; c.onclick(e); mode = 3 - mode; };
    const b = el('div', 'board'); b.append(c); draw();
    const mb = btn('MODE : NOIRCIR', () => { mode = 3 - mode; mb.textContent = mode === 1 ? 'MODE : NOIRCIR' : 'MODE : CROIX'; draw(); });
    return [b, info, row2(mb, btn('EFFACER', () => { if (won) return; st.forEach(r => r.fill(0)); draw(); }))];
  }

  // le miroir : complète la moitié droite pour qu'elle reflète la gauche
  function mirror(p, win) {
    const L = p.left, R = L.length, half = L[0].length, Q = half * 2, S = 6, pal = [...new Set(L.join('').replace(/\./g, ''))], st = L.map(() => Array(half).fill('.')), info = note('');
    const draw = () => {
      const g = c.getContext('2d');
      for (let r = 0; r < R; r++) for (let q = 0; q < Q; q++) { const ch = q < half ? L[r][q] : st[r][q - half]; for (let yy = 0; yy < S; yy++) for (let xx = 0; xx < S; xx++) px(g, q * S + xx, r * S + yy, xx === 0 || yy === 0 ? (q < half ? C.P : C.q) : ch !== '.' ? C[ch] : q < half ? C.p : C.w); }
      for (let y = 0; y < R * S; y++) px(g, half * S, y, C.r);
      const ok = st.every((row, r) => row.every((ch, q) => ch === L[r][half - 1 - q])); info.textContent = ok ? 'Parfaitement symétrique !' : `Touche une case pour changer sa couleur (${pal.length} couleur${pal.length > 1 ? 's' : ''}).`;
      if (ok) solvedOnce(b, win)();
    };
    const c = pad(Q * S + 1, R * S + 1, 4, (x, y) => { if (b.dataset.done) return; const q = Math.floor(x / S) - half, r = Math.floor(y / S); if (q < 0 || q >= half || r < 0 || r >= R) return; const cyc = ['.', ...pal]; st[r][q] = cyc[(cyc.indexOf(st[r][q]) + 1) % cyc.length]; draw(); });
    const b = el('div', 'board'); b.append(c); draw();
    return [b, info, btn('EFFACER', () => { if (b.dataset.done) return; st.forEach(r => r.fill('.')); draw(); })];
  }

  // la tour de disques : déplace la pile sur le dernier piquet, jamais un grand disque sur un petit
  function hanoi(p, win) {
    const n = p.disks, W = 96, H = 44, info = note(''); let pegs, sel = -1, moves = 0;
    const reset = () => { pegs = [[...Array(n)].map((_, i) => n - i), [], []]; sel = -1; moves = 0; draw(); };
    const cols = [C.r, C.o, C.y, C.g, C.S, C.v, C.j];
    const draw = () => {
      const g = c.getContext('2d'); BACK.tour(g, W, H); g.fillStyle = C.h; g.fillRect(2, H - 4, W - 4, 3);
      pegs.forEach((pg, i) => { const cx = 16 + i * 32; g.fillStyle = sel === i ? C.l : C.b; g.fillRect(cx - 1, 8, 3, H - 12); pg.forEach((d, k) => { const w = 4 + d * 4, y = H - 7 - k * 4; for (let yy = 0; yy < 3; yy++) for (let xx = 0; xx < w; xx++) px(g, cx - w / 2 + xx + 1, y + yy, xx === 0 || xx === w - 1 || yy === 2 ? C.k : yy === 0 ? C.w : cols[(d - 1) % cols.length]); }); });
      info.textContent = `Déplacements : ${moves}${p.max ? ' (en ' + p.max + ' au plus)' : ''}`;
    };
    const c = pad(W, H, 4, x => {
      if (b.dataset.done) return; const i = Math.min(2, Math.floor(x / 32));
      if (sel < 0) { if (pegs[i].length) sel = i; } else { const d = pegs[sel].at(-1); if (i !== sel && (!pegs[i].length || pegs[i].at(-1) > d)) { pegs[i].push(pegs[sel].pop()); moves++; } sel = -1; }
      draw(); if (pegs[2].length === n && (!p.max || moves <= p.max)) solvedOnce(b, win)();
    });
    const b = el('div', 'board'); b.append(c); reset();
    return [b, info, btn('RECOMMENCER', () => { delete b.dataset.done; reset(); })];
  }

  // le labyrinthe : flèches ou clavier ; « k » une clé, « d » une porte qu'elle ouvre
  function maze(p, win) {
    const M = p.maze.map(r => [...r]), R = M.length, Q = M[0].length, S = 8, info = note(''); let at, keys;
    const tile = { hedge: [C.G, C.g, C.T], rock: [C.X, C.d, C.x], stone: [C.X, '#8a8490', C.x] }[p.tiles || 'stone'];
    const reset = () => { M.splice(0, R, ...p.maze.map(r => [...r])); for (let r = 0; r < R; r++) for (let q = 0; q < Q; q++) if (M[r][q] === 'S') at = [r, q]; keys = 0; draw(); };
    const draw = () => {
      const g = c.getContext('2d');
      for (let r = 0; r < R; r++) for (let q = 0; q < Q; q++) { const ch = M[r][q], x = q * S, y = r * S;
        for (let yy = 0; yy < S; yy++) for (let xx = 0; xx < S; xx++) px(g, x + xx, y + yy, ch === '#' ? ((xx + yy * 2 + q * 3 + r) % 5 === 0 ? tile[2] : yy === S - 1 ? C.k : tile[0]) : ((xx * 3 + yy + q + r) % 9 === 0 ? C.P : C.p));
        if (ch === 'E') stamp(g, ['.kkkkk.', 'kyyyyyk', 'ky.k.yk', 'kyyyyyk', 'ky.k.yk', 'kyyyyyk', 'kkkkkkk'], x, y);
        if (ch === 'k') stamp(g, ['.kkk...', 'kyyyk..', 'kykykkk', 'kyyyyyk', '.kkk.k.'], x, y + 1);
        if (ch === 'd') stamp(g, ['kkkkkkk', 'kbhbhbk', 'kbhbhbk', 'kbhyhbk', 'kbhbhbk', 'kbhbhbk', 'kkkkkkk'], x, y);
      }
      stamp(g, ['..kk..', '.kffk.', '.kffk.', 'kccccK'.replace('K', 'k'), '.kcck.', '.k..k.'], at[1] * S + 1, at[0] * S + 1);
      info.textContent = keys ? 'Tu as ' + keys + ' clé' + (keys > 1 ? 's' : '') + '.' : 'Flèches du clavier ou boutons pour avancer.';
    };
    const go = (dr, dq) => { if (b.dataset.done) return; const r = at[0] + dr, q = at[1] + dq, ch = M[r]?.[q]; if (!ch || ch === '#') return; if (ch === 'd') { if (!keys) { info.textContent = 'Une porte fermée : il faut une clé.'; return; } keys--; M[r][q] = '.'; } if (ch === 'k') { keys++; M[r][q] = '.'; } at = [r, q]; draw(); if (ch === 'E') solvedOnce(b, win)(); };
    const c = pad(Q * S, R * S, 4, (x, y) => { const dq = Math.floor(x / S) - at[1], dr = Math.floor(y / S) - at[0]; if (Math.abs(dq) + Math.abs(dr) === 1) go(dr, dq); });
    const b = el('div', 'board'); b.append(c); b.tabIndex = 0; b.onkeydown = e => { const d = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key]; if (d) { e.preventDefault(); go(...d); } };
    reset(); setTimeout(() => b.focus({ preventScroll: true }), 80);
    return [b, info, row2(btn('◀', () => go(0, -1)), btn('▲', () => go(-1, 0)), btn('▼', () => go(1, 0)), btn('▶', () => go(0, 1)), btn('RECOMMENCER', () => { delete b.dataset.done; reset(); }))];
  }

  // le cadenas : tourne les molettes
  function lock(p, win, lose) {
    const n = String(p.a).length, v = Array(n).fill(0), row = el('div', 'wheels');
    const draw = () => row.replaceChildren(...v.map((d, i) => { const w = el('div', 'wheel'); const up = btn('▲', () => { v[i] = (v[i] + 1) % 10; draw(); }), dn = btn('▼', () => { v[i] = (v[i] + 9) % 10; draw(); }); w.append(up, el('b', '', String(d)), dn); return w; }));
    const b = el('div'); b.append(sprite(SPR.padlock, 6), row); b.style.cssText = 'display:flex;align-items:center;gap:14px;flex-wrap:wrap;justify-content:center'; draw();
    return [b, btn('OUVRIR', () => { if (b.dataset.done) return; v.join('') === String(p.a) ? solvedOnce(b, win)() : lose('Le cadenas ne bouge pas.'); }, '')];
  }

  // régler l'horloge sur la bonne heure
  function clockset(p, win, lose) {
    let h = 12, m = 0; const c = cv(40, 40); const draw = () => { const g = c.getContext('2d'); g.clearRect(0, 0, 40, 40); clockFace(g, 20, 20, 18, h + ':' + m); lab.textContent = h + ' h ' + String(m).padStart(2, '0'); };
    const lab = el('b', 'big'); const add = k => { const t = ((h % 12) * 60 + m + k + 720) % 720; h = Math.floor(t / 60) || 12; m = t % 60; draw(); };
    const b = el('div'); b.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:8px'; b.append(big(c, 5), lab); draw();
    return [b, row2(btn('− 1 H', () => add(-60)), btn('− 5 MIN', () => add(-5)), btn('+ 5 MIN', () => add(5)), btn('+ 1 H', () => add(60))),
      btn('C\'EST L\'HEURE', () => { if (b.dataset.done) return; const [ah, am] = String(p.a).split(':').map(Number); ((h % 12) === (ah % 12) && m === am) ? solvedOnce(b, win)() : lose(); }, '')];
  }

  // choisir la bonne image
  function pick(p, win, lose) {
    const row = el('div', 'deck'); const b = el('div'); b.append(row);
    p.opts.forEach(([items, lab], k) => { const d = el('div', 'tok wide'); d.append(scene(p.bg || 'tour', items, 40, 30), el('span', '', lab)); d.onclick = () => { if (b.dataset.done) return; k === p.a ? solvedOnce(b, win)() : lose(); }; row.append(d); });
    return [b];
  }

  // d'un seul trait : passe par chaque chemin une seule fois, sans lever le crayon
  function oneline(p, win) {
    const W = p.w || 96, H = p.h || 60, used = new Set(), info = note(''); let at = -1;
    const key = (a, z) => Math.min(a, z) + '-' + Math.max(a, z);
    const draw = () => {
      const g = c.getContext('2d'); (BACK[p.bg] || BACK.observatoire)(g, W, H);
      p.edges.forEach(([a, z]) => { const [x0, y0] = p.nodes[a], [x1, y1] = p.nodes[z], u = used.has(key(a, z)); if (u) { line(g, x0, y0, x1, y1, C.l); line(g, x0 + 1, y0, x1 + 1, y1, C.y); } else { const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 3); for (let i = 0; i <= n; i += 2) px(g, Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n), C.W); } });
      p.nodes.forEach(([x, y], i) => stamp(g, i === at ? ['.kkk.', 'klllk', 'klwlk', 'klllk', '.kkk.'] : ['.kkk.', 'kyyyk', 'kyYyk', 'kYYYk', '.kkk.'], x - 2, y - 2));
      info.textContent = `${used.size} / ${p.edges.length} chemins` + (at < 0 ? ' · touche un point pour commencer' : '');
      if (used.size === p.edges.length) solvedOnce(b, win)();
    };
    const c = pad(W, H, 4, (x, y) => {
      if (b.dataset.done) return; let best = -1, bd = 6; p.nodes.forEach(([nx, ny], i) => { const d = Math.hypot(nx - x, ny - y); if (d < bd) { bd = d; best = i; } }); if (best < 0) return;
      if (at < 0) at = best; else { const e = p.edges.find(([a, z]) => (a === at && z === best || z === at && a === best) && !used.has(key(a, z))); if (e) { used.add(key(at, best)); at = best; } }
      draw();
    });
    const b = el('div', 'board'); b.append(c); draw();
    return [b, info, btn('RECOMMENCER', () => { delete b.dataset.done; used.clear(); at = -1; draw(); })];
  }

  // la grille latine : chaque ligne et chaque colonne (et chaque bloc) contient chaque symbole une seule fois
  function latin(p, win) {
    const n = p.size, S = 12, syms = p.syms, g0 = p.given.map(r => [...r].map(ch => ch === '.' ? 0 : +ch)), st = g0.map(r => [...r]), info = note('');
    const draw = () => {
      const g = c.getContext('2d'); g.fillStyle = C.k; g.fillRect(0, 0, n * S + 1, n * S + 1);
      for (let r = 0; r < n; r++) for (let q = 0; q < n; q++) { const x = q * S + 1, y = r * S + 1, v = st[r][q]; g.fillStyle = g0[r][q] ? C.P : C.p; g.fillRect(x, y, S - 1, S - 1);
        if (v) { if (syms) stamp(g, SPR[syms[v - 1]], x + Math.floor((S - 1 - SPR[syms[v - 1]][0].length) / 2), y + Math.floor((S - 1 - SPR[syms[v - 1]].length) / 2)); else mini(g, v, x + 4, y + 3, g0[r][q] ? C.k : C.c); } }
      if (p.box) { g.fillStyle = C.R; for (let k = p.box[0]; k < n; k += p.box[0]) g.fillRect(0, k * S, n * S + 1, 1); for (let k = p.box[1]; k < n; k += p.box[1]) g.fillRect(k * S, 0, 1, n * S + 1); }
      const full = st.every(r => r.every(Boolean)), uniq = a => new Set(a).size === a.length;
      let ok = full && st.every(uniq) && [...Array(n)].every((_, q) => uniq(st.map(r => r[q])));
      if (ok && p.box) for (let br = 0; br < n; br += p.box[0]) for (let bq = 0; bq < n; bq += p.box[1]) { const a = []; for (let r = br; r < br + p.box[0]; r++) for (let q = bq; q < bq + p.box[1]; q++) a.push(st[r][q]); ok = ok && uniq(a); }
      info.textContent = ok ? 'Tout est en ordre !' : 'Touche une case vide pour changer son symbole.'; if (ok) solvedOnce(b, win)();
    };
    const c = pad(n * S + 1, n * S + 1, 4, (x, y) => { if (b.dataset.done) return; const r = Math.floor(y / S), q = Math.floor(x / S); if (r >= n || q >= n || g0[r][q]) return; st[r][q] = (st[r][q] + 1) % (n + 1); draw(); });
    const b = el('div', 'board'); b.append(c); draw();
    return [b, info];
  }

  // les grenouilles : chacune avance vers l'autre bord, en glissant ou en sautant par-dessus une voisine
  function frogs(p, win) {
    const start = [...p.row], goal = [...(p.goal || [...p.row].reverse().join(''))], info = note(''); let st, moves = 0;
    const SPRS = { R: p.sprR || 'frog', B: p.sprB || 'frogb' };
    const reset = () => { st = [...start]; moves = 0; draw(); };
    const draw = () => {
      const W = st.length * 14 + 2, g = c.getContext('2d'); for (let y = 0; y < 16; y++) for (let x = 0; x < W; x++) px(g, x, y, y > 11 ? ((x + y) % 5 === 0 ? C.e : C.S) : C.S);
      st.forEach((ch, i) => { const x = 1 + i * 14; for (let yy = 9; yy < 13; yy++) for (let xx = 0; xx < 12; xx++) px(g, x + xx, yy, (xx === 0 || xx === 11 || yy === 12) ? C.G : C.g); if (ch !== '.') stamp(g, SPR[SPRS[ch]], x + 1, 2, C, ch === 'B'); });
      info.textContent = `Sauts et pas : ${moves}`;
    };
    const c = pad(start.length * 14 + 2, 16, 5, x => {
      if (b.dataset.done) return; const i = Math.floor((x - 1) / 14), ch = st[i]; if (!ch || ch === '.') return; const dir = ch === 'R' ? 1 : -1;
      if (st[i + dir] === '.') { st[i + dir] = ch; st[i] = '.'; moves++; } else if (st[i + dir] && st[i + 2 * dir] === '.') { st[i + 2 * dir] = ch; st[i] = '.'; moves++; } else return;
      draw(); if (st.join('') === goal.join('')) solvedOnce(b, win)(); else if (!st.some((v, k) => v !== '.' && (st[k + (v === 'R' ? 1 : -1)] === '.' || (st[k + (v === 'R' ? 1 : -1)] && st[k + (v === 'R' ? 2 : -2)] === '.')))) info.textContent = 'Plus personne ne peut bouger : recommence.';
    });
    const b = el('div', 'board'); b.append(c); reset();
    return [b, info, btn('RECOMMENCER', () => { delete b.dataset.done; reset(); })];
  }
  const ENGINES = { lights, slide, magic, match, river, jugs, queens, color, pipes, order, picross, mirror, hanoi, maze, lock, clockset, pick, oneline, latin, frogs };
  // </moteurs>
  /* ---------- une énigme ---------- */
  const SAYS = ['Voyons si tu es aussi malin qu\'on le dit.', 'Prends ton temps, la marée attendra.', 'Les archives ne s\'ouvrent qu\'aux esprits patients.', 'Une fleur ne pousse pas plus vite si on tire dessus.',
    'Respire la vapeur, et réfléchis tranquillement.', 'Dans la mine, on avance pas à pas.', 'Le rideau se lève : à toi de jouer !', 'Les étoiles ont tout leur temps. Et toi ?'];
  // le genre de chaque énigme, avec son petit dessin
  const KINDS = { Calcul: 'coin', Logique: 'key', Mots: 'book', Manipulation: 'lamp', Observation: 'star', Déduction: 'mask', Astuce: 'bell' };
  const ENGINE_KIND = { num: 'Calcul', text: 'Mots', choice: 'Logique', pick: 'Observation', order: 'Déduction', lock: 'Déduction', clockset: 'Calcul', color: 'Logique', latin: 'Logique', picross: 'Logique', queens: 'Logique', mirror: 'Observation' };
  const kindOf = p => (typeof p.k === 'string' && p.k) || ENGINE_KIND[p.type] || 'Manipulation'; // pour « color », k est le nombre de couleurs
  // le brouillon : un carnet pour griffonner par-dessus l'énigme
  const memos = {};
  function memo(p, host) {
    const box = el('div', 'memo'), c = cv(160, 110), g = c.getContext('2d'); c.className = 'spr'; c.style.cssText = 'width:100%;height:auto;image-rendering:pixelated;touch-action:none;cursor:crosshair';
    if (memos[p.id]) g.putImageData(memos[p.id], 0, 0); else { g.fillStyle = C.p; g.fillRect(0, 0, 160, 110); for (let y = 10; y < 110; y += 10) { g.fillStyle = C.P; g.fillRect(0, y, 160, 1); } }
    let ink = C.k, last = null;
    const at = e => { const r = c.getBoundingClientRect(); return [Math.floor((e.clientX - r.left) / r.width * 160), Math.floor((e.clientY - r.top) / r.height * 110)]; };
    c.onpointerdown = e => { c.setPointerCapture(e.pointerId); last = at(e); px(g, ...last, ink); };
    c.onpointermove = e => { if (!last) return; const q = at(e); line(g, ...last, ...q, ink); if (ink === C.p) { line(g, last[0] + 1, last[1], q[0] + 1, q[1], ink); line(g, last[0], last[1] + 1, q[0], q[1] + 1, ink); } last = q; };
    c.onpointerup = () => { last = null; memos[p.id] = g.getImageData(0, 0, 160, 110); };
    const tools = el('div', 'row2');
    const pen = (t, col) => { const b = el('button', 'dark', t); b.onclick = () => { ink = col; }; return b; };
    const clear = el('button', 'dark', 'TOUT EFFACER'); clear.onclick = () => { delete memos[p.id]; box.remove(); memo(p, host); };
    const close = el('button', '', 'FERMER'); close.onclick = () => box.remove();
    tools.append(pen('CRAYON', C.k), pen('ROUGE', C.R), pen('GOMME', C.p), clear, close);
    box.append(el('div', 'label', 'BROUILLON'), c, tools); host.append(box);
  }
  // l'histoire d'un côté, la question de l'autre (le dernier paragraphe, ou à défaut la dernière phrase), bien en vue
  function splitQ(q) {
    const parts = q.split(/\n\n+/); if (parts.length > 1) return [parts.slice(0, -1).join('\n\n'), parts.at(-1)];
    const m = q.match(/^([\s\S]*[.!»])\s+([^.!?»]*[^\s][^.!»]*[.!?]?)$/); return m && m[1].length > 20 ? [m[1], m[2]] : ['', q];
  }
  console.assert(splitQ('Une histoire.\n\nTrouve X.')[1] === 'Trouve X.' && splitQ('Il fait nuit sur le port ce soir. Combien de bateaux ?')[1] === 'Combien de bateaux ?' && splitQ('Combien ?')[1] === 'Combien ?', 'splitQ');
  function puzzle(p, d) {
    const card = el('div', 'parch pz'), head = el('div', 'head'), msg = el('div', 'msg'), stamp = el('div', 'stamp'), after = el('div');
    const solved = () => st.solved[p.id], val = el('span', 'val');
    const setVal = () => { val.textContent = solved() ? 'résolue : ' + solved() + ' étincelles' : 'vaut ' + worth(p) + ' étincelles'; };
    const kind = el('span', 'kind'); kind.append(sprite(SPR[KINDS[kindOf(p)]] || SPR.key, 2), kindOf(p));
    const memoBtn = el('button', 'dark small', 'BROUILLON'); memoBtn.onclick = () => { if (!card.querySelector('.memo')) memo(p, card); card.querySelector('.memo')?.scrollIntoView({ block: 'nearest' }); };
    head.append(el('span', 'num', String(p.n)), el('h2', '', p.t), kind, val, memoBtn); setVal();
    const says = el('div', 'says'); says.append(face(d.who, 3), el('div', 'bubble', d.whoName.split(',')[0] + ' : « ' + SAYS[D.indexOf(d)] + ' »'));
    card.append(head);
    if (p.sc) { const sc = el('div', 'scene'); sc.append(scene(p.d, p.sc)); card.append(sc); }
    const [story, goal] = splitQ(p.q), gb = el('div', 'goal'); gb.append(el('b', '', 'CE QU\'IL FAUT TROUVER'), goal);
    card.append(says); if (story) card.append(el('div', 'q', story)); card.append(gb, stamp);
    if (p.fig) card.append(FIG[p.fig]());
    const showWhy = () => {
      after.replaceChildren(el('div', 'why', p.why));
      const list = P.filter(x => x.d === p.d), nx = list[list.indexOf(p) + 1], row = el('div', 'ans'), back = el('button', 'dark', 'RETOUR AU QUARTIER'); back.onclick = () => district(d); row.append(back);
      if (nx) { const go = el('button', '', 'ÉNIGME SUIVANTE >'); go.onclick = () => puzzle(nx, d); row.append(go); }
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
      const parts = ENGINES[p.type](p, win, lose), box = el('div'); box.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:10px;width:100%'; box.append(...parts); ans.append(box);
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
  globalThis.__valcendre = { P, D, puzzle, district, map };  // pour le test automatique de NeoDex
  title();
}
