# Registro maestro — JA Proyecciones 2

## 2026-10-26 — Inicio limpio / Fase 0
**Motivo:** el prototipo anterior acumuló decisiones de enrutamiento repartidas por varios componentes, errores de identificación monitor-salida y problemas de audio.

**Decisión:** crear repositorio independiente `IsaacMPP/JA_Proyecciones2`. No trasladar modificaciones de código anteriores sin revisión. Mantener como requisitos los casos reales reportados y normas de documentación.

**Cambios previstos en este arranque:** README, CONTRIBUTING y documentos de continuidad, arquitectura, ruta y bitácora.

**Pruebas:** revisión de repositorio GitHub, contenido y permisos. No existe todavía compilación ni prueba funcional de la nueva app.

**Pendientes:** elegir base técnica y construir una prueba vertical sobre hardware real; luego añadir CI y cada módulo de forma incremental.

**Evidencia/PR:** completar tras verificar la apertura del PR documental. No confundir esta fase con implementación de las funciones multipantalla.

**PR documental:** https://github.com/IsaacMPP/JA_Proyecciones2/pull/1 (draft, no fusionado).

## 2026-10-26 — Ratificación de alcance y revisión de fuentes
**Entradas:** nuevos ZIP de FreeShow y OBS Studio entregados en conversación. Se verificó que FreeShow identifica versión 1.6.7 y licencia GPL-3.0, y OBS incluye COPYING GPL-2.0. Se localizaron pantallas, motor video y audio routing en FreeShow.
**Decisión:** adoptar FreeShow como base y OBS como referencia de monitores, recuperar Biblia/Himnario/3 modos de medios y diseño previo con selección principal/audio principal; no copiar parches multipantalla anteriores. **No hubo importación ni cambios de aplicación.**
**Siguiente:** importar base limpia FreeShow a rama de implementación distinta tras revisar licencia, build y contrato de pantallas, luego recuperar módulos por fases con pruebas.

## 2026-10-26 — Requisitos de conservación FreeShow y ajustes integrados
**Motivo:** se confirmó que FreeShow opera correctamente, pero la asignación intuitiva de contenido por pantalla y la selección inicial necesitan mejoras.
**Decisión:** conservar flujos y ajustes funcionales originales, incluido selector de salida cuando todavía no existe. El primer envío de JA sin proyector principal debe abrir asistente de selección y guardarlo; el resto son auxiliares independientes. Configuración se actualiza de forma integral y comparte el mismo registro del centro de control.
**Cambios:** actualización documental JA_MASTER, ARQUITECTURA_MULTIPANTALLA y RUTA_CRITICA_ENTREGAS. **No se modificó aplicación ni se importó FreeShow**.
**Pruebas:** revisión y guardado documental en GitHub. Falta prueba de funcionamiento cuando exista el motor.

## 2026-10-26 — Inicio de recuperación de diseño
**Origen auditado:** antiguo `Top.svelte`, navegación Himnario y Biblia y recursos `ja-logo.png`, `ja-hero.jpg`.
**Modificaciones:** nuevo encabezado Svelte presentacional `design/JAHeader.svelte` y hoja de estilo `design/ja-theme.css`; inventario y guía `design/README.md`.
**Decisión:** conservar jerarquía visual y estilo, sin copiar el controlador de pantallas ni audio del prototipo. El motor FreeShow no está todavía importado; PNG/JPG originales por transferir.
**Validación:** archivos creados en rama documental; pendiente compilación visual cuando exista proyecto base.

