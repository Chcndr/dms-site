(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  // Spotlight follows pointer
  const setSpot = (x,y) => {
    document.documentElement.style.setProperty('--mx', x+'px');
    document.documentElement.style.setProperty('--my', y+'px');
  };
  window.addEventListener('mousemove', e => setSpot(e.clientX, e.clientY), {passive:true});
  window.addEventListener('touchstart', e => { const t = e.touches[0]; if (t) setSpot(t.clientX, t.clientY); }, {passive:true});

  // iOS autoplay
  const video = $('#heroVideo');
  function ensureHero() {
    if (!video) return;
    video.muted = true; video.setAttribute('muted','');
    video.setAttribute('playsinline',''); video.setAttribute('webkit-playsinline','');
    video.autoplay = true;
    const tryPlay = () => video.play().catch(()=>{});
    if (video.readyState >= 2) tryPlay(); else video.addEventListener('loadeddata', tryPlay, {once:true});
    window.addEventListener('pageshow', tryPlay);
  }

  // Remove any 'title' attributes (Safari bubble)
  $$('[title]').forEach(el => el.removeAttribute('title'));

  // Layout nodes on an ellipse
  function layoutNodes(){
    const vp = $('.viewport'); const nodes = $$('.nodes .node');
    if (!vp || !nodes.length) return;
    const r = vp.getBoundingClientRect();
    const cx = r.left + r.width/2; const cy = r.top + r.height/2;
    const a = Math.min(window.innerWidth*0.36, r.width*1.1);
    const b = Math.min(window.innerHeight*0.28, r.height*0.9);
    const start = -Math.PI/2;
    nodes.forEach((n, i) => {
      const t = start + (i * (2*Math.PI / nodes.length));
      const x = cx + a * Math.cos(t) - n.offsetWidth/2;
      const y = cy + b * Math.sin(t) - n.offsetHeight/2;
      n.style.left = `${x}px`; n.style.top  = `${y}px`;
    });
  }
  window.addEventListener('resize', () => requestAnimationFrame(layoutNodes), {passive:true});
  window.addEventListener('load', () => { layoutNodes(); ensureHero(); });

  // Optional glow cycling
  let idx=0;
  setInterval(() => {
    const nodes = $$('.nodes .node'); if (!nodes.length) return;
    nodes.forEach(n => n.classList.remove('is-active'));
    nodes[idx % nodes.length].classList.add('is-active');
    idx++;
  }, 1400);
})();
