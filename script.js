/**
 * 31 días, 31 recuerdos — lógica del calendario
 * - Carrusel horizontal con snap (móvil primero)
 * - Cajitas-regalo 3D con cuenta atrás hasta su día
 * - Repisa inferior con las cajitas ya abiertas
 * - Progreso y cajitas abiertas en localStorage
 * - Modo ?preview para revisar todo antes de diciembre
 */

const datos = window.datosCalendario;
const recuerdos = datos.recuerdos;
const totalDias = datos.calendario.totalDias;
const ANIO = datos.calendario.anio;
const MES = datos.calendario.mes;

const calendarioEl = document.getElementById('calendario');
const diaActualEl = document.getElementById('dia-actual');
const estadoFechaEl = document.getElementById('estado-fecha');
const modalFondo = document.getElementById('modal-fondo');
const contenidoModal = document.getElementById('contenido-modal');
const progresoEl = document.getElementById('progreso');
const progresoBarra = document.getElementById('progreso-barra');
const progresoTexto = document.getElementById('progreso-texto');
const nieveEl = document.getElementById('nieve');
const pistaEl = document.getElementById('pista');
const pistaTextoEl = document.getElementById('pista-texto');
const abiertasEl = document.getElementById('abiertas');
const abiertasCuentaEl = document.getElementById('abiertas-cuenta');
const abiertasAyudaEl = document.getElementById('abiertas-ayuda');
const btnAnterior = document.getElementById('anterior');
const btnSiguiente = document.getElementById('siguiente');

const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const puedeTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reducido;
if (reducido) document.body.classList.add('sin-3d');

const modoPreview = new URLSearchParams(location.search).has('preview');
const CLAVE_ABIERTAS = 'adviento_abiertas_v2';

const LOCK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>';
const GIFT_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="9" width="16" height="11" rx="1.6"></rect><path d="M3 9h18M12 9v11M12 9S9.6 4.2 7.2 4.2a2.4 2.4 0 0 0 0 4.8M12 9s2.4-4.8 4.8-4.8a2.4 2.4 0 0 1 0 4.8"></path></svg>';

/* ============ NIEVE ============ */
function crearNieve() {
  if (reducido) return;
  const copos = 30;
  for (let i = 0; i < copos; i++) {
    const c = document.createElement('span');
    const tam = (Math.random() * 3 + 1.4).toFixed(1);
    c.style.left = (Math.random() * 100).toFixed(2) + '%';
    c.style.width = tam + 'px';
    c.style.height = tam + 'px';
    c.style.opacity = (Math.random() * 0.5 + 0.22).toFixed(2);
    c.style.animationDuration = (Math.random() * 12 + 9).toFixed(1) + 's';
    c.style.animationDelay = '-' + (Math.random() * 20).toFixed(1) + 's';
    c.style.setProperty('--deriva', (Math.random() * 80 - 40).toFixed(0) + 'px');
    nieveEl.appendChild(c);
  }
}
crearNieve();

/* ============ GUIRNALDA ============ */
(function crearLuces() {
  const luces = document.querySelector('.luces');
  if (!luces) return;
  const n = 22;
  for (let i = 0; i < n; i++) {
    const l = document.createElement('span');
    const t = i / (n - 1);
    l.style.left = (t * 100).toFixed(2) + '%';
    l.style.top = (2 + Math.sin(Math.PI * t) * 18).toFixed(2) + 'px';
    l.style.animationDelay = (-Math.random() * 3.4).toFixed(2) + 's';
    luces.appendChild(l);
  }
})();

/* ============ FECHAS Y ESTADO ============ */
const fechaDeDia = (dia) => new Date(ANIO, MES - 1, dia, 0, 0, 0, 0);

function estaDisponible(dia) {
  return modoPreview || Date.now() >= fechaDeDia(dia).getTime();
}

function partesTiempo(ms) {
  const min = Math.max(0, Math.floor(ms / 60000));
  return {
    d: Math.floor(min / 1440),
    h: Math.floor((min % 1440) / 60),
    m: min % 60
  };
}

