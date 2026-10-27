<script lang="ts">
    import { onMount } from "svelte"
    import { hymnFolders, hymnVideos, hymnLibraryError, refreshJAHymnLibrary } from "../../../utils/jaHymnLibrary"
    import { isPathInJACollection } from "../../../utils/jaHymnPaths"
    import { loadThumbnail, getMediaStyle, encodeFilePath } from "../../helpers/media"
    import { getFirstActiveOutput, setOutput } from "../../helpers/output"
    import { activeEdit, activeShow, media, outLocked, outputs, styles } from "../../../stores"

    export let searchValue = ""
    export let collection = "Himnario Adventista"
    $: currentRoot = $hymnFolders[collection] || ""
    $: shown = $hymnVideos.filter((video) => (collection === "Todas" || isPathInJACollection(video.path, currentRoot)) && (!searchValue || video.name.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchValue.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))))
    let thumbnailCache: Record<string, string> = {}
    let lastThumbnailSignature = ""
    $: {
        const signature = shown.slice(0, 80).map((v) => v.path).join("|")
        if (signature !== lastThumbnailSignature) {
            lastThumbnailSignature = signature
            void getPreviews(shown.slice(0, 80))
        }
    }
    async function getPreviews(files: typeof shown) {
        for (const item of files) {
            if (thumbnailCache[item.path]) continue
            try {
                const preview = await loadThumbnail(item.path)
                if (preview) thumbnailCache = { ...thumbnailCache, [item.path]: preview }
            } catch { /* keep video fallback */ }
        }
    }
    function preview(video: typeof shown[number]) {
        activeEdit.set({ id: video.path, type: "media", items: [] })
        activeShow.set({ id: video.path, name: video.name.replace(/\.[^.]+$/, ""), type: "video" })
    }
    function project(video: typeof shown[number]) {
        if ($outLocked) return
        const output = getFirstActiveOutput($outputs)
        if (!output) return
        const mediaStyle = getMediaStyle($media[video.path], $styles[output.style || ""])
        setOutput("background", { path: video.path, type: "video", loop: false, muted: false, startAt: 0, ...mediaStyle }, false, output.id)
    }
    onMount(() => { void refreshJAHymnLibrary() })
</script>

<section class="jaHymns">
    <header><strong>Videohimnario</strong><span>{shown.length} videos</span><button type="button" on:click={() => refreshJAHymnLibrary()}>Actualizar</button></header>
    {#if $hymnLibraryError}<p class="error">{$hymnLibraryError}</p>{/if}
    {#if !shown.length}<p>Sin videos en esta colección. Copia tus himnos a Documentos / JA Proyecciones 2 / {collection} y pulsa Actualizar.</p>{/if}
    <div class="grid">
        {#each shown as video (video.path)}
            <article title={video.path} class:selected={$activeShow?.id === video.path}>
                <button class="select" type="button" on:click={() => preview(video)} aria-label={"Vista previa: " + video.name}>
                    <div class="thumbnail">
                        {#if thumbnailCache[video.path]}
                            <img src={encodeFilePath(thumbnailCache[video.path])} alt="" loading="lazy" />
                        {:else}<span>▶</span>{/if}
                    </div>
                    <p>{video.name.replace(/\.[^.]+$/, "")}</p>
                </button>
                <button class="project" type="button" disabled={$outLocked} on:click={() => project(video)}>Proyectar</button>
            </article>
        {/each}
    </div>
</section>
<style>
    .jaHymns {padding:14px;width:100%;color:var(--text);overflow-y:auto}
    header {display:flex;align-items:center;gap:12px;margin-bottom:14px}
    header span {opacity:.7}
    header button {margin-left:auto;border:1px solid var(--primary-lighter);padding:7px 12px;background:var(--primary);color:var(--text);border-radius:6px;cursor:pointer}
    .grid {display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:12px}
    article {min-width:0;background:var(--primary);border:1px solid var(--primary-lighter);border-radius:7px;overflow:hidden}
    article.selected {outline:2px solid var(--secondary)}
    .select {display:block;width:100%;border:0;padding:0;background:transparent;color:inherit;text-align:left;cursor:pointer}
    .thumbnail {aspect-ratio:16/9;background:var(--primary-darkest);display:flex;align-items:center;justify-content:center;position:relative}
    .thumbnail img {width:100%;height:100%;object-fit:contain}
    .thumbnail span {font-size:24px;opacity:.6}
    article p {padding:8px;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .project {display:block;margin:0 8px 8px;padding:6px;width:calc(100% - 16px);border:1px solid var(--secondary);background:var(--primary-darker);color:var(--text);border-radius:5px;cursor:pointer}
    .project:disabled {opacity:.45;cursor:not-allowed}
    .error {color:var(--secondary)}
</style>
