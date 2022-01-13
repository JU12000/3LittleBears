import { accessToken } from '@/stores/auth';
import { get } from 'svelte/store';
import handleError from '$lib/error';
import User from '@/stores/user';

const base = 'https://api.spotify.com/v1';

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
			if (response.ok) {
				return response.json();
			}

			if (response.status === 401) {
				throw {
					name: 'expiredToken'
				};
			}

			throw new Error();
		})
		.then((data) => {
			User.set({
				displayName: data['display_name'],
				...get(User)
			});
		})
		.catch((error) => {
			handleError(error);
		});
}

let getCurrentTrackTimeoutId;

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
			if (response.status === 204) {
				return undefined;
			}

			if (response.ok) {
				return response.json();
			}

			if (response.status === 401) {
				throw {
					name: 'expiredToken'
				};
			}

			throw new Error();
		})
		.then(async (data) => {
			if (
				!data
				|| data.item.artists[0].name != get(User).current.artist
				|| data.item.name != get(User).current.song
			) {
				User.set({
					current: {
						artist: data ? data.item.artists[0].name : '',
						song: data ? data.item.name : '',
						genres: data ? await getArtistGenres(data.item.artists[0].id) : []
					},
					...get(User)
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
			User.set({
				playlists: data.items
					.filter(x =>
						x.owner['display_name'] === get(User).displayName
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
					}),
				...get(User)
			});
		});
}

export default {
	getCurrentTrack,
	getCurrentTrackTimeoutId,
	getCurrentUser,
	getUserPlaylists
};
