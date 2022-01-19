<script>
	import Playlist from '@/routes/Content/Playlist/Playlist.svelte';
	import Recommendations from '$lib/recommendations';
	import Spotify from '$lib/Spotify/api';
	import User from '@/stores/user';
	import { onMount } from 'svelte';

	let loading = false;

	onMount(async () => {
		loading = true;
		await Spotify.getUserPlaylists();
		loading = false;
	});

	async function refreshPlaylists() {
		await Spotify.getUserPlaylists();
		Recommendations.sortPlaylists();
	}

	$: $User.current.id, Recommendations.sortPlaylists();
</script>

<div
	class="bg-slate-500 flex flex-col flex-grow items-center py-5 text-center"
>
	<h3 class="font-semibold mb-1 text-xl">Your Playlists:</h3>
	<p class="mb-5 text-xs">
		Playlists are sorted from left to right by which one best matches the
		currently playing song.
	</p>

	<div class="flex flex-row flex-grow justify-center">
		{#if !loading}
			{#if $User.playlists.length > 0}
				<div class="flex flex-wrap justify-evenly">
					{#each $User.playlists as playlist}
						<Playlist {playlist} />
					{/each}
				</div>
			{:else}
				<p class="flex items-center md:w-1/2 text-lg">
					Hmm, you don't have any playlists. Keep in mind we can't track
					playlists that you are only a collaborator in.
				</p>
			{/if}
		{:else}
			<p class="flex flex-col justify-center md:w-1/2 text-lg">
				Loading. This could take a while if you have a lot of playlists.
				Consider using annotations to speed up loading. You can learn about
				annotations by following the link below.
				<a
					href="https://github.com/JU12000/3LittleBears#readme"
					class="text-blue-300"
					rel="noopener norefferer"
					target="_blank"
				>
					README
				</a>
			</p>
		{/if}
	</div>
</div>

<div class="py-5 self-center">
	<button on:click={refreshPlaylists}> Refresh Playlists </button>
</div>
