/*
 * VitalFit - demostración de frontend.
 * Guarda los datos solo en este navegador (localStorage). No envía nada al servidor.
 * Cada página indica qué debe hacer con <body data-page="...">.
 */
(function () {
  'use strict';

  var CLAVES = {
    favoritos: 'vitalfit_favoritos',
    series: 'vitalfit_series',
    rutinas: 'vitalfit_rutinas',
    perfil: 'vitalfit_perfil'
  };

  var EJERCICIOS = [
    'Press de Banca Plano', 'Remo con Barra', 'Press Militar Sentado', 'Curl de Biceps con Mancuernas',
    'Jalón al Pecho en Polea', 'Sentadilla Libre con Barra', 'Peso Muerto Rumano', 'Prensa de Piernas 45°',
    'Hip Thrust con Barra', 'Flexiones de Pecho (Push-ups)', 'Zancadas Dinámicas (Lunges)',
    'Plancha Abdominal Estática', 'Pike Push-ups', 'Fondos en Silla (Triceps Dips)', 'Burpees Completos',
    'Jumping Jacks', 'Mountain Climbers', 'Saltos con Rodillas al Pecho'
  ];

  var RUTINAS = [
    { nombre: 'Cuerpo completo', detalle: '3 ejercicios · 45 min · GYM' },
    { nombre: 'Tren inferior', detalle: '4 ejercicios · 50 min · GYM' },
    { nombre: 'Tren superior', detalle: '4 ejercicios · 40 min · GYM' },
    { nombre: 'Cardio en casa', detalle: '3 ejercicios · 30 min · HOME' }
  ];

  var OBJETIVOS = {
    PERDIDA_GRASA: 'Pérdida de grasa',
    GANANCIA_MUSCULAR: 'Ganancia muscular',
    RESISTENCIA: 'Resistencia'
  };

  // Lectura segura: si el dato está dañado o no hay almacenamiento, devuelve el valor por defecto.
  function leer(clave, porDefecto) {
    try {
      var valor = JSON.parse(localStorage.getItem(clave));
      return valor === null ? porDefecto : valor;
    } catch (e) {
      return porDefecto;
    }
  }

  function guardar(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch (e) {
      mostrarEstado('No se pudo guardar en este navegador.', 'error');
    }
  }

  // Mensaje visible para la persona que usa la página (no solo en la consola).
  function mostrarEstado(texto, tipo) {
    var el = document.getElementById('estado');
    if (!el) return;
    el.textContent = texto;
    el.className = tipo === 'error' ? 'error' : 'ok';
    el.hidden = !texto;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function marcarNavegacion() {
    var actual = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-menu a').forEach(function (enlace) {
      if (enlace.getAttribute('href') === actual) enlace.setAttribute('aria-current', 'page');
    });
  }

  // ---------- Catálogo (ejercicio.html) ----------
  function pintarBotonFavorito(boton, marcado) {
    boton.textContent = marcado ? '✓' : '+';
    boton.setAttribute('aria-pressed', String(marcado));
    boton.title = marcado ? 'Quitar de Mi Lista' : 'Agregar a Mi Lista';
  }

  function iniciarCatalogo() {
    var favoritos = leer(CLAVES.favoritos, []);

    // Recorre cada tarjeta: de la tarjeta sale el nombre (h3) y el botón (.btn-add)
    document.querySelectorAll('.exercise-card').forEach(function (tarjeta) {
      var nombre = tarjeta.querySelector('h3').textContent.trim();
      pintarBotonFavorito(tarjeta.querySelector('.btn-add'), favoritos.indexOf(nombre) !== -1);

      var reproducir = tarjeta.querySelector('.btn-play');
      if (reproducir) {
        reproducir.disabled = true;
        reproducir.title = 'Próximamente';
      }
    });

    // Delegación: un solo escucha para todos los botones "+"
    document.addEventListener('click', function (evento) {
      var boton = evento.target.closest('.btn-add');
      if (!boton) return;

      var tarjeta = boton.closest('.exercise-card');
      var nombre = tarjeta.querySelector('h3').textContent.trim();
      var lista = leer(CLAVES.favoritos, []);
      var pos = lista.indexOf(nombre);

      if (pos === -1) {
        lista.push(nombre);
        mostrarEstado(nombre + ' se agregó a Mi Lista.', 'ok');
      } else {
        lista.splice(pos, 1);
        mostrarEstado(nombre + ' se quitó de Mi Lista.', 'ok');
      }
      guardar(CLAVES.favoritos, lista);
      pintarBotonFavorito(boton, pos === -1);
    });
  }

  // ---------- Mi lista (mi-lista.html) ----------
  function iniciarMiLista() {
    var lista = document.getElementById('listaFavoritos');
    var vacio = document.getElementById('favoritosVacio');

    function pintar() {
      var favoritos = leer(CLAVES.favoritos, []);
      lista.replaceChildren();
      favoritos.forEach(function (nombre) {
        var li = document.createElement('li');
        var texto = document.createElement('span');
        texto.textContent = nombre;
        var quitar = document.createElement('button');
        quitar.type = 'button';
        quitar.className = 'btn btn-sec';
        quitar.textContent = 'Quitar';
        quitar.setAttribute('aria-label', 'Quitar ' + nombre + ' de Mi Lista');
        li.append(texto, quitar);
        lista.append(li);
      });
      vacio.hidden = favoritos.length > 0;
    }

    lista.addEventListener('click', function (evento) {
      var boton = evento.target.closest('button');
      if (!boton) return;
      var li = boton.closest('li');
      var nombre = li.firstElementChild.textContent;
      guardar(CLAVES.favoritos, leer(CLAVES.favoritos, []).filter(function (n) { return n !== nombre; }));
      li.remove();
      // Recorrido: los hijos de la lista indican si quedó vacía
      vacio.hidden = lista.children.length > 0;
      mostrarEstado(nombre + ' se quitó de tu lista.', 'ok');
    });

    pintar();
  }

  // ---------- Rutinas (rutinas.html) ----------
  function iniciarRutinas() {
    var catalogo = document.getElementById('listaRutinas');
    var misRutinas = document.getElementById('misRutinas');
    var vacio = document.getElementById('rutinasVacio');

    function pintar() {
      var guardadas = leer(CLAVES.rutinas, []);

      catalogo.replaceChildren();
      RUTINAS.forEach(function (rutina) {
        var li = document.createElement('li');
        var info = document.createElement('span');
        var titulo = document.createElement('strong');
        titulo.textContent = rutina.nombre;
        var detalle = document.createElement('small');
        detalle.textContent = rutina.detalle;
        info.append(titulo, detalle);

        var boton = document.createElement('button');
        boton.type = 'button';
        boton.className = 'btn btn-sec';
        boton.textContent = guardadas.indexOf(rutina.nombre) !== -1 ? 'Quitar de mis rutinas' : 'Agregar a mis rutinas';
        li.append(info, boton);
        catalogo.append(li);
      });

      misRutinas.replaceChildren();
      guardadas.forEach(function (nombre) {
        var li = document.createElement('li');
        li.textContent = nombre;
        misRutinas.append(li);
      });
      vacio.hidden = guardadas.length > 0;
    }

    catalogo.addEventListener('click', function (evento) {
      var boton = evento.target.closest('button');
      if (!boton) return;
      // Del botón subimos al <li> y de ahí bajamos al nombre de la rutina
      var nombre = boton.closest('li').querySelector('strong').textContent;
      var lista = leer(CLAVES.rutinas, []);
      var pos = lista.indexOf(nombre);
      if (pos === -1) {
        lista.push(nombre);
        mostrarEstado('Rutina "' + nombre + '" agregada.', 'ok');
      } else {
        lista.splice(pos, 1);
        mostrarEstado('Rutina "' + nombre + '" quitada.', 'ok');
      }
      guardar(CLAVES.rutinas, lista);
      pintar();
    });

    pintar();
  }

  // ---------- Perfil (perfil.html) ----------
  function iniciarPerfil() {
    var usuario = document.getElementById('perfilUsuario');
    var form = document.getElementById('formPerfil');
    var resumen = document.getElementById('perfilResumen');

    var id = null;
    try { id = sessionStorage.getItem('vitalfit_user_id'); } catch (e) { id = null; }
    usuario.textContent = id ? 'Cuenta #' + id + ' (iniciaste sesión en este navegador).' : 'No hay sesión activa. Inicia sesión para ver tu cuenta.';

    function pintarResumen(datos) {
      resumen.replaceChildren();
      [
        'Objetivo: ' + (OBJETIVOS[datos.objetivo] || 'Sin definir'),
        'Peso: ' + datos.peso + ' kg',
        'Estatura: ' + datos.estatura + ' cm'
      ].forEach(function (texto) {
        var li = document.createElement('li');
        li.textContent = texto;
        resumen.append(li);
      });
    }

    var guardado = leer(CLAVES.perfil, null);
    if (guardado) {
      form.elements.namedItem('objetivo').value = guardado.objetivo;
      form.elements.namedItem('peso').value = guardado.peso;
      form.elements.namedItem('estatura').value = guardado.estatura;
      pintarResumen(guardado);
    }

    form.addEventListener('submit', function (evento) {
      evento.preventDefault();
      var peso = Number(form.elements.namedItem('peso').value);
      var estatura = Number(form.elements.namedItem('estatura').value);

      if (!(peso >= 20 && peso <= 300)) {
        mostrarEstado('El peso debe estar entre 20 y 300 kg.', 'error');
        return;
      }
      if (!(estatura >= 100 && estatura <= 250)) {
        mostrarEstado('La estatura debe estar entre 100 y 250 cm.', 'error');
        return;
      }

      var datos = { objetivo: form.elements.namedItem('objetivo').value, peso: peso, estatura: estatura };
      guardar(CLAVES.perfil, datos);
      pintarResumen(datos);
      mostrarEstado('Datos guardados en este navegador.', 'ok');
    });
  }

  // ---------- Series (entrenamiento.html) ----------
  function validarSerie(pesoTexto, repsTexto) {
    var peso = Number(pesoTexto);
    var reps = Number(repsTexto);
    if (pesoTexto.trim() === '' || isNaN(peso)) return 'El peso debe ser un número.';
    if (peso < 0) return 'El peso no puede ser negativo.';
    if (repsTexto.trim() === '' || !Number.isInteger(reps) || reps < 1) {
      return 'Las repeticiones deben ser un número entero de al menos 1.';
    }
    return null;
  }

  function iniciarEntrenamiento() {
    var form = document.getElementById('formSerie');
    var select = document.getElementById('ejercicio');
    var tbody = document.getElementById('cuerpoSeries');
    var vacio = document.getElementById('seriesVacio');
    var resumen = document.getElementById('resumenSeries');

    EJERCICIOS.forEach(function (nombre) {
      var opcion = document.createElement('option');
      opcion.value = nombre;
      opcion.textContent = nombre;
      select.append(opcion);
    });

    function pintar() {
      var series = leer(CLAVES.series, []);
      var conteo = {};
      var volumen = 0;

      tbody.replaceChildren();
      series.forEach(function (serie, indice) {
        // El número de serie se calcula por ejercicio, a partir de las anteriores
        conteo[serie.ejercicio] = (conteo[serie.ejercicio] || 0) + 1;
        volumen += serie.peso * serie.reps;

        var fila = document.createElement('tr');
        fila.dataset.indice = indice;
        [conteo[serie.ejercicio], serie.ejercicio, serie.peso, serie.reps].forEach(function (valor) {
          var celda = document.createElement('td');
          celda.textContent = valor;
          fila.append(celda);
        });

        var accion = document.createElement('td');
        var eliminar = document.createElement('button');
        eliminar.type = 'button';
        eliminar.className = 'btn btn-sec';
        eliminar.textContent = 'Eliminar';
        eliminar.setAttribute('aria-label', 'Eliminar serie ' + conteo[serie.ejercicio] + ' de ' + serie.ejercicio);
        accion.append(eliminar);
        fila.append(accion);
        tbody.append(fila);
      });

      vacio.hidden = series.length > 0;
      resumen.textContent = series.length + ' series registradas · volumen total: ' + volumen + ' kg';
    }

    form.addEventListener('submit', function (evento) {
      evento.preventDefault();
      var pesoCampo = form.elements.namedItem('peso');
      var repsCampo = form.elements.namedItem('reps');

      var error = validarSerie(pesoCampo.value, repsCampo.value);
      if (error) {
        mostrarEstado(error, 'error');
        (pesoCampo.value.trim() === '' || isNaN(Number(pesoCampo.value)) || Number(pesoCampo.value) < 0 ? pesoCampo : repsCampo).focus();
        return;
      }

      var series = leer(CLAVES.series, []);
      series.push({ ejercicio: select.value, peso: Number(pesoCampo.value), reps: Number(repsCampo.value) });
      guardar(CLAVES.series, series);

      pesoCampo.value = '';
      repsCampo.value = '';
      pesoCampo.focus();
      mostrarEstado('Serie guardada en este navegador.', 'ok');
      pintar();
    });

    // Delegación sobre el cuerpo de la tabla: el botón sube a su fila y la fila indica el índice
    tbody.addEventListener('click', function (evento) {
      var boton = evento.target.closest('button');
      if (!boton) return;
      var indice = Number(boton.closest('tr').dataset.indice);
      var series = leer(CLAVES.series, []);
      series.splice(indice, 1);
      guardar(CLAVES.series, series);
      mostrarEstado('Serie eliminada.', 'ok');
      pintar();
    });

    pintar();
  }

  // ---------- Arranque ----------
  document.addEventListener('DOMContentLoaded', function () {
    marcarNavegacion();
    var pagina = document.body.dataset.page;
    if (pagina === 'catalogo') iniciarCatalogo();
    if (pagina === 'mi-lista') iniciarMiLista();
    if (pagina === 'rutinas') iniciarRutinas();
    if (pagina === 'perfil') iniciarPerfil();
    if (pagina === 'entrenamiento') iniciarEntrenamiento();
  });
})();
