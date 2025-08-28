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
  const radius = 400; // Lancetta più lunga per raggiungere pulsanti lontani
  
  function updateHand() {
    const radians = (angle * Math.PI) / 180;
    const x = centerX + radius * Math.cos(radians - Math.PI/2);
    const y = centerY + radius * Math.sin(radians - Math.PI/2);
    
    hand.setAttribute('x2', x);
    hand.setAttribute('y2', y);
    
    // Update hand tip
    const tipPoints = `${x},${y} ${x+5},${y+10} ${x-5},${y+10}`;
    handTip.setAttribute('points', tipPoints);
    
    angle = (angle + 0.5) % 360; // 12 secondi per giro completo
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
  
  // Posizioni ellisse larga (come IMG_7043 corretta)
  const positions = [
    {left: 613, top: 55},     // 12 o'clock - più lontano
    {left: 1020, top: 110},   // 1 o'clock - più lontano
    {left: 1320, top: 240},   // 2 o'clock - più lontano  
    {left: 1420, top: 415},   // 3 o'clock - più lontano
    {left: 1320, top: 590},   // 4 o'clock - più lontano
    {left: 1020, top: 720},   // 5 o'clock - più lontano
    {left: 613, top: 775},    // 6 o'clock - più lontano
    {left: 206, top: 720},    // 7 o'clock - più lontano
    {left: -94, top: 590},    // 8 o'clock - più lontano
    {left: -194, top: 415},   // 9 o'clock - più lontano
    {left: -94, top: 240},    // 10 o'clock - più lontano
    {left: 206, top: 110}     // 11 o'clock - più lontano
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

