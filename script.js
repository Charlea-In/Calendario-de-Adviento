/**
 * Calendario de Adviento — Lógica principal
 */

const datos = window.datosCalendario;
const recuerdos = datos.recuerdos;
const totalDias = datos.calendario.totalDias;

const calendarioEl = document.getElementById('calendario');
const diaActualEl = document.getElementById('dia-actual');
const estadoFechaEl = document.getElementById('estado-fecha');
const modalFondo = document.getElementById('modal-fondo');
const cerrarModal = document.getElementById('cerrar-modal');
const contenidoModal = document.getElementById('contenido-modal');

// Determinar el día "activo" para abrir
// Si estamos en diciembre del año del calendario, usamos el día real.
// Si no, permitimos ver desde el día 1 (modo previa) pero solo abrir hasta hoy.
const hoy = new Date();
const esDiciembre = hoy.getMonth() === 11; // 0-indexed, 11 = diciembre
const esAnioCalendario = hoy.getFullYear() === datos.calendario.anio;
const diaHoy = esDiciembre && esAnioCalendario ? hoy.getDate() : 1;

// Estado de qué cajas están abiertas (guardado en localStorage)
let abiertas = JSON.parse(localStorage.getItem('adviento_abiertas') || '[]');

// Actualizar header
function actualizarHeader() {
  if (esDiciembre && esAnioCalendario) {
    diaActualEl.textContent = diaHoy;
    estadoFechaEl.textContent = `Día ${diaHoy} de ${totalDias} — ¡Hoy es ${hoy.getDate()} de diciembre!`;
  } else {
    diaActualEl.textContent = '1';
    estadoFechaEl.textContent = `Vista previa — El calendario comienza el 1 de diciembre de ${datos.calendario.anio}`;
  }
}

// Crear una caja
function crearCaja(recuerdo) {
  const caja = document.createElement('div');
  caja.className = `caja ${abiertas.includes(recuerdo.dia) ? 'abierta' : ''} ${recuerdo.dia > diaHoy ? 'bloqueada' : ''}`;
  caja.dataset.dia = recuerdo.dia;

  const numero = document.createElement('div');
  numero.className = 'numero-dia';
  numero.textContent = recuerdo.dia;

  const objeto = document.createElement('div');
  objeto.className = 'objeto-fisico';
  objeto.textContent = recuerdo.objetoFisico;

  const dulce = document.createElement('div');
  dulce.className = 'indicador-dulce';
  if (!recuerdo.tieneDulce) dulce.style.opacity = '0';

  const candado = document.createElement('div');
  candado.className = 'candado';

  caja.appendChild(numero);
  caja.appendChild(objeto);
  caja.appendChild(dulce);
  caja.appendChild(candado);

  // Solo permitir clic si no está bloqueada
  if (recuerdo.dia <= diaHoy) {
    caja.addEventListener('click', () => abrirRecuerdo(recuerdo.dia));
  }

  return caja;
}

// Renderizar todas las cajas
function renderizarCalendario() {
  calendarioEl.innerHTML = '';
  recuerdos.forEach(recuerdo => {
    calendarioEl.appendChild(crearCaja(recuerdo));
  });
  actualizarHeader();
}

// Abrir el recuerdo del día
function abrirRecuerdo(dia) {
  const recuerdo = recuerdos.find(r => r.dia === dia);
  if (!recuerdo) return;

  // Marcar como abierta si no lo está
  if (!abiertas.includes(dia)) {
    abiertas.push(dia);
    localStorage.setItem('adviento_abiertas', JSON.stringify(abiertas));
    renderizarCalendario();
  }

  // Construir contenido del modal
  const html = `
    <button class="cerrar-modal" id="cerrar-modal" aria-label="Cerrar">×</button>
    <div class="contenido-modal">
      <span class="dia-badge">Día ${recuerdo.dia} de ${totalDias}</span>
      <h2 class="titulo-modal">${recuerdo.titulo}</h2>
      <div class="objeto-modal">${recuerdo.objetoFisico}</div>
      <p class="descripcion-modal">${recuerdo.descripcion}</p>
      ${recuerdo.tieneDulce ? '<div class="dulce-badge"><span>🍫</span>Contiene un detalle dulce</div>' : ''}
      ${recuerdo.notaFisica ? `<p class="nota-fisica-modal">${recuerdo.notaFisica}</p>` : ''}
      <div style="margin-top:16px;">
        <img src="${recuerdo.foto}" alt="Recuerdo día ${recuerdo.dia}" class="imagen-recuerdo" onerror="this.style.display='none'; this.previousElementSibling.style.display='flex';">
        <div class="placeholder-imagen" style="display:none;">Foto del objeto físico</div>
      </div>
    </div>
  `;

  contenidoModal.innerHTML = html;
  modalFondo.classList.add('activo');

  // Reasignar cerrar (porque se recreó el HTML)
  document.getElementById('cerrar-modal').addEventListener('click', cerrarRecuerdo);
}

// Cerrar modal
function cerrarRecuerdo() {
  modalFondo.classList.remove('activo');
  contenidoModal.innerHTML = '';
}

// Clic fuera del modal para cerrar
modalFondo.addEventListener('click', (e) => {
  if (e.target === modalFondo) cerrarRecuerdo();
});

// Tecla ESC para cerrar
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') cerrarRecuerdo();
});

// Inicializar
renderizarCalendario();
