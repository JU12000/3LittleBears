import { get } from 'svelte/store';
import Spotify from '$lib/Spotify/api';
import User from '@/stores/user';

function sortPlaylists() {
	get(User).playlists.sort((playlist1, playlist2) => {

		// Compute which of the two playlists contains more genres in common with
		// the current song
		playlist1.matchPercent =
			(playlist1.genres.filter((x) =>
				get(User).current.genres.includes(x.toLowerCase())).length /
				get(User).current.genres.length
			) * 100;
		playlist2.matchPercent =
			(playlist2.genres.filter((x) =>
				get(User).current.genres.includes(x.toLowerCase())).length /
				get(User).current.genres.length
			) * 100;

		// In cases where either playlist is notated but not both
		if (playlist1.notated && !playlist2.notated) {
			// If the notated playlist has any matches
			if (playlist1.matchPercent > 0) {
				// Sort it ahead of the non-notated playlist
				return -1;
			}

			// Otherwise, sort it after
			return 1;
		} else if (!playlist1.notated && playlist2.notated) {
			if (playlist2.matchPercent > 0) {
				return -1;
			}

			return 1;
		}

		// In cases where both or neither playlist is notated just sort whichever
		// has the higher match percentage first
		if (playlist1.matchPercent > playlist2.matchPercent) {
			return -1;
		} else if (playlist1.matchPercent < playlist2.matchPercent) {
			return 1;
		}

		// In all other cases, sort the one with less songs first.

		//TODO: Here is where to sort by Spotify stats (dancability etc.)
		return 0;
	});

	// This redundant assignment triggers svelte to re-compute the {#each} that
	// displays playlists, thus updating the page.
	User.set(get(User));
}

async function aggregatePlaylistGenres(playlist) {
	let genres = [];

	const tracks = await Spotify.getPlaylistItems(playlist);

	for (const index in tracks) {
		genres = genres.concat(tracks[index].genres);
	}

	let genreCountsMap = genres.reduce((map, genre) => {
		map[genre] = (map[genre] || 0) + 1;
		return map;
	}, {});

	let sortedGenreCountsMap = Object.keys(genreCountsMap).sort((a, b) => {
		return genreCountsMap[b] - genreCountsMap[a];
	});

	genres = sortedGenreCountsMap.slice(0, 5);

	return genres;
}

export default {
	aggregatePlaylistGenres,
	sortPlaylists
};
