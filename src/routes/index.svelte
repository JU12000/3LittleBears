<script>
	import { accessToken, toast, toastCount } from '../stores';
	import { page } from '$app/stores';
	import Content from './Content.svelte';
	import spotify from '$lib/spotify';
	import Toast from './Toast.svelte';

	function AddToast() {
		toast.update((x) => [{ message: 'toast', id: $toastCount }, ...x]);
	}

	async function Auth() {
		const authURL = await spotify.getAuthorization();
		window.location = authURL;
	}

	$: spotify.getAccessToken($page.url.searchParams.get('code'));

	$: if ($accessToken) {
		history.replaceState(null, '', $page.url.pathname);
	}
</script>

{#if !$accessToken}
	<button on:click={Auth}> Not Authenticated </button>
{:else}
	<Content />
{/if}

<button on:click={AddToast}>Add Toast</button>

<Toast />
