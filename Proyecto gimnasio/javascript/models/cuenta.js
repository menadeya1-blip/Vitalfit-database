/* Cuenta de cliente (solo lectura desde la página del entrenador). */
(function () {
  'use strict';
  window.VitalfitModelos = window.VitalfitModelos || {};

  class Cuenta {
    constructor(datos) {
      this.id = datos.id;
      this.fullName = datos.fullName;
      this.email = datos.email;
    }

    static buscarPorCorreo(correo) {
      const dato = window.VitalfitModelos.Almacenamiento.leer('vitalfit_usuarios', []).find(function (u) {
        return u.email === correo;
      });
      return dato ? new Cuenta(dato) : null;
    }
  }

  window.VitalfitModelos.Cuenta = Cuenta;
})();
