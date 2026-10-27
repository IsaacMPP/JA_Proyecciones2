import { writable } from "svelte/store"
import { Main } from "../../types/IPC/Main"
import type { FileFolder } from "../../types/Main"
import { requestMain } from "../IPC/main"
import { isJAExclusiveHymnPath, normalizeJAContentPath } from "./jaHymnPaths"

// JA-owned video libraries are separate from FreeShow mediaFolders/audioFolders.
export const hymnFolders = writable<Record<string, string>>({})
export const hymnVideos = writable<FileFolder[]>([])
export const hymnLibraryError = writable("")

const EXTENSIONS = new Set(["mp4", "mov", "m4v", "webm", "avi", "mkv", "wmv"])
let refreshGeneration = 0

export function isHymnVideo(name: string): boolean {
    return EXTENSIONS.has((name.split(".").pop() || "").toLowerCase())
}

// Use the existing folder IPC; never copy, rename or change a user's videos.
// This can be invoked at startup and whenever the independent Hymnario tab opens.
export async function refreshJAHymnLibrary(): Promise<void> {
    const generation = ++refreshGeneration
    const folders = await requestMain(Main.JA_CONTENT_FOLDERS)
    if (!folders?.folders) return
    const roots: Record<string, string> = {}
    for (const name of ["Himnario Adventista", "Cantos Juveniles"]) {
        if (folders.folders[name]) roots[name] = folders.folders[name]
    }
    hymnFolders.set(roots)
    const byPath = new Map<string, FileFolder>()
    let failed = false
    for (const path of Object.values(roots)) {
        try {
            const result = await requestMain(Main.READ_FOLDER, { path, depth: 5 })
            if (generation !== refreshGeneration) return
            if (!result) { failed = true; continue }
            for (const file of Object.values(result) as FileFolder[]) {
                if (file.isFolder || !isHymnVideo(file.name)) continue
                if (!isJAExclusiveHymnPath(file.path, Object.values(roots))) continue
                byPath.set(normalizeJAContentPath(file.path), file)
            }
        } catch {
            failed = true
        }
    }
    if (generation !== refreshGeneration) return
    hymnVideos.set([...byPath.values()].sort((a, b) => a.name.localeCompare(b.name, "es", { numeric: true })))
    hymnLibraryError.set(failed ? "No se pudieron leer una o más carpetas del Himnario." : "")
}
