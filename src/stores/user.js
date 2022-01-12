import { writable } from "svelte/store";

export const current = writable({
	artist: '',
	song: '',
	genres: []
});

export const displayName = writable('');

export const playlists = writable([]);
