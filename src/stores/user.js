import { writable } from "svelte/store";

//TODO: Clear this when the user logs out
export const current = writable({
	artist: '',
	song: '',
	genres: []
});
