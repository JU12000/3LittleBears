<script>
	import { fade, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { toast } from '../stores';
	import ToastItem from './ToastItem.svelte';

	$: items = $toast;
</script>

<ul class="toast-container">
	{#each items as item (item.id)}
		<li in:fly={{ y: -256 }} out:fade animate:flip={{ duration: 200 }}>
			<ToastItem {item} />
		</li>
	{/each}
</ul>

<style>
	.toast-container {
		left: 50%;
		position: fixed;
		top: 5%;
		transform: translate(-50%, 0);
	}
</style>
