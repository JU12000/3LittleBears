<script>
	import { auth } from '@/stores/';
	import { onMount } from 'svelte';
	import Spotify from '$lib/spotify';

	onMount(() => {
		//spotify.healthCheck();
	});

	async function connect() {
		window.location = await Spotify.getAuthorization();
	}

	function logout() {
		Spotify.logout();
	}
</script>

<header class="bg-slate-700 flex h-16 items-center">
	<!--TODO: Icon here-->
	<p class="pl-3">(^^)</p>
	<h1 class="font-bold pl-1 text-2xl">3LittleBears</h1>

	<span class="flex-grow" />

	<div class="pr-6">
		{#if !auth.$accessToken}
			<button on:click={connect}>Connect With Spotify</button>
		{:else}
			<button on:click={logout}> Log Out </button>
		{/if}
	</div>
</header>