function textoCuenta(ms) {
  if (ms <= 0) return '';
  const { d, h, m } = partesTiempo(ms);
  if (d > 0) return `Faltan ${d}d ${h}h ${m}m`;
  if (h > 0) return `Faltan ${h}h ${m}m`;
  if (m > 0) return `Faltan ${m} min`;
  return 'Falta menos de 1 min';
}

function textoCuentaLargo(ms) {
  if (ms <= 0) return '';
  const { d, h, m } = partesTiempo(ms);
  const trozos = [];
  if (d) trozos.push(`${d} ${d === 1 ? 'día' : 'días'}`);
  if (h) trozos.push(`${h} ${h === 1 ? 'hora' : 'horas'}`);
  if (m) trozos.push(`${m} ${m === 1 ? 'minuto' : 'minutos'}`);
  if (!trozos.length) return 'menos de un minuto';
  return trozos.join(', ');
}

let abiertas = [];
// La vista previa empieza limpia y nunca escribe sobre el progreso real.
if (!modoPreview) {
  try {
    const guardadas = JSON.parse(localStorage.getItem(CLAVE_ABIERTAS) || '[]');
    abiertas = guardadas.filter((d) => recuerdos.some((r) => r.dia === d));
  } catch (e) { abiertas = []; }
}

function diaDeHoy() {
  const ahora = new Date();
  if (ahora.getFullYear() === ANIO && ahora.getMonth() === MES - 1) {
    return Math.min(ahora.getDate(), totalDias);
  }
  if (ahora.getTime() > fechaDeDia(totalDias).getTime()) return totalDias;
  return 1;
}

function diaObjetivo() {
  if (modoPreview) return 1;
  return diaDeHoy();
}

/* ============ HEADER / PROGRESO ============ */
function actualizarHeader() {
  const ahora = new Date();
  const inicio = fechaDeDia(1).getTime();
  const fin = fechaDeDia(totalDias).getTime();

  if (modoPreview) {
    estadoFechaEl.textContent = 'Vista previa: las 31 cajitas desbloqueadas';
  } else if (ahora.getTime() < inicio) {
    estadoFechaEl.textContent = `Diciembre llega en ${textoCuentaLargo(inicio - ahora.getTime())}`;
  } else if (ahora.getTime() > fin + 86400000) {
    estadoFechaEl.textContent = `Diciembre ${ANIO}: 31 días para recordar`;
  } else if (ahora.getFullYear() === ANIO && ahora.getMonth() === MES - 1) {
    estadoFechaEl.textContent = `Hoy es ${ahora.getDate()} de diciembre`;
  } else {
    estadoFechaEl.textContent = `Diciembre ${ANIO}: 31 días para recordar`;
  }
}

function actualizarProgreso() {
  const n = abiertas.length;
  const pct = Math.round((n / totalDias) * 100);
  progresoBarra.style.width = pct + '%';
  progresoEl.setAttribute('aria-valuenow', String(n));
  progresoTexto.textContent = `${n} de ${totalDias} cajitas abiertas`;
}

/* ============ PISTA DE DÍAS ============ */
function crearPista() {
  pistaEl.innerHTML = '';
  for (let i = 1; i <= totalDias; i++) {
    pistaEl.appendChild(document.createElement('span'));
  }
}

/* ============ CAJITAS ============ */
function pintarEstado(chip, rec) {
  const dia = rec.dia;
  if (abiertas.includes(dia)) {
    chip.innerHTML = `${GIFT_SVG}<span>Ver de nuevo</span>`;
    return;
  }
  if (estaDisponible(dia)) {
    chip.innerHTML = `${GIFT_SVG}<span>Abrir</span>`;
    return;
  }
  const restante = fechaDeDia(dia).getTime() - Date.now();
  chip.innerHTML = `${LOCK_SVG}<span>${textoCuenta(restante)}</span>`;
}

function etiquetaCaja(rec) {
  const dia = rec.dia;
  if (abiertas.includes(dia)) return 'Cajita abierta.';
  if (estaDisponible(dia)) return 'Cajita lista para abrir.';
  const restante = fechaDeDia(dia).getTime() - Date.now();
  return `Cajita bloqueada. Se desbloquea en ${textoCuentaLargo(restante)}.`;
}

