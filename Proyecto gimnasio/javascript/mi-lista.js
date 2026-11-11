(() => {
  'use strict';
  if (!window.VF) return;
  const cont = document.getElementById('listaFavoritos');
  const vacio = document.getElementById('favoritosVacio');
  function render() {
    const favs = VF.favoritos();
    vacio.hidden = favs.length > 0;
    cont.innerHTML = favs.map(f => `<article class="vf-card"><div class="emoji">❤️</div><h2>${VF.escapar(f.name)}</h2><p>${VF.escapar(f.target)} · ${VF.escapar(f.duration)}</p><p>${VF.escapar(f.stats)}</p><p class="vf-muted">${VF.escapar(f.level)}</p><button type="button" class="vf-button" data-quitar="${VF.escapar(f.id)}">Quitar</button></article>`).join('');
  }
  cont.addEventListener('click', e => {
    const b = e.target.closest('[data-quitar]');
    if (!b) return;
    VF.guardarFavoritos(VF.favoritos().filter(f => f.id !== b.dataset.quitar));
    render();
    VF.toast('Quitado de Mi lista');
  });
  render();
})();
