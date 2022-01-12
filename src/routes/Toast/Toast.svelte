<script>
	import { fade, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import toast from '@/stores/toast';
	import ToastItem from './ToastItem.svelte';
</script>

<ul class="-translate-x-1/2 bottom-32 fixed left-1/2">
	{#each $toast.items as item (item.id)}
		<li in:fly={{ y: 256 }} out:fade animate:flip={{ duration: 200 }}>
			<ToastItem {item} />
		</li>
	{/each}
</ul>
