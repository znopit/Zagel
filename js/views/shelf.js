import { db, uid, getMeta, setMeta } from '../db.js';
import { $, $$, esc, ask, toast, openSheet, closeSheet, sheetHead, shrinkImage, blobURL, dominantColor, hue, pageTop, pageTitle } from '../ui.js';

const DEFAULT_BAYS = [
  { id: 'b1', name: 'Unread', tall: true }, { id: 'b2', name: 'Bay 2' }, { id: 'b3', name: 'Bay 3' },
  { id: 'b4', name: 'Bay 4' }, { id: 'b5', name: 'Bay 5' }, { id: 'b6', name: 'Bay 6' },
];
let sortBy = 'color';

function spineH(b) { let h = 0; for (const c of b.id) h = (h * 31 + c.charCodeAt(0)) >>> 0; return 62 + (h % 22); }
function ink(hex) { const n = parseInt(hex.slice(1), 16); const l = (0.3 * (n >> 16) + 0.59 * (n >> 8 & 255) + 0.11 * (n & 255)); return l < 120 ? 'rgba(255,255,255,.85)' : 'rgba(0,0,0,.72)'; }

export async function render() {
  const bays = await getMeta('bays', DEFAULT_BAYS);
  const books = await db.all('books');
  const pulled = await getMeta('lastPulled');
  const sorted = [...books].sort(sortBy === 'color' ? (a, b) => hue(a.color) - hue(b.color) : (a, b) => a.created - b.created);
  const unread = books.filter(b => b.status !== 'read').length;

  $('#view').innerHTML = `<div class="wrap wide page">
    ${pageTop()}
    ${pageTitle('Shelf', '06', 'Picture books', 'Pull one out. Steal a page. Nobody has to know.')}
    <div class="row" style="margin-top:18px">
      <button class="btn" id="add">Add a book</button>
      <button class="btn ghost" id="pull" ${unread ? '' : 'disabled'}>Pull one</button>
      <button class="btn ghost small" id="sort">Sort: ${sortBy === 'color' ? 'colour' : 'added'}</button>
    </div>
    <p class="note">${books.length} ${books.length === 1 ? 'book' : 'books'} · ${unread} unread</p>
    <div class="cabinet">${bays.map(bay => `<div class="bay ${bay.tall ? 'tall' : ''}" data-bay="${bay.id}">
      <button class="bname" data-rename="${bay.id}">${esc(bay.name)}</button>
      <div class="spines">${sorted.filter(b => b.bay === bay.id).map(b => `<div class="spinewrap" style="height:94px;display:flex;align-items:flex-end;padding:0 1px;border-bottom:6px solid #C8A57A"><div class="spine ${b.id === pulled ? 'pulled' : ''}" data-id="${b.id}" style="height:${spineH(b)}px;background:${b.color};color:${ink(b.color)};${b.status === 'read' ? 'opacity:.78' : ''}">${esc(b.title)}</div></div>`).join('')}</div>
    </div>`).join('')}</div>
  </div>`;

  // each book stands on its own piece of plank; side by side they make the shelf

  $('#add').onclick = () => addBook(bays);
  $('#sort').onclick = () => { sortBy = sortBy === 'color' ? 'added' : 'color'; render(); };
  $('#pull').onclick = () => pullOne(books);
  $$('.spine').forEach(s => s.onclick = () => showBook(s.dataset.id, bays));
  $$('[data-rename]').forEach(b => b.onclick = () => renameBay(b.dataset.rename, bays));
}

function addBook(bays) {
  let cover = null, color = '#C9B9A0';
  openSheet(`${sheetHead('Add a book')}
    <div class="stack">
      <label class="btn ghost filebtn">Photo of the cover<input type="file" id="bc" accept="image/*" capture="environment"></label>
      <div class="row"><div id="bsw" style="width:28px;height:44px;border:1px solid #141414;background:${color}"></div><span class="muted" style="font-size:14px" id="bcn">No photo yet — the spine will be plain.</span></div>
      <input class="field" id="bt" placeholder="Title" maxlength="80">
      <select class="field" id="bb">${bays.map(b => `<option value="${b.id}">${esc(b.name)}</option>`).join('')}</select>
      <button class="btn" id="bsave">Put it on the shelf</button>
    </div>`, el => {
    $('#bc', el).onchange = async e => {
      const f = e.target.files[0]; if (!f) return;
      cover = (await shrinkImage(f, 900)).blob;
      color = await dominantColor(cover);
      $('#bsw', el).style.background = color; $('#bcn', el).textContent = 'Spine colour picked from the cover.';
    };
    $('#bsave', el).onclick = async () => {
      const title = $('#bt', el).value.trim();
      if (!title) { $('#bt', el).focus(); return; }
      await db.put('books', { id: uid(), title, bay: $('#bb', el).value, color, cover, status: 'unread' });
      closeSheet(); render();
    };
  });
}

