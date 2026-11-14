/* Historial de entrenamientos: agrupa las series por fecha. */
(function () {
  'use strict';
  window.VitalfitModelos = window.VitalfitModelos || {};

  class Historial {
    // Devuelve una fila por fecha, de la más reciente a la más antigua. Las series sin fecha van al final.
    static agrupar(series) {
      const grupos = {};
      series.forEach(function (s) {
        const fecha = s.fecha || 'Sin fecha';
        if (!grupos[fecha]) grupos[fecha] = { fecha: fecha, series: 0, ejercicios: new Set(), volumen: 0 };
        grupos[fecha].series += 1;
        grupos[fecha].ejercicios.add(s.ejercicio);
        grupos[fecha].volumen += Number(s.peso) * Number(s.reps);
      });
      return Object.values(grupos)
        .map(function (g) {
          return { fecha: g.fecha, series: g.series, ejercicios: g.ejercicios.size, volumen: g.volumen };
        })
        .sort(function (a, b) {
          if (a.fecha === 'Sin fecha') return 1;
          if (b.fecha === 'Sin fecha') return -1;
          return a.fecha < b.fecha ? 1 : -1;
        });
    }
  }

  window.VitalfitModelos.Historial = Historial;
})();
