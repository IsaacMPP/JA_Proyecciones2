<script lang="ts">
    import { onMount } from "svelte"
    import { hymnFolders, hymnVideos, hymnLibraryError, refreshJAHymnLibrary } from "../../../utils/jaHymnLibrary"
    import { isPathInJACollection } from "../../../utils/jaHymnPaths"

    export let searchValue = ""
    export let collection = "Himnario Adventista"
    $: currentRoot = $hymnFolders[collection] || ""
    $: shown = $hymnVideos.filter((video) => (collection === "Todas" || isPathInJACollection(video.path, currentRoot)) && (!searchValue || video.name.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchValue.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))))
    onMount(() => { void refreshJAHymnLibrary() })
</script>

<section class="jaHymns">
    <header><strong>Videohimnario</strong><span>{shown.length} videos</span><button type="button" on:click={() => refreshJAHymnLibrary()}>Actualizar</button></header>
    {#if $hymnLibraryError}<p class="error">{$hymnLibraryError}</p>{/if}
    {#if !shown.length}<p>Sin videos en esta colección. Copia tus himnos a Documentos / JA Proyecciones 2 / {collection} y pulsa Actualizar.</p>{/if}
    <div class="grid">
        {#each shown as video (video.path)}
            <article title={video.path}>
                <div class="thumbnail"><span>▶</span><small>VIDEO</small></div>
                <p>{video.name.replace(/\.[^.]+$/, "")}</p>
            </article>
        {/each}
    </div>
</section>
<style>
    .jaHymns {padding: 14px; width:100%; color:var(--text); overflow-y:auto}
    header {display:flex;align-items:center;gap:12px;margin-bottom:14px}
    header span {opacity:.7}
    header button {margin-left:auto;border:1px solid var(--primary-lighter);padding:7px 12px;background:var(--primary);color:var(--text);border-radius:6px;cursor:pointer}
    .grid {display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px}
    article {min-width:0;background:var(--primary);border:1px solid var(--primary-lighter);border-radius:7px;overflow:hidden}
    .thumbnail {aspect-ratio:16/9;background:var(--primary-darkest);display:flex;align-items:center;justify-content:center;position:relative}
    .thumbnail span {font-size:24px;opacity:.6}
    .thumbnail small {position:absolute;bottom:5px;right:6px;opacity:.6;font-size:9px}
    article p {padding:8px;font-size:12px;overflow-wrap:anywhere}
    .error {color:var(--secondary)}
</style>
