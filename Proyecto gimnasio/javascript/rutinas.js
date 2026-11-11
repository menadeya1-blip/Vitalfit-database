(() => {
  'use strict';
  if (!window.VF) return;
  const cont = document.getElementById('misRutinas');
  const vacio = document.getElementById('rutinasVacio');
  const rutinas = VF.leer('vf_rutinas_demo');
  vacio.hidden = rutinas.length > 0;
  cont.innerHTML = rutinas.map(r => `<article class="vf-card"><div class="emoji">📋</div><h3>${VF.escapar(r.nombre)}</h3><p><b>${VF.escapar(r.grupo)}</b></p><p>${VF.escapar(r.ejercicios)}</p></article>`).join('');
})();
