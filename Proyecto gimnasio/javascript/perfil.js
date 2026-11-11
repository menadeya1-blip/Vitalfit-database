(() => {
  'use strict';
  if (!window.VF) return;
  const objetivos = { MUSCLE_GAIN: 'Ganancia muscular', FAT_LOSS: 'Pérdida de grasa', MAINTENANCE: 'Mantenimiento' };
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  const email = String((VF.sesion && VF.sesion.email) || '').toLowerCase();
  const u = VF.leer('vitalfit_demo_users').find(x => x.email && String(x.email).toLowerCase() === email);
  set('pCorreo', email || '—');
  if (!u) {
    set('perfilAviso', 'No hay un registro de demostración para este correo. Crea una cuenta desde la pantalla de inicio para ver aquí tus datos.');
    return;
  }
  set('pNombre', `${u.firstName || ''} ${u.lastName || ''}`.trim() || '—');
  set('pEdad', u.age ? `${u.age} años` : '—');
  set('pObjetivo', objetivos[u.goal] || '—');
  set('pPeso', u.weight ? `${u.weight} kg` : '—');
  set('pEstatura', u.height ? `${u.height} cm` : '—');
})();
