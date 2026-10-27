# Continuidad obligatoria entre conversaciones

**Proyecto nuevo:** https://github.com/IsaacMPP/JA_Proyecciones2

## Cómo continuar
1. Revisar en GitHub la rama activa, HEAD, PR abierto, checks de Actions y diferencias respecto a `main`.
2. Leer en su versión más reciente `docs/JA_MASTER.md`, `docs/REGISTRO_MAESTRO.md`, `docs/RUTA_CRITICA_ENTREGAS.md` y este archivo.
3. Confirmar lo implementado frente a los criterios de aceptación, separando revisiones de código, CI y pruebas manuales.
4. Respetar `CONTRIBUTING.md`: no fusionar, reescribir historia ni desplegar sin permiso.
5. Al terminar cada intervención con cambios: actualizar la bitácora y este punto de continuidad con SHA, errores y siguiente tarea.

## Estado inicial 2026-10-26
- Repositorio nuevo desde cero, sin código audiovisual ni historial heredado.
- `main` creado únicamente con README; fase 0 trabajada en `docs/fase0-gobernanza-arquitectura`.
- Objetivo inmediato: definir sistema multipantalla y contratos técnicos antes de programar.
- Importante: `IsaacMPP/Ja_Proyeccion` es el repositorio anterior. No continuar allí por accidente.

## Pendientes actuales
- Verificar PR y CI del arranque documental.
- Decidir arquitectura de reproducción, monitorización y persistencia antes de importar FreeShow o escribir componentes nuevos.
- Preparar pruebas físicas con laptop, televisor HDMI inalámbrico e iPad vía spacedesk; comparar nombres devueltos por Windows.

## Pull Request activo
PR #1: https://github.com/IsaacMPP/JA_Proyecciones2/pull/1 — borrador documental, no fusionar sin autorización.

## Requisitos definitivos confirmados por el usuario
FreeShow 1.6.7 es la base seleccionada. Recuperar diseño JA anterior, Biblia en español, Himnario y tres modos multimedia, pero rehacer selección multipantalla desde cero. OBS es referencia sólo para nombres/modelos y detección de monitores. Principal de proyección elegido por operador recibe los clics normales con audio; auxiliares sólo contenido visual, sin interferencias. Código de los archivos ZIP de referencia no ha sido importado. Ver JA_MASTER y ARQUITECTURA_MULTIPANTALLA para detalles.

## Último acuerdo de alcance (26-oct-2026)
Preservar completamente los controles y configuración funcionales de FreeShow. Si el operador proyecta por primera vez sin una salida principal, abrir asistente de elección de pantalla, permitir identificar y guardar principal en vez de enviar a todas o mostrar un error. Las secundarias son destinos independientes sin audio por defecto. Todas las capacidades nuevas deben tener su contraparte funcional en Configuración → Pantallas/salidas, con ajustes avanzados originales conservados. Fase 0 documental; aún sin importación del motor.

## Último avance de diseño
Se extrajo kit presentacional del encabezado anterior a `design/JAHeader.svelte` y `design/ja-theme.css`, con inventario de referencias en `design/README.md`. La base FreeShow todavía NO está importada y no hay aplicación ejecutable. No reutilizar cambios multipantalla antiguos. Recursos gráficos binarios pendientes.

## Estado efectivo después de la importación (26-oct-2026)
Nueva rama `feature/base-freeshow-diseno-ja` derivada de `docs/fase0-gobernanza-arquitectura`. FreeShow v1.6.7 importado por GitHub Actions run `40369975943`, con encabezado JA y `public/ja-logo.png`, `public/ja-hero.jpg`. Antes de avanzar: revisar HEAD, workflow, CI de compilación y los documentos maestros. No copiar el enrutamiento fallido del repositorio anterior; no fusionar ramas sin aprobación.

## Cambios recientes — instalador con versionado individual
En `feature/base-freeshow-diseno-ja` se añadieron `scripts/ja/prepare-version.cjs` y pasos a `.github/workflows/validate-ja-base.yml` para crear instalador Windows `JA-Proyecciones-2-2.0.<número>-x64.exe` diferente en cada ejecución y reintento. No declarar éxito hasta CI de empaquetado. Los cambios de versión se aplican temporalmente en CI, sin llenar Git de commits de versión. El PR #2 sigue en borrador; no fusionar sin autorización.