function crearCaja(rec) {
  const dia = rec.dia;
  const abierta = abiertas.includes(dia);
  const disponible = estaDisponible(dia);

  const caja = document.createElement('button');
  caja.type = 'button';
  caja.className = `caja v${((dia - 1) % 3) + 1}`;
  caja.dataset.dia = String(dia);
  if (abierta) caja.classList.add('abierta');
  if (disponible) caja.classList.add('disponible');
  if (!disponible && !abierta) caja.classList.add('bloqueada');
  if (!disponible && !abierta) caja.setAttribute('aria-disabled', 'true');
  else caja.setAttribute('aria-expanded', String(abierta));

  caja.innerHTML = `
    <span class="caja-luz" aria-hidden="true"></span>
    <span class="caja-interior" aria-hidden="true">
      <span class="interior-sello">${dia}</span>
      <span class="brillo-interior">recuerdo</span>
      <span class="interior-sub">ver de nuevo</span>
    </span>
    <span class="caja-cuerpo">
      <span class="caja-tapa">
        <span class="caja-mono" aria-hidden="true"><i></i></span>
        <span class="lazo lazo-v" aria-hidden="true"></span>
        <span class="lazo lazo-h" aria-hidden="true"></span>
        <span class="caja-etiqueta">
          <span class="sello-dia">${dia}</span>
          <span class="caja-estado"></span>
        </span>
      </span>
    </span>
    <span class="sr-only caja-descripcion"></span>
  `;

  pintarEstado(caja.querySelector('.caja-estado'), rec);
  caja.querySelector('.caja-descripcion').textContent = etiquetaCaja(rec);

  if (disponible || abierta) {
    caja.addEventListener('click', () => abrirDia(rec, caja));
    if (puedeTilt) activarTilt(caja);
  }

  return caja;
}

function activarTilt(caja) {
  caja.addEventListener('mousemove', (e) => {
    const r = caja.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    caja.style.setProperty('--ry', (px * 12).toFixed(2) + 'deg');
    caja.style.setProperty('--rx', (-py * 10).toFixed(2) + 'deg');
  });
  caja.addEventListener('mouseleave', () => {
    caja.style.setProperty('--ry', '0deg');
    caja.style.setProperty('--rx', '0deg');
  });
}

function renderizarCalendario(diaParaCentrar) {
  calendarioEl.innerHTML = '';
  recuerdos.forEach((r) => calendarioEl.appendChild(crearCaja(r)));
  actualizarHeader();
  actualizarProgreso();
  sincronizarIndicador();
  if (diaParaCentrar) requestAnimationFrame(() => centrarDia(diaParaCentrar));
}

/* ============ CARRUSEL ============ */
function cajas() {
  return Array.from(calendarioEl.querySelectorAll('.caja'));
}

function centrarDia(dia, suave = false) {
  const caja = calendarioEl.querySelector(`[data-dia="${dia}"]`);
  if (!caja) return;
  const rc = caja.getBoundingClientRect();
  const rr = calendarioEl.getBoundingClientRect();
  const destino = calendarioEl.scrollLeft + (rc.left - rr.left) - (rr.width - rc.width) / 2;
  calendarioEl.scrollTo({ left: Math.max(0, destino), behavior: suave && !reducido ? 'smooth' : 'auto' });
}

let indiceActual = 1;

function indiceCentrado() {
  const rr = calendarioEl.getBoundingClientRect();
  const centro = rr.left + rr.width / 2;
  let mejor = 1;
  let menor = Infinity;
  cajas().forEach((c) => {
    const b = c.getBoundingClientRect();
    const d = Math.abs(b.left + b.width / 2 - centro);
    if (d < menor) { menor = d; mejor = Number(c.dataset.dia); }
  });
  return mejor;
}

