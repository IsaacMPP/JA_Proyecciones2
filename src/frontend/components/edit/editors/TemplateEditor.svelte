<script lang="ts">
    import { onDestroy } from "svelte"
    import { activeEdit, activePopup, popupData, templates, outputs, scriptureSettings } from "../../../stores"
    import { translateText } from "../../../utils/language"
    import TemplateSlide from "../../drawer/pages/TemplateSlide.svelte"
    import Icon from "../../helpers/Icon.svelte"
    import T from "../../helpers/T.svelte"
    import { clone } from "../../helpers/array"
    import { history } from "../../helpers/history"
    import { getStyles } from "../../helpers/style"
    import { getFirstActiveOutput } from "../../helpers/output"
    import FloatingInputs from "../../input/FloatingInputs.svelte"
    import MaterialButton from "../../inputs/MaterialButton.svelte"
    import MaterialZoom from "../../inputs/MaterialZoom.svelte"
    import Center from "../../system/Center.svelte"
    import DropArea from "../../system/DropArea.svelte"
    import { centerZoom } from "../scripts/zoom"

    const update = () => (Slide = clone($templates[currentId]))
    $: currentId = $activeEdit.id!
    $: if (currentId) update()
    let Slide = clone($templates[currentId])
    const unsubscribe = templates.subscribe((a) => clone((Slide = a[currentId])))
    onDestroy(unsubscribe)

    // Preview the projected Scripture content without replacing reusable template variables.
    let showLiveVerse = false
    $: projectedSlide = getFirstActiveOutput($outputs)?.out?.slide
    $: isBibleTemplate = !!currentId && $scriptureSettings.template === currentId && projectedSlide?.id === "temp"
    $: versePreview = isBibleTemplate && projectedSlide?.tempItems?.length && Slide
        ? { ...Slide, items: projectedSlide.tempItems }
        : null

    let newStyles: { [key: string]: string | number } = {}
    $: active = $activeEdit.items

    let lastActiveIds = ""
    $: if (active.join(",") !== lastActiveIds) {
        newStyles = {}
        lastActiveIds = active.join(",")
    }

    let ratio = 1

    $: {
        if (active.length) updateStyles()
        else newStyles = {}
    }

    function updateStyles() {
        if (!Object.keys(newStyles).length) return

        let items = Slide.items
        let values: string[] = []
        active.forEach((id) => {
            let item = items[id]
            let styles = getStyles(item.style)
            let textStyles = ""

            const itemNewStyles = (newStyles as any).__multiPositions ? (newStyles as any).__multiPositions[id] || {} : newStyles
            Object.entries(itemNewStyles).forEach(([key, value]) => (styles[key] = (value as any).toString()))
            Object.entries(styles).forEach((obj) => (textStyles += obj[0] + ":" + obj[1] + ";"))

            values.push(textStyles)
        })

        let override = "template_items#" + $activeEdit.id + "indexes#" + active.join(",")
        history({ id: "UPDATE", newData: { key: "items", indexes: active, subkey: "style", data: values }, oldData: { id: $activeEdit.id }, location: { page: "edit", id: "template_items", override } })
    }

    let width = 0
    let height = 0

    // ZOOM
    let scrollElem: HTMLDivElement | undefined
    let zoom = 1
    let zoomOrigin: { x: number; y: number } | null = null
    function updateZoom(e: any) {
        zoom = e.detail
        const origin = zoomOrigin
        zoomOrigin = null
        centerZoom(origin, scrollElem, ".droparea")
    }

    $: styleOverrides = (Slide?.settings?.styleOverrides || []).filter((a) => (a.globalRegex || a.pattern) && a.templateId).length
</script>

{#if Slide?.isDefault}
    <div class="default" data-title={translateText("example.default")}>
        <Icon id="protected" white />
    </div>
{/if}

<div class="editArea">
    <div class="parent" class:noOverflow={zoom >= 1} bind:this={scrollElem} bind:offsetWidth={width} bind:offsetHeight={height}>
        <!--  && (!Slide.isDefault) -->
        {#if Slide}
            <DropArea id="edit" file>
                <div class="jaEditorSplit" class:livePreviewOpen={showLiveVerse && !!versePreview}>
                    <div class="jaEditorCanvas">
                        <TemplateSlide bind:newStyles templateId={currentId} template={Slide} edit width={showLiveVerse && versePreview ? width / 2 : width} {height} {zoom} bind:ratio />
                    </div>
                    {#if showLiveVerse && versePreview}
                        <div class="jaPreviewCanvas" aria-label="Vista previa del versículo proyectado">
                            <div class="jaPreviewTitle">Versículo proyectado · vista previa</div>
                            <TemplateSlide templateId={currentId} template={versePreview} preview width={width / 2} {height} {zoom} />
                        </div>
                    {/if}
                </div>
            </DropArea>
        {:else}
            <Center size={2} faded>
                <T id="empty.slide" />
            </Center>
        {/if}
    </div>

    {#if isBibleTemplate}
        <button class="jaLiveToggle" type="button" aria-pressed={showLiveVerse} on:click={() => (showLiveVerse = !showLiveVerse)}>
            {showLiveVerse ? "Ocultar vista en vivo" : "Mostrar vista en vivo"}
        </button>
    {/if}

    <FloatingInputs side="left">
        <MaterialZoom columns={zoom} min={0.2} max={4} defaultValue={1} addValue={0.1} on:change={updateZoom} on:origin={(e) => (zoomOrigin = e.detail)} />

        {#if styleOverrides > 0}
            <div class="divider"></div>

            <MaterialButton
                icon="text"
                on:click={() => {
                    popupData.set({ templateId: currentId })
                    activePopup.set("template_style_overrides")
                }}
            >
                {translateText("popup.template_style_overrides")}
                <span style="font-size: 0.8em;opacity: 0.5;">{styleOverrides}</span>
            </MaterialButton>
        {/if}
    </FloatingInputs>
</div>

<style>
    .jaEditorSplit { display: flex; width: 100%; height: 100%; min-width: 0; }
    .jaEditorCanvas { flex: 1; position: relative; min-width: 0; }
    .jaPreviewCanvas { flex: 1; min-width: 0; position: relative; border-left: 2px solid var(--primary-lighter); overflow: hidden; pointer-events: none; }
    .jaPreviewTitle { position: absolute; top: 8px; left: 12px; z-index: 10; background: var(--primary-darkest); border-radius: 6px; padding: 6px 10px; font-size: .75rem; }
    .jaLiveToggle { position: absolute; top: 16px; right: 18px; z-index: 15; padding: 10px 14px; border: 1px solid var(--primary-lighter); background: var(--primary-dark); color: var(--text); border-radius: 8px; cursor: pointer; }
    .jaLiveToggle:hover { background: var(--primary); }
    .default {
        position: absolute;
        top: 10px;
        left: 10px;

        width: 42px;
        height: 42px;

        display: flex;
        align-items: center;
        justify-content: center;

        background-color: var(--primary-darkest);
        border: 1px solid var(--primary-lighter);

        padding: 10px;
        border-radius: 50%;

        z-index: 999;
    }

    .editArea {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .parent {
        width: 100%;
        height: 100%;
        display: flex;
        overflow: auto;
    }

    /* disable "glitchy" scroll bars */
    .parent.noOverflow {
        overflow: hidden;
    }
</style>
