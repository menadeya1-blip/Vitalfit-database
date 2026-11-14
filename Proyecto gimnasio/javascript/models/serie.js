/* Serie de entrenamiento: ejercicio, peso (kg) y repeticiones. */
(function () {
  'use strict';
  window.VitalfitModelos = window.VitalfitModelos || {};

  class Serie {
    constructor(ejercicio, peso, reps, fecha) {
      this.ejercicio = ejercicio;
      this.peso = Number(peso);
      this.reps = Number(reps);
      this.fecha = fecha || Serie.hoy();
    }

    // Fecha local de hoy en formato AAAA-MM-DD
    static hoy() {
      const d = new Date();
      const mes = String(d.getMonth() + 1).padStart(2, '0');
      const dia = String(d.getDate()).padStart(2, '0');
      return d.getFullYear() + '-' + mes + '-' + dia;
    }

    // Peso cargado en la serie (kg × repeticiones)
    volumen() {
      return this.peso * this.reps;
    }

    aObjeto() {
      return { ejercicio: this.ejercicio, peso: this.peso, reps: this.reps, fecha: this.fecha };
    }

    // Devuelve el mensaje de error, o null si la serie es válida.
    static validar(pesoTexto, repsTexto) {
      const peso = Number(pesoTexto);
      const reps = Number(repsTexto);
      if (pesoTexto.trim() === '' || isNaN(peso)) return 'El peso debe ser un número.';
      if (peso < 0) return 'El peso no puede ser negativo.';
      if (repsTexto.trim() === '' || !Number.isInteger(reps) || reps < 1) {
        return 'Las repeticiones deben ser un número entero de al menos 1.';
      }
      return null;
    }
  }

  window.VitalfitModelos.Serie = Serie;
})();
