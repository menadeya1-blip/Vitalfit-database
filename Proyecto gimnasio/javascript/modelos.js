/*
 * VitalFit - modelos del frontend (demostración).
 * Clases que representan los datos de la app y su lógica, como las entidades del backend.
 * Se cargan antes de demo.js. Todo se guarda en localStorage de este navegador.
 */
(function () {
  'use strict';

  // Acceso seguro a localStorage: si no hay almacenamiento o el dato está dañado, no se rompe la página.
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

  // Una serie de entrenamiento: ejercicio, peso (kg) y repeticiones.
  class Serie {
    constructor(ejercicio, peso, reps) {
      this.ejercicio = ejercicio;
      this.peso = Number(peso);
      this.reps = Number(reps);
    }

    aObjeto() {
      return { ejercicio: this.ejercicio, peso: this.peso, reps: this.reps };
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

  // Cuenta de cliente (solo lectura desde aquí).
  class Cuenta {
    constructor(datos) {
      this.id = datos.id;
      this.fullName = datos.fullName;
      this.email = datos.email;
    }

    static buscarPorCorreo(correo) {
      const dato = Almacenamiento.leer('vitalfit_usuarios', []).find(function (u) { return u.email === correo; });
      return dato ? new Cuenta(dato) : null;
    }
  }

  // Cliente asignado a un entrenador, con su precio por entrenamiento en pesos.
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

  // Entrenador con sesión: sus datos y su lista de clientes (guardada por entrenador).
  class Entrenador {
    constructor(datos) {
      this.id = datos.id;
      this.fullName = datos.fullName;
      this.specialty = datos.specialty || '';
    }

    static buscarPorId(id) {
      const dato = Almacenamiento.leer('vitalfit_entrenadores', []).find(function (e) {
        return String(e.id) === String(id);
      });
      return dato ? new Entrenador(dato) : null;
    }

    get claveClientes() {
      return 'vitalfit_clientes_entrenador_' + this.id;
    }

    guardarDatos(nombre, especialidad) {
      const lista = Almacenamiento.leer('vitalfit_entrenadores', []);
      const actual = lista.find(function (e) { return String(e.id) === String(this.id); }, this);
      if (!actual) return false;
      actual.fullName = nombre;
      actual.specialty = especialidad;
      this.fullName = nombre;
      this.specialty = especialidad;
      return Almacenamiento.guardar('vitalfit_entrenadores', lista);
    }

    clientes() {
      return Almacenamiento.leer(this.claveClientes, []).map(Cliente.desdeObjeto);
    }

    // Devuelve { cliente } o { error }.
    agregarCliente(correo, precio) {
      const cuenta = Cuenta.buscarPorCorreo(correo);
      if (!cuenta) return { error: 'No existe una cuenta de cliente con ese correo.' };
      if (!Number.isInteger(precio) || precio < 0) {
        return { error: 'El precio debe ser un número entero mayor o igual a 0.' };
      }
      const lista = Almacenamiento.leer(this.claveClientes, []);
      if (lista.some(function (c) { return c.correo === correo; })) {
        return { error: 'Ese cliente ya está en tu lista.' };
      }
      const cliente = new Cliente(correo, cuenta.fullName, precio);
      lista.push(cliente);
      Almacenamiento.guardar(this.claveClientes, lista);
      return { cliente: cliente };
    }

    quitarCliente(correo) {
      const lista = Almacenamiento.leer(this.claveClientes, []).filter(function (c) { return c.correo !== correo; });
      Almacenamiento.guardar(this.claveClientes, lista);
    }
  }

  window.VitalfitModelos = {
    Almacenamiento: Almacenamiento,
    Serie: Serie,
    Cuenta: Cuenta,
    Cliente: Cliente,
    Entrenador: Entrenador
  };
})();
