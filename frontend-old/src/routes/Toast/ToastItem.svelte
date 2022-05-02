<script>
	import { tweened } from 'svelte/motion';
	import { linear } from 'svelte/easing';
	import toast from '@/stores/toast';

	export let item;

	const progress = tweened(1, { duration: 500000, easing: linear });

	function close() {
		$toast.pop(item.id);
	}

	let paused = false;

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

<div
	on:mouseenter={pause}
	on:mouseleave={resume}
	class="bg-rose-800 flex justify-between m-3 rounded-md"
>
	<p class="p-2">
		{item.message}
	</p>
	<button
		on:click={close}
		class="pb-2 pr-2 pt-0.5 self-start text-xs toast-close">x</button
	>
</div>
