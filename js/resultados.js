/* =========================================================
   resultados.js - Integrante 4 (Motor de Riesgo y Reportes)
   HU-012 Semáforo | HU-013 Dashboard | HU-014 PDF
   HU-024 Mapa SVG | HU-029 Copiar enlace
   Sin backend: lee de localStorage o de datos de prueba.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- 1. Configuración del motor (HU-012 CA01) ---------- */
  var STORAGE_KEY = 'muroseguro_evaluacion';

  // Suma ponderada: clave -> puntos + texto visible
  var PESOS = {
    columna:           { pts: 5, label: 'Daños en columnas' },
    desplome:          { pts: 5, label: 'Desplome o inclinación de muros' },
    muro:              { pts: 4, label: 'Grietas en muros portantes' },
    grietas:           { pts: 4, label: 'Grietas visibles' },
    losa:              { pts: 3, label: 'Losa o techo con daños' },
    huaico:            { pts: 3, label: 'Exposición a huaicos' },
    terreno_humedo:    { pts: 3, label: 'Zona de alta humedad o inundación' },
    terreno_inclinado: { pts: 2, label: 'Terreno inclinado o con pendiente' },
    humedad:           { pts: 2, label: 'Humedad en muros' },
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

  // Datos de prueba (usar con ?demo=rojo | amarillo | verde)
  var DEMOS = {
    rojo:     ['columna', 'muro', 'huaico', 'grietas'],
    amarillo: ['losa', 'lluvia', 'terreno_inclinado', 'humedad'],
    verde:    ['lluvia']
  };

  // Datos de prueba del mapa (HU-024)
  var DISTRITOS = {
    'laredo':            { nombre: 'Laredo',             riesgo: 'bajo',  viviendas: 120, pctAlto: 8 },
    'alto-trujillo':     { nombre: 'Alto Trujillo',      riesgo: 'alto',  viviendas: 540, pctAlto: 46 },
    'moche':             { nombre: 'Moche',              riesgo: 'medio', viviendas: 210, pctAlto: 22 },
    'la-esperanza':      { nombre: 'La Esperanza',       riesgo: 'medio', viviendas: 480, pctAlto: 27 },
    'el-porvenir':       { nombre: 'El Porvenir',        riesgo: 'alto',  viviendas: 430, pctAlto: 41 },
    'florencia-de-mora': { nombre: 'Florencia de Mora',  riesgo: 'medio', viviendas: 190, pctAlto: 24 },
    'trujillo-centro':   { nombre: 'Trujillo (Centro)',  riesgo: 'bajo',  viviendas: 350, pctAlto: 10 },
    'huanchaco':         { nombre: 'Huanchaco',          riesgo: 'bajo',  viviendas: 160, pctAlto: 12 },
    'victor-larco':      { nombre: 'Víctor Larco',       riesgo: 'medio', viviendas: 260, pctAlto: 19 }
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
      if (!PESOS[f] || vistos[f]) return false;
      vistos[f] = true;
      return true;
    });
  }

  /* ---------- 3. Origen de datos ---------- */
  function obtenerDatos() {
    var params = new URLSearchParams(window.location.search);
    var f = params.get('f');
    var demo = params.get('demo');
    var guardado = leerStorage();

    if (f !== null) {
      return { factores: limpiarFactores(f.split(',')), vivienda: '', origen: 'enlace' };
    }
    if (demo && DEMOS[demo]) {
      return { factores: DEMOS[demo].slice(), vivienda: '', origen: 'demo' };
    }
    if (guardado && guardado.factores) {
      return {
        factores: limpiarFactores(guardado.factores),
        vivienda: typeof guardado.vivienda === 'string' ? guardado.vivienda : '',
        origen: 'evaluacion'
      };
    }
    return { factores: DEMOS.amarillo.slice(), vivienda: '', origen: 'demo' };
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

  /* ---------- 6. Subtítulo ---------- */
  function renderSubtitulo(datos) {
    var fecha = new Date().toLocaleDateString('es-PE', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
    var partes = [];
    if (datos.vivienda) partes.push('Vivienda: ' + datos.vivienda);
    partes.push('Fecha: ' + fecha);
    if (datos.origen === 'demo') partes.push('Datos de prueba');
    if (datos.origen === 'enlace') partes.push('Reporte compartido');
    $('#res-subtitulo').textContent = partes.join(' · ');
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

  function urlCompartible(datos) {
    var base = window.location.origin + window.location.pathname;
    if (window.location.protocol === 'file:') base = window.location.href.split(/[?#]/)[0];
    return base + '?f=' + encodeURIComponent(datos.factores.join(','));
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

  function iniciarCopiar(datos) {
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

    btn.addEventListener('click', function () {
      var url = urlCompartible(datos);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(exito).catch(function () {
          if (copiarFallback(url)) exito();
          else estado.textContent = 'No se pudo copiar. Copia la dirección desde la barra del navegador.';
        });
      } else if (copiarFallback(url)) {
        exito();
      } else {
        estado.textContent = 'No se pudo copiar. Copia la dirección desde la barra del navegador.';
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
      info.appendChild(crear('p', '', d.nombre));
      info.firstChild.innerHTML = '';
      info.firstChild.appendChild(crear('strong', '', d.nombre));

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
  function init() {
    // Marca la página activa en el sidebar sin modificar el HTML compartido
    var link = document.querySelector('.sidebar nav a[href="resultados.html"]');
    if (link) link.setAttribute('aria-current', 'page');

    var datos = obtenerDatos();
    var res = calcular(datos.factores); // se calcula, pero NO se muestra aún

    renderSubtitulo(datos);
    iniciarDescarga();
    iniciarCopiar(datos);
    iniciarMapa();

    // El color final solo se renderiza tras aceptar los límites
    iniciarModal(function () {
      renderResultado(datos, res);
      $('#panel-resultados').hidden = false;
      var h1 = $('#titulo-pagina');
      h1.focus();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
