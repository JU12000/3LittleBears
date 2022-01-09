<script>
	import { fade, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { toast } from '@/stores/';
	import ToastItem from './ToastItem.svelte';

	$: items = $toast;
</script>

<ul class="-translate-x-1/2 bottom-32 fixed left-1/2">
	{#each items as item (item.id)}
		<li in:fly={{ y: 256 }} out:fade animate:flip={{ duration: 200 }}>
			<ToastItem {item} />
		</li>
	{/each}
</ul>
