/* VitalFit - funciones frontend demo.
   Los datos se guardan en localStorage. No sustituye la validación ni la autorización del servidor. */
const claves = {
  rutinas: 'vf_rutinas_demo',
  reservas: 'vf_reservas_demo',
  progreso: 'vf_progreso_demo',
  asistencia: 'vf_asistencia_demo',
  plan: 'vf_plan_demo',
  rol: 'vf_rol_demo'
};

function leer(tipo) {
  try {
    const valor = JSON.parse(localStorage.getItem(claves[tipo]) || '[]');
    return Array.isArray(valor) ? valor : [];
  } catch {
    return [];
  }
}
function guardar(tipo, datos) {
  localStorage.setItem(claves[tipo], JSON.stringify(datos));
  actualizar();
}
function escapar(valor) {
  return String(valor ?? '').replace(/[&<>"']/g, caracter => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[caracter]);
}
function renderLista(tipo, id, titulo, detalle) {
  const elemento = document.getElementById(id);
  const datos = leer(tipo);
  elemento.innerHTML = datos.length
    ? datos.map((dato, indice) => `<div class="item"><div><b>${escapar(titulo(dato))}</b><small>${escapar(detalle(dato))}</small></div><button type="button" class="delete" data-delete="${tipo}" data-index="${indice}">Eliminar</button></div>`).join('')
    : '<p class="sub">Todavía no hay registros.</p>';
}
function actualizar() {
  renderLista('rutinas', 'listaRutinas', d => d.nombre, d => `${d.grupo} · ${d.ejercicios}`);
  renderLista('reservas', 'listaReservas', d => d.clase, d => `${d.nombre} · ${d.fecha} ${d.hora}`);
  renderLista('progreso', 'listaProgreso', d => `Peso: ${d.peso} kg`, d => `${d.fecha} · ${d.objetivo}${d.cintura ? ` · Cintura: ${d.cintura} cm` : ''}`);
  renderLista('asistencia', 'listaAsistencia', d => d.nombre, d => `${d.fecha} · ${d.hora}`);
  for (const tipo of ['rutinas', 'reservas', 'progreso', 'asistencia']) {
    document.getElementById(`total${tipo[0].toUpperCase()}${tipo.slice(1)}`).textContent = leer(tipo).length;
  }
  const progreso = leer('progreso').at(-1);
  document.getElementById('ultimoPeso').textContent = progreso ? `${progreso.peso} kg` : '--';
  document.getElementById('ultimoObjetivo').textContent = progreso ? progreso.objetivo : 'Sin registrar';
  document.getElementById('planActual').textContent = localStorage.getItem(claves.plan) || 'No has seleccionado un plan.';
}

const permisos = {
  miembro: ['inicio', 'rutinas', 'membresias', 'reservas', 'progreso', 'asistencia'],
  entrenador: ['inicio', 'rutinas', 'reservas', 'progreso', 'asistencia'],
  administrador: ['inicio', 'rutinas', 'membresias', 'reservas', 'progreso', 'asistencia']
};
function aplicarRol(rol) {
  const permitido = permisos[rol] || permisos.miembro;
  document.querySelectorAll('.tab').forEach(b => {
    b.hidden = !permitido.includes(b.dataset.tab);
  });
  const activa = document.querySelector('.tab.active:not([hidden])') || document.querySelector('.tab:not([hidden])');
  if (activa) activa.click();
  const aviso = document.getElementById('rolAviso');
  const mensajes = {
    miembro: 'Miembro: consulta tus rutinas, membresía, reservas, progreso y asistencia.',
    entrenador: 'Entrenador: administra rutinas y consulta reservas y progreso. La sección de membresías no está disponible en esta vista.',
    administrador: 'Administrador: vista de demostración con acceso a todas las secciones.'
  };
  aviso.textContent = `${mensajes[rol] || mensajes.miembro} Los permisos reales deben comprobarse en el servidor.`;
  localStorage.setItem(claves.rol, rol);
}
document.querySelectorAll('.tab').forEach(b => b.addEventListener('click', () => {
  if (b.hidden) return;
  document.querySelectorAll('.tab').forEach(tab => { tab.classList.toggle('active', tab === b); tab.setAttribute('aria-selected', String(tab === b)); });
  document.querySelectorAll('.panel').forEach(panel => panel.classList.toggle('active', panel.id === b.dataset.tab));
}));

function conectar(id, tipo, validar) {
  const formulario = document.getElementById(id);
  formulario.addEventListener('submit', evento => {
    evento.preventDefault();
    if (!formulario.reportValidity()) return;
    const dato = Object.fromEntries(new FormData(formulario).entries());
    for (const clave of Object.keys(dato)) dato[clave] = dato[clave].trim();
    const error = validar ? validar(dato) : '';
    if (error) { alert(error); return; }
    const datos = leer(tipo);
    datos.push(dato);
    guardar(tipo, datos);
    formulario.reset();
  });
}
conectar('formRutina', 'rutinas', dato =>
  dato.nombre && dato.grupo && dato.ejercicios ? '' : 'Completa todos los campos de la rutina.');
conectar('formReserva', 'reservas', dato => {
  if (!dato.nombre || !dato.clase || !dato.fecha || !dato.hora) return 'Completa todos los campos de la reserva.';
  const fechaHora = new Date(`${dato.fecha}T${dato.hora}`);
  if (Number.isNaN(fechaHora.getTime()) || fechaHora < new Date()) return 'Selecciona una fecha y hora futuras.';
  const duplicada = leer('reservas').some(r =>
    r.fecha === dato.fecha && r.hora === dato.hora && r.clase === dato.clase && r.nombre.toLowerCase() === dato.nombre.toLowerCase()
  );
  return duplicada ? 'Ya existe una reserva igual para este usuario, clase y horario.' : '';
});
conectar('formProgreso', 'progreso', dato => {
  const peso = Number(dato.peso);
  const cintura = dato.cintura === '' ? null : Number(dato.cintura);
  if (!Number.isFinite(peso) || peso < 1 || peso > 500) return 'El peso debe estar entre 1 y 500 kg.';
  if (cintura !== null && (!Number.isFinite(cintura) || cintura < 1 || cintura > 300)) return 'La cintura debe estar entre 1 y 300 cm.';
  if (!dato.objetivo || !dato.fecha) return 'Completa el objetivo y la fecha.';
  dato.peso = String(peso);
  return '';
});
conectar('formAsistencia', 'asistencia', dato =>
  dato.nombre && dato.fecha && dato.hora ? '' : 'Completa todos los campos de asistencia.');

window.elegirPlan = (nombre, precio) => {
  const valor = Number(precio);
  if (!Number.isFinite(valor) || valor <= 0 || !Number.isInteger(valor)) {
    alert('El valor del plan no es válido.');
    return;
  }
  if (confirm(`¿Seleccionar el plan ${nombre} por $${valor.toLocaleString('es-CO')}? No se realizará ningún cobro.`)) {
    localStorage.setItem(claves.plan, `Plan ${nombre} · $${valor.toLocaleString('es-CO')} COP (sin pago realizado)`);
    actualizar();
  }
};
document.addEventListener('click', evento => {
  const boton = evento.target.closest('[data-delete]');
  if (!boton) return;
  const tipo = boton.dataset.delete;
  if (!claves[tipo]) return;
  const datos = leer(tipo);
  datos.splice(Number(boton.dataset.index), 1);
  guardar(tipo, datos);
});

document.getElementById('rolDemo').addEventListener('change', evento => aplicarRol(evento.target.value));
document.getElementById('cargarPruebas').addEventListener('click', () => {
  if (!confirm('Se agregarán ejemplos únicamente a las listas que estén vacías. ¿Continuar?')) return;
  const manana = new Date();
  manana.setDate(manana.getDate() + 1);
  const fechaPrueba = `${manana.getFullYear()}-${String(manana.getMonth()+1).padStart(2,'0')}-${String(manana.getDate()).padStart(2,'0')}`;
  const ejemplos = {
    rutinas: [{nombre:'Rutina de fuerza',grupo:'Piernas',ejercicios:'Sentadillas 3x12, prensa 3x10'}],
    reservas: [{nombre:'Usuario de prueba',clase:'Yoga',fecha:fechaPrueba,hora:'10:00'}],
    progreso: [{peso:'70',cintura:'82',objetivo:'Mejorar resistencia',fecha:fechaPrueba}],
    asistencia: [{nombre:'Usuario de prueba',fecha:fechaPrueba,hora:'08:00'}]
  };
  for (const [tipo, datos] of Object.entries(ejemplos)) {
    if (leer(tipo).length === 0) localStorage.setItem(claves[tipo], JSON.stringify(datos));
  }
  actualizar();
  alert('Datos de prueba agregados a las listas que estaban vacías.');
});

const hoy = new Date();
const fechaMinima = `${hoy.getFullYear()}-${String(hoy.getMonth()+1).padStart(2,'0')}-${String(hoy.getDate()).padStart(2,'0')}`;
document.querySelectorAll('input[type="date"]').forEach(campo => campo.min = fechaMinima);

const rolGuardado = localStorage.getItem(claves.rol) || 'miembro';
document.getElementById('rolDemo').value = rolGuardado;
aplicarRol(rolGuardado);
actualizar();
