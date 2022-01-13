import { get, writable } from "svelte/store";

const defaultCurrent = {
	artist: '',
	song: '',
	genres: []
};

const defaultDisplayName = '';

const defaultPlaylists = [];

const user = writable({
	current: defaultCurrent,
	displayName: defaultDisplayName,
	playlists: defaultPlaylists,
	clear: () => {
		user.set({
			current: defaultCurrent,
			displayName: defaultDisplayName,
			playlists: defaultPlaylists,
			clear: get(user).clear
		});
	}
});

export default user;
