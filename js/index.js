
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MuroSeguro - Seguridad sísmica de tu vivienda</title>
  <link rel="stylesheet" href="../css/styles.css">
  <link rel="stylesheet" href="../css/index.css">
  <link rel="icon" type="image/x-icon" href="../favicon.ico">
</head>
<body class="index">

  <header class="topbar">
    <a class="marca" href="index.html">
      <img src="../assets/images/logo-muroseguro.png" alt="" width="32" height="39">
      MuroSeguro
    </a>

    <button class="icon-btn" id="boton-menu" type="button"
            aria-label="Abrir menú" aria-expanded="false" aria-controls="menu">☰</button>

    <nav id="menu" class="menu" aria-label="Principal">
      <a href="#inicio">Inicio</a>
      <a href="#como-funciona">Cómo funciona</a>
      <a href="#herramientas">Herramientas</a>
      <a href="#crear-cuenta">Crear cuenta</a>
      <a class="btn-secondary" href="login.html">Iniciar sesión</a>
    </nav>
  </header>

  <main>
    <!-- 1. Bienvenida -->
    <section id="inicio" class="hero" aria-labelledby="titulo-hero">
      <div class="hero-texto">
        <p class="etiqueta">Orientación preliminar sísmica</p>
        <h1 id="titulo-hero">¿Es seguro el muro de tu casa? <span class="resalta">Descúbrelo en minutos.</span></h1>
        <p class="hero-lead">Aprende a reconocer grietas, humedad y otras señales visibles en tu vivienda, y entérate a tiempo de cuándo llamar a un ingeniero civil colegiado.</p>

        <div class="hero-acciones">
          <a class="btn-primary btn-grande" href="#crear-cuenta">Crear cuenta gratis</a>
          <a class="btn-secondary btn-grande" href="login.html">Ya tengo cuenta</a>
        </div>

        <ul class="hero-puntos" aria-label="Ventajas">
          <li>Sin costo</li>
          <li>Sin instalar nada</li>
          <li>Funciona en tu celular</li>
        </ul>
      </div>

      <figure class="hero-visual">
        <img src="../assets/images/grieta-estructural.png"
             alt="Grieta diagonal que atraviesa un muro de ladrillo" width="480" height="567">
        <figcaption class="hero-nota">
          <strong>Una grieta diagonal</strong>
          <span>¿Cuándo preocuparse? Te lo explicamos.</span>
        </figcaption>
      </figure>
    </section>

    <!-- 2. Cómo funciona -->
    <section id="como-funciona" class="seccion" aria-labelledby="titulo-pasos">
      <div class="seccion-cabecera">
        <h2 id="titulo-pasos">Así de simple</h2>
        <p>Tres pasos, sin tecnicismos.</p>
      </div>

      <ol class="pasos">
        <li class="paso card">
          <span class="paso-num" aria-hidden="true">1</span>
          <h3>Cuéntanos qué ves</h3>
          <p>Responde una encuesta guiada sobre el entorno, el tipo de daño y dónde está en tu vivienda.</p>
        </li>
        <li class="paso card">
          <span class="paso-num" aria-hidden="true">2</span>
          <h3>Recibe tu diagnóstico</h3>
          <p>Obtienes una orientación referencial sobre qué tan urgente es revisar tu vivienda.</p>
        </li>
        <li class="paso card">
          <span class="paso-num" aria-hidden="true">3</span>
          <h3>Actúa con información</h3>
          <p>Aprende con guías y videos, o contacta a un ingeniero civil colegiado del directorio.</p>
        </li>
      </ol>
    </section>

    <!-- 3. Herramientas -->
    <section id="herramientas" class="seccion seccion-alt" aria-labelledby="titulo-herramientas">
      <div class="seccion-cabecera">
        <h2 id="titulo-herramientas">Todo lo que necesitas en un solo lugar</h2>
        <p>Cuatro herramientas pensadas para propietarios, no para ingenieros.</p>
      </div>

      <div class="herramientas">
        <article class="card herramienta">
          <svg class="herramienta-icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
          <h3>Evaluar mi vivienda</h3>
          <p>Una encuesta corta para identificar señales de riesgo visibles.</p>
        </article>
        <article class="card herramienta">
          <svg class="herramienta-icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect width="6" height="4" x="9" y="3" rx="1"/><path d="m9 14 2 2 4-4"/></svg>
          <h3>Resultados claros</h3>
          <p>Un diagnóstico referencial que puedes guardar y descargar.</p>
        </article>
        <article class="card herramienta">
          <svg class="herramienta-icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <h3>Directorio de ingenieros</h3>
          <p>Encuentra ingenieros civiles colegiados cuando necesites una revisión profesional.</p>
        </article>
        <article class="card herramienta">
          <svg class="herramienta-icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          <h3>Recursos y videos</h3>
          <p>Aprende a reconocer grietas, humedad y fallas de tarrajeo.</p>
        </article>
      </div>
    </section>

    <!-- 4. Registro -->
    <section id="crear-cuenta" class="seccion registro-seccion" aria-label="Crear cuenta">
      <div class="registro-texto">
        <h2>Empieza hoy, es gratis</h2>
        <p>Crea tu cuenta y evalúa tu vivienda cuando quieras. Tus datos se guardan en tu navegador.</p>
        <ul class="registro-lista">
          <li>Evaluación guiada paso a paso</li>
          <li>Diagnóstico referencial de tu vivienda</li>
          <li>Directorio de ingenieros civiles colegiados</li>
        </ul>
        <p class="caption">MuroSeguro es una herramienta de orientación. No certifica la seguridad de tu vivienda ni reemplaza la evaluación de un profesional.</p>
      </div>

      <section class="card tarjeta" id="registro" aria-labelledby="titulo-registro">
      <h2 id="titulo-registro">Crea tu cuenta</h2>

      <form id="form-registro" novalidate>
        <div class="form-group">
          <label class="form-label" for="correo">Correo electrónico</label>
          <input class="form-input" id="correo" type="email" autocomplete="email"
                 placeholder="nombre@correo.com" aria-describedby="correo-error">
          <p class="error-texto" id="correo-error" hidden></p>
        </div>

        <div class="form-group">
          <label class="form-label" for="clave">Contraseña</label>
          <input class="form-input" id="clave" type="password" autocomplete="new-password"
                 aria-describedby="clave-ayuda clave-error">
          <p class="caption" id="clave-ayuda">Mínimo 8 caracteres, con letras y números.</p>
          <p class="error-texto" id="clave-error" hidden></p>
        </div>

        <div class="form-group">
          <label class="form-label" for="clave2">Confirmar contraseña</label>
          <input class="form-input" id="clave2" type="password" autocomplete="new-password"
                 aria-describedby="clave2-error">
          <p class="error-texto" id="clave2-error" hidden></p>
        </div>

        <div class="form-group">
          <label class="check" id="check-terminos" for="terminos">
            <input type="checkbox" id="terminos" aria-describedby="terminos-error">
            <span>Acepto los <strong>Términos y Condiciones</strong> y entiendo que el diagnóstico de MuroSeguro es <strong>referencial</strong> y <strong>no certifica</strong> la seguridad de mi vivienda.</span>
          </label>
          <p class="error-texto" id="terminos-error" hidden></p>
        </div>

        <button class="btn-primary" id="boton-registro" type="submit" aria-disabled="true">Crear cuenta</button>
      </form>

      <p class="pie-tarjeta">¿Ya tienes cuenta? <a href="login.html">Inicia sesión</a></p>
    </section>
    </section>
  </main>

  <footer class="pie">
    <p>© MuroSeguro · Orientación preliminar sobre la seguridad sísmica de tu vivienda.</p>
  </footer>

  <script src="../js/index.js"></script>
</body>
</html>

