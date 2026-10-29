<script lang="ts">
    import { createEventDispatcher, onDestroy } from "svelte"
    import { currentWindow, special } from "../../../stores"
    import YouTubePlayer from "./YouTubePlayer.svelte"
    import { VideoPlayer } from "../../media/video/videoPlayer"
    import { reconcileYouTubeAudio, shouldMuteYouTube } from "./youtubeAudio"

    export let videoData = { paused: false, muted: true, loop: false, duration: 0 }
    export let videoTime = 0
    export let actualVideoTime = 0
    export let id
    // export let outputId
    export let preview
    export let sessionId = ""
    export let outputId = ""
    export let sessionActive = false

    // export let startAt = 0

    // <= 0.5.4
    $: id = id.includes("?list") ? id.slice(0, id.indexOf("?list")) : id
    $: id = id.slice(-11)

    // https://developers.google.com/youtube/player_parameters
    const options = {
        playerVars: {
            // JA is the playback source of truth; independent iframe autoplay breaks pause.
            autoplay: 0,
            loop: videoData.loop,
            fs: 0,
            rel: 0,
            controls: $special.hideCursor ? 0 : 1
            // enablejsapi: 1
            // cc_load_policy: true
        }
    }

    let dispatch = createEventDispatcher()
    let player: any | null = null
    let loaded = false
    function onReady(e) {
        player = e.detail.target
        loaded = true
        // youtube-player returns Promises, including isMuted/getVolume.
        // Never compare a Promise as though it were a Boolean.
        applyMuteState()
        // Respect the current JA paused state rather than overriding it on ready.
        if (sessionActive) applyPlaybackState()
        dispatch("loaded", true)
    }

    $: if (loaded) updateTime()
    let timeInterval: NodeJS.Timeout | null = null
    let timePollPending = false
    let disposed = false
    function updateTime() {
        if (timeInterval) clearInterval(timeInterval)
        timeInterval = setInterval(() => { void updateTimeTick() }, 250)
    }
    async function updateTimeTick() {
        if (!player || !loaded || disposed || timePollPending) return
        timePollPending = true
        try {
            // Every youtube-player getter returns a Promise, unlike raw YT.Player.
            const state = await player.getPlayerState()
            const seconds = Number(await player.getCurrentTime())
            if (disposed || !Number.isFinite(seconds)) return
            if (state === 1) actualVideoTime = seconds
            if (preview && !seeking) videoTime = seconds
            if (preview && !videoData.duration) {
                const duration = Number(await player.getDuration())
                if (!disposed && Number.isFinite(duration) && duration > 0) videoData.duration = duration
            }
        } catch (error) {
            console.warn("[YouTube] Could not read playback time:", error)
        } finally {
            timePollPending = false
        }
    }
    onDestroy(() => {
        disposed = true
        if (timeInterval) clearInterval(timeInterval)
    })

    let seeking = false
    $: if (!seeking && videoTime !== undefined) void seekPlayer()
    async function seekPlayer() {
        if (!player || !loaded || seeking || !Number.isFinite(Number(videoTime))) return
        seeking = true
        try {
            const target = Number(videoTime)
            const current = Number(await player.getCurrentTime())
            if (!disposed && Number.isFinite(current) && Math.abs(current - target) >= 2) await player.seekTo(target, true)
        } catch (error) {
            console.warn("[YouTube] Seek failed:", error)
        } finally {
            setTimeout(() => { seeking = false }, 500)
        }
    }

    // One authoritative transport: only an active JA session drives the iframe.
    // The preview can still be played locally with native controls when idle.
    let transportQueue: Promise<void> = Promise.resolve()
    let lastRequestedPlayback: boolean | null = null
    $: if (!sessionActive) lastRequestedPlayback = null
    function applyPlaybackState(force = false) {
        if (!player || !loaded || disposed || !sessionActive || seeking) return
        const desiredPlaying = !videoData.paused
        // videoSync updates time and other fields frequently; only enqueue
        // a YouTube API command when play/pause actually changes.
        if (!force && lastRequestedPlayback === desiredPlaying) return
        lastRequestedPlayback = desiredPlaying
        const activePlayer = player
        transportQueue = transportQueue.catch(() => {}).then(async () => {
            if (disposed || activePlayer !== player || !sessionActive) return
            const desiredPlaying = !videoData.paused
            const currentState = Number(await activePlayer.getPlayerState())
            if (disposed || activePlayer !== player || !sessionActive || desiredPlaying !== !videoData.paused) return
            if (desiredPlaying && currentState !== 1 && currentState !== 3) {
                await activePlayer.playVideo()
            } else if (!desiredPlaying && ![0, 2, 5].includes(currentState)) {
                await activePlayer.pauseVideo()
            }
        }).catch((error) => console.warn("[YouTube] JA transport sync failed:", error))
    }
    $: if (player && loaded && sessionActive && !seeking && videoData.paused !== undefined) applyPlaybackState()

    function relayPreviewPlayback(playing: boolean) {
        if (!preview || !sessionActive || !sessionId || !outputId) return
        // Ignore echoes of a JA command by comparing with the authoritative
        // transport state, not a stale pending-command marker. The latter can
        // swallow a subsequent genuine click in the central YouTube preview.
        if (playing === !videoData.paused) return
        if (playing) VideoPlayer.play(sessionId, outputId)
        else VideoPlayer.pause(sessionId, outputId)
    }

    // The program preview and JA secondary output remain silent. For the
    // audible primary, reconcile the actual YouTube iframe mute state after
    // ready, after state updates, and when autoplay first begins.
    $: shouldBeMuted = shouldMuteYouTube(preview, $currentWindow === "output", sessionActive, !!videoData.muted)
    let muteQueue: Promise<void> = Promise.resolve()
    let hasRestoredAudibleVolume = false
    function applyMuteState() {
        if (!player || !loaded || disposed) return
        const requestedMuted = shouldBeMuted
        // YouTube can retain volume=0 after a previous muted autoplay.
        // Restore it only at first audible initialization, not on every tick,
        // so later user adjustments in the embedded player remain respected.
        const restoreVolume = !requestedMuted && !hasRestoredAudibleVolume
        if (restoreVolume) hasRestoredAudibleVolume = true
        const currentPlayer = player
        // Serialize mute/unmute commands: a delayed async unMute must never
        // undo a newer command to silence an auxiliary/preview window.
        muteQueue = muteQueue.catch(() => {}).then(async () => {
            if (disposed || currentPlayer !== player) return
            await reconcileYouTubeAudio(currentPlayer, requestedMuted, restoreVolume)
        }).catch((error) => console.warn("[YouTube] Could not update iframe audio:", error))
    }
    $: if (player && loaded && shouldBeMuted !== undefined) applyMuteState()
    function onVideoPlaying() {
        applyMuteState()
        relayPreviewPlayback(true)
        // A rogue iframe start must not override JA's paused output clock.
        if (!preview && sessionActive && videoData.paused) applyPlaybackState(true)
    }
    function onVideoPaused() {
        relayPreviewPlayback(false)
        // When the output iframe stops without a pause from JA, bring it back
        // into sync with the central clock. The preview can instead request a
        // pause through the same VideoPlayer controller.
        if (!preview && sessionActive && !videoData.paused) applyPlaybackState(true)
    }

    $: if (!id && player) player.stopVideo()

    // WIP update frontend state if changing output values directly?

    // $: if ($outputWindow && player && videoData.paused) player.seekTo(videoTime)

    // let loopStop = false
    // function change() {
    //     if (loopStop || !loaded || updating || seeking) return

    //     loopStop = true
    //     setTimeout(() => (loopStop = false), 50)

    //     // unstarted (-1), ended (0), playing (1), paused (2), buffering (3), cued (5)
    //     videoData.paused = player.getPlayerState() === 1 ? false : true
    //     if (preview) videoTime = player.getCurrentTime()
    // }

    function ended() {
        dispatch("ended", true)
    }

    // WIP main volume channel should control player videos even though it's not connected at the moment ?
    // $: mainVol = $audioChannelsData.main?.isMuted ? 0 : ($audioChannelsData.main?.volume ?? 1)
    // $: if (!shouldBeMuted && mainVol !== undefined) updateVolume()
    // function updateVolume() {
    //     if (!player) return
    //     player.setVolume(mainVol * 100)
    // }
</script>

<div class="main" class:hide={!id}>
    {#if id}
        <!-- {#if $currentWindow === "output"} -->
        <!-- on:stateChange={change} -->
        <YouTubePlayer class="yt" videoId={id} {options} on:ready={onReady} on:play={onVideoPlaying} on:pause={onVideoPaused} on:end={ended} />
        <!-- {:else}
            <div style="width: 100%;height: 100%;display: flex;align-items: center;justify-content: center;">
                <Icon id="youtube" size={6} white />
            </div>
        {/if} -->
    {/if}
</div>

<style>
    .main {
        pointer-events: initial;
    }

    .main,
    .main :global(.yt),
    .main :global(iframe) {
        height: 100%;
        width: 100%;
    }

    .hide :global(.yt) {
        display: none;
    }
</style>
