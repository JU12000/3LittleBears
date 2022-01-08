<script>
	import { tweened } from 'svelte/motion';
	import { linear } from 'svelte/easing';
	import { toast } from '../stores';

	export var item;

	const progress = tweened(1, { duration: 5000, easing: linear });

	function close() {
		if ($progress === 0) {
			toast.update((x) => x.filter((y) => y.id !== item.id));
		}
	}

	var paused = false;

	$: progress.set(0).then(close);

	function pause() {
		if (!paused) {
			progress.set($progress, { duration: 0 });
			paused = true;
		}
	}

	function resume() {
		if (paused) {
			progress.set(0, { duration: 5000 * $progress }).then(close);
			paused = false;
		}
	}
</script>

<div class="toast-item" on:mouseenter={pause} on:mouseleave={resume}>
	{item.message}
	<progress class="toast-progress" value={$progress} />
</div>

<style>
	.toast-item {
		background: red;
		border-radius: 0.125rem;
		display: flex;
		flex-direction: column;
		margin: 0 0 0.5rem 0;
		overflow: hidden;
	}

	.toast-progress {
		display: block;
		background: transparent;
	}
</style>
