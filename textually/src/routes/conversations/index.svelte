<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';
	export const load: Load = async ({ session }) => {
		if (!session.user) {
			return {
				status: 302,
				redirect: '/'
			};
		}
    return {
      conversations: []
    }
	};
</script>

<script lang="ts">
	import Header from '$lib/Header.svelte';
import { session } from '$app/stores';
</script>

<Header title="Conversations" />
<main>
  <pre>
    {JSON.stringify($session.user)}
  </pre>
</main>

<style>
	main {
    max-width: 900px;
    margin: 0 auto;
		flex-grow: 1;
		display: flex;
		justify-content: center;
	}
</style>

