/**
 * 31 días, 31 recuerdos — lógica del calendario
 * - Cajitas 3D con tapa que gira al abrir
 * - Inclinación con el puntero (desktop)
 * - Tema claro/oscuro y progreso guardados en localStorage
 * - Modo ?preview para revisar todas las cajitas antes de diciembre
 */

const datos = window.datosCalendario;
const recuerdos = datos.recuerdos;
const totalDias = datos.calendario.totalDias;

const calendarioEl = document.getElementById('calendario');
const diaActualEl = document.getElementById('dia-actual');
const estadoFechaEl = document.getElementById('estado-fecha');
const modalFondo = document.getElementById('modal-fondo');
const contenidoModal = document.getElementById('contenido-modal');
const progresoEl = document.getElementById('progreso');
const progresoBarra = document.getElementById('progreso-barra');
const progresoTexto = document.getElementById('progreso-texto');
const btnTema = document.getElementById('btn-tema');
const nieveEl = document.getElementById('nieve');

const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const puedeTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reducido;
if (reducido) document.body.classList.add('sin-3d');

/* ============ TEMA ============ */
const CLAVE_TEMA = 'adviento_tema';
function aplicarTema(tema) {
  if (tema === 'oscuro') document.documentElement.dataset.tema = 'oscuro';
  else delete document.documentElement.dataset.tema;
  btnTema.setAttribute('aria-pressed', String(tema === 'oscuro'));
  try { localStorage.setItem(CLAVE_TEMA, tema); } catch (e) {}
}
let temaInicial = 'claro';
let temaGuardado = null;
try { temaGuardado = localStorage.getItem(CLAVE_TEMA); } catch (e) {}
if (temaGuardado) temaInicial = temaGuardado;
else if (window.matchMedia('(prefers-color-scheme: dark)').matches) temaInicial = 'oscuro';
aplicarTema(temaInicial);

btnTema.addEventListener('click', () => {
  const actual = document.documentElement.dataset.tema === 'oscuro' ? 'oscuro' : 'claro';
  aplicarTema(actual === 'oscuro' ? 'claro' : 'oscuro');
});

/* ============ NIEVE ============ */
function crearNieve() {
  if (reducido) return;
  const copos = 32;
  for (let i = 0; i < copos; i++) {
    const c = document.createElement('span');
    const tam = (Math.random() * 3 + 1.5).toFixed(1);
    c.style.left = (Math.random() * 100).toFixed(2) + '%';
    c.style.width = tam + 'px';
    c.style.height = tam + 'px';
    c.style.opacity = (Math.random() * 0.5 + 0.25).toFixed(2);
    c.style.animationDuration = (Math.random() * 12 + 9).toFixed(1) + 's';
    c.style.animationDelay = '-' + (Math.random() * 20).toFixed(1) + 's';
    c.style.setProperty('--deriva', (Math.random() * 80 - 40).toFixed(0) + 'px');
    nieveEl.appendChild(c);
  }
}
crearNieve();

/* ============ ESTADO ============ */
const hoy = new Date();
const esDiciembre = hoy.getMonth() === 11;
const esAnioCalendario = hoy.getFullYear() === datos.calendario.anio;
const modoPreview = new URLSearchParams(location.search).has('preview');

// Día máximo que se puede abrir
const diaHoy = modoPreview
  ? totalDias
  : (esDiciembre && esAnioCalendario ? Math.min(hoy.getDate(), totalDias) : 1);

let abiertas = [];
try { abiertas = JSON.parse(localStorage.getItem('adviento_abiertas') || '[]'); } catch (e) { abiertas = []; }

/* ============ HEADER / PROGRESO ============ */
function actualizarHeader() {
  if (esDiciembre && esAnioCalendario) {
    diaActualEl.textContent = diaHoy;
    estadoFechaEl.textContent = `Día ${diaHoy} de ${totalDias} — hoy es ${hoy.getDate()} de diciembre`;
  } else if (modoPreview) {
    diaActualEl.textContent = totalDias;
    estadoFechaEl.textContent = `Modo vista previa: todas las cajitas desbloqueadas`;
  } else {
    diaActualEl.textContent = '1';
    estadoFechaEl.textContent = `Vista previa: el calendario abre el 1 de diciembre de ${datos.calendario.anio}`;
  }
}

function actualizarProgreso() {
  const n = abiertas.length;
  const pct = Math.round((n / totalDias) * 100);
  progresoBarra.style.width = pct + '%';
  progresoEl.setAttribute('aria-valuenow', String(n));
  progresoTexto.textContent = `${n} de ${totalDias} cajitas abiertas`;
}

