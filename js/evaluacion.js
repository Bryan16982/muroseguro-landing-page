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
  const btnVolver = document.getElementById('p2-volver');
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

  if (btnVolver) {
    btnVolver.addEventListener('click', () => {
      const paso1 = document.getElementById('paso-1');
      if (!paso1) return;

      seccion.hidden = true;
      paso1.hidden = false;

      const sidebar = document.getElementById('eval-sidebar');
      if (sidebar) sidebar.hidden = true;
      document.body.classList.remove('eval-con-sidebar');

      window.scrollTo({ top: 0 });
      const titulo = document.getElementById('paso-1-titulo');
      if (titulo) {
        titulo.setAttribute('tabindex', '-1');
        titulo.focus();
      }
    });
  }

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

  function comprimirImagen(file, alTerminar) {
    const lector = new FileReader();
    lector.onload = () => {
      const img = new Image();
      img.onload = () => {
        const MAX_ANCHO = 640;
        const escala = img.width > MAX_ANCHO ? MAX_ANCHO / img.width : 1;
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * escala);
        canvas.height = Math.round(img.height * escala);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        alTerminar(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.onerror = () => alTerminar(null);
      img.src = lector.result;
    };
    lector.onerror = () => alTerminar(null);
    lector.readAsDataURL(file);
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
    const nuevos = [];    

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

      const nuevoItem = {
        id: ++siguienteId,
        nombre: file.name,
        tipo: file.type || (extensionDe(file.name) === 'png' ? 'image/png' : 'image/jpeg'),
        tamanoBytes: file.size,
        tamanoTexto: formatearPeso(file.size),
        url: URL.createObjectURL(file),
        dataUrl: null
      };
      archivos.push(nuevoItem);
      nuevos.push(nuevoItem);   
      comprimirImagen(file, (dataUrl) => { nuevoItem.dataUrl = dataUrl; });
      agregados += 1;
    });

    mostrarErrores(errores);
    renderLista();

    if (agregados > 0) {
      anunciar(`${agregados} ${agregados === 1 ? 'imagen adjuntada' : 'imágenes adjuntadas'}. Total: ${archivos.length}.`);
    }

    analizarNuevos(nuevos);    
    return agregados;
  }

  function quitarArchivo(id) {
    const indice = archivos.findIndex((a) => a.id === id);
    if (indice < 0) return;

    const [quitado] = archivos.splice(indice, 1);
    if (quitado.url) URL.revokeObjectURL(quitado.url);
    if (quitado === itemEnPanel) ocultarPanelCalidad();

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
        tamanoTexto: a.tamanoTexto,
        dataUrl: a.dataUrl || null
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

  // Umbrales ajustables. Calibrar con 10–20 fotos reales tomadas con celulares de gama media.
  const UMBRALES = {
    anchoAnalisis: 480,    // px: la foto se reduce a este ancho SOLO para medirla
    oscuraMedia: 70,       // luminancia media (0–255) menor → "muy oscura"
    oscuraPorcion: 0.55,   // o más de 55 % de píxeles casi negros
    quemadaMedia: 215,     // luminancia media mayor → "demasiada luz"
    quemadaPorcion: 0.40,  // o más de 40 % de píxeles casi blancos
    borrosaVarianza: 35    // varianza del Laplaciano menor → "posiblemente borrosa"
  };

  // Vocabulario para el borrador (las claves coinciden con los <option> de #p4-campo-categoria)
  const ETIQUETA_DANO = { grietas: 'Grietas', humedad: 'Humedad', desplome: 'Desplome' };
  const ETIQUETA_LUGAR = { techo: 'Techo', muros: 'Muros', columnas: 'Columnas' };
  const TITULO_DANO_LUGAR = {
    techo: 'en el techo', muros: 'en los muros', columnas: 'en las columnas'
  };
  const TITULO_SOLO_DANO = {
    grietas: 'Grietas visibles', humedad: 'Humedad visible', desplome: 'Desplome visible'
  };
  const TITULO_SOLO_LUGAR = {
    techo: 'Foto del techo', muros: 'Foto de los muros', columnas: 'Foto de las columnas'
  };
  const PISTAS_DANO = [
    [/grieta|fisura|rajadura/, 'grietas'],
    [/humedad|salitre|filtrac/, 'humedad'],
    [/desplom|inclin/, 'desplome']
  ];
  const PISTAS_LUGAR = [
    [/techo|losa|cubierta/, 'techo'],
    [/columna/, 'columnas'],
    [/muro|pared/, 'muros']
  ];

  const ICONOS_CALIDAD = {
    ok: '<svg class="eval-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><polyline points="20 6 9 17 4 12"/></svg>',
    alerta: '<svg class="eval-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>',
    pend: '<svg class="eval-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>'
  };

  /* ---------- Referencias del panel (si el HTML no está, la mejora se desactiva sola) ---------- */
  const calidad = $('p4-calidad') ? {
    panel: $('p4-calidad'),
    img: $('p4-calidad-img'),
    archivo: $('p4-calidad-archivo'),
    titulo: $('p4-calidad-titulo'),
    chipIlum: $('p4-calidad-ilum'),
    txtIlum: $('p4-calidad-ilum-txt'),
    chipEnfoque: $('p4-calidad-enfoque'),
    txtEnfoque: $('p4-calidad-enfoque-txt'),
    alerta: $('p4-calidad-alerta'),
    alertaTitulo: $('p4-calidad-alerta-titulo'),
    consejos: $('p4-calidad-consejos'),
    btnReemplazar: $('p4-calidad-reemplazar'),
    btnConservar: $('p4-calidad-conservar'),
    borrador: $('p4-calidad-borrador'),
    sugTitulo: $('p4-calidad-sug-titulo'),
    sugCategoria: $('p4-calidad-sug-categoria'),
    porque: $('p4-calidad-porque'),
    previo: $('p4-calidad-previo'),
    acciones: $('p4-calidad-acciones'),
    btnAplicar: $('p4-calidad-aplicar'),
    btnManual: $('p4-calidad-manual'),
    hecho: $('p4-calidad-hecho'),
    btnDeshacer: $('p4-calidad-deshacer'),
    sinSug: $('p4-calidad-sin-sug')
  } : null;

  let itemEnPanel = null;       // foto que muestra el panel
  let borrador = null;          // sugerencia vigente
  let respaldoCampos = null;    // valores previos del usuario, para "Deshacer"
  let reemplazoPendiente = null;
  let rondaAnalisis = 0;

  /* ---------- 1) Medición con Canvas (función pura, probable sin navegador) ---------- */
  function medirCalidad(rgba, ancho, alto) {
    const n = ancho * alto;
    const gris = new Float32Array(n);
    let suma = 0;
    let oscuros = 0;
    let quemados = 0;

    for (let i = 0, p = 0; p < n; i += 4, p++) {
      const y = 0.2126 * rgba[i] + 0.7152 * rgba[i + 1] + 0.0722 * rgba[i + 2];
      gris[p] = y;
      suma += y;
      if (y < 40) oscuros++;
      if (y > 240) quemados++;
    }

    // Nitidez: varianza del Laplaciano (4 vecinos). Poco contraste de bordes = foto borrosa.
    let s = 0;
    let s2 = 0;
    let m = 0;
    for (let y = 1; y < alto - 1; y++) {
      for (let x = 1; x < ancho - 1; x++) {
        const p = y * ancho + x;
        const l = gris[p - 1] + gris[p + 1] + gris[p - ancho] + gris[p + ancho] - 4 * gris[p];
        s += l;
        s2 += l * l;
        m++;
      }
    }

    return {
      media: suma / n,
      porcionOscura: oscuros / n,
      porcionQuemada: quemados / n,
      varianza: m ? s2 / m - (s / m) * (s / m) : 0
    };
  }

  function evaluarCalidad(m) {
    let iluminacion = 'ok';
    if (m.media < UMBRALES.oscuraMedia || m.porcionOscura > UMBRALES.oscuraPorcion) {
      iluminacion = 'oscura';
    } else if (m.media > UMBRALES.quemadaMedia || m.porcionQuemada > UMBRALES.quemadaPorcion) {
      iluminacion = 'quemada';
    }
    // En una foto muy oscura la nitidez no se puede medir con confianza.
    const enfoque = iluminacion === 'oscura'
      ? 'pendiente'
      : (m.varianza < UMBRALES.borrosaVarianza ? 'borrosa' : 'ok');

    return { iluminacion, enfoque, medidas: m, hayProblemas: iluminacion !== 'ok' || enfoque === 'borrosa' };
  }

  function medirImagen(url) {
    return new Promise((resolver, rechazar) => {
      const img = new Image();
      img.onload = () => {
        try {
          const escala = Math.min(1, UMBRALES.anchoAnalisis / img.naturalWidth);
          const w = Math.max(8, Math.round(img.naturalWidth * escala));
          const h = Math.max(8, Math.round(img.naturalHeight * escala));
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          ctx.drawImage(img, 0, 0, w, h);
          resolver(medirCalidad(ctx.getImageData(0, 0, w, h).data, w, h));
        } catch (e) {
          rechazar(e);
        }
      };
      img.onerror = () => rechazar(new Error('Imagen no legible'));
      img.src = url;
    });
  }

  /* ---------- 2) Borrador sugerido: respuestas de los Pasos 1 y 2 + pista del nombre del archivo ---------- */
  function pistasDeNombre(nombre) {
    const t = nombre.replace(/\.[^.]+$/, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const dano = PISTAS_DANO.find(([patron]) => patron.test(t));
    const lugar = PISTAS_LUGAR.find(([patron]) => patron.test(t));
    return { dano: dano ? dano[1] : null, lugar: lugar ? lugar[1] : null };
  }

  function proponerBorrador(nombreArchivo) {
    const almacen = leerAlmacen();
    const p1 = almacen.paso1 || {};
    const p2 = almacen.paso2 || {};
    const pista = pistasDeNombre(nombreArchivo || '');
    const motivos = [];

    let dano = pista.dano;
    if (dano) {
      motivos.push(`el nombre del archivo menciona «${ETIQUETA_DANO[dano]}»`);
    } else {
      const marcados = (Array.isArray(p1.patologias) ? p1.patologias : []).filter((p) => ETIQUETA_DANO[p]);
      if (marcados.length === 1) {
        dano = marcados[0];
        motivos.push(`en el Paso 1 marcaste «${ETIQUETA_DANO[dano]}»`);
      } else if (marcados.length > 1) {
        motivos.push('en el Paso 1 marcaste varios daños, así que no elijo uno por ti');
      }
    }

    let lugar = pista.lugar;
    if (lugar) {
      motivos.push(`el nombre del archivo menciona «${ETIQUETA_LUGAR[lugar]}»`);
    } else if (ETIQUETA_LUGAR[p2.zona]) {
      lugar = p2.zona;
      motivos.push(`en el Paso 2 elegiste «${ETIQUETA_LUGAR[lugar]}»`);
    }

    const categoria = dano || lugar;
    const opcion = categoria ? campoCategoria.querySelector(`option[value="${categoria}"]`) : null;
    if (!opcion) return null;   // sin datos suficientes: no se inventa nada

    let titulo;
    if (dano && lugar) titulo = `${ETIQUETA_DANO[dano]} ${TITULO_DANO_LUGAR[lugar]}`;
    else if (dano) titulo = TITULO_SOLO_DANO[dano];
    else titulo = TITULO_SOLO_LUGAR[lugar];

    return { titulo, categoria, categoriaEtiqueta: opcion.textContent.trim(), motivos };
  }

  /* ---------- 3) Pintado del panel ---------- */
  function pintarChip(chip, texto, estado, mensaje) {
    chip.dataset.estado = estado;
    chip.querySelector('.p4-calidad__chip-ico').innerHTML = ICONOS_CALIDAD[estado];
    texto.textContent = mensaje;
  }

  function ocultarPanelCalidad() {
    if (!calidad) return;
    calidad.panel.hidden = true;
    itemEnPanel = null;
    borrador = null;
    respaldoCampos = null;
  }

  function pintarAnalizando(item, total) {
    itemEnPanel = item;
    borrador = null;
    respaldoCampos = null;
    calidad.img.src = item.url || '';
    calidad.archivo.textContent = total > 1 ? `${item.nombre} · revisando ${total} fotos…` : item.nombre;
    pintarChip(calidad.chipIlum, calidad.txtIlum, 'pend', 'Analizando…');
    pintarChip(calidad.chipEnfoque, calidad.txtEnfoque, 'pend', 'Analizando…');
    calidad.alerta.hidden = true;
    calidad.borrador.hidden = true;
    calidad.sinSug.hidden = true;
    calidad.panel.hidden = false;
  }

  function armarAlerta(a) {
    const partes = [];
    const consejos = [];

    if (a.iluminacion === 'oscura') {
      partes.push('salió muy oscura');
      consejos.push('Enciende la luz o abre una ventana y, si puedes, acércate a 1 metro de la zona.');
    }
    if (a.iluminacion === 'quemada') {
      partes.push('tiene demasiada luz');
      consejos.push('Evita el sol directo o el flash sobre el muro: ponte de espaldas al sol o busca sombra.');
    }
    if (a.enfoque === 'borrosa') {
      partes.push('parece borrosa');
      consejos.push('Sostén el celular con las dos manos, toca la pantalla sobre la zona para enfocar y espera un segundo antes de disparar.');
      consejos.push('Si el muro es muy liso, la foto puede estar bien: en ese caso puedes conservarla.');
    }

    calidad.alertaTitulo.textContent = `La foto ${partes.join(' y ')}`;
    calidad.consejos.textContent = '';
    consejos.forEach((c) => {
      const li = document.createElement('li');
      li.textContent = c;
      calidad.consejos.appendChild(li);
    });
    calidad.alerta.hidden = false;
  }

  function actualizarAvisoPrevio() {
    if (!calidad || !borrador || calidad.borrador.hidden || !calidad.hecho.hidden) return;
    const pisados = [];
    const titulo = campoTitulo.value.trim();
    if (titulo && titulo !== borrador.titulo) pisados.push('tu título');
    if (campoCategoria.value && campoCategoria.value !== borrador.categoria) pisados.push('tu categoría');

    calidad.previo.hidden = pisados.length === 0;
    calidad.previo.textContent = pisados.length
      ? `Ya completaste ${pisados.join(' y ')}. Si aplicas la sugerencia, se reemplazará; podrás deshacerlo.`
      : '';
  }

  function mostrarBorrador(item) {
    borrador = proponerBorrador(item.nombre);
    respaldoCampos = null;
    calidad.hecho.hidden = true;
    calidad.acciones.hidden = false;

    if (!borrador) {
      calidad.borrador.hidden = true;
      calidad.sinSug.hidden = false;
      return false;
    }

    calidad.sinSug.hidden = true;
    calidad.sugTitulo.textContent = borrador.titulo;
    calidad.sugCategoria.textContent = borrador.categoriaEtiqueta;
    calidad.porque.textContent = `Por qué: ${borrador.motivos.join(' · ')}.`;
    calidad.borrador.hidden = false;
    actualizarAvisoPrevio();
    return true;
  }

  function pintarResultado(item, total) {
    itemEnPanel = item;
    const a = item.analisis;
    calidad.img.src = item.url || '';
    calidad.archivo.textContent = total > 1
      ? `${item.nombre} · se revisaron ${total} fotos; esta es la que más atención necesita`
      : item.nombre;

    let resumen;
    if (!a) {
      pintarChip(calidad.chipIlum, calidad.txtIlum, 'pend', 'No se pudo revisar');
      pintarChip(calidad.chipEnfoque, calidad.txtEnfoque, 'pend', 'No se pudo revisar');
      calidad.alerta.hidden = true;
      resumen = 'No pudimos revisar la calidad de la foto. Puedes continuar con normalidad.';
    } else {
      const textoIlum = { ok: 'Buena', oscura: 'Muy oscura', quemada: 'Demasiada luz' }[a.iluminacion];
      const textoEnfoque = {
        ok: 'Nítida',
        borrosa: 'Posiblemente borrosa',
        pendiente: 'Sin evaluar (foto muy oscura)'
      }[a.enfoque];
      pintarChip(calidad.chipIlum, calidad.txtIlum, a.iluminacion === 'ok' ? 'ok' : 'alerta', textoIlum);
      pintarChip(calidad.chipEnfoque, calidad.txtEnfoque,
        a.enfoque === 'ok' ? 'ok' : (a.enfoque === 'borrosa' ? 'alerta' : 'pend'), textoEnfoque);

      if (a.hayProblemas) armarAlerta(a); else calidad.alerta.hidden = true;
      resumen = `Revisión lista. Iluminación: ${textoIlum}. Enfoque: ${textoEnfoque}.` +
        (a.hayProblemas ? ' Hay consejos para mejorar la foto, pero puedes conservarla.' : '');
    }

    if (mostrarBorrador(item)) resumen += ' Hay una sugerencia de título y categoría para que la revises.';
    anunciar(resumen);
  }

  async function analizarNuevos(items) {
    if (!calidad || !items.length) return;
    const ronda = ++rondaAnalisis;
    pintarAnalizando(items[0], items.length);

    for (const item of items) {
      try {
        item.analisis = evaluarCalidad(await medirImagen(item.url));
      } catch (e) {
        item.analisis = null;
      }
      if (ronda !== rondaAnalisis) return;   // llegó una selección más reciente
    }

    const vigentes = items.filter((it) => archivos.includes(it));
    if (!vigentes.length) { ocultarPanelCalidad(); return; }
    const elegido = vigentes.find((it) => it.analisis && it.analisis.hayProblemas) || vigentes[0];
    pintarResultado(elegido, vigentes.length);
  }

  /* ---------- 4) Acciones del usuario ---------- */
  function aplicarSugerencia() {
    if (!borrador) return;
    respaldoCampos = { titulo: campoTitulo.value, categoria: campoCategoria.value };
    campoTitulo.value = borrador.titulo;
    campoCategoria.value = borrador.categoria;

    calidad.previo.hidden = true;
    calidad.acciones.hidden = true;
    calidad.hecho.hidden = false;
    anunciar('Sugerencia aplicada. Revisa el título y la categoría, y corrígelos si hace falta.');
    enfocar(calidad.hecho);
  }

  function deshacerSugerencia() {
    if (!respaldoCampos) return;
    campoTitulo.value = respaldoCampos.titulo;
    campoCategoria.value = respaldoCampos.categoria;
    respaldoCampos = null;

    calidad.hecho.hidden = true;
    calidad.acciones.hidden = false;
    actualizarAvisoPrevio();
    anunciar('Se restauraron tus valores anteriores.');
    calidad.btnAplicar.focus();
  }

  function editarManualmente() {
    calidad.borrador.hidden = true;
    borrador = null;
    anunciar('Sugerencia descartada. Completa el título y la categoría a tu manera.');
    campoTitulo.focus();
  }

  function conservarFoto() {
    calidad.alerta.hidden = true;
    anunciar('Conservaste la foto. Puedes seguir con el formulario.');
    enfocar(calidad.titulo);
  }

  function pedirReemplazo() {
    if (!itemEnPanel) return;
    reemplazoPendiente = itemEnPanel.id;   // la foto actual solo se quita si llega una válida
    inputArchivos.click();
  }

  if (calidad) {
    calidad.btnAplicar.addEventListener('click', aplicarSugerencia);
    calidad.btnDeshacer.addEventListener('click', deshacerSugerencia);
    calidad.btnManual.addEventListener('click', editarManualmente);
    calidad.btnConservar.addEventListener('click', conservarFoto);
    calidad.btnReemplazar.addEventListener('click', pedirReemplazo);

    // Si el usuario escribe después, el aviso de "se reemplazará" se mantiene al día.
    campoTitulo.addEventListener('input', actualizarAvisoPrevio);
    campoCategoria.addEventListener('change', actualizarAvisoPrevio);

    // Cancelar el selector, usar el botón normal o arrastrar archivos anula el reemplazo pendiente.
    inputArchivos.addEventListener('cancel', () => { reemplazoPendiente = null; });
    const etiquetaSeleccionar = seccion.querySelector('.p4-seleccionar');
    if (etiquetaSeleccionar) etiquetaSeleccionar.addEventListener('click', () => { reemplazoPendiente = null; });
    zona.addEventListener('drop', () => { reemplazoPendiente = null; });
  }

  /* ---------- Eventos: selección y arrastre ---------- */
  inputArchivos.addEventListener('change', () => {
    const elegidos = Array.from(inputArchivos.files);
    const idViejo = reemplazoPendiente;
    reemplazoPendiente = null;
    // "Reemplazar foto": la anterior se quita solo si llegó al menos un archivo válido.
    if (idViejo !== null && elegidos.some((f) => !validarArchivo(f))) quitarArchivo(idViejo);
    procesarArchivos(elegidos);
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
