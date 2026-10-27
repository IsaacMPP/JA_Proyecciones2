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
