<script>
	import '@/app.css';
	import Footer from './Footer.svelte';
	import Header from './Header.svelte';
	import Toast from './Toast.svelte';
</script>

<Header />

<slot />

<Footer />

<Toast />
