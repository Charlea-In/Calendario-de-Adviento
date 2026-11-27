# Guía para dictar los recuerdos, día por día

Este archivo explica cómo pedirle la información a otra IA para que después Charlie
la pase al calendario (`datos.js`) sin tener que reescribir nada.

---

## 1. Prompt para la otra IA (copiar y pegar)

```
Vas a ayudarme a escribir el contenido de un calendario de adviento de 31 días.
Cada día corresponde a una cajita con un objeto físico y un recuerdo de mi relación
de pareja. Yo te voy a dictar la historia real de cada foto, con mis palabras.
Tu trabajo es ordenarla, corregir ortografía y redacción, y devolverla en un
formato fijo. NO inventes hechos, nombres, fechas ni detalles que yo no te haya dicho.

### Reglas de escritura
- Español neutro, en primera persona (habla Charlie).
- Tono íntimo, cálido y natural. Nada de frases de tarjeta genérica ni de IA.
- Conserva mis expresiones y apodos tal como te los dicto (por ejemplo: Jacky, Marcella, "la refri").
- Corrige tildes, puntuación y concordancia, pero no cambies el sentido ni el cariño.
- No repitas "Día N" dentro de la historia: el número ya se muestra aparte.
- No uses emojis.

### Límites de extensión
- título: 2 a 7 palabras, sin punto final.
- objeto: 2 a 8 palabras (qué objeto físico hay dentro de la caja).
- historia: 1 a 3 frases, máximo 220 caracteres.
- nota: 1 frase corta, máximo 90 caracteres (puede ir vacía).

### Formato de salida (exacto, un bloque por día)

DÍA 12
título: El botón de la chaqueta
objeto: Botón de una prenda especial
historia: Esa chaqueta o suéter que usabas y que todavía recuerdo cada vez que te acercas.
nota: Los botones pequeños sostienen cosas grandes.
dulce: no
foto: dia12.jpg

### Reglas del bloque
- Usa siempre esas seis líneas, en ese orden, con esos nombres en minúscula y con dos puntos.
- Si un día no tiene objeto físico, escribe en "objeto": Sorpresa (después de responder)
- "dulce" solo puede ser "sí" o "no".
- "foto" siempre es diaN.jpg, con el número del día.
- Si te dicto varios días, sepáralos con una línea en blanco.
- Si algo no te lo dicté, escribe: FALTA INFO y pregúntame.

Empieza preguntándome el día y dictándome la historia.
```

---

## 2. Lo que Charlie me manda a mí

Puede ser **un día o los 31**, en el mismo formato del prompt. Ejemplo:

```
DÍA 7
título: La promesa
objeto: El anillo
historia: El día que decidí regalarte ese anillo supe en mi corazón que algún día serías mi prometida.
nota: ¿Aún tienes el anillo?
dulce: no
foto: dia7.jpg
```

Con eso yo:

1. Reescribo `datos.js` con esos días (sin tocar los demás).
2. Reviso tildes y coherencia con el resto del calendario.
3. Subo la versión del cacheo (`?v=N`) para que se vea al instante.
4. Hago commit y push.
5. Reviso la página publicada para confirmar que carga.

---

## 3. Las fotos

- Guarda la foto definitiva como `recuerdos/fotos/diaN.jpg` (sobrescribiendo la anterior).
- El nombre no cambia nunca: así `datos.js` no hay que tocarlo.
- Si me pasas las fotos nuevas junto con los textos, las subo en el mismo commit.
- Formato recomendado: JPG, lado largo entre 1000 y 1500 px, menos de 500 KB por foto.
