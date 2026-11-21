import { exportAll, importAll, setMeta } from '../db.js';
import { $, $$, toast, openSheet, closeSheet, sheetHead, shareOrDownload, pageTop, pageTitle, dayKey } from '../ui.js';
import { setNight, resetModeToAuto, isNight } from '../app.js';

const HOUSE = `<svg class="dh" viewBox="200 20 400 420" role="img" aria-label="The dollhouse: four rooms">
<g filter="url(#zp)" stroke="#2E2C29" stroke-width="1.4" stroke-linejoin="round">
 <polygon points="230,120 590,120 410,30" fill="#F3C6D3"/>
 <circle cx="410" cy="86" r="22" fill="#F7F1E2"/>
 <rect x="244" y="120" width="332" height="300" fill="#F2C09A"/>
 <g class="room" data-room="backup"><rect x="258" y="134" width="148" height="130" fill="#DCE7F5"/>
  <rect x="272" y="200" width="44" height="40" fill="#8BA3BC"/><circle cx="294" cy="220" r="8" fill="#F7F1E2"/><line x1="294" y1="220" x2="300" y2="214"/>
  <path d="M352 252 q-2 -16 10 -18 l-1 -8 l6 5 q4 -1 8 0 l6 -5 l-1 8 q10 4 8 18 z" fill="#141414"/></g>
 <g class="room" data-room="restore"><rect x="414" y="134" width="148" height="130" fill="#F8DDE6"/>
  <path d="M432 250 l0 -34 l40 0 l0 34 z" fill="#E4C08E"/><path d="M432 216 l-8 -12 l40 0 l8 12" fill="#D6A96E"/><path d="M446 210 l4 -22 l6 14 l6 -18 l4 22" fill="none" stroke="#2A4EFC" stroke-width="1.6"/></g>
 <g class="room" data-room="send"><rect x="258" y="276" width="148" height="130" fill="#E3ECCF"/>
  <rect x="276" y="330" width="58" height="42" rx="4" fill="#2E2C29"/><rect x="280" y="334" width="50" height="34" rx="2" fill="#CFE0B4" stroke="none"/>
  <path d="M352 360 l40 -18 l-14 30 l-6 -10 z" fill="#FBF8F0"/>
  <path d="M362 394 q-2 -14 8 -16 l-1 -8 l6 5 q4 -1 8 0 l6 -5 l-1 8 q10 4 8 16 z" fill="#F7F1E2"/></g>
 <g class="room" data-room="night"><rect x="414" y="276" width="148" height="130" fill="#F7F0C8"/>
  <rect x="430" y="292" width="40" height="34" fill="#1F2A44"/><path d="M452 298 a10 10 0 1 0 8 14 a8 8 0 1 1 -8 -14 z" fill="#F7E87A" stroke-width="1"/>
  <circle cx="512" cy="340" r="16" fill="#F6E21C"/></g>
 <rect x="258" y="252" width="148" height="12" fill="#D8B48F"/><rect x="414" y="252" width="148" height="12" fill="#D8B48F"/>
 <rect x="258" y="394" width="148" height="12" fill="#D8B48F"/><rect x="414" y="394" width="148" height="12" fill="#D8B48F"/>
</g>
<g font-size="12" font-weight="500" fill="#141414" style="pointer-events:none">
 <text x="410" y="91" text-anchor="middle">Zagel</text>
 <text x="266" y="152">Backup</text><text x="554" y="152" text-anchor="end">Restore</text>
 <text x="266" y="294">Teleport</text><text x="554" y="294" text-anchor="end">Night</text>
</g></svg>`;

export async function render() {
  let usage = '';
  try { const e = await navigator.storage.estimate(); usage = `${(e.usage / 1048576).toFixed(1)} MB used on this device.`; } catch (e) {}
  let persisted = false;
  try { persisted = await navigator.storage.persisted(); } catch (e) {}
  $('#view').innerHTML = `<div class="wrap page">
    ${pageTop()}
    ${pageTitle('Home', '', 'Everything stays home', 'Juno and Jupiter keep watch. Tap a room.')}
    ${HOUSE}
    <p class="note" style="text-align:center">${usage} ${persisted ? 'Your browser has promised to keep it.' : ''}</p>
    <p class="note">Everything lives only on this device. Delete the app or clear Safari’s data and it’s gone — bottle up a backup now and then, the cats can’t help you.</p>
  </div>`;
  $$('.room').forEach(r => r.onclick = () => ROOMS[r.dataset.room]());
}

async function backup(send) {
  toast('Packing everything up…', 1500);
  const blob = await exportAll();
  await setMeta('lastBackup', Date.now());
  await shareOrDownload(blob, `zagel-${dayKey()}.json`, send ? 'Zagel teleport' : 'Zagel backup');
}

const ROOMS = {
  backup: () => openSheet(`${sheetHead('Backup')}<p class="intro">Bottle everything up in one file — days, wishes, boards, books, photos. Keep it in Files or iCloud Drive.</p>
    <div class="row" style="margin-top:18px"><button class="btn" id="bk">Make a backup</button></div>`, el => { $('#bk', el).onclick = () => backup(false); }),
  restore: () => openSheet(`${sheetHead('Restore')}<p class="intro">Open a Zagel backup file. Anything new is added; anything you already have stays, unless the file has a newer version of it. Nothing gets wiped.</p>
    <div class="row" style="margin-top:18px"><label class="btn filebtn">Choose a backup file<input type="file" id="rf" accept="application/json,.json"></label></div>`, el => {
    $('#rf', el).onchange = async e => {
      const f = e.target.files[0]; if (!f) return;
      try { const r = await importAll(f); closeSheet(); toast(`Merged: ${r.added} added, ${r.updated} updated.`, 3200); }
      catch (err) { toast(err.message || 'Couldn’t read that file.', 3200); }
    };
  }),
  send: () => openSheet(`${sheetHead('Teleport')}<p class="intro">A teleport spell for your other iPhone or iPad. Everything gets bottled into one file and sent by AirDrop. On the other side, save it, open Zagel → Home → Restore, and pick the file. Works in every direction.</p>
    <div class="row" style="margin-top:18px"><button class="btn" id="sd">Cast it</button></div>`, el => { $('#sd', el).onclick = () => backup(true); }),
  night: () => {
    let saved = null; try { saved = localStorage.getItem('zagel-mode'); } catch (e) {}
    const cur = saved || 'auto';
    openSheet(`${sheetHead('Night')}<p class="intro">After the museum closes, the exhibits wake up. Night comes on by itself between midnight and six, unless you choose.</p>
      <div class="row" style="margin-top:18px">${[['auto', 'Automatic'], ['day', 'Always day'], ['night', 'Always night']].map(([k, t]) => `<button class="chip ${cur === k ? 'on' : ''}" data-m="${k}">${t}</button>`).join('')}</div>`, el => {
      $$('[data-m]', el).forEach(b => b.onclick = () => {
        if (b.dataset.m === 'auto') resetModeToAuto(); else setNight(b.dataset.m === 'night', true);
        $$('[data-m]', el).forEach(x => x.classList.toggle('on', x === b));
        toast(isNight() ? 'Night it is. Go see the road.' : 'Day it is.');
      });
    });
  },
};
