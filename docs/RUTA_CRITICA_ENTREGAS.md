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
