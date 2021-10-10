<script lang="ts">
	export let title = 'Ally';
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>
<header>
	<h1 role="banner">{title}</h1>
</header>

<style>
	header {
		background-color: #eeeeee;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 0.75rem;
	}

	h1 {
		font-size: 1.5em;
	}
</style>
