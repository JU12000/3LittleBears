import { get } from 'svelte/store';
import Account from '$lib/Spotify/accounts';
import Toast from '@/stores/toast';
import { dev } from '$app/env';

export default function (error) {
	if (error.name === 'refresh400' || error.name === 'expiredToken') {
		Account.logout();

		get(Toast).push(
			'Something went wrong, plese try logging in again. This may be showing up because you logged out while the app was loading.'
		);

		return;
	}

	Account.logout();

	get(Toast).push('Unexpected error, please try reloading the site.');

	if (dev) {
		throw error;
	}
}
