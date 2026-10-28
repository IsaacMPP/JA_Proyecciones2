## 2026-10-28 — M1-03 Fase 0 + Fase 1 (selector explícito en Biblia, pendiente Windows)

**Estado base protegido:** rama `feature/base-freeshow-diseno-ja`, HEAD de inicio `b8bf51c890969a7e83a47dc7a54a7a7a9292b07f`; Actions #40743618059 success; PR #2 draft, `main` no tocar. Usuario confirmó en Windows que flechas bíblicas y reproducción de dos videos ya funcionan; no volver a intervenir sus controladores.

**Implementación limitada a Escrituras:** `Scripture.svelte` incorpora el `JADestinationChooser` compartido junto al botón Proyectar en el panel de versículos; aparece solo cuando el diálogo tiene >=2 salidas físicas JA y principal elegida. `scripture.ts` mantiene `playScripture()` para navegación, actualización del texto y estilos siempre a principal. Añade `sendScriptureToJAOutputs(ids)` para preparar con el mismo algoritmo de traducciones, división, plantilla y attribution el **pasaje seleccionado actual**, y enviarlo una sola vez por IDs exactos mediante `sendToJAOutputs`. Actualiza o limpia el fondo bíblico **solo** en destinos elegidos, con estilos de salida y audio silenciado. Revalida primaria y dispositivos tras el procesamiento asíncrono. No añade suscripciones permanentes a los secundarios, no modifica el reloj audiovisual, el motor FreeShow ni la funcionalidad de flechas.

**Prueba Windows indispensable:** Biblia RV1909 e importada: enviar a secundaria solo sin variar principal (himo/video u otra Biblia), enviar a ambas, seleccionar otro versículo con flechas (solo principal cambia), comprobar imagen/color de fondo y eliminación de fondo, reconexión y búsqueda; Windows multi monitor + CI. No declarar M1-03 completo hasta integrar Presentaciones, PDF/PPT, YouTube/Vimeo, Capas/Efectos, Escenas, cámaras, capturas, proyectos y menús por contexto. Preservar M1-04 controles independientes, M1-05 grupos/sincronía, M1-06 consola/prónter, M1-07 robustez y el backlog H1, T1, F1, imagen JA, caché thumbnails, autodescubrimiento y compatibilidad de PCs modestos. 

---

**Seguimiento de limpieza WebAudio (2026-10-28):** se identificó que `AudioAnalyser.detach` borraba `gainNodes[key]` antes de llamar `source.disconnect(this.gainNodes[key])`; al separar outputs de una fuente compartida se intentaba desconectar un GainNode inexistente. Se retiene una referencia local al GainNode y se elimina sólo ese enlace cuando el MediaElementAudioSourceNode sigue compartido. No se desconecta la fuente completa de otras pantallas. Verificar en Windows con envíos sucesivos y comprobar que el consumo no crezca por nodos de audio huérfanos. CI y prueba física pendientes.

**Auditoría de carreras asociadas (2026-10-28):** se complementa el aislamiento de sesión en `createAudio(...).ended` (el callback consulta los outputs actuales del objeto de audio, no la lista original ya obsoleta); `checkIfEnding` bloquea por instancia en lugar de path; el cálculo de soft-loop ocurre una vez por reloj compartido en vez de una vez por pantalla. Una carga de audio fallida no detiene otras instancias con igual ruta. El inicio consulta opciones de la sesión solicitada. Pendientes CI nuevo HEAD y validación Windows de cambios rápidos, finales y soft-loop.

## 2026-10-28 — M1-03/M1-05: aislar sesiones audiovisuales al reemplazar una salida (por validar)

**Reporte Windows del operador:** enviar un mismo video a Primario + Output 1 reproduce inicialmente, pero al enviar luego otro video de Multimedia/Himnario el audio de Primario desaparece y el video puede retroceder/repetir segundos. Biblia con flechas YA validada por el usuario, no intervenir el navegador.

**Causa estructural inspeccionada:** `VideoPlayer.stop(path, outputId)` localizaba posteriormente la primera sesión por `path` aun cuando el `outputId` pertenecía a otra instancia. `fadeOut`/`fadeIn` y `updateVolume` podían mutear varios `AudioAnalyser` con la misma ruta, ignorando la propiedad de sesión; `AudioAnalyser.detach` comprobaba “otros videos” comparando rutas distintas, ignorando otras salidas con el MISMO archivo.

