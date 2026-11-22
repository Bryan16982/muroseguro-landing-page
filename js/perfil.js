(function () {
  'use strict';

  /* ---------- Utilidades ---------- */
  const $ = (id) => document.getElementById(id);
  const USER = (function () {
    try { return localStorage.getItem('ms_usuario_activo') || 'demo'; } catch (e) { return 'demo'; }
  })();
  const key = (name) => 'ms_' + name + '_' + USER;

  function load(name, fallback) {
    try { const v = localStorage.getItem(key(name)); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function save(name, value) {
    try { localStorage.setItem(key(name), JSON.stringify(value)); } catch (e) { /* sin storage */ }
  }
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  let toastTimer;
  function toast(msg, isError) {
    const t = $('toast');
    t.textContent = msg;
    t.className = 'toast show' + (isError ? ' error' : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.className = 'toast'; }, 3000);
  }

  /* Valida campos required: marca borde rojo en los inválidos */
  function validate(form) {
    let ok = true;
    form.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), select, textarea').forEach((f) => {
      const bad = !f.disabled && (!f.checkValidity() || (f.required && !f.value.trim()));
      f.classList.toggle('input-error', bad);
      f.setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (bad) ok = false;
    });
    return ok;
  }
  function clearOnInput(form) {
    form.addEventListener('input', (e) => {
      if (e.target.classList.contains('input-error') && e.target.checkValidity()) {
        e.target.classList.remove('input-error');
        e.target.setAttribute('aria-invalid', 'false');
      }
    });
  }
  function onlyDigits(input) {
    input.addEventListener('input', () => { input.value = input.value.replace(/\D/g, '').slice(0, 9); });
  }

  /* ---------- HU-005 Perfil ---------- */
  const fPerfil = $('form-perfil');
  const perfil = load('perfil', null);
  if (perfil) {
    $('p-nombres').value = perfil.nombres || '';
    $('p-apellidos').value = perfil.apellidos || '';
    $('p-telefono').value = perfil.telefono || '';
    if (perfil.nombres) $('saludo-nombre').textContent = perfil.nombres.split(' ')[0];
  }
  onlyDigits($('p-telefono'));
  clearOnInput(fPerfil);
  fPerfil.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate(fPerfil)) { toast('Revisa los campos marcados en rojo.', true); return; }
    const data = {
      nombres: $('p-nombres').value.trim(),
      apellidos: $('p-apellidos').value.trim(),
      telefono: $('p-telefono').value
    };
    save('perfil', data);
    $('saludo-nombre').textContent = data.nombres.split(' ')[0];
    toast('Perfil actualizado correctamente.');
  });

  /* ---------- HU-006 Viviendas ---------- */
  const UBIGEO = {
    'Lima': { 'Lima': ['Miraflores', 'Surquillo', 'Barranco', 'San Isidro'], 'Huaral': ['Huaral', 'Chancay'] },
    'Arequipa': { 'Arequipa': ['Cercado', 'Yanahuara', 'Cayma'], 'Camaná': ['Camaná', 'Samuel Pastor'] },
    'Cusco': { 'Cusco': ['Cusco', 'San Sebastián', 'Wanchaq'], 'Urubamba': ['Urubamba', 'Ollantaytambo'] }
  };
  const fViv = $('form-vivienda');
  const selDep = $('v-dep'), selProv = $('v-prov'), selDist = $('v-dist');
  let viviendas = load('viviendas', null);
  if (!viviendas) {
    viviendas = [
      { depto: 'Lima', prov: 'Lima', dist: 'Miraflores', dt: 'Sí' },
      { depto: 'Lima', prov: 'Lima', dist: 'Barranco', dt: 'No' }
    ];
    save('viviendas', viviendas);
  }

  function fillSelect(sel, items, placeholder) {
    sel.innerHTML = '';
    const first = el('option', '', placeholder);
    first.value = '';
    sel.appendChild(first);
    items.forEach((i) => { const o = el('option', '', i); o.value = i; sel.appendChild(o); });
    sel.disabled = items.length === 0;
  }
  fillSelect(selDep, Object.keys(UBIGEO), 'Seleccionar departamento');
  selDep.addEventListener('change', () => {
    fillSelect(selProv, selDep.value ? Object.keys(UBIGEO[selDep.value]) : [], 'Seleccionar provincia');
    fillSelect(selDist, [], 'Seleccionar distrito');
  });
  selProv.addEventListener('change', () => {
    fillSelect(selDist, selProv.value ? UBIGEO[selDep.value][selProv.value] : [], 'Seleccionar distrito');
  });

  function renderViviendas() {
    const ul = $('lista-viviendas');
    ul.innerHTML = '';
    viviendas.forEach((v) => {
      const li = el('li', 'viv-item');
      li.appendChild(el('span', 'viv-badge', 'Activa'));
      li.appendChild(el('h3', '', 'Vivienda en ' + v.dist));
      li.appendChild(el('p', '', 'Departamento: ' + v.depto));
      li.appendChild(el('p', '', 'Provincia: ' + v.prov));
      li.appendChild(el('p', '', 'Distrito: ' + v.dist));
      li.appendChild(el('p', '', 'Dirección técnica inicial: ' + v.dt));
      ul.appendChild(li);
    });
    $('viv-total').textContent = '(Total: ' + viviendas.length + ')';
  }
  renderViviendas();

  const btnNueva = $('btn-nueva-vivienda');
  function toggleFormViv(show) {
    fViv.hidden = !show;
    btnNueva.setAttribute('aria-expanded', String(show));
    if (show) selDep.focus();
  }
  btnNueva.addEventListener('click', () => toggleFormViv(fViv.hidden));
  $('btn-cancelar-viv').addEventListener('click', () => { fViv.reset(); toggleFormViv(false); });
  clearOnInput(fViv);
  fViv.addEventListener('change', (e) => {
    if (e.target.name === 'dt') $('v-dt').classList.remove('input-error');
  });
  fViv.addEventListener('submit', (e) => {
    e.preventDefault();
    const okCampos = validate(fViv);
    const dt = fViv.querySelector('input[name="dt"]:checked');
    $('v-dt').classList.toggle('input-error', !dt);
    if (!okCampos || !dt) { toast('Completa todos los campos obligatorios.', true); return; }
    viviendas.push({ depto: selDep.value, prov: selProv.value, dist: selDist.value, dt: dt.value });
    save('viviendas', viviendas); // asociado al usuario activo (clave con USER)
    renderViviendas();
    fViv.reset();
    fillSelect(selProv, [], 'Seleccionar provincia');
    fillSelect(selDist, [], 'Seleccionar distrito');
    toggleFormViv(false);
    toast('Vivienda guardada y asociada a tu cuenta.');
  });

  /* ---------- HU-021 Checklist ---------- */
  const checks = Array.from(document.querySelectorAll('#check-list input[type="checkbox"]'));
  const progreso = $('progreso');
  const estado = load('checklist', {});
  checks.forEach((c) => { c.checked = !!estado[c.value]; });

  function actualizarProgreso() {
    const marcados = checks.filter((c) => c.checked).length;
    const pct = Math.round((marcados / checks.length) * 100);
    progreso.value = pct;
    progreso.textContent = pct + '%';
    $('progreso-texto').textContent = pct + '% completado (' + marcados + ' de ' + checks.length + ' requisitos)';
    $('btn-confirmar').disabled = pct < 60;
  }
  checks.forEach((c) => c.addEventListener('change', () => {
    const s = {};
    checks.forEach((x) => { s[x.value] = x.checked; });
    save('checklist', s);
    actualizarProgreso();
  }));
  $('btn-confirmar').addEventListener('click', () => toast('Preparación confirmada.'));
  actualizarProgreso();

  /* ---------- HU-028 Bitácora ---------- */
  const fBit = $('form-bitacora');
  let hitos = load('bitacora', null);
  if (!hitos) {
    hitos = [
      { anio: 2015, desc: 'Construcción de 1er piso, muros de albañilería.' },
      { anio: 2018, desc: 'Ampliación a 2do piso sin supervisión técnica.' }
    ];
    save('bitacora', hitos);
  }
  function renderTimeline() {
    const ol = $('timeline');
    ol.innerHTML = '';
    hitos.slice().sort((a, b) => a.anio - b.anio).forEach((h) => {
      const li = el('li', 'tl-item');
      const card = el('div', 'tl-card');
      card.appendChild(el('p', 'tl-year', 'Año ' + h.anio));
      card.appendChild(el('p', '', h.desc));
      li.appendChild(card);
      ol.appendChild(li);
    });
  }
  renderTimeline();
  clearOnInput(fBit);
  fBit.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate(fBit)) { toast('Completa el año y la descripción.', true); return; }
    hitos.push({ anio: parseInt($('b-anio').value, 10), desc: $('b-desc').value.trim() });
    save('bitacora', hitos);
    renderTimeline();
    fBit.reset();
    toast('Hito añadido a la bitácora.');
  });

  /* ---------- HU-022 Soporte ---------- */
  const fSop = $('form-soporte');
  onlyDigits($('s-celular'));
  clearOnInput(fSop);
  fSop.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate(fSop)) { toast('Hay campos obligatorios vacíos o inválidos.', true); return; }
    const msgs = load('soporte', []);
    msgs.push({
      nombres: $('s-nombres').value.trim(),
      correo: $('s-correo').value.trim(),
      celular: $('s-celular').value,
      mensaje: $('s-mensaje').value.trim(),
      fecha: new Date().toISOString()
    });
    save('soporte', msgs);
    fSop.reset();
    toast('Mensaje enviado. Nuestro equipo revisará tu solicitud.');
  });
})();
