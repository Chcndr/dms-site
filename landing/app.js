document.addEventListener('DOMContentLoaded', () => {
  const v = document.querySelector('.media-16x9 video');
  if(!v) return;
  
  // Play safe per iOS
  const tryPlay = () => v.play().catch(()=>{});
  tryPlay();
  document.addEventListener('touchend', tryPlay, {once:true});
  document.addEventListener('click', tryPlay, {once:true});
});

