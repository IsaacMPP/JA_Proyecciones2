# Ruta crítica de entregas

| Fase | Resultado mínimo verificable | Criterio de salida |
|---|---|---|
| 0 · Arquitectura y documentación | Contratos, mapa de módulos, escenarios y gobernanza | Revisión aprobada, sin código heredado accidental |
| 1 · Identificación de dispositivos | Inventario real de monitores y etiquetas; prueba de identificación por monitor | TV e iPad asignados correctamente después de conectar/reordenar |
| 2 · Destino principal y salidas | Asignación estable, principal elegido, persistencia y manejo de desconexión | Clic normal solo principal; selección puntual a auxiliar |
| 3 · Audio y reproducción | Audio de video en principal, auxiliares silenciosos y controles separados | Dos medios diferentes sin interferencia; pruebas de mismo medio y reconexión |
| 4 · Centro de control y UX | Vista adaptable con controles por destino; configuración básica/avanzada | Operador nuevo puede preparar y operar dos salidas sin confusión |
| 5 · Contenidos | Biblia, multimedia, himnario, presentaciones y organizador integrados | Flujos de culto completos y pruebas de regresión |
| 6 · Empaquetado y entrega | Instalador Windows, CI, diagnósticos y documentación de usuario | Build reproducible y prueba de aceptación en equipo real |

## Reglas de avance
Una fase solo pasa a «completa» con evidencia en código, CI y, cuando se trate de hardware, prueba física. Los fallos bloqueantes se resuelven antes de añadir funciones. No se fusionan PR sin permiso.

## Criterios adicionales de aceptación acordados
- **Fase 0:** auditoría explícita de capacidades y ajustes nativos de FreeShow para evitar retirar funciones operativas.
- **Fase 1–2:** sin proyector principal, intentar proyectar abre el selector de salidas, permite identificar, escoger y guardar principal; cancelar no envía. Si está desconectado, reconectar explícitamente.
- **Fase 2–3:** clic normal únicamente principal con audio; secundarios por selección explícita, sin audio ni sobrescritura de los demás.
- **Fase 3–4:** controles independientes por salida y estado en tiempo real, conservando integraciones nativas de FreeShow.
- **Todas las fases:** Configuración debe reflejar inmediatamente cada capacidad agregada; prueba de funcionamiento del ajuste, no solo visualización. Mantener ajustes avanzados nativos intactos.

## Subhito prioritario anterior al Himnario — Biblia en vivo
- Navegación: flechas simples al proyectar, sin robar teclas a entradas de texto ni duplicar avances; verificar límites de capítulo/libro y regresión general.
- Estilos: editar fuente, tamaño, color, alineación y fondo mientras se proyecta; la vista previa y la salida activa deben coincidir sin re-proyectar manualmente.
- Persistencia: cambios de estilo aplicables a todos los siguientes versículos, capítulos y libros, y después de reiniciar, sin alterar involuntariamente otras salidas/plantillas.
- Validación: CI Windows, prueba real durante proyección y documentación de resultados antes del Himnario.

## Norma de ejecución por entregas cerradas — 26-oct-2026
**Decisión del propietario:** dejar de trabajar por incidencias improvisadas que aplazan indefinidamente módulos anteriores. Planificar entregas completas con dependencias, criterios de aceptación y capacidad de retomar trabajo entre chats. Esta sección es la fuente de orden operativo; las fases históricas 0–6 anteriores conservan sus contratos técnicos, en especial multipantalla, pero no deben interpretarse como tareas paralelas activas.

