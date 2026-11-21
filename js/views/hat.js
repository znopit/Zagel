import { db, uid } from '../db.js';
import { $, $$, esc, confetti, ask, niceDate, pageTop, pageTitle } from '../ui.js';

export async function render() {
  const parties = (await db.all('parties')).sort((a, b) => b.created - a.created);
  const y = new Date().getFullYear();
  const thisYear = parties.filter(p => new Date(p.created).getFullYear() === y).length;
  $('#view').innerHTML = `<div class="wrap page">
    ${pageTop()}
    ${pageTitle('Party Hat', '02', 'Small parties', 'Small things worth a party that nobody else would throw one for. I put the hat on myself, nobody has to remember anything.')}
    <div class="stack" style="margin-top:26px">
      <input class="field" id="what" maxlength="160" placeholder="What are we celebrating?">
      <button class="btn" id="go">Put the hat on</button>
    </div>
    <div class="party" style="margin-top:44px"><span class="n">${thisYear}</span><span class="kicker">${thisYear === 1 ? 'party' : 'parties'} in ${y}</span></div>
    <div class="list" style="margin-top:12px">${parties.map(p => `<div class="item"><div class="grow"><h3>${esc(p.text)}</h3><p>${niceDate(p.created, true)}</p></div><button class="x" data-del="${p.id}" aria-label="Delete">×</button></div>`).join('') || '<p class="empty">No parties yet. The hat is waiting.</p>'}</div>
  </div>`;
  const go = async () => {
    const text = $('#what').value.trim();
    if (!text) { $('#what').focus(); return; }
    await db.put('parties', { id: uid(), text });
    const r = $('#go').getBoundingClientRect();
    confetti(r.left + r.width / 2, r.top, 46);
    setTimeout(render, 500);
  };
  $('#go').onclick = go;
  $('#what').addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  $$('[data-del]').forEach(b => b.onclick = async () => {
    if (await ask('Take this party off the list?', 'Delete', true)) { await db.del('parties', b.dataset.del); render(); }
  });
}
