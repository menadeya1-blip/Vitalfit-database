/* VitalFit - utilidades compartidas (modo demostración).
   IMPORTANTE: esta "guardia" solo redirige en el navegador; NO es seguridad real.
   La autenticación y la autorización deben hacerse en el servidor. */
(() => {
  'use strict';
  let sesion = null;
  try { sesion = JSON.parse(localStorage.getItem('vitalfit_demo_session')); } catch (e) { sesion = null; }
  if (!sesion) { window.location.replace('index.html'); return; }

  const KEY_FAV = 'vitalfit_favoritos';
  const leer = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || '[]'); return Array.isArray(v) ? v : []; } catch (e) { return []; } };
  const escapar = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function toast(mensaje) {
    let el = document.getElementById('vf-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'vf-toast';
      el.setAttribute('role', 'status');
      el.style.cssText = 'position:fixed;left:50%;bottom:28px;transform:translateX(-50%);background:#a3e635;color:#111;padding:12px 20px;border-radius:10px;font:600 .9rem Poppins,Arial,sans-serif;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,.45);max-width:90%;text-align:center;opacity:0;transition:opacity .2s';
      document.body.appendChild(el);
    }
    el.textContent = mensaje;
    el.style.opacity = '1';
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.opacity = '0'; }, 2400);
  }

  window.VF = {
    sesion, leer, escapar, toast,
    favoritos: () => leer(KEY_FAV),
    guardarFavoritos: (lista) => {
      try { localStorage.setItem(KEY_FAV, JSON.stringify(lista)); return true; }
      catch (e) { toast('No se pudo guardar en este navegador.'); return false; }
    }
  };
})();
