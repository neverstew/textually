<script lang="ts">
    export let title = 'Ally'
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>
<header>
    <h1>{title}</h1>
</header>

<style>
    header {
        background-color: #EEEEEE;
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