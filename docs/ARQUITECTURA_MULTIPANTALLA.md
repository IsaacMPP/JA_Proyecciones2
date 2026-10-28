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


## M1 — Grupos sincronizados y prónter independiente (27-oct-2026)
Requisito nuevo del usuario: multipantalla debe funcionar con Biblia, PowerPoint, presentaciones, imágenes, videos, videohimnos y fondos animados. Escenario: principal reproduce cantos con audio; secundaria 1 muestra al predicador/maestro de ceremonias agenda, notas de presentación o temporizador sin verlo el público; secundaria 2 reproduce un logo animado en bucle sin audio.

**Grupos de destino:** elegir por separado cualquier conjunto explícito de salidas, por ejemplo principal+secundaria1 reciben la misma presentación sincronizada mientras secundaria2 mantiene su video. El clic normal sigue enviando SOLO al principal. El envío a grupos exige elección consciente y no modifica salidas externas al grupo. Guardar grupos con IDs reales y tratar desconexiones sin reasignación silenciosa.

**Dos tipos de sincronización distintos:** (a) contenido discreto como diapositivas, versículos, imágenes, presentación PowerPoint: compartir estado/índice y avance; (b) video/audio: coordinar tiempos, pausa, seek, loop, sincronismo y política solo-principal audible. El prónter puede mostrar una vista relacionada pero no idéntica con notas/temporizador privados; NO prometer notas de PowerPoint hasta comprobar que el importador las conserva.

**Auditoría obligatoria antes de M1:** analizar stageOutput, PowerPoint import, temporizadores, controles de reproducción y videoSync existentes, bindings y enrutamiento de setOutput. Reutilizar capacidades FreeShow; no duplicar motores. Incorporar a fases M1-03 enrutamiento a grupos; M1-04 sincronía según tipo de medio; M1-05 consola/mostrador y prónter. Validar 3 salidas: principal y aux1 mismo PowerPoint sincronizado, aux2 logo animado continuo y silencioso; ensayo inverso con prónter privado, principal cantos y aux2 logo. Probar desconexiones, cambios de selección, audio, y PCs poco potentes.

## Regla obligatoria M1 — Activación por salidas de proyección, NO por monitores totales (27-oct-2026)
La pantalla integrada de laptop o monitor de escritorio del operador es superficie de CONTROL y NO cuenta como pantalla de proyección. El conteo se hace sobre salidas JA de proyección reales, distintas del monitor operativo, conectadas y asignadas explícitamente. Con **una sola salida de proyección JA** (aunque Windows detecte dos monitores: laptop+proyector) la interfaz y clic normal conservan el flujo actual, sin consola multipantalla innecesaria. Con **dos o más salidas JA de proyección disponibles y asignadas** (por ejemplo laptop+dos proyectores) se habilitan controles avanzados: seleccionar destino, sincronizar grupos, sesiones/transportes independientes y consola contextual. Con cero salidas, usar configuración/selección sin proyectar. No basta contar windows displays ni enumerar outputs virtuales/NDI/stage como si fueran proyectores físicos; distinguir categorías y opciones avanzadas. Si se desconecta una secundaria y queda una salida, volver al modo simple sin detener o cambiar silenciosamente la salida principal. No redirigir nunca contenido por ordinal. Probar laptop sola; laptop+1 HDMI; laptop+2 HDMI; escritorio+1 y +2 pantallas; pantalla de control cambiada; conexiones virtuales/spacedesk; hotplug. La configuración avanzada FreeShow permanece accesible por Ajustes incluso cuando los controles contextuales estén ocultos.

