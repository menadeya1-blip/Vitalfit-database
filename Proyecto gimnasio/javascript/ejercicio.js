/* Catálogo: favoritos, demo y filtros. Datos solo en localStorage (demo). */
(() => {
  'use strict';
  if (!window.VF) return;
  const cards = [...document.querySelectorAll('.exercise-card')];

  const nivelDe = (card) => {
    const b = card.querySelector('.badge-difficulty');
    return b ? (['beginner', 'intermediate', 'advanced'].find(c => b.classList.contains(c)) || '') : '';
  };
  const datosDe = (card) => ({
    id: card.querySelector('h3').textContent.trim(),
    name: card.querySelector('h3').textContent.trim(),
    target: (card.querySelector('.target') || {}).textContent || '',
    duration: (card.querySelector('.duration') || {}).textContent || '',
    stats: (card.querySelector('.stats') || {}).textContent || '',
    level: (card.querySelector('.badge-difficulty') || {}).textContent || '',
    levelClass: nivelDe(card)
  });

  function pintar(btn, activo, nombre) {
    btn.classList.toggle('active', activo);
    btn.textContent = activo ? '✓' : '+';
    btn.setAttribute('aria-pressed', String(activo));
    btn.setAttribute('aria-label', (activo ? 'Quitar de mi lista: ' : 'Añadir a mi lista: ') + nombre);
    btn.title = activo ? 'Quitar de Mi lista' : 'Añadir a Mi lista';
  }

  cards.forEach(card => {
    const d = datosDe(card);
    const img = card.querySelector('.card-image');
    if (img) { img.setAttribute('role', 'img'); img.setAttribute('aria-label', d.name); }
    const add = card.querySelector('.btn-add');
    const play = card.querySelector('.btn-play');
    if (add) {
      add.type = 'button';
      pintar(add, VF.favoritos().some(f => f.id === d.id), d.name);
      add.addEventListener('click', () => {
        const lista = VF.favoritos();
        const i = lista.findIndex(f => f.id === d.id);
        if (i >= 0) lista.splice(i, 1); else lista.push(d);
        if (VF.guardarFavoritos(lista)) {
          pintar(add, i < 0, d.name);
          VF.toast(i < 0 ? 'Añadido a Mi lista' : 'Quitado de Mi lista');
        }
      });
    }
    if (play) {
      play.type = 'button';
      play.addEventListener('click', () => VF.toast('Demo en video no disponible en modo demostración.'));
    }
  });

  // Filtros
  const texto = document.getElementById('filtroTexto');
  const nivel = document.getElementById('filtroNivel');
  const vacio = document.getElementById('catalogoVacio');
  const filas = [...document.querySelectorAll('.netflix-row')];
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  function filtrar() {
    const q = norm(texto.value.trim());
    const n = nivel.value;
    let visibles = 0;
    filas.forEach(fila => {
      let enFila = 0;
      fila.querySelectorAll('.exercise-card').forEach(card => {
        const d = datosDe(card);
        const ok = (!q || norm(d.name + ' ' + d.target).includes(q)) && (!n || d.levelClass === n);
        card.hidden = !ok;
        if (ok) enFila++;
      });
      fila.hidden = enFila === 0;
      visibles += enFila;
    });
    vacio.hidden = visibles > 0;
  }
  if (texto && nivel) { texto.addEventListener('input', filtrar); nivel.addEventListener('change', filtrar); }
})();
