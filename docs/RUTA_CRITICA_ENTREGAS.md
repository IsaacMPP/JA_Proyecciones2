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
