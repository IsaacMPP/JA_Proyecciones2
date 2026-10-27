<script lang="ts">
    import { outputs } from "../../../stores"
    import { getJADestinations } from "../../../utils/jaProjectionDestinations"
    export let label = "Enviar a…"
    export let onSend: (ids: string[]) => void
    export let compact = true
    let open = false
    let selected: string[] = []
    $: primaryId = typeof localStorage === "undefined" ? "" : localStorage.getItem("ja-main-projector") || ""
    $: destinations = getJADestinations($outputs, primaryId)
    $: enabled = destinations.length >= 2 && destinations.some((d) => d.role === "primary")
    $: if (!enabled) open = false
    function toggle(id: string) { selected = selected.includes(id) ? selected.filter((a) => a !== id) : [...selected, id] }
    function send() { if (!selected.length) return; onSend([...selected]); open = false; selected = [] }
</script>
{#if enabled}
    <div class="jaChooser">
        <button class="trigger" type="button" on:click={() => open = !open} aria-expanded={open} title={label}>{compact ? "▾" : label}</button>
        {#if open}
            <div class="menu">
                <div class="heading"><strong>Enviar a pantallas</strong><button type="button" on:click={() => open = false} aria-label="Cerrar">×</button></div>
                <p>Puedes seleccionar una o varias salidas.</p>
                {#each destinations as dest (dest.id)}
                    <label><input type="checkbox" checked={selected.includes(dest.id)} on:change={() => toggle(dest.id)} />
                    <span><strong>{dest.name}</strong><small>{dest.role === "primary" ? "Principal · audio" : "Secundaria · sin audio"}</small></span></label>
                {/each}
                <button class="send" disabled={!selected.length} type="button" on:click={send}>Enviar a {selected.length || "…"} pantalla{selected.length === 1 ? "" : "s"}</button>
            </div>
        {/if}
    </div>
{/if}
<style>
.jaChooser{position:relative;display:inline-flex;min-width:0}
.trigger{border:1px solid var(--secondary);background:var(--primary-darker);color:var(--text);border-radius:5px;padding:6px 10px;cursor:pointer}
.menu{position:absolute;bottom:calc(100% + 6px);right:0;z-index:100;background:var(--primary-darkest);border:1px solid var(--primary-lighter);border-radius:10px;padding:12px;width:245px;box-shadow:0 8px 26px #0007;color:var(--text)}
.heading{display:flex;justify-content:space-between;align-items:center}.heading button{border:0;background:none;color:inherit;font-size:18px;cursor:pointer}
.menu p{font-size:11px;opacity:.75;margin:7px 0}
.menu label{display:flex;align-items:center;gap:9px;padding:7px;border-radius:5px;cursor:pointer}.menu label:hover{background:var(--primary)}
.menu label span{display:flex;flex-direction:column;gap:2px;font-size:12px}.menu small{font-size:10px;opacity:.7}
.send{width:100%;margin-top:9px;background:var(--secondary);color:var(--primary-darkest);font-weight:bold;border:0;border-radius:6px;padding:9px;cursor:pointer}.send:disabled{opacity:.5}
</style>