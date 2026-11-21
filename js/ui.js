// Small shared helpers.
export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];
export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function toast(msg, ms = 2200) {
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), ms);
}

// ----- sheet -----
let onClose = null;
export function openSheet(html, after) {
  $('#sheet-in').innerHTML = html;
  document.body.classList.add('sheet-open');
  $('#sheet').scrollTop = 0;
  if (after) after($('#sheet-in'));
}
export function closeSheet() {
  document.body.classList.remove('sheet-open');
  if (onClose) { const f = onClose; onClose = null; f(); }
}
export function onSheetClose(f) { onClose = f; }
export function sheetHead(kicker) {
  return `<div class="shead"><span class="kicker">${esc(kicker)}</span><button class="btn small" data-close>Close ×</button></div>`;
}
document.addEventListener('click', e => {
  if (e.target.closest('[data-close]') || e.target.id === 'scrim') closeSheet();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });

export function ask(question, okLabel = 'Yes', danger = false) {
  return new Promise(resolve => {
    let done = false;
    onSheetClose(() => { if (!done) resolve(false); });
    openSheet(`${sheetHead('Are you sure?')}<p class="intro">${esc(question)}</p>
      <div class="row" style="margin-top:20px"><button class="btn ${danger ? 'danger' : ''}" id="ask-ok">${esc(okLabel)}</button><button class="btn ghost" data-close>Cancel</button></div>`,
      el => { $('#ask-ok', el).onclick = () => { done = true; onClose = null; closeSheet(); resolve(true); }; });
  });
}

// ----- confetti -----
export function confetti(x = innerWidth / 2, y = innerHeight / 2, n = 30) {
  const cols = ['#2A4EFC', '#F6E21C', '#F3C6D3', '#86C97E', '#E0457B', '#F07A2A'];
  for (let i = 0; i < n; i++) {
    const d = document.createElement('div');
    d.className = 'confetti';
    d.style.left = x + 'px'; d.style.top = y + 'px'; d.style.background = cols[i % cols.length];
    document.body.appendChild(d);
    const a = Math.random() * Math.PI * 2, v = 60 + Math.random() * 110, r = Math.random() * 720 - 360;
    d.animate([
      { transform: 'translate(0,0) rotate(0)', opacity: 1 },
      { transform: `translate(${Math.cos(a) * v}px,${Math.sin(a) * v - 50}px) rotate(${r}deg)`, opacity: 1, offset: .6 },
      { transform: `translate(${Math.cos(a) * v * 1.2}px,${Math.sin(a) * v + 90}px) rotate(${r * 1.5}deg)`, opacity: 0 }
    ], { duration: 1200 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.4,1)' }).onfinish = () => d.remove();
  }
}

// ----- images -----
// Shrinks a photo so the local database stays light. Keeps PNG transparency for cut-outs.
export async function shrinkImage(file, max = 1600) {
  const isPng = file.type === 'image/png';
  const bmp = await loadImage(file);
  let { width: w, height: h } = bmp;
  const s = Math.min(1, max / Math.max(w, h));
  w = Math.round(w * s); h = Math.round(h * s);
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  c.getContext('2d').drawImage(bmp, 0, 0, w, h);
  const blob = await new Promise(r => c.toBlob(r, isPng ? 'image/png' : 'image/jpeg', .86));
  return { blob, w, h };
}
export function loadImage(src) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img); img.onerror = rej;
    img.src = src instanceof Blob ? URL.createObjectURL(src) : src;
  });
}
const urlCache = new WeakMap();
export function blobURL(b) {
  if (!b) return '';
  if (!urlCache.has(b)) urlCache.set(b, URL.createObjectURL(b));
  return urlCache.get(b);
}
// Average-ish colour of a picture, nudged so it reads as a book spine.
export async function dominantColor(blob) {
  const img = await loadImage(blob);
  const c = document.createElement('canvas'); c.width = 24; c.height = 24;
  const x = c.getContext('2d'); x.drawImage(img, 0, 0, 24, 24);
  const d = x.getImageData(0, 0, 24, 24).data;
  const buckets = {};
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    const sat = mx === 0 ? 0 : (mx - mn) / mx;
    const key = [r >> 5, g >> 5, b >> 5].join(',');
    buckets[key] = buckets[key] || { n: 0, r: 0, g: 0, b: 0, w: 0 };
    const w = 1 + sat * 3;
    Object.assign(buckets[key], { n: buckets[key].n + 1, r: buckets[key].r + r * w, g: buckets[key].g + g * w, b: buckets[key].b + b * w, w: buckets[key].w + w });
  }
  const best = Object.values(buckets).sort((a, b) => b.w - a.w)[0];
  const hex = v => Math.round(v).toString(16).padStart(2, '0');
  return '#' + hex(best.r / best.w) + hex(best.g / best.w) + hex(best.b / best.w);
}
export function hue(hexc) {
  const n = parseInt(hexc.slice(1), 16), r = (n >> 16) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (d < .08) return 400 + (1 - mx) * 10; // greys at the end
  let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return (h * 60 + 360) % 360;
}

// ----- dates -----
export function dayKey(d = new Date()) {
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
export function fromKey(k) { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); }
export function niceDate(d, withYear = false) {
  if (typeof d === 'string') d = fromKey(d);
  if (typeof d === 'number') d = new Date(d);
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', ...(withYear ? { year: 'numeric' } : {}) });
}
export function daysSince(ts) { return Math.floor((Date.now() - ts) / 86400000); }

// ----- page chrome -----
export function pageTop(right = '') {
  return `<div class="top"><a class="back" href="#/">← Road</a>${right}</div>`;
}
export function pageTitle(title, n, kicker, intro) {
  return `${kicker ? `<div class="kicker" style="margin-top:18px">${esc(kicker)}</div>` : ''}
    <h1 class="ptitle">${esc(title)}${n ? `<sup>${n}</sup>` : ''}</h1>${intro ? `<p class="intro">${intro}</p>` : ''}`;
}

export function shareOrDownload(blob, filename, title) {
  const file = new File([blob], filename, { type: blob.type });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    return navigator.share({ files: [file], title }).catch(() => {});
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
