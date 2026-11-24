/**
 * Admin — Lógica para editar los 31 recuerdos
 */

const adminGrid = document.getElementById('admin-grid');
const mensajeArea = document.getElementById('mensaje-area');
const btnGuardar = document.getElementById('btn-guardar');
const btnExportar = document.getElementById('btn-exportar');
const btnImportar = document.getElementById('btn-importar');
const inputImportar = document.getElementById('input-importar');

// Trabajar sobre una copia editable
let datosEditables = JSON.parse(JSON.stringify(window.datosCalendario));
let recuerdos = datosEditables.recuerdos;

// Mostrar mensaje temporal
function mostrarMensaje(texto, tipo = 'exito') {
  mensajeArea.innerHTML = `<div class="mensaje mensaje-${tipo}">${texto}</div>`;
  setTimeout(() => { mensajeArea.innerHTML = ''; }, 4000);
}

// Renderizar tarjetas de admin
function renderAdmin() {
  adminGrid.innerHTML = '';
  recuerdos.forEach(recuerdo => {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-admin';

    const num = document.createElement('div');
    num.className = 'numero-admin';
    num.textContent = `#${recuerdo.dia}`;

    const labelTitulo = document.createElement('div');
    labelTitulo.className = 'label-edit';
    labelTitulo.textContent = 'Título';
    const inputTitulo = document.createElement('input');
    inputTitulo.className = 'input-edit';
    inputTitulo.value = recuerdo.titulo;
    inputTitulo.dataset.campo = 'titulo';
    inputTitulo.dataset.dia = recuerdo.dia;

    const labelObjeto = document.createElement('div');
    labelObjeto.className = 'label-edit';
    labelObjeto.textContent = 'Objeto físico';
    const inputObjeto = document.createElement('input');
    inputObjeto.className = 'input-edit';
    inputObjeto.value = recuerdo.objetoFisico;
    inputObjeto.dataset.campo = 'objetoFisico';
    inputObjeto.dataset.dia = recuerdo.dia;

    const labelDesc = document.createElement('div');
    labelDesc.className = 'label-edit';
    labelDesc.textContent = 'Descripción';
    const inputDesc = document.createElement('input');
    inputDesc.className = 'input-edit';
    inputDesc.value = recuerdo.descripcion;
    inputDesc.dataset.campo = 'descripcion';
    inputDesc.dataset.dia = recuerdo.dia;

    const labelFoto = document.createElement('div');
    labelFoto.className = 'label-edit';
    labelFoto.textContent = 'Ruta de la foto';
    const inputFoto = document.createElement('input');
    inputFoto.className = 'input-edit';
    inputFoto.value = recuerdo.foto;
    inputFoto.dataset.campo = 'foto';
    inputFoto.dataset.dia = recuerdo.dia;

    const dulceWrap = document.createElement('div');
    dulceWrap.className = 'checkbox-wrap';
    const inputDulce = document.createElement('input');
    inputDulce.type = 'checkbox';
    inputDulce.checked = recuerdo.tieneDulce;
    inputDulce.dataset.campo = 'tieneDulce';
    inputDulce.dataset.dia = recuerdo.dia;
    const labelDulce = document.createElement('span');
    labelDulce.textContent = '¿Tiene dulce / detalle físico?';
    dulceWrap.appendChild(inputDulce);
    dulceWrap.appendChild(labelDulce);

    const labelNota = document.createElement('div');
    labelNota.className = 'label-edit';
    labelNota.textContent = 'Nota física';
    const inputNota = document.createElement('input');
    inputNota.className = 'input-edit';
    inputNota.value = recuerdo.notaFisica;
    inputNota.dataset.campo = 'notaFisica';
    inputNota.dataset.dia = recuerdo.dia;

    const acciones = document.createElement('div');
    acciones.className = 'acciones-admin';

    // Eventos de cambio en tiempo real
    [inputTitulo, inputObjeto, inputDesc, inputFoto, inputNota].forEach(input => {
      input.addEventListener('input', (e) => {
        const dia = parseInt(e.target.dataset.dia);
        const campo = e.target.dataset.campo;
        const r = recuerdos.find(r => r.dia === dia);
        if (r) r[campo] = e.target.value;
      });
    });

    inputDulce.addEventListener('change', (e) => {
      const dia = parseInt(e.target.dataset.dia);
      const r = recuerdos.find(r => r.dia === dia);
      if (r) r.tieneDulce = e.target.checked;
    });

    tarjeta.appendChild(num);
    tarjeta.appendChild(labelTitulo);
    tarjeta.appendChild(inputTitulo);
    tarjeta.appendChild(labelObjeto);
    tarjeta.appendChild(inputObjeto);
    tarjeta.appendChild(labelDesc);
    tarjeta.appendChild(inputDesc);
    tarjeta.appendChild(labelFoto);
    tarjeta.appendChild(inputFoto);
    tarjeta.appendChild(dulceWrap);
    tarjeta.appendChild(labelNota);
    tarjeta.appendChild(inputNota);
    tarjeta.appendChild(acciones);

    adminGrid.appendChild(tarjeta);
  });
}

// Guardar en localStorage (simulado) y notificar
btnGuardar.addEventListener('click', () => {
  localStorage.setItem('adviento_datos_editables', JSON.stringify(datosEditables));
  mostrarMensaje('Cambios guardados en el navegador. Exporta el JSON para usarlos en producción.', 'exito');
});

// Exportar JSON descargable
btnExportar.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(datosEditables, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'datos_adviento.json';
  a.click();
  URL.revokeObjectURL(url);
  mostrarMensaje('JSON exportado. Reemplaza el archivo datos.js con este contenido antes de subir a Netlify.', 'exito');
});

// Importar JSON
btnImportar.addEventListener('click', () => {
  inputImportar.click();
});

inputImportar.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const importado = JSON.parse(ev.target.result);
      if (importado.recuerdos && Array.isArray(importado.recuerdos)) {
        datosEditables = importado;
        recuerdos = datosEditables.recuerdos;
        renderAdmin();
        mostrarMensaje('Datos importados correctamente. Guarda los cambios.', 'exito');
      } else {
        mostrarMensaje('El archivo JSON no tiene el formato esperado.', 'error');
      }
    } catch (err) {
      mostrarMensaje('Error al leer el JSON.', 'error');
    }
  };
  reader.readAsText(file);
});

// Cargar datos previos si existen en localStorage
const previos = localStorage.getItem('adviento_datos_editables');
if (previos) {
  try {
    datosEditables = JSON.parse(previos);
    recuerdos = datosEditables.recuerdos;
  } catch (e) {
    // Ignorar si está corrupto
  }
}

renderAdmin();
