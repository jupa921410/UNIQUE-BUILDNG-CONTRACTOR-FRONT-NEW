# Conversiones de OpenAI Ads

La integración conecta `/api/contact` y `/api/qualify` del repositorio vecino
`UNIQUE-BUILDING-CONTRACTORS-BACKEND` con el píxel instalado en `index.html`.

## Comportamiento

- Cada formulario tiene una casilla opcional de medición, desmarcada inicialmente.
  No depende del consentimiento SMS y no es necesaria para enviar una solicitud.
- Con esa autorización, Laravel guarda primero el lead y devuelve `conversion`
  con el ID del evento, el ID del píxel y los hashes SHA-256 del correo disponible
  y de una referencia real del CRM. El correo se recorta y convierte a minúsculas
  antes de calcular el hash. Una calificación vinculada reutiliza la referencia
  del lead o cliente original.
- El navegador actualiza `oaiq('init', { pixelId, user })` antes de enviar
  `lead_created`. El servidor usa el mismo píxel, tipo de evento e identificador.
  Los reintentos conservan también la fecha original del evento.
- El backend transmite `oppref` y `user.obref` sin alterar cuando existen, la IP,
  el user agent y la página sin parámetros ni fragmentos. No transmite nombre,
  teléfono, mensajes del proyecto ni consentimiento SMS a esta API.
- Sin autorización, con errores de validación o al activarse el honeypot del
  cuestionario, no se genera la conversión. Los fallos de medición no impiden
  guardar el lead. Las respuestas antiguas o sin JSON tampoco rompen el formulario.
- Si no se ha configurado la clave de CAPI, el píxel puede usar los hashes de la
  respuesta, pero no se encola ningún envío al servidor de OpenAI.

## Activación en producción

1. Desplegar los cambios del backend y del frontend juntos, o el backend primero.
   El frontend necesita el nuevo campo `conversion` de la respuesta para medir
   las solicitudes confirmadas.
2. Crear una **clave de Conversions API** en la sección de conversiones de Ads
   Manager. Es una credencial distinta de `OPENAI_API_KEY` y de la clave de
   administración de anuncios. Configurar **solo en el entorno del backend**:

   ```dotenv
   OPENAI_ADS_PIXEL_ID=4jVDBk7omJVdZBSeCKvaAn
   OPENAI_CONVERSIONS_API_KEY=<configurar de forma privada en el servidor>
   OPENAI_CONVERSIONS_QUEUE_CONNECTION=database
   ```

   El ID debe coincidir con `index.html`. Nunca guardar la clave en Git, en el
   frontend ni en una variable `VITE_`.
3. Actualizar la configuración del despliegue y reiniciar los workers:

   ```sh
   php artisan config:cache
   php artisan queue:restart
   ```

4. Mantener un worker supervisado para la cola `default` de la conexión
   `database`. La tabla `jobs` debe estar disponible mediante las migraciones
   existentes del proyecto:

   ```sh
   php artisan queue:work database --queue=default --tries=5 --timeout=30
   ```

   El job tiene cinco intentos con esperas de 60, 300, 1800 y 7200 segundos. No
   usar `sync` si se requieren reintentos persistentes y respuestas rápidas.
5. Abrir **Conversions → Data Source → Test** para el píxel. Completar una
   solicitud de prueba autorizada con la casilla marcada y revisar el flujo de
   eventos: deben recibirse los canales `pixel_sdk` y `server_to_server` con el
   mismo ID. Las pruebas del píxel cuentan en las métricas normales; las pruebas
   automatizadas de este cambio solo usan HTTP simulado.
6. Revisar `php artisan queue:failed` si no aparece el evento de servidor. Tras
   corregir la configuración, reintentar únicamente los jobs de esta integración
   que sigan dentro de los últimos siete días. No reproducir todos los jobs del
   sistema ni crear eventos ficticios para eliminar una advertencia.

## Configuración de la campaña

La adopción del objetivo del 0 % es independiente del código. En Ads Manager hay
que crear o seleccionar el evento estándar `lead_created` de esta fuente y
vincularlo a una campaña optimizada para conversiones. No se han modificado
campañas, presupuestos ni objetivos desde este repositorio.

La cobertura de correo e ID externo no será necesariamente del 100 %: las
visitas anónimas (`contents_viewed`) no contienen un contacto identificado, el
correo es opcional y la medición de solicitudes requiere autorización. Los
eventos históricos conservan la información con la que se recibieron.

## Verificación local

Frontend:

```sh
npm run test:conversions
npm run lint
npm run build
```

Si Node necesita el almacén de certificados de Windows, ejecutar la compilación
con `NODE_OPTIONS=--use-system-ca`; no desactivar la validación TLS.

Backend: en una consola dedicada a pruebas, usar SQLite en memoria y rutas de
caché que no existan para evitar la configuración de desarrollo cacheada:

```powershell
$env:APP_ENV = 'testing'
$env:APP_CONFIG_CACHE = Join-Path $env:TEMP 'ubc-conversions-test-config-uncached.php'
$env:APP_ROUTES_CACHE = Join-Path $env:TEMP 'ubc-conversions-test-routes-uncached.php'
$env:DB_CONNECTION = 'sqlite'
$env:DB_DATABASE = ':memory:'
$env:DB_URL = ''
$env:MAIL_MAILER = 'array'
$env:QUEUE_CONNECTION = 'sync'
php artisan test --filter=OpenAIConversionsTest
```

El propio test rechaza cualquier conexión que no sea SQLite `:memory:` antes
de ejecutar migraciones. Las pruebas verifican las dos rutas, consentimiento,
hashes, deduplicación, atribución, honeypot, errores de cola y reintentos sin
enviar datos reales a OpenAI.

## Documentación oficial

- [Measurement Pixel: datos de usuario](https://developers.openai.com/ads/measurement-pixel#send-user-data)
- [Conversions API](https://developers.openai.com/ads/conversions-api)
- [Conversion Tracking: campañas](https://developers.openai.com/ads/conversion-tracking)
