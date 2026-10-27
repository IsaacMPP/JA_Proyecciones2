# Reglas obligatorias de desarrollo

1. Antes de cualquier modificación: consultar GitHub, rama, último commit, PR, ejecuciones de Actions y leer `docs/CONTINUIDAD_CHATGPT.md`, `docs/JA_MASTER.md`, `docs/REGISTRO_MAESTRO.md` y `docs/RUTA_CRITICA_ENTREGAS.md`.
2. Trabajar por fases y tareas pequeñas con criterios de aceptación definidos. No implementar ideas no aprobadas. No agregar parches que escondan problemas estructurales: analizar causa raíz y corregir en la capa responsable.
3. No modificar `main` directamente después de la inicialización: crear rama `feature/`, `fix/` o `docs/` y PR en borrador. No fusionar sin autorización explícita.
4. Antes de editar código: localizar capacidades de FreeShow/OBS que pueden reutilizarse, definir interfaces, invariantes, riesgos y plan de pruebas. No reemplazar motores funcionales por estética.
5. Cada cambio debe incluir, en el mismo ciclo, actualización de `docs/REGISTRO_MAESTRO.md` (fecha, causa, archivos, pruebas, resultado, pendientes), `docs/JA_MASTER.md` (estado real) y `docs/CONTINUIDAD_CHATGPT.md` cuando cambie el punto de continuidad. Actualizar la ruta crítica si se mueve una fase o prioridad.
6. Probar con CI; revisar errores y logs; distinguir “código implementado”, “CI verde” y “probado en Windows con dispositivos reales”. Ninguna afirmación de funcionamiento sin evidencia.
7. No declarar completo un módulo sin pruebas de caso normal, errores, desconexión, múltiples monitores, persistencia y regresión donde corresponda.
8. Mantener commits entendibles; evitar duplicaciones de infraestructura, dependencias sin justificar y cambios paralelos no relacionados. Registrar decisiones técnicas reversibles.
9. No publicar secretos, tokens, datos privados o recursos con licencia incompatible. Verificar licencias antes de incorporar fuentes de FreeShow/OBS y contenidos bíblicos/himnarios.
10. Cuando se abra otro chat: revisar los cuatro documentos, HEAD y CI antes de proponer el siguiente cambio.
