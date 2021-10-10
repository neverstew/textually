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
      let { data: conversations, error } = await supabase
        .from('conversations')
        .select('id, user_a(id, name), user_b(id, name)')

      if (error) console.error(error)

      conversations = conversations.map(c => {
        const userAId = c.user_a.id
        const name = (userAId === session.user.id) ? c.user_b.name : c.user_a.name

        return {
          ...c,
          name,
        }
      })

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
      <li class="chat-item">
        <div>
          <h2>{conversation.name}</h2>
        </div>
        <div>
          <a href={`/conversations/${conversation.id}`}>View</a>
        </div>
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

  .chat-item {
    border: 1px solid transparent;
    padding: 1rem 0.5rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .chat-item h2, .chat-item a {
    font-size: 1.5em;
  }

  .chat-item a {
    background-color: #c4c4c4;
    padding: 0.25rem 0.75rem;
    border-radius: 0.5rem;
    color: black;
    text-decoration: none;
  }

  .chat-item:hover {
    border: 1px solid black;
  }
</style>

