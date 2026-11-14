/* Cliente asignado a un entrenador, con su precio por entrenamiento en pesos. */
(function () {
  'use strict';
  window.VitalfitModelos = window.VitalfitModelos || {};

  class Cliente {
    constructor(correo, nombre, precio) {
      this.correo = correo;
      this.nombre = nombre;
      this.precio = precio;
    }

    precioFormateado() {
      return '$' + Number(this.precio).toLocaleString('es-CO') + ' COP';
    }

    descripcion() {
      return this.nombre + ' · ' + this.correo + ' · ' + this.precioFormateado() + ' por entrenamiento';
    }

    static desdeObjeto(o) {
      return new Cliente(o.correo, o.nombre, o.precio);
    }
  }

  window.VitalfitModelos.Cliente = Cliente;
})();
