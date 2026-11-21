import { db, uid } from '../db.js';
import { ROAD } from '../art.js';
import { $, $$, esc, ask, toast, openSheet, closeSheet, sheetHead, shrinkImage, blobURL, pageTop, pageTitle } from '../ui.js';

const CREATURES = [
  ['days', 'The Bagel', 'Eats one seed a day, never the same seed twice. On the last night of the year it opens its middle and lets you walk through.'],
  ['hat', 'The Party Hat', 'Belongs to no one until someone puts it on. When nobody remembers, it throws the party anyway.'],
  ['wishes', 'The Willow', 'Grows a leaf for every day you keep wanting. Snaps itself if you lie to it.'],
  ['looks', 'The Dress', 'Studies everyone who walks past. Has opinions about shoulders.'],
  ['cauldron', 'The Cauldron', 'Swallows thoughts whole. Burps one back up the moment you’ve forgotten it.'],
  ['shelf', 'The Shelf', 'Keeps the unread books in the tall bay. Sometimes pushes one forward, just a little.'],
  ['grimoire', 'The Grimoire', 'The most dangerous thing on the road. Look how harmless it is at night.'],
  ['home', 'The House', 'Two cats, one door, and windows that stay lit until you’re back.'],
];
let road = null;
function art(key, night) {
  if (!road) road = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${ROAD}</svg>`, 'image/svg+xml');
  const g = road.querySelector(`[data-k="${key}"]`);
  if (!g) return '';
  const nf = g.querySelector('.nf');
  if (night && !nf) return '<span style="color:#6E76A0;font-size:12px;text-align:center;padding:8px">Night form<br>not drawn yet</span>';
  const parts = night ? [nf] : [...g.querySelectorAll('.bob')].filter(b => !b.classList.contains('nf'));
  const inner = parts.map(p => p.innerHTML).join('');
  const vb = night ? '-80 -210 160 280' : key === 'home' ? '-135 -70 270 150' : '-75 -100 150 170';
  return `<svg viewBox="${vb}" aria-hidden="true">${inner}</svg>`;
}

let tab = 'creatures';
export async function render() {
  document.body.classList.add('riso');
  const spells = (await db.all('spells')).sort((a, b) => b.created - a.created);
  const custom = (await db.all('creatures')).sort((a, b) => a.created - b.created);
  const lore = Object.fromEntries(custom.filter(c => c.builtin).map(c => [c.id, c.lore]));
  const mine = custom.filter(c => !c.builtin);

  $('#view').innerHTML = `<div class="wrap page">
    ${pageTop()}
    ${pageTitle('Grimoire', '07', 'Book of spells · kept by Zi', '')}
    <p class="motto">Audentes fortuna iuvat.</p>
    <div class="tabs"><button class="chip ${tab === 'creatures' ? 'on' : ''}" data-tab="creatures">Creatures</button><button class="chip ${tab === 'spells' ? 'on' : ''}" data-tab="spells">Spells (${spells.length})</button></div>
    ${tab === 'spells' ? `
      <div class="row" style="margin-top:18px"><button class="btn" id="ns">Write a spell</button></div>
      <div class="spells">${spells.map(s => `<button class="spellcard" data-id="${s.id}">
        <span class="sth">${s.img ? `<img src="${blobURL(s.img)}" alt="">` : `<span class="noimg">${esc(s.effect || s.ingredients || '')}</span>`}</span>
        <span class="sn">${esc(s.name)}</span></button>`).join('')}</div>
      ${spells.length ? '' : '<p class="empty">No spells yet. Steal a page from the Shelf, or write one by hand.</p>'}
    ` : `
      <p class="note" style="margin-top:14px">Every creature on the road, by day and by night. Written down by Zi.</p>
      ${CREATURES.map(([k, name, def]) => `<div class="ccard"><div class="form">${art(k, false)}</div><div class="form n">${art(k, true)}</div>
        <div class="txt"><h3>${name}</h3><p>“${esc(lore[k] || def)}” — Zi</p><button class="btn ghost small" data-lore="${k}" style="margin-top:8px">Rewrite</button></div></div>`).join('')}
      ${mine.map(c => `<div class="ccard" data-cid="${c.id}"><div class="form">${c.day ? `<img src="${blobURL(c.day)}" alt="">` : ''}</div><div class="form n">${c.night ? `<img src="${blobURL(c.night)}" alt="">` : ''}</div>
        <div class="txt"><h3>${esc(c.name)}</h3><p>“${esc(c.lore || '')}” — Zi</p><div class="row" style="margin-top:8px"><button class="btn ghost small" data-cedit="${c.id}">Edit</button></div></div></div>`).join('')}
      <div class="row" style="margin-top:18px"><button class="btn" id="nc">Add a creature</button></div>
    `}
  </div>`;

  $$('[data-tab]').forEach(b => b.onclick = () => { tab = b.dataset.tab; render(); });
  if (tab === 'spells') {
    $('#ns').onclick = () => editSpell();
    $$('.spellcard').forEach(el => el.onclick = async () => showSpell(await db.get('spells', el.dataset.id)));
  } else {
    $$('[data-lore]').forEach(b => b.onclick = () => rewrite(b.dataset.lore, lore[b.dataset.lore] || CREATURES.find(c => c[0] === b.dataset.lore)[2]));
    $('#nc').onclick = () => editCreature();
    $$('[data-cedit]').forEach(b => b.onclick = async () => editCreature(await db.get('creatures', b.dataset.cedit)));
  }
}

function showSpell(s) {
  openSheet(`${sheetHead('Spell')}
    <div class="spell">
      <h3>${esc(s.name)}</h3>
      ${s.img ? `<img src="${blobURL(s.img)}" alt="">` : ''}
      <dl>${s.ingredients ? `<dt>Ingredients</dt><dd>${esc(s.ingredients)}</dd>` : ''}${s.method ? `<dt>Method</dt><dd>${esc(s.method)}</dd>` : ''}${s.effect ? `<dt>Effect</dt><dd>${esc(s.effect)}</dd>` : ''}</dl>
    </div>
    <div class="row" style="margin-top:18px"><button class="btn" id="se1">Edit</button><button class="btn danger" id="sx1">Tear it out</button></div>`, el => {
    $('#se1', el).onclick = () => editSpell(s);
    $('#sx1', el).onclick = async () => { if (await ask('Tear this spell out?', 'Tear it out', true)) { await db.del('spells', s.id); render(); } };
  });
}

function editSpell(s) {
  s = s || { id: uid(), name: '', ingredients: '', method: '', effect: '', img: null };
  let img = s.img;
  openSheet(`${sheetHead(s.name ? 'Edit spell' : 'New spell')}
    <div class="stack">
      <input class="field" id="sn" placeholder="Name of the spell" value="${esc(s.name)}">
      <textarea class="field" id="si" rows="2" placeholder="Ingredients — colours, brushes, garments…">${esc(s.ingredients)}</textarea>
      <textarea class="field" id="sm" rows="2" placeholder="Method">${esc(s.method)}</textarea>
      <textarea class="field" id="se" rows="2" placeholder="Effect">${esc(s.effect)}</textarea>
      <label class="btn ghost filebtn">${img ? 'Replace picture' : 'Add a picture'}<input type="file" id="sf" accept="image/*"></label>
      <button class="btn" id="ss">Write it down</button>
    </div>`, el => {
    $('#sf', el).onchange = async e => { const f = e.target.files[0]; if (f) { img = (await shrinkImage(f, 1400)).blob; toast('Picture added'); } };
    $('#ss', el).onclick = async () => {
      const name = $('#sn', el).value.trim(); if (!name) { $('#sn', el).focus(); return; }
      Object.assign(s, { name, ingredients: $('#si', el).value.trim(), method: $('#sm', el).value.trim(), effect: $('#se', el).value.trim(), img });
      await db.put('spells', s); closeSheet(); render();
    };
  });
}

function rewrite(key, text) {
  openSheet(`${sheetHead('In Zi’s words')}<div class="stack"><textarea class="field" id="lt" rows="4">${esc(text)}</textarea><button class="btn" id="ls">Save</button></div>`, el => {
    $('#ls', el).onclick = async () => {
      const cur = (await db.get('creatures', key)) || { id: key, builtin: true };
      cur.lore = $('#lt', el).value.trim(); await db.put('creatures', cur); closeSheet(); render();
    };
  });
}

function editCreature(c) {
  c = c || { id: uid(), name: '', lore: '', day: null, night: null };
  openSheet(`${sheetHead(c.name ? 'Edit creature' : 'New creature')}
    <div class="stack">
      <input class="field" id="cn" placeholder="Name" value="${esc(c.name)}">
      <textarea class="field" id="cl" rows="3" placeholder="What Zi knows about it">${esc(c.lore)}</textarea>
      <label class="btn ghost filebtn">Day form drawing<input type="file" id="cd" accept="image/*"></label>
      <label class="btn ghost filebtn">Night form drawing<input type="file" id="cnf" accept="image/*"></label>
      <div class="row"><button class="btn" id="cs">Add to the book</button>${c.name ? '<button class="btn danger small" id="cx">Remove</button>' : ''}</div>
    </div>`, el => {
    $('#cd', el).onchange = async e => { const f = e.target.files[0]; if (f) { c.day = (await shrinkImage(f, 1200)).blob; toast('Day form added'); } };
    $('#cnf', el).onchange = async e => { const f = e.target.files[0]; if (f) { c.night = (await shrinkImage(f, 1200)).blob; toast('Night form added'); } };
    $('#cs', el).onclick = async () => {
      c.name = $('#cn', el).value.trim(); if (!c.name) { $('#cn', el).focus(); return; }
      c.lore = $('#cl', el).value.trim(); await db.put('creatures', c); closeSheet(); render();
    };
    const x = $('#cx', el); if (x) x.onclick = async () => { if (await ask('Remove this creature from the book?', 'Remove', true)) { await db.del('creatures', c.id); render(); } };
  });
}
