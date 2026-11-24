/* js/evaluacion.js — Paso 1 del asistente MuroSeguro (HU-007 y HU-008) */
(() => {
  'use strict';

  const CLAVE_ALMACEN = 'muroseguro_evaluacion';
  const RESTAURAR_AL_CARGAR = false; 

  /* ---------- Datos de prueba / catálogo ---------- */
  const TERRENOS = [
    { valor: 'plano', etiqueta: 'Plano (Firme)' },
    { valor: 'ladera', etiqueta: 'Ladera (Inclinado)' },
    { valor: 'blando', etiqueta: 'Blando (Relleno o humedad)' }
  ];

  // Puntaje interno: nunca se muestra al usuario (HU-008 CA03)
  const PATOLOGIAS = [
    { valor: 'grietas', etiqueta: 'Grietas / Fisuras', puntaje: 3 },
    { valor: 'humedad', etiqueta: 'Humedad', puntaje: 2 },
    { valor: 'desplome', etiqueta: 'Desplome / Inclinación', puntaje: 5 }
  ];
  const PUNTAJE_HUMEDAD_BASE = 2; 

  const form = document.getElementById('form-paso-1');
  if (!form) return;

  const $ = (id) => document.getElementById(id);
  const cardTerreno = $('card-terreno');
  const errorTerreno = $('error-terreno');
  const cardAceptacion = $('card-aceptacion');
  const msgAceptacion = $('error-aceptacion');
  const chkAceptacion = $('aceptacion');
  const chkLluvia = $('clima-lluvia');
  const chkHumedad = $('patologia-humedad');
  const preguntaHumedad = $('pregunta-humedad');
  const btnSiguiente = $('btn-siguiente');
  const envoltorioSiguiente = $('siguiente-wrap');
  const estado = $('estado-formulario');
  const radiosTerreno = form.querySelectorAll('input[name="terreno"]');
  const sidebar = $('eval-sidebar');

  let intentoFallido = false;

  /* ---------- Utilidades ---------- */
  const marcados = (nombre) =>
    Array.from(form.querySelectorAll(`input[name="${nombre}"]:checked`)).map((i) => i.value);

  function anunciar(texto) {
    estado.textContent = '';
    setTimeout(() => { estado.textContent = texto; }, 50);
  }

  function leerAlmacen() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_ALMACEN)) || {};
    } catch (e) {
      return {};
    }
  }

  function toggleSidebar(mostrar) {
    if (!sidebar) return;
    sidebar.hidden = !mostrar;
    document.body.classList.toggle('eval-con-sidebar', mostrar);
  }

  /* ---------- HU-008: lógica condicional ---------- */
  function actualizarPreguntaCondicional() {
    if (chkLluvia.checked || chkHumedad.checked) {
      preguntaHumedad.classList.add('is-visible');    // display: flex
    } else {
      preguntaHumedad.classList.remove('is-visible'); // display: none
      form.querySelectorAll('input[name="humedad_base"]').forEach((r) => { r.checked = false; });
    }
  }

  /* ---------- Lectura y puntajes ---------- */
  function leerFormulario() {
    const visible = preguntaHumedad.classList.contains('is-visible');
    return {
      terreno: marcados('terreno')[0] || null,
      clima: marcados('clima'),
      patologias: marcados('patologia'),
      humedadBase: visible ? (marcados('humedad_base')[0] || null) : null,
      aceptacion: chkAceptacion.checked
    };
  }

  function calcularPuntajes(patologias, humedadBase) {
    const puntajes = {};
    PATOLOGIAS.forEach((p) => {
      if (patologias.includes(p.valor)) puntajes[p.valor] = p.puntaje;
    });
    if (humedadBase === 'si') puntajes.humedad_base = PUNTAJE_HUMEDAD_BASE;
    const total = Object.values(puntajes).reduce((suma, n) => suma + n, 0);
    return { puntajes, total };
  }

  /* ---------- HU-007: validación y estado del botón ---------- */
  function actualizarEstado() {
    actualizarPreguntaCondicional();

    const datos = leerFormulario();
    const faltaTerreno = !datos.terreno;
    const faltaAceptacion = !datos.aceptacion;

    // CA03: bloqueado hasta completar los campos obligatorios
    btnSiguiente.disabled = faltaTerreno || faltaAceptacion;

    // Aceptación obligatoria
    const errorAceptacion = intentoFallido && faltaAceptacion;
    msgAceptacion.hidden = !faltaAceptacion;
    cardAceptacion.classList.toggle('has-error', errorAceptacion);
    chkAceptacion.setAttribute('aria-invalid', String(errorAceptacion));

    // Condición del terreno
    const hayErrorTerreno = intentoFallido && faltaTerreno;
    cardTerreno.classList.toggle('has-error', hayErrorTerreno);
    errorTerreno.hidden = !hayErrorTerreno;

    return datos;
  }

  /* ---------- Guardado (CA02) ---------- */
  function guardarPaso1(datos) {
    const terreno = TERRENOS.find((t) => t.valor === datos.terreno);
    const { puntajes, total } = calcularPuntajes(datos.patologias, datos.humedadBase);

    const almacen = leerAlmacen();
    almacen.paso1 = {
      terreno: datos.terreno,
      terrenoEtiqueta: terreno ? terreno.etiqueta : null,
      clima: datos.clima,
      patologias: datos.patologias,
      humedadBase: datos.humedadBase,
      aceptacion: true,
      puntajes,
      puntajeTotal: total,
      guardadoEn: new Date().toISOString()
    };
    almacen.pasoCompletado = 1;

    try {
      localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(almacen));
      return true;
    } catch (e) {
      anunciar('No se pudieron guardar tus selecciones en el navegador. Revisa los permisos de almacenamiento.');
      return false;
    }
  }

  function restaurar() {
    const p1 = leerAlmacen().paso1;
    if (!p1) return;

    const marcar = (nombre, valor) => {
      const input = form.querySelector(`input[name="${nombre}"][value="${valor}"]`);
      if (input) input.checked = true;
    };

    if (p1.terreno) marcar('terreno', p1.terreno);
    (p1.clima || []).forEach((v) => marcar('clima', v));
    (p1.patologias || []).forEach((v) => marcar('patologia', v));
    actualizarPreguntaCondicional(); 
    if (p1.humedadBase) marcar('humedad_base', p1.humedadBase);
    chkAceptacion.checked = p1.aceptacion === true;
  }

  /* ---------- Transición al Paso 2 ---------- */
  function irAlPaso(numero) {
    const actual = $('paso-1');
    const destino = $(`paso-${numero}`);

    document.dispatchEvent(new CustomEvent('muroseguro:paso-completado', {
      detail: { paso: 1, siguiente: numero }
    }));

    if (destino) {
      actual.hidden = true;
      destino.hidden = false;
      toggleSidebar(numero > 1);
      window.scrollTo({ top: 0 });
      const titulo = destino.querySelector('h1, h2');
      if (titulo) {
        titulo.setAttribute('tabindex', '-1');
        titulo.focus();
      }
    } else {
      anunciar('Tus selecciones se guardaron. El Paso 2 estará disponible próximamente.');
    }
  }

  form.addEventListener('change', () => { actualizarEstado(); });

  envoltorioSiguiente.addEventListener('click', () => {
    if (!btnSiguiente.disabled) return;

    intentoFallido = true;
    const datos = actualizarEstado();

    const faltantes = [];
    if (!datos.terreno) faltantes.push('la condición del terreno');
    if (!datos.aceptacion) faltantes.push('la aceptación obligatoria');
    anunciar(`Falta completar ${faltantes.join(' y ')}.`);

    (datos.terreno ? chkAceptacion : radiosTerreno[0]).focus();
  });

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const datos = actualizarEstado();
    if (!datos.terreno || !datos.aceptacion) {
      intentoFallido = true;
      actualizarEstado();
      return;
    }

    if (guardarPaso1(datos)) irAlPaso(2);
  });

  /* ---------- Inicio ---------- */
  toggleSidebar(false);
  if (RESTAURAR_AL_CARGAR) restaurar();
  actualizarEstado();
})();