## 2026-10-27 — M1-03 infraestructura universal de destinos iniciada (no UI global completada)
Commits `831f4d5`, `3e24754`, `6a0c278`: `src/frontend/utils/jaProjectionDestinations.ts` define el contrato común de destinos activos, principal/secundaria, validación del outputId y el payload sin mutar la fuente. `src/frontend/components/helpers/output.ts` expone `sendToJAOutput(type,data,outputId,toggle)` que valida destino, configura silencio en backgrounds audiovisuales secundarios y delega al `setOutput` nativo; Himnario ya reutiliza esta función al enviar a secundarias, en lugar de reglas duplicadas. **Importante:** aún no se han integrado los controles globales en Biblia, presentaciones/PowerPoint, imágenes, textos y escenas; la política de mute en videos incluidos dentro de diapositivas o escenas necesita auditoría específica. No declarar M1 universal terminado. Pendiente CI Windows, prueba TV+iPad y revisar caso de mismo archivo en dos salidas, audio primario intacto. Próxima tarea: inventario de puntos de envío por tipo y componente UI reutilizable/contextual, evitando interceptar bindings deliberados de FreeShow. No tocar main ni fusionar PR #2.

## 2026-10-27 — Feedback de prueba M1-03: control por salida y rediseño del selector
El usuario confirma que **Enviar a… del Himnario funciona**, pero evidencia dos problemas de alcance GENERAL: (1) solo puede pausar el último video enviado; necesita controles independientes para CADA salida (play/pause, stop, seek, loop, vista previa y estado) sobre toda la aplicación; (2) la barra fija «Enviar sin audio a…» invade el catálogo y tiene aspecto improvisado. Requiere diseño moderno, juvenil, sobrio/profesional, sin saturación. Solicita criterio proactivo de arquitectura/UI, no limitarse a sus ideas del clic derecho o reloj.

Decisión de arquitectura de propuesta (pendiente implementación): navegación/selección de destinos como COMPONENTE CONTEXTUAL ÚNICO global para Biblia, presentaciones, imágenes, videos, textos, himnos y escenas, disponible desde acción visible del contenido y menú contextual de clic derecho, NO oculta exclusivamente en el reloj ni exclusiva del Himnario. Cambiar barra inline del Himnario por popover bien posicionado sin interrumpir VirtualList. Crear CENTRO DE CONTROL DE SALIDAS usando/preferentemente adaptando `MultiOutputs.svelte` y `MediaControls.svelte` (este último **ya recibe outputId y usa videoSync(path, outputId)**), no agregar un segundo reproductor. Elegir salida primero, derivar de esa salida el fondo/contenido activo y pasar su outputId a controles. Separar control de diapositivas/versículos (avance discreto) de transporte audiovisual (tiempo). Una salida = panel simple; dos o más = panel multipantalla. Principal con audio, secundaria muda por defecto. Sincronización solo bajo opt-in.

RIESGO concreto auditado: `videoPlayer.ts` tiene APIs por outputId, pero estados auxiliares por `path` y `stopByOutputIds`/getPlaying pueden compartir instancias; verificar si un archivo idéntico en dos salidas puede pausar/limpiar principal. No basta con añadir botones visuales sin corregir ownership de reproducción. Primero cerrar casos de prueba (dos videos distintos, mismo archivo dos destinos, stop/pause/secundario sin detener principal, cambio de principal, streaming/output desconectado). No declarar control independiente terminado hasta probar Windows. La interfaz propuesta aún NO está implementada.

## 2026-10-27 — Aclaración de producto: pantallas AGRUPADAS equivalen a una salida lógica
El usuario propone reutilizar el comportamiento nativo de FreeShow (mismo contenido a múltiples salidas), pero restringido a un subconjunto seleccionado, para formar un grupo lógico de pantallas que se comporte como UNA proyección. No confundir con iniciar videos independientes simultáneamente ni prometer sincronía frame-perfect. Ej.: principal TV con audio + proyector lateral silenciado dentro de grupo Auditorio; iPad fuera del grupo conserva contenido propio. Reutilizar binding/enrutamiento nativos de `setOutput` sobre lista de output IDs; verificar que audio/stop/play/seek se apliquen al grupo de manera intencional, con una sola fuente audible. Controles: crear/guardar/nombrar grupo, añadir/quitar salidas, elegir principal de audio, mostrar composición, acciones de grupo, desagrupar sin limpiar otras salidas, manejar desconexiones. Pantallas individuales siguen posibles. Antes de implementar auditar si el broadcast original de FreeShow garantizaba un único reloj o solo enviaba acciones simultáneas: no llamarlo sincronización perfecta sin evidencia. Se suma a M1-05 existente; no desplazar pendientes de UI universal y controles independientes.