async function pullOne(books) {
  const pool = books.filter(b => b.status !== 'read');
  if (!pool.length) return;
  const b = pool[Math.floor(Math.random() * pool.length)];
  await setMeta('lastPulled', b.id);
  await render();
  const el = $(`.spine[data-id="${b.id}"]`);
  if (el) { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); el.animate([{ transform: 'rotate(180deg) translateY(0)' }, { transform: 'rotate(180deg) translateY(16px)' }, { transform: 'rotate(180deg) translateY(0)' }], { duration: 600 }); }
  setTimeout(() => showBook(b.id, null, 'Tonight’s picture book'), 650);
}

async function showBook(id, bays, kicker) {
  bays = bays || await getMeta('bays', DEFAULT_BAYS);
  const b = await db.get('books', id);
  if (!b) return;
  let stolenImg = null;
  openSheet(`${sheetHead(kicker || 'Book')}
    ${b.cover ? `<img class="photo" src="${blobURL(b.cover)}" alt="" style="max-width:240px">` : `<div style="width:60px;height:180px;background:${b.color};border:1px solid #141414"></div>`}
    <h2 style="font-family:var(--display);font-weight:600;font-size:36px;letter-spacing:-0.04em;line-height:1;margin-top:14px">${esc(b.title)}</h2>
    <div class="row" style="margin-top:14px">
      <button class="chip ${b.status !== 'read' ? 'on' : ''}" data-st="unread">Unread</button><button class="chip ${b.status === 'read' ? 'on' : ''}" data-st="read">Read</button>
      <select class="field" id="mv" style="width:auto;font-size:15px;padding:6px 0">${bays.map(x => `<option value="${x.id}" ${x.id === b.bay ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select>
    </div>
    <div class="sec tight"><span>The page I’d steal</span><span></span></div>
    ${b.stolen && b.stolen.img ? `<img src="${blobURL(b.stolen.img)}" alt="" style="max-width:100%;margin-top:12px">` : ''}
    ${b.stolen && b.stolen.note ? `<p class="intro">${esc(b.stolen.note)}</p>` : ''}
    <div class="stack" style="margin-top:12px">
      <label class="btn ghost filebtn">${b.stolen && b.stolen.img ? 'Replace the photo' : 'Photo of the page'}<input type="file" id="sp" accept="image/*" capture="environment"></label>
      <textarea class="field" id="sn" rows="2" placeholder="Why this page?">${esc(b.stolen?.note || '')}</textarea>
      <div class="row"><button class="btn" id="ssave">Keep it</button>${b.stolen ? '<button class="btn ghost" id="tog">Copy into the Grimoire</button>' : ''}</div>
    </div>
    <div class="row" style="margin-top:26px"><button class="btn danger small" id="bdel">Remove book</button></div>`, el => {
    const save = async patch => { Object.assign(b, patch); await db.put('books', b); };
    $$('[data-st]', el).forEach(c => c.onclick = async () => { await save({ status: c.dataset.st }); $$('[data-st]', el).forEach(x => x.classList.toggle('on', x === c)); render(); });
    $('#mv', el).onchange = async e => { await save({ bay: e.target.value }); render(); };
    $('#sp', el).onchange = async e => { const f = e.target.files[0]; if (f) { stolenImg = (await shrinkImage(f, 1400)).blob; toast('Photo ready — tap Keep it'); } };
    $('#ssave', el).onclick = async () => {
      await save({ stolen: { img: stolenImg || b.stolen?.img || null, note: $('#sn', el).value.trim() } });
      toast('Kept.'); closeSheet(); render();
    };
    const tg = $('#tog', el); if (tg) tg.onclick = async () => {
      await db.put('spells', { id: uid(), name: `Stolen from ${b.title}`, ingredients: '', method: '', effect: b.stolen.note || '', img: b.stolen.img || null, source: 'shelf:' + b.id });
      toast('Copied into the Grimoire.');
    };
    $('#bdel', el).onclick = async () => { if (await ask(`Take “${b.title}” off the shelf?`, 'Remove', true)) { await db.del('books', b.id); render(); } };
  });
}

function renameBay(id, bays) {
  const bay = bays.find(b => b.id === id);
  openSheet(`${sheetHead('Name this bay')}<div class="stack"><input class="field" id="bn" value="${esc(bay.name)}" maxlength="24"><button class="btn" id="bns">Save</button></div>`, el => {
    $('#bns', el).onclick = async () => { bay.name = $('#bn', el).value.trim() || bay.name; await setMeta('bays', bays); closeSheet(); render(); };
  });
}
