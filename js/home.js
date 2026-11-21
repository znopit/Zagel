import { ROAD } from './art.js';
import { db, getMeta } from './db.js';
import { $, $$, esc, niceDate, pageTop } from './ui.js';

export const MODE_BTN = `<button class="round mode" type="button" aria-label="Switch to night"><svg viewBox="0 0 24 24" aria-hidden="true"><path class="moon" d="M15.5 3.5a8.5 8.5 0 1 0 5 13.5 7 7 0 1 1 -5 -13.5z"/><g class="sun"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></g></svg></button>`;

const ROUTE = { days: 'days', hat: 'hat', wishes: 'wishes', looks: 'looks', cauldron: 'cauldron', shelf: 'shelf', grimoire: 'grimoire', home: 'home' };

let cleanup = [];
export async function renderHome() {
  cleanup.forEach(f => f()); cleanup = [];
  const view = $('#view');
  view.innerHTML = `<div class="wrap homewrap">
    ${pageTop(MODE_BTN)}
    <div class="homegrid">
      <section class="hero">
        <div class="portrait"><img src="img/zoi.png" alt="Zoi's self-portrait: blue hair, yellow party hat with two cats"></div>
        <div class="big">Zagel<span class="dash"></span></div>
        <div class="sub"><span class="g">about</span> <span class="z">Zoi</span></div>
        <p class="lede">One day, Zoi the witch put everything on a bagel and walked down the witches’ road.</p>
        <p class="note">Kept offline, on this device.</p>
      </section>
      <div class="roadcol">
        <div class="sec"><span>Down the road</span><span>(07)</span></div>
        <div class="roadbox" id="roadbox">${ROAD}</div>
        <footer><span>Zagel</span><span>Down, down, down the road</span></footer>
      </div>
    </div>
  </div>`;

  // creatures
  $$('.crt').forEach(g => g.addEventListener('click', () => {
    g.classList.remove('hop'); void g.getBoundingClientRect(); g.classList.add('hop');
    const k = g.dataset.k;
    setTimeout(() => { location.hash = '#/' + (ROUTE[k] || ''); }, 320);
  }));

  // blinking
  let alive = true;
  cleanup.push(() => { alive = false; });
  (function blink() {
    if (!alive) return;
    const eyes = $$('.road .eyes');
    const e = eyes[Math.floor(Math.random() * eyes.length)];
    if (e) { e.classList.remove('blink'); void e.getBoundingClientRect(); e.classList.add('blink'); }
    setTimeout(blink, 900 + Math.random() * 1800);
  })();

  setupWalker();
  placeCats();
  const t = setInterval(placeCats, 60000); cleanup.push(() => clearInterval(t));
  shelfTop();
  cauldronBubble();
}
window.addEventListener('zagel:leave', () => { cleanup.forEach(f => f()); cleanup = []; });

// mini Zoi walks down the road as you scroll
function setupWalker() {
  const svg = $('.road'), walker = $('#walker'), src = $('.road .path');
  if (!svg || !walker || !src) return;
  const track = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  track.setAttribute('d', src.getAttribute('d'));
  track.setAttribute('fill', 'none');
  svg.insertBefore(track, svg.firstChild);
  const total = track.getTotalLength();
  const ys = [];
  for (let i = 0; i <= 200; i++) ys.push(track.getPointAtLength(total * i / 200));
  let stopT = null;
  function update() {
    const r = svg.getBoundingClientRect();
    const scale = r.width / 400;
    let y = (innerHeight * 0.55 - r.top) / scale;
    y = Math.max(0, Math.min(1282, y));
    let p = ys[0];
    for (const q of ys) { if (q.y <= y) p = q; else break; }
    walker.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
    svg.classList.add('walking');
    clearTimeout(stopT); stopT = setTimeout(() => svg.classList.remove('walking'), 220);
  }
  update();
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  cleanup.push(() => { removeEventListener('scroll', update); removeEventListener('resize', update); });
}

// Juno and Jupiter: outside by day, at the door in the evening, gone after midnight
function placeCats() {
  const h = new Date().getHours();
  const j = $('#cat-juno'), p = $('#cat-jupiter');
  if (!j || !p) return;
  let jt = '', pt = '', op = '1';
  if (h >= 18) { jt = 'translate(-74px,6px)'; pt = 'translate(90px,6px)'; }
  else if (h < 6) { op = '0'; }
  j.style.transform = jt; p.style.transform = pt;
  j.style.opacity = op; p.style.opacity = op;
}

async function shelfTop() {
  const id = await getMeta('lastPulled');
  if (!id) return;
  const b = await db.get('books', id);
  const el = $('#shelf-top');
  if (b && el) el.style.fill = b.color;
}

// an old thought floats back up out of the cauldron
async function cauldronBubble() {
  const thoughts = (await db.all('thoughts')).filter(t => t.text);
  if (!thoughts.length || Math.random() > 0.7) return;
  const old = thoughts.filter(t => Date.now() - t.created > 2 * 86400000);
  const pool = old.length ? old : thoughts;
  const t = pool[Math.floor(Math.random() * pool.length)];
  setTimeout(() => {
    const box = $('#roadbox'), c = $('#crt-cauldron');
    if (!box || !c) return;
    const br = box.getBoundingClientRect(), cr = c.getBoundingClientRect();
    const b = document.createElement('div');
    b.className = 'bubble';
    b.innerHTML = `${esc(t.text.length > 120 ? t.text.slice(0, 118) + '…' : t.text)}<small>${niceDate(t.created, true)} · tap to pop</small>`;
    b.style.left = Math.max(0, cr.left - br.left + cr.width * 0.45) + 'px';
    b.style.top = Math.max(0, cr.top - br.top - 70) + 'px';
    box.appendChild(b);
    b.onclick = () => { b.classList.add('pop'); setTimeout(() => b.remove(), 260); };
  }, 1400);
}
