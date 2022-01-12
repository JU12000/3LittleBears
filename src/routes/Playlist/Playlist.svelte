<script>
	export let playlist;
</script>

<div class="bg-slate-700 flex flex-col text-center mb-6 mx-5 max-w-min">
	<img
		style="max-width: 200px;"
		src={playlist.image.url}
		alt={`Playlist: ${playlist.name} Cover Image`}
	/>
	<div class="flex flex-col flex-grow justify-between pb-2">
		<p>{playlist.name}</p>
		<p>Tracks: {playlist.tracks}</p>
		{#if playlist.notated}
			<p class="text-emerald-500">Genre Notation Match</p>
		{/if}
		<p>Match: {Math.floor(playlist.matchPercent | 0)}%</p>
		<button class="self-center w-fit">Add to Playlist</button>
	</div>
</div>
