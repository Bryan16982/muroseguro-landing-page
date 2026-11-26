/* ==========================================================================
   menu-movil.js - Menú "sandwichito" (3 rayitas) para celular y pantallas chicas.
   Reutiliza el menú lateral .ms-sb que ya existe en cada página: no hay que
   duplicar el HTML. En escritorio no hace nada visible.
   ========================================================================== */
(function () {
  'use strict';

  var lateral = document.querySelector('.ms-sb');
  if (!lateral || document.querySelector('.ms-mbar')) return;

  var consulta = window.matchMedia('(max-width: 768px)');
  var ultimoFoco = null;

  /* --- Barra superior con el botón --- */
  var barra = document.createElement('div');
  barra.className = 'ms-mbar';
  barra.innerHTML =
    '<button class="ms-mbar__btn" type="button" aria-label="Abrir menú" aria-expanded="false">' +
      '<span class="ms-mbar__rayas" aria-hidden="true"></span>' +
    '</button>' +
    '<a class="ms-mbar__marca" href="inicio.html">' +
      '<img src="../assets/images/logo-muroseguro.png" alt="" width="28" height="28">' +
      '<span>MuroSeguro</span>' +
    '</a>';

  var fondo = document.createElement('div');
  fondo.className = 'ms-overlay';
  fondo.setAttribute('aria-hidden', 'true');

  var boton = barra.querySelector('.ms-mbar__btn');

  if (!lateral.id) lateral.id = 'ms-menu-lateral';
  boton.setAttribute('aria-controls', lateral.id);
  lateral.classList.add('ms-sb--js');

  lateral.parentNode.insertBefore(barra, lateral);
  lateral.parentNode.insertBefore(fondo, lateral);

  function estaAbierto() {
    return lateral.classList.contains('is-open');
  }

  function cambiar(abrir) {
    if (abrir === estaAbierto()) return;
    lateral.classList.toggle('is-open', abrir);
    fondo.classList.toggle('is-open', abrir);
    document.body.classList.toggle('ms-menu-abierto', abrir);
    boton.setAttribute('aria-expanded', String(abrir));
    boton.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');

    if (abrir) {
      ultimoFoco = document.activeElement;
      var primero = lateral.querySelector('a');
      if (primero) primero.focus();
    } else if (ultimoFoco && typeof ultimoFoco.focus === 'function') {
      ultimoFoco.focus();
      ultimoFoco = null;
    }
  }

  boton.addEventListener('click', function () { cambiar(!estaAbierto()); });
  fondo.addEventListener('click', function () { cambiar(false); });

  /* Al tocar una opción, el menú se cierra (cerrar sesión incluido) */
  lateral.addEventListener('click', function (e) {
    if (e.target.closest('a')) cambiar(false);
  });

  document.addEventListener('keydown', function (e) {
    if (!estaAbierto()) return;

    if (e.key === 'Escape') {
      cambiar(false);
      boton.focus();
      return;
    }

    /* El foco no se escapa del panel mientras está abierto */
    if (e.key === 'Tab') {
      var items = lateral.querySelectorAll('a[href]');
      if (!items.length) return;
      var primero = items[0];
      var ultimo = items[items.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    }
  });

  /* Si se agranda la pantalla, se restablece todo */
  function alCambiarTamano() {
    if (!consulta.matches) cambiar(false);
  }
  if (consulta.addEventListener) consulta.addEventListener('change', alCambiarTamano);
  else consulta.addListener(alCambiarTamano);

  /* evaluacion.html muestra/oculta su menú por pasos: la barra lo sigue */
  function sincronizar() {
    barra.hidden = lateral.hidden;
    document.body.classList.toggle('ms-con-mbar', !lateral.hidden);
    if (lateral.hidden) cambiar(false);
  }
  sincronizar();
  new MutationObserver(sincronizar).observe(lateral, { attributes: true, attributeFilter: ['hidden'] });
})();
