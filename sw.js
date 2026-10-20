const V='tokyoexe-v8';
const CORE=['./','./index.html','./manifest.webmanifest','./maps/sencha.png','./fonts/dotgothic16.woff2','./icons/icon-180.png','./icons/icon-192.png','./icons/icon-512.png','./vendor/supabase.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
  if(r.mode==='navigate'){
    const net=fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put('./index.html',cp))}return res});
    e.respondWith(caches.match('./index.html').then(hit=>hit||net.catch(()=>caches.match('./'))));
    e.waitUntil(net.catch(()=>{}));return}
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res})))
});
