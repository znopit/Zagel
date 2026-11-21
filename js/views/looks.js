import { db, uid } from '../db.js';
import { $, $$, esc, ask, toast, openSheet, closeSheet, sheetHead, shrinkImage, blobURL, loadImage, shareOrDownload, pageTop, pageTitle, niceDate } from '../ui.js';

const W = 1366, H = 1024; // one iPad screen, landscape
const SVGNS = 'http://www.w3.org/2000/svg';

// ---------- list ----------
export async function render(id) {
  if (id) return studio(id);
  if (window.__lookSave) { try { await window.__lookSave; } catch (e) {} window.__lookSave = null; }
  const boards = (await db.all('looks')).sort((a, b) => b.updated - a.updated);
  $('#view').innerHTML = `<div class="wrap wide page">
    ${pageTop()}
    ${pageTitle('Looks', '04', 'Fashion studies', 'Stare at clothes until they confess.')}
    <div class="row" style="margin-top:18px"><button class="btn" id="nb">New board</button></div>
    <div class="boards">${boards.map(b => `<div class="boardcard" data-id="${b.id}">
      <button class="th" data-open aria-label="Open board">${b.thumb ? `<img src="${blobURL(b.thumb)}" alt="">` : ''}</button>
      <div class="row" style="justify-content:space-between;flex-wrap:nowrap;align-items:flex-start;margin-top:6px">
        <div style="min-width:0;flex:1"><span class="bt" contenteditable="plaintext-only" spellcheck="false" data-ph="Untitled">${esc(b.question || '')}</span><small class="muted">${niceDate(b.updated, true)}</small></div>
        <button class="x" data-more aria-label="More">•••</button>
      </div></div>`).join('')}</div>
    ${boards.length ? '' : '<p class="empty">No boards yet.</p>'}
    <p class="note" style="margin-top:28px">Pencil draws. Fingers move and pinch. Two fingers tapped together summon the tools.</p>
  </div>`;
  $('#nb').onclick = async () => { const b = { id: uid(), question: '', items: [], strokes: [] }; await db.put('looks', b); location.hash = '#/looks/' + b.id; };
  $$('.boardcard').forEach(c => {
    $('[data-open]', c).onclick = () => { location.hash = '#/looks/' + c.dataset.id; };
    $('[data-more]', c).onclick = () => boardMenu(c.dataset.id);
    const t = $('.bt', c);
    t.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); t.blur(); } });
    t.addEventListener('blur', async () => { const b = await db.get('looks', c.dataset.id); if (!b) return; b.question = t.textContent.trim(); await db.put('looks', b); });
  });
}

async function boardMenu(id) {
  const board = await db.get('looks', id);
  openSheet(`${sheetHead(board.question || 'Untitled')}
    <p class="intro">The whole board, one iPad screen, as a picture.</p>
    <div class="row" style="margin-top:14px"><button class="btn" data-f="png">Export PNG</button><button class="btn" data-f="jpg">Export JPG</button></div>
    <div class="row" style="margin-top:10px"><button class="btn ghost" id="tog">Copy into the Grimoire</button></div>
    <div class="row" style="margin-top:26px"><button class="btn danger small" id="bdel">Delete board</button></div>`, el => {
    const blobs = Object.fromEntries((board.items || []).filter(i => i.blob).map(i => [i.id, i.blob]));
    $$('[data-f]', el).forEach(b => b.onclick = async () => {
      const blob = await renderBoard(board, blobs, 2, b.dataset.f);
      shareOrDownload(blob, `zagel-look-${board.id}.${b.dataset.f}`, board.question || 'Zagel look');
    });
    $('#tog', el).onclick = async () => {
      const img = await renderBoard(board, blobs, 1, 'jpg');
      await db.put('spells', { id: uid(), name: board.question || 'A look', ingredients: '', method: '', effect: '', img, source: 'looks:' + board.id });
      toast('Copied into the Grimoire.');
    };
    $('#bdel', el).onclick = async () => { if (await ask('Delete this whole board?', 'Delete', true)) { await db.del('looks', id); render(); } };
  });
}

