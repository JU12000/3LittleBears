<script>
	import { accessToken } from '@/stores/auth';
	import CurrentlyPlaying from '@/routes/Content/CurrentlyPlaying.svelte';
	import Playlists from '@/routes/Content/Playlist/Playlists.svelte';
	import Spotify from '$lib/Spotify/api';
	import User from '@/stores/user';

	$: if ($accessToken) {
		Spotify.getCurrentUser();
	}
</script>

{#if $User.displayName !== ''}
	<div class="bg-slate-700 flex flex-col flex-grow">
		<div class="py-5 self-center">
			<p class="text-center">
				Welcome, {$User.displayName}. It's good to have you!
			</p>
		</div>

		<CurrentlyPlaying />

		<Playlists />
	</div>
{/if}
