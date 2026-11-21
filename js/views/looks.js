import { db, uid } from '../db.js';
import { $, $$, esc, ask, toast, openSheet, closeSheet, sheetHead, shrinkImage, blobURL, loadImage, shareOrDownload, pageTop, pageTitle, niceDate } from '../ui.js';

const W = 1366, H = 1024; // one iPad screen, landscape
const COLORS = ['#141414', '#2A4EFC', '#F6E21C', '#E0391F', '#FBF8F0'];
const SIZES = [3, 7, 16];

export async function render(id) {
  if (id) return studio(id);
  if (window.__lookSave) { try { await window.__lookSave; } catch (e) {} window.__lookSave = null; }
  const boards = (await db.all('looks')).sort((a, b) => b.updated - a.updated);
  $('#view').innerHTML = `<div class="wrap wide page">
    ${pageTop()}
    ${pageTitle('Looks', '04', 'Fashion studies', 'Each board asks one question. Lay pictures side by side, scribble on them with your Pencil, write down what you see.')}
    <div class="row" style="margin-top:18px"><button class="btn" id="nb">New board</button></div>
    <div class="boards">${boards.map(b => `<button class="boardcard" data-id="${b.id}"><div class="th">${b.thumb ? `<img src="${blobURL(b.thumb)}" alt="">` : ''}</div><span>${esc(b.question || 'Untitled')}</span><small class="muted">${niceDate(b.updated, true)}</small></button>`).join('')}</div>
    ${boards.length ? '' : '<p class="empty">No boards yet.</p>'}
    <p class="note" style="margin-top:28px">In a board: draw with Apple Pencil, move pictures with your finger, and tap with two fingers to show or hide the tools.</p>
  </div>`;
  $('#nb').onclick = () => openSheet(`${sheetHead('New board')}<div class="stack"><input class="field" id="q" placeholder="What are you trying to figure out?" maxlength="90"><button class="btn" id="qs">Open the board</button></div>`, el => {
    const go = async () => { const b = { id: uid(), question: $('#q', el).value.trim(), items: [], strokes: [] }; await db.put('looks', b); closeSheet(); location.hash = '#/looks/' + b.id; };
    $('#qs', el).onclick = go; $('#q', el).addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    setTimeout(() => $('#q', el).focus(), 300);
  });
  $$('.boardcard').forEach(c => c.onclick = () => { location.hash = '#/looks/' + c.dataset.id; });
}