## 2026-10-26 — Importación efectiva FreeShow 1.6.7 y cabecera JA
**Origen:** etiqueta oficial `ChurchApps/FreeShow@v1.6.7` (GPL-3.0), reproducible mediante `.github/workflows/import-freeshow.yml`. Se validaron versión y licencia antes de copiar el árbol del programa.
**Implementado:** se añadieron los archivos fuente de FreeShow a rama `feature/base-freeshow-diseno-ja`, sin modificar `main`, documentos maestros ni código heredado multipantalla; pequeño script idempotente `scripts/ja/apply-ja-theme.py` cambia exclusivamente la marca y CSS del encabezado `Top.svelte`; logos originales recuperados desde el repositorio JA anterior (commit `0bced037`).
**Validación:** acción de importación `40369975943` exitosa; inspección remota confirmó `package.json` 1.6.7 y marcador `ja-brand`. **No equivale a prueba de compilación o funcionalidad en Windows**.
**Pendientes:** crear y validar CI de compilación y pruebas de interfaz; revisar distribución visual completa de portada, Biblia e Himnario; no implementar enrutamiento multipantalla antes de definir contratos.

## 2026-10-26 — Identidad y versión de instalador por modificación
**Solicitud:** distinguir cada versión instalada y cada nueva compilación de JA Proyecciones 2.
**Cambios:** `scripts/ja/prepare-version.cjs` genera una versión exclusiva por ejecución/intento de GitHub Actions y archivo de procedencia; workflow `validate-ja-base.yml` añade empaquetado Windows NSIS con artefacto descargable, usando una configuración temporal que sustituye marca, appId y firma de FreeShow. Los originales `package.json` y `electron-builder.yaml` se conservan sin cambios permanentes.
**Pruebas:** CI de Windows en curso; no se ha verificado aún el instalador en hardware. Pendiente confirmar archivo .exe, nombre/versionado y arranque antes de completar fase.

## 2026-10-26 — Optimización de CI Windows
Se corrigió `.github/workflows/validate-ja-base.yml`: sólo activa automáticamente con `push` a la rama de trabajo; se eliminó el disparador PR que duplicaba compilaciones. `paths-ignore` excluye cambios exclusivamente Markdown y `docs/**`; `concurrency` cancela ejecuciones reemplazadas por una versión más reciente de la misma rama. `workflow_dispatch` permite compilar manualmente cuando sea necesario. El identificador de versión por ejecución permanece intacto. Pendiente validar la nueva ejecución completa y el instalador.

## 2026-10-26 — Recuperación de portada original y diseño de instalación
**Solicitud:** completar el diseño del instalador, pantalla de bienvenida/carga visual y portada JA antes de entregar una versión para pruebas.
**Fuente:** se restauró `src/frontend/components/main/Splash.svelte` desde la última referencia visual aprobada del antiguo `IsaacMPP/Ja_Proyeccion`, conservando las acciones nativas de FreeShow. Reutiliza `public/ja-logo.png` y `public/ja-hero.jpg` recuperados previamente.
**Instalador:** `scripts/ja/create-installer-art.py` genera icono de Windows `.ico` y panel/encabezado de NSIS desde los activos originales; `scripts/ja/prepare-version.cjs` los enlaza en configuración temporal de electron-builder. `.github/workflows/validate-ja-base.yml` prepara las imágenes antes de empaquetar.
**Alcance:** imagen de la pantalla de bienvenida de FreeShow (`Splash.svelte`) ya personalizada; esto no introduce otra ventana de arranque nativa de Electron. Sin modificaciones de salidas, audio ni navegación. No se garantiza resultado del instalador hasta CI verde y prueba manual en Windows.

## 2026-10-26 — Pantalla de arranque Electron
**Cambio:** personalización mínima de `public/loading.html`: nombre del programa, marca y recursos JA, colores y leyenda de inicio; se preservó el IPC existente que obtiene la versión y las animaciones de progreso. **Validación pendiente:** verificar que la ventana nativa carga imágenes y versión en Windows.

## 2026-10-26 — Identidad JA y protección frente a actualizaciones FreeShow
**Implementado:** el tema default de FreeShow usa azul marino, azules de apoyo y amarillo JA, sin cambiar los temas alternativos. Encabezado ampliado a 68 px, logo con object-fit contain; se corrigió proporción de la carga y título de la app. Se desactivaron ambos comprobadores heredados de actualizaciones de FreeShow, en Electron y frontend; futuro canal JA requerirá implementación independiente. `ensureJAContentFolders()` crea en Documentos/JA Proyecciones 2 las carpetas Biblias, Himnario Adventista, Cantos Juveniles, Fondos Personalizados, Audio, Imagenes, Videos, Importaciones, Presentaciones, Cache y Configuracion; falla de acceso no bloquea arranque. **Pendiente:** conectar dichas carpetas a cada módulo (por ahora es aprovisionamiento solamente), validación visual en Windows, confirmar CI. Configuración de paletas personalizadas de usuarios existente preservada.

