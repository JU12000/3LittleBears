import { writable } from 'svelte/store';
import { browser } from '$app/env';

const cookieExpirationString = ' ; expires=Thu, 01 Jan 1970 00:00:00 GMT';

export const accessToken = writable(
	browser &&
		document.cookie.split('; ').find((x) => /accessToken=.*/g.test(x)) &&
		document.cookie
			.split('; ')
			.find((x) => /accessToken=.*/g.test(x))
			.substring(12)
);
accessToken.subscribe((value) => {
	if (browser) {
		document.cookie = `accessToken=${
			value != null ? value : cookieExpirationString
		}`;
	}
});

export const refreshToken = writable(
	browser &&
		document.cookie.split('; ').find((x) => /refreshToken=.*/g.test(x)) &&
		document.cookie
			.split('; ')
			.find((x) => /refreshToken=.*/g.test(x))
			.substring(13)
);
refreshToken.subscribe((value) => {
	if (browser) {
		document.cookie = `refreshToken=${
			value != null ? value : cookieExpirationString
		}`;
	}
});

//TODO: Check if svelte sends X-site-cookies, if not switch this to use a cookie instead of localstorage
export const state = writable(browser && localStorage.getItem('state'));
state.subscribe((value) => {
	if (browser) {
		localStorage.setItem('state', value != null ? value : '');
	}
});

//TODO: Check if svelte sends X-site-cookies, if not switch this to use a cookie instead of localstorage
export const verifier = writable(
	browser && localStorage.getItem('verifier')
);
verifier.subscribe((value) => {
	if (browser) {
		localStorage.setItem('verifier', value != null ? value : '');
	}
});
