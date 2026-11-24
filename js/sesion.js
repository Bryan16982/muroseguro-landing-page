
(function () {
  var CLAVE_SESION = 'ms_sesion';
  var CLAVE_ACTIVO = 'ms_usuario_activo';

  function proteger() {
    if (!sessionStorage.getItem(CLAVE_SESION)) location.replace('login.html');
  }
  proteger();
  window.addEventListener('pageshow', proteger);

  var correo = sessionStorage.getItem(CLAVE_SESION) || '';
  if (correo) {
    var iniciales = correo.split('@')[0].replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase() || 'US';
    document.querySelectorAll('[data-usuario-iniciales]').forEach(function (el) { el.textContent = iniciales; });
    document.querySelectorAll('[data-usuario-nombre]').forEach(function (el) { el.textContent = correo; el.title = correo; });
  }

  document.addEventListener('click', function (e) {
    var enlace = e.target.closest('[data-cerrar-sesion]');
    if (!enlace) return;
    e.preventDefault();
    sessionStorage.removeItem(CLAVE_SESION);
    localStorage.removeItem(CLAVE_ACTIVO);
    location.replace('index.html');
  });

  (function iniciarTemaGlobal() {
    var CLAVE_TEMA = 'muroseguro_tema';

    function leerPreferencia() {
      try {
        var guardado = localStorage.getItem(CLAVE_TEMA);
        if (guardado === 'oscuro') return true;
        if (guardado === 'claro') return false;
      } catch (e) { /* sin storage */ }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function crearBoton() {
      if (!document.body || document.getElementById('btn-tema-global')) return;

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ms-theme-fab';
      btn.id = 'btn-tema-global';
      btn.innerHTML =
        '<svg class="ms-theme-fab__icon ms-theme-fab__moon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
          '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>' +
        '</svg>' +
        '<svg class="ms-theme-fab__icon ms-theme-fab__sun" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
          '<circle cx="12" cy="12" r="4"/>' +
          '<path d="M12 2v2"/><path d="M12 20v2"/>' +
          '<path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/>' +
          '<path d="M2 12h2"/><path d="M20 12h2"/>' +
          '<path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>' +
        '</svg>' +
        '<span class="ms-theme-fab__texto">Oscuro</span>';

      var texto = btn.querySelector('.ms-theme-fab__texto');

      function aplicar(oscuro) {
        document.body.classList.toggle('ms-dark', oscuro);
        btn.setAttribute('aria-pressed', String(oscuro));
        var etiqueta = oscuro ? 'Cambiar a modo luminoso' : 'Cambiar a modo oscuro';
        btn.setAttribute('aria-label', etiqueta);
        btn.title = etiqueta;
        if (texto) texto.textContent = oscuro ? 'Luminoso' : 'Oscuro';
      }

      btn.addEventListener('click', function () {
        var nuevo = !document.body.classList.contains('ms-dark');
        aplicar(nuevo);
        try { localStorage.setItem(CLAVE_TEMA, nuevo ? 'oscuro' : 'claro'); } catch (e) { /* sin storage */ }
      });

      document.body.appendChild(btn);
      aplicar(leerPreferencia());
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', crearBoton);
    } else {
      crearBoton();
    }
})();
