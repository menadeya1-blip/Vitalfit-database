/*
 * VitalFit - cuentas locales (sin servidor).
 * Expone window.VitalfitApi con las mismas funciones que usaban las páginas al hablar con el backend,
 * para que main.js y app.js no cambien. Las cuentas se guardan en localStorage de este navegador.
 * Solo para demostración: no es un sistema de autenticación seguro.
 */
(function () {
  'use strict';

  var CLAVE_USUARIOS = 'vitalfit_usuarios';
  var OBJETIVOS = ['PERDIDA_GRASA', 'GANANCIA_MUSCULAR', 'RESISTENCIA'];

  function errorConEstado(status, mensaje) {
    var err = new Error(mensaje);
    err.status = status;
    return err;
  }

  function leerUsuarios() {
    try {
      var valor = JSON.parse(localStorage.getItem(CLAVE_USUARIOS));
      return Array.isArray(valor) ? valor : [];
    } catch (e) {
      return [];
    }
  }

  function guardarUsuarios(lista) {
    try {
      localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(lista));
    } catch (e) {
      throw errorConEstado(0, 'No se pudo guardar en este navegador.');
    }
  }

  function normalizarCorreo(correo) {
    return String(correo || '').trim().toLowerCase();
  }

  function edadDe(fechaTexto) {
    var hoy = new Date();
    var nac = new Date(fechaTexto + 'T00:00:00');
    var edad = hoy.getFullYear() - nac.getFullYear();
    var mes = hoy.getMonth() - nac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) edad--;
    return edad;
  }

  // Cifra la contraseña con SHA-256 para no guardarla en texto plano.
  async function cifrar(texto) {
    if (window.crypto && window.crypto.subtle) {
      var digest = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
      return Array.from(new Uint8Array(digest)).map(function (b) {
        return b.toString(16).padStart(2, '0');
      }).join('');
    }
    // Respaldo para navegadores sin crypto.subtle (solo demostración)
    return 'sin-cifrar:' + texto;
  }

  // Lo que la página recibe: nunca la contraseña
  function datosPublicos(u) {
    return {
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      birthDate: u.birthDate,
      weightKg: u.weightKg,
      heightCm: u.heightCm,
      fitnessGoal: u.fitnessGoal,
      parentalConsentPending: u.parentalConsentPending
    };
  }

  async function register(datos) {
    if (!datos.fullName || !String(datos.fullName).trim()) throw errorConEstado(400, 'El nombre es obligatorio.');
    if (!datos.birthDate) throw errorConEstado(400, 'La fecha de nacimiento es obligatoria.');
    if (new Date(datos.birthDate + 'T00:00:00') >= new Date()) {
      throw errorConEstado(400, 'La fecha de nacimiento debe ser una fecha pasada.');
    }
    if (!datos.password || datos.password.length < 8) {
      throw errorConEstado(400, 'La contraseña debe tener al menos 8 caracteres.');
    }
    if (!datos.acceptedTerms || !datos.acceptedPrivacy) {
      throw errorConEstado(400, 'Debes aceptar los términos y la política de privacidad.');
    }

    var lista = leerUsuarios();
    var correo = normalizarCorreo(datos.email);
    if (lista.some(function (u) { return u.email === correo; })) {
      throw errorConEstado(409, 'El correo electrónico ya está registrado.');
    }

    var nuevo = {
      id: lista.reduce(function (max, u) { return Math.max(max, u.id); }, 0) + 1,
      fullName: String(datos.fullName).trim(),
      email: correo,
      passwordHash: await cifrar(datos.password),
      birthDate: datos.birthDate,
      weightKg: null,
      heightCm: null,
      fitnessGoal: null,
      // Menores de 18 necesitan autorización de un padre o tutor antes de entrar
      parentalConsentPending: edadDe(datos.birthDate) < 18,
      createdAt: new Date().toISOString()
    };

    lista.push(nuevo);
    guardarUsuarios(lista);
    return datosPublicos(nuevo);
  }

  async function login(datos) {
    var correo = normalizarCorreo(datos.email);
    var usuario = leerUsuarios().find(function (u) { return u.email === correo; });
    var hash = usuario ? await cifrar(datos.password || '') : null;

    // Mismo mensaje para correo o contraseña incorrectos, como en el backend
    if (!usuario || usuario.passwordHash !== hash) {
      throw errorConEstado(401, 'Correo o contraseña incorrectos.');
    }
    if (usuario.parentalConsentPending) {
      throw errorConEstado(403, 'La cuenta requiere la autorización de un padre o tutor.');
    }
    return datosPublicos(usuario);
  }

  async function updateOnboarding(userId, body) {
    var lista = leerUsuarios();
    var usuario = lista.find(function (u) { return u.id === Number(userId); });
    if (!usuario) throw errorConEstado(404, 'Usuario no encontrado.');

    var peso = Number(body.weightKg);
    var estatura = Number(body.heightCm);
    if (!(peso >= 20 && peso <= 400)) throw errorConEstado(400, 'El peso debe estar entre 20 y 400 kg.');
    if (!(estatura >= 50 && estatura <= 250)) throw errorConEstado(400, 'La estatura debe estar entre 50 y 250 cm.');
    if (OBJETIVOS.indexOf(body.fitnessGoal) === -1) throw errorConEstado(400, 'Selecciona un objetivo válido.');

    usuario.weightKg = peso;
    usuario.heightCm = estatura;
    usuario.fitnessGoal = body.fitnessGoal;
    guardarUsuarios(lista);
    return datosPublicos(usuario);
  }

  async function deleteAccount(userId, body) {
    var lista = leerUsuarios();
    var usuario = lista.find(function (u) { return u.id === Number(userId); });
    if (!usuario) throw errorConEstado(404, 'Usuario no encontrado.');

    var hash = await cifrar(body.password || '');
    if (usuario.email !== normalizarCorreo(body.email) || usuario.passwordHash !== hash) {
      throw errorConEstado(401, 'Correo o contraseña incorrectos.');
    }
    guardarUsuarios(lista.filter(function (u) { return u.id !== usuario.id; }));
    return null;
  }

  async function getAccount(userId) {
    var usuario = leerUsuarios().find(function (u) { return u.id === Number(userId); });
    if (!usuario) throw errorConEstado(404, 'Usuario no encontrado.');
    return datosPublicos(usuario);
  }

  async function updateAccount(userId, body) {
    var lista = leerUsuarios();
    var usuario = lista.find(function (u) { return u.id === Number(userId); });
    if (!usuario) throw errorConEstado(404, 'Usuario no encontrado.');

    var nombre = String(body.fullName || '').trim();
    if (!nombre) throw errorConEstado(400, 'El nombre es obligatorio.');
    if (nombre.length > 100) throw errorConEstado(400, 'El nombre no puede tener más de 100 caracteres.');

    var correo = normalizarCorreo(body.email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) throw errorConEstado(400, 'El correo no es válido.');
    if (lista.some(function (u) { return u.email === correo && u.id !== usuario.id; })) {
      throw errorConEstado(409, 'El correo electrónico ya está registrado.');
    }

    if (!body.birthDate || new Date(body.birthDate + 'T00:00:00') >= new Date()) {
      throw errorConEstado(400, 'La fecha de nacimiento debe ser una fecha pasada.');
    }

    var cambiaCorreo = correo !== usuario.email;
    var cambiaClave = !!body.newPassword;
    if (cambiaClave && body.newPassword.length < 8) {
      throw errorConEstado(400, 'La nueva contraseña debe tener al menos 8 caracteres.');
    }
    // Para cambiar el correo o la contraseña hay que confirmar la contraseña actual
    if (cambiaCorreo || cambiaClave) {
      var hashActual = await cifrar(body.currentPassword || '');
      if (usuario.passwordHash !== hashActual) {
        throw errorConEstado(401, 'La contraseña actual no es correcta.');
      }
    }

    usuario.fullName = nombre;
    usuario.email = correo;
    usuario.birthDate = body.birthDate;
    if (cambiaClave) usuario.passwordHash = await cifrar(body.newPassword);
    guardarUsuarios(lista);
    return datosPublicos(usuario);
  }

  var CLAVE_ENTRENADORES = 'vitalfit_entrenadores';

  function leerEntrenadores() {
    try {
      var valor = JSON.parse(localStorage.getItem(CLAVE_ENTRENADORES));
      return Array.isArray(valor) ? valor : [];
    } catch (e) {
      return [];
    }
  }

  function guardarEntrenadores(lista) {
    try {
      localStorage.setItem(CLAVE_ENTRENADORES, JSON.stringify(lista));
    } catch (e) {
      throw errorConEstado(0, 'No se pudo guardar en este navegador.');
    }
  }

  function publicoEntrenador(e) {
    return { id: e.id, fullName: e.fullName, email: e.email, specialty: e.specialty || '' };
  }

  async function registerTrainer(datos) {
    var nombre = String(datos.fullName || '').trim();
    if (!nombre) throw errorConEstado(400, 'El nombre es obligatorio.');
    var correo = normalizarCorreo(datos.email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) throw errorConEstado(400, 'El correo no es válido.');
    if (!datos.password || datos.password.length < 8) {
      throw errorConEstado(400, 'La contraseña debe tener al menos 8 caracteres.');
    }

    var lista = leerEntrenadores();
    if (lista.some(function (e) { return e.email === correo; })) {
      throw errorConEstado(409, 'Ya existe un entrenador con ese correo.');
    }

    var nuevo = {
      id: lista.reduce(function (max, e) { return Math.max(max, e.id); }, 0) + 1,
      fullName: nombre,
      email: correo,
      passwordHash: await cifrar(datos.password),
      specialty: String(datos.specialty || '').trim()
    };
    lista.push(nuevo);
    guardarEntrenadores(lista);
    return publicoEntrenador(nuevo);
  }

  async function loginTrainer(datos) {
    var correo = normalizarCorreo(datos.email);
    var entrenador = leerEntrenadores().find(function (e) { return e.email === correo; });
    var hash = entrenador ? await cifrar(datos.password || '') : null;
    if (!entrenador || entrenador.passwordHash !== hash) {
      throw errorConEstado(401, 'Correo o contraseña incorrectos.');
    }
    return publicoEntrenador(entrenador);
  }

  window.VitalfitApi = {
    register: register,
    login: login,
    updateOnboarding: updateOnboarding,
    deleteAccount: deleteAccount,
    getAccount: getAccount,
    updateAccount: updateAccount,
    registerTrainer: registerTrainer,
    loginTrainer: loginTrainer
  };
})();
