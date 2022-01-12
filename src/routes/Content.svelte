<script>
	import { accessToken } from '@/stores/auth';
	import { displayName } from '@/stores/user';
	import CurrentlyPlaying from './CurrentlyPlaying.svelte';
	import Playlists from './Playlist/Playlists.svelte';
	import Spotify from '$lib/spotify';

	function refreshCurrentlyPlaying() {
		Spotify.getCurrentTrack();
	}

	function refreshPlaylists() {
		//TODO: playlist refresh should trigger a sort.
		Spotify.getUserPlaylists();
	}

	$: if ($accessToken) {
		Spotify.getCurrentUser();
		Spotify.getCurrentTrack();
		Spotify.getUserPlaylists();
	}
</script>

<div class="bg-slate-700 flex flex-col flex-grow">
	<div class="py-5 self-center">
		<p class="text-center">Welcome, {$displayName}. It's good to have you!</p>
	</div>

	<CurrentlyPlaying />

	<div class="py-5 self-center">
		<button on:click={refreshCurrentlyPlaying}> Refresh Currently Playing </button>
	</div>

	<Playlists />

	<div class="py-5 self-center">
		<button on:click={refreshPlaylists}> Refresh Playlists </button>
	</div>
</div>
