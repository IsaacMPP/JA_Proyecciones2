# Arquitectura objetivo — multipantalla

**Estado: diseño preliminar, no implementado.**

## Separación de responsabilidades

1. **DeviceDiscovery:** obtiene monitores físicos de Windows por identificador estable disponible, etiqueta amigable, resolución, bounds, estado y primario de sistema. No inventa modelos. Detección HDMI y pantallas virtuales como spacedesk depende de Windows; nombres EDID pueden no existir.
2. **OutputRegistry:** distingue monitor físico, ventana de FreeShow, salida NDI/red y audio; conserva asignación explícita. Cambios de IDs o geometría requieren reconciliación segura y confirmación, no redirección silenciosa.
3. **RoutingController:** un `mainOutputId` explícito; clic normal a él y envío alternativo por ID exacto. Nunca difundir por defecto a todos los activos. Respetar bloqueos/capas.
4. **PlaybackSessions:** estado por sesión/destino (medio, tiempo, pausa, volumen, loop); delimitar si un mismo archivo tiene dos instancias o reproducción compartida. El motor subyacente se seleccionará tras un prototipo.
5. **AudioPolicy:** por defecto principal audible y auxiliares silenciadas; dispositivo de audio de Windows es distinto de monitor visual. Probar HDMI inalámbrico, reproducción local y NDI por separado.
6. **OperatorConsole:** tarjetas adaptables al número real de salidas, destino seleccionado, vista previa, transporte por salida e identificación clara. Proyección sobre pantalla de control prohibida de forma predeterminada.

## Invariantes
- Ninguna salida se puede mandar a otro monitor basándose exclusivamente en un número ordinal como «pantalla 2».
- Nunca asignar a un monitor cuya identidad/relación se haya invalidado tras un hotplug.
- El principal tiene prioridad de audio cuando hay video con sonido, salvo orden explícita «Solo video».
- Enviar o pausar en auxiliar no modifica la sesión del principal.
- Un monitor desconectado no dispara una proyección en otro por sustitución automática.
- La interfaz refleja el estado real y explica los errores; no simula dispositivos conectados.

## Referencias y validación
OBS identifica nombres de Windows usando APIs gráficas del sistema cuando están disponibles; FreeShow aporta conceptos de salidas/proyección. Revisar fuente y licencias antes de reutilizar código.

**Matriz de prueba obligatoria:** un monitor; laptop + TV HDMI inalámbrico; laptop + spacedesk; ambos simultáneamente; cambio de orden/escala; reconexión; mismos y distintos videos; principal con audio y auxiliar mudo; NDI con receptor y sin él; error de dispositivo y permisos.

## Decisiones aún abiertas
Base tecnológica y modelo exacto de reproductores por salida; mecanismo de nombre amigable/EDID; estrategia NDI; persistencia de IDs cuando Windows los cambia. Resolver antes de fase 1.

## Base seleccionada y fuentes aportadas
- Base: FreeShow 1.6.7 (GPL-3.0), motor Electron/Svelte; se conservarán en principio sistema de salidas, ventana de proyección y controles nativos de audio/video.
- Referencia OBS Studio: API de identificación de pantallas Windows (nombre amigable y configuración de dispositivo), **no como motor multimedia nuevo**. OBS Studio contiene COPYING GPL-2.0: auditar cuidadosamente compatibilidad antes de copiar código fuente.
- Pantalla **principal de Windows** = escritorio del operador; **proyector principal de JA** = pantalla externa seleccionada. No son intercambiables.
- Al iniciar un video con clic normal, sólo proyector principal recibe el medio **con audio**, independientemente de cuantos monitores estén activos; auxiliares conservan su imagen/video actual y quedan sin sonido. Modos «Solo video» y «Solo audio» requieren contrato separado sin efectos sobre pantallas ajenas.
- Validación de identidad: EDID/nombre amigable si Windows ofrece datos; fallback etiqueta más resolución e identificación física; no prometer modelo exacto para HDMI inalámbrico ni spacedesk si su controlador no lo comunica.

