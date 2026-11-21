import { db } from '../db.js';
import { DEFS, TAGS, tagSVG } from '../art.js';
import { $, $$, esc, openSheet, closeSheet, sheetHead, dayKey, niceDate, pageTop, pageTitle } from '../ui.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const LABEL = Object.fromEntries(TAGS.map(t => [t.id, t.label]));

// Each tag creature is drawn once into a small picture, so a full year of creatures stays fast.
const sprites = {};
function spriteURL(id) {
  if (sprites[id]) return sprites[id];
  const inner = DEFS.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-40 -42 80 80" width="160" height="160">${inner}<use href="#c-${id}" xlink:href="#c-${id}"/></svg>`;
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  sprites[id] = new Promise(res => {
    const img = new Image();
    img.onload = () => {
      try {
        const c = document.createElement('canvas'); c.width = 160; c.height = 160;
        c.getContext('2d').drawImage(img, 0, 0, 160, 160);
        c.toBlob(b => res(b ? URL.createObjectURL(b) : url), 'image/png');
      } catch (e) { res(url); }
    };
    img.onerror = () => res(url);
    img.src = url;
  });
  return sprites[id];
}

function rng(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function hash(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }

const START_YEAR = 2026;
let editing = dayKey();
let year = new Date().getFullYear();

export async function render() {
  editing = dayKey(); year = new Date().getFullYear();
  await draw();
}

async function draw() {
  const all = await db.all('days');
  const byKey = Object.fromEntries(all.map(d => [d.id, d]));
  const yk = dayKey(new Date(Date.now() - 86400000));
  const y = byKey[yk];
  const cur = byKey[editing] || { id: editing, tags: [], note: '' };
  const isToday = editing === dayKey();
  const groups = ['MAKE', 'PLAY', 'LIVE'];

  $('#view').innerHTML = `<div class="wrap wide page">
    ${pageTop()}
    ${pageTitle('Days', '01', 'The bagel', 'Feed the bagel a seed a day. By December it’s crawling with creatures.')}
    <div class="yest">
      <span class="kicker" style="flex:none">Yesterday</span>
      ${y && (y.tags.length || y.note) ? `<div class="tags">${y.tags.map(t => tagSVG(t, 34)).join('')}</div><span class="muted" style="font-size:14px">${esc(y.note || y.tags.map(t => LABEL[t]).join(', '))}</span>` : `<span class="muted" style="font-size:14px">The bagel went hungry. It forgives you.</span>`}
    </div>

    <div class="sec tight"><span>${isToday ? 'Today' : niceDate(editing, true)}</span>
      <label class="kicker" style="cursor:pointer">Another day <input type="date" id="pick" value="${editing}" min="2026-01-01" max="${dayKey()}" style="opacity:0;width:1px;height:1px;position:absolute"></label></div>
    ${groups.map(g => `<div class="taggrp"><div class="kicker">${g}</div><div class="tagrow">
      ${TAGS.filter(t => t.group === g).map(t => `<button class="tagbtn ${cur.tags.includes(t.id) ? 'on' : ''}" data-t="${t.id}">${tagSVG(t.id, 58)}<span>${esc(t.label)}</span></button>`).join('')}
    </div></div>`).join('')}
    <input class="field" id="note" maxlength="140" placeholder="A few words for the bagel" value="${esc(cur.note || '')}" style="margin-top:18px">

    <div class="yearnav"><button class="round" id="py" aria-label="Previous year" style="${year <= START_YEAR ? 'visibility:hidden' : ''}">←</button><b>${year}</b><button class="round" id="ny" aria-label="Next year" style="${year >= new Date().getFullYear() ? 'visibility:hidden' : ''}">→</button></div>
    <div class="mural" id="mural">${MONTHS.map((m, i) => `<div class="month" data-m="${i}"><span class="ml">${String(i + 1).padStart(2, '0')} ${m} · <span class="cnt">0</span></span></div>`).join('')}</div>
    <p class="note">Poke a creature to see where it came from.</p>
  </div>`;

  const save = async () => {
    const tags = $$('.tagbtn.on').map(b => b.dataset.t);
    const note = $('#note').value.trim();
    if (!tags.length && !note) { await db.del('days', editing); }
    else await db.put('days', Object.assign(byKey[editing] || { id: editing }, { tags, note }));
    byKey[editing] = (await db.get('days', editing)) || undefined;
    mural(byKey);
  };
  $$('.tagbtn').forEach(b => b.onclick = () => { b.classList.toggle('on'); save(); });
  $('#note').addEventListener('change', save);
  $('#pick').addEventListener('change', e => { if (e.target.value) { editing = e.target.value; draw(); } });
  $('.sec label').onclick = () => { const p = $('#pick'); if (p.showPicker) { try { p.showPicker(); } catch (e) {} } };
  $('#py').onclick = () => { if (year > START_YEAR) { year--; draw(); } };
  $('#ny').onclick = () => { if (year < new Date().getFullYear()) { year++; draw(); } };
  mural(byKey);
}

async function mural(byKey) {
  const days = Object.values(byKey).filter(d => d && d.id.startsWith(year + '-'));
  for (let m = 0; m < 12; m++) {
    const cell = $(`.month[data-m="${m}"]`);
    if (!cell) return;
    $$('img', cell).forEach(i => i.remove());
    const list = days.filter(d => +d.id.slice(5, 7) === m + 1).sort((a, b) => a.id < b.id ? -1 : 1);
    const items = [];
    list.forEach(d => d.tags.forEach(t => items.push({ d, t })));
    $('.cnt', cell).textContent = items.length;
    const pts = [];
    for (const it of items) {
      const r = rng(hash(it.d.id + it.t));
      let best = null, bd = -1;
      for (let c = 0; c < 12; c++) {
        const p = [0.16 + r() * 0.68, 0.3 + r() * 0.56];
        let dist = 9;
        pts.forEach(q => { dist = Math.min(dist, Math.hypot(p[0] - q[0], p[1] - q[1])); });
        if (dist > bd) { bd = dist; best = p; }
      }
      pts.push(best);
      const img = document.createElement('img');
      const size = 24 + r() * 8;
      img.style.width = img.style.height = `${size}%`;
      img.style.left = `calc(${(best[0] * 100).toFixed(1)}% - ${size / 2}%)`;
      img.style.top = `calc(${(best[1] * 100).toFixed(1)}% - ${size / 2}%)`;
      img.style.transform = `rotate(${((r() - .5) * 24).toFixed(1)}deg)`;
      img.alt = `${LABEL[it.t]}, ${niceDate(it.d.id)}`;
      spriteURL(it.t).then(u => { img.src = u; });
      img.onclick = () => showDay(it.d);
      cell.appendChild(img);
    }
  }
}

function showDay(d) {
  openSheet(`${sheetHead(niceDate(d.id, true))}
    <div class="row" style="gap:4px">${d.tags.map(t => `<div style="text-align:center;font-size:12px" class="muted">${tagSVG(t, 64)}<div>${esc(LABEL[t])}</div></div>`).join('')}</div>
    ${d.note ? `<p class="intro" style="margin-top:14px">${esc(d.note)}</p>` : ''}
    <div class="row" style="margin-top:20px"><button class="btn ghost" id="edit-day">Edit this day</button></div>`, el => {
    $('#edit-day', el).onclick = () => { closeSheet(); editing = d.id; draw().then(() => window.scrollTo({ top: $('.sec.tight').offsetTop - 20, behavior: 'smooth' })); };
  });
}