**Corrección:** conservar un mismo reloj para los outputs de un envío agrupado, pero separar la parada completa por instancia real de audio/reproducción. Detach del grupo retira solo el ID solicitado; el fade de stop y la recuperación de volumen del nuevo inicio se dirigen exclusivamente a los outputs propietarios. `updateVolume` toma el objeto de audio de cada sesión, no la primera ruta coincidente. `AudioAnalyser.detach` conserva el nodo compartido si quedan otras fuentes activas, aunque reproduzcan el mismo path. No crear reproductor ni menú nuevos, mantener FreeShow y diseño JA.

**Estado:** cambios en rama, compilar con CI del nuevo HEAD; NO afirmar validación física. Comprobar en Windows: A+B mismo video, A nuevo/B antiguo, B nuevo/A antiguo, mismo archivo enviado separadamente, pausa/seek por salida, detener por salida, audio solo primario, loops naturales, scrubbing, desconexión y recurso de baja potencia. Revisar cronómetro/sincronización y posibles callbacks asíncronos si persisten saltos. M1-03 universal, M1-05 grupos, M1-06 consola/prónter, M1-07 robustez, H1, T1, F1 continúan abiertos. No fusionar PR #2 ni modificar main.

---

**Ajuste preventivo de eventos (mismo ciclo, 2026-10-28):** captura temprana consume sólo flechas destinadas a navegar versículos. Si el foco está en un input, editor, control o diálogo, `Scripture.svelte` deja propagarse el evento hasta el elemento. `Preview.svelte` no ejecuta avance general con flechas simples cuando la pestaña Biblia tiene el control. Se mantiene un único algoritmo de navegación bíblica (`_moveSelection`). Pendiente CI y pruebas físicas.

## 2026-10-28 — Corrección estructural de flechas bíblicas (pendiente CI y Windows)

- Se comprobó HEAD `c720ce1`, PR #2 draft y Actions #40635140956 (intento 2 exitoso en código `7d7c459`).
- Causa: `outputIsScripture` identificaba la primera salida FreeShow y no la principal JA; App/Preview y Scripture tenían listeners sobre window y `shortcuts.ts` duplicaba avance con `OutputHelper.advanceOutputs` para flechas bíblicas.
- Solución: `getJAMainOutput` identifica la principal por ID exacto, no cambia de salida cuando desaparece; sin selección JA sólo permite compatibilidad con salida nativa única. `playScripture` inspecciona, aplica estilo/fondo y proyecta explícitamente a ese ID, revalidándolo tras preparación asíncrona.
- `Scripture.svelte` captura las flechas en fase de captura sólo en la pestaña Biblia; reutiliza `_moveSelection` para capítulo, verso y división. Respeta edición y caret. Se retiraron las rutas JA redundantes de `shortcuts.ts` que enviaban flechas bíblicas a diapositivas.
- Riesgos/pruebas pendientes: compilar y comprobar Windows con principal+secundaria, entrada de texto, transición de capítulo, RV1909 y FSB locales, ausencia/desconexión de principal, restaurar fondo, escenas y teclas fuera de Biblia. CI verde no implica prueba funcional real.
- No se modificó `main` ni se fusionó PR #2. Se preservan M1-03 (destinos universales), M1-05 (grupos), M1-06 (consola/prónter), M1-07 (robustez), H1, T1, F1 y demás pendientes documentados.

---

## ESTADO DE DESARROLLO ACTUALIZADO — 2026-10-28 (continuidad entre chats)

**Prioridad inmediata: regresión de flechas de Biblia NO RESUELTA.** Tras la proyección principal JA exclusiva, `scripture.ts:outputIsScripture()` todavía utiliza `getFirstActiveOutput()`, de FreeShow, y `Scripture.svelte` depende de esa detección para habilitar su `_moveSelection()`. A la vez `shortcuts.ts` llama `OutputHelper.advanceOutputs()` para las flechas, mecanismo de diapositivas distinto del lector bíblico con `slide.id="temp"`. Revisar también listener nativo de `Scripture.svelte` y filtros de foco; no añadir otro parche de teclado.

