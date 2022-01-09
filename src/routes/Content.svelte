<script>
	import { accessToken, current } from '@/stores';
	import Spotify from '$lib/spotify';

	function refresh() {
		Spotify.getCurrentTrack();
	}

	// $: if ($accessToken) {
	// 	Spotify.getCurrentTrack();
	// }
</script>

<div class="bg-slate-700 flex flex-col">
	<!--TODO: Wrap this in an if on $current-->
	<div class="bg-slate-400 flex flex-col items-center py-5">
		<h2 class="font-semibold text-xl mb-5">Currently Playing:</h2>
		<!--TODO: $current.artist-->
		<p class="text-lg">Weezer</p>
		<!--TODO: $current.song-->
		<p>Island in the Sun</p>
		<!--TODO: for each grid on $current.genres-->
	</div>

	<div class="self-center py-5">
		<button on:click={refresh}> Refresh Currently Playing </button>
	</div>
</div>
