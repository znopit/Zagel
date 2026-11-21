// Zagel local storage: everything lives in IndexedDB on this device.
const DB_NAME = 'zagel';
const DB_VERSION = 1;
export const STORES = ['days', 'parties', 'wishes', 'looks', 'thoughts', 'books', 'spells', 'creatures', 'meta'];

let dbp = null;
function open() {
  if (dbp) return dbp;
  dbp = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const s of STORES) {
        if (!db.objectStoreNames.contains(s)) db.createObjectStore(s, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbp;
}

function tx(store, mode, fn) {
  return open().then(db => new Promise((resolve, reject) => {
    const t = db.transaction(store, mode);
    const s = t.objectStore(store);
    let out;
    Promise.resolve(fn(s)).then(v => { out = v; });
    t.oncomplete = () => resolve(out);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  }));
}

// Safari can lose track of Blobs stored in IndexedDB ("WebKitBlobResource error"),
// so pictures are stored as raw bytes and turned back into fresh in-memory Blobs on read.
async function pack(v) {
  if (v instanceof Blob) return { __ab: await v.arrayBuffer(), __type: v.type };
  if (Array.isArray(v)) return Promise.all(v.map(pack));
  if (v && typeof v === 'object' && !(v instanceof ArrayBuffer)) {
    const o = {};
    for (const k of Object.keys(v)) o[k] = await pack(v[k]);
    return o;
  }
  return v;
}
function unpack(v) {
  if (v && typeof v === 'object' && v.__ab instanceof ArrayBuffer) return new Blob([v.__ab], { type: v.__type || '' });
  if (Array.isArray(v)) return v.map(unpack);
  if (v && typeof v === 'object' && !(v instanceof Blob) && !(v instanceof ArrayBuffer)) {
    const o = {};
    for (const k of Object.keys(v)) o[k] = unpack(v[k]);
    return o;
  }
  return v;
}

function reqP(r) { return new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); }

export const db = {
  async get(store, id) { return unpack(await tx(store, 'readonly', s => reqP(s.get(id)))); },
  async all(store) { return unpack(await tx(store, 'readonly', s => reqP(s.getAll()))); },
  async put(store, obj) {
    obj.updated = Date.now();
    if (!obj.created) obj.created = obj.updated;
    const packed = await pack(obj);
    await tx(store, 'readwrite', s => reqP(s.put(packed)));
    return obj;
  },
  async raw(store, obj) { const packed = await pack(obj); return tx(store, 'readwrite', s => reqP(s.put(packed))); },
  async del(store, id) { return tx(store, 'readwrite', s => reqP(s.delete(id))); },
  async clear(store) { return tx(store, 'readwrite', s => reqP(s.clear())); },
};

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function getMeta(key, fallback = null) {
  const r = await db.get('meta', key);
  return r ? r.value : fallback;
}
export async function setMeta(key, value) {
  return db.put('meta', { id: key, value });
}

// ---------- backup ----------
function blobToDataURL(b) {
  return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(b); });
}
async function dataURLToBlob(u) { return (await fetch(u)).blob(); }

async function encode(v) {
  if (v instanceof Blob) return { __blob: await blobToDataURL(v) };
  if (Array.isArray(v)) return Promise.all(v.map(encode));
  if (v && typeof v === 'object') {
    const o = {};
    for (const k of Object.keys(v)) o[k] = await encode(v[k]);
    return o;
  }
  return v;
}
async function decode(v) {
  if (v && typeof v === 'object' && !Array.isArray(v) && typeof v.__blob === 'string') return dataURLToBlob(v.__blob);
  if (Array.isArray(v)) return Promise.all(v.map(decode));
  if (v && typeof v === 'object') {
    const o = {};
    for (const k of Object.keys(v)) o[k] = await decode(v[k]);
    return o;
  }
  return v;
}

// Sections as they appear on the road, and which drawers each one owns.
export const SECTIONS = [
  ['days', 'Days', ['days']], ['hat', 'Party Hat', ['parties']], ['wishes', 'Wishes', ['wishes']],
  ['looks', 'Looks', ['looks']], ['cauldron', 'Cauldron', ['thoughts']], ['shelf', 'Shelf', ['books']],
  ['grimoire', 'Grimoire', ['spells', 'creatures']],
];
export async function exportAll(only) {
  const out = { app: 'zagel', version: 1, exported: new Date().toISOString(), stores: {} };
  const pick = only ? SECTIONS.filter(x => only.includes(x[0])).flatMap(x => x[2]) : STORES;
  for (const s of pick) out.stores[s] = await encode(await db.all(s));
  // a few settings travel with their section: shelf bay names, hand-drawn hats
  if (only) {
    const keep = m => (only.includes('shelf') && m.id === 'bays') || (only.includes('hat') && m.id.startsWith('hat-'));
    out.stores.meta = await encode((await db.all('meta')).filter(keep));
  }
  return new Blob([JSON.stringify(out)], { type: 'application/json' });
}

// Merge: records that don't exist are added; existing ones are replaced only if the backup's copy is newer.
export async function importAll(file) {
  const text = await file.text();
  let data;
  try { data = JSON.parse(text); } catch (e) { throw new Error('That file isn’t a Zagel backup.'); }
  if (!data || data.app !== 'zagel' || !data.stores) throw new Error('That file isn’t a Zagel backup.');
  let added = 0, updated = 0;
  for (const s of STORES) {
    const rows = data.stores[s] || [];
    for (const raw of rows) {
      const row = await decode(raw);
      const cur = await db.get(s, row.id);
      if (!cur) { await db.raw(s, row); added++; }
      else if ((row.updated || 0) > (cur.updated || 0)) { await db.raw(s, row); updated++; }
    }
  }
  return { added, updated };
}
