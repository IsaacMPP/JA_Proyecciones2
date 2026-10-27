<script lang="ts">
    import { autoOutput, os, special, outputs } from "../../../stores"
    import MaterialToggleSwitch from "../../inputs/MaterialToggleSwitch.svelte"
    import Tip from "../../main/Tip.svelte"

    import { onMount } from "svelte"
    import { Main } from "../../../../types/IPC/Main"
    import { requestMain } from "../../../IPC/main"
    import { getJAProjectionOutputs } from "../../../utils/jaProjectionScreens"
    let displays: any[] = []
    let operatorId = ""
    let principal = ""
    onMount(async () => {
        displays = (await requestMain(Main.GET_DISPLAYS)) || []
        operatorId = localStorage.getItem("ja-operator-display") || String(displays.find((d) => d.primary)?.id || displays.find((d) => d.internal)?.id || displays[0]?.id || "")
        principal = localStorage.getItem("ja-main-projector") || ""
    })
    $: projectors = getJAProjectionOutputs($outputs, displays, operatorId)
    $: principalAvailable = projectors.some((p) => p.id === principal)
    function updateSpecial(value: any, key: string, allowEmpty = false) {
        special.update((a) => {
            if (!allowEmpty && !value) delete a[key]
            else a[key] = value

            return a
        })
    }
</script>

<Tip type="info" value="tips.global_options" bottom={20} />

<MaterialToggleSwitch label="settings.auto_output" checked={$autoOutput} defaultValue={false} on:change={(e) => autoOutput.set(e.detail)} />
<!-- apparently doesn't work on some versions of macOS -->
{#if $os.platform !== "darwin" || $special.hideCursor}
    <MaterialToggleSwitch label="settings.hide_cursor_in_output" checked={$special.hideCursor} defaultValue={false} on:change={(e) => updateSpecial(e.detail, "hideCursor")} />
{/if}

<section class="jaProjectors">
    <strong>JA · Pantallas de proyección</strong>
    <p>Configuración preparatoria. Todavía no cambia el enrutamiento de FreeShow.</p>
    <label for="jaOperator">Pantalla del operador (no se cuenta)</label>
    <select id="jaOperator" value={operatorId} on:change={(e) => {operatorId=e.currentTarget.value;localStorage.setItem("ja-operator-display",operatorId)}}>
        {#each displays as d}<option value={String(d.id)}>Pantalla {d.id}{d.internal?" · Integrada":""}</option>{/each}
    </select>
    <label for="jaPrimary">Proyector principal</label>
    <select id="jaPrimary" value={principalAvailable ? principal : ""} on:change={(e) => {principal=e.currentTarget.value;localStorage.setItem("ja-main-projector",principal)}}>
        <option value="">Sin seleccionar</option>
        {#each projectors as p}<option value={p.id}>{p.name} · pantalla {p.screen}</option>{/each}
    </select>
    <p>{projectors.length} salida(s) de proyección disponible(s). {projectors.length >= 2 ? "Control avanzado habilitable tras M1-03." : "Modo normal."}</p>
    {#if principal && !principalAvailable}<p>La pantalla principal guardada está desconectada o no disponible; no se reasignará automáticamente.</p>{/if}
</section>
<style>
.jaProjectors{display:flex;flex-direction:column;gap:8px;padding:14px;margin-top:16px;border:1px solid var(--primary-lighter);border-radius:8px}
.jaProjectors select{background:var(--primary);color:var(--text);padding:8px}
.jaProjectors p{font-size:12px}
</style>