function sincronizarIndicador() {
  indiceActual = indiceCentrado();
  diaActualEl.textContent = String(indiceActual);

  const ticks = Array.from(pistaEl.children);
  ticks.forEach((t, i) => {
    const dia = i + 1;
    t.classList.toggle('activa', dia === indiceActual);
    t.classList.toggle('vista', dia !== indiceActual && estaDisponible(dia));
  });

  btnAnterior.disabled = indiceActual <= 1;
  btnSiguiente.disabled = indiceActual >= totalDias;
}

function irA(dia, suave = true) {
  const destino = Math.min(Math.max(dia, 1), totalDias);
  centrarDia(destino, suave);
}

let frameScroll = null;
calendarioEl.addEventListener('scroll', () => {
  if (frameScroll) return;
  frameScroll = requestAnimationFrame(() => {
    frameScroll = null;
    sincronizarIndicador();
    if (pistaTextoEl && !pistaTextoEl.classList.contains('oculto-suave')) {
      pistaTextoEl.classList.add('oculto-suave');
    }
  });
}, { passive: true });

btnAnterior.addEventListener('click', () => irA(indiceActual - 1));
btnSiguiente.addEventListener('click', () => irA(indiceActual + 1));

let frameResize = null;
window.addEventListener('resize', () => {
  if (frameResize) cancelAnimationFrame(frameResize);
  frameResize = requestAnimationFrame(() => {
    frameResize = null;
    centrarDia(indiceActual);
  });
}, { passive: true });

calendarioEl.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') { e.preventDefault(); irA(indiceActual - 1); }
  else if (e.key === 'ArrowRight') { e.preventDefault(); irA(indiceActual + 1); }
  else if (e.key === 'Home') { e.preventDefault(); irA(1); }
  else if (e.key === 'End') { e.preventDefault(); irA(totalDias); }
});

/* ============ ABRIR ============ */
let ultimoFoco = null;

function guardarAbiertas() {
  if (modoPreview) return;
  try { localStorage.setItem(CLAVE_ABIERTAS, JSON.stringify(abiertas)); } catch (e) {}
}

function marcarAbierta(cajaEl, rec) {
  cajaEl.classList.add('abierta');
  cajaEl.classList.remove('disponible', 'bloqueada');
  cajaEl.removeAttribute('aria-disabled');
  cajaEl.setAttribute('aria-expanded', 'true');
  const descripcion = cajaEl.querySelector('.caja-descripcion');
  if (descripcion) descripcion.textContent = etiquetaCaja(rec);
  pintarEstado(cajaEl.querySelector('.caja-estado'), rec);
}

function abrirDia(rec, cajaEl) {
  if (!estaDisponible(rec.dia) && !abiertas.includes(rec.dia)) return;
  ultimoFoco = cajaEl || null;

  if (!abiertas.includes(rec.dia)) {
    abiertas.push(rec.dia);
    abiertas.sort((a, b) => a - b);
    guardarAbiertas();
    actualizarProgreso();
    if (cajaEl) marcarAbierta(cajaEl, rec);
    renderAbiertas();
  }

  abrirModal(rec);
}

/* ============ REPISA DE ABIERTAS ============ */
function renderAbiertas() {
  const lista = [...abiertas].sort((a, b) => a - b);
  abiertasCuentaEl.textContent = `${lista.length} / ${totalDias}`;
  abiertasEl.innerHTML = '';

  if (!lista.length) {
    const cuando = estaDisponible(1) ? 'Abre la primera y aparecerá aquí.' : `La primera te espera el 1 de diciembre.`;
    abiertasAyudaEl.textContent = cuando;
    return;
  }

  abiertasAyudaEl.textContent = 'Toca una cajita para volver a ver ese recuerdo.';

  lista.forEach((dia) => {
    const rec = recuerdos.find((r) => r.dia === dia);
    if (!rec) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `mini-caja v${((dia - 1) % 3) + 1}`;
    b.setAttribute('aria-label', `Ver de nuevo el recuerdo del día ${dia}`);
    b.innerHTML = `<span>${dia}</span>`;
    b.addEventListener('click', () => {
      ultimoFoco = b;
      abrirModal(rec);
    });
    abiertasEl.appendChild(b);
  });
}