## 2026-10-26 — Corrección de tema persistido FreeShow
**Evidencia:** instalación JA 2.0.2701 conserva fucsia en tabs, iconos y botones pese a edición de `defaultThemes.ts`. **Causa verificada:** `public/global.css` aún declara `--secondary: #f0008c` y `updateSettings.ts` restaura tema default guardado del usuario sin migración de la paleta stock FreeShow. **Corrección:** variables CSS iniciales a azules/amarillo JA y migración selectiva del tema default con acento original FreeShow, preservando los temas personalizados y otros presets. **Validación pendiente:** compilación Windows y comprobar tras arrancar sobre datos persistidos.

## 2026-10-26: Carpeta JA y panel de configuración
Se extendió la creación inicial de carpetas con un registro consultable por IPC tipado `Main.JA_CONTENT_FOLDERS`. Configuración > Archivos muestra las rutas calculadas para el usuario y permite abrir cada carpeta con el mecanismo original de FreeShow. No se alteran bibliotecas existentes. Pendiente: asociar las carpetas a los módulos, CI Windows y prueba del panel.

## 2026-10-26 — Registro automático de bibliotecas JA
Se añadió `jaMediaFolders.ts`: al terminar de restaurar los ajustes se consultan las ubicaciones de JA mediante IPC y se registran Fondos Personalizados, Imagenes y Videos en las carpetas multimedia nativas y Audio y Cantos Juveniles en las de audio. No copia archivos, no borra bibliotecas existentes y evita duplicados por ruta. Se reutiliza el lector de carpetas y el explorador de FreeShow. No se incluyen aun el Himnario ni Biblias en esos exploradores. Validar build y UI.

## 2026-10-26 — Primera integración de Biblia española
Se recuperó del proyecto anterior el generador RV1909 de eBible.org (dominio público, descarga con SHA256 fijo), el registro idempotente de la Biblia y el catálogo informativo de ediciones españolas. Se conectó el archivo instalado `public/ja-bibles/rv1909.fsb` al canal BIBLE de FreeShow, manteniendo su lector original, y la navegación de Biblia registra RV1909 al abrirse. GitHub Actions genera el recurso y comprueba 66 libros antes de construir. Las traducciones RVR1960/RVR1995/NVI y otras permanecen solo como opciones de importación legal, sin contenido protegido incluido. Pendiente: compilación Windows y prueba de proyección en el instalador.

## 2026-10-26 — Cierre de conversación / transferencia a nuevo chat
**Verificación:** PR #2 abierto/draft; HEAD previo `917201e5`; CI de Biblia #40393505056 en ejecución, sin resultado aún. **Acción:** se consolidó el punto de continuidad en `docs/CONTINUIDAD_CHATGPT.md`. **Alcance:** únicamente documentación; NO se cambió lógica RV1909 ni se fusionó nada.
**Próximas pruebas:** CI/instalador, RV1909 presente, 66 libros, navegación, proyección, uso sin red y regresión FreeShow. Luego Himnario Adventista. La documentación del estado debe actualizarse con el resultado real de CI cuando se conozca.