/* ==========================================================
   PASO 2 — Ubicación del daño (HU-009)
   ========================================================== */
(() => {
  'use strict';

  const CLAVE_ALMACEN = 'muroseguro_evaluacion';

  // CA03: el clic en una zona se traduce a una categoría de daño.
  const ZONAS = {
    techo:    { etiqueta: 'Techo',    categoria: 'Losa' },
    muros:    { etiqueta: 'Muros',    categoria: 'Muro portante' },
    columnas: { etiqueta: 'Columnas', categoria: 'Columna' }
  };

  const seccion = document.getElementById('paso-2');
  const form = document.getElementById('form-paso-2');
  if (!seccion || !form) return;

  const radios = Array.from(form.querySelectorAll('input[name="zona"]'));
  const zonasSvg = Array.from(seccion.querySelectorAll('.p2-zone'));
  const pildora = document.getElementById('p2-pildora');
  const pildoraTexto = document.getElementById('p2-pildora-texto');
  const btnContinuar = document.getElementById('p2-continuar');
  const ayuda = document.getElementById('p2-ayuda');
  const estado = document.getElementById('p2-estado');

  /* ---------- Utilidades ---------- */
  function anunciar(texto) {
    estado.textContent = '';
    setTimeout(() => { estado.textContent = texto; }, 50);
  }

  function leerAlmacen() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_ALMACEN)) || {};
    } catch (e) {
      return {};
    }
  }

  function seleccionar(zona) {
    const info = ZONAS[zona] || null;

    radios.forEach((r) => { r.checked = info !== null && r.value === zona; });

    zonasSvg.forEach((g) => {
      const activa = info !== null && g.dataset.zona === zona;
      g.classList.toggle('active', activa); // CA02
      g.setAttribute('aria-pressed', String(activa));
    });

    if (info) {
      pildora.classList.add('active');
      pildoraTexto.textContent = `Zona seleccionada: ${info.etiqueta}`;
      btnContinuar.disabled = false;
      ayuda.textContent = `${info.etiqueta} seleccionado. Puedes continuar.`;
      ayuda.classList.add('ready');
    } else {
      pildora.classList.remove('active');
      pildoraTexto.textContent = 'Selecciona una zona de la estructura';
      btnContinuar.disabled = true;
      ayuda.textContent = 'Selecciona una opción para habilitar el botón.';
      ayuda.classList.remove('ready');
    }
  }

  /* ---------- Guardado ---------- */
  function guardarPaso2(zona) {
    const info = ZONAS[zona];
    const almacen = leerAlmacen(); 

    almacen.paso2 = {
      zona,
      zonaEtiqueta: info.etiqueta,
      categoriaDano: info.categoria,
      guardadoEn: new Date().toISOString()
    };
    almacen.pasoCompletado = 2;

    try {
      localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(almacen));
      return true;
    } catch (e) {
      anunciar('No se pudo guardar tu selección en el navegador. Revisa los permisos de almacenamiento.');
      return false;
    }
  }

  /* ---------- Eventos ---------- */
  // Opciones de la derecha → croquis
  form.addEventListener('change', (evento) => {
    if (evento.target.name === 'zona') seleccionar(evento.target.value);
  });

  // Croquis → opciones de la derecha (clic o teclado)
  zonasSvg.forEach((g) => {
    g.addEventListener('click', () => seleccionar(g.dataset.zona));
    g.addEventListener('keydown', (evento) => {
      if (evento.key === 'Enter' || evento.key === ' ' || evento.key === 'Spacebar') {
        evento.preventDefault();
        seleccionar(g.dataset.zona);
      }
    });
  });

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const marcado = radios.find((r) => r.checked);
    const zona = marcado ? marcado.value : null;
    if (!zona || !ZONAS[zona]) {
      anunciar('Selecciona una zona de la estructura para continuar.');
      return;
    }

    if (!guardarPaso2(zona)) return;

    document.dispatchEvent(new CustomEvent('muroseguro:paso-completado', {
      detail: { paso: 2, siguiente: 3, zona, categoria: ZONAS[zona].categoria }
    }));

    const paso3 = document.getElementById('paso-3');
    if (paso3) {
      seccion.hidden = true;
      paso3.hidden = false;
      window.scrollTo({ top: 0 });
      const titulo = paso3.querySelector('h1, h2');
      if (titulo) {
        titulo.setAttribute('tabindex', '-1');
        titulo.focus();
      }
    } else {
      anunciar('Tu selección se guardó. El Paso 3 estará disponible próximamente.');
    }
  });

  /* ---------- Inicio: restaura la selección guardada ---------- */
  const guardado = leerAlmacen().paso2;
  seleccionar(guardado && ZONAS[guardado.zona] ? guardado.zona : null);
})();