**Estado verificado:** HEAD anterior a esta actualización documental `7d7c459`; GitHub Actions #40635140956 intento 2 **success**, no equivale a pruebas Windows. PR #2 sigue en borrador. Solo se autoriza ajustar documentación en el presente cierre de chat; siguiente conversación audita, diseña e implementa después, con CI y pruebas reales. Mantener Biblia RV1909, Himnario separado de Multimedia, estilo JA, vistas independientes, audio solo principal, miniaturas persistentes y compatibilidad PC modestos. No modificar `main` ni fusionar PR sin autorización.

**Secuencia no desplazable:** regresión Biblia -> terminar M1-03 proyección universal (clic normal solo a principal y selector de destinos) -> M1-05 agrupación/duplicado y control compartido -> M1-06 consola/prónter -> M1-07 pruebas -> demás entregas H1/T1/F1.

---

# JA Proyecciones 2 — documento maestro

Fecha de inicio: 2026-10-26. Repositorio: `IsaacMPP/JA_Proyecciones2`.

## Misión
Proyección audiovisual de cultos con interfaz comprensible para operadores no técnicos, salidas independientes, destinos inequívocos y sonido predecible.

## Estado confirmado
- **Fase 0: documentación y arquitectura** (en preparación).
- Repositorio nuevo inicializado con README; **todavía no hay aplicación ni módulo audiovisual instalado**.
- Código del proyecto anterior no se ha copiado. Las experiencias anteriores son requisitos y advertencias, no componentes validados aquí.
- Rama de trabajo de esta fase: `docs/fase0-gobernanza-arquitectura`; integrar a `main` únicamente con autorización explícita.

## Reglas de producto acordadas
- Detectar automáticamente pantallas externas que Windows exponga (HDMI, HDMI inalámbrico, spacedesk); distinguirlas con nombre, resolución y botón de identificación. No atribuir modelos que el sistema no informa.
- Diferenciar pantallas físicas, salidas lógicas, transmisión NDI y dispositivos de audio. NDI no equivale a un monitor local autodescubierto.
- Una sola salida de proyección principal elegida por operador. Clic normal envía solo al principal; clic derecho elige destino explícito.
- Principal: video con audio de forma predeterminada; auxiliares: sin audio de forma predeterminada. “Solo video” es excepción explícita.
- Controles de transporte por salida, sin afectar a otra. Mismo archivo en dos salidas exige comprobar capacidad de reproducción independiente.
- Evitar proyectar sobre la pantalla de operación o enviar automáticamente a otra salida ante desconexiones.
- Configuración sencilla primero; opciones avanzadas en segundo nivel. Centro de control adaptable a número real de salidas (inspirado en VirtualDJ, sin límite de cuatro).

## Restricciones técnicas
- Examinar FreeShow y OBS como referencias, respetando licencias; favorecer reutilización probada sobre duplicación.
- No asumir que CI verde equivale a validación en Windows.
- No importar la rama antigua como base sin revisión arquitectónica y autorización.

## Próximo hito
Cerrar fase 0: elección de base tecnológica, contrato de identificación/selección/audio, matriz de pruebas y una primera entrega vertical mínima verificable.

## Alcance ratificado por el usuario (26-oct-2026)
- **Base tecnológica: FreeShow**, conservando las capacidades de su motor; referencia entregada `FreeShow-main(2).zip`, `package.json` versión 1.6.7 y licencia GPL-3.0. No se importó aún código a este repositorio.
- Recuperar de forma limpia la **Biblia en español**, **Himnario Adventista** con búsqueda/organización, y modos multimedia **Video con audio / Solo video / Solo audio** que existían en JA Proyección anterior.
- Conservar **el diseño visual anterior de JA Proyección**; extraer componentes visuales sólo tras auditar dependencias para no transportar modificaciones multipantalla fallidas.
- Utilizar OBS Studio sólo como **referencia** para identificación real de modelos de monitores en Windows; referencia recibida `obs-studio-master(1).zip` (licencia GPL-2.0, COPYING). No copiar código OBS sin revisión de compatibilidad y atribución.
- Monitor principal de proyección seleccionable y persistente: **clic normal sólo al principal con audio**; salidas secundarias independientes, dedicadas a imagen/video sin audio. Envío a secundarios explícito por menú/contexto. No confundir principal de Windows con proyector principal.
- UI multipantalla intuitiva con nombre/modelo real cuando esté disponible, resolución, identificación física, controles por salida y centro multipantalla sin duplicar motores.

