import { accessToken, refreshToken, state, verifier } from '@/stores/auth';
import { get } from 'svelte/store';
import { page } from '$app/stores';
import Account from '$lib/Spotify/accounts';
import getPkce from 'oauth-pkce';
import handleError from '$lib/error';
import Toast from '@/stores/toast';
import User from '@/stores/user';

const base = 'https://accounts.spotify.com';

function generateState(length) {
	let stateString = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
		stateString += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return stateString;
}

async function getAuthorizationURL() {
	const pkce = await new Promise((resolve) => {
		getPkce(50, (error, { verifier, challenge }) => {
			if (error) {
				get(Toast).push('Something went wrong, try refreshing the page.');
			}

			resolve({ verifier, challenge });
		});
	});

	verifier.set(pkce.verifier);

	const authURL = new URL(
		`${base}/authorize?` +
		new URLSearchParams({
			client_id: import.meta.env.VITE_CLIENT_ID,
			response_type: 'code',
			redirect_uri: import.meta.env.VITE_REDIRECT_URL,
			state: generateState(20),
			scope: import.meta.env.VITE_APPLICATION_SCOPES,
			code_challenge_method: 'S256',
			code_challenge: pkce.challenge
		})
	);

	state.set(authURL.searchParams.get('state'));

	return authURL;
}

function getAccessToken(authCode) {
	const responseState = get(page).url.searchParams.get('state');
	const localState = get(state);

	if (responseState == null || responseState !== localState) {
		get(Toast).push('Something went wrong. Please log out and reconnect.');
	}

	const accessURL = new URL(`${base}/api/token`);

	const accessBody = new URLSearchParams({
		grant_type: 'authorization_code',
		code: authCode,
		redirect_uri: import.meta.env.VITE_REDIRECT_URL,
		client_id: import.meta.env.VITE_CLIENT_ID,
		code_verifier: get(verifier)
	});

	fetch(accessURL, {
		method: 'POST',
		body: accessBody,
		headers: new Headers({
			Authorization: import.meta.env.VITE_AUTHORIZATION,
			'Content-Type': 'application/x-www-form-urlencoded'
		})
	})
		.then((response) => {
			return response.json();
		})
		.then((data) => handleAccessToken(data))
		.catch((error) => {
			handleError(error);
		});
}

function refreshAccessToken() {
	const refreshURL = new URL(`${base}/api/token`);

	const refreshBody = new URLSearchParams({
		grant_type: 'refresh_token',
		refresh_token: get(refreshToken),
		client_id: import.meta.env.VITE_CLIENT_ID
	});

	fetch(refreshURL, {
		method: 'POST',
		body: refreshBody,
		headers: new Headers({
			Authorization: import.meta.env.VITE_AUTHORIZATION,
			'Content-Type': 'application/x-www-form-urlencoded'
		})
	})
		.then((response) => {
			if (response.ok) {
				return response.json();
			}

			if (response.status === 400) {
				throw {
					name: 'refresh400'
				};
			}
		})
		.then((data) => handleAccessToken(data))
		.catch((error) => {
			handleError(error);
		});
}

let accessTokenTimeoutId;

function handleAccessToken(data) {
	accessToken.set(data['access_token']);
	refreshToken.set(data['refresh_token']);

	accessTokenTimeoutId = setTimeout(refreshAccessToken, data['expires_in'] * 1000);
}

function healthCheck() {
	const localAccessToken = get(accessToken);

	if (localAccessToken) {
		refreshAccessToken();
	}
}

function logout() {
	accessToken.set(null);
	refreshToken.set(null);

	//TODO: Clear API calls that are queued
	clearTimeout(accessTokenTimeoutId);
	clearTimeout(Account.getCurrentTrackTimeoutId);
	get(User).clear();
}

export default {
	getAccessToken,
	getAuthorizationURL,
	healthCheck,
	logout
};
