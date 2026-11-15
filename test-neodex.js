// lancé par le test « local » de NeoDex : ouvre chaque énigme, vérifie qu'elle s'affiche sans erreur ; NEO_VC_SHOW=n laisse l'énigme n ouverte pour la capture
module.exports = async ({ pj, sleep }) => {
  const r = await pj(`(async () => {
    const { P, D, puzzle } = globalThis.__valcendre, errs = [], kinds = {};
    addEventListener('error', e => errs.push(e.message));
    for (const p of P) {
      try { puzzle(p, D.find(d => d.id === p.d)); } catch (e) { errs.push(p.n + ' ' + p.t + ' : ' + e.message); continue; }
      kinds[p.type] = (kinds[p.type] || 0) + 1;
      if (!document.querySelector('.vc .pz .goal') || !document.querySelector('.vc .pz .ans').children.length) errs.push(p.n + ' ' + p.t + ' : vide');
      await new Promise(r => setTimeout(r, 5));
    }
    // la Gare : chaque niveau de bagages se résout avec sa solution au clavier, chaque grille d'aiguillages avec ses voies tracées
    const SOKO = { 'Les malles du quai': 'ulurdrrurd', 'Le fourgon à bagages': 'uululdrrrrurd', 'La consigne': 'uddldrurrruululd', 'Les colis du soir': 'ludrrrulluldldrrrurd', 'Le grand déménagement': 'luddulluurrddrrddlllruurrrruulldddurrddll' };
    const FLOW = { 'Les aiguillages': ['aaabb', 'ccabd', 'ceabd', 'ceeed', 'cccdd'], 'Le dépôt des locomotives': ['aaaabb', 'cccadb', 'eecadb', 'efcddb', 'efffgb', 'eegggb'],
      'Le plan des voies': ['abbbbc', 'addebc', 'aadebc', 'fadeec', 'fagggc', 'ffhhhc'], 'La grande gare de triage': ['aaaaaab', 'ccccdab', 'ceecdab', 'cefcdbb', 'cefgddd', 'cefgggh', 'ccffhhh'] };
    const gare = D.find(d => d.id === 'gare');
    for (const p of P.filter(p => p.d === 'gare')) {
      if (SOKO[p.t]) { puzzle(p, gare); const b = document.querySelector('.vc .pz .board'); for (const ch of SOKO[p.t]) b.dispatchEvent(new KeyboardEvent('keydown', { key: { u: 'ArrowUp', d: 'ArrowDown', l: 'ArrowLeft', r: 'ArrowRight' }[ch], bubbles: true })); if (!b.dataset.done) errs.push(p.t + ' : bagages pas rangés'); }
      if (FLOW[p.t]) { puzzle(p, gare); const g = FLOW[p.t], fl = document.querySelector('.vc .pz canvas.flow').__fl;
        for (const k of new Set(g.join(''))) { const cells = []; g.forEach((r, y) => [...r].forEach((ch, x) => { if (ch === k) cells.push([y, x]); }));
          const nb = ([y, x]) => cells.filter(([a, b]) => Math.abs(a - y) + Math.abs(b - x) === 1); let at = cells.find(c => nb(c).length === 1), prev = null; fl.down(...at);
          for (;;) { const nx = nb(at).find(c => !prev || c[0] !== prev[0] || c[1] !== prev[1]); if (!nx) break; fl.move(...nx); prev = at; at = nx; } fl.up(); }
        if (!document.querySelector('.vc .pz .board').dataset.done) errs.push(p.t + ' : voies pas reliées'); }
    }
    // rejouer depuis le carnet ne compte rien
    globalThis.__valcendre.carnet(); { const p = P[0]; puzzle(p, D[0], true); if (!/rejouée/.test(document.querySelector('.vc .pz .val').textContent)) errs.push('rejouer : ' + document.querySelector('.vc .pz .val').textContent); }
    const view = ${JSON.stringify(process.env.NEO_VC_VIEW || '')}; if (view === 'map') globalThis.__valcendre.map(); if (view.startsWith('d:')) globalThis.__valcendre.district(D.find(d => d.id === view.slice(2)));
    const show = ${+process.env.NEO_VC_SHOW || 0}; if (show) { const p = P[show - 1]; puzzle(p, D.find(d => d.id === p.d)); await new Promise(r => setTimeout(r, 300)); document.querySelector(${JSON.stringify(process.env.NEO_VC_AT || '.vc .pz .ans')})?.scrollIntoView({ block: 'center' }); }
    return P.length + ' énigmes, ' + D.length + ' quartiers · ' + Object.entries(kinds).map(([k, n]) => k + ' ' + n).join(', ') + (errs.length ? ' ERREURS : ' + errs.slice(0, 6).join(' / ') : '');
  })()`);
  await sleep(500);
  if (/ERREURS/.test(r)) throw new Error(r);
  return r;
};