## 2026-10-26 — Primera entrega de controles bíblicos en vivo
**Evidencia de Windows proporcionada por el operador:** RV1909 aparece, los versículos se leen y se proyectan (capturas, Génesis 1:3). No equivale a prueba de los 66 libros ni a prueba desconectada. Actions #40393505056 finalizó exitosamente y publicó instalador.
**Cambio:** `src/frontend/components/drawer/bible/Scripture.svelte`: durante proyección bíblica activa, flechas izquierda/derecha sin modificadores invocan la navegación nativa que actualiza la proyección; se excluyen controles editables y la edición de objetos. Se conservan combinaciones Ctrl anteriores y el motor FreeShow. Commit inicial `bd0a486`.
**Pendientes:** validar en Windows que las flechas no desencadenen navegación doble con los atajos globales; comprobar límites capítulo/libro y textos divididos. No se implementó aún la sincronización instantánea de fuente/color/fondo ni la persistencia de esas preferencias entre versículos. Para ello auditar y enlazar configuración de plantilla/salida al contenido activo, evitando duplicar estados y sin afectar auxiliares. CI de este commit pendiente.

## 2026-10-26 — Archivos bíblicos FSB aportados por el operador
Se inspeccionaron localmente (sin incorporarlos a Git) seis archivos: RVC, TLA, DHH94I, NBLA, NTV, NVI. Cada archivo es una pareja JSON [id,biblia] con capítulos, versículos y campo text; 66 libros en cinco, 75 en DHH94I. La metadata identifica titulares de derechos, por lo que **NO se publican ni empaquetan** estas traducciones.
**Código:** se endureció el importador FSB `src/frontend/converters/bible.ts` para rechazar estructura inválida y contar correctamente errores FSB, y se aclaró la importación múltiple `.fsb` en `ImportScripture.svelte`. Commits `d735232`, `31eef78`, `0446e62`. Se reutiliza el diálogo de selección múltiple y los convertidores originales; no se incorpora el texto bíblico.
**Pendientes:** CI de Windows, importación real de los seis archivos, persistencia al cerrar/reabrir, colisiones de IDs y verificación de licencias de uso. El editor/estilo vivo permanece pendiente. No confundir implementación del diálogo con la importación efectiva en Windows.

**Actualización posterior:** `e2041e5` invoca el guardado nativo al importar FSB válidos, para conservar biblias en `scripturesCache` al reiniciar; falta validar persistencia real en Windows y posible impacto en tamaño del perfil.

## 2026-10-26 — Inicio de sincronización de plantilla bíblica en vivo
**Cambio:** `src/frontend/components/drawer/bible/Scripture.svelte` observa el objeto de la plantilla bíblica elegida en el store original de FreeShow. Si esa plantilla cambia mientras se proyectan Escrituras, solicita refrescar el versículo proyectado tras 160 ms de agrupación; no interviene cuando no hay proyección bíblica y libera la suscripción al desmontar el componente. Commit `aea39a6`.
**Alcance:** cambios guardados en el objeto de plantilla pueden reflejarse en el versículo actual y seguir en los versículos posteriores porque estos se generan desde la misma plantilla. No constituye aún editor visual de texto real ni control completo de fondo de color/imagen, y la actualización recurre a la regeneración nativa de la proyección. **CI y Windows por verificar**; especialmente evitar parpadeos, historial duplicado, comportamiento con plantillas de salida y multisalidas.

## 2026-10-26 — Orden y gobernanza
Por decisión del usuario se formalizó una ruta de trabajo por entregas E0–E5 en `docs/RUTA_CRITICA_ENTREGAS.md`. Se evita interrumpir la entrega activa con ideas nuevas sin clasificar. La Biblia E1 queda activa y pendiente de validación en Windows y funciones completas de edición. Este ciclo actualiza documentación, no implementa funciones nuevas.

## 2026-10-26 — E1: vista del versículo real en editor de plantillas
Cambio `bbf95dd`: `TemplateEditor.svelte` permite alternar entre elementos editables de plantilla y una vista de solo lectura basada en `tempItems` de la proyección bíblica actual. La plantilla original no se reemplaza por texto fijo. Aparece solo al editar la plantilla activa de Biblia con una proyección bíblica. Pendiente: CI, prueba Windows, variables dinámicas y sincronía visual precisa. No equivale a completar la personalización en vivo.

