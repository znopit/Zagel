import { db, uid } from '../db.js';
import { $, $$, esc, confetti, ask, pageTop, pageTitle, openSheet, closeSheet, sheetHead } from '../ui.js';

// Every party leaves a paper hat. Each new one balances on the tip of the last.
const COLS = ['#2A4EFC', '#F6E21C', '#F3C6D3', '#86C97E', '#F07A2A', '#E0391F', '#B9A7E8', '#7FC8E8'];
const PATS = ['stripes', 'dots', 'bands', 'zigzag', 'stars', 'plain'];
const ROW = 86;

function rnd(seed) { let h = 7; for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0; return () => { h = (h * 1103515245 + 12345) >>> 0; return h / 4294967296; }; }

function look(p) {
  const r = rnd(p.id);
  const col = COLS[Math.floor(r() * COLS.length)];
  let alt = COLS[Math.floor(r() * COLS.length)]; if (alt === col) alt = '#FBF8F0';
  return { col, alt, pat: PATS[Math.floor(r() * PATS.length)], pom: r() < .5 ? '#FBF8F0' : alt, r };
}

const star = (x, y, s) => { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? s * .45 : s; d += (i ? 'L' : 'M') + (x + Math.cos(a) * rr).toFixed(1) + ' ' + (y + Math.sin(a) * rr).toFixed(1); } return d + 'Z'; };

export function hatSVG(p, cls = '') {
  const { col, alt, pat, pom, r } = look(p);
  const id = 'hc' + p.id.replace(/\W/g, '');
  let deco = '';
  if (pat === 'stripes') for (let x = -60; x < 80; x += 13) deco += `<path d="M${x} 90 L${x + 50} -6" stroke="${alt}" stroke-width="5"/>`;
  if (pat === 'dots') for (let i = 0; i < 9; i++) deco += `<circle cx="${(8 + r() * 44).toFixed(1)}" cy="${(16 + r() * 60).toFixed(1)}" r="${(2.2 + r() * 2).toFixed(1)}" fill="${alt}"/>`;
  if (pat === 'bands') for (const y of [24, 46, 66]) deco += `<path d="M-4 ${y} Q30 ${y + 9} 64 ${y}" stroke="${alt}" stroke-width="6" fill="none"/>`;
  if (pat === 'zigzag') for (const y of [30, 56]) { let d = `M-4 ${y}`; for (let x = 0; x <= 66; x += 7) d += ` L${x} ${y + (x / 7 % 2 ? -5 : 5)}`; deco += `<path d="${d}" stroke="${alt}" stroke-width="3" fill="none"/>`; }
  if (pat === 'stars') for (let i = 0; i < 4; i++) deco += `<path d="${star(14 + r() * 32, 22 + i * 14 + r() * 6, 4 + r() * 2)}" fill="${alt}"/>`;
  return `<svg class="${cls}" viewBox="-8 -12 76 98" aria-hidden="true"><defs><clipPath id="${id}"><path d="M30 0 L60 74 Q30 84 0 74 Z"/></clipPath></defs>
    <g filter="url(#zp)" stroke-linejoin="round">
      <path d="M30 0 L60 74 Q30 84 0 74 Z" fill="${col}"/>
      <g clip-path="url(#${id})">${deco}</g>
      <path d="M30 0 L60 74 Q30 84 0 74 Z" fill="none" stroke="#141414" stroke-width="1.5"/>
      <path d="M0 74 Q30 84 60 74" fill="none" stroke="#141414" stroke-width="1.5" stroke-dasharray="1 3.2" transform="translate(0 -4)"/>
      <circle cx="30" cy="-4" r="6.5" fill="${pom}" stroke="#141414" stroke-width="1.4"/>
    </g></svg>`;
}

// Bottom (oldest) to top: each hat stands on the tip of the one below, leaning back toward the middle.
function balance(list) {
  const out = []; let x = 0;
  for (const p of list) {
    const r = rnd(p.id + 'lean');
    let sign = x > 6 ? -1 : x < -6 ? 1 : (r() < .5 ? -1 : 1);
    const rot = sign * (2 + r() * 7);
    out.push({ p, x, rot });
    x += Math.sin(rot * Math.PI / 180) * 79;
    x = Math.max(-34, Math.min(34, x));
  }
  return out;
}

