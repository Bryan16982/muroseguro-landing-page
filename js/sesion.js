// Sesión para las páginas internas (inicio, evaluación, resultados, directorio, recursos, perfil)
(function () {
  var CLAVE_SESION = 'ms_sesion';
  var CLAVE_ACTIVO = 'ms_usuario_activo';

  // Sin sesión, se manda al login (también al volver con el botón "atrás" del navegador)
  function proteger() {
    if (!sessionStorage.getItem(CLAVE_SESION)) location.replace('login.html');
  }
  proteger();
  window.addEventListener('pageshow', proteger);

  // Los enlaces con data-cerrar-sesion cierran la sesión antes de ir a index.html
  document.addEventListener('click', function (e) {
    var enlace = e.target.closest('[data-cerrar-sesion]');
    if (!enlace) return;
    e.preventDefault();
    sessionStorage.removeItem(CLAVE_SESION);
    localStorage.removeItem(CLAVE_ACTIVO);
    location.replace('index.html');
  });
})();
