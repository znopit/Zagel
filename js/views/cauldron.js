import { db, uid } from '../db.js';
import { $, $$, esc, ask, niceDate, pageTop, pageTitle } from '../ui.js';

function rnd(seed) { let h = 0; for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0; return () => { h = (h * 1103515245 + 12345) >>> 0; return h / 4294967296; }; }

export async function render() {
  const all = (await db.all('thoughts')).sort((a, b) => b.created - a.created);
  $('#view').innerHTML = `<div class="wrap page">
    ${pageTop()}
    ${pageTitle('Cauldron', '05', 'Brain bubbles', 'Throw a thought in. It’ll float back up when you least expect it.')}
    <div class="stack" style="margin-top:22px">
      <textarea class="field" id="tt" rows="2" maxlength="300" placeholder="Something just occurred to me…"></textarea>
      <button class="btn" id="drop">Drop it in</button>
    </div>
    <div class="sec"><span>In the pot</span><span>(${all.length})</span></div>
    <div class="froth" id="pot">${all.map(t => {
      const r = rnd(t.id), len = t.text.length;
      const d = Math.round(Math.max(92, Math.min(250, 46 + Math.sqrt(len) * 17)));
      return `<button class="soap" data-id="${t.id}" style="--d:${d}px;--dl:${(-r() * 6).toFixed(2)}s;--du:${(5 + r() * 4).toFixed(2)}s;--dx:${((r() - .5) * 14).toFixed(1)}px;margin-top:${Math.round(r() * 26)}px">
        <span class="st">${esc(t.text)}</span><span class="sd">${niceDate(t.created, true)}<br><u data-del>pop it</u></span></button>`;
    }).join('') || '<p class="empty">The pot is empty. Throw something in.</p>'}</div>
  </div>`;
  const drop = async () => {
    const text = $('#tt').value.trim();
    if (!text) { $('#tt').focus(); return; }
    await db.put('thoughts', { id: uid(), text });
    render();
  };
  $('#drop').onclick = drop;
  $$('.soap').forEach(b => b.onclick = async e => {
    if (e.target.closest('[data-del]')) {
      if (await ask('Pop this bubble for good?', 'Pop', true)) { b.classList.add('popping'); setTimeout(async () => { await db.del('thoughts', b.dataset.id); render(); }, 260); }
      return;
    }
    $$('.soap.open').forEach(x => x !== b && x.classList.remove('open'));
    b.classList.toggle('open');
  });
}