let justAdded = null;

export async function render() {
  const parties = (await db.all('parties')).sort((a, b) => a.created - b.created);
  const years = {};
  parties.forEach(p => (years[new Date(p.created).getFullYear()] ||= []).push(p));
  const y = new Date().getFullYear();
  const thisYear = (years[y] || []).length;
  const ys = Object.keys(years).map(Number).sort((a, b) => b - a);

  $('#view').innerHTML = `<div class="wrap page">
    ${pageTop()}
    ${pageTitle('Party Hat', '02', 'Small parties', 'Small things nobody else would throw a party for. Every party leaves a hat on the tower.')}
    <div class="stack" style="margin-top:26px">
      <input class="field" id="what" maxlength="160" placeholder="What are we celebrating?">
      <button class="btn" id="go">Put the hat on</button>
    </div>
    <div class="party" style="margin-top:40px"><span class="n">${thisYear}</span><span class="kicker">${thisYear === 1 ? 'party' : 'parties'} in ${y}</span></div>
    ${ys.length ? ys.map(yr => {
      const stack = balance(years[yr]).reverse();
      return `<div class="tower">${stack.map(({ p, x, rot }, i) => `<button class="hrow${p.id === justAdded ? ' drop' : ''}" data-id="${p.id}" style="z-index:${stack.length - i};height:${ROW}px">
          <span class="hcol"><span class="hat" style="left:calc(50% + ${x.toFixed(1)}px - 38px);top:${ROW - 91}px;transform:rotate(${rot.toFixed(1)}deg)">${hatSVG(p)}</span></span>
          <span class="hl"><span class="ht">${esc(p.text)}</span><span class="hd">${new Date(p.created).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span></span>
        </button>`).join('')}
        <div class="ground"><span class="ld">Party hats, ${yr}. Paper, glue, ${years[yr].length} ${years[yr].length === 1 ? 'party' : 'parties'}.</span><span class="ld ldt">Still balancing.</span></div>
      </div>`;
    }).join('') : '<p class="empty" style="margin-top:20px">No parties yet. The first hat is waiting.</p>'}
  </div>`;
  justAdded = null;

  const go = async () => {
    const text = $('#what').value.trim();
    if (!text) { $('#what').focus(); return; }
    const id = uid();
    await db.put('parties', { id, text });
    justAdded = id;
    const r = $('#go').getBoundingClientRect();
    confetti(r.left + r.width / 2, r.top, 46);
    setTimeout(render, 380);
  };
  $('#go').onclick = go;
  $('#what').addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  $$('.hrow').forEach(b => b.onclick = async () => invite(await db.get('parties', b.dataset.id)));
}

function invite(p) {
  const { col } = look(p);
  const when = new Date(p.created).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  openSheet(`${sheetHead('Invitation')}
    <div class="invite" style="--hc:${col}">
      <div class="iv-in">
        <span class="kicker">You’re invited</span>
        <div class="iv-hat">${hatSVG(p)}</div>
        <h2 class="iv-t">${esc(p.text)}</h2>
        <p class="iv-d">${when}</p>
        <p class="iv-s">Dress code: the hat. RSVP: not required.</p>
      </div>
    </div>
    <div class="row" style="margin-top:22px"><button class="btn ghost" id="pe">Edit</button><button class="btn danger" id="px">Take the hat off</button></div>`, el => {
    $('#pe', el).onclick = () => {
      $('.iv-t', el).outerHTML = `<textarea class="field" id="ptx" rows="2" maxlength="160">${esc(p.text)}</textarea>`;
      $('#ptx', el).focus();
      $('#pe', el).outerHTML = '<button class="btn" id="ps">Save</button>';
      $('#ps', el).onclick = async () => { const t = $('#ptx', el).value.trim(); if (!t) return; p.text = t; await db.put('parties', p); closeSheet(); render(); };
    };
    $('#px', el).onclick = async () => { if (await ask('Take this hat off the tower?', 'Take it off', true)) { await db.del('parties', p.id); render(); } };
  });
}
