(function(){
  const stage = document.getElementById('stage');
  const nodesBox = document.getElementById('nodes');
  const clockBox = document.getElementById('clock');
  const hero = document.getElementById('hero');

  // 1) Mai più doppioni del video
  function ensureHero(){
    // elimina eventuali duplicati lasciati da versioni precedenti
    const vids = Array.from(document.querySelectorAll('video#hero'));
    vids.forEach((v,i)=>{ if(i>0) v.remove(); });
    hero.muted = true;
    hero.setAttribute('playsinline',''); hero.setAttribute('webkit-playsinline','');
    const p = hero.play(); if(p && p.catch) p.catch(()=>{});
    window.addEventListener('pageshow', ()=>{ hero.play().catch(()=>{}); });
  }

  // 2) Ellisse + 12 pulsanti
  function layoutNodes(){
    nodesBox.innerHTML='';
    const r = stage.getBoundingClientRect();
    const cx = r.width/2, cy = r.height/2 + 10;
    const rx = Math.min(r.width, 1200) * 0.34;
    const ry = rx * 0.72; // ellittico come da design
    for(let i=0;i<12;i++){
      const a = (i/12)*Math.PI*2 - Math.PI/2;
      const x = cx + rx*Math.cos(a);
      const y = cy + ry*Math.sin(a);
      const n = document.createElement('a');
      n.className='node'; n.textContent='PDF'; n.href='#';
      n.style.left = (x-54)+'px'; n.style.top = (y-54)+'px';
      nodesBox.appendChild(n);
    }
  }

  // 3) Lancetta sotto al video (SVG semplice)
  function drawClock(){
    clockBox.innerHTML='';
    const NS='http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS,'svg');
    svg.setAttribute('viewBox','0 0 1200 800');
    svg.setAttribute('preserveAspectRatio','none');
    svg.style.width='100%'; svg.style.height='100%';
    const style = document.createElementNS(NS,'style');
    style.textContent='@keyframes spin{to{transform:rotate(360deg)}}';
    const hand = document.createElementNS(NS,'rect');
    hand.setAttribute('x','597'); hand.setAttribute('y','200');
    hand.setAttribute('width','6'); hand.setAttribute('height','380'); hand.setAttribute('rx','3');
    hand.setAttribute('fill','rgba(126,234,255,.85)');
    hand.style.transformOrigin='600px 400px'; hand.style.animation='spin 12s linear infinite';
    svg.appendChild(style); svg.appendChild(hand); clockBox.appendChild(svg);
  }

  window.addEventListener('resize', layoutNodes);
  layoutNodes(); drawClock(); ensureHero();
})();
