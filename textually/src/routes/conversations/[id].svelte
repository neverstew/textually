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
        .select('id, content, user_id')
        .eq('conversation_id', params.id)
        .order('created_at', { ascending: true })
      console.dir(resp)
      let { data: messages, error } = resp

      if (error) console.error(error)

      return {
        props: {
          messages: chunkMessages(messages),
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
  import { afterUpdate, onMount } from 'svelte';
  import chunkMessages, { appendToChunkedMessages, ChunkedMessages } from '$lib/chunkMessages';

  export let conversation = {
    id: 0,
    name: 'Conversation',
    user_a: {
      id: 'unknown',
      name: 'You',
    }, user_b: {
      id: 'unknown',
      name: 'Them',
    }
  };
  export let messages: ChunkedMessages = { chunks: [] };
  let newMessage = '';
  let conversationList;

  onMount(() => {
    const subscription = supabase
      .from('messages')
      .on('INSERT', ({ new: newMessage }) => {
        messages = appendToChunkedMessages(messages, newMessage)
      })
      .subscribe()

      return () => subscription.unsubscribe()
  })

  afterUpdate(() => {
    conversationList.scrollTop = conversationList.scrollHeight
  })

  function isSelf(messageChunk: ChunkedMessages['chunks'][0]) {
    return supabase.auth.user().id === messageChunk[0].user_id
  }

  function chunkHeader(messageChunk: ChunkedMessages['chunks'][0]) {
    if (isSelf(messageChunk)) return 'You'

    const isUserA = conversation.user_a.id === messageChunk[0].user_id
    return  isUserA ? conversation.user_a.name : conversation.user_b.name
  }

  async function handleNewMessage() {
    if (newMessage === '') return

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

  function handleTextareaEnter(event: KeyboardEvent) {
    const wasEnterKeyPressed = event.code === 'Enter'
    const wasShiftPressed = event.shiftKey
    if (wasEnterKeyPressed && !wasShiftPressed) {
      event.preventDefault() // prevent extra new line being added
      handleNewMessage()
    }
  }
</script>

<Header title={conversation.name} />
<main>
  <ol bind:this={conversationList}>
    {#each messages.chunks as messageChunk}
    <div class="chat-chunk">
      <span class="chat-chunk-header" class:chat-chunk-header--self={isSelf(messageChunk)}>{chunkHeader(messageChunk)}</span>
      {#each messageChunk as message}
        <li class="chat-item" class:chat-item--self={isSelf(messageChunk)}>
          <p>{message.content}</p>
        </li>
      {/each}
    </div>
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
          on:keypress={handleTextareaEnter}
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
    overflow-y: hidden;
	}

  ol {
    overflow-y: auto;
  }

  .chat-chunk {
    display: flex;
    flex-direction: column;
  }

  .chat-chunk-header {
    font-size: 1.125em;
    color: #444444;
  }
  .chat-chunk-header--self {
    align-self: flex-end;
  }

  .chat-item {
    margin-bottom: 0.5rem;
    border: 1px solid transparent;
    padding: 0.125rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .chat-item--self {
    justify-content: flex-end;
  }

  .chat-item:hover {
    border: 1px solid black;
  }

  p {
    font-size: 1.5em;
    line-height: 0.75em;
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

