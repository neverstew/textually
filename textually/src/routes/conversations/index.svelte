<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import supabase from '$lib/supabase';
	import conversationName from '$lib/conversationName';

	export const load: Load = async ({ session }) => {
		if (!session.accessToken) {
			return {
				status: 302,
				redirect: '/?redirectTo=/conversations'
			};
		}

		supabase.auth.setAuth(session.accessToken);

		try {
			let { data: conversations, error } = await supabase
				.from<definitions['conversations']>('conversations')
				.select('id, user_a(id, name), user_b(id, name), last_updated_at')
				.order('last_updated_at', { ascending: false });

			if (error) console.error(error);

			conversations = conversations.map((c) => {
				return {
					...c,
					name: conversationName(c, session.user.id)
				};
			});

			return {
				props: {
					conversations
				}
			};
		} catch (e) {
			console.error(e);
		}
	};
</script>

<script lang="ts">
	import Header from '$lib/Header.svelte';
	import { onMount } from 'svelte';
	import type { definitions } from 'src/types/database';

	export let conversations: (definitions['conversations'] & { name?: string })[] = [];

	onMount(() => {
		const subscription = supabase
			.from<definitions['conversations']>('conversations')
			.on('INSERT', ({ new: newConversation }) => {
				const enrichedConversation = {
					...newConversation,
					name: conversationName(newConversation, supabase.auth.user().id)
				};
				conversations.unshift(enrichedConversation);
			})
			.subscribe();

		return () => subscription.unsubscribe();
	});

	function formatTimestamp(time: string) {
		const parsed = new Date(time);
		return `${parsed.toLocaleDateString()} @ ${parsed.toLocaleTimeString()}`;
	}
</script>

<Header title="Conversations" />
<main>
	<ol>
    {@debug conversations}
		{#each conversations as conversation}
			<li class="chat-item">
				<div>
					<h2>{conversation.name}</h2>
					{#if conversation.last_updated_at}
						<h3 aria-label={`Last message at ${formatTimestamp(conversation.last_updated_at)}`}>
							{formatTimestamp(conversation.last_updated_at)}
						</h3>
					{:else}
						<h3>New!</h3>
					{/if}
				</div>
				<div>
					<a
						href={`/conversations/${conversation.id}`}
						aria-label={`View conversation with ${conversation.name}`}>View</a
					>
				</div>
			</li>
		{/each}
	</ol>
	<a class="button" href="/conversations/new">New Conversation</a>
</main>

<style>
	main {
		min-width: 320px;
		max-width: 900px;
		margin: 0 auto 0.5rem;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		overflow-y: hidden;
		justify-content: space-between;
	}

	ol {
		overflow-y: auto;
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

	.chat-item h2,
	.chat-item a {
		font-size: 1.5em;
	}

	.chat-item h2 {
		margin-right: 0.5rem;
	}

	.chat-item h3 {
		margin-top: 0.135rem;
		color: #444;
		font-size: 0.875em;
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

	.button {
		font-size: 1.5em;
		padding: 1.5rem;
		margin: 0 0.125rem;
		border-radius: 0.5rem;
		border: 1px solid #c4c4c4;
		text-decoration: none;
		color: black;
		text-align: center;
		background-color: #c4c4c4;
	}
</style>
