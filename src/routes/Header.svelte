<script>
	import { accessToken } from '@/stores/auth';
	import { browser } from '$app/env';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Account from '$lib/Spotify/accounts';

	onMount(() => {
		Account.healthCheck();
	});

	async function connect() {
		window.location = await Account.getAuthorizationURL();
	}

	function logout() {
		Account.logout();
	}

	$: if (browser && $page.url.searchParams.get('code')) {
		Account.getAccessToken($page.url.searchParams.get('code'));
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
