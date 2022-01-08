import { generateState } from '$lib/state';
import { get } from 'svelte/store';
import { page } from '$app/stores';
import { accessToken, current, refreshToken, state, verifier } from '../stores';
import getPkce from 'oauth-pkce';

const authBase = 'https://accounts.spotify.com';
const base = 'https://api.spotify.com/v1';

async function getAuthorization() {
	const pkce = await new Promise((resolve) => {
		getPkce(50, (error, { verifier, challenge }) => {
			if (error) {
				//TODO: Handle this better
				throw error;
			}

			resolve({ verifier, challenge });
		});
	});

	verifier.set(pkce.verifier);

	const authURL = new URL(
		`${authBase}/authorize?` +
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

	if (responseState != null && responseState === localState) {
		const accessURL = new URL(`${authBase}/api/token`);

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
				Authorization: import.meta.env.VITE_BASE64_AUTHORIZATION,
				'Content-Type': 'application/x-www-form-urlencoded'
			})
		})
		.then((response) => {
			return response.json();
		})
		.then((data) => handleAccessToken(data));
	}

	//TODO: Handle cases where the responseState is bad
}

function refreshAccessToken() {
	const refreshURL = new URL(`${authBase}/api/token`);

	const refreshBody = new URLSearchParams({
		grant_type: 'refresh_token',
		refresh_token: get(refreshToken),
		client_id: import.meta.env.VITE_CLIENT_ID
	});

	fetch(refreshURL, {
		method: 'POST',
		body: refreshBody,
		headers: new Headers({
			Authorization: import.meta.env.VITE_BASE64_AUTHORIZATION,
			'Content-Type': 'application/x-www-form-urlencoded'
		})
	})
	.then((response) => {
		return response.json();
	})
	.then((data) => handleAccessToken(data));
}

function handleAccessToken(data) {
	accessToken.set(data['access_token']);
	refreshToken.set(data['refresh_token']);

	setTimeout(refreshAccessToken, data['expires_in'] * 1000);
}

function getCurrentTrack() {
	const requestURL = new URL(`${base}/me/player/currently-playing`);

	fetch(requestURL, {
		method: 'GET',
		headers: new Headers({
			Authorization: `Bearer ${get(accessToken)}`,
			'Content-Type': 'application/json'
		})
	})
	.then((response) => {
		return response.json();
	})
	.then(async (data) => {
		current.set({
			artist: data.item.artists[0].name,
			song: data.item.name,
			genres: await getArtistGenres(data.item.artists[0].id)
		});
	});
}

function getArtistGenres(id) {
	const requestURL = new URL(`${base}/artists/${id}`);

	return fetch(requestURL, {
		method: 'GET',
		headers: new Headers({
			Authorization: `Bearer ${get(accessToken)}`,
			'Content-Type': 'application/json'
		})
	})
	.then((response) => {
		return response.json();
	})
	.then((data) => {
		return data.genres;
	});
}

export default {
	getAccessToken,
	getAuthorization,
	getCurrentTrack
};