## UX y configuración: preservar FreeShow (confirmado 2026-10-26)
- No eliminar, sustituir ni ocultar controles funcionales de FreeShow sin auditoría y aprobación; conservar su comportamiento nativo cuando no haya una razón demostrada para cambiarlo.
- **Configuración es el centro de administración real**, no un panel decorativo: deberá evolucionar junto con detección, selección del proyector principal, salidas auxiliares, identificación, audio y controles. Una opción nueva debe configurarse desde ahí y producir un efecto verificable.
- **Primer envío sin principal establecido:** abrir selector/asistente de destinos disponibles, permitir identificar pantalla y elegir principal; no enviar contenido a todos ni seleccionar una salida arbitraria. Guardar elección; ofrecer reconsiderarla desde Configuración → Pantallas.
- Una vez establecido el principal, clic normal proyecta exclusivamente ahí (con audio para video normal). Acciones explícitas «Enviar a…» permiten dirigir otros contenidos a secundarios silenciosos sin modificar el principal.
- Panel de control independiente por salida: contenido visible, reproducción, pausa, progreso, detener y silencio. Reutilizar capacidades nativas y advertir si un medio comparte el mismo reproductor entre salidas.
- No confundir **sin salida configurada** con **sin monitor externo detectado**: FreeShow ya ofrece un flujo de elección cuando no tiene salida; preservar y adaptar, no reemplazarlo por un bloqueo.

## Recuperación visual iniciada (26-oct-2026)
Se añadió `design/ja-theme.css`, `design/JAHeader.svelte` y `design/README.md` en el PR documental. Conservan el encabezado azul de JA Proyección anterior y preparan integración sin importar fallos multipantalla. **No hay todavía motor FreeShow ni UI ejecutable.** Los recursos binarios `ja-logo.png`/`ja-hero.jpg` siguen pendientes de traslado. No confundir kit visual con interfaz funcional.

## Hito: base FreeShow importada (26-oct-2026)
En rama `feature/base-freeshow-diseno-ja`, FreeShow oficial v1.6.7 ya está incorporado como código fuente. Se reintrodujo **únicamente** la marca del encabezado JA y sus recursos originales; salidas, audio, ventanas, configuración y navegación permanecen nativas de FreeShow. Este hito reemplaza el estado anterior «sin aplicación» sólo para esta rama; no confundir importación exitosa con compilación verificada. Pendientes el resto de la portada/identidad y recuperar Biblia/Himnario por fases, sin parches históricos. No fusionar a main sin aprobación.

## Versionado automático de Windows (26-oct-2026)
- El código sigue versionado sobre FreeShow 1.6.7 como base, pero cada ejecución de instalador JA utiliza **versión exclusiva de compilación** `2.0.<run_number*100+attempt>`, calculada con el número global del flujo GitHub Actions y su intento. Un nuevo commit que active el workflow genera un número nuevo; reejecutar una compilación también produce un número diferente.
- `scripts/ja/prepare-version.cjs` modifica temporalmente `package.json` sólo en el agente de CI y crea `ja-build-info.json` (versión, commit, ejecución). No genera commits de cambio de versión ni afecta el lockfile antes de `npm ci`.
- El instalador NSIS se configura como `JA Proyecciones 2`, appId `mx.japroy.proyecciones2`, artefacto `JA-Proyecciones-2-<version>-<arch>.exe`. Se elimina la configuración de firma Azure de FreeShow de la configuración **generada**, sin modificar el original.
- La primera tarea es confirmar **compilación y empaquetado**, no asumir éxito por disponer de un workflow. No se declara instalador funcional hasta CI verde y prueba en Windows. La pantalla «Acerca de» debe mostrar la versión del package empaquetado; se puede ampliar después con SHA.

## Diseño de la primera versión de prueba JA — recuperación ampliada
- Encabezado JA y recursos de marca existentes.
- Portada/bienvenida visual original recuperada en `src/frontend/components/main/Splash.svelte` (fondo JA, logo, lema, versión y controles nativos de búsqueda/proyecto/presentación).
- Identidad del instalador NSIS e icono Windows generados mediante `scripts/ja/create-installer-art.py` y configuración específica en `scripts/ja/prepare-version.cjs`.
- **Pendiente validación de empaquetado y prueba visual de instalación**. La pantalla de carga nativa separada del proceso Electron no ha sido personalizada por separado; la pantalla de bienvenida de la aplicación sí.

