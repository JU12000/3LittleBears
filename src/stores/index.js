import { writable } from 'svelte/store';

export const current = writable({
	artist: '',
	song: '',
	genres: []
});

export * as auth from './auth';

export * as toast from './toast';
