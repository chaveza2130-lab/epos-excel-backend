# EPOS Backend con Excel — Despliegue en Railway sin instalar nada

Este backend NO usa Postgres. Lee los datos directo de un archivo
`data/events.xlsx`. Todo el proceso se hace desde el navegador:
GitHub (subir archivos por web) + Railway (dashboard web).

## 1. Sube este proyecto a GitHub SIN usar Git en tu computadora

1. Entra a https://github.com y crea una cuenta si no tienes.
2. Click **+ (arriba a la derecha) → New repository**.
   - Nombre: `epos-excel-backend`
   - Público o privado, como prefieras.
   - Click **Create repository**.
3. En la página del repo recién creado, busca el link **"uploading an existing file"**
   (o ve a **Add file → Upload files**).
4. Arrastra TODOS los archivos de esta carpeta tal cual (manteniendo la
   subcarpeta `data/` con `events.xlsx` adentro):
   - `server.js`
   - `package.json`
   - `data/events.xlsx`
5. Escribe un mensaje de commit ("proyecto inicial") y click **Commit changes**.

Ya tienes el código en GitHub sin instalar Git ni nada en tu PC.

## 2. Crear el proyecto en Railway (todo por navegador)

1. Entra a https://railway.app y crea una cuenta (puedes usar tu cuenta de GitHub para entrar más rápido).
2. Click **New Project → Deploy from GitHub repo**.
3. Si es la primera vez, Railway te pedirá autorizar acceso a tu cuenta de
   GitHub (solo un click, no se instala nada en tu computadora).
4. Selecciona el repositorio `epos-excel-backend`.
5. Railway detecta el `package.json`, instala dependencias y corre
   `npm start` automáticamente. En 1-2 minutos tu servicio queda desplegado.

## 3. Generar la URL pública

1. Dentro del proyecto, click en el servicio (la cajita con el nombre del repo).
2. Ve a la pestaña **Settings → Networking**.
3. Click **Generate Domain**. Railway te da una URL tipo:
   ```
   https://epos-excel-backend-production.up.railway.app
   ```

## 4. Probar que funciona

Abre en el navegador (sin instalar nada, solo pegar la URL):

```
https://epos-excel-backend-production.up.railway.app/api/container-events
```

Deberías ver el JSON con los eventos del Excel.

Puedes filtrar igual que antes, por ejemplo:
```
.../api/container-events?container=HLBU9826826
.../api/container-events?from=2026-05-01&to=2026-07-31
```

## 5. Cómo actualizar los datos (sin instalar nada)

Cuando tengas datos nuevos o actualizados:

1. Edita `events.xlsx` en tu computadora con Excel normal (respetando los
   encabezados de columna: `container_no, event_code, event_date, event_time,
   match_code, loc, next_loc, end_loc, dr, mot, reference, dp_voy,
   schedule_voy, vessel, remark`).
2. Ve a tu repositorio en GitHub → carpeta `data` → click en `events.xlsx`
   → ícono de lápiz o botón **"Upload files"** para reemplazarlo.
3. Sube la nueva versión y confirma el commit.
4. Railway detecta el cambio en GitHub y **redepliega automáticamente** en
   1-2 minutos. No necesitas tocar Railway para nada.

## 6. Conectar el frontend (el grid HTML)

En el archivo del grid, reemplaza la función mock por:

```js
async function fetchEvents(filters) {
  const params = new URLSearchParams(filters);
  const res = await fetch(`https://epos-excel-backend-production.up.railway.app/api/container-events?${params}`);
  return res.json();
}
```

## Nota importante sobre esta arquitectura

Leer un Excel como "base de datos" es rápido de montar y perfecto para
empezar o para volúmenes de datos chicos/medianos (cientos o pocos miles de
filas). Si más adelante el archivo crece mucho o varias personas necesitan
escribir datos al mismo tiempo, migrar a Postgres (como en la versión
anterior que armamos) evita problemas de concurrencia y de rendimiento.