### Pantalla de carga nativa JA — implementación posterior
Se localizó y personalizó `public/loading.html` (ventana de arranque real de Electron): fondo de `ja-hero.jpg`, emblema `ja-logo.png`, marca JA y indicador/versión. Esta acción reemplaza el pendiente de pantalla de carga nativa indicado anteriormente. Sigue pendiente comprobar la representación en Windows.

## Estado de transición de conversación (26-oct-2026)
**Módulo RV1909 incorporado en código, todavía no validado en Windows.** Fuente eBible dominio público con verificación SHA, recurso FSB sin conexión, registro y lector FreeShow conservados. Workflow #40393505056 se encontraba en ejecución durante esta actualización; revisar último run del HEAD, no asumir éxito. Tras comprobar 66 libros, navegación, proyección y offline, pasar al Himnario Adventista. El plan completo y normas están consolidados en `docs/CONTINUIDAD_CHATGPT.md`. PR #2 sigue draft, `main` sin fusionar.

## Entrega incremental: navegación de Biblia en vivo (26-oct-2026)
Las capturas del operador muestran que RV1909 se selecciona y proyecta en Windows. Workflow #40393505056 terminó con éxito. Se introdujeron flechas izquierda/derecha para cambiar el versículo en la proyección bíblica activa, reutilizando `_moveSelection` y `playScripture`; faltan CI actualizado y prueba manual. La edición de textos y los controles interactivos no deben perder sus teclas.
**Requisito aceptado, todavía pendiente de implementar:** cambios de tipografía, tamaño, color, alineación e imagen/color de fondo deben actualizar inmediatamente vista previa **y salida actualmente proyectada**, sin avanzar el contenido y persistir en los siguientes versículos, capítulos, libros y reinicios. Deben derivar de un único estilo de plantilla/salida persistente; no guardar estilos individuales por versículo ni replicar motores. Otras presentaciones comparten controles, manteniendo contextos separados y auxiliares sin modificaciones no solicitadas.

## Biblia — importación de archivos locales del operador
Se reconocieron seis FSB de origen aportado por el usuario, sin publicación de su contenido: RVC, TLA, DHH94I (75 libros), NBLA, NTV y NVI. Se habilita y explica el flujo nativo de importación múltiple local `.fsb` y se valida su estructura. No se deben restringir todas las traducciones a 66 libros, ni redistribuir textos protegidos en releases. Falta probar instalación, importación real y persistencia entre sesiones, además de completar el editor bíblico en vivo y su estilo persistente.

**Actualización posterior:** `e2041e5` invoca el guardado nativo al importar FSB válidos, para conservar biblias en `scripturesCache` al reiniciar; falta validar persistencia real en Windows y posible impacto en tamaño del perfil.

## Sincronización incremental de estilo de Escrituras
El lector bíblico ahora escucha cambios en su plantilla persistente y puede solicitar actualización del versículo actualmente proyectado reutilizando `playScripture`. No crea estilos por versículo ni reproductores nuevos. Es un primer paso, no una implementación completa del editor visual compartido: quedan pendientes prueba Windows, vista previa del versículo real dentro del editor, actualización fina sin recrear toda la diapositiva, cambios de fondo al retirar imágenes y salida específica multipantalla.

## Plan operativo vigente
Se reorganizó el desarrollo en entregas E0–E5, definidas en `docs/RUTA_CRITICA_ENTREGAS.md`. La entrega E1 (Biblia) es la unidad activa. Las tareas nuevas se clasifican y se incorporan al plan sin interrumpir arbitrariamente la entrega. El cierre exige pruebas, registro de defectos y validación Windows.

## E1: vista previa de versículo proyectado
Se añadió al editor de plantillas un control para alternar a una vista de los elementos del versículo actualmente proyectado. El modo editable conserva los marcadores de plantilla; la previsualización no modifica los textos bíblicos. La función requiere validación en CI y Windows y es parte de E1, no cierre del módulo.

