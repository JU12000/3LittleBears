import { get } from 'svelte/store';
import Account from '$lib/Spotify/accounts';
import Toast from '@/stores/toast';

export default function (error) {
	if (error.name === 'refresh400' || error.name === 'expiredToken') {
		Account.logout();

		get(Toast).push('Something went wrong, plese try logging in again.');

		return;
	}

	Account.logout();

	get(Toast).push('Unexpected error, please try reloading the site.');
}
