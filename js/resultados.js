/* =========================================================
   resultados.css - Integrante 4 (Motor de Riesgo y Reportes)
   Usa solo variables de styles.css. Todo va bajo .resultados
   para no sobrescribir las clases base.
   ========================================================= */

.resultados {
  min-width: 0;
}

.resultados *,
.resultados *::before,
.resultados *::after {
  box-sizing: border-box;
}

.resultados :focus-visible,
.modal-limites :focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 2px;
}

/* Botones / enlaces-botón: mínimo 44x44 */
.resultados .btn-primary,
.resultados .btn-secondary,
.modal-limites .btn-primary,
.modal-limites .btn-secondary {
  min-height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  cursor: pointer;
}

/* ---------- Encabezado ---------- */
.res-header { margin-bottom: 20px; }
.res-header h1 { color: var(--color-secondary); margin: 0 0 4px; }
.res-subtitulo { margin: 0; color: var(--color-secondary); opacity: 0.8; }

.resultados .card { margin-bottom: 16px; }

.res-h2 {
  margin: 0 0 12px;
  font-size: 1.125rem;
  color: var(--color-secondary);
}

.res-etiqueta {
  margin: 0 0 4px;
  font-size: 0.8125rem;
  color: var(--color-secondary);
  opacity: 0.75;
}

.res-nota {
  margin: 8px 0 12px;
  font-size: 0.875rem;
  color: var(--color-secondary);
  opacity: 0.85;
}

.res-aviso {
  margin: 16px 0 0;
  padding: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-secondary);
  background: var(--bg-dominant);
  border-left: 4px solid var(--color-warning);
  border-radius: 6px;
}

/* ---------- Semáforo ---------- */
.res-semaforo-cuerpo {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.semaforo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: var(--color-secondary);
  border-radius: 999px;
  flex: 0 0 auto;
}

.lampara {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid var(--bg-white);
  opacity: 0.25;
  transition: opacity 0.25s ease, box-shadow 0.25s ease;
}
.lampara-rojo { background: var(--color-error); }
.lampara-amarillo { background: var(--color-warning); }
.lampara-verde { background: var(--color-success); }

.lampara.activa {
  opacity: 1;
  box-shadow: 0 0 0 4px var(--bg-white);
}

.res-semaforo-texto { flex: 1 1 200px; min-width: 0; }

.res-nivel {
  margin: 0 0 6px;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-secondary);
}

.res-desc { margin: 0; color: var(--color-secondary); }

.res-semaforo { border-top: 6px solid var(--border-neutral); }
.res-semaforo.nivel-verde { border-top-color: var(--color-success); }
.res-semaforo.nivel-amarillo { border-top-color: var(--color-warning); }
.res-semaforo.nivel-rojo { border-top-color: var(--color-error); }

/* ---------- Barra de progreso (HU-013 CA01) ---------- */
.res-barra-bloque { margin-top: 20px; }

.res-barra-info {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 0.875rem;
  color: var(--color-secondary);
}

.barra {
  height: 16px;
  background: var(--bg-dominant);
  border: 1px solid var(--border-neutral);
  border-radius: 999px;
  overflow: hidden;
}

.barra-relleno {
  height: 100%;
  width: 0;
  background: var(--color-success);
  border-radius: 999px;
  transition: width 0.6s ease;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.nivel-amarillo .barra-relleno { background: var(--color-warning); }
.nivel-rojo .barra-relleno { background: var(--color-error); }

.barra-escala {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 0.75rem;
  color: var(--color-secondary);
  opacity: 0.8;
}

/* ---------- Botón urgente (HU-013 CA02) ---------- */
.res-urgente {
  border: 2px solid var(--color-error);
}
.res-urgente h2 { color: var(--color-error); }

.res-urgente-btn {
  margin-top: 12px;
  animation: pulso-urgente 1.2s ease-in-out infinite;
}

@keyframes pulso-urgente {
  0%   { box-shadow: 0 0 0 0 var(--color-error); }
  70%  { box-shadow: 0 0 0 12px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}

/* ---------- Stats ---------- */
.res-stats { margin-bottom: 16px; }
.res-stats .card { margin-bottom: 0; }
.res-stat-valor {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-secondary);
}

/* ---------- Listas ---------- */
.res-lista {
  margin: 0;
  padding-left: 20px;
  color: var(--color-secondary);
}
.res-lista li { margin-bottom: 8px; }

.res-factores {
  list-style: none;
  margin: 0;
  padding: 0;
}
.res-factores li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-neutral);
  color: var(--color-secondary);
}
.res-factores li:last-child { border-bottom: none; }

