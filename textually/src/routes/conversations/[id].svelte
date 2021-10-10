<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';
  import supabase from '$lib/supabase';
  import conversationName from '$lib/conversationName';

	export const load: Load = async ({ session, page: { path, params } }) => {
		if (!session.refreshToken) {
			return {
				status: 302,
				redirect: `/?redirectTo=${path}`
			};
		}

    supabase.auth.setSession(session.refreshToken)

    try {
      let { data: conversation, error: errorConversation } = await supabase
        .from('conversations')
        .select('user_a(id, name), user_b(id, name)')
        .eq('id', params.id)
        .maybeSingle()

      if (errorConversation) console.error(errorConversation)

      const resp = await supabase
        .from('messages')
        .select('id, content')
        .eq('conversation_id', params.id)
        .order('created_at', { ascending: false })
      console.dir(resp)
      let { data: messages, error } = resp

      if (error) console.error(error)

      return {
        props: {
          messages,
          name: conversationName(conversation, session.user.id),
        }
      }
    } catch (e) {
      console.error(e)
    }
	};
</script>

<script lang="ts">
	import Header from '$lib/Header.svelte';

  export let name = 'Conversation';
  export let messages = [];
</script>

<Header title={name} />
<main>
  <ol>
    {#each messages as message}
      <li class="chat-item">
        <p>{message.content}</p>
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

  .chat-item:nth-child(even) {
    background-color: #eeeeee;
  }

  .chat-item:hover {
    border: 1px solid black;
  }
</style>