## E1: edición con vista en vivo simultánea
Editor de plantillas bíblicas con dos paneles al activar vista en vivo: plantilla editable a un lado y contenido proyectado al otro. Se mantienen las herramientas nativas de estilo/fondos, en vez de duplicarlas. Código en Git pendiente de aceptación Windows y de verificar que la proyección actualiza la apariencia sin parpadeos.

## 2026-10-26 — Corrección de vista bíblica ausente
E1: corregida detección de plantillas bíblicas predeterminadas para que la vista real no dependa de configurar una plantilla personalizada. Código `81e00ed`, sin aceptación Windows aún.

## E1 — Lienzo único de Escrituras
Sustituida la vista doble por lienzo único que muestra versículo proyectado sin tokens visibles; la plantilla interna sigue siendo la fuente de los estilos. Controles nativos de FreeShow para fondo de color e imagen ya existen y se conservan. Cambios de código pendientes de CI/aceptación Windows, sin declarar terminada E1.

## E1: selección bíblica como fuente de la vista real
Se corrigió la dependencia impropia del proyector al renderizar el editor: la vista principal ahora obtiene el contenido desde el estado de selección bíblica con funciones nativas, en vez de requerir salida temporal activa. Código `7960a1f`. Pendiente validación real Windows y enlace de edición de texto/estilo.

## E1 — regresiones de teclado y acceso a fondos (26-oct-2026)
Ante reporte del operador, se corrigió el bloqueo de flechas cuando hay un elemento seleccionado en el editor (`ac1b721`), preservando protección de campos editables. Se expusieron en el editor bíblico los controles existentes de FreeShow para `backgroundColor` y `backgroundPath` usando historial de plantilla (`1258b6f`), sin almacenamiento paralelo. Falta validar compilación Windows y pruebas de imagen/color, navegación y persistencia; no cerrar E1.

## 2026-10-26 — Corrección de vista previa
E1: corrección de referencia de array de ítems del versículo y visualización de fondo original sin exigir miniatura. La salida proyectada ya se veía en captura; fallaba solo el lienzo de edición. Aún sin aceptación Windows.

## E1 — Placa de lectura
Panel contextual vinculado al fondo del cuadro de texto seleccionado, usando estilos y controles FreeShow sin añadir capas de dibujo nuevas. Alternancia, color/opacidad y redondez registrados en la plantilla; falta validación de CI y prueba visual real. La referencia puede configurarse seleccionando su propio cuadro.

## 2026-10-26 — E1: menús de fondos reubicados
Captura del operador muestra el control de color cortado en la esquina inferior derecha y los paneles flotantes bloqueando el lienzo. Cambios: `bc8e23c` elimina paneles flotantes de `TemplateEditor.svelte`; `8077906` sitúa las opciones plegables `Fondo de Escrituras` y `Fondo de lectura` en `EditTools.svelte` (panel derecho), reutilizando `MaterialColorInput`, `MaterialFilePicker`, `MaterialCheckbox` y el historial de plantillas. Se mantiene un solo estado de plantilla. CI y validación Windows pendientes, sobre todo el tamaño de popover de color y el scroll lateral.

## 2026-10-26 — E1 selector color del inspector
Se constató en captura que el selector original de color queda recortado dentro de la subárea de controles laterales. Commits `b144f36` y `1773619` eliminan `max-height:44vh` y `overflow-y:auto` del contenedor secundario, manteniendo el desplazamiento del inspector original FreeShow, y presentan radio de esquinas con valor en px. Se conserva `MaterialColorInput` para mantener colores y opacidad sin duplicar el componente. CI y prueba visual Windows pendientes; confirmar que ningún ancestro aún recorta el selector.

## 2026-10-26 — Restaurar fondos de Escrituras
Commit `ecd2cc9` añade botones de restablecimiento por sección en el inspector derecho: Fondo de Escrituras (limpia `backgroundColor` y `backgroundPath`) y Fondo de lectura del cuadro seleccionado (limpia fondo y radio en el estilo del cuadro). Ambos piden confirmación, usan historial nativo y preservan fuentes, texto, traducciones bíblicas, archivos multimedia importados y otros ajustes. Pendiente CI y validación Windows; restablecer el fondo no elimina el archivo de la biblioteca.

