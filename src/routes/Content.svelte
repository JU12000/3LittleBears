<script>
	import { accessToken, current } from '../stores';
	import spotify from '$lib/spotify';

	function refresh() {
		spotify.getCurrentTrack();
	}

	$: if ($accessToken) {
		spotify.getCurrentTrack();
	}
</script>

<h1>Artist: {$current.artist}</h1>
<h2>Song: {$current.song}</h2>
<h5>Genres:</h5>
<ul>
	{#each $current.genres as genre}
		<li>
			{genre}
		</li>
	{/each}
</ul>

<button on:click={refresh}>Refresh</button>
