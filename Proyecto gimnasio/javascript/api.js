// Cliente de la API de VitalFit. Único lugar donde se define la dirección del backend.
(function () {
  'use strict';

  // Backend Spring Boot en local (XAMPP). Cambiar aquí si el backend se despliega en otra dirección.
  const API_BASE = 'http://localhost:8080/api/auth';

  async function request(path, options = {}) {
    let response;
    try {
      response = await fetch(API_BASE + path, {
        method: options.method || 'GET',
        headers: options.body ? { 'Content-Type': 'application/json' } : {},
        body: options.body ? JSON.stringify(options.body) : undefined
      });
    } catch (networkError) {
      const err = new Error('No se pudo conectar con el servidor. Verifica que el backend esté encendido.');
      err.status = 0;
      throw err;
    }

    const text = await response.text();
    let data = null;
    if (text) {
      try { data = JSON.parse(text); } catch (_) { data = { message: text }; }
    }

    if (!response.ok) {
      const err = new Error((data && data.message) || 'Ocurrió un error. Intenta de nuevo.');
      err.status = response.status;
      throw err;
    }
    return data;
  }

  window.VitalfitApi = {
    register: (body) => request('/register', { method: 'POST', body }),
    login: (body) => request('/login', { method: 'POST', body }),
    updateOnboarding: (userId, body) => request('/onboarding/' + encodeURIComponent(userId), { method: 'PUT', body }),
    deleteAccount: (userId, body) => request('/users/' + encodeURIComponent(userId), { method: 'DELETE', body })
  };
})();
