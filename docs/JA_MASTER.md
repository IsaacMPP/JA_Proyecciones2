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