## CI optimizado
El workflow de Windows ahora corre una vez por push de código a `feature/base-freeshow-diseno-ja`, omite cambios documentales, cancela runs obsoletos de la rama y permite ejecución manual. No se modificó el versionado de instaladores. Confirmar CI del HEAD antes de considerar la compilación válida.

## Última recuperación visual
Se reemplazó sólo el componente de bienvenida `src/frontend/components/main/Splash.svelte` por la versión JA original, reutilizando logo y hero. Hay generación de icono e imágenes NSIS mediante `scripts/ja/create-installer-art.py`, conectada al workflow de Windows. Validar compilación/instalador de la versión más reciente y revisar en Windows la bienvenida y el asistente. El inicio de Electron no tiene aún una ventana de splash personalizada distinta de la portada. No fusionar PR #2 sin autorización.

## Actualización de pantalla de carga
También se personalizó `public/loading.html` con arte y textos JA conservando IPC de versión. A diferencia de `Splash.svelte`, ésta sí es la ventana de carga nativa de Electron. Validar ambas por separado en Windows.

## Ajustes JA recientes
Se modificó la paleta del tema predeterminado a azul/amarillo JA, encabezado de 68px, splash nativo y título; se desactivaron los dos update checkers de FreeShow, sin introducir aún canal JA; se añadió aprovisionamiento de carpetas de contenido en Documentos por arranque de Electron. Las carpetas NO están aún asociadas a los navegadores de Biblia/Himnario/medios. Verificar última compilación Windows antes de descargar. PR #2 borrador, sin merge.

## Corrección de paleta persistida
El fucsia del tema guardado original FreeShow persistía en la instalación. Se modificó `public/global.css` y la migración de `src/frontend/utils/updateSettings.ts` para aplicar paleta JA a tema default stock heredado, sin sobrescribir temas personalizados. Validar nueva build con instalación anterior, y comprobar que tabs/iconos/botones dejan de ser magenta.

## Integración de carpetas JA en Configuración
Se añadió el registro `getJAContentFolders()`, el IPC `Main.JA_CONTENT_FOLDERS` y la sección en Configuración > Archivos con rutas reales y opción de abrir cada carpeta. FreeShow conserva sus bibliotecas nativas. No hay indexación automática todavía. Pendiente validar CI Windows y uso en la app.

## Biblioteca multimedia JA
`src/frontend/utils/jaMediaFolders.ts` registra rutas JA en `mediaFolders`/`audioFolders` despues de restaurar estado desde `updateSettings.ts`, manteniendo carpetas ya existentes y sin copiar archivos. Fondos/Imagenes/Videos en Multimedia; Audio/Cantos Juveniles en Audio. Aun no hay indexador especial ni integra Biblias/Himnario. Verificar GitHub Actions y comportamiento Windows.

## Módulo Biblia española — avance
Rama activa `feature/base-freeshow-diseno-ja`. Añadidos `build_rv1909.py`, `jaBundledBible.ts`, `jaSpanishBibles.ts`, registro desde `ScriptureTabs.svelte` y lectura RV1909 desde respuestas IPC. CI descarga archivo fuente eBible con SHA fijo y verifica 66 libros antes de empaquetar. No asegurar funcionamiento hasta CI y prueba real Windows. Ediciones con derechos de autor no incluidas. Continuar con validación y navegación bíblica antes de Himnario.

## Punto de continuidad consolidado — 2026-10-26 (rama de conversación)
**Repositorio:** https://github.com/IsaacMPP/JA_Proyecciones2 · **Rama:** `feature/base-freeshow-diseno-ja` · **PR:** #2 draft (base `docs/fase0-gobernanza-arquitectura`, no fusionar). HEAD comprobado antes de esta actualización: `917201e55889ac18044cb36269e669b8268f56d5`. Releer HEAD después de los commits documentales.

