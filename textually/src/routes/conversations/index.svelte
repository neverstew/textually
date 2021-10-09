<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';
  import supabase from '$lib/supabase';

	export const load: Load = async ({ session }) => {
		if (!session.refreshToken) {
			return {
				status: 302,
				redirect: '/?redirectTo=/conversations'
			};
		}

    supabase.auth.setSession(session.refreshToken)

    try {
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('id, name')

      if (error) console.error(error)

      return {
        props: {
          conversations,
        }
      }
    } catch (e) {
      console.error(e)
    }
	};
</script>

<script lang="ts">
	import Header from '$lib/Header.svelte';

  export let conversations = [];
</script>

<Header title="Conversations" />
<main>
  <ol>
    {#each conversations as conversation}
      <li>
        {conversation.name}
      </li>
    {/each}
  </ol>
</main>

<style>
	main {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
		flex-grow: 1;
		display: flex;
    flex-direction: column;
	}
</style>

