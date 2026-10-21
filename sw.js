const V='tokyoexe-v56';
const CORE=['./','./index.html','./manifest.webmanifest','./maps/washi.png','./fonts/dotgothic16.woff2','./icons/icon-180.png','./icons/icon-192.png','./icons/icon-512.png','./vendor/supabase.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
  if(r.mode==='navigate'){
    const net=fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put('./index.html',cp))}return res});
    const cached=()=>caches.match('./index.html').then(h=>h||caches.match('./'));
    e.respondWith(Promise.race([net,new Promise(ok=>setTimeout(ok,3500))]).then(res=>res||cached()).catch(cached));e.waitUntil(net.catch(()=>{}));return}
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res})))
});
