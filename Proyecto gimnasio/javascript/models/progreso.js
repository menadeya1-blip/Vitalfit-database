/* Progreso de peso corporal: un registro por día, con el cambio desde el primero. */
(function () {
  'use strict';
  window.VitalfitModelos = window.VitalfitModelos || {};

  class Progreso {
    static pesos() {
      return window.VitalfitModelos.Almacenamiento.leer('vitalfit_pesos', []);
    }

    // Guarda el peso de hoy (si ya hay un registro de hoy, lo reemplaza).
    static registrarPeso(peso) {
      const M = window.VitalfitModelos;
      const lista = Progreso.pesos();
      const hoy = M.Serie.hoy();
      const existente = lista.find(function (p) { return p.fecha === hoy; });
      if (existente) {
        existente.peso = peso;
      } else {
        lista.push({ fecha: hoy, peso: peso });
      }
      M.Almacenamiento.guardar('vitalfit_pesos', lista);
      return lista;
    }

    // Texto con el cambio desde el primer registro.
    static resumenTexto() {
      const lista = Progreso.pesos().slice().sort(function (a, b) { return a.fecha < b.fecha ? -1 : 1; });
      if (lista.length === 0) return 'Guarda tu peso para ver tu progreso.';
      if (lista.length === 1) return 'Este es tu primer registro: ' + lista[0].peso + ' kg.';

      const inicial = lista[0].peso;
      const actual = lista[lista.length - 1].peso;
      const cambio = Math.round((inicial - actual) * 10) / 10;
      if (cambio > 0) return 'Bajaste ' + cambio + ' kg desde tu primer registro.';
      if (cambio < 0) return 'Subiste ' + Math.abs(cambio) + ' kg desde tu primer registro.';
      return 'Tu peso no ha cambiado desde tu primer registro.';
    }
  }

  window.VitalfitModelos.Progreso = Progreso;
})();
