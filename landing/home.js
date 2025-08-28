// ----- 1) Autoplay iOS safe -----
(function ensureHero(){
  const v = document.getElementById('hero'); if(!v) return;
  function playSafe(){
    try{
      v.muted = true; v.playsInline = true;
      v.setAttribute('playsinline',''); v.setAttribute('webkit-playsinline','');
      const p = v.play(); if(p && p.catch) p.catch(()=>{});
    }catch(_){}
  }
  (v.readyState>=2) ? playSafe() : v.addEventListener('loadeddata', playSafe, {once:true});
  window.addEventListener('pageshow', e => { if(e.persisted) playSafe(); });
  v.addEventListener('error', () => {
    const s = v.querySelector('source');
    if(s && !/teaser-hub-dms\.mp4$/.test(s.src)){
      s.src='videos/teaser-hub-dms.mp4'; v.load(); playSafe();
    }
  }, {once:true});
})();

// ----- 2) Orologio centrato sul video -----
(function placeClock(){
  const vp = document.getElementById('viewport');
  const clock = document.getElementById('clock');
  const hand = clock?.querySelector('.hand'), hub = clock?.querySelector('.hub');
  function sync(){
    if(!vp || !hand || !hub) return;
    const r = vp.getBoundingClientRect();
    const cx = r.left + r.width/2 + window.scrollX;
    const cy = r.top  + r.height/2 + window.scrollY;
    hand.style.left = hub.style.left = cx+'px';
    hand.style.top  = hub.style.top  = cy+'px';
  }
  sync(); addEventListener('resize',sync); addEventListener('orientationchange',sync);
  addEventListener('scroll', sync, {passive:true});
})();

// ----- 3) 12 pulsanti su ELLISSE intorno al video + neon su hover/touch -----
(function buildNodes(){
  const nodes = document.getElementById('nodes'), vp = document.getElementById('viewport');
  if(!nodes || !vp) return;

  const items = [
    {label:'PDF', href:'docs/hub-nazionale.pdf'},
    {label:'PDF', href:'docs/dms-e-cluster.pdf'},
    {label:'Video', href:'videos/teaser-hub-dms.mp4'},
    {label:'Video', href:'videos/video-hero.mp4'},
    {label:'· presto'},{label:'· presto'},{label:'· presto'},{label:'· presto'},
    {label:'· presto'},{label:'· presto'},{label:'· presto'},{label:'· presto'}
  ];

  function draw(){
    nodes.innerHTML='';
    const r = vp.getBoundingClientRect();
    const cx = r.left + r.width/2 + window.scrollX;
    const cy = r.top  + r.height/2 + window.scrollY;

    // ellisse più larga che alta, attorno al video
    const rx = Math.min(r.width*0.64, 420);
    const ry = Math.max(r.height*0.52, 180);

    items.forEach((it,i)=>{
      const el = document.createElement(it.href?'a':'button');
      el.className='node'; el.innerHTML=`<span>${it.label||'PDF'}</span>`;
      if(it.href){ el.href=it.href; if(it.href.endsWith('.pdf')) el.target='_blank'; }
      else { el.disabled=true; el.style.opacity=.55; }

      const ang=(Math.PI*2)*(i/12) - Math.PI/2; // parte dall'alto
      const x=cx + rx*Math.cos(ang) - 55;
      const y=cy + ry*Math.sin(ang) - 55;
      el.style.left=x+'px'; el.style.top=y+'px';

      // neon su hover/touch (anche iPad)
      el.addEventListener('pointerenter',()=>el.classList.add('glow'));
      el.addEventListener('pointerleave',()=>el.classList.remove('glow'));
      el.addEventListener('touchstart',()=>{el.classList.add('glow'); setTimeout(()=>el.classList.remove('glow'),1200);},{passive:true});

      nodes.appendChild(el);
    });
  }

  draw();
  let t; addEventListener('resize',()=>{ clearTimeout(t); t=setTimeout(draw,120); });
  addEventListener('orientationchange',()=>{ setTimeout(draw,200); });
})();

