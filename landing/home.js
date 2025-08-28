// ===== 1) VIDEO AUTOPLAY iOS SAFE =====
(function ensureHero(){
  const v = document.getElementById('hero');
  if(!v) return;
  function playSafe(){
    try {
      v.muted = true; v.playsInline = true;
      v.setAttribute('playsinline',''); v.setAttribute('webkit-playsinline','');
      const p = v.play(); if(p && p.catch) p.catch(()=>{});
    } catch(_) {}
  }
  (v.readyState >= 2) ? playSafe() : v.addEventListener('loadeddata', playSafe, {once:true});
  window.addEventListener('pageshow', e => { if(e.persisted) playSafe(); });
  v.addEventListener('error', () => {
    const s = v.querySelector('source');
    if(s && !/teaser-hub-dms\.mp4$/.test(s.src)){
      s.src = 'videos/teaser-hub-dms.mp4'; v.load(); playSafe();
    }
  }, {once:true});
})();

// ===== 2) POSIZIONA LANCETTA AL CENTRO DEL VIDEO =====
(function placeClock(){
  const vp = document.getElementById('viewport');
  const clock = document.getElementById('clock');
  const hand = clock?.querySelector('.hand');
  const hub  = clock?.querySelector('.hub');
  function sync(){
    if(!vp || !hand || !hub) return;
    const r = vp.getBoundingClientRect();
    const cx = r.left + r.width/2 + window.scrollX;
    const cy = r.top  + r.height/2 + window.scrollY;
    hand.style.left = hub.style.left = cx + 'px';
    hand.style.top  = hub.style.top  = cy + 'px';
  }
  sync();
  addEventListener('resize', sync);
  addEventListener('orientationchange', sync);
  addEventListener('scroll', sync, {passive:true});
})();

// ===== 3) 12 PULSANTI SU ELLISSE =====
(function buildNodes(){
  const nodes = document.getElementById('nodes');
  if(!nodes) return;

  // Mappa contenuti (solo i primi 2 attivi come da sito attuale)
  const items = [
    {label:'PDF', href:'docs/hub-nazionale.pdf'},
    {label:'PDF', href:'docs/dms-e-cluster.pdf'},
    {label:'Video', href:'videos/teaser-hub-dms.mp4'},
    {label:'Video', href:'videos/video-hero.mp4'},
    {label:'· presto'}, {label:'· presto'}, {label:'· presto'},
    {label:'· presto'}, {label:'· presto'}, {label:'· presto'},
    {label:'· presto'}, {label:'· presto'}
  ];

  const W = Math.min(window.innerWidth, 1200);
  const H = Math.max(window.innerHeight, 680);
  const cx = W/2, cy = H/2 + 60;            // centro ellisse
  const rx = Math.min(W*0.36, 420);         // raggio orizzontale
  const ry = rx*0.72;                        // ellisse (più bassa)

  items.forEach((it, i)=>{
    const n = document.createElement(it.href ? 'a' : 'button');
    n.className = 'node';
    n.appendChild(document.createElement('span')).textContent = it.label || 'PDF';
    if(it.href){ n.href = it.href; n.target = it.href.endsWith('.pdf') ? '_blank' : undefined; }
    else { n.disabled = true; n.style.opacity = .55; }

    // posizione angolare (12 slot da orologio)
    const ang = (Math.PI*2) * (i/12) - Math.PI/2; // parte dall'alto
    const x = cx + rx * Math.cos(ang) - 55;       // 55 = half node size
    const y = cy + ry * Math.sin(ang) - 55;
    n.style.left = x + 'px';
    n.style.top  = y + 'px';

    nodes.appendChild(n);
  });

  // aggiorna su resize
  function redraw(){
    while(nodes.firstChild) nodes.removeChild(nodes.firstChild);
    buildNodes(); // ricostruisce (idempotente per piccole installazioni)
  }
  window.addEventListener('resize', ()=>{ requestAnimationFrame(redraw); }, {once:true});
})();

