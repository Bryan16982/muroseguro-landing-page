/* ==========================================================================
   asistente.js - Asistente conversacional guiado (chat con respuestas rápidas)
   Pregunta "¿Qué situación tiene tu vivienda hoy?" y lleva a la persona al
   módulo correcto: Evaluar, Resultados, Directorio, Recursos o Perfil.

   Es reutilizable: basta con cargar css/asistente.css y este script en
   cualquier página de la carpeta pages/. Se inserta solo (botón flotante).
   Para cambiar las opciones, edita la lista OPCIONES.
   ========================================================================== */
(function () {
  'use strict';

  if (document.getElementById('ms-asistente')) return;

  var PREGUNTA = '¿Qué situación tiene tu vivienda hoy?';

  /* Cada opción: lo que toca la persona, la respuesta del asistente y a dónde va */
  var OPCIONES = [
    {
      id: 'peligro',
      urgente: true,
      etiqueta: 'Hay peligro ahora (muro cediendo, caída de material)',
      respuesta:
        'Primero tu seguridad: sal de la vivienda y aléjate de muros, balcones y techos. ' +
        'Si hay riesgo inmediato, llama a Bomberos (116) o a INDECI (115). ' +
        'Cuando estés a salvo, contacta a un ingeniero civil colegiado para que revise la estructura.',
      destino: 'directorio.html',
      cta: 'Buscar un ingeniero'
    },
    {
      id: 'danos',
      etiqueta: 'Veo grietas, humedad o daños',
      respuesta:
        'Lo mejor es empezar con la evaluación guiada. Te toma pocos minutos y te dice, ' +
        'según las señales que ves, qué tan urgente es revisar tu vivienda.',
      destino: 'evaluacion.html',
      cta: 'Evaluar mi vivienda'
    },
    {
      id: 'diagnostico',
      etiqueta: 'Ya evalué y quiero ver mi diagnóstico',
      respuesta:
        'Entonces ve directo a tus resultados: ahí encuentras el diagnóstico referencial ' +
        'y los pasos recomendados.',
      destino: 'resultados.html',
      cta: 'Ver mis resultados'
    },
    {
      id: 'ingeniero',
      etiqueta: 'Necesito hablar con un ingeniero',
      respuesta:
        'En el directorio encuentras ingenieros civiles colegiados. Recuerda que MuroSeguro orienta, ' +
        'pero solo un profesional puede certificar la seguridad de tu vivienda.',
      destino: 'directorio.html',
      cta: 'Ir al directorio'
    },
    {
      id: 'aprender',
      etiqueta: 'Quiero entender qué significan las señales',
      respuesta:
        'En Recursos hay guías, infografías y videos para reconocer grietas, humedad ' +
        'y otras señales, y saber cuáles son preocupantes.',
      destino: 'recursos.html',
      cta: 'Ver los recursos'
    },
    {
      id: 'perfil',
      etiqueta: 'Quiero revisar mis datos y mis viviendas',
      respuesta:
        'En tu perfil puedes gestionar tus datos, tus viviendas y tu bitácora.',
      destino: 'perfil.html',
      cta: 'Ir a mi perfil'
    }
  ];

  var reducirMovimiento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ultimoFoco = null;

  /* --- Estructura --- */
  var raiz = document.createElement('div');
  raiz.id = 'ms-asistente';
  raiz.className = 'ms-asis';
  raiz.innerHTML =
    '<section class="ms-asis__panel" id="ms-asis-panel" role="dialog" aria-modal="false" ' +
             'aria-labelledby="ms-asis-titulo" hidden>' +
      '<header class="ms-asis__cabecera">' +
        '<span class="ms-asis__avatar" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" focusable="false"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>' +
        '</span>' +
        '<div class="ms-asis__titulos">' +
          '<h2 class="ms-asis__titulo" id="ms-asis-titulo">Asistente MuroSeguro</h2>' +
          '<p class="ms-asis__sub">Te guío al lugar correcto</p>' +
        '</div>' +
        '<button class="ms-asis__cerrar" type="button" aria-label="Cerrar asistente">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18"/></svg>' +
        '</button>' +
      '</header>' +
      '<div class="ms-asis__chat" id="ms-asis-chat" role="log" aria-live="polite" aria-relevant="additions"></div>' +
      '<div class="ms-asis__opciones" id="ms-asis-opciones"></div>' +
      '<p class="ms-asis__aviso">Orientación preliminar. No reemplaza la evaluación de un ingeniero civil.</p>' +
    '</section>' +
    '<button class="ms-asis__fab" id="ms-asis-fab" type="button" aria-expanded="false" ' +
            'aria-controls="ms-asis-panel" aria-label="Abrir asistente: ¿qué situación tiene tu vivienda hoy?">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.5-4.6A8 8 0 1 1 21 12z"/><path d="M9 11h.01M12 11h.01M15 11h.01"/></svg>' +
      '<span class="ms-asis__fab-texto">¿Qué hago?</span>' +
    '</button>';

  document.body.appendChild(raiz);

  var panel = raiz.querySelector('#ms-asis-panel');
  var fab = raiz.querySelector('#ms-asis-fab');
  var cerrar = raiz.querySelector('.ms-asis__cerrar');
  var chat = raiz.querySelector('#ms-asis-chat');
  var zonaOpciones = raiz.querySelector('#ms-asis-opciones');
  var iniciado = false;

  /* --- Mensajes --- */
  function burbuja(tipo, texto) {
    var p = document.createElement('p');
    p.className = 'ms-asis__msg ms-asis__msg--' + tipo;
    p.textContent = texto;
    chat.appendChild(p);
    chat.scrollTop = chat.scrollHeight;
    return p;
  }

  function limpiarOpciones() {
    zonaOpciones.textContent = '';
  }

  function crearBoton(texto, clase, alClick) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'ms-asis__chip' + (clase ? ' ' + clase : '');
    b.textContent = texto;
    b.addEventListener('click', alClick);
    return b;
  }

  function mostrarOpciones() {
    limpiarOpciones();
    OPCIONES.forEach(function (op) {
      zonaOpciones.appendChild(
        crearBoton(op.etiqueta, op.urgente ? 'ms-asis__chip--urgente' : '', function () { elegir(op); })
      );
    });
  }

  function despues(fn) {
    if (reducirMovimiento) fn();
    else window.setTimeout(fn, 450);
  }

  function elegir(op) {
    limpiarOpciones();
    burbuja('yo', op.etiqueta);

    despues(function () {
      var msg = burbuja('bot', op.respuesta);
      if (op.urgente) msg.classList.add('ms-asis__msg--urgente');

      var enlace = document.createElement('a');
      enlace.className = 'ms-asis__ir';
      enlace.href = op.destino;
      enlace.textContent = op.cta + ' →';
      zonaOpciones.appendChild(enlace);

      zonaOpciones.appendChild(
        crearBoton('Otra consulta', 'ms-asis__chip--suave', function () {
          burbuja('yo', 'Otra consulta');
          despues(function () {
            burbuja('bot', PREGUNTA);
            mostrarOpciones();
          });
        })
      );
      enlace.focus();
    });
  }

  function iniciar() {
    if (iniciado) return;
    iniciado = true;
    burbuja('bot', 'Hola, soy el asistente de MuroSeguro. ' + PREGUNTA);
    mostrarOpciones();
  }

  /* --- Abrir / cerrar --- */
  function abrir() {
    ultimoFoco = document.activeElement;
    panel.hidden = false;
    fab.setAttribute('aria-expanded', 'true');
    raiz.classList.add('is-open');
    iniciar();
    var primero = zonaOpciones.querySelector('button, a');
    if (primero) primero.focus();
  }

  function cerrarPanel(devolverFoco) {
    panel.hidden = true;
    fab.setAttribute('aria-expanded', 'false');
    raiz.classList.remove('is-open');
    if (devolverFoco) fab.focus();
  }

  fab.addEventListener('click', function () {
    if (panel.hidden) abrir(); else cerrarPanel(true);
  });
  cerrar.addEventListener('click', function () { cerrarPanel(true); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) cerrarPanel(true);
  });
})();
