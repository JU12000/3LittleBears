<script>
	import Spotify from '$lib/Spotify/api';
	import User from '@/stores/user';
	import { onMount } from 'svelte';

	onMount(() => {
		Spotify.getCurrentlyPlayingTrack();
	});

	function refreshCurrentlyPlaying() {
		Spotify.getCurrentlyPlayingTrack();
	}
</script>

<div class="bg-slate-500 flex flex-col items-center py-5 text-center">
	<div class="mb-5">
		<h2 class="font-semibold text-xl">Currently Playing:</h2>
		{#if $User.current.id}
			<a
				href={$User.current.href}
				class="text-blue-300"
				rel="noopener norefferer"
				target="_blank"
			>
				Open on Spotify
			</a>
		{/if}
	</div>

	{#if $User.current.id}
		<p class="text-lg">{$User.current.artist}</p>
		<p>{$User.current.song}</p>
		<div class="flex flex-row flex-wrap justify-around pt-4">
			{#if $User.current.genres.length > 0}
				{#each $User.current.genres as genre, index}
					<a
						href="https://everynoise.com/research.cgi?mode=genre&name={genre.replace(
							' ',
							'+'
						)}"
						class="px-2 text-sm {index % 2 === 0 ? 'text-slate-900' : ''}"
						rel="noopener norefferer"
						target="_blank"
					>
						{'{ ' + genre + ' }'}
					</a>
				{/each}
			{:else}
				<p class="text-sm">
					Looks like <span class="text-spotify">Spotify</span> hasn't classified
					this song, so we don't know what genre it is. Sorry!
				</p>
			{/if}
		</div>
	{:else}
		<p class="text-lg">Nothing :(</p>
		<p class="text-sm">
			Play some music on <span class="text-spotify">Spotify</span>, or try
			hitting the refresh button below!
		</p>
	{/if}
</div>

<div class="py-5 self-center">
	<button on:click={refreshCurrentlyPlaying}>
		Refresh Currently Playing
	</button>
</div>
