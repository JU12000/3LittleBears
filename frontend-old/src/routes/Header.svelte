<script>
	import { accessToken } from '@/stores/auth';
	import { browser } from '$app/env';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Account from '$lib/Spotify/accounts';

	onMount(() => {
		// Check if the user still has an Authorization from Spotify, and get a new
		// accessToken. This handles cases where users are returning to the site
		// after closing it in the same browser session.
		Account.healthCheck();
	});

	async function connect() {
		window.location = await Account.getAuthorizationURL();
	}

	function logout() {
		Account.logout();
	}

	// This should only run after the Auth redirect, gets the access token the
	// first time.
	$: if (browser && $page.url.searchParams.get('code')) {
		Account.getAccessToken($page.url.searchParams.get('code'));
	}
</script>

<header class="bg-slate-700 flex h-16 items-center">
	<!--TODO: Icon here, remove temp icon-->
	<img class="pl-3" src="favicon.png" alt="3 Little Bears Logo" />
	<h1 class="font-bold pl-1 sm:text-2xl">3LittleBears</h1>

	<span class="flex-grow" />

	<div class="pr-6">
		{#if !$accessToken}
			<button on:click={connect}
				>Connect With <span class="text-spotify">Spotify</span></button
			>
		{:else}
			<button on:click={logout}> Log Out </button>
		{/if}
	</div>
</header>