## Contrato UX integrado con ajustes (26-oct-2026)
**Preservación:** inventariar primero componentes, flujos y ajustes nativos de FreeShow; ninguna simplificación debe eliminar capacidades funcionales como selección inicial de pantalla, salidas avanzadas, mezcladores o audio routing.

**Estados del inicio de proyección**
1. Sin salida configurada / sin proyector principal: invocar selector de dispositivos, identificar pantalla real, elegir proyector principal y preparar su salida mediante mecanismos existentes. Cancelar no proyecta nada.
2. Principal configurado y disponible: clic normal envía solo a principal con audio por defecto para video; demás salidas no se modifican.
3. Principal configurado pero desconectado/identidad ambigua: avisar, mostrar asistente de reconexión/reasignación; nunca redirigir silenciosamente.
4. Enviar a secundaria: destino explícito, contenido visual sin audio; no alterar contenido o estado de transporte de otras salidas.

**Centro Configuración → Pantallas y salidas**
- Vista básica: inventario real con etiqueta de Windows, resolución y «Identificar»; principal seleccionado, asignación por monitor, estados conectado/asignado/en proyección; audio del principal y auxiliares; acciones comprobables.
- Vista avanzada: conservar ajustes originales FreeShow (salidas lógicas, ventana, NDI, streaming, resolución, estilos, audio routing y demás); no duplicar almacenes de estado.
- Sincronización bidireccional: cambios en asistente, configuración y centro de control reflejan el mismo registro de salidas; no crean reglas contradictorias.

**Controles independientes:** operar por ID de salida y sesión; probar dos videos distintos y mismo video en dos destinos para determinar si FreeShow comparte audio/tiempo antes de decidir implementación. Conservar su motor mientras se diagnostica.

## M1 — Contrato funcional ratificado para el siguiente desarrollo (27-oct-2026)
El propietario aporta el código `obs-studio-master(2).zip` y solicita una consola de operación por proyector, similar en ergonomía al control de medios de VirtualDJ pero **sin reemplazar** el motor de FreeShow.

### Hallazgos de la auditoría previa al código
- `src/frontend/components/helpers/output.ts:setOutput(type,data,toggle,outputId,...)`: cuando `outputId` está vacío, resuelve los bindings o **todas las salidas activas**; el enrutamiento M1 debe interceptar el envío normal en el origen/contrato de rutas, no simplemente cambiar una tarjeta de UI ni sustituir indiscriminadamente todos los llamados (existen usos legítimos de envíos múltiples y bindings).
- `src/frontend/components/output/tools/MediaControls.svelte`: ya recibe `outputId` y usa `videoSync(path, outputId,...)` para tiempo/pausa/mute/loop. Se debe estudiar si las sesiones de medios se separan realmente por salida cuando se reproduce el **mismo archivo**; no inventar un reproductor nuevo sin pruebas.
- `src/frontend/components/output/preview/MultiOutputs.svelte`: ya existe un panel de previsualización de múltiples salidas. Reutilizarlo y añadir selección de destino y transporte contextual, no crear otro panel completamente desconectado.
- `src/frontend/components/settings/Screens.svelte`: usa `Main.GET_DISPLAYS`, bounds, ID y reconciliación de pantallas; ya tiene controles de asignación. **No confundir monitor Windows (escritorio del operador) con salida JA.**
- Código OBS proporcionado: `plugins/win-capture/monitor-capture.c` enumera dispositivos con `EnumDisplayMonitors/GetMonitorInfo` y presenta resolución/bounds; `frontend/components/DisplayCaptureToolbar.cpp` expone IDs de monitor. Esto es REFERENCIA, no prueba de que OBS siempre obtenga marca/modelo exactos; para ello se requerirá auditar EDID/Windows DisplayConfig cuando sea posible. No copiar archivos C/C++ de OBS ni integrar su motor por accidente; comparar licencias antes de reutilizar fuentes.

