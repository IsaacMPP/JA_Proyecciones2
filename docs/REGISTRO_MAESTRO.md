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
