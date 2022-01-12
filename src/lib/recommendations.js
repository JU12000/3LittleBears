import { current, playlists } from '@/stores/user';
import { get } from 'svelte/store';

function sortPlaylists() {
	get(playlists).sort((playlist1, playlist2) => {
		// If a playlist doesn't have a 3LittleBears notation, it should be
		// sorted further back until genre interpolation is complete
		const notationRegex = /3LittleBears{.*}/g;

		let playlist1LittleBearGenres = notationRegex.test(playlist1.description)
			? playlist1.description.match(notationRegex)[0]
			: undefined;
		let playlist2LittleBearGenres = notationRegex.test(playlist2.description)
			? playlist2.description.match(notationRegex)[0]
			: undefined;

		// Sort a playlist with a 3LittleBears notation ahead of one without.
		if (playlist1LittleBearGenres == undefined && playlist2LittleBearGenres == undefined) {
			return 0;
		} else if (playlist1LittleBearGenres == undefined) {
			return 1;
		} else if (playlist2LittleBearGenres == undefined) {
			return -1;
		}

		// Transform the LittleBearGenres variable for both playlists into an
		// array of genres
		playlist1LittleBearGenres = playlist1LittleBearGenres
			.substring(13, playlist1LittleBearGenres.length - 1)
			.split(', ');
		playlist2LittleBearGenres = playlist2LittleBearGenres
			.substring(13, playlist2LittleBearGenres.length - 1)
			.split(', ');

		// Compute which of the two playlists contains more notated genres in
		// common with the current song
		playlist1.matchPercent =
			(playlist1LittleBearGenres.filter((x) => get(current).genres.includes(x.toLowerCase())).length /
				get(current).genres.length) *
			100;
		playlist2.matchPercent =
			(playlist2LittleBearGenres.filter((x) => get(current).genres.includes(x.toLowerCase())).length /
				get(current).genres.length) *
			100;

		if (playlist1.matchPercent > 0) {
			playlist1.notated = true;
		} else {
			playlist1.notated = false;
		}

		if (playlist2.matchPercent > 0) {
			playlist2.notated = true;
		} else {
			playlist2.notated = false;
		}

		if (playlist1.matchPercent == playlist2.matchPercent) {
			return 0;
		} else if (playlist1.matchPercent < playlist2.matchPercent) {
			return 1;
		} else if (playlist1.matchPercent > playlist2.matchPercent) {
			return -1;
		}
	});

	// This redundant assignment triggers svelte to re-compute the {#each} that
	// displays playlists, thus updating the page.
	playlists.set(get(playlists));
}

export default {
	sortPlaylists
};