// ---------- ink geometry ----------
// A stroke is a filled outline so its width can follow Pencil pressure.
// Points are smoothed first, so fast Pencil input doesn't turn into a knotted chain.
function outline(st) {
  const raw = st.pts;
  if (!raw || !raw.length) return '';
  const pts = [];
  let prev = null;
  for (const q of raw) {
    if (!prev) { prev = [q[0], q[1], q[2] ?? .5]; pts.push(prev); continue; }
    const nx = prev[0] + (q[0] - prev[0]) * 0.55, ny = prev[1] + (q[1] - prev[1]) * 0.55;
    if (Math.hypot(nx - prev[0], ny - prev[1]) < 1.5) continue;
    prev = [nx, ny, prev[2] + ((q[2] ?? .5) - prev[2]) * 0.35];
    pts.push(prev);
  }
  const last = raw[raw.length - 1];
  if (pts.length > 1 && Math.hypot(last[0] - prev[0], last[1] - prev[1]) > 0.5) pts.push([last[0], last[1], prev[2]]);
  const wd = q => st.erase ? st.size : st.size * (0.3 + q[2] * 0.95);
  const f = n => n.toFixed(1);
  if (pts.length === 1) { const r = wd(pts[0]) / 2, p = pts[0]; return `M${f(p[0] - r)} ${f(p[1])}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`; }
  const L = [], R = [];
  let dx0 = 0, dy0 = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 2)], b = pts[Math.min(pts.length - 1, i + 2)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const len = Math.hypot(dx, dy) || 1; dx /= len; dy /= len;
    if (i > 0) { dx = dx0 * 0.4 + dx * 0.6; dy = dy0 * 0.4 + dy * 0.6; const l2 = Math.hypot(dx, dy) || 1; dx /= l2; dy /= l2; }
    dx0 = dx; dy0 = dy;
    const w = wd(pts[i]) / 2;
    L.push([pts[i][0] - dy * w, pts[i][1] + dx * w]); R.push([pts[i][0] + dy * w, pts[i][1] - dx * w]);
  }
  const side = arr => {
    let d = '';
    for (let i = 1; i < arr.length - 1; i++) { const m = [(arr[i][0] + arr[i + 1][0]) / 2, (arr[i][1] + arr[i + 1][1]) / 2]; d += `Q${f(arr[i][0])} ${f(arr[i][1])} ${f(m[0])} ${f(m[1])}`; }
    const z = arr[arr.length - 1]; return d + `L${f(z[0])} ${f(z[1])}`;
  };
  const re = wd(pts[pts.length - 1]) / 2, rs = wd(pts[0]) / 2;
  const Rr = [...R].reverse();
  return `M${f(L[0][0])} ${f(L[0][1])}${side(L)}A${f(re)} ${f(re)} 0 0 0 ${f(Rr[0][0])} ${f(Rr[0][1])}${side(Rr)}A${f(rs)} ${f(rs)} 0 0 0 ${f(L[0][0])} ${f(L[0][1])}Z`;
}
const layerOf = (st, n) => (st.above == null ? n : Math.min(st.above, n));
let maskSeq = 0;
// Build one ink layer: strokes in order; every eraser stroke masks whatever was drawn before it.
function buildLayer(svg, strokes, k, n) {
  svg.innerHTML = '';
  let group = document.createElementNS(SVGNS, 'g');
  const defs = document.createElementNS(SVGNS, 'defs');
  svg.appendChild(defs);
  for (const st of strokes) {
    if (st.erase) {
      if (!group.childNodes.length) continue;
      const id = 'm' + (++maskSeq);
      const mask = document.createElementNS(SVGNS, 'mask');
      mask.setAttribute('id', id); mask.setAttribute('maskUnits', 'userSpaceOnUse');
      mask.setAttribute('x', 0); mask.setAttribute('y', 0); mask.setAttribute('width', W); mask.setAttribute('height', H);
      mask.innerHTML = `<rect width="${W}" height="${H}" fill="#fff"/>`;
      const hole = document.createElementNS(SVGNS, 'path');
      hole.setAttribute('d', outline(st)); hole.setAttribute('fill', '#000');
      mask.appendChild(hole); defs.appendChild(mask);
      (st._els = st._els || []).push(hole);
      group.setAttribute('mask', `url(#${id})`);
      const outer = document.createElementNS(SVGNS, 'g');
      outer.appendChild(group); group = outer;
      continue;
    }
    if (layerOf(st, n) !== k) continue;
    const path = document.createElementNS(SVGNS, 'path');
    path.setAttribute('d', outline(st)); path.setAttribute('fill', st.color);
    st._el = path; group.appendChild(path);
  }
  svg.appendChild(group);
  return group;
}


