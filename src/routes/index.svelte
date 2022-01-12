<script>
	import { accessToken } from '@/stores/auth';
	import { page } from '$app/stores';
	import Content from './Content.svelte';
	import SalesPitch from './SalesPitch.svelte';
	import Spotify from '$lib/Spotify/api';

	$: Spotify.getAccessToken($page.url.searchParams.get('code'));

	$: if ($accessToken) {
		history.replaceState(null, '', $page.url.pathname);
	}
</script>

<div class="flex flex-grow">
	{#if $accessToken}
		<Content />
	{:else}
		<SalesPitch />
	{/if}
</div>