/* ==========================================================
   PASO 3 — Comparador Falla vs. Grieta (HU-011)
   ========================================================== */
(() => {
  'use strict';

  const CLAVE_ALMACEN = 'muroseguro_evaluacion';

  /* ---------- Referencias al DOM ---------- */
  const seccion = document.getElementById('paso-3');
  const stage = document.getElementById('p3-stage');
  if (!seccion || !stage) return;

  const $ = (id) => document.getElementById(id);
  const slider = $('p3-slider');
  const capaSuperior = $('p3-capa-superior');
  const btnContinuar = $('p3-continuar');
  const btnVolver = $('p3-volver');
  const estado = $('p3-estado');

  let ultimaPosicion = Number(slider.value) || 50;
  let interactuo = false;
  let arrastrando = false;

  /* ---------- Utilidades ---------- */
  const limitar = (valor, min, max) => Math.min(max, Math.max(min, valor));

  function anunciar(texto) {
    estado.textContent = '';
    setTimeout(() => { estado.textContent = texto; }, 50);
  }

  function leerAlmacen() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_ALMACEN)) || {};
    } catch (e) {
      return {};
    }
  }

  function enfocar(elemento) {
    if (!elemento) return;
    elemento.setAttribute('tabindex', '-1');
    elemento.focus();
  }

  /* ---------- Comparador (CA01 y CA02) ---------- */
  function aplicarPosicion(valor) {
    const pos = limitar(valor, 0, 100);
    ultimaPosicion = Math.round(pos);

    stage.style.setProperty('--p3-pos', `${pos}%`); 
    capaSuperior.style.width = `${pos}%`;             
    slider.value = String(ultimaPosicion);
    slider.setAttribute(
      'aria-valuetext',
      `Divisor al ${ultimaPosicion} %: se muestra ${ultimaPosicion} % de la falla superficial y ${100 - ultimaPosicion} % de la grieta estructural`
    );
  }

  function posicionDesdePuntero(evento) {
    const caja = stage.getBoundingClientRect();
    if (!caja.width) return ultimaPosicion;
    return ((evento.clientX - caja.left) / caja.width) * 100;
  }

  slider.addEventListener('input', () => {
    interactuo = true;
    aplicarPosicion(Number(slider.value));
  });

  stage.addEventListener('pointerdown', (evento) => {
    const tactil = evento.pointerType === 'touch';
    const sobreTirador = Boolean(evento.target.closest && evento.target.closest('.p3-tirador'));

    if (evento.pointerType === 'mouse' && evento.button !== 0) return;
    if (tactil && !sobreTirador) return; 

    arrastrando = true;
    interactuo = true;
    stage.classList.add('is-dragging');
    try { stage.setPointerCapture(evento.pointerId); } catch (e) { /* sin captura: sigue funcionando */ }

    aplicarPosicion(posicionDesdePuntero(evento));
    slider.focus({ preventScroll: true });
    evento.preventDefault();
  });

  stage.addEventListener('pointermove', (evento) => {
    if (!arrastrando) return;
    aplicarPosicion(posicionDesdePuntero(evento));
  });

  function terminarArrastre() {
    if (!arrastrando) return;
    arrastrando = false;
    stage.classList.remove('is-dragging');
    anunciar(`Divisor al ${ultimaPosicion} %.`);
  }

  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((tipo) => {
    stage.addEventListener(tipo, terminarArrastre);
  });

  /* ---------- Respaldo visual si falta una imagen ---------- */
  function activarRespaldo(img) {
    const contenedor = img.parentElement;
    contenedor.classList.add('is-fallback');
    const respaldo = contenedor.querySelector('.p3-fallback');
    if (respaldo) respaldo.removeAttribute('aria-hidden'); 
  }

  seccion.querySelectorAll('.p3-img').forEach((img) => {
    img.addEventListener('error', () => activarRespaldo(img));
    if (img.complete && img.naturalWidth === 0) activarRespaldo(img);
  });

  /* ---------- Acciones ---------- */
  btnContinuar.addEventListener('click', () => {
    const almacen = leerAlmacen();

    almacen.paso3 = {
      guiaRevisada: true,
      interactuoSlider: interactuo,
      ultimaPosicionSlider: ultimaPosicion,
      guardadoEn: new Date().toISOString()
    };
    almacen.pasoCompletado = Math.max(Number(almacen.pasoCompletado) || 0, 3);

    try {
      localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(almacen));
    } catch (e) {
      anunciar('No se pudo guardar tu avance en el navegador. Revisa los permisos de almacenamiento.');
      return;
    }

    document.dispatchEvent(new CustomEvent('muroseguro:paso-completado', {
      detail: { paso: 3, siguiente: 4 }
    }));

    const paso4 = $('paso-4');
    if (paso4) {
      seccion.hidden = true;
      paso4.hidden = false;
      window.scrollTo({ top: 0 });
      enfocar(paso4.querySelector('h1, h2'));
    } else {
      anunciar('Paso 3 completado. El siguiente paso estará disponible próximamente.');
    }
  });

  btnVolver.addEventListener('click', () => {
    const paso2 = $('paso-2');
    if (!paso2) return;
    seccion.hidden = true;
    paso2.hidden = false;
    window.scrollTo({ top: 0 });
    enfocar($('paso-2-titulo'));
  });

  /* ---------- Inicio ---------- */
  aplicarPosicion(ultimaPosicion);
})();

