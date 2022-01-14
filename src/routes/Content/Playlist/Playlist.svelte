<script>
	import Spotify from '$lib/Spotify/api';
	import User from '@/stores/user';

	export let playlist;

	let currentAlreadyInPlaylist = false;

	function addToPlaylist() {
		Spotify.addTrackToPlaylist(playlist.id, $User.current.id);
	}

	function isCurrentAlreadyInPlaylist() {
		currentAlreadyInPlaylist =
			playlist.tracks.filter(
				(x) =>
					x.name === $User.current.name && x.song === $User.current.song
			).length > 0
				? true
				: false;
	}

	$: $User.current.id, isCurrentAlreadyInPlaylist();
</script>

<div class="bg-slate-700 flex flex-col text-center mb-6 mx-5 max-w-min">
	<img
		style="max-width: 200px;"
		src={playlist.image.url}
		alt={`Playlist: ${playlist.name} Cover Image`}
	/>
	<div class="flex flex-col flex-grow justify-between pb-2">
		<p>{playlist.name}</p>
		<p>Tracks: {playlist.tracks.length}</p>
		{#if playlist.notated && playlist.matchPercent > 0}
			<p class="text-emerald-500">Genre Notation Match</p>
		{/if}
		<!-- TODO: Implement a list of matching genres when clicking on the match
			percentage -->
		<p>Match: {Math.floor(playlist.matchPercent | 0)}%</p>

		{#if !currentAlreadyInPlaylist}
			<button on:click={addToPlaylist} class="self-center w-fit">
				Add to Playlist
			</button>
		{:else}
			<p class="text-rose-800">Already in Playlist</p>
		{/if}
	</div>
</div>
