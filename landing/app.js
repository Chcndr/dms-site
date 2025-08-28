// iOS-safe: autoplay semplice e robusto
document.addEventListener('DOMContentLoaded', () => {
  const vid = document.querySelector('.media-16x9 video');
  if (!vid) return;

  // Impostazioni iOS
  vid.setAttribute('playsinline','');
  vid.muted = true;

  const tryPlay = () => vid.play().catch(() => {});
  
  // Tentativi di autoplay
  tryPlay();
  document.addEventListener('touchend', tryPlay, { once:true });
  document.addEventListener('click', tryPlay, { once:true });
  
  // Riprova quando si torna alla tab
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) tryPlay();
  });
});

