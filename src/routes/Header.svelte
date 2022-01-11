<script>
	import { accessToken } from '@/stores/auth';
	import { onMount } from 'svelte';
	import Spotify from '$lib/spotify';

	onMount(() => {
		Spotify.healthCheck();
	});

	async function connect() {
		window.location = await Spotify.getAuthorization();
	}

	function logout() {
		Spotify.logout();
	}
</script>

<header class="bg-slate-700 flex h-16 items-center">
	<!--TODO: Icon here, remove temp icon-->
	<p class="pl-3">(^^)</p>
	<h1 class="font-bold pl-1 sm:text-2xl">3LittleBears</h1>

	<span class="flex-grow" />

	<div class="pr-6">
		{#if !$accessToken}
			<button on:click={connect}>Connect With <span class="text-spotify">Spotify</span></button>
		{:else}
			<button on:click={logout}> Log Out </button>
		{/if}
	</div>
</header>
