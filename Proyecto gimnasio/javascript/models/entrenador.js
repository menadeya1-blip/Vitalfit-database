/* Entrenador con sesión: sus datos y su lista de clientes (guardada por entrenador). */
(function () {
  'use strict';
  window.VitalfitModelos = window.VitalfitModelos || {};

  class Entrenador {
    constructor(datos) {
      this.id = datos.id;
      this.fullName = datos.fullName;
      this.specialty = datos.specialty || '';
    }

    static buscarPorId(id) {
      const M = window.VitalfitModelos;
      const dato = M.Almacenamiento.leer('vitalfit_entrenadores', []).find(function (e) {
        return String(e.id) === String(id);
      });
      return dato ? new Entrenador(dato) : null;
    }

    get claveClientes() {
      return 'vitalfit_clientes_entrenador_' + this.id;
    }

    guardarDatos(nombre, especialidad) {
      const M = window.VitalfitModelos;
      const lista = M.Almacenamiento.leer('vitalfit_entrenadores', []);
      const actual = lista.find(function (e) { return String(e.id) === String(this.id); }, this);
      if (!actual) return false;
      actual.fullName = nombre;
      actual.specialty = especialidad;
      this.fullName = nombre;
      this.specialty = especialidad;
      return M.Almacenamiento.guardar('vitalfit_entrenadores', lista);
    }

    clientes() {
      const M = window.VitalfitModelos;
      return M.Almacenamiento.leer(this.claveClientes, []).map(M.Cliente.desdeObjeto);
    }

    // Devuelve { cliente } o { error }.
    agregarCliente(correo, precio) {
      const M = window.VitalfitModelos;
      const cuenta = M.Cuenta.buscarPorCorreo(correo);
      if (!cuenta) return { error: 'No existe una cuenta de cliente con ese correo.' };
      if (!Number.isInteger(precio) || precio < 0) {
        return { error: 'El precio debe ser un número entero mayor o igual a 0.' };
      }
      const lista = M.Almacenamiento.leer(this.claveClientes, []);
      if (lista.some(function (c) { return c.correo === correo; })) {
        return { error: 'Ese cliente ya está en tu lista.' };
      }
      const cliente = new M.Cliente(correo, cuenta.fullName, precio);
      lista.push(cliente);
      M.Almacenamiento.guardar(this.claveClientes, lista);
      return { cliente: cliente };
    }

    quitarCliente(correo) {
      const M = window.VitalfitModelos;
      const lista = M.Almacenamiento.leer(this.claveClientes, []).filter(function (c) { return c.correo !== correo; });
      M.Almacenamiento.guardar(this.claveClientes, lista);
    }
  }

  window.VitalfitModelos.Entrenador = Entrenador;
})();
