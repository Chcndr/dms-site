document.addEventListener('DOMContentLoaded', () => {
  const video = document.querySelector('video');
  const nodesContainer = document.querySelector('.nodes');
  
  // Autoplay sicuro per iOS
  if (video) {
    video.setAttribute('playsinline', '');
    video.muted = true;
    const tryPlay = () => video.play().catch(() => {});
    tryPlay();
    document.addEventListener('click', tryPlay, { once: true });
  }
  
  // Crea i 12 pulsanti PDF in ellisse
  function createNodes() {
    if (!nodesContainer) return;
    
    nodesContainer.innerHTML = '';
    
    // Parametri ellisse
    const centerX = 600; // Centro X dell'ellisse
    const centerY = 400; // Centro Y dell'ellisse  
    const radiusX = 300; // Raggio orizzontale
    const radiusY = 200; // Raggio verticale
    
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 - Math.PI / 2; // Inizia dall'alto
      const x = centerX + radiusX * Math.cos(angle);
      const y = centerY + radiusY * Math.sin(angle);
      
      const node = document.createElement('a');
      node.className = 'node';
      node.textContent = 'PDF';
      node.href = '#';
      node.style.left = (x - 54) + 'px'; // -54 per centrare (108/2)
      node.style.top = (y - 54) + 'px';
      
      nodesContainer.appendChild(node);
    }
  }
  
  // Layout responsivo
  function updateLayout() {
    if (window.innerWidth <= 1600) {
      // Su mobile/tablet nascondi i nodi
      if (nodesContainer) {
        nodesContainer.style.display = 'none';
      }
    } else {
      // Su desktop mostra i nodi
      if (nodesContainer) {
        nodesContainer.style.display = 'block';
        createNodes();
      }
    }
  }
  
  // Inizializza
  updateLayout();
  window.addEventListener('resize', updateLayout);
});

