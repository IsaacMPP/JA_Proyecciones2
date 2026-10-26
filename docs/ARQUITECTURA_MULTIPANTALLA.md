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
