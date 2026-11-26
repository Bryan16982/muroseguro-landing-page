(function () {
  'use strict';

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
    try { localStorage.setItem(key(name), JSON.stringify(value)); } catch (e) {  }
  }
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  (function limpiarEjemplos() {
    const ejemplos = {
      viviendas: [
        { depto: 'Lima', prov: 'Lima', dist: 'Miraflores', dt: 'Sí' },
        { depto: 'Lima', prov: 'Lima', dist: 'Barranco', dt: 'No' }
      ],
      bitacora: [
        { anio: 2015, desc: 'Construcción de 1er piso, muros de albañilería.' },
        { anio: 2018, desc: 'Ampliación a 2do piso sin supervisión técnica.' }
      ]
    };
    Object.keys(ejemplos).forEach((n) => {
      try {
        if (localStorage.getItem(key(n)) === JSON.stringify(ejemplos[n])) localStorage.removeItem(key(n));
      } catch (e) {  }
    });
  })();

  const CLAVE_PREINSPECCION = 'muroseguro_preinspeccion';

  function leerPreinspeccion() {
    try {
      const raw = localStorage.getItem(CLAVE_PREINSPECCION);
      const obj = raw ? JSON.parse(raw) : null;
      return obj && obj.confirmado && obj.usuario === USER ? obj : null;
    } catch (e) {
      return null;
    }
  }

  let toastTimer;
  function toast(msg, isError) {
    const t = $('toast');
    t.textContent = msg;
    t.className = 'toast show' + (isError ? ' error' : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.className = 'toast'; }, 3000);
  }

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

  function obtenerCorreoSesion() {
    try {
      return sessionStorage.getItem('ms_sesion') || localStorage.getItem('ms_usuario_activo') || '';
    } catch (e) {
      return '';
    }
  }

  function setSaludo(nombres) {
    const primerNombre = (nombres || '').trim().split(/\s+/)[0];
    const texto = primerNombre || obtenerCorreoSesion();
    $('saludo-nombre').textContent = texto ? ', ' + texto : '';
  }

  const fPerfil = $('form-perfil');
  const perfil = load('perfil', null);
  if (perfil) {
    $('p-nombres').value = perfil.nombres || '';
    $('p-apellidos').value = perfil.apellidos || '';
    $('p-telefono').value = perfil.telefono || '';
  }
  setSaludo(perfil ? perfil.nombres : '');

  const tarjetaPerfil = $('perfil-guardado');
  const btnEditarPerfil = $('btn-editar-perfil');
  const btnCancelarPerfil = $('btn-cancelar-perfil');
  let datosPerfil = perfil;

  function valorOGuion(v) {
    return v && String(v).trim() ? v : '—';
  }

  function mostrarPerfil() {
    const hayPerfil = !!(datosPerfil && (datosPerfil.nombres || datosPerfil.apellidos || datosPerfil.telefono));
    fPerfil.hidden = hayPerfil;
    tarjetaPerfil.hidden = !hayPerfil;
    btnCancelarPerfil.hidden = true;
    if (hayPerfil) {
      $('pg-nombres').textContent = valorOGuion(datosPerfil.nombres);
      $('pg-apellidos').textContent = valorOGuion(datosPerfil.apellidos);
      $('pg-telefono').textContent = valorOGuion(datosPerfil.telefono);
    }
  }

  function editarPerfil() {
    $('p-nombres').value = datosPerfil.nombres || '';
    $('p-apellidos').value = datosPerfil.apellidos || '';
    $('p-telefono').value = datosPerfil.telefono || '';
    fPerfil.querySelectorAll('.input-error').forEach((f) => {
      f.classList.remove('input-error');
      f.setAttribute('aria-invalid', 'false');
    });
    fPerfil.hidden = false;
    tarjetaPerfil.hidden = true;
    btnCancelarPerfil.hidden = false;
    $('p-nombres').focus();
  }

  btnEditarPerfil.addEventListener('click', editarPerfil);
  btnCancelarPerfil.addEventListener('click', () => {
    mostrarPerfil();
    btnEditarPerfil.focus();
  });
  mostrarPerfil();
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
    setSaludo(data.nombres);
    datosPerfil = data;
    mostrarPerfil();
    btnEditarPerfil.focus();
    toast('Perfil actualizado correctamente.');
  });

  const UBIGEO = {
    'Lima': { 'Lima': ['Miraflores', 'Surquillo', 'Barranco', 'San Isidro'], 'Huaral': ['Huaral', 'Chancay'] },
    'Arequipa': { 'Arequipa': ['Cercado', 'Yanahuara', 'Cayma'], 'Camaná': ['Camaná', 'Samuel Pastor'] },
    'Cusco': { 'Cusco': ['Cusco', 'San Sebastián', 'Wanchaq'], 'Urubamba': ['Urubamba', 'Ollantaytambo'] }
  };
  const fViv = $('form-vivienda');
  const selDep = $('v-dep'), selProv = $('v-prov'), selDist = $('v-dist');
  let viviendas = load('viviendas', []);

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
    const pre = leerPreinspeccion();
    viviendas.forEach((v, i) => {
      const li = el('li', 'viv-item');
      li.appendChild(el('span', 'viv-badge', 'Activa'));
      if (pre) {
        li.appendChild(el('span', 'viv-badge viv-badge-listo', 'Listo para visita técnica (' + pre.cantidad + '/' + pre.total + ' documentos)'));
      }
      li.appendChild(el('h3', '', 'Vivienda en ' + v.dist));
      li.appendChild(el('p', '', 'Departamento: ' + v.depto));
      li.appendChild(el('p', '', 'Provincia: ' + v.prov));
      li.appendChild(el('p', '', 'Distrito: ' + v.dist));
      li.appendChild(el('p', '', 'Dirección técnica inicial: ' + v.dt));
      const btnEliminar = el('button', 'btn-secondary btn-eliminar', 'Eliminar');
      btnEliminar.type = 'button';
      btnEliminar.dataset.indice = String(i);
      btnEliminar.setAttribute('aria-label', 'Eliminar vivienda en ' + v.dist);
      li.appendChild(btnEliminar);
      ul.appendChild(li);
    });
    $('viv-total').textContent = '(Total: ' + viviendas.length + ')';
    $('viv-vacio').hidden = viviendas.length > 0;
  }
  renderViviendas();

  const dlg = $('dlg-eliminar');
  let indicePendiente = null;
  let botonOrigen = null;

  function eliminarPendiente() {
    if (indicePendiente === null) return;
    viviendas.splice(indicePendiente, 1);
    save('viviendas', viviendas);
    indicePendiente = null;
    renderViviendas();
    toast('Vivienda eliminada.');
  }

  $('lista-viviendas').addEventListener('click', (e) => {
    const b = e.target.closest('.btn-eliminar');
    if (!b) return;
    indicePendiente = Number(b.dataset.indice);
    botonOrigen = b;
    const v = viviendas[indicePendiente];
    const nombre = 'Vivienda en ' + v.dist;
    $('dlg-texto').textContent = '¿Estás seguro de que deseas eliminar «' + nombre + '»? Esta acción no se puede deshacer.';
    if (typeof dlg.showModal === 'function') {
      dlg.showModal();
      $('dlg-cancelar').focus();
    } else if (window.confirm('¿Eliminar «' + nombre + '»? Esta acción no se puede deshacer.')) {
      eliminarPendiente();
    }
  });

  $('dlg-confirmar').addEventListener('click', () => {
    eliminarPendiente();
    botonOrigen = null;
    dlg.close();
    $('btn-nueva-vivienda').focus();
  });
  $('dlg-cancelar').addEventListener('click', () => dlg.close());
  $('dlg-x').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => {
    indicePendiente = null;
    if (botonOrigen && document.body.contains(botonOrigen)) botonOrigen.focus();
    botonOrigen = null;
  });

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
    save('viviendas', viviendas);
    renderViviendas();
    fViv.reset();
    fillSelect(selProv, [], 'Seleccionar provincia');
    fillSelect(selDist, [], 'Seleccionar distrito');
    toggleFormViv(false);
    toast('Vivienda guardada y asociada a tu cuenta.');
  });

  const checks = Array.from(document.querySelectorAll('#check-list input[type="checkbox"]'));
  const obligatorios = checks.filter((c) => c.closest('.check-item').dataset.obligatorio === 'true');
  const progreso = $('progreso');
  const btnConfirmar = $('btn-confirmar');
  const panelExito = $('check-exito');
  const ayuda = $('check-ayuda');
  const estado = load('checklist', {});
  const adjuntos = load('checklist_adjuntos', {});
  checks.forEach((c) => { c.checked = !!estado[c.value]; });

  function textoDe(c) {
    return c.closest('label').querySelector('span').textContent.trim();
  }

  function guardarEstado() {
    const s = {};
    checks.forEach((x) => { s[x.value] = x.checked; });
    save('checklist', s);
  }

  function mostrarExito(pre) {
    if (!pre) { panelExito.hidden = true; return; }
    $('check-exito-texto').textContent = 'Listo para visita técnica (' + pre.cantidad + '/' + pre.total + ' documentos).';
    panelExito.hidden = false;
  }

  function actualizarProgreso() {
    const marcados = checks.filter((c) => c.checked).length;
    const pct = Math.round((marcados / checks.length) * 100);
    progreso.value = pct;
    progreso.textContent = pct + '%';
    $('progreso-texto').textContent = pct + '% completado (' + marcados + ' de ' + checks.length + ' requisitos)';
    const faltan = obligatorios.filter((c) => !c.checked).map(textoDe);
    btnConfirmar.disabled = faltan.length > 0;
    ayuda.textContent = faltan.length
      ? 'Para confirmar necesitas marcar los requisitos obligatorios: ' + faltan.join(' y ') + '.'
      : 'Ya cumples los requisitos obligatorios. Puedes confirmar tu preparación.';
  }

  function invalidarConfirmacion() {
    if (!leerPreinspeccion()) return;
    try { localStorage.removeItem(CLAVE_PREINSPECCION); } catch (e) { }
    mostrarExito(null);
    renderViviendas();
  }

  checks.forEach((c) => {
    const item = c.closest('.check-item');
    const input = item.querySelector('input[type="file"]');
    const btnAdjuntar = item.querySelector('.btn-adjuntar');
    const btnQuitar = item.querySelector('.btn-quitar');
    const info = item.querySelector('.adjunto-info');
    const nombreEl = item.querySelector('.adjunto-nombre');

    function pintarAdjunto() {
      const nombre = adjuntos[c.value];
      info.hidden = !nombre;
      btnQuitar.hidden = !nombre;
      nombreEl.textContent = nombre || '';
      btnAdjuntar.textContent = nombre ? 'Cambiar archivo' : 'Adjuntar (opcional)';
      btnAdjuntar.setAttribute('aria-label', (nombre ? 'Cambiar archivo de ' : 'Adjuntar archivo de ') + textoDe(c));
      btnQuitar.setAttribute('aria-label', 'Quitar archivo de ' + textoDe(c));
    }

    c.addEventListener('change', () => {
      guardarEstado();
      actualizarProgreso();
      invalidarConfirmacion();
    });

    btnAdjuntar.addEventListener('click', () => input.click());

    input.addEventListener('change', () => {
      const archivo = input.files && input.files[0];
      if (!archivo) return;
      adjuntos[c.value] = archivo.name;
      save('checklist_adjuntos', adjuntos);
      input.value = '';
      c.checked = true;
      guardarEstado();
      pintarAdjunto();
      actualizarProgreso();
      invalidarConfirmacion();
      toast('Archivo adjuntado: ' + archivo.name);
    });

    btnQuitar.addEventListener('click', () => {
      delete adjuntos[c.value];
      save('checklist_adjuntos', adjuntos);
      pintarAdjunto();
      invalidarConfirmacion();
      btnAdjuntar.focus();
    });

    pintarAdjunto();
  });

  btnConfirmar.addEventListener('click', () => {
    const marcados = checks.filter((c) => c.checked);
    const pre = {
      confirmado: true,
      usuario: USER,
      fecha: new Date().toISOString(),
      porcentaje: Math.round((marcados.length / checks.length) * 100),
      cantidad: marcados.length,
      total: checks.length,
      documentos: marcados.map(textoDe),
      adjuntos: {}
    };
    marcados.forEach((c) => { if (adjuntos[c.value]) pre.adjuntos[textoDe(c)] = adjuntos[c.value]; });
    try { localStorage.setItem(CLAVE_PREINSPECCION, JSON.stringify(pre)); } catch (e) { }
    mostrarExito(pre);
    renderViviendas();
    toast('Preparación confirmada.');
  });

  actualizarProgreso();
  mostrarExito(leerPreinspeccion());

  const fBit = $('form-bitacora');
  let hitos = load('bitacora', []);
  function renderTimeline() {
    const ol = $('timeline');
    ol.innerHTML = '';
    $('tl-vacio').hidden = hitos.length > 0;
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

  function iniciarDictado(idCampo) {
    const campo = $(idCampo);
    if (!campo) return;
    const grupo = campo.closest('.form-group');
    const form = campo.form;
    const Reconocimiento = window.SpeechRecognition || window.webkitSpeechRecognition;

    const caja = el('div', 'dictado');
    grupo.appendChild(caja);

    if (!Reconocimiento) {
      caja.appendChild(el('p', 'dictado-nota', 'Tu navegador no admite dictado por voz. Puedes escribir el texto con normalidad.'));
      return;
    }

    const btnMic = el('button', 'btn-secondary btn-mic');
    btnMic.type = 'button';
    btnMic.setAttribute('aria-pressed', 'false');
    btnMic.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/></svg><span>Dictar por voz</span>';
    const etiquetaMic = btnMic.querySelector('span');
    const estado = el('span', 'dictado-estado');
    estado.setAttribute('role', 'status');
    estado.setAttribute('aria-live', 'polite');

    const previa = el('div', 'dictado-previa');
    previa.hidden = true;
    const idPrevia = 'previa-' + idCampo;
    const lblPrevia = el('label', 'form-label', 'Vista previa del dictado (puedes editarla)');
    lblPrevia.setAttribute('for', idPrevia);
    const txtPrevia = el('textarea', 'form-textarea');
    txtPrevia.id = idPrevia;
    txtPrevia.rows = 3;
    const filaBtn = el('div', 'btn-row');
    const btnInsertar = el('button', 'btn-primary', 'Insertar en el campo');
    btnInsertar.type = 'button';
    const btnDescartar = el('button', 'btn-secondary', 'Descartar');
    btnDescartar.type = 'button';
    filaBtn.appendChild(btnInsertar);
    filaBtn.appendChild(btnDescartar);
    previa.appendChild(lblPrevia);
    previa.appendChild(txtPrevia);
    previa.appendChild(filaBtn);

    caja.appendChild(btnMic);
    caja.appendChild(estado);
    caja.appendChild(previa);

    const rec = new Reconocimiento();
    rec.lang = 'es-PE';
    rec.continuous = true;
    rec.interimResults = true;
    let escuchando = false;
    let base = '';
    let finales = '';

    function marcar(activo) {
      escuchando = activo;
      btnMic.setAttribute('aria-pressed', String(activo));
      etiquetaMic.textContent = activo ? 'Detener dictado' : 'Dictar por voz';
      estado.textContent = activo ? 'Escuchando… habla con claridad.' : '';
    }

    function detener() {
      if (escuchando) { try { rec.stop(); } catch (e) { marcar(false); } }
    }

    function cerrarPrevia() {
      detener();
      txtPrevia.value = '';
      previa.hidden = true;
    }

    rec.onresult = (ev) => {
      let provisional = '';
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const t = ev.results[i][0].transcript;
        if (ev.results[i].isFinal) finales += t; else provisional += t;
      }
      txtPrevia.value = (base + finales + provisional).replace(/\s+/g, ' ').trimStart();
    };
    rec.onend = () => {
      marcar(false);
      txtPrevia.value = txtPrevia.value.trim();
    };
    rec.onerror = (ev) => {
      marcar(false);
      const msgs = {
        'not-allowed': 'No se permitió el uso del micrófono. Actívalo en el navegador.',
        'service-not-allowed': 'No se permitió el uso del micrófono. Actívalo en el navegador.',
        'no-speech': 'No se detectó voz. Inténtalo de nuevo.',
        'audio-capture': 'No se encontró un micrófono disponible.',
        'network': 'El dictado necesita conexión a internet.'
      };
      estado.textContent = msgs[ev.error] || 'No se pudo dictar. Inténtalo de nuevo.';
    };

    btnMic.addEventListener('click', () => {
      if (escuchando) { detener(); return; }
      base = txtPrevia.value.trim() ? txtPrevia.value.trim() + ' ' : '';
      finales = '';
      previa.hidden = false;
      try {
        rec.start();
        marcar(true);
      } catch (e) {
        estado.textContent = 'No se pudo iniciar el dictado.';
      }
    });

    btnInsertar.addEventListener('click', () => {
      detener();
      const texto = txtPrevia.value.trim();
      if (!texto) { estado.textContent = 'No hay texto para insertar.'; return; }
      campo.value = campo.value.trim() ? campo.value.trim() + ' ' + texto : texto;
      campo.dispatchEvent(new Event('input', { bubbles: true }));
      cerrarPrevia();
      estado.textContent = '';
      campo.focus();
      toast('Texto insertado. Revísalo antes de enviar.');
    });

    btnDescartar.addEventListener('click', () => {
      cerrarPrevia();
      estado.textContent = '';
    });

    if (form) form.addEventListener('reset', () => { cerrarPrevia(); estado.textContent = ''; });
  }

  iniciarDictado('b-desc');
  iniciarDictado('s-mensaje');
})();
