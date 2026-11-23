/* =========================================================
   resultados.js - Integrante 4 (Motor de Riesgo y Reportes)
   HU-012 Semáforo | HU-013 Dashboard | HU-014 PDF
   HU-024 Mapa SVG | HU-029 Copiar enlace
   Sin backend: lee la evaluación guardada en localStorage
   (la misma clave que usa evaluacion.js).
   ========================================================= */
(function () {
  'use strict';

  /* ---------- 1. Configuración del motor (HU-012 CA01) ---------- */
  var STORAGE_KEY = 'muroseguro_evaluacion';
  var PASOS_TOTALES = 4;
  var MAX_HISTORIAL = 20;

  // Suma ponderada: clave -> puntos + texto visible
  var PESOS = {
    columna:           { pts: 5, label: 'Daño ubicado en columnas' },
    desplome:          { pts: 5, label: 'Desplome o inclinación' },
    muro:              { pts: 4, label: 'Daño ubicado en muros' },
    losa:              { pts: 3, label: 'Daño ubicado en el techo o losa' },
    grietas:           { pts: 3, label: 'Grietas o fisuras visibles' },
    terreno_humedo:    { pts: 3, label: 'Terreno blando (relleno o humedad)' },
    huaico:            { pts: 3, label: 'Exposición a huaicos' },
    terreno_inclinado: { pts: 2, label: 'Terreno en ladera (inclinado)' },
    humedad:           { pts: 2, label: 'Humedad en la vivienda' },
    humedad_base:      { pts: 2, label: 'Humedad en la base de los muros' },
    lluvia:            { pts: 1, label: 'Exposición a lluvia' },
    viento:            { pts: 1, label: 'Exposición a viento' }
  };

  var PUNTAJE_MAX_ESCALA = 20; // 100% de la barra
  var UMBRAL_AMARILLO = 6;     // 0-5 verde | 6-12 amarillo | 13+ rojo
  var UMBRAL_ROJO = 13;

  var NIVELES = {
    verde: {
      titulo: 'Riesgo Bajo',
      desc: 'No se detectaron señales visibles de alta vulnerabilidad. Mantén el monitoreo periódico.',
      acciones: [
        'Revisa muros y columnas cada 6 meses.',
        'Mantén limpios los drenajes y canaletas.',
        'No hagas ampliaciones sin asesoría técnica.'
      ]
    },
    amarillo: {
      titulo: 'Riesgo Medio',
      desc: 'Hay señales que conviene vigilar. Se recomienda consultar a un profesional para confirmar.',
      acciones: [
        'Fotografía y mide las grietas para ver si crecen.',
        'Programa una inspección con un ingeniero civil colegiado.',
        'Evita añadir pisos o cargas hasta recibir orientación.',
        'Repara filtraciones de agua en techos y muros.'
      ]
    },
    rojo: {
      titulo: 'Riesgo Alto',
      desc: 'Se detectaron varias señales de vulnerabilidad importante. Busca a un especialista cuanto antes.',
      acciones: []
    }
  };

  // Datos de prueba solo para el equipo (se activan con ?demo=rojo | amarillo | verde)
  var DEMOS = {
    rojo:     ['columna', 'desplome', 'terreno_humedo', 'grietas'],
    amarillo: ['losa', 'lluvia', 'terreno_inclinado', 'humedad'],
    verde:    ['lluvia']
  };

  // Datos de prueba del mapa (HU-024): distritos de Lima, valores ilustrativos
  var DISTRITOS = {
    'comas':                   { nombre: 'Comas',                   riesgo: 'medio', viviendas: 380, pctAlto: 25 },
    'rimac':                   { nombre: 'Rímac',                   riesgo: 'alto',  viviendas: 310, pctAlto: 38 },
    'san-juan-de-lurigancho':  { nombre: 'San Juan de Lurigancho',  riesgo: 'alto',  viviendas: 620, pctAlto: 44 },
    'lima-cercado':            { nombre: 'Lima (Cercado)',          riesgo: 'medio', viviendas: 290, pctAlto: 21 },
    'miraflores':              { nombre: 'Miraflores',              riesgo: 'bajo',  viviendas: 150, pctAlto: 7 },
    'ate':                     { nombre: 'Ate',                     riesgo: 'medio', viviendas: 410, pctAlto: 26 },
    'villa-el-salvador':       { nombre: 'Villa El Salvador',       riesgo: 'alto',  viviendas: 470, pctAlto: 40 },
    'san-juan-de-miraflores':  { nombre: 'San Juan de Miraflores',  riesgo: 'medio', viviendas: 360, pctAlto: 29 },
    'villa-maria-del-triunfo': { nombre: 'Villa María del Triunfo', riesgo: 'alto',  viviendas: 450, pctAlto: 42 }
  };
  var TEXTO_RIESGO = { bajo: 'Riesgo bajo', medio: 'Riesgo medio', alto: 'Riesgo alto' };
  var COLOR_PUNTO = { bajo: 'punto-verde', medio: 'punto-amarillo', alto: 'punto-rojo' };

  /* ---------- 2. Utilidades ---------- */
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  function crear(tag, clase, texto) {
    var el = document.createElement(tag);
    if (clase) el.className = clase;
    if (texto !== undefined) el.textContent = texto;
    return el;
  }

  function leerStorage() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  // Solo se aceptan claves conocidas (evita inyección desde la URL)
  function limpiarFactores(lista) {
    var vistos = {};
    return (Array.isArray(lista) ? lista : []).map(function (f) {
      return String(f).toLowerCase().trim();
    }).filter(function (f) {
      if (!PESOS.hasOwnProperty(f) || vistos[f]) return false;
      vistos[f] = true;
      return true;
    });
  }

  /* ---------- 3. Origen de datos ---------- */
  // Traduce lo que guarda evaluacion.js (paso1, paso2...) a factores de riesgo
  function factoresDeEvaluacion(a) {
    var p1 = a.paso1 || {};
    var p2 = a.paso2 || {};
    var f = [];

    if (p1.terreno === 'ladera') f.push('terreno_inclinado');
    if (p1.terreno === 'blando') f.push('terreno_humedo');

    (Array.isArray(p1.clima) ? p1.clima : []).forEach(function (c) {
      if (c === 'lluvia' || c === 'viento') f.push(c);
    });
    (Array.isArray(p1.patologias) ? p1.patologias : []).forEach(function (p) {
      f.push(p); // grietas | humedad | desplome
    });
    if (p1.humedadBase === 'si') f.push('humedad_base');

    var zonas = { techo: 'losa', muros: 'muro', columnas: 'columna' };
    if (zonas[p2.zona]) f.push(zonas[p2.zona]);

    return limpiarFactores(f);
  }

  // Evaluación actual guardada por evaluacion.js
  // -> { estado: 'ok' | 'vacio' | 'incompleto', entrada?, paso? }
  function leerEvaluacionActual() {
    var a = leerStorage();
    if (!a || typeof a !== 'object' || (!a.paso1 && !a.pasoCompletado)) {
      return { estado: 'vacio' };
    }
    var paso = Number(a.pasoCompletado) || 0;
    if (paso < PASOS_TOTALES || !a.paso1) {
      return { estado: 'incompleto', paso: paso };
    }

    var detalle = [];
    if (a.paso1.terrenoEtiqueta) detalle.push('Terreno: ' + a.paso1.terrenoEtiqueta);
    if (a.paso2 && a.paso2.zonaEtiqueta) detalle.push('Zona del daño: ' + a.paso2.zonaEtiqueta);

    var fecha = (a.paso4 && a.paso4.guardadoEn) || new Date().toISOString();
    return {
      estado: 'ok',
      entrada: {
        id: String(fecha),
        fecha: fecha,
        factores: factoresDeEvaluacion(a),
        detalle: detalle
      }
    };
  }

  /* ---------- Historial de resultados (por usuario) ---------- */
  function claveHistorial() {
    var usuario = 'demo';
    try { usuario = localStorage.getItem('ms_usuario_activo') || 'demo'; } catch (e) { /* sin storage */ }
    return 'muroseguro_historial_' + usuario;
  }

  function leerHistorial() {
    var lista;
    try { lista = JSON.parse(localStorage.getItem(claveHistorial())); } catch (e) { lista = null; }
    if (!Array.isArray(lista)) return [];
    return lista.filter(function (e) {
      return e && typeof e === 'object' && e.id;
    }).map(function (e) {
      return {
        id: String(e.id),
        fecha: e.fecha,
        factores: limpiarFactores(e.factores),
        detalle: (Array.isArray(e.detalle) ? e.detalle : []).map(String)
      };
    });
  }

  function guardarEnHistorial(entrada) {
    var lista = leerHistorial().filter(function (e) { return e.id !== entrada.id; });
    lista.unshift(entrada); // la más reciente primero
    try {
      localStorage.setItem(claveHistorial(), JSON.stringify(lista.slice(0, MAX_HISTORIAL)));
    } catch (e) { /* sin storage: igual se muestra en pantalla */ }
    return leerHistorial();
  }

  /* ---------- 4. Motor de riesgo (HU-012) ---------- */
  function calcular(factores) {
    var puntaje = factores.reduce(function (acc, k) { return acc + PESOS[k].pts; }, 0);
    var nivel = 'verde';
    if (puntaje >= UMBRAL_ROJO) nivel = 'rojo';
    else if (puntaje >= UMBRAL_AMARILLO) nivel = 'amarillo';
    return { puntaje: puntaje, nivel: nivel };
  }

  /* ---------- 5. Render del dashboard (HU-013) ---------- */
  function renderResultado(datos, res) {
    var info = NIVELES[res.nivel];
    var card = $('#card-semaforo');

    card.classList.remove('nivel-verde', 'nivel-amarillo', 'nivel-rojo');
    card.classList.add('nivel-' + res.nivel);

    $$('.lampara').forEach(function (l) {
      l.classList.toggle('activa', l.getAttribute('data-lampara') === res.nivel);
    });
    $('#semaforo-visual').setAttribute('aria-label', 'Semáforo en ' + res.nivel);

    $('#res-nivel').textContent = info.titulo;
    $('#res-desc').textContent = info.desc;
    $('#stat-puntaje').textContent = res.puntaje;
    $('#stat-factores').textContent = datos.factores.length;
    $('#stat-nivel').textContent = info.titulo.replace('Riesgo ', '');

    // Barra de progreso CSS
    var pct = Math.min(100, Math.round((res.puntaje / PUNTAJE_MAX_ESCALA) * 100));
    $('#barra-relleno').style.width = pct + '%';
    $('#barra').setAttribute('aria-valuenow', pct);
    $('#barra-valor').textContent = res.puntaje + ' pts';

    // Factores
    var ul = $('#lista-factores');
    ul.innerHTML = '';
    if (!datos.factores.length) {
      ul.appendChild(crear('li', '', 'No se registraron factores de riesgo.'));
    } else {
      datos.factores.forEach(function (k) {
        var li = crear('li');
        li.appendChild(crear('span', '', PESOS[k].label));
        li.appendChild(crear('strong', '', '+' + PESOS[k].pts + ' pts'));
        ul.appendChild(li);
      });
    }

    // Recomendaciones / botón de emergencia (HU-013 CA02)
    var slot = $('#slot-urgente');
    var cardReco = $('#card-recomendaciones');
    slot.innerHTML = '';

    if (res.nivel === 'rojo') {
      cardReco.hidden = true; // oculta consejos básicos
      var urgente = crear('section', 'card res-urgente');
      urgente.setAttribute('aria-labelledby', 'h-urgente');
      var h = crear('h2', 'res-h2', 'Acción urgente recomendada');
      h.id = 'h-urgente';
      urgente.appendChild(h);
      urgente.appendChild(crear('p', '',
        'Tu resultado indica un riesgo alto. Contacta lo antes posible a un ingeniero civil colegiado y evita permanecer en los ambientes más afectados.'));
      var a = crear('a', 'btn-primary res-urgente-btn', 'Contactar Ingeniero Urgente');
      a.href = 'directorio.html';
      urgente.appendChild(a);
      slot.appendChild(urgente);
    } else {
      cardReco.hidden = false;
      var lista = $('#lista-recomendaciones');
      lista.innerHTML = '';
      info.acciones.forEach(function (t) { lista.appendChild(crear('li', '', t)); });
    }
  }

  /* ---------- 6. Subtítulo, historial y estado vacío ---------- */
  function formatoFecha(iso) {
    var f = new Date(iso || Date.now());
    if (isNaN(f.getTime())) f = new Date();
    return f.toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  function renderSubtitulo(entrada) {
    var partes = entrada.detalle.slice();
    partes.push('Fecha: ' + formatoFecha(entrada.fecha));
    if (entrada.origen === 'demo') partes.push('Datos de prueba');
    if (entrada.origen === 'enlace') partes.push('Reporte compartido');
    $('#res-subtitulo').textContent = partes.join(' · ');
  }

  var CLASE_NIVEL = { verde: 'punto-verde', amarillo: 'punto-amarillo', rojo: 'punto-rojo' };

  function renderHistorial(lista, idSeleccionado, alElegir) {
    var card = $('#card-historial');
    var ul = $('#hist-lista');
    ul.innerHTML = '';

    if (lista.length < 2) { // con un solo resultado no hace falta lista
      card.hidden = true;
      return;
    }
    card.hidden = false;

    lista.forEach(function (e) {
      var res = calcular(e.factores);
      var li = crear('li');
      var btn = crear('button', 'hist-item' + (e.id === idSeleccionado ? ' seleccionado' : ''));
      btn.type = 'button';
      btn.setAttribute('aria-pressed', e.id === idSeleccionado ? 'true' : 'false');

      var cab = crear('span', 'hist-nivel');
      cab.appendChild(crear('span', 'punto ' + CLASE_NIVEL[res.nivel]));
      cab.appendChild(document.createTextNode(NIVELES[res.nivel].titulo));
      btn.appendChild(cab);
      btn.appendChild(crear('span', 'hist-fecha', formatoFecha(e.fecha)));
      btn.appendChild(crear('span', 'hist-pts', res.puntaje + ' pts'));

      btn.addEventListener('click', function () { alElegir(e); });
      li.appendChild(btn);
      ul.appendChild(li);
    });
  }

  // tipo: 'vacio' | 'incompleto' | 'pendiente'
  function renderVacio(estado) {
    var sub = $('#res-subtitulo');
    var texto = $('#vacio-texto');
    var boton = $('#vacio-boton');

    if (estado.estado === 'incompleto') {
      sub.textContent = 'Tu evaluación está incompleta (paso ' + estado.paso + ' de ' + PASOS_TOTALES + ').';
      texto.textContent = 'Termina los ' + PASOS_TOTALES + ' pasos de la evaluación para ver tu semáforo de riesgo.';
      boton.textContent = 'Continuar evaluación';
      boton.href = 'evaluacion.html';
    } else if (estado.estado === 'pendiente') {
      sub.textContent = 'Tu evaluación terminó y está lista para mostrarse.';
      texto.textContent = 'Revisa tu resultado: antes verás un aviso con los límites del diagnóstico.';
      boton.textContent = 'Ver mi resultado';
      boton.href = 'resultados.html?desde=evaluacion';
    } else {
      sub.textContent = 'Todavía no hay una evaluación registrada.';
      texto.textContent = 'Completa la evaluación de tu vivienda (terreno, zona del daño, guía visual y evidencia) para ver tu semáforo de riesgo.';
      boton.textContent = 'Ir a Evaluar';
      boton.href = 'evaluacion.html';
    }
    $('#estado-vacio').hidden = false;
  }

  /* ---------- 7. Modal de aceptación (HU-012 CA03) ---------- */
  function iniciarModal(alAceptar) {
    var dlg = $('#modal-limites');
    var chk = $('#acepto-limites');
    var btn = $('#btn-aceptar');

    chk.checked = false;
    btn.disabled = true;

    chk.addEventListener('change', function () { btn.disabled = !chk.checked; });

    // No se puede cerrar con Esc: la aceptación es obligatoria
    dlg.addEventListener('cancel', function (e) { e.preventDefault(); });

    btn.addEventListener('click', function () {
      if (!chk.checked) return;
      if (typeof dlg.close === 'function') dlg.close();
      else dlg.removeAttribute('open');
      alAceptar();
    });

    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
    chk.focus();
  }

  /* ---------- 8. Descargar PDF (HU-014) ---------- */
  function iniciarDescarga() {
    $('#btn-descargar').addEventListener('click', function () {
      window.print();
    });
  }

  /* ---------- 9. Copiar enlace (HU-029) ---------- */
  var timerCopiar = null;

  function urlCompartible(entrada) {
    var base = window.location.origin + window.location.pathname;
    if (window.location.protocol === 'file:') base = window.location.href.split(/[?#]/)[0];
    return base + '?f=' + encodeURIComponent(entrada.factores.join(','));
  }

  function copiarFallback(texto) {
    var ta = document.createElement('textarea');
    ta.value = texto;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  function iniciarCopiar(obtenerEntrada) {
    var btn = $('#btn-copiar');
    var txt = $('#btn-copiar-texto');
    var estado = $('#copiar-estado');
    var original = txt.textContent;

    function exito() {
      txt.textContent = '¡Copiado!';
      estado.textContent = 'Enlace copiado al portapapeles.';
      clearTimeout(timerCopiar);
      timerCopiar = setTimeout(function () {
        txt.textContent = original;
        estado.textContent = '';
      }, 2000);
    }

    function fallo() {
      estado.textContent = 'No se pudo copiar. Copia la dirección desde la barra del navegador.';
    }

    btn.addEventListener('click', function () {
      var url = urlCompartible(obtenerEntrada());
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(exito).catch(function () {
          if (copiarFallback(url)) exito(); else fallo();
        });
      } else if (copiarFallback(url)) {
        exito();
      } else {
        fallo();
      }
    });
  }

  /* ---------- 10. Mapa SVG (HU-024) ---------- */
  function iniciarMapa() {
    var zonas = $$('.zona');
    var select = $('#select-distrito');
    var info = $('#mapa-info');

    // Colorea zonas, etiqueta para lectores de pantalla y llena el select
    zonas.forEach(function (z) {
      var d = DISTRITOS[z.getAttribute('data-id')];
      if (!d) return;
      z.classList.add('zona-' + d.riesgo);
      z.setAttribute('aria-label', d.nombre + ', ' + TEXTO_RIESGO[d.riesgo]);

      var op = document.createElement('option');
      op.value = z.getAttribute('data-id');
      op.textContent = d.nombre;
      select.appendChild(op);
    });

    function seleccionar(id) {
      var d = DISTRITOS[id];
      if (!d) return;

      zonas.forEach(function (z) {
        z.classList.toggle('seleccionada', z.getAttribute('data-id') === id);
      });
      select.value = id;

      info.innerHTML = '';
      var p1 = crear('p');
      p1.appendChild(crear('strong', '', d.nombre));
      info.appendChild(p1);

      var p2 = crear('p');
      var badge = crear('span', 'insignia');
      badge.appendChild(crear('span', 'punto ' + COLOR_PUNTO[d.riesgo]));
      badge.appendChild(document.createTextNode(TEXTO_RIESGO[d.riesgo]));
      p2.appendChild(badge);
      info.appendChild(p2);

      info.appendChild(crear('p', '',
        d.viviendas + ' viviendas evaluadas · ' + d.pctAlto + '% con riesgo alto (datos de prueba).'));
    }

    zonas.forEach(function (z) {
      var id = z.getAttribute('data-id');
      z.addEventListener('click', function () { seleccionar(id); });
      z.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          seleccionar(id);
        }
      });
    });

    select.addEventListener('change', function () {
      if (select.value) seleccionar(select.value);
    });
  }

  /* ---------- 11. Arranque ---------- */
  var actual = null; // entrada que se está mostrando

  function mostrar(entrada, historial) {
    actual = entrada;
    renderSubtitulo(entrada);
    renderResultado(entrada, calcular(entrada.factores));
    $('#panel-resultados').hidden = false;
    renderHistorial(historial || [], entrada.id, function (e) {
      e.origen = 'historial';
      mostrar(e, historial);
    });
  }

  function limpiarUrl() {
    try { window.history.replaceState({}, '', window.location.pathname); } catch (e) { /* file:// */ }
  }

  function init() {
    // El mapa es información zonal: siempre disponible
    iniciarMapa();
    iniciarDescarga();
    iniciarCopiar(function () { return actual; });

    var params = new URLSearchParams(window.location.search);
    var f = params.get('f');
    var demo = params.get('demo');
    var vieneDeEvaluacion = params.get('desde') === 'evaluacion';

    // A) Enlace compartido (HU-029) o datos de prueba: modal y un solo resultado
    if (f !== null || (demo && DEMOS.hasOwnProperty(demo))) {
      var entrada = f !== null
        ? { id: 'enlace', fecha: null, factores: limpiarFactores(f.split(',')), detalle: [], origen: 'enlace' }
        : { id: 'demo', fecha: null, factores: DEMOS[demo].slice(), detalle: [], origen: 'demo' };
      renderSubtitulo(entrada);
      iniciarModal(function () {
        mostrar(entrada, []);
        $('#titulo-pagina').focus();
      });
      return;
    }

    var historial = leerHistorial();
    var evaluacion = leerEvaluacionActual();

    // B) Llega desde Evaluar: modal obligatorio y se guarda en el historial
    if (vieneDeEvaluacion) {
      if (evaluacion.estado !== 'ok') {
        limpiarUrl();
        renderVacio(evaluacion);
        return;
      }
      var nueva = evaluacion.entrada;
      var yaAceptada = historial.some(function (e) { return e.id === nueva.id; });

      if (yaAceptada) { // ya vio el aviso con esta misma evaluación (p. ej. recarga)
        limpiarUrl();
        mostrar(historial.filter(function (e) { return e.id === nueva.id; })[0], historial);
        return;
      }
      renderSubtitulo(nueva);
      iniciarModal(function () {
        var lista = guardarEnHistorial(nueva);
        limpiarUrl(); // así, al recargar, el modal no vuelve a saltar
        mostrar(nueva, lista);
        $('#titulo-pagina').focus();
      });
      return;
    }

    // C) Llega desde Perfil, Inicio, el menú, etc.: sin modal, historial directo
    if (historial.length) {
      mostrar(historial[0], historial);
      return;
    }

    // Sin historial: evaluación terminada pero aún no vista / incompleta / vacío
    renderVacio(evaluacion.estado === 'ok' ? { estado: 'pendiente' } : evaluacion);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
