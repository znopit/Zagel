import { db, uid } from '../db.js';
import { $, $$, esc, ask, toast, shrinkImage, blobURL, daysSince, niceDate, pageTop, pageTitle } from '../ui.js';

function twig(leaves, ripe, snapped) {
  const spots = [[-14, -40, -38], [12, -36, 34], [-6, -24, -28], [18, -22, 40], [-16, -12, -48], [8, -8, 26]];
  const lv = spots.slice(0, leaves).map(([x, y, r], i) => {
    const c = ripe && i % 2 === 0 ? '#EBD98C' : ripe ? '#D9C25A' : '#86C97E';
    return `<ellipse cx="${x}" cy="${y}" rx="4" ry="11" fill="${c}" stroke="#2E2C29" stroke-width="1" transform="rotate(${r} ${x} ${y})"/>`;
  }).join('');
  const stem = snapped
    ? `<path d="M0 40 L0 6" stroke="#2E2C29" stroke-width="9" stroke-linecap="round"/><path d="M0 40 L0 6" stroke="#DCCBA2" stroke-width="6.5" stroke-linecap="round"/><g transform="rotate(38 0 2)"><path d="M0 0 L0 -22 Q-2 -34 -12 -48 M0 -22 Q3 -34 14 -46" fill="none" stroke="#2E2C29" stroke-width="8" stroke-linecap="round"/><path d="M0 0 L0 -22 Q-2 -34 -12 -48 M0 -22 Q3 -34 14 -46" fill="none" stroke="#DCCBA2" stroke-width="5.5" stroke-linecap="round"/>${lv}</g><path d="M-6 4 l4 -4 l3 4 l4 -4" fill="none" stroke="#E0391F" stroke-width="1.6"/>`
    : `<path d="M0 40 L0 -6 Q-2 -26 -14 -46 M0 -6 Q4 -26 16 -44" fill="none" stroke="#2E2C29" stroke-width="9" stroke-linecap="round"/><path d="M0 40 L0 -6 Q-2 -26 -14 -46 M0 -6 Q4 -26 16 -44" fill="none" stroke="#DCCBA2" stroke-width="6.5" stroke-linecap="round"/>${lv}`;
  return `<svg viewBox="-34 -56 68 104" width="64" aria-hidden="true"><g filter="url(#zp)">${stem}<circle cx="-4" cy="10" r="3.6" fill="#fff" stroke="#2E2C29"/><circle cx="5" cy="10" r="3.6" fill="#fff" stroke="#2E2C29"/><circle cx="-3.4" cy="${snapped ? 11 : 9}" r="1.5" fill="#141414"/><circle cx="5.6" cy="${snapped ? 11 : 9}" r="1.5" fill="#141414"/></g></svg>`;
}

let photo = null;
export async function render() {
  const all = (await db.all('wishes')).sort((a, b) => b.created - a.created);
  const waiting = all.filter(w => w.status === 'waiting');
  const snapped = all.filter(w => w.status === 'snapped');
  const gone = all.filter(w => w.status === 'gone');
  photo = null;

  const row = w => {
    const d = daysSince(w.created);
    const ripe = d >= 30;
    const leaves = Math.min(6, 1 + Math.floor(d / 5));
    const asking = ripe && !w.confirmed && w.status === 'waiting';
    return `<div class="wish" data-id="${w.id}">
      <div class="twig">${twig(w.status === 'snapped' ? 6 : leaves, ripe || w.status === 'snapped', w.status === 'snapped')}</div>
      ${w.img ? `<img class="thumb" src="${blobURL(w.img)}" alt="">` : ''}
      <div class="grow" style="flex:1;min-width:0">
        <h3 style="font-family:var(--display);font-weight:500;font-size:22px;letter-spacing:-0.03em;line-height:1.15">${esc(w.name)}</h3>
        <p class="muted" style="font-size:14px">${[w.price ? esc(w.price) : '', w.status === 'snapped' ? `Came true ${niceDate(w.snappedAt, true)}` : w.status === 'gone' ? 'Let go' : `${d} ${d === 1 ? 'day' : 'days'} on the willow${ripe ? ' · ripe' : ''}`].filter(Boolean).join(' · ')}</p>
        ${asking ? `<p style="margin-top:10px;font-size:15px">Thirty days later — still want it?</p><div class="row" style="margin-top:8px"><button class="btn small" data-keep>Yes, still</button><button class="btn small ghost" data-go>Let it go</button></div>` : ''}
        ${w.status === 'waiting' ? `<div class="row" style="margin-top:10px"><button class="btn small" data-snap>Snap · it’s mine</button></div>` : ''}
      </div>
      <button class="x" data-del aria-label="Delete">×</button>
    </div>`;
  };

  $('#view').innerHTML = `<div class="wrap page">
    ${pageTop()}
    ${pageTitle('Wishes', '03', 'One wish willow', 'Plant a twig. Wait thirty days. Snap it when it’s yours. No takebacks.')}
    <div class="stack" style="margin-top:22px">
      <input class="field" id="wn" placeholder="What do you want?" maxlength="100">
      <input class="field" id="wp" placeholder="Price" maxlength="30">
      <div class="row"><label class="btn ghost filebtn">Add a photo<input type="file" id="wf" accept="image/*"></label><span class="muted" id="wfn" style="font-size:14px"></span></div>
      <button class="btn" id="add">Plant a twig</button>
    </div>
    <div class="sec"><span>On the willow</span><span>(${waiting.length})</span></div>
    <div>${waiting.map(row).join('') || '<p class="empty">No twigs yet.</p>'}</div>
    ${snapped.length ? `<div class="sec"><span>Came true</span><span>(${snapped.length})</span></div><div>${snapped.map(row).join('')}</div>` : ''}
    ${gone.length ? `<div class="sec"><span>Let go</span><span>(${gone.length})</span></div><div>${gone.map(row).join('')}</div>` : ''}
  </div>`;

  $('#wf').onchange = async e => {
    const f = e.target.files[0]; if (!f) return;
    photo = (await shrinkImage(f, 1000)).blob; $('#wfn').textContent = 'Photo added';
  };
  $('#add').onclick = async () => {
    const name = $('#wn').value.trim();
    if (!name) { $('#wn').focus(); return; }
    await db.put('wishes', { id: uid(), name, price: $('#wp').value.trim(), img: photo, status: 'waiting' });
    render();
  };
  $$('.wish').forEach(el => {
    const id = el.dataset.id;
    const upd = async patch => { const w = await db.get('wishes', id); await db.put('wishes', Object.assign(w, patch)); render(); };
    const s = $('[data-snap]', el); if (s) s.onclick = () => {
      $('.twig', el).classList.add('snap');
      toast('Snap. No takebacks.');
      setTimeout(() => upd({ status: 'snapped', snappedAt: Date.now() }), 520);
    };
    const k = $('[data-keep]', el); if (k) k.onclick = () => upd({ confirmed: Date.now() });
    const g = $('[data-go]', el); if (g) g.onclick = () => upd({ status: 'gone' });
    $('[data-del]', el).onclick = async () => { if (await ask('Remove this wish completely?', 'Delete', true)) { await db.del('wishes', id); render(); } };
  });
}
