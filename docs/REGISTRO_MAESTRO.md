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
