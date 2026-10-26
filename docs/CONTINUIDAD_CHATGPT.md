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