/* ============ MODAL ============ */
function abrirModal(recuerdo) {
  const fotoSrc = recuerdo.foto || '';
  const esVideo = /\.(mp4|webm|ogv|m4v|mov)$/i.test(fotoSrc);
  const medio = esVideo
    ? `<video src="${fotoSrc}" class="imagen-recuerdo" autoplay muted loop playsinline preload="metadata"
             aria-label="Recuerdo del día ${recuerdo.dia}"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"></video>`
    : `<img src="${fotoSrc}" alt="Recuerdo del día ${recuerdo.dia}" class="imagen-recuerdo"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`;

  contenidoModal.innerHTML = `
    <div class="sello-cera" aria-hidden="true">${recuerdo.dia}</div>
    <div class="marco-foto">
      ${medio}
      <div class="placeholder-imagen">La foto del objeto físico<br>va aquí</div>
    </div>
    <div class="texto-modal">
      <span class="dia-badge">Día ${recuerdo.dia} de ${totalDias}</span>
      <h2 class="titulo-modal" id="titulo-modal">${recuerdo.titulo}</h2>
      ${recuerdo.objetoFisico ? `<div class="objeto-modal">${recuerdo.objetoFisico}</div>` : ''}
      <p class="descripcion-modal">${recuerdo.descripcion}</p>
      ${recuerdo.tieneDulce ? '<span class="dulce-badge"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="6" width="16" height="12" rx="2"></rect><path d="M4 10h16M4 14h16M10 6v12M14 6v12"></path></svg>Contiene un detalle dulce</span>' : ''}
      ${recuerdo.notaFisica ? `<p class="nota-fisica-modal">${recuerdo.notaFisica}</p>` : ''}
    </div>
  `;

  modalFondo.classList.add('activo');
  document.body.style.overflow = 'hidden';
  const cerrarBtn = document.getElementById('cerrar-modal');
  if (cerrarBtn) cerrarBtn.focus();
}

function cerrarModal() {
  if (!modalFondo.classList.contains('activo')) return;
  modalFondo.classList.remove('activo');
  contenidoModal.innerHTML = '';
  document.body.style.overflow = '';
  if (ultimoFoco && document.contains(ultimoFoco)) ultimoFoco.focus();
}

document.getElementById('cerrar-modal').addEventListener('click', cerrarModal);

modalFondo.addEventListener('click', (e) => {
  if (e.target === modalFondo) cerrarModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') cerrarModal();

  if (e.key === 'Tab' && modalFondo.classList.contains('activo')) {
    const focos = modalFondo.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
    if (!focos.length) return;
    const primero = focos[0];
    const ultimo = focos[focos.length - 1];
    if (e.shiftKey && document.activeElement === primero) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primero.focus();
    }
  }
});

/* ============ CUENTA ATRÁS ============ */
function refrescarCuentas() {
  let desbloqueo = false;

  cajas().forEach((caja) => {
    const dia = Number(caja.dataset.dia);
    const rec = recuerdos.find((r) => r.dia === dia);
    if (!rec) return;

    if (caja.classList.contains('bloqueada') && estaDisponible(dia)) {
      desbloqueo = true;
      return;
    }
    if (!caja.classList.contains('bloqueada')) return;

    const chip = caja.querySelector('.caja-estado');
    if (chip) chip.innerHTML = `${LOCK_SVG}<span>${textoCuenta(fechaDeDia(dia).getTime() - Date.now())}</span>`;
    const descripcion = caja.querySelector('.caja-descripcion');
    if (descripcion) descripcion.textContent = etiquetaCaja(rec);
  });

  if (desbloqueo) {
    const diaVisible = indiceActual;
    renderizarCalendario(diaVisible);
    renderAbiertas();
    estadoFechaEl.textContent = '¡Una cajita nueva se desbloqueó!';
  }
}

setInterval(refrescarCuentas, 20000);

/* ============ INICIO ============ */
crearPista();
renderizarCalendario();
renderAbiertas();

requestAnimationFrame(() => {
  centrarDia(diaObjetivo());
  sincronizarIndicador();
});