/* ==========================================================
   PASO 4 — Adjuntar evidencia (HU-010)
   ========================================================== */
(() => {
  'use strict';

  const CLAVE_ALMACEN = 'muroseguro_evaluacion';

  // CA01 / CA03: solo imágenes JPG, JPEG o PNG de hasta 5 MB cada una
  const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png'];
  const EXTENSIONES_PERMITIDAS = ['jpg', 'jpeg', 'png'];
  const MAX_BYTES = 5 * 1024 * 1024;

  const ICONO_IMAGEN =
    '<svg class="eval-icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">' +
    '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/>' +
    '<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';

  /* ---------- Referencias al DOM ---------- */
  const seccion = document.getElementById('paso-4');
  const form = document.getElementById('p4-form');
  if (!seccion || !form) return;

  const $ = (id) => document.getElementById(id);
  const vistaForm = $('p4-vista-form');
  const vistaOk = $('p4-vista-ok');
  const zona = $('p4-drop');
  const inputArchivos = $('p4-archivos');
  const cajaError = $('p4-error');
  const listaErrores = $('p4-error-lista');
  const lista = $('p4-lista');
  const vacio = $('p4-vacio');
  const contador = $('p4-contador');
  const campoTitulo = $('p4-campo-titulo');
  const campoCategoria = $('p4-campo-categoria');
  const campoDescripcion = $('p4-campo-descripcion');
  const btnCancelar = $('p4-cancelar');
  const btnEditar = $('p4-editar');
  const btnContinuar = $('p4-continuar');
  const detalleOk = $('p4-ok-detalle');
  const estado = $('p4-estado');

  let archivos = [];
  let siguienteId = 0;

  /* ---------- Utilidades ---------- */
  function anunciar(texto) {
    estado.textContent = '';
    setTimeout(() => { estado.textContent = texto; }, 50);
  }

  function leerAlmacen() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_ALMACEN)) || {};
    } catch (e) {
      return {};
    }
  }

  function enfocar(elemento) {
    if (!elemento) return;
    elemento.setAttribute('tabindex', '-1');
    elemento.focus();
  }

  function formatearPeso(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function extensionDe(nombre) {
    const i = nombre.lastIndexOf('.');
    return i >= 0 ? nombre.slice(i + 1).toLowerCase() : '';
  }

  /* ---------- Validación (CA01 y CA03) ---------- */
  function validarArchivo(file) {
    const extOk = EXTENSIONES_PERMITIDAS.includes(extensionDe(file.name));
    const tipoOk = file.type ? TIPOS_PERMITIDOS.includes(file.type) : extOk;

    if (!extOk || !tipoOk) {
      return `${file.name}: formato no permitido. Solo se aceptan imágenes JPG, JPEG o PNG.`;
    }
    if (file.size === 0) {
      return `${file.name}: el archivo está vacío.`;
    }
    if (file.size > MAX_BYTES) {
      return `${file.name}: pesa ${formatearPeso(file.size)} y supera el máximo de ${formatearPeso(MAX_BYTES)} por imagen.`;
    }
    return null;
  }

  function mostrarErrores(mensajes) {
    listaErrores.textContent = '';
    if (!mensajes.length) {
      cajaError.hidden = true;
      return;
    }
    mensajes.forEach((mensaje) => {
      const li = document.createElement('li');
      li.textContent = mensaje;
      listaErrores.appendChild(li);
    });
    cajaError.hidden = false;
  }

  /* ---------- Lista y miniaturas (CA02) ---------- */
  function crearItem(a) {
    const li = document.createElement('li');
    li.className = 'p4-item';
    li.dataset.id = String(a.id);

    const thumb = document.createElement('div');
    thumb.className = 'p4-item__thumb';
    if (a.url) {
      const img = document.createElement('img');
      img.src = a.url; 
      img.alt = `Miniatura de ${a.nombre}`;
      img.addEventListener('error', () => { thumb.innerHTML = ICONO_IMAGEN; });
      thumb.appendChild(img);
    } else {
      thumb.innerHTML = ICONO_IMAGEN; 
    }

    const info = document.createElement('div');
    info.className = 'p4-item__info';
    const nombre = document.createElement('p');
    nombre.className = 'p4-item__nombre';
    nombre.textContent = a.nombre;
    nombre.title = a.nombre;
    const peso = document.createElement('p');
    peso.className = 'p4-item__peso';
    peso.textContent = a.tamanoTexto;
    info.append(nombre, peso);

    const quitar = document.createElement('button');
    quitar.type = 'button';
    quitar.className = 'p4-item__quitar';
    quitar.textContent = 'Quitar';
    quitar.setAttribute('aria-label', `Quitar ${a.nombre}`);

    li.append(thumb, info, quitar);
    return li;
  }

  function renderLista() {
    lista.textContent = '';
    archivos.forEach((a) => lista.appendChild(crearItem(a)));
    contador.textContent = `(${archivos.length})`;
    lista.hidden = archivos.length === 0;
    vacio.hidden = archivos.length > 0;
  }

  function procesarArchivos(seleccion) {
    const errores = [];
    let agregados = 0;

    Array.from(seleccion).forEach((file) => {
      const motivo = validarArchivo(file);
      if (motivo) {
        errores.push(motivo);
        return;
      }

      const repetido = archivos.find((a) => a.nombre === file.name && a.tamanoBytes === file.size);
      if (repetido && repetido.url) {
        errores.push(`${file.name}: ya está adjunto.`);
        return;
      }
      if (repetido) { 
        repetido.url = URL.createObjectURL(file);
        agregados += 1;
        return;
      }

      archivos.push({
        id: ++siguienteId,
        nombre: file.name,
        tipo: file.type || (extensionDe(file.name) === 'png' ? 'image/png' : 'image/jpeg'),
        tamanoBytes: file.size,
        tamanoTexto: formatearPeso(file.size),
        url: URL.createObjectURL(file)
      });
      agregados += 1;
    });

    mostrarErrores(errores);
    renderLista();

    if (agregados > 0) {
      anunciar(`${agregados} ${agregados === 1 ? 'imagen adjuntada' : 'imágenes adjuntadas'}. Total: ${archivos.length}.`);
    }
  }

  function quitarArchivo(id) {
    const indice = archivos.findIndex((a) => a.id === id);
    if (indice < 0) return;

    const [quitado] = archivos.splice(indice, 1);
    if (quitado.url) URL.revokeObjectURL(quitado.url);

    renderLista();
    mostrarErrores([]);
    anunciar(`Se quitó ${quitado.nombre}. Total: ${archivos.length}.`);

    const botones = lista.querySelectorAll('.p4-item__quitar');
    (botones[Math.min(indice, botones.length - 1)] || inputArchivos).focus();
  }

  /* ---------- Vistas ---------- */
  function mostrarVista(nombre) {
    vistaForm.hidden = nombre !== 'form';
    vistaOk.hidden = nombre !== 'ok';
    window.scrollTo({ top: 0 });
    enfocar(nombre === 'ok' ? $('p4-ok-titulo') : $('paso-4-titulo'));
  }

  function resumenOk() {
    const n = archivos.length;
    const partes = [`${n} ${n === 1 ? 'imagen adjunta' : 'imágenes adjuntas'}`];
    if (campoTitulo.value.trim()) partes.push(`Título: ${campoTitulo.value.trim()}`);
    if (campoCategoria.value) partes.push(`Categoría: ${campoCategoria.selectedOptions[0].textContent}`);
    detalleOk.textContent = partes.join(' · ');
  }

  /* ---------- Guardado ---------- */
  function guardarPaso4() {
    const almacen = leerAlmacen(); 

    almacen.paso4 = {
      archivos: archivos.map((a) => ({
        nombre: a.nombre,
        tipo: a.tipo,
        tamanoBytes: a.tamanoBytes,
        tamanoTexto: a.tamanoTexto
      })), 
      titulo: campoTitulo.value.trim(),
      categoria: campoCategoria.value,
      descripcion: campoDescripcion.value.trim(),
      guardadoEn: new Date().toISOString()
    };
    almacen.pasoCompletado = 4;

    try {
      localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(almacen));
      return true;
    } catch (e) {
      anunciar('No se pudo guardar la evidencia en el navegador. Revisa los permisos de almacenamiento.');
      return false;
    }
  }

  function restaurar() {
    const p4 = leerAlmacen().paso4;
    if (!p4) return;

    campoTitulo.value = typeof p4.titulo === 'string' ? p4.titulo : '';
    campoDescripcion.value = typeof p4.descripcion === 'string' ? p4.descripcion : '';
    if (p4.categoria && Array.from(campoCategoria.options).some((o) => o.value === p4.categoria)) {
      campoCategoria.value = p4.categoria;
    }

    archivos = (Array.isArray(p4.archivos) ? p4.archivos : [])
      .filter((m) => m && typeof m.nombre === 'string')
      .map((m) => ({
        id: ++siguienteId,
        nombre: m.nombre,
        tipo: m.tipo || '',
        tamanoBytes: Number(m.tamanoBytes) || 0,
        tamanoTexto: m.tamanoTexto || formatearPeso(Number(m.tamanoBytes) || 0),
        url: null
      }));
    renderLista();
  }

  /* ---------- Eventos: selección y arrastre ---------- */
  inputArchivos.addEventListener('change', () => {
    procesarArchivos(inputArchivos.files);
    inputArchivos.value = ''; 
  });

  ['dragenter', 'dragover'].forEach((tipo) => {
    zona.addEventListener(tipo, (evento) => {
      evento.preventDefault();
      zona.classList.add('is-dragover');
    });
  });

  zona.addEventListener('dragleave', (evento) => {
    if (evento.relatedTarget && zona.contains(evento.relatedTarget)) return;
    zona.classList.remove('is-dragover');
  });

  zona.addEventListener('drop', (evento) => {
    evento.preventDefault();
    zona.classList.remove('is-dragover');
    if (evento.dataTransfer && evento.dataTransfer.files.length) {
      procesarArchivos(evento.dataTransfer.files);
    }
  });

  // Evita que el navegador abra la imagen si se suelta fuera de la zona
  seccion.addEventListener('dragover', (evento) => evento.preventDefault());
  seccion.addEventListener('drop', (evento) => evento.preventDefault());

  lista.addEventListener('click', (evento) => {
    const boton = evento.target.closest('.p4-item__quitar');
    if (!boton) return;
    quitarArchivo(Number(boton.closest('.p4-item').dataset.id));
  });

  /* ---------- Eventos: acciones ---------- */
  form.addEventListener('submit', (evento) => {
    evento.preventDefault();

    if (archivos.length === 0) {
      mostrarErrores(['Adjunta al menos una imagen para guardar la evidencia.']);
      inputArchivos.focus();
      return;
    }

    mostrarErrores([]);
    if (!guardarPaso4()) return;

    resumenOk();
    mostrarVista('ok');
    anunciar('Evidencia guardada correctamente.');
  });

  btnCancelar.addEventListener('click', () => {
    const paso3 = $('paso-3');
    if (!paso3) return;
    seccion.hidden = true;
    paso3.hidden = false;
    window.scrollTo({ top: 0 });
    enfocar($('paso-3-titulo'));
  });

  btnEditar.addEventListener('click', () => mostrarVista('form'));

  btnContinuar.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('muroseguro:paso-completado', {
      detail: { paso: 4, siguiente: 'resultados' }
    }));

    window.location.href = 'resultados.html?desde=evaluacion';
  });

  window.addEventListener('pagehide', () => {
    archivos.forEach((a) => { if (a.url) URL.revokeObjectURL(a.url); });
  });

  /* ---------- Inicio: siempre comienza en cero ---------- */
  archivos = [];
  renderLista();
})();

