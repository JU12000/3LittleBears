import { writable } from 'svelte/store';
import { browser } from '$app/env';

export const accessToken = writable(browser && document.cookie.split('; ').find(x => /accessToken=.*/g.test(x)));
accessToken.subscribe(value => {
	if (browser && value != null) {
		document.cookie = `accessToken=${value}`;
	}
});

export const current = writable({
	artist: '',
	song: '',
	genres: []
});

export const refreshToken = writable(browser && document.cookie.split('; ').find(x => /refreshToken=.*/g.test(x)));
accessToken.subscribe(value => {
	if (browser && value != null) {
		document.cookie = `refreshToken=${value}`;
	}
});

export const state = writable(browser && localStorage.getItem('state'));
state.subscribe(value => {
	if (browser) {
		localStorage.setItem('state', value != null ? value : '');
	}
});

export const toast = writable([]);

export const toastCount = writable(0);

export const verifier = writable(browser && localStorage.getItem('verifier'));
verifier.subscribe(value => {
	if (browser) {
		localStorage.setItem('verifier', value != null ? value : '');
	}
});
