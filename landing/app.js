document.addEventListener('DOMContentLoaded', () => {
  const v = document.querySelector('video');
  if(!v) return;
  v.setAttribute('playsinline','');
  v.muted = true;
  const tryPlay = () => v.play().catch(()=>{ /* ignora blocchi iOS */ });
  tryPlay(); document.addEventListener('click', tryPlay, {once:true});
});

