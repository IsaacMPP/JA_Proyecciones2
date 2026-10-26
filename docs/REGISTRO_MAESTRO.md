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
