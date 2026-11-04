// lancé par le test « local » de NeoDex : ouvre chaque énigme, vérifie qu'elle s'affiche sans erreur ; NEO_VC_SHOW=n laisse l'énigme n ouverte pour la capture
module.exports = async ({ pj, sleep }) => {
  const r = await pj(`(async () => {
    const { P, D, puzzle } = globalThis.__valcendre, errs = [], kinds = {};
    addEventListener('error', e => errs.push(e.message));
    for (const p of P) {
      try { puzzle(p, D.find(d => d.id === p.d)); } catch (e) { errs.push(p.n + ' ' + p.t + ' : ' + e.message); continue; }
      kinds[p.type] = (kinds[p.type] || 0) + 1;
      if (!document.querySelector('.vc .pz .q') || !document.querySelector('.vc .pz .ans').children.length) errs.push(p.n + ' ' + p.t + ' : vide');
      await new Promise(r => setTimeout(r, 5));
    }
    const show = ${+process.env.NEO_VC_SHOW || 0}; if (show) { const p = P[show - 1]; puzzle(p, D.find(d => d.id === p.d)); await new Promise(r => setTimeout(r, 300)); document.querySelector(${JSON.stringify(process.env.NEO_VC_AT || '.vc .pz .ans')})?.scrollIntoView({ block: 'center' }); }
    return P.length + ' énigmes, ' + D.length + ' quartiers · ' + Object.entries(kinds).map(([k, n]) => k + ' ' + n).join(', ') + (errs.length ? ' ERREURS : ' + errs.slice(0, 6).join(' / ') : '');
  })()`);
  await sleep(500);
  if (/ERREURS/.test(r)) throw new Error(r);
  return r;
};
