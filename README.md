# 31 días, 31 recuerdos — Calendario de Adviento

Página web para acompañar un calendario de adviento físico con **31 cajitas** y recuerdos del pasado. Cada día de diciembre se abre una cajita y se revela un objeto, una historia y (a veces) un detalle dulce.

- Diseño **solo en modo nocturno**, con acentos **rosados y dorados**.
- Las cajitas muestran **solo el número**: todo es sorpresa hasta abrirlas.
- Hecho por Charlie con mucho amor ❤️

## Estructura del proyecto

```
Calendario de Adviento/
├── index.html          # Página pública del calendario
├── datos.js            # ⭐ Los 31 recuerdos (lo único que se edita)
├── style.css           # Estilos (tema nocturno rosado)
├── script.js           # Lógica del calendario
├── admin.html          # Panel de administración (sin enlace público)
├── admin.js            # Lógica del panel
├── recuerdos/
│   └── fotos/          # Fotos: dia1.jpg, dia2.jpg, ...
└── README.md
```

## Ver el calendario en tu computadora

1. Abre `index.html` en tu navegador.
2. Para desbloquear las 31 cajitas antes de diciembre, abre `index.html?preview`.
3. El panel de administración se abre directamente en `admin.html` (no está enlazado desde la página pública).

---

## Publicarlo en GitHub Pages

El sitio es estático, así que GitHub Pages lo sirve sin configuración extra.

1. Entra al repositorio: https://github.com/Charlea-In/Calendario-de-Adviento
2. Ve a **Settings → Pages**.
3. En **Source**, elige **Deploy from a branch**.
4. En **Branch**, selecciona `main` y la carpeta **`/ (root)`**.
5. Pulsa **Save**.
6. Espera 1–2 minutos. La página quedará en:

   **https://charlea-in.github.io/Calendario-de-Adviento/**

Cada vez que hagas `push` a `main`, GitHub Pages vuelve a publicar automáticamente.

---

## Cómo actualizar los recuerdos

Los recuerdos viven en `datos.js`. Hay dos formas de editarlos: con el panel + IA, o manualmente.

### Opción A — Panel de administración + IA (la más fácil)

1. Abre `admin.html` en tu navegador.
2. Edita los campos de las cajitas que quieras (título, objeto, descripción, foto, dulce).
3. Pulsa **Guardar borrador** para no perder los cambios.
4. Pulsa **Copiar para datos.js** — se copia todo listo para pegar.
5. Dile a la IA (OpenCode):

   > “Pega este contenido en `datos.js` y haz commit y push.”

   Pega el contenido cuando te lo pida.
6. Listo: GitHub Pages se actualiza solo en ~1 minuto.

### Opción B — Manual

1. En `admin.html`, edita y pulsa **Copiar para datos.js** (o **Exportar JSON**).
2. Abre el archivo `datos.js` en un editor (VS Code, Notepad++…).
3. Selecciona todo (`Ctrl+A`) y pega lo copiado (`Ctrl+V`). Guarda.
4. Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
cd "C:\Users\carlo\OneDrive\Documentos\Calendario de Adviento"
git add .
git commit -m "Actualizo recuerdos"
git push
```

5. Espera ~1 minuto y recarga la página publicada.

### Opción C — Editar `datos.js` a mano

Cada recuerdo tiene estos campos:

| Campo | Qué es | Ejemplo |
|-------|--------|---------|
| `dia` | Número del 1 al 31 | `1` |
| `titulo` | Título del recuerdo | `"Nuestra primera salida al cine"` |
| `objetoFisico` | Lo que hay dentro de la cajita | `"Tickets de cine + mensaje"` |
| `descripcion` | La historia que se revela | `"Ese inicio donde todo comenzó..."` |
| `foto` | Ruta de la imagen | `"recuerdos/fotos/dia1.jpg"` |
| `tieneDulce` | ¿Lleva chocolate/dulce? | `true` o `false` |
| `notaFisica` | Nota corta al final | `"Guarda los tickets en el sobre."` |

---

## Agregar las fotos

1. Guarda tus fotos en `recuerdos/fotos/` con el nombre del día: `dia1.jpg`, `dia2.jpg`, …, `dia31.jpg`.
2. En `datos.js` (o en el panel), el campo `foto` debe apuntar a esa ruta.
3. Si una foto no existe, se muestra un marco con el texto “La foto del objeto físico va aquí”.
4. Haz `commit` y `push` para publicarlas.

---

## Notas

- **Sorpresa total:** las cajitas solo muestran el número; el objeto y la historia aparecen al abrir.
- **Progreso:** cuántas cajitas se han abierto se guarda en el navegador de cada persona.
- **Vista previa:** `index.html?preview` desbloquea todo para revisar el contenido.
- **Modo nocturno:** el sitio usa siempre el tema oscuro rosado.