(() => {
  'use strict';

  const CLAVE_TEMA = 'muroseguro_tema_eval';
  const btnTema = document.getElementById('btn-tema-eval');
  if (!btnTema) return;

  const textoBtn = btnTema.querySelector('.eval-theme-fab__texto');

  function aplicarTema(oscuro) {
    document.body.classList.toggle('eval-dark', oscuro);
    btnTema.setAttribute('aria-pressed', String(oscuro));

    const etiqueta = oscuro ? 'Cambiar a modo luminoso' : 'Cambiar a modo oscuro';
    btnTema.setAttribute('aria-label', etiqueta);
    btnTema.title = etiqueta;
    if (textoBtn) textoBtn.textContent = oscuro ? 'Luminoso' : 'Oscuro';
  }

  function leerPreferenciaInicial() {
    try {
      const guardado = localStorage.getItem(CLAVE_TEMA);
      if (guardado === 'oscuro') return true;
      if (guardado === 'claro') return false;
    } catch (e) { /* sin storage */ }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  btnTema.addEventListener('click', () => {
    const nuevoOscuro = !document.body.classList.contains('eval-dark');
    aplicarTema(nuevoOscuro);
    try {
      localStorage.setItem(CLAVE_TEMA, nuevoOscuro ? 'oscuro' : 'claro');
    } catch (e) { /* sin storage */ }
  });

  aplicarTema(leerPreferenciaInicial());
})();