### Implementado en código, aún no necesariamente validado en Windows
- FreeShow v1.6.7 como motor conservando funciones nativas, identidad JA azul/amarillo, portada, pantalla de carga, instalador NSIS con numeración por ejecución y bloqueo del actualizador heredado FreeShow.
- Creación de carpetas JA en Documentos; Configuración → Archivos consulta rutas mediante IPC; registro inicial de Fondos Personalizados/Imagenes/Videos en Multimedia y Audio/Cantos Juveniles en Audio sin duplicar bibliotecas FreeShow.
- **Biblia en español RV1909**: generación desde fuente de dominio público eBible verificada por hash, recurso empaquetado `public/ja-bibles/rv1909.fsb`, registro idempotente y lector/proyección original de FreeShow. Catálogo informativo para otras traducciones; **RVR1960, RVR1995 y NVI NO incluidas** por derechos de uso. La incorporación de RV1909 no equivale aún a prueba funcional de todos los libros.

### Validación bloqueante
Workflow Windows https://github.com/IsaacMPP/JA_Proyecciones2/actions/runs/40393505056 para SHA `d2d29b98b0a322bd58f42e4fd70a7fa6c7f5f167`: última consulta: **in_progress**, paso de instalación de dependencias. Antes de probar instalador, confirmar el último run correspondiente al nuevo HEAD y sus artifacts; revisar logs si falla. No atribuir éxito a un run cancelado ni a un SHA antiguo.

### Prueba de aceptación de la Biblia
Instalar la build actual válida; verificar que RV1909 aparece en selector, se leen los 66 libros completos, se cambia libro/capítulo/versículo, se proyectan correctamente, funciona sin Internet y no se altera el lector original ni configuraciones FreeShow. Registrar errores con versión exacta del instalador.

### Orden estricto de continuación
1. Revisar Github HEAD, PR y CI, y resolver fallos si existen.
2. Verificar funcionalidad RV1909 en Windows; corregir defectos de raíz, no parches.
3. Después de validarla, integrar Himnario Adventista (carpeta propia, buscador por número/nombre, miniaturas persistentes optimizadas y reproducción).
4. Mantener futuros trabajos multipantalla bajo arquitectura separada: principal con audio, auxiliares sin audio, enrutamiento/control independientes, sin quitar funciones originales de FreeShow.
5. Tras **cada** modificación actualizar `JA_MASTER.md`, `REGISTRO_MAESTRO.md`, `CONTINUIDAD_CHATGPT.md`, y la ruta crítica cuando cambie el plan; mantener PR draft y `main` intacta.

## Continuidad adicional — editor y navegación en vivo (26-oct-2026)
El usuario verificó con capturas RV1909 funcionando y proyectándose. Actions #40393505056 terminó correctamente. Cambio de código iniciado en `Scripture.svelte` (commit `bd0a486`): flechas simples durante proyección bíblica activa, evitando campos editables. **No declarar terminado** sin probar CI y Windows. Requisito prioritario aún sin implementar: estilo bíblico en tiempo real en vista previa y pantalla, persistente al moverse entre versículos/capítulos/libros y al reiniciar; editor compartido con textos generales sin duplicar el renderizado FreeShow. Deben conservarse referencias variables editables y distinguir modo de edición y vista previa con contenido real. Antes del siguiente cambio leer HEAD, PR #2 y CI. No comenzar Himnario todavía.

## Continuidad: importación de FSB propios (26-oct-2026)
Archivos locales recibidos y revisados en sesión: RVC, TLA, DHH94I, NBLA, NTV, NVI, FSB JSON compatibles estructuralmente; DHH94I contiene 75 libros. Sus textos no se subieron a GitHub ni se añadieron al instalador. Cambios en rama `feature/base-freeshow-diseno-ja`: validación FSB y errores de importación en `src/frontend/converters/bible.ts`, indicaciones de importación múltiple en `ImportScripture.svelte`. CI actualizado y pruebas Windows todavía pendientes. **Siguiente:** verificar workflow, comprobar las seis importaciones y si sobreviven al reinicio; corregir el almacenamiento nativo si falla. También sigue pendiente la sincronización de estilo en vivo y persistencia entre versículos. PR #2 permanece draft; no comenzar Himnario.

