// youtube-player wraps EVERY iframe API method in a Promise. Do not use
// isMuted()/getVolume() as synchronous values (as the raw YouTube API does).
export interface YouTubeAudioAPI {
    isMuted(): Promise<boolean>
    mute(): Promise<unknown>
    unMute(): Promise<unknown>
    getVolume(): Promise<number>
    setVolume(volume: number): Promise<unknown>
}

export function shouldMuteYouTube(preview: boolean, inOutputWindow: boolean, sessionActive: boolean, muted: boolean): boolean {
    return preview || !inOutputWindow || !sessionActive || muted
}

export async function reconcileYouTubeAudio(player: YouTubeAudioAPI, requestedMuted: boolean, restoreFirstAudibleVolume = false): Promise<void> {
    const actualMuted = await player.isMuted()
    if (requestedMuted) {
        if (!actualMuted) await player.mute()
        return
    }

    if (actualMuted) await player.unMute()
    if (restoreFirstAudibleVolume && (await player.getVolume()) === 0) {
        await player.setVolume(100)
    }
}
