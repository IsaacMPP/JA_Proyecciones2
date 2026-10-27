<script lang="ts">
    import DropArea from "../system/DropArea.svelte"
    import AudioTabs from "./navigation/AudioTabs.svelte"
    import CalendarTabs from "./navigation/CalendarTabs.svelte"
    import FunctionsTabs from "./navigation/FunctionsTabs.svelte"
    import MediaTabs from "./navigation/MediaTabs.svelte"
    import OverlaysTabs from "./navigation/OverlaysTabs.svelte"
    import ScriptureTabs from "./navigation/ScriptureTabs.svelte"
    import ShowsTabs from "./navigation/ShowsTabs.svelte"
    import TemplatesTabs from "./navigation/TemplatesTabs.svelte"

    import { drawerTabsData } from "../../stores"
    import { hymnVideos, hymnFolders } from "../../utils/jaHymnLibrary"
    import { isPathInJACollection } from "../../utils/jaHymnPaths"

    export let id: "shows" | "media" | "overlays" | "audio" | "effects" | "scripture" | "hymns" | "calendar" | "functions" | "templates" | "timers"
</script>

<div class="main">
    <div class="categories context #category_{id}">
        {#if id === "hymns"}
            <div class="hymnNav">
                <strong>Colecciones</strong>
                {#each ["Himnario Adventista", "Cantos Juveniles"] as name}
                    <button class:active={($drawerTabsData.hymns?.activeSubTab || "Himnario Adventista") === name} on:click={() => drawerTabsData.update((data) => ({ ...data, hymns: { ...data.hymns, enabled: true, activeSubTab: name } }))} type="button">
                        {name}
                        <small>{$hymnVideos.filter((v) => name === "Todas" || isPathInJACollection(v.path, $hymnFolders[name] || "")).length}</small>
                    </button>
                {/each}
            </div>
        {:else if id === "scripture"}
            <ScriptureTabs />
        {:else if id === "calendar"}
            <CalendarTabs />
        {:else if id === "functions"}
            <FunctionsTabs />
        {:else}
            <DropArea id="navigation" selectChildren>
                {#if id === "shows"}
                    <ShowsTabs />
                {:else if id === "media"}
                    <MediaTabs />
                {:else if id === "audio"}
                    <AudioTabs />
                {:else if id === "overlays"}
                    <OverlaysTabs />
                {:else if id === "templates"}
                    <TemplatesTabs />
                {/if}
            </DropArea>
        {/if}
    </div>
</div>

<style>
    .hymnNav { padding:12px;display:flex;flex-direction:column;gap:8px }
    .hymnNav button { background:var(--primary);color:var(--text);border:1px solid var(--primary-lighter);border-radius:5px;padding:10px;text-align:left;cursor:pointer }
    .hymnNav button.active { border-left:3px solid var(--secondary) }
    .hymnNav small { float:right;opacity:.65 }

    .main,
    .categories {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
    }

    /* .categories :global(button) {
        width: 100%;
        padding: 0.1em 0.8em !important;
        justify-content: space-between;
    }
    .tabs :global(button) {
        width: 100%;
    } */

    .tabs {
        display: flex;
        background-color: var(--primary-darker);
    }

    .source {
        display: flex;
        justify-content: center;
        color: var(--text);
        opacity: 0.5;
        padding: 10px;
        font-weight: bold;
    }
    .source:hover {
        opacity: 0.8;
    }
</style>