// ---------- studio ----------
const PALETTE = ['#141414', '#2A4EFC', '#F6E21C', '#E0391F', '#EEEBE3', '#FBF8F0'];
async function studio(id) {
  const board = await db.get('looks', id);
  if (!board) { location.hash = '#/looks'; return; }
  board.items = board.items || []; board.strokes = board.strokes || [];
  const touchDevice = 'ontouchstart' in window;
  let color = PALETTE[0], tool = 'pen', sel = null, toolsOn = !touchDevice;
  const sizes = { pen: 7, erase: 30 };
  const history = [];
  const snap = () => { history.push(JSON.stringify({ items: board.items.map(i => ({ ...i, blob: undefined })), strokes: board.strokes.map(({ _el, _els, ...r }) => r) })); if (history.length > 50) history.shift(); };
  const blobs = Object.fromEntries(board.items.filter(i => i.blob).map(i => [i.id, i.blob]));

  $('#view').innerHTML = `<div class="studio" id="studio">
    <div class="stage" id="stage" style="width:${W}px;height:${H}px"><div id="layers"></div></div>
    <button class="exit" id="exit" aria-label="Back to Looks">←</button>
    <div class="tools ${toolsOn ? '' : 'hide'}" id="tools">
      <div class="trow">
        <label class="filebtn">+ Picture<input type="file" id="t-img" accept="image/*" multiple></label>
        <button id="t-text">+ Text</button>
        <button id="t-pen" class="on">Pen</button>
        <button id="t-erase">Eraser</button>
        ${touchDevice ? '' : '<button id="t-move">Move</button>'}
        <button id="t-undo">Undo</button>
        <button id="t-front">To front</button>
        <button id="t-del">Delete</button>
        <button id="t-fit">Fit</button>
      </div>
      <div class="trow">
        ${PALETTE.map((c, i) => `<button class="sw ${i === 0 ? 'on' : ''}" data-c="${c}" style="background:${c}" aria-label="Colour ${c}"></button>`).join('')}
        <label class="sw wheel" aria-label="Any colour"><input type="color" id="t-wheel" value="#2A4EFC"></label>
        <button id="t-pick" aria-label="Pick a colour from the board">Pick</button>
        <span class="dot" id="t-dot"></span>
        <input type="range" id="t-size" min="1" max="140" step="1" value="${sizes.pen}" aria-label="Size">
      </div>
    </div>
    <div class="hint" id="hint">${touchDevice ? 'Tap with two fingers for tools · pinch the empty board to zoom' : 'Draw with the mouse · Move to arrange'}</div>
  </div>`;
  const studioEl = $('#studio'), stage = $('#stage'), layers = $('#layers');
  setTimeout(() => { const h = $('#hint'); if (h) h.style.opacity = 0; }, 3000);

  // ----- view: fit + zoom -----
  let s = 1, ox = 0, oy = 0, z = 1, vx = 0, vy = 0;
  function apply() { stage.style.transform = `translate(${ox + vx}px,${oy + vy}px) scale(${s * z})`; }
  function fit() { s = Math.min(innerWidth / W, innerHeight / H); ox = (innerWidth - W * s) / 2; oy = (innerHeight - H * s) / 2; apply(); }
  fit(); addEventListener('resize', fit);
  const toBoard = (cx, cy) => [(cx - ox - vx) / (s * z), (cy - oy - vy) / (s * z)];

  // ----- rendering: [ink0, item0, ink1, item1, … itemN-1, inkN] -----
  const itemEls = new Map(), inkEls = [];
  function inkLayer(k) {
    if (!inkEls[k]) { const g = document.createElementNS(SVGNS, 'svg'); g.setAttribute('class', 'ink'); g.setAttribute('viewBox', `0 0 ${W} ${H}`); g.setAttribute('width', W); g.setAttribute('height', H); inkEls[k] = g; }
    return inkEls[k];
  }
  function itemEl(it) {
    let el = itemEls.get(it.id);
    if (!el) {
      el = document.createElement('div'); el.dataset.id = it.id;
      if (it.type === 'img') { const img = document.createElement('img'); img.alt = ''; img.draggable = false; img.src = blobURL(blobs[it.id]); el.appendChild(img); }
      itemEls.set(it.id, el);
    }
    el.className = `it ${it.type === 'text' ? 'txt' : ''} ${sel === it.id ? 'sel' : ''}`;
    if (it.type === 'img') { el.style.width = it.w + 'px'; el.style.height = it.h + 'px'; }
    else { el.textContent = it.text; el.style.fontSize = (it.size || 36) + 'px'; el.style.color = it.color || '#141414'; }
    el.style.transform = `translate(${it.x}px,${it.y}px) rotate(${it.rot || 0}deg)`;
    return el;
  }
  function draw() {
    const n = board.items.length, want = [];
    board.strokes.forEach(st => { st._els = []; });
    for (let k = 0; k <= n; k++) {
      const L = inkLayer(k); L._top = buildLayer(L, board.strokes, k, n); want.push(L);
      if (k < n) want.push(itemEl(board.items[k]));
    }
    const keep = new Set(board.items.map(i => i.id));
    for (const [k, el] of itemEls) if (!keep.has(k)) { el.remove(); itemEls.delete(k); }
    inkEls.slice(n + 1).forEach(e => e && e.remove());
    want.forEach(el => layers.appendChild(el));
  }
  draw();

  let saveT = null;
  const strip = b => ({ ...b, strokes: b.strokes.map(({ _el, _els, ...r }) => r) });
  const save = () => { clearTimeout(saveT); saveT = setTimeout(() => { board.items.forEach(i => { if (blobs[i.id]) i.blob = blobs[i.id]; }); db.put('looks', strip(board)); }, 400); };

  // ----- colour + size -----
  const dot = $('#t-dot'), range = $('#t-size');
  function showDot() { const v = sizes[tool === 'erase' ? 'erase' : 'pen']; const d = Math.max(4, Math.min(34, v / 3 + 3)); dot.style.width = dot.style.height = d + 'px'; dot.style.background = tool === 'erase' ? 'transparent' : color; dot.style.borderColor = tool === 'erase' ? '#EEEBE3' : 'transparent'; }
  function setColor(c) {
    color = c; $$('[data-c]').forEach(x => x.classList.toggle('on', x.dataset.c.toLowerCase() === c.toLowerCase()));
    $('.wheel').style.background = c; if (tool !== 'pen') setTool('pen'); showDot();
    const it = board.items.find(i => i.id === sel); if (it && it.type === 'text') { snap(); it.color = c; itemEl(it); save(); }
  }
  range.addEventListener('input', () => { sizes[tool === 'erase' ? 'erase' : 'pen'] = +range.value; showDot(); });
  $$('[data-c]').forEach(b => b.onclick = () => setColor(b.dataset.c));
  $('#t-wheel').addEventListener('input', e => setColor(e.target.value));
  function setTool(t) {
    tool = t; ['pen', 'erase', 'move', 'pick'].forEach(k => { const b = $('#t-' + k); if (b) b.classList.toggle('on', k === t); });
    if (t === 'pen' || t === 'erase') range.value = sizes[t];
    showDot();
  }
  showDot();

  // eyedropper: sample whatever is on the board under the tap
  async function pickAt(x, y) {
    const c = await drawBoard(strip(board), blobs, 1);
    const d = c.getContext('2d').getImageData(Math.max(0, Math.min(W - 1, Math.round(x))), Math.max(0, Math.min(H - 1, Math.round(y))), 1, 1).data;
    const hex = '#' + [d[0], d[1], d[2]].map(v => v.toString(16).padStart(2, '0')).join('');
    $('#t-wheel').value = hex; setColor(hex); toast('Colour picked');
  }

  // ----- pointers -----
  const pts = new Map();
  let stroke = null, drag = null, pinch = null, zoom = null, twoTap = null, lastTap = null;
  function itemAt(x, y) {
    for (let i = board.items.length - 1; i >= 0; i--) {
      const it = board.items[i], el = itemEls.get(it.id);
      const w = it.type === 'img' ? it.w : (el ? el.offsetWidth : 100), h = it.type === 'img' ? it.h : (el ? el.offsetHeight : 40);
      const cx = it.x + w / 2, cy = it.y + h / 2, a = -(it.rot || 0) * Math.PI / 180;
      const dx = x - cx, dy = y - cy;
      const rx = dx * Math.cos(a) - dy * Math.sin(a), ry = dx * Math.sin(a) + dy * Math.cos(a);
      if (Math.abs(rx) <= w / 2 && Math.abs(ry) <= h / 2) return it;
    }
    return null;
  }
  studioEl.addEventListener('pointerdown', e => {
    if (e.target.closest('#tools') || e.target.closest('#exit')) return;
    studioEl.setPointerCapture(e.pointerId);
    const [x, y] = toBoard(e.clientX, e.clientY);
    pts.set(e.pointerId, { x, y, cx: e.clientX, cy: e.clientY, type: e.pointerType, t: Date.now() });
    if (tool === 'pick') { pickAt(x, y); return; }
    const drawing = e.pointerType === 'pen' || (e.pointerType === 'mouse' && tool !== 'move');
    if (drawing) {
      snap();
      if (tool === 'erase') { stroke = { erase: true, size: sizes.erase, pts: [[x, y, .5]] }; board.strokes.push(stroke); draw(); return; }
      stroke = { color, size: sizes.pen, pts: [[x, y, e.pressure || .5]], above: board.items.length };
      board.strokes.push(stroke);
      const path = document.createElementNS(SVGNS, 'path'); path.setAttribute('fill', color); path.setAttribute('d', outline(stroke));
      stroke._el = path; (inkLayer(board.items.length)._top || inkLayer(board.items.length)).appendChild(path);
      return;
    }
    const touches = [...pts.values()].filter(p => p.type !== 'pen');
    if (touches.length === 2) {
      twoTap = { t: Date.now(), moved: false };
      drag = null;
      const [a, b] = touches;
      const it = board.items.find(i => i.id === sel);
      if (it) {
        const el = itemEls.get(it.id);
        const w = it.type === 'img' ? it.w : el.offsetWidth, h = it.type === 'img' ? it.h : el.offsetHeight;
        pinch = { it, d0: Math.hypot(a.cx - b.cx, a.cy - b.cy), ang0: Math.atan2(b.cy - a.cy, b.cx - a.cx), w0: it.w, h0: it.h, size0: it.size || 36, rot0: it.rot || 0, cx: it.x + w / 2, cy: it.y + h / 2 };
        snap();
      } else {
        zoom = { d0: Math.hypot(a.cx - b.cx, a.cy - b.cy), z0: z, vx0: vx, vy0: vy, mx: (a.cx + b.cx) / 2, my: (a.cy + b.cy) / 2 };
      }
      return;
    }
    const it = itemAt(x, y);
    if (it && it.type === 'text' && lastTap && lastTap.id === it.id && Date.now() - lastTap.t < 350) { lastTap = null; editText(it); return; }
    lastTap = it ? { id: it.id, t: Date.now() } : null;
    const prev = sel; sel = it ? it.id : null;
    if (it) { snap(); drag = { it, dx: x - it.x, dy: y - it.y }; }
    if (prev !== sel) draw();
  });
  studioEl.addEventListener('pointermove', e => {
    const p = pts.get(e.pointerId); if (!p) return;
    if (Math.hypot(e.clientX - p.cx, e.clientY - p.cy) > 10 && twoTap) twoTap.moved = true;
    p.cx = e.clientX; p.cy = e.clientY;
    const [x, y] = toBoard(e.clientX, e.clientY); p.x = x; p.y = y;
    if (stroke) {
      const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      for (const ev of evs) { const [bx, by] = toBoard(ev.clientX, ev.clientY); stroke.pts.push([bx, by, stroke.erase ? .5 : (ev.pressure || .5)]); }
      const d = outline(stroke);
      if (stroke.erase) (stroke._els || []).forEach(h => h.setAttribute('d', d)); else stroke._el.setAttribute('d', d);
      return;
    }
    const touches = [...pts.values()].filter(q => q.type !== 'pen');
    if (zoom && touches.length >= 2) {
      const [a, b] = touches;
      const k = Math.hypot(a.cx - b.cx, a.cy - b.cy) / zoom.d0;
      const nz = Math.max(1, Math.min(6, zoom.z0 * k));
      const mx = (a.cx + b.cx) / 2, my = (a.cy + b.cy) / 2;
      // keep the point under the fingers in place
      const bx = (zoom.mx - ox - zoom.vx0) / (s * zoom.z0), by = (zoom.my - oy - zoom.vy0) / (s * zoom.z0);
      z = nz; vx = mx - ox - bx * s * z; vy = my - oy - by * s * z;
      if (z === 1) { vx = 0; vy = 0; }
      apply(); return;
    }
    if (pinch && touches.length >= 2) {
      const [a, b] = touches;
      const k = Math.hypot(a.cx - b.cx, a.cy - b.cy) / pinch.d0;
      const ang = Math.atan2(b.cy - a.cy, b.cx - a.cx) - pinch.ang0;
      const it = pinch.it;
      if (it.type === 'img') { it.w = Math.max(40, pinch.w0 * k); it.h = Math.max(40, pinch.h0 * k); it.x = pinch.cx - it.w / 2; it.y = pinch.cy - it.h / 2; }
      else it.size = Math.max(14, Math.min(220, pinch.size0 * k));
      it.rot = pinch.rot0 + ang * 180 / Math.PI;
      itemEl(it); return;
    }
    if (drag) { drag.it.x = x - drag.dx; drag.it.y = y - drag.dy; itemEl(drag.it); }
  });
  const end = e => {
    pts.delete(e.pointerId);
    if (stroke) { stroke = null; save(); }
    if (twoTap && pts.size === 0) {
      if (!twoTap.moved && Date.now() - twoTap.t < 350) toggleTools();
      twoTap = null;
    }
    if (pinch && pts.size < 2) { pinch = null; save(); }
    if (zoom && pts.size < 2) zoom = null;
    if (drag && pts.size === 0) { drag = null; save(); }
  };
  studioEl.addEventListener('pointerup', end);
  studioEl.addEventListener('pointercancel', end);
  studioEl.addEventListener('dblclick', e => { const [x, y] = toBoard(e.clientX, e.clientY); const it = itemAt(x, y); if (it && it.type === 'text') editText(it); });
  studioEl.addEventListener('wheel', e => { if (!e.ctrlKey) return; e.preventDefault(); z = Math.max(1, Math.min(6, z * (e.deltaY < 0 ? 1.1 : 0.9))); if (z === 1) { vx = 0; vy = 0; } apply(); }, { passive: false });
  function toggleTools() { toolsOn = !toolsOn; $('#tools').classList.toggle('hide', !toolsOn); }

  // ----- tools -----
  $('#exit').onclick = () => { location.hash = '#/looks'; };
  $('#t-fit').onclick = () => { z = 1; vx = 0; vy = 0; apply(); };
  $('#t-img').onchange = async e => {
    snap();
    for (const f of e.target.files) {
      const { blob, w, h } = await shrinkImage(f, 2000);
      const k = Math.min(500 / w, 520 / h);
      const it = { id: uid(), type: 'img', w: w * k, h: h * k, x: 120 + Math.random() * 600, y: 150 + Math.random() * 260, rot: (Math.random() - .5) * 6 };
      blobs[it.id] = blob; board.items.push(it); sel = it.id;
    }
    e.target.value = ''; draw(); save();
  };
  $('#t-text').onclick = () => editText(null);
  $('#t-pen').onclick = () => setTool('pen');
  $('#t-erase').onclick = () => setTool('erase');
  $('#t-pick').onclick = () => setTool('pick');
  const mv = $('#t-move'); if (mv) mv.onclick = () => setTool('move');
  $('#t-undo').onclick = () => {
    const last = history.pop(); if (!last) return;
    const st = JSON.parse(last); board.items = st.items; board.strokes = st.strokes; draw(); save();
  };
  $('#t-front').onclick = () => {
    const i = board.items.findIndex(x => x.id === sel);
    if (i < 0) { toast('Tap a picture or text first'); return; }
    snap();
    const n = board.items.length;
    board.strokes.forEach(st => { if (st.erase) return; const k = layerOf(st, n); st.above = k > i ? k - 1 : k; });
    board.items.push(board.items.splice(i, 1)[0]);
    draw(); save();
  };
  $('#t-del').onclick = () => {
    const i = board.items.findIndex(x => x.id === sel);
    if (i < 0) { toast('Tap a picture or text first'); return; }
    snap();
    const n = board.items.length;
    board.strokes.forEach(st => { if (st.erase) return; const k = layerOf(st, n); st.above = k > i ? k - 1 : k; });
    board.items.splice(i, 1); sel = null; draw(); save();
  };

  function editText(it) {
    openSheet(`${sheetHead(it ? 'Edit text' : 'Add text')}<div class="stack"><textarea class="field" id="tx" rows="2">${esc(it ? it.text : '')}</textarea><button class="btn" id="txs">${it ? 'Save' : 'Add'}</button></div>`, el => {
      setTimeout(() => $('#tx', el).focus(), 300);
      $('#txs', el).onclick = () => {
        const text = $('#tx', el).value.trim(); if (!text) { closeSheet(); return; }
        snap();
        if (it) it.text = text; else { const n = { id: uid(), type: 'text', text, x: 200 + Math.random() * 500, y: 300 + Math.random() * 300, size: 36, color, rot: 0 }; board.items.push(n); sel = n.id; }
        draw(); save(); closeSheet();
      };
    });
  }

  // leaving: save and make a thumbnail
  let leaving = false;
  const onLeave = () => {
    window.removeEventListener('zagel:leave', onLeave); removeEventListener('resize', fit);
    if (leaving) return; leaving = true;
    clearTimeout(saveT);
    board.items.forEach(i => { if (blobs[i.id]) i.blob = blobs[i.id]; });
    window.__lookSave = (async () => {
      const b = strip(board);
      try { b.thumb = await renderBoard(b, blobs, 0.6, 'jpg'); } catch (e) {}
      await db.put('looks', b);
    })();
  };
  window.addEventListener('zagel:leave', onLeave);
}

