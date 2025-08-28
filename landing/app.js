// ===== 1) VIDEO AUTOPLAY iOS SAFE =====
function ensureHero() {
  const v = document.querySelector('#viewport video');
  if (!v) return;
  
  function playSafe() {
    try {
      v.muted = true;
      v.playsInline = true;
      v.setAttribute('playsinline', '');
      v.setAttribute('webkit-playsinline', '');
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    } catch(_) {}
  }
  
  if (v.readyState >= 2) {
    playSafe();
  } else {
    v.addEventListener('loadeddata', playSafe, {once: true});
  }
  
  // Fallback video
  v.addEventListener('error', () => {
    const s = v.querySelector('source');
    if (s && !/teaser-hub-dms\.mp4$/.test(s.src)) {
      s.src = 'videos/teaser-hub-dms.mp4';
      v.load();
      playSafe();
    }
  }, {once: true});
}

// ===== 2) ANIMAZIONE LANCETTA =====
function animateHand() {
  const hand = document.getElementById('hand');
  const handTip = document.getElementById('handTip');
  if (!hand || !handTip) return;
  
  let angle = 0;
  const centerX = 683;
  const centerY = 455.5;
  const radius = 200;
  
  function updateHand() {
    const radians = (angle * Math.PI) / 180;
    const x = centerX + radius * Math.cos(radians - Math.PI/2);
    const y = centerY + radius * Math.sin(radians - Math.PI/2);
    
    hand.setAttribute('x2', x);
    hand.setAttribute('y2', y);
    
    // Update hand tip
    const tipPoints = `${x},${y} ${x+2.07},${y+31.7} ${x-34.6},${y+21.98}`;
    handTip.setAttribute('points', tipPoints);
    
    angle = (angle + 0.5) % 360; // 12 secondi per giro completo (360/0.5 = 720 frames = 12s a 60fps)
  }
  
  setInterval(updateHand, 16.67); // ~60fps
}

// ===== 3) POSIZIONA 12 PULSANTI COME NEL SINGLEFILE =====
function buildNodes() {
  const body = document.body;
  
  const items = [
    {label: 'PDF', href: 'docs/hub-nazionale.pdf'},
    {label: 'PDF', href: 'docs/dms-e-cluster.pdf'},
    {label: 'Video', href: 'videos/teaser-hub-dms.mp4'},
    {label: 'Video', href: 'videos/video-hero.mp4'},
    {label: '· presto'}, {label: '· presto'}, {label: '· presto'}, {label: '· presto'},
    {label: '· presto'}, {label: '· presto'}, {label: '· presto'}, {label: '· presto'}
  ];
  
  // Posizioni esatte dal SingleFile originale (ellisse stretta attorno al video)
  const positions = [
    {left: 673, top: 125},    // 12 o'clock
    {left: 928, top: 162},    // 1 o'clock  
    {left: 1151, top: 269},   // 2 o'clock
    {left: 1233, top: 415},   // 3 o'clock
    {left: 1151, top: 561},   // 4 o'clock
    {left: 928, top: 668},    // 5 o'clock
    {left: 673, top: 705},    // 6 o'clock
    {left: 418, top: 668},    // 7 o'clock
    {left: 195, top: 561},    // 8 o'clock
    {left: 113, top: 415},    // 9 o'clock
    {left: 195, top: 269},    // 10 o'clock
    {left: 418, top: 162}     // 11 o'clock
  ];
  
  items.forEach((item, i) => {
    const node = document.createElement(item.href ? 'a' : 'button');
    node.className = 'node';
    node.innerHTML = `<span class="tag">${item.label || 'PDF'}</span>`;
    
    if (item.href) {
      node.href = item.href;
      if (item.href.endsWith('.pdf')) {
        node.target = '_blank';
      }
    } else {
      node.disabled = true;
      node.style.opacity = '.55';
    }
    
    // Posizione dal SingleFile
    const pos = positions[i];
    node.style.left = pos.left + 'px';
    node.style.top = pos.top + 'px';
    
    // Neon effects
    node.addEventListener('pointerenter', () => node.classList.add('is-active'));
    node.addEventListener('pointerleave', () => node.classList.remove('is-active'));
    node.addEventListener('touchstart', () => {
      node.classList.add('is-active');
      setTimeout(() => node.classList.remove('is-active'), 1200);
    }, {passive: true});
    
    body.appendChild(node);
  });
}

// ===== 4) INIZIALIZZAZIONE =====
document.addEventListener('DOMContentLoaded', () => {
  ensureHero();
  animateHand();
  buildNodes();
});

// Ripristino video quando si rientra da back-forward cache
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    ensureHero();
  }
});

