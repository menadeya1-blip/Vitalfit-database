// Interfaz de index.html: cambio entre vistas, registro (paso 1), onboarding (paso 2) y aviso de cookies.
(function () {
  'use strict';

  const SESSION_KEY = 'vitalfit_user_id';
  const COOKIE_KEY = 'vitalfit_cookies_ack';
  const VISTAS = ['login-container', 'register-container', 'onboarding-container', 'pending-container'];

  const $ = (id) => document.getElementById(id);

  function mostrarVista(id) {
    VISTAS.forEach((v) => { $(v).hidden = v !== id; });
    const titulo = $(id).querySelector('h1');
    if (titulo) { titulo.tabIndex = -1; titulo.focus(); }
  }

  function mensaje(el, texto, tipo) {
    el.textContent = texto || '';
    el.className = 'mensaje ' + (tipo || 'error');
    el.hidden = !texto;
  }

  function ocupado(boton, spinner, textoEl, activo, textoActivo, textoNormal) {
    boton.disabled = activo;
    spinner.hidden = !activo;
    textoEl.textContent = activo ? textoActivo : textoNormal;
  }

  // Expuesto para app.js (login) cuando el usuario aún no completó el onboarding
  window.VitalfitUI = {
    mostrarOnboarding(userId) {
      sessionStorage.setItem(SESSION_KEY, String(userId));
      mostrarVista('onboarding-container');
    },
    mostrarPendiente() { mostrarVista('pending-container'); },
    mostrarLogin() { mostrarVista('login-container'); }
  };

  document.addEventListener('DOMContentLoaded', () => {
    // Navegación entre vistas
    $('btn-show-register').addEventListener('click', () => mostrarVista('register-container'));
    $('btn-show-login').addEventListener('click', () => mostrarVista('login-container'));
    $('btn-pending-login').addEventListener('click', () => mostrarVista('login-container'));

    // Enlaces legales: todavía no existen las páginas (pendientes de revisión legal)
    ['linkTerminos', 'linkPrivacidad', 'linkCookies'].forEach((id) => {
      $(id).addEventListener('click', (e) => { e.preventDefault(); });
    });

    // Paso 1: registro
    $('registerForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = $('registerMensaje');
      mensaje(msg, '');
      if (!e.target.reportValidity()) return;

      const datos = {
        fullName: $('fullName').value.trim(),
        email: $('register_email').value.trim(),
        password: $('register_password').value,
        birthDate: $('birthDate').value,
        acceptedTerms: $('acceptTerms').checked,
        acceptedPrivacy: $('acceptPrivacy').checked
      };

      ocupado($('btnRegistro'), $('registroSpinner'), $('registroTexto'), true, 'Creando cuenta...', 'Crear cuenta');
      try {
        const usuario = await window.VitalfitApi.register(datos);
        e.target.reset();
        if (usuario.parentalConsentPending) {
          mostrarVista('pending-container');
        } else {
          window.VitalfitUI.mostrarOnboarding(usuario.id);
        }
      } catch (err) {
        if (err.status === 409) {
          mensaje(msg, 'Ese correo ya está registrado. ¿Quieres iniciar sesión?');
        } else {
          mensaje(msg, err.message);
        }
      } finally {
        ocupado($('btnRegistro'), $('registroSpinner'), $('registroTexto'), false, '', 'Crear cuenta');
      }
    });

    // Paso 2: onboarding
    $('onboardingForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = $('onboardingMensaje');
      mensaje(msg, '');
      if (!e.target.reportValidity()) return;

      const userId = sessionStorage.getItem(SESSION_KEY);
      if (!userId) {
        mensaje(msg, 'Tu sesión de registro expiró. Inicia sesión para continuar.');
        mostrarVista('login-container');
        return;
      }

      ocupado($('btnOnboarding'), $('onboardingSpinner'), $('onboardingTexto'), true, 'Guardando...', 'Guardar y continuar');
      try {
        await window.VitalfitApi.updateOnboarding(userId, {
          weightKg: Number($('weightKg').value),
          heightCm: Number($('heightCm').value),
          fitnessGoal: $('fitnessGoal').value
        });
        window.location.href = 'ejercicio.html';
      } catch (err) {
        mensaje(msg, err.message);
      } finally {
        ocupado($('btnOnboarding'), $('onboardingSpinner'), $('onboardingTexto'), false, '', 'Guardar y continuar');
      }
    });

    // Aviso de cookies: se recuerda la aceptación en este navegador (dato técnico, no personal)
    const banner = $('cookie-banner');
    try {
      banner.hidden = localStorage.getItem(COOKIE_KEY) === 'si';
    } catch (_) {
      banner.hidden = false;
    }
    $('btn-cookie-ok').addEventListener('click', () => {
      try { localStorage.setItem(COOKIE_KEY, 'si'); } catch (_) { /* navegador sin almacenamiento */ }
      banner.hidden = true;
    });
  });
})();