async function studio(id) {
  const board = await db.get('looks', id);
  if (!board) { location.hash = '#/looks'; return; }
  board.items = board.items || []; board.strokes = board.strokes || [];
  const touchDevice = 'ontouchstart' in window;
  let color = COLORS[0], size = SIZES[1], tool = 'pen', sel = null, toolsOn = !touchDevice;
  const history = [];
  const snap = () => { history.push(JSON.stringify({ items: board.items.map(i => ({ ...i, blob: undefined })), strokes: board.strokes })); if (history.length > 40) history.shift(); };
  const blobs = Object.fromEntries(board.items.filter(i => i.blob).map(i => [i.id, i.blob]));

  $('#view').innerHTML = `<div class="studio" id="studio">
    <div class="stage" id="stage" style="width:${W}px;height:${H}px">
      <div class="q" id="q">${esc(board.question || '')}</div>
      <div id="items"></div>
      <canvas id="ink" width="${W * 1.5}" height="${H * 1.5}" style="width:${W}px;height:${H}px"></canvas>
    </div>
    <div class="tools ${toolsOn ? '' : 'hide'}" id="tools">
      <button id="t-back">← Looks</button>
      <label class="filebtn">+ Picture<input type="file" id="t-img" accept="image/*" multiple></label>
      <button id="t-text">+ Text</button>
      <button id="t-pen" class="on">Pen</button>
      ${COLORS.map((c, i) => `<button class="sw ${i === 0 ? 'on' : ''}" data-c="${c}" style="background:${c}" aria-label="Colour"></button>`).join('')}
      ${SIZES.map((s, i) => `<button class="${i === 1 ? 'on' : ''}" data-s="${s}" aria-label="Size"><span style="display:block;width:${s + 2}px;height:${s + 2}px;border-radius:50%;background:currentColor"></span></button>`).join('')}
      <button id="t-erase">Eraser</button>
      ${touchDevice ? '' : '<button id="t-move">Move</button>'}
      <button id="t-undo">Undo</button>
      <button id="t-front">To front</button>
      <button id="t-del">Delete</button>
      <button id="t-q">Question</button>
      <button id="t-export">Export</button>
    </div>
    <div class="hint" id="hint">${touchDevice ? 'Tap with two fingers for tools' : 'Draw with the mouse · Move to arrange'}</div>
  </div>`;
  const studioEl = $('#studio'), stage = $('#stage'), ink = $('#ink'), ctx = ink.getContext('2d');
  ctx.scale(1.5, 1.5);
  setTimeout(() => { const h = $('#hint'); if (h) h.style.opacity = 0; }, 2600);

  let s = 1, ox = 0, oy = 0;
  function fit() {
    s = Math.min(innerWidth / W, innerHeight / H);
    ox = (innerWidth - W * s) / 2; oy = (innerHeight - H * s) / 2;
    stage.style.transform = `translate(${ox}px,${oy}px) scale(${s})`;
  }
  fit(); addEventListener('resize', fit);
  const toBoard = (cx, cy) => [(cx - ox) / s, (cy - oy) / s];

  // ----- items -----
  function drawItems() {
    $('#items').innerHTML = board.items.map(it => it.type === 'img'
      ? `<div class="it ${sel === it.id ? 'sel' : ''}" data-id="${it.id}" style="width:${it.w}px;height:${it.h}px;transform:translate(${it.x}px,${it.y}px) rotate(${it.rot || 0}deg)"><img src="${blobURL(blobs[it.id])}" alt=""></div>`
      : `<div class="it txt ${sel === it.id ? 'sel' : ''}" data-id="${it.id}" style="font-size:${it.size || 36}px;color:${it.color || '#141414'};transform:translate(${it.x}px,${it.y}px) rotate(${it.rot || 0}deg)">${esc(it.text)}</div>`).join('');
  }
  function drawInk() {
    ctx.clearRect(0, 0, W, H);
    for (const st of board.strokes) paintStroke(ctx, st);
  }
  drawItems(); drawInk();

  let saveT = null;
  const save = () => { clearTimeout(saveT); saveT = setTimeout(() => { board.items.forEach(i => { if (blobs[i.id]) i.blob = blobs[i.id]; }); db.put('looks', board); }, 400); };

  // ----- pointers -----
  const pts = new Map();
  let stroke = null, drag = null, pinch = null, twoTap = null;
  function itemAt(x, y) {
    for (let i = board.items.length - 1; i >= 0; i--) {
      const it = board.items[i];
      const el = $(`.it[data-id="${it.id}"]`);
      const w = it.type === 'img' ? it.w : (el ? el.offsetWidth : 100), h = it.type === 'img' ? it.h : (el ? el.offsetHeight : 40);
      const cx = it.x + w / 2, cy = it.y + h / 2, a = -(it.rot || 0) * Math.PI / 180;
      const dx = x - cx, dy = y - cy;
      const rx = dx * Math.cos(a) - dy * Math.sin(a), ry = dx * Math.sin(a) + dy * Math.cos(a);
      if (Math.abs(rx) <= w / 2 && Math.abs(ry) <= h / 2) return it;
    }
    return null;
  }
  studioEl.addEventListener('pointerdown', e => {
    if (e.target.closest('#tools')) return;
    studioEl.setPointerCapture(e.pointerId);
    const [x, y] = toBoard(e.clientX, e.clientY);
    pts.set(e.pointerId, { x, y, cx: e.clientX, cy: e.clientY, type: e.pointerType, t: Date.now() });
    const drawing = e.pointerType === 'pen' || (e.pointerType === 'mouse' && tool !== 'move');
    if (drawing) {
      if (tool === 'erase') { snap(); erase(x, y); stroke = { erase: true }; return; }
      snap();
      stroke = { color, size, pts: [[x, y, e.pressure || .5]] };
      board.strokes.push(stroke);
      return;
    }
    const touches = [...pts.values()].filter(p => p.type !== 'pen');
    if (touches.length === 2) {
      twoTap = { t: Date.now(), moved: false };
      drag = null;
      const it = board.items.find(i => i.id === sel);
      if (it) {
        const [a, b] = touches;
        pinch = { it, d0: Math.hypot(a.cx - b.cx, a.cy - b.cy), ang0: Math.atan2(b.cy - a.cy, b.cx - a.cx), w0: it.w, h0: it.h, size0: it.size || 36, rot0: it.rot || 0, cx: it.x + (it.w || 0) / 2, cy: it.y + (it.h || 0) / 2 };
        snap();
      }
      return;
    }
    const it = itemAt(x, y);
    sel = it ? it.id : null;
    if (it) { snap(); drag = { it, dx: x - it.x, dy: y - it.y }; }
    drawItems();
  });
  studioEl.addEventListener('pointermove', e => {
    const p = pts.get(e.pointerId); if (!p) return;
    const [x, y] = toBoard(e.clientX, e.clientY);
    if (Math.hypot(e.clientX - p.cx, e.clientY - p.cy) > 10 && twoTap) twoTap.moved = true;
    p.x = x; p.y = y; p.cx = e.clientX; p.cy = e.clientY;
    if (stroke) {
      if (stroke.erase) { erase(x, y); return; }
      const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      for (const ev of evs) { const [bx, by] = toBoard(ev.clientX, ev.clientY); stroke.pts.push([bx, by, ev.pressure || .5]); }
      drawInk(); return;
    }
    if (pinch) {
      const touches = [...pts.values()].filter(q => q.type !== 'pen');
      if (touches.length < 2) return;
      const [a, b] = touches;
      const k = Math.hypot(a.cx - b.cx, a.cy - b.cy) / pinch.d0;
      const ang = Math.atan2(b.cy - a.cy, b.cx - a.cx) - pinch.ang0;
      const it = pinch.it;
      if (it.type === 'img') { it.w = Math.max(40, pinch.w0 * k); it.h = Math.max(40, pinch.h0 * k); it.x = pinch.cx - it.w / 2; it.y = pinch.cy - it.h / 2; }
      else it.size = Math.max(14, Math.min(200, pinch.size0 * k));
      it.rot = pinch.rot0 + ang * 180 / Math.PI;
      drawItems(); return;
    }
    if (drag) { drag.it.x = x - drag.dx; drag.it.y = y - drag.dy; const el = $(`.it[data-id="${drag.it.id}"]`); if (el) el.style.transform = `translate(${drag.it.x}px,${drag.it.y}px) rotate(${drag.it.rot || 0}deg)`; }
  });
  const end = e => {
    pts.delete(e.pointerId);
    if (stroke) { stroke = null; save(); }
    if (twoTap && pts.size === 0) {
      if (!twoTap.moved && Date.now() - twoTap.t < 350 && !pinch) toggleTools();
      twoTap = null;
    }
    if (pinch && pts.size < 2) { pinch = null; save(); }
    if (drag && pts.size === 0) { drag = null; save(); }
  };
  studioEl.addEventListener('pointerup', end);
  studioEl.addEventListener('pointercancel', end);
  studioEl.addEventListener('dblclick', e => { const [x, y] = toBoard(e.clientX, e.clientY); const it = itemAt(x, y); if (it && it.type === 'text') editText(it); });

  function erase(x, y) {
    const before = board.strokes.length;
    board.strokes = board.strokes.filter(st => !st.pts.some(([px, py]) => Math.hypot(px - x, py - y) < 14 + st.size));
    if (board.strokes.length !== before) { drawInk(); save(); }
  }
  function toggleTools() { toolsOn = !toolsOn; $('#tools').classList.toggle('hide', !toolsOn); }

  // ----- tools -----
  $('#t-back').onclick = () => { location.hash = '#/looks'; };
  $('#t-img').onchange = async e => {
    snap();
    for (const f of e.target.files) {
      const { blob, w, h } = await shrinkImage(f, 1600);
      const k = Math.min(500 / w, 520 / h);
      const it = { id: uid(), type: 'img', w: w * k, h: h * k, x: 120 + Math.random() * 600, y: 150 + Math.random() * 260, rot: (Math.random() - .5) * 6 };
      blobs[it.id] = blob; board.items.push(it); sel = it.id;
    }
    e.target.value = ''; drawItems(); save();
  };
  $('#t-text').onclick = () => editText(null);
  $('#t-pen').onclick = () => setTool('pen');
  $('#t-erase').onclick = () => setTool('erase');
  const mv = $('#t-move'); if (mv) mv.onclick = () => setTool('move');
  function setTool(t) { tool = t; ['pen', 'erase', 'move'].forEach(k => { const b = $('#t-' + k); if (b) b.classList.toggle('on', k === t); }); }
  $$('[data-c]').forEach(b => b.onclick = () => { color = b.dataset.c; $$('[data-c]').forEach(x => x.classList.toggle('on', x === b)); setTool('pen'); const it = board.items.find(i => i.id === sel); if (it && it.type === 'text') { it.color = color; drawItems(); save(); } });
  $$('[data-s]').forEach(b => b.onclick = () => { size = +b.dataset.s; $$('[data-s]').forEach(x => x.classList.toggle('on', x === b)); });
  $('#t-undo').onclick = () => {
    const last = history.pop(); if (!last) return;
    const st = JSON.parse(last); board.items = st.items; board.strokes = st.strokes; drawItems(); drawInk(); save();
  };
  $('#t-front').onclick = () => { const i = board.items.findIndex(x => x.id === sel); if (i < 0) return; snap(); board.items.push(board.items.splice(i, 1)[0]); drawItems(); save(); };
  $('#t-del').onclick = () => { if (!sel) { toast('Tap a picture or text first'); return; } snap(); board.items = board.items.filter(i => i.id !== sel); sel = null; drawItems(); save(); };
  $('#t-q').onclick = () => openSheet(`${sheetHead('The question')}<div class="stack"><input class="field" id="qq" value="${esc(board.question || '')}" maxlength="90"><div class="row"><button class="btn" id="qqs">Save</button><button class="btn danger small" id="qdel">Delete board</button></div></div>`, el => {
    $('#qqs', el).onclick = () => { board.question = $('#qq', el).value.trim(); $('#q').textContent = board.question; save(); closeSheet(); };
    $('#qdel', el).onclick = async () => { if (await ask('Delete this whole board?', 'Delete', true)) { await db.del('looks', board.id); leaving = true; location.hash = '#/looks'; } };
  });
  $('#t-export').onclick = () => openSheet(`${sheetHead('Export')}<p class="intro">The whole board, one iPad screen, as a picture.</p>
    <div class="row" style="margin-top:16px"><button class="btn" data-f="png">PNG</button><button class="btn" data-f="jpg">JPG</button><button class="btn ghost" id="tog">Copy into the Grimoire</button></div>`, el => {
    $$('[data-f]', el).forEach(b => b.onclick = async () => { const blob = await renderBoard(board, blobs, 2, b.dataset.f); shareOrDownload(blob, `zagel-look-${board.id}.${b.dataset.f}`, board.question || 'Zagel look'); });
    $('#tog', el).onclick = async () => { const img = await renderBoard(board, blobs, 1, 'jpg'); await db.put('spells', { id: uid(), name: board.question || 'A look', ingredients: '', method: '', effect: '', img, source: 'looks:' + board.id }); toast('Copied into the Grimoire.'); };
  });

  function editText(it) {
    openSheet(`${sheetHead(it ? 'Edit text' : 'Add text')}<div class="stack"><textarea class="field" id="tx" rows="2">${esc(it ? it.text : '')}</textarea><button class="btn" id="txs">${it ? 'Save' : 'Add'}</button></div>`, el => {
      setTimeout(() => $('#tx', el).focus(), 300);
      $('#txs', el).onclick = () => {
        const text = $('#tx', el).value.trim(); if (!text) { closeSheet(); return; }
        snap();
        if (it) it.text = text; else { const n = { id: uid(), type: 'text', text, x: 200 + Math.random() * 500, y: 300 + Math.random() * 300, size: 36, color, rot: 0 }; board.items.push(n); sel = n.id; }
        drawItems(); save(); closeSheet();
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
      try { board.thumb = await renderBoard(board, blobs, 0.3, 'jpg'); } catch (e) {}
      await db.put('looks', board);
    })();
  };
  window.addEventListener('zagel:leave', onLeave);
}

function paintStroke(c, st) {
  const p = st.pts; if (!p || !p.length) return;
  c.strokeStyle = st.color; c.fillStyle = st.color; c.lineCap = 'round'; c.lineJoin = 'round'; c.globalAlpha = .93;
  if (p.length === 1) { c.beginPath(); c.arc(p[0][0], p[0][1], st.size * (.4 + p[0][2]) / 2, 0, Math.PI * 2); c.fill(); c.globalAlpha = 1; return; }
  for (let i = 1; i < p.length; i++) {
    const a = p[i - 1], b = p[i];
    c.lineWidth = st.size * (.35 + (a[2] + b[2]) / 2 * .9);
    c.beginPath(); c.moveTo(a[0], a[1]);
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    c.quadraticCurveTo(a[0], a[1], mx, my); c.lineTo(b[0], b[1]); c.stroke();
  }
  c.globalAlpha = 1;
}

async function renderBoard(board, blobs, scale, fmt) {
  const c = document.createElement('canvas'); c.width = W * scale; c.height = H * scale;
  const x = c.getContext('2d'); x.scale(scale, scale);
  x.fillStyle = '#EEEBE3'; x.fillRect(0, 0, W, H);
  for (const it of board.items) {
    x.save();
    if (it.type === 'img') {
      const img = await loadImage(blobs[it.id] || it.blob);
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
  for (const st of board.strokes) paintStroke(x, st);
  if (board.question) { x.font = `600 44px 'Zagel Display', sans-serif`; x.fillStyle = '#141414'; x.textBaseline = 'top'; x.fillText(board.question, 48, 36); }
  return new Promise(r => c.toBlob(r, fmt === 'png' ? 'image/png' : 'image/jpeg', .9));
}
