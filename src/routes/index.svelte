<script>
	import { accessToken } from '@/stores/auth';
	import { page } from '$app/stores';
	import Content from '@/routes/Content/Content.svelte';
	import SalesPitch from '@/routes/SalesPitch.svelte';

	//TODO: Add translation/termkey support across the site.

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