/* ============ RENDER ============ */
const LOCK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>';

function crearCaja(recuerdo) {
  const estaAbierta = abiertas.includes(recuerdo.dia);
  const bloqueada = recuerdo.dia > diaHoy;

  const caja = document.createElement('button');
  caja.type = 'button';
  caja.className = 'caja' + (estaAbierta ? ' abierta' : '') + (bloqueada ? ' bloqueada' : '');
  caja.dataset.dia = recuerdo.dia;
  caja.setAttribute('aria-label', bloqueada
    ? `Día ${recuerdo.dia}, ${recuerdo.objetoFisico}. Aún bloqueada hasta su fecha.`
    : `Día ${recuerdo.dia}, ${recuerdo.objetoFisico}. Abrir la cajita.`);
  if (bloqueada) caja.setAttribute('aria-disabled', 'true');
  else caja.setAttribute('aria-expanded', String(estaAbierta));

  const cuerpo = document.createElement('div');
  cuerpo.className = 'caja-cuerpo';

  const interior = document.createElement('div');
  interior.className = 'caja-interior';
  const brillo = document.createElement('span');
  brillo.className = 'brillo-interior';
  brillo.textContent = 'recuerdo';
  interior.appendChild(brillo);

  const tapa = document.createElement('div');
  tapa.className = 'tapa';
  const cara = document.createElement('div');
  cara.className = 'tapa-cara';

  const numero = document.createElement('span');
  numero.className = 'numero-dia';
  numero.textContent = recuerdo.dia;

  const objeto = document.createElement('span');
  objeto.className = 'objeto-fisico';
  objeto.textContent = recuerdo.objetoFisico;

  cara.appendChild(numero);
  cara.appendChild(objeto);
  tapa.appendChild(cara);

  cuerpo.appendChild(interior);
  cuerpo.appendChild(tapa);

  if (recuerdo.tieneDulce) {
    const sello = document.createElement('span');
    sello.className = 'sello';
    sello.title = 'Contiene un detalle dulce';
    cuerpo.appendChild(sello);
  }

  if (bloqueada) {
    const candado = document.createElement('span');
    candado.className = 'candado';
    candado.innerHTML = LOCK_SVG;
    cuerpo.appendChild(candado);
  }

  caja.appendChild(cuerpo);

  if (!bloqueada) {
    caja.addEventListener('click', () => abrirDia(recuerdo, caja));
    if (puedeTilt) activarTilt(caja);
  }

  return caja;
}

function activarTilt(caja) {
  caja.addEventListener('mousemove', (e) => {
    const r = caja.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    caja.style.setProperty('--ry', (px * 14).toFixed(2) + 'deg');
    caja.style.setProperty('--rx', (-py * 14).toFixed(2) + 'deg');
  });
  caja.addEventListener('mouseleave', () => {
    caja.style.setProperty('--ry', '0deg');
    caja.style.setProperty('--rx', '0deg');
  });
}

function renderizarCalendario() {
  calendarioEl.innerHTML = '';
  recuerdos.forEach((r) => calendarioEl.appendChild(crearCaja(r)));
  actualizarHeader();
  actualizarProgreso();
}

/* ============ ABRIR ============ */
let ultimoFoco = null;

function abrirDia(recuerdo, cajaEl) {
  ultimoFoco = cajaEl;

  if (!abiertas.includes(recuerdo.dia)) {
    abiertas.push(recuerdo.dia);
    try { localStorage.setItem('adviento_abiertas', JSON.stringify(abiertas)); } catch (e) {}
    actualizarProgreso();
  }

  cajaEl.classList.add('abierta');
  cajaEl.setAttribute('aria-expanded', 'true');

  abrirModal(recuerdo);
}

function abrirModal(recuerdo) {
  const fotoSrc = recuerdo.foto || '';
  contenidoModal.innerHTML = `
    <div class="sello-cera" aria-hidden="true">${recuerdo.dia}</div>
    <div class="marco-foto">
      <img src="${fotoSrc}" alt="Recuerdo del día ${recuerdo.dia}" class="imagen-recuerdo"
           onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
      <div class="placeholder-imagen">La foto del objeto físico<br>va aquí</div>
    </div>
    <div class="texto-modal">
      <span class="dia-badge">Día ${recuerdo.dia} de ${totalDias}</span>
      <h2 class="titulo-modal" id="titulo-modal">${recuerdo.titulo}</h2>
      <div class="objeto-modal">${recuerdo.objetoFisico}</div>
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

  // Foco atrapado dentro del modal
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

/* ============ INICIO ============ */
renderizarCalendario();
