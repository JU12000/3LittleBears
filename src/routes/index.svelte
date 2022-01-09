<script>
	import { accessToken, toast, toastCount } from '@/stores';
	import { page } from '$app/stores';
	import Content from './Content.svelte';
	import Spotify from '$lib/spotify';

	function addToast() {
		toast.update((x) => [...x, { message: 'toast', id: $toastCount }]);
		$toastCount += 1;
	}

	$: Spotify.getAccessToken($page.url.searchParams.get('code'));

	$: if ($accessToken) {
		history.replaceState(null, '', $page.url.pathname);
	}
</script>

{#if !$accessToken}
	<Content />
{/if}

<div>
	<button on:click={addToast}>Add Toast</button>
</div>
