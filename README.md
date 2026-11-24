# 31 Días, 31 Recuerdos — Calendario de Adviento

Página web para acompañar un calendario de adviento físico con 31 cajitas y recuerdos del pasado.

## Estructura

```
calendario-adviento/
├── index.html          # Página pública del calendario
├── admin.html          # Panel de administración
├── datos.js            # Los 31 recuerdos (editable desde admin.html)
├── style.css           # Estilos (papel kraft, tinta, serif+sans-serif)
├── script.js           # Lógica del calendario (qué día abrir)
├── admin.js            # Lógica del admin (editar, exportar, importar)
├── recuerdos/
│   └── fotos/          # Imágenes de los objetos físicos (dia1.jpg, dia2.jpg...)
└── README.md
```

## Cómo usar

1. Abre `index.html` en tu navegador para ver el calendario.
2. Abre `admin.html` para editar títulos, objetos físicos, descripciones y rutas de fotos.
3. Los cambios se guardan temporalmente en tu navegador (`localStorage`).
4. Usa **Exportar JSON** para descargar `datos_adviento.json` y reemplazar el contenido de `datos.js` antes de subir a Netlify.

### Extras de la interfaz

- **Tema claro/oscuro:** botón de sol/luna arriba a la derecha; se recuerda tu elección.
- **Vista previa:** abre `index.html?preview` para desbloquear las 31 cajitas antes de diciembre.
- **3D:** las cajitas se inclinan con el puntero y la tapa gira al abrirlas. Respeta `prefers-reduced-motion`.

## Desplegar en Netlify

1. Sube esta carpeta a un repositorio de GitHub.
2. Conecta el repositorio a [Netlify](https://netlify.com).
3. Netlify detectará el sitio estático y lo desplegará automáticamente.
4. La URL será algo como `https://tu-sitio.netlify.app`.

## Conectar con Google Sheets (opcional)

Si quieres editar los recuerdos desde Google Sheets en lugar de editar archivos:

1. Crea un archivo de Google Sheets con columnas: `dia`, `titulo`, `objetoFisico`, `descripcion`, `foto`, `tieneDulce`, `notaFisica`.
2. Abre **Extensiones > Apps Script** en tu hoja de cálculo.
3. Pega el siguiente código (ajustando el ID de tu hoja):

```javascript
function doGet(e) {
  var hoja = SpreadsheetApp.openById('TU_ID_DE_LA_HOJA').getSheets()[0];
  var datos = hoja.getDataRange().getValues();
  var recuerdos = [];
  for (var i = 1; i < datos.length; i++) {
    recuerdos.push({
      dia: datos[i][0],
      titulo: datos[i][1],
      objetoFisico: datos[i][2],
      descripcion: datos[i][3],
      foto: datos[i][4],
      tieneDulce: datos[i][5] === 'TRUE',
      notaFisica: datos[i][6] || ''
    });
  }
  return ContentService.createTextOutput(JSON.stringify({ recuerdos: recuerdos }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Publica como **Web App** (Access: Anyone).
5. Copia la URL del endpoint.
6. En `script.js`, reemplaza la carga de `window.datosCalendario` por un `fetch` a esa URL.

> ⚠️ Como este sitio está en Netlify (estático), para leer directamente desde Google Sheets necesitas manejar CORS o usar un proxy sencillo (Netlify Functions). Si solo quieres editar rápido, usa el `admin.html` y exporta el JSON.

## Las 31 cajitas (ejemplos incluidos)

- Día 1: Tickets de cine + bienvenida
- Día 2: Chocolate y detalle
- Días 3–31: Fotos, boletos, cartas, semillas, imanes, recetas, pulseras, etc.

Edita todo desde el admin para adaptarlo a tus recuerdos reales.

## Créditos

Diseño deliberado, código escrito a mano (sin IA generativa). Tailwind-free CSS propio.
