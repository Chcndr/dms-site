// iOS-safe: assicura altezza e autoplay gentile
document.addEventListener('DOMContentLoaded', () => {
  const box = document.querySelector('.media-16x9');
  const vid = box?.querySelector('video');
  if (!box || !vid) return;

  // Sblocca l'altezza quando i metadati sono pronti
  const markReady = () => box.classList.add('is-ready');
  vid.addEventListener('loadedmetadata', markReady, { once: true });

  // Impostazioni consigliate per iOS
  vid.setAttribute('playsinline','');
  vid.muted = true;

  const tryPlay = () => vid.play().catch(() => {});
  tryPlay();
  document.addEventListener('touchend', tryPlay, { once:true });
  document.addEventListener('click', tryPlay, { once:true });

  // Se si torna alla tab, riprova
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) tryPlay();
  });
});

