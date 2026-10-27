import { writable } from "svelte/store"

// Operator's inspected output; never changes the JA projection primary.
export const jaControlledOutputId = writable("")
