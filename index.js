// Valcendre : l'horloge aux énigmes. Un jeu d'énigmes original : la grande horloge de Valcendre s'est arrêtée, chaque énigme résolue
// rend un rouage. 30 énigmes en trois quartiers (le Marché, le Port, la Tour), des indices payés en bougies, des énigmes à manipuler.
// Plugin autonome : seulement la permission « storage » (il tourne dans le bac à sable de NeoBase).
export default async function (ctx) {
  const el = ctx.el, $ = s => ctx.view.querySelector(s);
  const css = el('style');
  css.textContent = `
  .vc{--nuit:#0f1726;--nuit2:#17233a;--cuivre:#c98a4b;--cuivre2:#e8b77a;--papier:#efe4c9;--papier2:#e2d3ae;--encre:#2a2018;--rouge:#a8402e;--vert:#3f7a4a;
      position:relative;min-height:100%;box-sizing:border-box;padding:26px 18px 40px;color:var(--papier);font:16px/1.5 Georgia,'Times New Roman',serif;
      background:radial-gradient(ellipse at 50% -10%,#24365a 0,var(--nuit) 60%) fixed;overflow:hidden}
  .vc *{box-sizing:border-box}
  .vc .bg{position:absolute;inset:0;pointer-events:none;opacity:.07}
  .vc .bg svg{position:absolute;animation:vcTurn 60s linear infinite}
  .vc .bg svg.r{animation-direction:reverse;animation-duration:44s}
  @keyframes vcTurn{to{transform:rotate(360deg)}}
  .vc .wrap{position:relative;max-width:860px;margin:0 auto}
  .vc h1{font:italic 700 38px/1.1 Georgia,serif;margin:0;color:var(--cuivre2);letter-spacing:.5px;text-shadow:0 2px 0 #0008}
  .vc h2{font:italic 700 24px Georgia,serif;margin:0 0 4px;color:var(--cuivre2)}
  .vc .sub{color:#b9c3d6;font-style:italic}
  .vc .bar{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin:0 0 20px}
  .vc .bar .sp{flex:1}
  .vc .chip{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border:1px solid #c98a4b88;border-radius:20px;color:var(--cuivre2);font-size:14px;background:#0006}
  .vc button{font:600 15px Georgia,serif;color:var(--encre);background:linear-gradient(#f0c88f,#c98a4b);border:0;border-radius:6px;padding:9px 18px;cursor:pointer;
      box-shadow:0 3px 0 #7a4f26,0 5px 10px #0006;transition:transform .08s,filter .15s}
  .vc button:hover{filter:brightness(1.08)} .vc button:active{transform:translateY(2px);box-shadow:0 1px 0 #7a4f26}
  .vc button.ghost{background:transparent;color:var(--cuivre2);box-shadow:inset 0 0 0 1px #c98a4b99}
  .vc button:disabled{opacity:.45;cursor:default;filter:none}
  .vc .paper{position:relative;color:var(--encre);background:var(--papier);border-radius:4px;padding:26px 28px;
      box-shadow:0 0 0 1px #0002,0 18px 40px #0008,inset 0 0 60px #c4a77266;background-image:repeating-linear-gradient(0deg,transparent 0 31px,#8a6a3a14 31px 32px)}
  .vc .paper:before{content:'';position:absolute;inset:8px;border:1px solid #8a6a3a55;border-radius:2px;pointer-events:none}
  .vc .title{text-align:center;padding:40px 0 10px}
  .vc .title .clock{width:220px;height:220px;margin:0 auto 18px;display:block;filter:drop-shadow(0 10px 30px #c98a4b44)}
  .vc .title p{max-width:560px;margin:14px auto 26px;color:#cfd6e4}
  .vc .districts{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px}
  .vc .dist{cursor:pointer;transition:transform .15s}
  .vc .dist:hover{transform:translateY(-3px) rotate(-.4deg)}
  .vc .dist.lock{cursor:default;filter:grayscale(1) brightness(.6)} .vc .dist.lock:hover{transform:none}
  .vc .dist .who{display:flex;gap:12px;align-items:center;margin-top:10px}
  .vc .dist svg.face{width:56px;height:56px;flex:none}
  .vc .prog{height:8px;border-radius:4px;background:#8a6a3a33;margin-top:12px;overflow:hidden} .vc .prog i{display:block;height:100%;background:var(--cuivre)}
  .vc .meds{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px;margin-top:18px}
  .vc .med{cursor:pointer;text-align:center;padding:16px 10px 12px;border-radius:10px;background:var(--nuit2);box-shadow:inset 0 0 0 1px #c98a4b55;transition:transform .12s,box-shadow .12s}
  .vc .med:hover{transform:translateY(-2px);box-shadow:inset 0 0 0 1px var(--cuivre2),0 8px 18px #0007}
  .vc .med b{display:block;font:italic 700 30px Georgia,serif;color:var(--cuivre2)}
  .vc .med span{display:block;font-size:13px;color:#cfd6e4;margin-top:2px}
  .vc .med.ok{background:linear-gradient(#2a3c2e,#1d2b22);box-shadow:inset 0 0 0 1px #7fbf8a88} .vc .med.ok b{color:#9fdcaa}
  .vc .med small{display:block;font-size:12px;color:#9aa6bd;margin-top:6px}
  .vc .pz{display:grid;grid-template-columns:1fr;gap:16px}
  .vc .pz .head{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;border-bottom:1px solid #8a6a3a55;padding-bottom:10px;margin-bottom:14px}
  .vc .pz .num{font:italic 700 40px Georgia,serif;color:var(--rouge);line-height:1}
  .vc .pz .head h2{color:var(--encre)} .vc .pz .val{margin-left:auto;font-style:italic;color:#6b5434}
  .vc .pz .q{font-size:18px;white-space:pre-line}
  .vc .pz .says{display:flex;gap:12px;align-items:flex-start;margin-bottom:12px;font-style:italic;color:#5a4630}
  .vc .pz .says svg{width:46px;height:46px;flex:none}
  .vc .pz .fig{display:flex;justify-content:center;margin:14px 0}
  .vc .pz .fig svg{max-width:100%}
  .vc .ans{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:18px}
  .vc .ans input{font:18px Georgia,serif;padding:9px 12px;border:0;border-bottom:2px solid var(--encre);background:#fff6;width:200px;color:var(--encre);outline:none}
  .vc .opts{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;width:100%}
  .vc .opts button{background:#fff7;color:var(--encre);box-shadow:inset 0 0 0 1px #8a6a3a88} .vc .opts button:hover{background:#fff}
  .vc .stamp{position:absolute;right:24px;top:70px;font:italic 900 34px Georgia,serif;padding:4px 16px;border:4px solid;border-radius:8px;transform:rotate(-12deg) scale(2.2);opacity:0;pointer-events:none;transition:transform .25s cubic-bezier(.2,1.6,.4,1),opacity .2s}
  .vc .stamp.on{opacity:.85;transform:rotate(-12deg) scale(1)} .vc .stamp.good{color:var(--vert)} .vc .stamp.bad{color:var(--rouge)}
  .vc .hints{display:flex;gap:10px;flex-wrap:wrap;margin-top:6px}
  .vc .hint{flex:1 1 220px;padding:12px 14px;border-radius:6px;background:#0f172699;color:#e9edf5;font-size:15px}
  .vc .hint.closed{cursor:pointer;color:var(--cuivre2);text-align:center;background:#0f1726cc;box-shadow:inset 0 0 0 1px #c98a4b66}
  .vc .why{margin-top:18px;padding:14px 16px;border-left:4px solid var(--vert);background:#3f7a4a1a;color:var(--encre)}
  .vc .msg{min-height:24px;margin-top:8px;font-style:italic;color:var(--rouge)}
  .vc .board{display:inline-grid;gap:8px;padding:14px;border-radius:10px;background:#2a2018}
  .vc .lamp{width:58px;height:58px;border-radius:50%;cursor:pointer;background:radial-gradient(circle at 40% 35%,#4a3b2a,#1d1610);box-shadow:inset 0 0 0 3px #6b5434;transition:background .2s,box-shadow .2s}
  .vc .lamp.on{background:radial-gradient(circle at 40% 35%,#fff6c8,#f2b84b 55%,#b36a1c);box-shadow:inset 0 0 0 3px #f6d58e,0 0 18px #f2b84b99}
  .vc .tile{width:70px;height:70px;display:flex;align-items:center;justify-content:center;font:italic 700 28px Georgia,serif;color:var(--encre);cursor:pointer;
      background:linear-gradient(135deg,#d9b07a,#a87842);border-radius:4px;box-shadow:inset 0 0 0 2px #7a4f26,inset 3px 3px 0 #f0d3a466;transition:transform .12s}
  .vc .tile.empty{background:none;box-shadow:none;cursor:default}
  .vc .magic input{width:64px;height:64px;text-align:center;font:italic 700 28px Georgia,serif;border:0;border-radius:4px;background:var(--papier2);color:var(--encre);outline:none}
  .vc .magic input:focus{box-shadow:0 0 0 2px var(--cuivre)}
  .vc .final{text-align:center;padding:30px 0}
  .vc .final .clock{width:260px;height:260px}
  @media (max-width:600px){ .vc h1{font-size:30px} .vc .paper{padding:20px 16px} .vc .lamp{width:46px;height:46px} .vc .tile{width:58px;height:58px} }`;
  document.head.append(css);

  /* ---------- les personnages (dessinés ici, à plat) ---------- */
  const FACES = {
    brindille: `<svg class="face" viewBox="0 0 64 64"><circle cx="32" cy="32" r="31" fill="#2b3d5c"/><path d="M14 30c0-14 36-14 36 0z" fill="#fff"/><ellipse cx="20" cy="22" rx="8" ry="7" fill="#fff"/><ellipse cx="32" cy="17" rx="9" ry="8" fill="#fff"/><ellipse cx="44" cy="22" rx="8" ry="7" fill="#fff"/><circle cx="32" cy="38" r="13" fill="#f2c9a0"/><circle cx="27" cy="37" r="1.8" fill="#2a2018"/><circle cx="37" cy="37" r="1.8" fill="#2a2018"/><path d="M27 43q5 4 10 0" stroke="#2a2018" stroke-width="1.8" fill="none"/><circle cx="23" cy="42" r="2.5" fill="#e89a8a"/><circle cx="41" cy="42" r="2.5" fill="#e89a8a"/><path d="M16 64c2-10 30-10 32 0" fill="#c98a4b"/></svg>`,
    octave: `<svg class="face" viewBox="0 0 64 64"><circle cx="32" cy="32" r="31" fill="#1d3b47"/><circle cx="32" cy="37" r="13" fill="#d9a77a"/><path d="M17 31h30l-3-9H20z" fill="#24324a"/><rect x="14" y="29" width="36" height="4" rx="2" fill="#1a2436"/><circle cx="27" cy="37" r="1.8" fill="#2a2018"/><circle cx="37" cy="37" r="1.8" fill="#2a2018"/><path d="M22 44q10 8 20 0v4q-10 8-20 0z" fill="#8a5a3a"/><path d="M16 64c2-10 30-10 32 0" fill="#3d6b7a"/><path d="M26 54l6 6 6-6" stroke="#fff" stroke-width="2" fill="none"/></svg>`,
    yse: `<svg class="face" viewBox="0 0 64 64"><circle cx="32" cy="32" r="31" fill="#3a2a4a"/><path d="M16 40c-2-20 34-20 32 0v14H16z" fill="#5a3a2a"/><circle cx="32" cy="36" r="12" fill="#f0cfae"/><circle cx="27" cy="36" r="4" fill="none" stroke="#c98a4b" stroke-width="1.6"/><circle cx="37" cy="36" r="4" fill="none" stroke="#c98a4b" stroke-width="1.6"/><path d="M31 36h2" stroke="#c98a4b" stroke-width="1.6"/><circle cx="27" cy="36" r="1.4" fill="#2a2018"/><circle cx="37" cy="36" r="1.4" fill="#2a2018"/><path d="M29 43q3 2 6 0" stroke="#2a2018" stroke-width="1.6" fill="none"/><path d="M16 64c2-10 30-10 32 0" fill="#6a4a8a"/></svg>`,
  };
  const gearPath = (cx, cy, r, teeth) => { let d = ''; const st = Math.PI * 2 / teeth, R = r * 1.2, pt = (a, rr) => (cx + Math.cos(a) * rr).toFixed(1) + ' ' + (cy + Math.sin(a) * rr).toFixed(1); for (let i = 0; i < teeth; i++) { const a = i * st; d += (i ? 'L' : 'M') + pt(a, r) + 'L' + pt(a + st * .12, R) + 'L' + pt(a + st * .42, R) + 'L' + pt(a + st * .54, r); } return d + 'Z'; };  // des dents trapézoïdales, comme une vraie roue d'horloge
  // l'horloge de Valcendre : ses aiguilles bougent quand elle est réparée
  const clockSvg = (repaired, cls = 'clock') => `<svg class="${cls}" viewBox="0 0 200 200"><path d="${gearPath(100, 100, 92, 24)}" fill="#7a4f26"/><circle cx="100" cy="100" r="86" fill="#efe4c9" stroke="#c98a4b" stroke-width="6"/>
    ${Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return `<text x="${100 + Math.sin(a) * 68}" y="${100 - Math.cos(a) * 68 + 7}" text-anchor="middle" font-family="Georgia" font-style="italic" font-size="18" fill="#2a2018">${['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'][i]}</text>`; }).join('')}
    <g style="transform-origin:100px 100px;${repaired ? 'animation:vcTurn 12s linear infinite' : 'transform:rotate(-38deg)'}"><path d="M97 100L100 36L103 100z" fill="#2a2018"/></g>
    <g style="transform-origin:100px 100px;${repaired ? 'animation:vcTurn 144s linear infinite' : 'transform:rotate(112deg)'}"><path d="M96 100L100 56L104 100z" fill="#a8402e"/></g>
    <circle cx="100" cy="100" r="6" fill="#c98a4b"/>${repaired ? '' : '<path d="M60 40l30 40-12 4 26 40" stroke="#2a2018" stroke-width="2" fill="none" opacity=".55"/>'}</svg>`;

  /* ---------- les figures de certaines énigmes ---------- */
  const FIG = {
    gears: (() => { let s = '<svg viewBox="0 0 470 110" width="470">'; for (let i = 0; i < 5; i++) { const cx = 50 + i * 92; s += `<path d="${gearPath(cx, 55, 38, 12)}" fill="${i % 2 ? '#a87842' : '#c98a4b'}" stroke="#7a4f26" stroke-width="2"/><circle cx="${cx}" cy="55" r="9" fill="#efe4c9"/><text x="${cx}" y="61" text-anchor="middle" font-family="Georgia" font-style="italic" font-weight="700" font-size="16" fill="#2a2018">${'ABCDE'[i]}</text>`; } return s + '<path d="M20 12a40 40 0 0 1 50 0" stroke="#a8402e" stroke-width="3" fill="none" marker-end="url(#ar)"/><defs><marker id="ar" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0L8 4L0 8z" fill="#a8402e"/></marker></defs></svg>'; })(),
    grid: '<svg viewBox="0 0 150 150" width="150"><g stroke="#2a2018" stroke-width="3" fill="none"><rect x="5" y="5" width="140" height="140"/><path d="M51.7 5V145M98.3 5V145M5 51.7H145M5 98.3H145"/></g></svg>',
    baskets: `<svg viewBox="0 0 420 120" width="420">${['POMMES', 'POIRES', 'MÉLANGE'].map((t, i) => `<g transform="translate(${20 + i * 135} 10)"><path d="M10 40h100l-12 66H22z" fill="#a87842" stroke="#7a4f26" stroke-width="2"/><path d="M22 40q38-46 76 0" stroke="#7a4f26" stroke-width="4" fill="none"/><rect x="18" y="60" width="84" height="22" fill="#efe4c9" stroke="#2a2018"/><text x="60" y="76" text-anchor="middle" font-family="Georgia" font-size="13" font-weight="700" fill="#2a2018">${t}</text></g>`).join('')}</svg>`,
    well: '<svg viewBox="0 0 160 180" width="140"><rect x="30" y="10" width="100" height="165" fill="#1d1610"/><path d="M30 10v165M130 10v165" stroke="#7a4f26" stroke-width="8"/><g fill="#5a4630" font-family="Georgia" font-size="11">' + Array.from({ length: 11 }, (_, i) => `<path d="M30 ${10 + i * 15}h10" stroke="#c98a4b"/><text x="138" y="${14 + i * 15}">${10 - i} m</text>`).join('') + '</g><ellipse cx="80" cy="166" rx="12" ry="7" fill="#9fdcaa"/><path d="M84 160q8-14 0-16" stroke="#9fdcaa" stroke-width="3" fill="none"/></svg>',
  };

  /* ---------- les énigmes ---------- */
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

  /* ---------- la partie, gardée par NeoBase ---------- */
  let st = (await ctx.storage.get().catch(() => null)) || {};
  st = { solved: {}, tries: {}, hints: {}, bougies: 5, ...st };
  const save = () => ctx.storage.set(st).catch(() => {});
  const solvedIn = d => P.filter(p => p.d === d && st.solved[p.id]).length;
  const unlocked = i => i === 0 || solvedIn(D[i - 1].id) >= UNLOCK;
  const score = () => Object.values(st.solved).reduce((s, v) => s + v, 0);
  const worth = p => Math.max(Math.ceil(p.pts / 2), p.pts - Math.round(p.pts * .1) * (st.tries[p.id] || 0));
  const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/['’-]/g, ' ').replace(/\s+/g, ' ').trim();

  const root = el('div', 'vc'); ctx.view.replaceChildren(root);
  const bg = el('div', 'bg'); bg.innerHTML = `<svg width="520" height="520" style="left:-160px;top:-120px" viewBox="0 0 200 200"><path d="${gearPath(100, 100, 80, 18)}" fill="#c98a4b"/></svg><svg class="r" width="380" height="380" style="right:-120px;bottom:-100px" viewBox="0 0 200 200"><path d="${gearPath(100, 100, 80, 14)}" fill="#c98a4b"/></svg>`;
  const wrap = el('div', 'wrap'); root.append(bg, wrap);
  const top = (back, label) => { const b = el('div', 'bar'); if (back) { const k = el('button', 'ghost', '← ' + label); k.onclick = back; b.append(k); } b.append(el('span', 'sp'), el('span', 'chip', '⚙ ' + Object.keys(st.solved).length + ' / ' + TOTAL + ' rouages'), el('span', 'chip', '✦ ' + score() + ' étincelles'), el('span', 'chip', '🕯 ' + st.bougies + ' bougies')); return b; };
  const scrollTop = () => { try { root.scrollIntoView({ block: 'start' }); } catch {} };

  function title() {
    const t = el('div', 'title'); const done = Object.keys(st.solved).length;
    t.innerHTML = clockSvg(done === TOTAL) + '<h1>Valcendre</h1><div class="sub">l\'horloge aux énigmes</div>';
    t.append(el('p', '', done === TOTAL ? 'La grande horloge bat de nouveau. Valcendre te doit une fière chandelle — tu peux revenir chercher les énigmes que tu veux revoir.' : 'Cette nuit, la grande horloge de Valcendre s\'est arrêtée. Ses 30 rouages ont roulé dans toute la ville. Les habitants les ont ramassés… mais chacun ne rend le sien qu\'à qui résout son énigme.'));
    const go = el('button', '', done ? 'Continuer' : 'Commencer'); go.onclick = map; t.append(go);
    wrap.replaceChildren(t);
  }
  function map() {
    const g = el('div', 'districts');
    D.forEach((d, i) => {
      const open = unlocked(i), n = solvedIn(d.id), c = el('div', 'paper dist' + (open ? '' : ' lock'));
      c.innerHTML = `<h2>${d.name}</h2><div style="font-style:italic;color:#5a4630">${open ? d.blurb : 'Résous ' + UNLOCK + ' énigmes de « ' + D[i - 1].name + ' » pour y entrer.'}</div><div class="who">${FACES[d.who]}<div><b>${d.whoName}</b><br><span style="color:#6b5434">${n} / 10 rouages</span></div></div><div class="prog"><i style="width:${n * 10}%"></i></div>`;
      if (open) c.onclick = () => district(d);
      g.append(c);
    });
    wrap.replaceChildren(top(title, 'Titre'), g);
    if (Object.keys(st.solved).length === TOTAL && !st.ending) { st.ending = true; save(); ending(); }
  }
  function district(d) {
    const m = el('div', 'meds');
    for (const p of P.filter(x => x.d === d.id)) {
      const ok = st.solved[p.id], b = el('div', 'med' + (ok ? ' ok' : ''));
      b.innerHTML = `<b>${p.n}</b><span>${p.t}</span><small>${ok ? '✔ ' + ok + ' étincelles' : (st.tries[p.id] ? 'vaut ' + worth(p) + ' (' + p.pts + ')' : 'vaut ' + p.pts)}</small>`;
      b.onclick = () => puzzle(p, d);
      m.append(b);
    }
    const h = el('div', 'paper'); h.innerHTML = `<div class="who" style="display:flex;gap:14px;align-items:center">${FACES[d.who]}<div><h2>${d.name}</h2><i style="color:#5a4630">${d.blurb}</i></div></div>`;
    wrap.replaceChildren(top(map, 'Carte'), h, m); scrollTop();
  }

  /* ---------- les énigmes à manipuler ---------- */
  function rng(seed) { let x = seed * 9301 + 49297; return () => (x = (x * 9301 + 49297) % 233280) / 233280; }
  function lights(p, win) {
    const N = 3, on = Array(N * N).fill(true);
    const press = (i, s) => { const r = Math.floor(i / N), c = i % N; for (const [dr, dc] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) { const rr = r + dr, cc = c + dc; if (rr >= 0 && rr < N && cc >= 0 && cc < N) s[rr * N + cc] = !s[rr * N + cc]; } };
    const reset = () => { on.fill(true); p.seed.forEach(i => press(i, on)); draw(); };
    const b = el('div', 'board'); b.style.gridTemplateColumns = `repeat(${N},auto)`;
    const draw = () => b.replaceChildren(...on.map((v, i) => { const l = el('div', 'lamp' + (v ? ' on' : '')); l.onclick = () => { if (b.dataset.done) return; press(i, on); draw(); if (on.every(Boolean)) { b.dataset.done = 1; win(); } }; return l; }));
    reset();
    const again = el('button', 'ghost', 'Recommencer'); again.style.color = '#7a4f26'; again.onclick = () => { delete b.dataset.done; reset(); };
    return [b, again];
  }
  function slide(p, win) {
    const s = [1, 2, 3, 4, 5, 6, 7, 8, 0], r = rng(p.seed);
    const nb = i => [i - 3, i + 3, i % 3 ? i - 1 : -1, i % 3 < 2 ? i + 1 : -1].filter(j => j >= 0 && j < 9);
    const shuffle = () => { s.splice(0, 9, 1, 2, 3, 4, 5, 6, 7, 8, 0); let e = 8, prev = -1; for (let k = 0; k < 80; k++) { const opts = nb(e).filter(j => j !== prev), j = opts[Math.floor(r() * opts.length)]; [s[e], s[j]] = [s[j], s[e]]; prev = e; e = j; } if (s.join() === '1,2,3,4,5,6,7,8,0') shuffle(); };
    const b = el('div', 'board'); b.style.gridTemplateColumns = 'repeat(3,auto)';
    const draw = () => b.replaceChildren(...s.map((v, i) => { const t = el('div', 'tile' + (v ? '' : ' empty'), v ? String(v) : ''); t.onclick = () => { if (!v || b.dataset.done) return; const e = s.indexOf(0); if (!nb(e).includes(i)) return; [s[e], s[i]] = [s[i], s[e]]; draw(); if (s.join() === '1,2,3,4,5,6,7,8,0') { b.dataset.done = 1; win(); } }; return t; }));
    shuffle(); draw();
    const again = el('button', 'ghost', 'Remélanger'); again.style.color = '#7a4f26'; again.onclick = () => { delete b.dataset.done; shuffle(); draw(); };
    return [b, again];
  }
  function magic(p, win, lose) {
    const b = el('div', 'board magic'); b.style.gridTemplateColumns = 'repeat(3,auto)';
    const ins = Array.from({ length: 9 }, () => { const i = el('input'); i.inputMode = 'numeric'; i.maxLength = 1; i.oninput = () => { i.value = i.value.replace(/[^1-9]/g, ''); }; return i; });
    b.append(...ins);
    const check = el('button', '', 'Vérifier'); check.onclick = () => {
      const v = ins.map(i => +i.value);
      if (v.some(x => !x) || new Set(v).size !== 9) return lose('Il faut les neuf nombres de 1 à 9, chacun une fois.', true);
      const L = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]].map(l => l.reduce((s, k) => s + v[k], 0));
      L.every(x => x === L[0]) ? win() : lose();
    };
    return [b, check];
  }

  /* ---------- une énigme ---------- */
  function puzzle(p, d) {
    const card = el('div', 'paper pz'), head = el('div', 'head'), msg = el('div', 'msg'), stamp = el('div', 'stamp');
    const solved = () => st.solved[p.id];
    head.innerHTML = `<span class="num">${p.n}</span><h2>${p.t}</h2><span class="val">${solved() ? 'résolue : ' + solved() + ' étincelles' : 'vaut ' + worth(p) + ' étincelles'}</span>`;
    const says = el('div', 'says'); says.innerHTML = FACES[d.who] + `<span>${d.whoName.split(',')[0]} : « ${['Voyons si tu es aussi malin qu\'on le dit.', 'Prends ton temps, la marée attendra.', 'Les archives ne s\'ouvrent qu\'aux esprits patients.'][D.indexOf(d)]} »</span>`;
    const q = el('div', 'q', p.q);
    card.append(head, says, q, stamp);
    if (p.fig) { const f = el('div', 'fig'); f.innerHTML = FIG[p.fig]; card.append(f); }
    const after = el('div');
    const showWhy = () => { after.replaceChildren(el('div', 'why', p.why)); const nx = P[P.indexOf(p) + 1], row = el('div', 'ans'); const back = el('button', 'ghost', 'Retour au quartier'); back.style.color = '#7a4f26'; back.onclick = () => district(d); row.append(back); if (nx && nx.d === p.d) { const go = el('button', '', 'Énigme suivante →'); go.onclick = () => puzzle(nx, d); row.append(go); } after.append(row); };
    const flash = (good) => { stamp.className = 'stamp ' + (good ? 'good' : 'bad'); stamp.textContent = good ? 'JUSTE !' : 'RATÉ'; requestAnimationFrame(() => stamp.classList.add('on')); setTimeout(() => stamp.classList.remove('on'), good ? 1600 : 900); };
    const win = () => {
      if (!solved()) { st.solved[p.id] = worth(p); st.bougies += 1; save(); }
      head.querySelector('.val').textContent = 'résolue : ' + solved() + ' étincelles';
      msg.textContent = ''; flash(true); ans.querySelectorAll('button,input').forEach(x => { if (!x.closest('.board')) x.disabled = true; }); showWhy(); refreshBar();
    };
    const lose = (text, noCost) => { if (!noCost && !solved()) { st.tries[p.id] = (st.tries[p.id] || 0) + 1; save(); head.querySelector('.val').textContent = 'vaut ' + worth(p) + ' étincelles'; } flash(false); msg.textContent = text || 'Ce n\'est pas ça. Réfléchis encore — ou allume une bougie.'; };
    const ans = el('div', 'ans');
    if (p.type === 'num' || p.type === 'text') {
      const i = el('input'); i.placeholder = p.type === 'num' ? 'ta réponse' : 'ton mot'; if (p.type === 'num') i.inputMode = 'decimal';
      const ok = el('button', '', 'Répondre');
      const go = () => { const v = i.value.trim(); if (!v) return; const right = p.type === 'num' ? Math.abs(parseFloat(v.replace(',', '.').replace(/[^\d.-]/g, '')) - p.a) < 1e-9 : p.a.some(a => norm(a) === norm(v)); right ? win() : lose(); };
      ok.onclick = go; i.onkeydown = e => { if (e.key === 'Enter') go(); };
      ans.append(i); if (p.unit) ans.append(el('span', '', p.unit)); ans.append(ok);
      setTimeout(() => i.focus(), 50);
    } else if (p.type === 'choice') {
      const o = el('div', 'opts'); p.opts.forEach((t, k) => { const b = el('button', '', t); b.onclick = () => k === p.a ? win() : lose(); o.append(b); }); ans.append(o);
    } else {
      const parts = { lights, slide, magic }[p.type](p, win, lose); const box = el('div'); box.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:12px;width:100%'; box.append(...parts); ans.append(box);
    }
    card.append(ans, msg, after);
    // les bougies : chacune éclaire un indice
    const hints = el('div', 'hints'), opened = () => st.hints[p.id] || 0;
    const drawHints = () => hints.replaceChildren(...p.hints.map((h, k) => {
      if (k < opened() || solved()) return el('div', 'hint', '🕯 ' + h);
      const c = el('div', 'hint closed', k === opened() ? (st.bougies ? 'Allumer une bougie (il t\'en reste ' + st.bougies + ')' : 'Plus de bougies : résous une énigme pour en gagner une') : 'Indice ' + (k + 1));
      if (k === opened() && st.bougies) c.onclick = () => { st.bougies--; st.hints[p.id] = opened() + 1; save(); drawHints(); refreshBar(); };
      return c;
    }));
    drawHints();
    const hBox = el('div'); hBox.append(el('div', '', 'Indices'), hints); hBox.firstChild.style.cssText = 'font:italic 700 15px Georgia,serif;color:var(--cuivre2);margin:4px 0 6px';
    let bar = top(() => district(d), d.name);
    const refreshBar = () => { const nb = top(() => district(d), d.name); bar.replaceWith(nb); bar = nb; };
    wrap.replaceChildren(bar, card, hBox); scrollTop();
    if (solved()) { flash(true); ans.querySelectorAll('button,input').forEach(x => x.disabled = true); showWhy(); }
  }
  function ending() {
    const f = el('div', 'final paper');
    f.innerHTML = clockSvg(true) + '<h2 style="color:#7a4f26">La grande horloge bat de nouveau</h2><p>Le dernier rouage s\'est enclenché avec un « clac » sonore. Dans toute la ville, on a levé la tête : les aiguilles repartaient.<br>Ysé a refermé son registre en souriant : « Valcendre n\'oubliera pas ton nom. »</p><p><b>' + score() + ' étincelles</b> sur ' + P.reduce((s, p) => s + p.pts, 0) + '.</p>';
    const b = el('button', '', 'Revenir à la carte'); b.onclick = map; f.append(b);
    wrap.replaceChildren(f);
  }
  title();
}