### Secuencia de entregas (una entrega activa a la vez)
| Orden | Entrega | Alcance para darla por cerrada | Dependencia |
|---|---|---|---|
| E0 | Base FreeShow JA estabilizada | CI/instalador, carga, rutas JA, identidad, ausencia de actualización de FreeShow y regresión básica; reportar pruebas Windows | Base ya incorporada; aceptación parcial |
| E1 | Biblia completa | RV1909 offline; importar FSB locales con persistencia y manejo de errores; navegar por flechas mientras se proyecta; plantilla editable con texto real en previsualización; cambios de tipografía/tamaño/color/alineación/fondo de color o imagen visibles en pantalla en tiempo real; persistencia a próximos versículos, libros y reinicio; sin tocar otras salidas | E0 funcional |
| E2 | Editor compartido de textos | Centralizar controles de estilos reutilizables en presentaciones, plantillas y bienvenida donde proceda, sin fusionar estados de contenido ni romper FreeShow | Componentes E1 validados |
| E3 | Contenidos adicionales | Himnario Adventista (índice/búsqueda/proyección), cantos y carpetas multimedia vinculadas, sin redistribuir material sin permisos | E1 estable |
| E4 | Multipantalla y audio | Inventario/identificación, principal único, auxiliares independientes silenciosos, audio del principal, reconexión y controles dedicados según ARQUITECTURA_MULTIPANTALLA | Base E0, contratos previos; integrar con E1–E3 |
| E5 | Integración y versión de entrega | Regresión de culto completo, rendimiento, instalador, documentación, respaldo y aceptación en Windows | E0–E4 |

### Reglas obligatorias de ejecución
1. Mantener **un solo bloque de entrega activo**; dentro de él trabajar unidades pequeñas y coherentes. Nuevas ideas fuera de alcance van al backlog con prioridad y dependencia, no interrumpen la unidad activa. El usuario puede reordenar explícitamente el plan.
2. Registrar cada unidad con: objetivo, causa raíz, archivos/capas afectados, definición de terminado, pruebas automatizadas, pruebas manuales y riesgos. No hacer ajustes sueltos sin entender la estructura original de FreeShow.
3. Clasificar incidencias: **P0** bloqueo de arranque, datos perdidos, seguridad o imposibilidad de proyección; **P1** función esencial de entrega activa rota; **P2** defecto secundario o de otro módulo; **P3** mejora estética/futura. P0/P1 se corrigen en la entrega activa; P2/P3 se anotan sin perderlos ni bloquear innecesariamente.
4. Una unidad de código solo está **implementada** cuando está en Git; **validada CI** cuando el run correcto pasó; **aceptada** solo cuando se probaron interacciones reales relevantes en Windows. No confundir estas etiquetas. No lanzar compilaciones de instalador por cambios únicamente documentales; agrupar los cambios lógicos relacionados.
5. Evitar parches acumulativos: si el problema es de renderizado, estado, persistencia o enrutamiento, corregir la capa responsable. El motor FreeShow y sus funciones existentes se preservan.
6. El cierre de una entrega exige checklist de aceptación aprobado y documentación actualizada, no ausencia absoluta de defectos triviales. Ningún pendiente P0/P1 queda oculto bajo una entrega cerrada; los P2/P3 se trasladan explícitamente con propietario/etapa prevista.
7. Mantener el PR #2 en borrador, nunca fusionar sin autorización. Actualizar registro, master, continuidad y ruta crítica después de cambios. El resumen de cada chat debe indicar entrega activa, completadas, bloqueantes, pendientes y siguiente unidad exacta.

### Situación real al reorganizar
- **E0:** compilación #40419290477 exitosa para importación FSB; no significa aceptación manual total de instalador o biblioteca.
- **E1 ACTIVA:** primer enlace de plantilla a proyección (`aea39a6`) implementado, workflow #40420576232 en ejecución al registrar este plan. Falta aceptación de importación FSB, sincronización sin parpadeos ni historial duplicado, vista real en editor, controles de color/fondo y persistencia verificable.
- **E2–E5:** planificadas, no declaradas implementadas.
- **Siguiente unidad técnica concreta:** revisar CI del cambio de plantilla, auditar flujo de actualizaciones de salida/estilo y diseñar una única ruta de estado persistente; completar previsualización de versículo real y cambio live sin usar la regeneración completa por cada edición. Pruebas antes de avanzar.
