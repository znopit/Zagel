import { db, uid } from '../db.js';
import { $, $$, esc, ask, niceDate, pageTop, pageTitle } from '../ui.js';

export async function render() {
  const all = (await db.all('thoughts')).sort((a, b) => b.created - a.created);
  const old = all.filter(t => Date.now() - t.created > 2 * 86400000);
  const pick = (old.length ? old : all)[Math.floor(Math.random() * (old.length || all.length))];
  $('#view').innerHTML = `<div class="wrap page">
    ${pageTop()}
    ${pageTitle('Cauldron', '05', 'Brain bubbles', 'Drop a thought in the moment it arrives. Now and then an old one floats back up.')}
    <div class="stack" style="margin-top:22px">
      <textarea class="field" id="tt" rows="2" maxlength="500" placeholder="Something just occurred to me…"></textarea>
      <button class="btn" id="drop">Drop it in</button>
    </div>
    ${pick && all.length > 2 ? `<div class="surface"><div class="kicker">Floated back up</div><p class="intro" style="margin-top:6px">${esc(pick.text)}</p><p class="note">${niceDate(pick.created, true)}</p></div>` : ''}
    <div class="sec"><span>In the pot</span><span>(${all.length})</span></div>
    <div id="pot">${all.map(t => `<div class="thought" data-id="${t.id}">${esc(t.text)}<small>${niceDate(t.created, true)} · <button class="linkish" data-del style="background:none;border:0;color:inherit;font-size:11px;text-decoration:underline">remove</button></small></div>`).join('') || '<p class="empty">The pot is empty. Throw something in.</p>'}</div>
  </div>`;
  const drop = async () => {
    const text = $('#tt').value.trim();
    if (!text) { $('#tt').focus(); return; }
    await db.put('thoughts', { id: uid(), text });
    const b = document.createElement('div');
    b.className = 'bubble'; b.textContent = text.slice(0, 60);
    const r = $('#drop').getBoundingClientRect();
    Object.assign(b.style, { position: 'fixed', left: r.left + 'px', top: r.top - 60 + 'px' });
    document.body.appendChild(b);
    b.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-120px) scale(.5)', opacity: 0 }], { duration: 900, easing: 'ease-in' }).onfinish = () => { b.remove(); render(); };
  };
  $('#drop').onclick = drop;
  $$('[data-del]').forEach(btn => btn.onclick = async () => {
    const id = btn.closest('.thought').dataset.id;
    if (await ask('Fish this thought out of the pot?', 'Remove', true)) { await db.del('thoughts', id); render(); }
  });
}