## Invariante de integración Biblia / proyector principal JA — 2026-10-28 (pendiente implementar)

La identidad de la salida principal elegida manualmente por el operador es **independiente** de la primera salida activa que FreeShow enumera. Cualquier módulo que pregunte «¿está mi contenido proyectado?» debe consultar la salida de destino correcta y no inferirlo del orden de pantallas. En Biblia `slide.id === "temp"` identifica el contenido temporal proyectado; `scripture.ts:outputIsScripture()` aún usa `getFirstActiveOutput()` y necesita ajustarse a esa invariante. `playScripture()` usa también la primera salida para detectar inicio/estilo. No alterar bindings deliberados ni grupos al resolver la principal.

**Separación de responsabilidades:** (1) selección de destinos y resolución de principal JA; (2) control de navegación de versículos propio de `Scripture.svelte:_moveSelection()`; (3) controlador de avance de diapositivas generales `OutputHelper`; (4) audio principal/auxiliar. Activar flechas bíblicas exclusivamente en módulo Escrituras, respetar inputs y no navegar contenido auxiliar ni cambiar proyector principal. Verificar propagación de keydown entre `Scripture.svelte` y atajos globales; no duplicar listeners sin necesidad.

**Estado:** diseño/diagnóstico únicamente. Pendiente cambio de código, CI y validación Windows. La ampliación de grupos y reproducción compartida M1-05 continúa en backlog, así como `Enviar a…` universal de M1-03, prónter, reconexiones y pruebas de bajo rendimiento.

## 2026-10-28 — M1-03F/05A: navegación de Biblia también en destinos seleccionados (CI/Windows pendientes)

**Reporte real del usuario:** «Enviar a…» proyecta el pasaje en secundaria, pero al navegar con flechas la vista previa y principal cambian mientras la secundaria queda congelada. Causa confirmada: `Scripture.svelte:_moveSelection()` llama al `playScripture()` principal-only introducido al integrar selector. El envío era estático, pero el usuario requiere que los destinos que se eligieron sigan la navegación, sin afectar pantallas con otros contenidos.

**Corrección localizada:** `scripture.ts` mantiene registro efímero `scriptureFollowingOutputs` por ID y colección bíblica solo después de un envío explícito exitoso. `getLiveScriptureOutputIds` incluye la principal únicamente si actualmente muestra `slide.id="temp"` de esa colección; auxiliares solo si están disponibles, se seleccionaron y siguen proyectando esa misma Biblia. Elimina destinos que se reasignan o desconectan. `refreshLiveScripture` utiliza **el mismo procesador original** y `sendToJAOutputs` para actualizar los IDs del grupo de navegación, con generación asíncrona que evita aplicar un cálculo de versículo más antiguo tras uno nuevo. `Scripture.svelte` usa esta ruta para flechas, clic de versículos, refresco de estilos. `playScripture()` normal permanece exclusivo de la principal. No modifica shortcuts, VideoPlayer, UI principal o `main`.

**Verificación requerida:** CI y Windows: elegir solo Samsung mientras Primario muestra video con audio y navegar sin cambiarlo; elegir Primario+iPad y avanzar ambos, cambios de capítulo y split verse; cambiar Biblia en un output por multimedia (debe dejar de seguir); cambiar traducción/importada, fondos/restablecer estilos, desconexión/reconexión, 3 monitores. Aún NO representa grupos guardados/sincronización temporal de video M1-05. Conserva M1-03 universal en otros módulos, M1-04/05/06/07, H1, T1, F1 y backlog completo. PR #2 continúa draft; no fusionar.

