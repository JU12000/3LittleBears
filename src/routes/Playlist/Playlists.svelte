<script>
	import Playlist from './Playlist.svelte';
	import Recommendations from '$lib/recommendations';
	import User from '@/stores/user';

	$: $User.current, Recommendations.sortPlaylists();
</script>

<div class="bg-slate-500 flex flex-col flex-grow items-center py-5 text-center">
	<h3 class="font-semibold mb-1 text-xl">Your Playlists:</h3>
	<p class="mb-5 text-xs">
		Playlists are sorted from left to right by which one best matches the currently playing song.
	</p>

	<div class="flex flex-row flex-grow">
		{#if $User.playlists.length > 0}
			<div class="flex flex-wrap justify-evenly">
				{#each $User.playlists as playlist}
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
