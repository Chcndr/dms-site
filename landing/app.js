// ===== 1) VIDEO AUTOPLAY iOS SAFE =====
function ensureHero() {
  const v = document.getElementById('hero');
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

// ===== 2) POSIZIONA 12 PULSANTI SU ELLISSE =====
function buildNodes() {
  const container = document.getElementById('nodes-container');
  if (!container) return;
  
  const items = [
    {label: 'PDF', href: 'docs/hub-nazionale.pdf'},
    {label: 'PDF', href: 'docs/dms-e-cluster.pdf'},
    {label: 'Video', href: 'videos/teaser-hub-dms.mp4'},
    {label: 'Video', href: 'videos/video-hero.mp4'},
    {label: '· presto'}, {label: '· presto'}, {label: '· presto'}, {label: '· presto'},
    {label: '· presto'}, {label: '· presto'}, {label: '· presto'}, {label: '· presto'}
  ];
  
  function positionNodes() {
    container.innerHTML = '';
    
    const viewport = document.getElementById('viewport');
    if (!viewport) return;
    
    const vRect = viewport.getBoundingClientRect();
    const cx = vRect.left + vRect.width/2 + window.scrollX;
    const cy = vRect.top + vRect.height/2 + window.scrollY;
    
    // Ellisse attorno al video
    const rx = Math.min(vRect.width * 0.64, 420);
    const ry = Math.max(vRect.height * 0.52, 180);
    
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
      
      // Posizione angolare (12 slot da orologio)
      const angle = (Math.PI * 2) * (i / 12) - Math.PI/2; // parte dall'alto
      const x = cx + rx * Math.cos(angle) - 70; // 70 = half button width
      const y = cy + ry * Math.sin(angle) - 70; // 70 = half button height
      
      node.style.left = x + 'px';
      node.style.top = y + 'px';
      
      // Neon effects su hover/touch
      node.addEventListener('pointerenter', () => node.classList.add('is-active'));
      node.addEventListener('pointerleave', () => node.classList.remove('is-active'));
      node.addEventListener('touchstart', () => {
        node.classList.add('is-active');
        setTimeout(() => node.classList.remove('is-active'), 1200);
      }, {passive: true});
      
      container.appendChild(node);
    });
  }
  
  positionNodes();
  
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(positionNodes, 120);
  });
  
  window.addEventListener('orientationchange', () => {
    setTimeout(positionNodes, 200);
  });
}

// ===== 3) INIZIALIZZAZIONE =====
document.addEventListener('DOMContentLoaded', () => {
  ensureHero();
  buildNodes();
});

// Ripristino video quando si rientra da back-forward cache
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    ensureHero();
  }
});

