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
        .select('id, user_a(id, name), user_b(id, name)')
        .eq('id', params.id)
        .maybeSingle()

      if (errorConversation) console.error(errorConversation)

      const resp = await supabase
        .from('messages')
        .select('id, content')
        .eq('conversation_id', params.id)
        .order('created_at', { ascending: true })
      console.dir(resp)
      let { data: messages, error } = resp

      if (error) console.error(error)

      return {
        props: {
          messages,
          conversation: {
            ...conversation,
            name: conversationName(conversation, session.user.id),
          },
        }
      }
    } catch (e) {
      console.error(e)
    }
	};
</script>

<script lang="ts">
	import Header from '$lib/Header.svelte';
  import { onMount } from 'svelte';

  export let conversation = {
    id: 0,
    name: 'Conversation',
  };
  export let messages = [];
  $:newMessage = '';

  onMount(() => {
    const subscription = supabase
      .from('messages')
      .on('INSERT', ({ new: newMessage }) => {
        messages = [
          ...messages,
          newMessage,
        ]
      })
      .subscribe()

      return subscription.unsubscribe
  })

  async function handleNewMessage() {
    const { error } = await supabase
      .from('messages')
      .insert([{
        content: newMessage,
        conversation_id: conversation.id,
        user_id: supabase.auth.user().id,
      }])
    
    if (error) {
      console.error(error)
      return
    }

    newMessage = ''
  }
</script>

<Header title={conversation.name} />
<main>
  <ol>
    {#each messages as message}
      <li class="chat-item">
        <p>{message.content}</p>
      </li>
    {/each}
  </ol>
  <form action="#" on:submit|preventDefault={handleNewMessage}>
		<div>
			<label for="newMessage">
				<span>New message</span>
				<textarea
          id="newMessage"
          name="newMessage"
          rows="3"
          bind:value={newMessage}
        />
			</label>
		</div>
    <div class="actions">
      <a class="button" href="/conversations">Exit</a>
      <button>Submit</button>
    </div>
	</form>
</main>

<style>
	main {
    min-width: 320px;
    max-width: 900px;
    margin: 0 auto;
		flex-grow: 1;
		display: flex;
    flex-direction: column;
    justify-content: space-between;
	}

  .chat-item {
    border: 1px solid transparent;
    padding: 0.125rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .chat-item:hover {
    border: 1px solid black;
  }

  form {
		display: flex;
		flex-direction: column;
    padding: 0.5rem;
	}

	form > * {
		margin: 0.125rem 0;
	}

	label {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	span {
		font-size: 0.875em;
    margin-bottom: 0.25rem;
	}

	textarea {
		padding: 0.75rem 1rem;
		font-size: 1.5em;
	}

  .actions {
    display: flex;
    flex-direction: row;
  }

	button, .button {
		font-size: 1.5em;
		padding: 0.725rem;
    margin: 0 0.125rem;
    flex-grow: 1;
    border-radius: 0.5rem;
    border: none;
	}

  .button {
    border: 1px solid #c4c4c4;
    text-decoration: none;
    color: black;
    text-align: center;
  }
</style>