### Decisiones UX y funcionales
1. **Una salida de proyección JA principal** elegida y persistida explícitamente. Clic o enviar normal sobre Biblia, Himnario, Multimedia, audio y presentaciones => sólo salida JA principal. Las demás se mantienen intactas. Enviar simultáneamente es una acción **deliberada y separada**, sin eliminar capacidades nativas de FreeShow.
2. **Secundarias con destinos explícitos**: menú contextual «Enviar a…»/selector de destino; nunca elegir por el índice ordinal del monitor. Etiqueta de sala definida por operador + nombre técnico disponible + resolución/estado para identificar.
3. **Política de audio**: toda salida secundaria empieza y permanece silenciada para videos del flujo normal, incluida una acción de envío externo; principal audible por defecto. Al desconectar/reconectar, no heredar accidentalmente audio del proyector principal. El control global del sonido y el dispositivo de audio no equivalen al mute de cada reproductor; verificar captura, NDI y audio de sistema.
4. **Consola por salida**: preview real de contenido actual, título, play/pausa, detener/limpiar, desplazamiento (seek), tiempo y estado de audio para **cada sesión por outputId**. Operar una salida no pausa ni sustituye las demás. Los controles se muestran cuando existen al menos **dos salidas JA de proyección configuradas/activas** (principal + auxiliar), no basándose solo en que Windows detecte dos monitores incluyendo el de control; configuración avanzada de salidas FreeShow siempre accesible.
5. **Identificación de dispositivo**: inventario `GET_DISPLAYS`, marca/modelo vía API de Windows si disponible; fallback verificable «Monitor [etiqueta del operador] • resolución • conexión / posición» y botón Identificar que muestre número en pantalla real. Evitar falsas identidades y reasignación silenciosa tras hotplug/EDID ambiguo. Monitor virtual/spacedesk/HDMI inalámbrico puede reportar identificadores genéricos.
6. **Estado de operación segura**: si no hay principal, mostrar configuración sin emitir; si desaparece principal, detener nuevas emisiones, no redirigir a una auxiliar. Restaurar vínculos solo cuando coincida identidad comprobada.
7. **Rendimiento**: usar reproductores, caches y vista de FreeShow, limitar previews vivos si hay múltiples monitores; no duplicar decodificación por defecto; degradación elegante para hardware modesto.

### Fases obligatorias M1
- **M1-01 Auditoría/ensayo**: inventario de módulos de FreeShow, mapa de todos los llamados `setOutput`, clasificación de envíos normales frente a envíos múltiples legítimos, prueba de 2 videos distintos e idénticos y sincronización `videoSync`; revisión de viabilidad de EDID/DisplayConfig Windows y licencias. Entregable: matriz de rutas/decisiones + pruebas, antes de cambiar código.
- **M1-02 Identificación/registro**: dispositivo real, etiqueta, identificación visual, escoger principal, persistencia y hotplug seguro, manteniendo ajustes nativos.
- **M1-03 Enrutamiento**: clic normal => principal; envío secundario explícito; preservar bindings intencionales y enviar a varias sólo si solicitado.
- **M1-04 Audio/sesiones**: secundarios mudos y controles independientes por outputId, con pruebas misma fuente/diferente fuente y audio real.
- **M1-05 Consola condicional**: preview por salida y controles tipo transporte, visibles solo con 2+ salidas JA proyectables, ergonomía para operadores.
- **M1-06 Aceptación Windows**: 1 salida JA, 2 salidas JA, varias (3+), desconexión HDMI, reconexión, modo espejo/extender, Wireless HDMI, spacedesk, multirresolución, reinicio, bajo rendimiento; regresiones Biblia/Himnario/Multimedia, CI y documentación.

**Reglas de salida**: no declarar compilación = hardware validado; ni afirmar modelo exacto sin reporte real de Windows. No modificar main/fusionar PR #2. Revisión de código antes de solicitar implementar cada fase; el usuario prioriza no duplicar/crear parches superficiales.
