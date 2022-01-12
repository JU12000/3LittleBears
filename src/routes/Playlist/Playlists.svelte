<script>
	import { current } from '@/stores/user';
	import { playlists } from '@/stores/user';
	import Playlist from './Playlist.svelte';

	function sortPlaylists() {
		$playlists.sort((playlist1, playlist2) => {
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
		});
	}

	$: console.log($current), sortPlaylists();
</script>

<button on:click={sortPlaylists}>sort</button>

<div class="bg-slate-500 flex flex-col flex-grow items-center py-5 text-center">
	<h3 class="font-semibold mb-1 text-xl">Your Playlists:</h3>
	<p class="mb-5 text-xs">
		Playlists are sorted from left to right by which one best matches the currently playing song.
	</p>

	<div class="flex flex-row flex-grow">
		{#if $playlists.length > 0}
			<div class="flex flex-wrap justify-evenly">
				{#each $playlists as playlist}
					<Playlist {playlist} />
				{/each}
			</div>
		{:else}
			<p class="items-center flex text-sm">
				Hmm, you don't have any playlists. Keep in mind we can't track playlists that you are only a
				collaborator in.
			</p>
		{/if}
	</div>
</div>
