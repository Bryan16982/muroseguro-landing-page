

const CLAVE_USUARIOS = 'ms_usuarios';   
const CLAVE_SESION = 'ms_sesion';       
const CLAVE_ACTIVO = 'ms_usuario_activo';


function leerUsuarios() {
  try { return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || []; }
  catch (e) { return []; }
}

function correoValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo);
}


function mostrarError(campo, mensaje) {
  const texto = document.getElementById(campo.id + '-error');
  texto.textContent = mensaje;
  texto.hidden = false;
  campo.classList.add('is-error');
  campo.setAttribute('aria-invalid', 'true');
}

function quitarError(campo) {
  const texto = document.getElementById(campo.id + '-error');
  texto.textContent = '';
  texto.hidden = true;
  campo.classList.remove('is-error');
  campo.removeAttribute('aria-invalid');
}


function revisar(campo, mensaje) {
  if (mensaje) { mostrarError(campo, mensaje); return false; }
  quitarError(campo);
  return true;
}


function cerrarSesion() {
  sessionStorage.removeItem(CLAVE_SESION);
  localStorage.removeItem(CLAVE_ACTIVO);
  location.assign('index.html');
}


function protegerPagina() {
  if (!sessionStorage.getItem(CLAVE_SESION)) location.replace('login.html');
}
if (document.body.hasAttribute('data-privada')) {
  protegerPagina();
  window.addEventListener('pageshow', protegerPagina);
}

const formRegistro = document.getElementById('form-registro');
if (formRegistro) {
  const correo = document.getElementById('correo');
  const clave = document.getElementById('clave');
  const clave2 = document.getElementById('clave2');
  const terminos = document.getElementById('terminos');
  const boton = document.getElementById('boton-registro');
  const cajaTerminos = document.getElementById('check-terminos');


  terminos.addEventListener('change', () => {
    boton.setAttribute('aria-disabled', terminos.checked ? 'false' : 'true');
    if (terminos.checked) {
      document.getElementById('terminos-error').hidden = true;
      cajaTerminos.classList.remove('is-error');
    }
  });


  formRegistro.addEventListener('input', (e) => {
    if (e.target.classList.contains('is-error')) quitarError(e.target);
  });

  formRegistro.addEventListener('submit', (e) => {
    e.preventDefault();

    let ok = true;
    const usuarios = leerUsuarios();
    const mail = correo.value.trim().toLowerCase();

    let msgCorreo = '';
    if (!mail) msgCorreo = 'Ingresa tu correo electrónico.';
    else if (!correoValido(mail)) msgCorreo = 'Escribe un correo válido, por ejemplo nombre@correo.com.';
    else if (usuarios.some((u) => u.correo === mail)) msgCorreo = 'Ya existe una cuenta con este correo.';
    ok = revisar(correo, msgCorreo) && ok;

    let msgClave = '';
    if (!clave.value) msgClave = 'Crea una contraseña.';
    else if (clave.value.length < 8) msgClave = 'Debe tener al menos 8 caracteres.';
    else if (!/[a-zA-Z]/.test(clave.value) || !/[0-9]/.test(clave.value)) msgClave = 'Combina letras y números.';
    ok = revisar(clave, msgClave) && ok;

    let msgClave2 = '';
    if (!clave2.value) msgClave2 = 'Repite tu contraseña.';
    else if (clave2.value !== clave.value) msgClave2 = 'Las contraseñas no coinciden.';
    ok = revisar(clave2, msgClave2) && ok;

 
    if (!terminos.checked) {
      const texto = document.getElementById('terminos-error');
      texto.textContent = 'Debes aceptar los términos para crear tu cuenta.';
      texto.hidden = false;
      cajaTerminos.classList.add('is-error');
      terminos.setAttribute('aria-invalid', 'true');
      ok = false;
    }

    if (!ok) {
      const primero = formRegistro.querySelector('[aria-invalid="true"]');
      if (primero) primero.focus();
      return;
    }

    usuarios.push({ correo: mail, clave: clave.value, aceptoTerminos: true });
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
    location.href = 'login.html?registro=ok';
  });
}

const formLogin = document.getElementById('form-login');
if (formLogin) {
  const correo = document.getElementById('correo');
  const clave = document.getElementById('clave');
  const errorLogin = document.getElementById('login-error');

  if (sessionStorage.getItem(CLAVE_SESION)) location.replace('perfil.html');


  if (new URLSearchParams(location.search).get('registro') === 'ok') {
    document.getElementById('aviso-registro').hidden = false;
  }

  const verClave = document.getElementById('ver-clave');
  verClave.addEventListener('click', () => {
    const mostrar = clave.type === 'password';
    clave.type = mostrar ? 'text' : 'password';
    verClave.textContent = mostrar ? 'Ocultar' : 'Mostrar';
    verClave.setAttribute('aria-pressed', String(mostrar));
  });

  formLogin.addEventListener('input', (e) => {
    if (e.target.classList.contains('is-error')) quitarError(e.target);
  });

  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    errorLogin.hidden = true;

    let ok = true;
    ok = revisar(correo, correoValido(correo.value.trim()) ? '' : 'Ingresa un correo válido.') && ok;
    ok = revisar(clave, clave.value ? '' : 'Ingresa tu contraseña.') && ok;
    if (!ok) {
      formLogin.querySelector('[aria-invalid="true"]').focus();
      return;
    }

    const mail = correo.value.trim().toLowerCase();
    const usuario = leerUsuarios().find((u) => u.correo === mail && u.clave === clave.value);

    if (!usuario) {
   
      errorLogin.textContent = 'Correo o contraseña incorrectos.';
      errorLogin.hidden = false;
      clave.value = '';
      clave.focus();
      return;
    }

    sessionStorage.setItem(CLAVE_SESION, usuario.correo);
    localStorage.setItem(CLAVE_ACTIVO, usuario.correo);
    location.replace('perfil.html');
  });
}


const botonMenu = document.getElementById('boton-menu');
if (botonMenu) {
  const menu = document.getElementById('menu');

  function cambiarMenu(abrir) {
    menu.classList.toggle('abierto', abrir);
    botonMenu.setAttribute('aria-expanded', String(abrir));
    botonMenu.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
    botonMenu.textContent = abrir ? '✕' : '☰';
  }

  botonMenu.addEventListener('click', () => cambiarMenu(!menu.classList.contains('abierto')));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) cambiarMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('abierto')) {
      cambiarMenu(false);
      botonMenu.focus();
    }
  });
}
