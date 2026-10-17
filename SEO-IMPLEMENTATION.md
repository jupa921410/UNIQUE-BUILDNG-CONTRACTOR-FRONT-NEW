Cambios SEO preparados
=====================

El build genera 57 URLs del sitemap: home, servicios, blog, portfolio, páginas informativas y 18 localidades. Antes había 13 localidades en `PHASE1_CITIES`, no 14. Las cinco nuevas son St. Pete Beach, Clearwater Beach, Belleair, South Tampa y Davis Islands.

- Las 18 páginas locales y About, Service Areas, Specialized, Resources, Privacy y Terms se renderizan desde sus componentes React durante el build. Incluyen título, descripción, canonical, un H1 y contenido visible en el HTML inicial.
- Apache sirve `404.html` con estado 404 para páginas y archivos inexistentes. Solo las rutas privadas conocidas y Thank You usan el shell de la SPA. Las rutas públicas nuevas necesitan un archivo generado en el build.
- El header `X-Robots-Tag: noindex, nofollow` se aplica únicamente a hosts que comienzan por `test.`. No se aplica a `www`. Requiere Apache con mod_headers y AllowOverride habilitados.
- `businessSchema.js` centraliza el negocio y genera areaServed desde las mismas localidades que las rutas y el sitemap.
- `/services/condo-renovations` se incluye en servicios, navegación y sitemap.
- Las imágenes usadas en componentes tienen variantes WebP de hasta 150.000 bytes, srcset y lazy loading. Las imágenes principales usan carga eager. Los panoramas conservan su proporción equirectangular; el visor usa la versión optimizada. Se conservan los originales de trabajo en `src/assets`.
- Google Fonts se aloja en `/fonts`, con font-display: swap y licencias OFL. Se eliminó el CSS remoto de AOS, que no se usaba.
- Se normalizaron teléfonos visibles y enlaces tel. Se eliminaron meta keywords. Cada página tiene una tarjeta OG/Twitter propia de 1200×630.
- Cuatro URLs de portfolio añaden la ciudad y reciben redirecciones 301 desde sus URLs anteriores. El adaptador conserva los slugs originales para consultar la API.

Datos pendientes del propietario
--------------------------------

1. Enlace de Google Business o dirección exacta, código postal, coordenadas y horario verificados. Enlaces oficiales de Google Business, Facebook, Instagram y Houzz. No se han inventado estos valores.
2. Ciudad del proyecto `residential-home` (la API dice “BOOKVILLE FL 34416”) y del proyecto `new-construction` (la API solo contiene una calle). Sus URLs actuales se conservan hasta confirmar las ubicaciones.
3. Si se esperaba una decimocuarta localidad original, identificarla: en el código solo había 13.

Build y publicación
------------------

Ejecutar `npm run build` y después `node scripts/check-seo.mjs`. El build necesita acceso a la API pública del portfolio y sus imágenes; cualquier fallo interrumpe el build para evitar publicar URLs incompletas. En entornos con certificados corporativos puede ser necesario habilitar los certificados del sistema de Node.

Publicar todo el contenido de `dist`, incluido `.htaccess`. Reemplazar el directorio de destino de forma limpia para no conservar páginas antiguas eliminadas del CMS. Revisar las reglas particulares del hosting antes de sustituir su `.htaccess`. Repetir el build después de publicar o retirar proyectos del CMS: el sitemap del portfolio solo anuncia páginas presentes en el build desplegado.

Validación realizada: ESLint; comprobación del HTML de las 57 URLs; schema JSON válido; correspondencia de 18 localidades; tamaño de variantes y previews; pruebas HTTP sobre Apache local con Host de test y www (200, 404, 301 y aislamiento del header noindex). No se ha desplegado al servidor público.