## 2026-10-26 — E1: restablecimiento general y actualización en proyección
`adfd5ce` corrige la observación de la plantilla bíblica predeterminada `scripture` aun sin valor personalizado de `scriptureSettings.template`, para solicitar refresco de salida durante cambios de plantilla. `02004ca` añade un botón confirmado de «Restablecer toda la apariencia» en el inspector de Escrituras. Se eliminan fondos personalizados, placas, bordes y estilos de texto, restaurando apariencia base limpia (fondo #101a2d, texto blanco Arial 64px), conservando ubicación de cuadros y marcadores bíblicos. Se mantiene la opción de restablecer fondos por separado. **No afirmar restauración bit a bit de la plantilla FreeShow original**: este botón utiliza un estilo base de JA, no una copia inmutable de fábrica. Validar CI y Windows, persistencia, salida activa y efectos del historial sobre formato/posición; PR draft.

## 2026-10-26 — E1 regresión de fondo retenido en proyección
Captura Windows: restablecer apariencia deja lienzo azul, pero monitor de salida conserva imagen navideña. Causa verificada en `playScripture`: cuando `backgroundPath` queda vacío tras restaurar, la función hacía `return` sin limpiar la salida anterior. Commit `b44c59c` añade `setOutput("background", null)` mediante el motor nativo antes de retornar. Pendiente compilar y validar en Windows restauración de fondo en salida activa y navegación siguiente, sin perder texto. No declarar cerrado E1 sin prueba real.

## Orden aprobado 27-oct-2026
E1 Biblia: usuario confirmó sus flujos principales. Editor general aplazado. H1 Himnario independiente junto a Biblia y fuera del índice de Multimedia; sigue M1 Multipantalla; después T1 Editor general. Ver docs/RUTA_CRITICA_ENTREGAS.md.

## Requisito permanente 27-oct-2026: autodescubrimiento de bibliotecas
Las carpetas de usuario que la app crea en Documentos/JA Proyecciones 2 constituyen la fuente de contenido para cada módulo. Archivos copiados por Explorador de Windows deben detectarse automáticamente, sin botón obligatorio de importación y sin mezclar categorías. Biblia se vincula a Biblias; videohimnario a Himnario Adventista y Cantos Juveniles; Multimedia a Imagenes/Videos/Fondos Personalizados; Audio a Audio, otros destinos según capacidades. Debe funcionar después de reiniciar y al agregar/renombrar/eliminar archivos; nunca modificar archivos de usuario. Actualmente la creación de carpetas no implica autodescubrimiento completo: consultar jaContentFolders.ts y jaMediaFolders.ts. Es regla de alcance para el desarrollo actual y futuro.

## 2026-10-27 — Norma permanente de ingeniería y optimización H1
**Instrucción expresa del propietario:** cada solicitud de mejora es un objetivo/problema, NO una orden literal de añadir controles. Antes de tocar el código: auditar funciones nativas de FreeShow y la versión histórica Ja_Proyeccion, identificar solapamientos, analizar consecuencias en PC de bajo rendimiento, proponer la solución más simple y sostenible; si ya existe una función semejante, reutilizarla o sustituirla, nunca dejar dos buscadores/controles conflictivos. Primero arquitectura, después implementación, CI y prueba Windows. Recordar en todos los chats futuros.
**Auditoría:** repo anterior docs/JA_BIBLIOTECA_FASE2.md reutilizaba el generador persistente de miniaturas FreeShow, su MediaGrid/VirtualList y búsqueda única; no era un conversor separado implementado por JA. Repo nuevo dibujaba todas las ~613 tarjetas, lanzaba carga de miniaturas al intersectar sin límite global y tenía búsqueda general del drawer más búsqueda propia dentro del scroll.
**Cambios:** jaHymnThumbnailQueue.ts limita a 2 solicitudes simultáneas y mantiene caché de promesas sobre loadThumbnail nativo FreeShow; HymnThumbnail lo reutiliza; Drawer oculta su buscador general solo en Himnario; HymnCatalog fija su encabezado/buscador fuera del contenedor scroll, difiere el renderizado de tarjetas fuera de viewport mediante content-visibility y recarga cache en Actualizar. Commits 1f345fe, 365389c, 998d6bc, 52fbb76. **Pendiente** GitHub Actions y pruebas Windows desplazamiento rápido con 613 videos y memoria/CPU; valorar virtualización de cuadrícula si sigue lento. PR #2 permanece draft, no tocar main.
