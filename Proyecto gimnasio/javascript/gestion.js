(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const STORAGE_KEY = "vitalfit_gestion_demo_v1";
  const emptyData = () => ({ trainers: [], equipment: [], notices: [
    { id: makeId(), type: "Clase reservada", message: "Recuerda llegar 10 minutos antes de tu próxima clase." },
    { id: makeId(), type: "Membresía por vencer", message: "Aviso de ejemplo: revisa la fecha de renovación de tu membresía." }
  ], assessments: [], waitlist: [], chat: [] });
  function makeId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function readData() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return saved && typeof saved === "object" ? { ...emptyData(), ...saved } : emptyData();
    } catch { return emptyData(); }
  }
  let data = readData();
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    catch { alert("No se pudo guardar en este navegador. Comprueba el almacenamiento disponible."); }
    renderAll();
  }
  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch]));
  }
  function formObject(form) { return Object.fromEntries(new FormData(form).entries()); }
  function emptyToggle(id, hasItems) { const el = $("#" + id); if (el) el.hidden = hasItems; }
  function renderTrainers() {
    const body = $("#trainerRows");
    body.innerHTML = data.trainers.map(t => `<tr><td>${escapeHTML(t.name)}</td><td>${escapeHTML(t.specialty)}</td><td>${escapeHTML(t.schedule)}</td><td>${escapeHTML(t.client || "Sin asignar")}</td><td><button class="small-action" data-delete="trainers" data-id="${t.id}">Eliminar</button></td></tr>`).join("");
    emptyToggle("trainerEmpty", data.trainers.length > 0);
  }
  function renderEquipment() {
    const body = $("#equipmentRows");
    body.innerHTML = data.equipment.map(e => {
      const cls = e.status === "Disponible" ? "" : e.status === "Mantenimiento" ? "maintenance" : "out";
      return `<tr><td>${escapeHTML(e.name)}</td><td>${escapeHTML(e.location)}</td><td><span class="status-tag ${cls}">${escapeHTML(e.status)}</span></td><td>${escapeHTML(e.review || "Sin fecha")}</td><td><button class="small-action" data-delete="equipment" data-id="${e.id}">Eliminar</button></td></tr>`;
    }).join("");
    emptyToggle("equipmentEmpty", data.equipment.length > 0);
  }
  function renderNotices() {
    $("#noticeList").innerHTML = data.notices.map(n => `<article class="notice-item"><div><strong>${escapeHTML(n.type)}</strong><p>${escapeHTML(n.message)}</p></div><button class="small-action" data-delete="notices" data-id="${n.id}" aria-label="Eliminar aviso">Eliminar</button></article>`).join("") || '<p class="empty-message">No hay avisos. Puedes crear uno con el formulario.</p>';
  }
  function renderAssessments() {
    $("#assessmentList").innerHTML = data.assessments.map(a => `<article class="assessment-card"><h3>${escapeHTML(a.member)}</h3><p><b>Objetivo:</b> ${escapeHTML(a.goal)}</p><p><b>Nivel:</b> ${escapeHTML(a.level)}</p><p><b>Sesiones/semana:</b> ${escapeHTML(a.sessions)}</p><p>${escapeHTML(a.notes || "Sin observaciones")}</p><button class="small-action" data-delete="assessments" data-id="${a.id}">Eliminar</button></article>`).join("");
  }
  function renderWaitlist() {
    $("#waitRows").innerHTML = data.waitlist.map(w => `<tr><td>${escapeHTML(w.name)}</td><td>${escapeHTML(w.className)}</td><td>${escapeHTML(w.date)}</td><td><button class="small-action" data-delete="waitlist" data-id="${w.id}">Eliminar</button></td></tr>`).join("");
    emptyToggle("waitEmpty", data.waitlist.length > 0);
  }
  function renderChat() {
    const box = $("#chatMessages");
    const initial = '<div class="chat-bubble support">¡Hola! 👋 Escribe tu consulta. Este chat es una demostración y no envía mensajes al personal.</div>';
    box.innerHTML = initial + data.chat.map(m => `<div class="chat-bubble ${m.from === "user" ? "user" : "support"}">${escapeHTML(m.message)}</div>`).join("");
    box.scrollTop = box.scrollHeight;
  }
  function renderStats() {
    $("#trainerCount").textContent = data.trainers.length;
    $("#equipmentCount").textContent = data.equipment.length;
    $("#noticeCount").textContent = data.notices.length;
    $("#waitCount").textContent = data.waitlist.length;
  }
  function renderAll() { renderTrainers(); renderEquipment(); renderNotices(); renderAssessments(); renderWaitlist(); renderChat(); renderStats(); }
  function activatePanel(target) {
    $$(".management-tab").forEach(btn => btn.classList.toggle("active", btn.dataset.target === target));
    $$(".management-panel").forEach(panel => panel.classList.toggle("active", panel.id === "panel-" + target));
  }
  $$(".management-tab").forEach(btn => btn.addEventListener("click", () => activatePanel(btn.dataset.target)));
  $$(".admin-action").forEach(btn => btn.addEventListener("click", () => {
    activatePanel(btn.dataset.target);
    $(".management-tabs").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }));
  $("#trainerForm").addEventListener("submit", e => {
    e.preventDefault(); data.trainers.push({ ...formObject(e.currentTarget), id: makeId() }); e.currentTarget.reset(); save();
  });
  $("#equipmentForm").addEventListener("submit", e => {
    e.preventDefault(); data.equipment.push({ ...formObject(e.currentTarget), id: makeId() }); e.currentTarget.reset(); save();
  });
  $("#noticeForm").addEventListener("submit", e => {
    e.preventDefault(); data.notices.unshift({ ...formObject(e.currentTarget), id: makeId() }); e.currentTarget.reset(); save();
  });
  $("#assessmentForm").addEventListener("submit", e => {
    e.preventDefault(); data.assessments.unshift({ ...formObject(e.currentTarget), id: makeId() }); e.currentTarget.reset(); save();
  });
  $("#waitForm").addEventListener("submit", e => {
    e.preventDefault(); data.waitlist.push({ ...formObject(e.currentTarget), id: makeId() }); e.currentTarget.reset(); save();
  });
  $("#chatForm").addEventListener("submit", e => {
    e.preventDefault(); const form = e.currentTarget; const values = formObject(form);
    data.chat.push({ message: values.message, from: "user" });
    data.chat.push({ message: "Gracias por escribir a VitalFit. Esta respuesta es automática de demostración; el equipo podrá responder cuando se integre el servidor.", from: "support" });
    form.reset(); save();
  });
  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-delete]");
    if (!btn) return;
    const group = btn.dataset.delete, id = btn.dataset.id;
    if (Array.isArray(data[group])) { data[group] = data[group].filter(item => item.id !== id); save(); }
  });
  $("#downloadReport").addEventListener("click", () => {
    const rows = [["Indicador", "Valor", "Tipo"], ["Ingresos del mes", "2450000", "Demostración"], ["Nuevos miembros", "18", "Demostración"], ["Asistencias semanales", "96", "Demostración"], ["Entrenadores registrados", data.trainers.length, "Datos locales"], ["Equipos registrados", data.equipment.length, "Datos locales"]];
    const csv = "\uFEFF" + rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a"); a.href = url; a.download = "reporte-vitalfit-demo.csv"; a.click(); URL.revokeObjectURL(url);
  });
  $("#clearDemo").addEventListener("click", () => {
    if (!confirm("¿Seguro que quieres borrar los registros locales de esta página?")) return;
    data = { trainers: [], equipment: [], notices: [], assessments: [], waitlist: [], chat: [] };
    save();
  });
  const toggle = $("#menuToggle"), nav = $("#mainNav");
  if (toggle && nav) toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    toggle.textContent = open ? "✕" : "☰";
  });
  renderAll();
})();