/* ---------- Acciones ---------- */
.res-acciones {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.res-acciones button { flex: 1 1 200px; }

/* ---------- Mapa SVG (HU-024) ---------- */
.mapa-contenedor {
  background: var(--bg-dominant);
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 12px;
}

.mapa-svg {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
}

.zona {
  stroke: var(--bg-white);
  stroke-width: 3;
  stroke-linejoin: round;
  fill-opacity: 0.55;
  cursor: pointer;
  transition: fill-opacity 0.2s ease;
}
.zona-bajo  { fill: var(--color-success); }
.zona-medio { fill: var(--color-warning); }
.zona-alto  { fill: var(--color-error); }

.zona:hover,
.zona:focus {
  fill-opacity: 1;
}
.zona:focus-visible {
  outline: none;
  stroke: var(--color-accent);
  stroke-width: 4;
}
.zona.seleccionada {
  fill-opacity: 1;
  stroke: var(--color-secondary);
  stroke-width: 4;
}

.mapa-etiquetas text {
  font-size: 12px;
  font-weight: 600;
  text-anchor: middle;
  fill: var(--color-secondary);
  pointer-events: none;
}

.mapa-info {
  min-height: 72px;
  padding: 12px;
  margin-bottom: 12px;
  background: var(--bg-white);
  border: 1px solid var(--border-neutral);
  border-radius: 8px;
  color: var(--color-secondary);
}
.mapa-info p { margin: 0 0 6px; }
.mapa-info p:last-child { margin-bottom: 0; }
.mapa-info strong { font-size: 1rem; }

.insignia {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  border: 1px solid var(--border-neutral);
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-secondary);
  background: var(--bg-white);
}

.mapa-leyenda {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 0.875rem;
  color: var(--color-secondary);
}
.mapa-leyenda li { display: flex; align-items: center; gap: 6px; }

.punto {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.punto-verde { background: var(--color-success); }
.punto-amarillo { background: var(--color-warning); }
.punto-rojo { background: var(--color-error); }

/* ---------- Modal (HU-012 CA03) ---------- */
.modal-limites {
  margin: auto; /* el reset global de styles.css quita el centrado nativo */
  width: calc(100% - 32px);
  max-width: 480px;
  padding: 24px;
  border: 1px solid var(--border-neutral);
  border-radius: 12px;
  background: var(--bg-white);
  color: var(--color-secondary);
}
.modal-limites::backdrop {
  background: color-mix(in srgb, var(--color-secondary) 70%, transparent);
}
.modal-limites h2 { margin: 0 0 12px; font-size: 1.25rem; }
.modal-limites p { margin: 0 0 16px; }

.modal-check {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
}
.modal-check input[type="checkbox"] {
  flex: 0 0 24px;
  width: 24px;
  height: 24px;
  margin-top: 2px;
  accent-color: var(--color-accent);
}
.modal-check label { cursor: pointer; padding: 2px 0; }

.modal-acciones {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.modal-acciones > * { flex: 1 1 160px; }

/* ---------- Cabecera de impresión (oculta en pantalla) ---------- */
.print-header { display: none; }

/* ---------- Responsive ---------- */
@media (max-width: 768px) {
  .resultados .grid-3 { grid-template-columns: 1fr; }
  .res-nivel { font-size: 1.25rem; }
}

@media (prefers-reduced-motion: reduce) {
  .res-urgente-btn { animation: none; outline: 3px solid var(--color-error); }
  .barra-relleno, .zona, .lampara { transition: none; }
}

/* ---------- Impresión / PDF (HU-014 CA02, CA03) ---------- */
@media print {
  .sidebar,
  .no-print,
  .modal-limites,
  .res-urgente-btn {
    display: none !important;
  }

  .app-layout { display: block; }
  .main-content.resultados {
    margin: 0;
    padding: 0;
    width: 100%;
    overflow: visible;
  }

  .print-header {
    display: block;
    margin-bottom: 16px;
    padding: 12px;
    text-align: center;
    font-weight: 700;
    color: var(--color-secondary);
    border: 2px solid var(--color-secondary);
  }

  .resultados .card { break-inside: avoid; box-shadow: none; }

  .lampara, .semaforo, .barra-relleno, .res-semaforo {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
