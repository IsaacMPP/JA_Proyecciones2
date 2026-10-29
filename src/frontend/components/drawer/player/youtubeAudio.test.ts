import { describe, expect, it, vi } from "vitest"
import { reconcileYouTubeAudio } from "./youtubeAudio"

function makePlayer(muted: boolean, volume = 100) {
    const state = { muted, volume }
    const player = {
        isMuted: vi.fn(async () => state.muted),
        mute: vi.fn(async () => { state.muted = true }),
        unMute: vi.fn(async () => { state.muted = false }),
        getVolume: vi.fn(async () => state.volume),
        setVolume: vi.fn(async (value: number) => { state.volume = value })
    }
    return { player, state }
}

describe("youtube-player asynchronous mute API", () => {
    it("unmutes an audible primary when YouTube iframe starts muted", async () => {
        const { player, state } = makePlayer(true)
        await reconcileYouTubeAudio(player, false, true)
        expect(state.muted).toBe(false)
        expect(player.unMute).toHaveBeenCalledOnce()
        expect(player.mute).not.toHaveBeenCalled()
    })

    it("restores zero YouTube volume only during initial audible setup", async () => {
        const { player, state } = makePlayer(true, 0)
        await reconcileYouTubeAudio(player, false, true)
        expect(state.volume).toBe(100)
        state.volume = 0
        await reconcileYouTubeAudio(player, false, false)
        expect(state.volume).toBe(0)
        expect(player.setVolume).toHaveBeenCalledOnce()
    })

    it("silences previews and secondary outputs without changing their volume", async () => {
        const { player, state } = makePlayer(false, 80)
        await reconcileYouTubeAudio(player, true, false)
        expect(state.muted).toBe(true)
        expect(state.volume).toBe(80)
        expect(player.setVolume).not.toHaveBeenCalled()
        expect(player.unMute).not.toHaveBeenCalled()
    })

    it("does not issue redundant mute commands", async () => {
        const { player } = makePlayer(false)
        await reconcileYouTubeAudio(player, false)
        expect(player.unMute).not.toHaveBeenCalled()
        await reconcileYouTubeAudio(player, true)
        await reconcileYouTubeAudio(player, true)
        expect(player.mute).toHaveBeenCalledOnce()
    })
})