// ---------- export ----------
async function drawBoard(board, blobs, scale) {
  const c = document.createElement('canvas'); c.width = Math.round(W * scale); c.height = Math.round(H * scale);
  const x = c.getContext('2d'); x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high'; x.scale(scale, scale);
  x.fillStyle = '#EEEBE3'; x.fillRect(0, 0, W, H);
  const items = board.items || [], strokes = board.strokes || [], n = items.length;
  const ink = k => {
    const lc = document.createElement('canvas'); lc.width = c.width; lc.height = c.height;
    const l = lc.getContext('2d'); l.scale(scale, scale);
    let any = false;
    for (const st of strokes) {
      if (st.erase) { if (any) { l.globalCompositeOperation = 'destination-out'; l.fill(new Path2D(outline(st))); l.globalCompositeOperation = 'source-over'; } continue; }
      if (layerOf(st, n) !== k) continue;
      any = true; l.fillStyle = st.color; l.fill(new Path2D(outline(st)));
    }
    if (any) { x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(lc, 0, 0); x.restore(); }
  };
  for (let k = 0; k <= n; k++) {
    ink(k);
    if (k === n) break;
    const it = items[k];
    x.save();
    if (it.type === 'img') {
      const src = blobs[it.id] || it.blob; if (!src) { x.restore(); continue; }
      const img = await loadImage(src);
      x.translate(it.x + it.w / 2, it.y + it.h / 2); x.rotate((it.rot || 0) * Math.PI / 180);
      x.drawImage(img, -it.w / 2, -it.h / 2, it.w, it.h);
    } else {
      x.font = `500 ${it.size || 36}px 'Zagel Display', sans-serif`; x.fillStyle = it.color || '#141414'; x.textBaseline = 'top';
      const lines = it.text.split('\n'); const lh = (it.size || 36) * 1.1;
      const w = Math.max(...lines.map(l => x.measureText(l).width)), h = lh * lines.length;
      x.translate(it.x + w / 2, it.y + h / 2); x.rotate((it.rot || 0) * Math.PI / 180);
      lines.forEach((l, i) => x.fillText(l, -w / 2, -h / 2 + i * lh));
    }
    x.restore();
  }
  return c;
}
async function renderBoard(board, blobs, scale, fmt) {
  const c = await drawBoard(board, blobs, scale);
  return new Promise(r => c.toBlob(r, fmt === 'png' ? 'image/png' : 'image/jpeg', .92));
}
