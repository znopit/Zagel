import { DEFS } from './art.js';
import { closeSheet } from './ui.js';
import { renderHome } from './home.js';

document.getElementById('defs').innerHTML = DEFS;

// ----- day / night -----
export function isNight() { return document.body.classList.contains('night'); }
export function applyChrome() {
  const home = document.body.classList.contains('onhome'), n = isNight();
  document.documentElement.classList.toggle('night', n);
  document.documentElement.classList.toggle('onhome', home);
  const tc = document.querySelector('meta[name=theme-color]');
  if (tc) tc.setAttribute('content', n && home ? '#090B16' : document.body.classList.contains('riso') ? '#2B1A4E' : '#EEEBE3');
}
export function setNight(n, save) {
  document.body.classList.toggle('night', n);
  applyChrome();
  if (save) { try { localStorage.setItem('zagel-mode', n ? 'night' : 'day'); } catch (e) {} }
  document.querySelectorAll('.mode').forEach(b => b.setAttribute('aria-label', n ? 'Switch to day' : 'Switch to night'));
}
export function resetModeToAuto() {
  try { localStorage.removeItem('zagel-mode'); } catch (e) {}
  setNight(new Date().getHours() < 6, false);
}
let saved = null;
try { saved = localStorage.getItem('zagel-mode'); } catch (e) {}
setNight(saved ? saved === 'night' : new Date().getHours() < 6, false);
document.addEventListener('click', e => {
  if (e.target.closest('.mode')) setNight(!isNight(), true);
});

// ----- routes -----
const routes = {
  '': () => renderHome(),
  'days': () => import('./views/days.js').then(m => m.render()),
  'hat': () => import('./views/hat.js').then(m => m.render()),
  'wishes': () => import('./views/wishes.js').then(m => m.render()),
  'looks': (id) => import('./views/looks.js').then(m => m.render(id)),
  'cauldron': () => import('./views/cauldron.js').then(m => m.render()),
  'shelf': () => import('./views/shelf.js').then(m => m.render()),
  'grimoire': () => import('./views/grimoire.js').then(m => m.render()),
  'home': () => import('./views/settings.js').then(m => m.render()),
};
let lastRoute = null;
async function route() {
  const [name, arg] = location.hash.replace(/^#\/?/, '').split('/');
  closeSheet();
  document.body.classList.remove('riso');
  window.dispatchEvent(new Event('zagel:leave'));
  const fn = routes[name] || routes[''];
  document.body.classList.toggle('onhome', !routes[name] || name === '');
  await fn(arg);
  applyChrome();
  if (lastRoute !== name) window.scrollTo(0, name === '' && window.__roadY ? window.__roadY : 0);
  lastRoute = name;
}
window.addEventListener('hashchange', route);
route();

// remember where you were on the road
window.addEventListener('scroll', () => { if (!location.hash || location.hash === '#/') window.__roadY = scrollY; }, { passive: true });

// ----- offline + storage -----
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
