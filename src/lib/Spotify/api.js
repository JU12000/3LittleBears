import { accessToken } from '@/stores/auth';
import { get } from 'svelte/store';
import handleError from '$lib/error';
import Recommendations from '$lib/recommendations';
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
			User.update((x) => {
				return {
					...x,
					displayName: data['display_name']
				};
			});
		})
		.catch((error) => {
			handleError(error);
		});
}

export let getCurrentTrackTimeoutId;

function getCurrentlyPlayingTrack(resetTimeout = true) {
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
				!data ||
				data.item.artists[0].name !== get(User).current.artist ||
				data.item.name !== get(User).current.song
			) {
				const genres = await getArtistGenres(data.item.artists[0].id);

				User.update((x) => {
					return {
						...x,
						current: {
							artist: data.item.artists[0].name,
							song: data.item.name,
							genres: genres
						}
					};
				});
			}

			if (resetTimeout) {
				clearTimeout(getCurrentTrackTimeoutId);
			}

			// Run this request again in 15 seconds or when the song ends, whichever
			// comes first
			const timeout = Math.min(
				data ? data.item.duration_ms - data.progress_ms : 30000,
				15000
			);

			getCurrentTrackTimeoutId = setTimeout(
				getCurrentlyPlayingTrack.bind(false),
				timeout
			);
		})
		.catch((error) => {
			handleError(error);
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
			return data.genres;
		})
		.catch((error) => {
			handleError(error);
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
			const playlists = data.items
				.filter(
					(x) =>
						x.owner['display_name'] === get(User).displayName &&
						!ignoreNotationRegex.test(x.description)
				)
				.map((x) => {
					const notated = genreNotationRegex.test(x.description);

					let genres;
					if (notated) {
						const genreNotationString =
							x.description.match(genreNotationRegex)[0];
						genres = genreNotationString
							.substring(13, genreNotationString.length - 1)
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
						tracks: x.tracks
					};
				});

			for (const index in playlists) {
				const playlist = playlists[index];

				playlist.tracks = await getPlaylistItems(playlist);

				if (playlist.genres.length === 0) {
					playlist.genres = Recommendations.aggregatePlaylistGenres(
						playlist.tracks
					);
				}
			}

			User.update((x) => {
				return {
					...x,
					playlists: playlists
				};
			});
		})
		.catch((error) => {
			handleError(error);
		});
}

async function getPlaylistItems(playlist) {
	const tracks = [];

	let nextURL = playlist.tracks.href;
	while (nextURL != null) {
		await fetch(nextURL, {
			method: 'GET',
			headers: new Headers({
				Authorization: `Bearer ${get(accessToken)}`,
				'Content-Type': 'application/x-www-form-urlencoded'
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
			.then(async (data) => {
				nextURL = data.next;

				for (const index in data.items) {
					const track = data.items[index].track;

					const genres = await getArtistGenres(track.artists[0].id);

					tracks.push({
						artist: track.artists[0].name,
						song: track.name,
						genres: genres
					});
				}
			})
			.catch((error) => {
				handleError(error);
			});
	}

	return tracks;
}

export default {
	getCurrentlyPlayingTrack,
	getCurrentUser,
	getPlaylistItems,
	getUserPlaylists
};
