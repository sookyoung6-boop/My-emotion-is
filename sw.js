// 오프라인 캐시 — 앱을 고치면 VERSION을 올려야 새 버전이 반영돼요
const VERSION='mei-v13-night-1';
const CORE=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png','fonts/jua.css'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
 if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(VERSION).then(x=>x.put('index.html',c));return res}).catch(()=>caches.match('index.html')));return}
 e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok&&(new URL(r.url).origin===location.origin||/fonts\.(googleapis|gstatic)\.com/.test(r.url))){const c=res.clone();caches.open(VERSION).then(x=>x.put(r,c))}return res}).catch(()=>hit)))});
