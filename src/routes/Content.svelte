<script>
	import { accessToken } from '@/stores/auth';
	import { current } from '@/stores/user';
	import Spotify from '$lib/spotify';

	function refresh() {
		Spotify.getCurrentTrack();
	}

	$: if ($accessToken) {
		Spotify.getCurrentTrack();
	}
</script>

<div class="bg-slate-700 flex flex-col flex-grow">
	<!--TODO: Wrap this in an if on $current-->
	<div class="bg-slate-500 flex flex-col items-center py-5 text-center">
		<h2 class="font-semibold text-xl mb-5">Currently Playing:</h2>

		{#if $current.artist}
			<p class="text-lg">{$current.artist}</p>
			<p>{$current.song}</p>
			<!--TODO: for each grid over $user.current.genres-->
			<div class="flex flex-row flex-wrap justify-around pt-4">
				{#if $current.genres.length > 0}
					{#each $current.genres as genre, index}
						<a
							href="https://everynoise.com/research.cgi?mode=genre&name={genre.replace(' ', '+')}"
							class="px-2 text-sm {index % 2 == 0 ? 'text-slate-900' : ''}"
							rel="noopener norefferer"
							target="_blank"
						>
							{'{ ' + genre + ' }'}
						</a>
					{/each}
				{:else}
					<p class="text-sm">
						Looks like <span class="text-spotify">Spotify</span> hasn't classified this song, so we don't
						know what genre it is. Sorry!
					</p>
				{/if}
			</div>
		{:else}
			<p class="text-lg">Nothing :(</p>
			<p class="text-sm">
				Play some music on <splan class="text-spotify-dark">Spotify</splan>, or try hitting the
				refresh button below!
			</p>
		{/if}
	</div>

	<div class="self-center py-5">
		<button on:click={refresh}> Refresh Currently Playing </button>
	</div>
</div>
