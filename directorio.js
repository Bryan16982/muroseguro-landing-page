<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Directorio de Ingenieros | MuroSeguro</title>
  <link rel="stylesheet" href="../css/styles.css">
  <link rel="stylesheet" href="../css/directorio.css">
</head>
<body>
  <div class="app-layout">
  <!-- Barra lateral con los 6 segmentos -->
    <aside class="sidebar">
      <div class="sidebar-top">
        <div class="brand-box">
          <img src="../assets/images/logo-muroseguro.png" alt="Logo de MuroSeguro" class="brand-logo">
          <div class="brand-text">
            <span class="brand-name">MuroSeguro</span>
            <small class="brand-sub">Seguridad estructural</small>
          </div>
        </div>

        <nav class="sidebar-nav">
          <ul class="nav-list">
            <li><a href="index.html" class="nav-item">Inicio</a></li>
            <li><a href="evaluacion.html" class="nav-item">Evaluar</a></li>
            <li><a href="resultados.html" class="nav-item">Resultados</a></li>
            <li><a href="directorio.html" class="nav-item active">Directorio</a></li>
            <li><a href="recursos.html" class="nav-item">Recursos</a></li>
            <li><a href="perfil.html" class="nav-item">Perfil</a></li>
          </ul>
        </nav>
      </div>

      <div class="sidebar-footer">
        <div class="user-chip">
          <span class="user-avatar">JR</span>
          <div class="user-meta">
            <strong>Administrador</strong>
            <small>Propietario</small>
          </div>
        </div>
        <a href="index.html" class="btn-logout">Cerrar sesión</a>
      </div>
    </aside>
    <!-- Contenido principal -->
    <main class="main-content">
      <!-- Encabezado y aviso legal (HU-018) -->
      <header class="page-header card">
        <div class="header-row">
          <div>
            <h1>Directorio de Ingenieros Colegiados</h1>
            <p class="header-sub">
              Conecta con ingenieros civiles validados para solicitar una evaluación presencial en tu vivienda.
            </p>
          </div>
          <span class="badge-orientacion">Orientación preliminar</span>
        </div>

        <div class="aviso-legal">
          <strong>Aviso legal:</strong> MuroSeguro solo conecta a las partes y no se responsabiliza
          por los acuerdos económicos externos. Esta plataforma brinda orientación preliminar y no
          reemplaza la evaluación presencial de un ingeniero civil colegiado.
        </div>
      </header>

      <!-- Filtros por ubicación (HU-019) -->
      <section class="card filtros-card">
        <div class="card-title-row">
          <h2>Filtrar por ubicación</h2>
          <span id="contador-resultados" class="contador-pill">0 profesionales</span>
        </div>

        <div class="filtros-grid">
          <div class="form-group">
            <label for="filtro-departamento" class="form-label">Departamento</label>
            <select id="filtro-departamento" class="form-select">
              <option value="">Todos los departamentos</option>
              <option value="La Libertad">La Libertad</option>
              <option value="Lima">Lima</option>
            </select>
          </div>

          <div class="form-group">
            <label for="filtro-distrito" class="form-label">Distrito</label>
            <select id="filtro-distrito" class="form-select" disabled>
              <option value="">Todos los distritos</option>
            </select>
          </div>

          <div class="form-group filtros-btn-col">
            <button type="button" id="btn-limpiar" class="btn-secondary">Limpiar filtros</button>
          </div>
        </div>

        <div id="panel-cercanos" class="panel-cercanos" style="display: none;">
          <p id="texto-cercanos">No hay ingenieros registrados en este distrito.</p>
          <button type="button" id="btn-cercanos" class="btn-primary">
            Buscar profesionales en distritos cercanos
          </button>
        </div>
      </section>

      <!-- Cuadrícula de ingenieros y paginación (HU-018, HU-020, HU-027) -->
      <section class="card directorio-card">
        <div id="grid-ingenieros" class="grid-3"></div>

        <div class="paginacion-bar">
          <button type="button" id="btn-anterior" class="btn-secondary" disabled>Anterior</button>
          <span id="info-pagina" class="info-pagina">Página 1 de 1</span>
          <button type="button" id="btn-siguiente" class="btn-secondary" disabled>Siguiente</button>
        </div>
      </section>

      <!-- Centro de ayuda / FAQ (HU-023) -->
      <section class="card faq-card">
        <h2>Centro de ayuda</h2>
        <p class="faq-sub">Resuelve tus dudas sobre el uso del directorio y los alcances de la plataforma.</p>
        <div id="contenedor-faq" class="faq-list"></div>
      </section>
    </main>
  </div>

  <script src="../js/directorio.js"></script>
</body>
</html>
