<script>
	import { accessToken } from '@/stores/auth';
	import CurrentlyPlaying from './CurrentlyPlaying.svelte';
	import Playlists from './Playlist/Playlists.svelte';
	import Recommendations from '$lib/recommendations';
	import Spotify from '$lib/Spotify/api';
	import User from '@/stores/user';

	function refreshCurrentlyPlaying() {
		Spotify.getCurrentlyPlayingTrack();
	}

	async function refreshPlaylists() {
		await Spotify.getUserPlaylists();
		Recommendations.sortPlaylists();
	}

	async function getContent() {
		await Spotify.getCurrentUser();
		await refreshCurrentlyPlaying();
		refreshPlaylists();
	}

	$: if ($accessToken) {
		getContent();
	}
</script>

<div class="bg-slate-700 flex flex-col flex-grow">
	<div class="py-5 self-center">
		<p class="text-center">Welcome, {$User.displayName}. It's good to have you!</p>
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
