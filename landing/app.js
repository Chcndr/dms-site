// ===== Layout corona PDF attorno all'hero (no lancetta) =====
(() => {
  const stage = document.getElementById('stage');
  const hero  = document.getElementById('hero');
  const anchor= document.getElementById('anchor');
  const nodes = Array.from(stage.querySelectorAll('.pdf-node'));
  if (!stage || !hero || !anchor || !nodes.length) return;

  function layout(){
    const r = hero.getBoundingClientRect();
    const s = stage.getBoundingClientRect();
    // centro dell'hero relativo allo stage
    const cx = (r.left - s.left) + r.width/2;
    const cy = (r.top  - s.top ) + r.height/2;
    // raggio: metà del lato minore + margine maggiore per non toccare il video
    const rad = Math.round(Math.min(r.width, r.height)/2 + 180);
    stage.style.setProperty('--cx', cx + 'px');
    stage.style.setProperty('--cy', cy + 'px');
    stage.style.setProperty('--rad', rad + 'px');
  }

  const ro1 = new ResizeObserver(layout);
  ro1.observe(hero);
  const ro2 = new ResizeObserver(layout);
  ro2.observe(stage);
  window.addEventListener('orientationchange', () => setTimeout(layout, 250));
  window.addEventListener('load', layout);
  document.addEventListener('DOMContentLoaded', layout);
  layout();

  // Click su PDF apre l'URL se presente
  nodes.forEach(n => {
    n.addEventListener('click', () => {
      const url = n.dataset.url || n.getAttribute('href');
      if (url && url !== '#') window.open(url, '_blank');
    });
  });
})();
