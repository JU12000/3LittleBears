<script>
	import '@/app.css';
	import Footer from './Footer.svelte';
	import Header from './Header.svelte';
	import Toast from './Toast/Toast.svelte';
</script>

<div class="flex flex-col min-h-screen">
	<Header />

	<slot />

	<Footer />
</div>

<Toast />
