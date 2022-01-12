import { accessToken, refreshToken, state, verifier } from '@/stores/auth';
import { current } from '@/stores/user';
import { displayName } from '@/stores/user';
import { get } from 'svelte/store';
import { page } from '$app/stores';
import { playlists } from '@/stores/user';
import toast from '@/stores/toast';

const authBase = 'https://accounts.spotify.com';
const base = 'https://api.spotify.com/v1';

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
				Authorization: import.meta.env.VITE_AUTHORIZATION,
				'Content-Type': 'application/x-www-form-urlencoded'
			})
		})
			.then((response) => {
				return response.json();
			})
			.then((data) => handleAccessToken(data))
			.catch((error) => {
				console.log(error);
			});
	}
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
			Authorization: import.meta.env.VITE_AUTHORIZATION,
			'Content-Type': 'application/x-www-form-urlencoded'
		})
	})
		.then((response) => {
			if (response.ok) {
				return response.json();
			}

			if (response.status === 400) {
				logout();

				throw new Error('Please log in again.');
			}
		})
		.then((data) => handleAccessToken(data))
		.catch((error) => {
			get(toast).push(error.message);
		});
}

function healthCheck() {
	const localAccessToken = get(accessToken);

	if (localAccessToken) {
		refreshAccessToken();
	}
}

function handleAccessToken(data) {
	accessToken.set(data['access_token']);
	refreshToken.set(data['refresh_token']);

	setTimeout(refreshAccessToken, data['expires_in'] * 1000);
}

function logout() {
	accessToken.set(null);
	refreshToken.set(null);

	current.set({
		artist: '',
		song: '',
		genres: []
	});
}

let getCurrentTrackTimeoutId;

function getCurrentUser() {
	const requestURL = new URL(`${base}/me`);

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
		.then((data) => {
			displayName.set(data['display_name']);
		});
}

function getCurrentTrack(resetTimeout = true) {
	const requestURL = new URL(`${base}/me/player/currently-playing`);

	fetch(requestURL, {
		method: 'GET',
		headers: new Headers({
			Authorization: `Bearer ${get(accessToken)}`,
			'Content-Type': 'application/json'
		})
	})
		.then((response) => {
			if(response.status === 204) {
				return undefined;
			}

			return response.json();
		})
		.then(async (data) => {
			if (
				!data
				|| data.item.artists[0].name != get(current).artist
				|| data.item.name != get(current).song
			) {
				current.set({
					artist: data ? data.item.artists[0].name : '',
					song: data ? data.item.name : '',
					genres: data ? await getArtistGenres(data.item.artists[0].id) : []
				});
			}

			if (resetTimeout) {
				clearTimeout(getCurrentTrackTimeoutId);
			}

			// Run this request again in 15 seconds or when the song ends, whichever
			// comes first
			const timeout = Math.min(
				data ? (data.item.duration_ms - data.progress_ms) : 30000,
				15000
			);

			getCurrentTrackTimeoutId = setTimeout(getCurrentTrack.bind(false), timeout);
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

const genreNotationRegex = /3LittleBears{.*}/g;
const ignoreNotationRegex = /3LittleBearsIgnore/;

function getUserPlaylists() {
	const requestURL = new URL(`${base}/me/playlists`);

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
			playlists.set(
				data.items
					.filter(x => x.owner['display_name'] === get(displayName)
						&& !ignoreNotationRegex.test(x.description)
					)
					.map(x => {
						const notated = genreNotationRegex.test(x.description);

						let genres;
						if (notated) {
							const genreNotationString = x.description.match(genreNotationRegex)[0];
							genres = genreNotationString.substring(13, genreNotationString.length - 1)
								.split(', ');
						} else {
							genres = [];
						}

						return {
							id: x.id,
							description: x.description,
							genres: genres,
							image: x.images[0],
							name: x.name,
							notated: notated,
							tracks: x.tracks.total
						};
					})
			);
		});
}

export default {
	getAccessToken,
	getAuthorization,
	getCurrentTrack,
	getCurrentUser,
	getUserPlaylists,
	healthCheck,
	logout
};
