/* Acceso seguro a localStorage: si no hay almacenamiento o el dato está dañado, no se rompe la página. */
(function () {
  'use strict';
  window.VitalfitModelos = window.VitalfitModelos || {};

  class Almacenamiento {
    static leer(clave, porDefecto) {
      try {
        const valor = JSON.parse(localStorage.getItem(clave));
        return valor === null ? porDefecto : valor;
      } catch (e) {
        return porDefecto;
      }
    }

    static guardar(clave, valor) {
      try {
        localStorage.setItem(clave, JSON.stringify(valor));
        return true;
      } catch (e) {
        return false;
      }
    }
  }

  window.VitalfitModelos.Almacenamiento = Almacenamiento;
})();