**Actualización posterior:** `e2041e5` invoca el guardado nativo al importar FSB válidos, para conservar biblias en `scripturesCache` al reiniciar; falta validar persistencia real en Windows y posible impacto en tamaño del perfil.

## Última intervención: primer enlace plantilla → salida activa
Commit de código `aea39a6` modifica `Scripture.svelte` para escuchar cambios del store `templates` de la plantilla bíblica actualmente configurada y solicitar actualización de la proyección activa usando el motor FreeShow; debounce 160ms, cancelación y limpieza al desmontar. **No declarar editor en vivo completo**: se usa regeneración de versículo; aún faltan vista previa real, panel de fondo/texto, guardar/recuperar estilo personalizado y prueba de que no hay saltos, doble historial ni interferencia con pantallas. Comprobar CI del último commit, resultados Windows y atender errores antes de Himnario. Importación FSB continúa pendiente de aceptación manual.

## Plan de trabajo actualizado
Seguir las entregas E0-E5 definidas en docs/RUTA_CRITICA_ENTREGAS.md. Actualmente se trabaja en E1: Biblia. Revisar los criterios de cierre antes de cambiar de modulo.

## E1 — Última unidad implementada
Commit `bbf95dd`: nuevo botón `Ver versículo real` / `Editar plantilla` en `TemplateEditor.svelte` cuando la plantilla de Biblia está activa y hay proyección. La vista utiliza los `tempItems` de salida sin sobrescribir la plantilla. Verificar CI de este commit y pruebas visuales en Windows. Pendientes de E1: actualización de estilos sin regeneración completa, colores/fondos y persistencia comprobada; importación FSB en Windows. Mantener ruta crítica y PR draft.

## Unidad E1 implementada: editor dividido
`b703126` cambia `TemplateEditor.svelte` para visualizar la plantilla editable y el versículo real simultáneamente al activar vista en vivo. Conserva marcadores y usa `TemplateStyle.svelte` para controles existentes, sin duplicar almacenamientos. Revisar CI reciente y validar Windows; aun pendiente completar sincronización visual sin regeneración, persistencia y fondos de imagen, y pruebas de importación local FSB. No cerrar E1 ni iniciar otros módulos.

## 2026-10-26 — Corrección de vista bíblica ausente
Tras capturas del usuario sin el botón, identificada condición demasiado restrictiva: `scriptureSettings.template === currentId` impedía la vista con plantilla por defecto. Commit `81e00ed` detecta modo/variables y abre vista en vivo cuando existe proyección. Verificar compilación y pantalla antes de declarar resultado.

## E1 — Último cambio
Por capturas de Windows se descartó la vista doble. Commits `33ec009` y `9e5af4f`: el editor bíblico presenta un solo lienzo con texto de `tempItems` y conserva el modelo de plantilla para los estilos. Los controles nativos para fondo de imagen y color ya se verificaron en `TemplateStyle.svelte`; se corrigió limpieza de miniatura al retirar fondo. Probar compilación, selección de elementos y cambios live/persistentes en Windows. Mantener E1 como entrega activa; PR #2 en borrador.

## E1: corrección posterior por captura Windows
La captura mostró que el editor seguía mostrando variables: faltaba salida activa, por lo que `versePreview` era nulo. Commit `7960a1f` genera previsualización con `getActiveScripturesContent` / `getScriptureSlidesNew` desde la selección de Biblia, independientemente de una pantalla física. El editor mantiene solo un lienzo. Confirmar CI y pruebas Windows; corregir cualquier incompatibilidad tipada o de indexación antes de avanzar. E1 activa, PR draft.

## E1 — regresiones de teclado y acceso a fondos (26-oct-2026)
Ante reporte del operador, se corrigió el bloqueo de flechas cuando hay un elemento seleccionado en el editor (`ac1b721`), preservando protección de campos editables. Se expusieron en el editor bíblico los controles existentes de FreeShow para `backgroundColor` y `backgroundPath` usando historial de plantilla (`1258b6f`), sin almacenamiento paralelo. Falta validar compilación Windows y pruebas de imagen/color, navegación y persistencia; no cerrar E1.