## 2026-10-26 — E1 vista de edición y versículo lado a lado
Commit `b703126`: en `TemplateEditor.svelte` la opción de vista en vivo muestra simultáneamente la plantilla editable y el contenido bíblico real de la proyección, sin sustituir variables de la plantilla. Se reutilizan los controles existentes de fuente y fondos de `TemplateStyle.svelte` para evitar una segunda configuración. Todavía requieren validación CI/Windows: dimensiones, actualización del preview al editar, pantalla de salida, selección de texto y persistencia entre versículos. No declarar completa E1.

## 2026-10-26 — Corrección de vista bíblica ausente
Corrige causa raíz de vista ausente: el editor exigía igualdad con `scriptureSettings.template`, aunque la plantilla por defecto de Escrituras no requiere ese valor. Ahora identifica modo `scripture` o placeholders bíblicos, y abre vista simultánea al existir proyección. Commit `81e00ed`. CI/Windows pendientes.

## 2026-10-26 — E1 corrección de lienzo único e imagen de fondo
Captura del usuario mostró que el editor doble repetía el versículo a la derecha y las variables a la izquierda; se corrigió el diseño para representar el texto real en un solo lienzo bíblico manteniendo la plantilla subyacente para estilos. `TemplateEditor.svelte` y `TemplateSlide.svelte`, commits `33ec009` y `9e5af4f`. Se auditó `TemplateStyle.svelte`: FreeShow ya ofrece `MaterialColorInput` y `MaterialFilePicker` para `backgroundColor`/`backgroundPath`; NO se duplicó. Se ajusta vista de medios y su limpieza al quitar imagen. Validación CI y Windows pendientes; se debe comprobar selección/edición de estilo en panel lateral y actualización/persistencia en proyector.

## 2026-10-26 — E1 raíz del lienzo que seguía mostrando variables
La nueva captura del operador confirma que el lienzo seguía mostrando `{scripture_text}`. La vista dependía incorrectamente de `getFirstActiveOutput(...).out.slide.id === "temp"`; al abrir el editor sin salida bíblica activa no se generaba la sustitución. Commit `7960a1f` construye los ítems con `getActiveScripturesContent` y `getScriptureSlidesNew` a partir de la selección bíblica, aun sin proyector, y los presenta en el único lienzo. Queda verificar CI, Windows, coincidencia de ítems editables, rendimiento, guardado de estilos y fondos. No marcar E1 completa.

## E1 — regresiones de teclado y acceso a fondos (26-oct-2026)
Ante reporte del operador, se corrigió el bloqueo de flechas cuando hay un elemento seleccionado en el editor (`ac1b721`), preservando protección de campos editables. Se expusieron en el editor bíblico los controles existentes de FreeShow para `backgroundColor` y `backgroundPath` usando historial de plantilla (`1258b6f`), sin almacenamiento paralelo. Falta validar compilación Windows y pruebas de imagen/color, navegación y persistencia; no cerrar E1.

## 2026-10-26 — Corrección de vista previa
E1: captura muestra proyector con imagen y texto reales, editor con variables y miniatura rota. Causa identificada: `TemplateEditor.svelte` usaba `versePreview?.items` aunque `versePreview` ya es `Item[]`, produciendo `null` y vuelta a placeholders. Corregido en `d608088`. `TemplateSlide.svelte` dependía de miniatura para renderizar el fondo; ahora usa imagen original incluso sin miniatura (`bb86b18`, `9166c62`). Pendiente CI y confirmación Windows.

## 2026-10-26 — E1 placa de lectura configurable
En `TemplateEditor.svelte`, commit `e217648`, se incorporó un panel contextual para el cuadro de texto seleccionado de la plantilla bíblica. No se dibuja capa superpuesta: usa el fondo (`background-color`) y borde (`border-radius`) del mismo elemento del texto mediante historial nativo `template_items`, con activar/desactivar, selección de color y opacidad a través de `MaterialColorInput` nativo y radio ajustable. No altera la imagen de fondo ni la navegación de versículos. Pendiente: CI, comprobar en Windows selección de cuadro principal/referencia, orden de capas, opacidad de fondo independiente del texto, persistencia y que el panel no obstruya el lienzo.
