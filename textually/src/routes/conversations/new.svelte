<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import supabase from '$lib/supabase';

	export const load: Load = async ({ session, page: { path } }) => {
		if (!session.refreshToken) {
			return {
				status: 302,
				redirect: `/?redirectTo=${path}`
			};
		}

		supabase.auth.setSession(session.refreshToken);
		const { data: user } = await supabase
			.from('users')
			.select('nickname')
			.eq('id', supabase.auth.user().id)
			.single();

		return {
			props: {
				user
			}
		};
	};
</script>

<script lang="ts">
	import Header from '$lib/Header.svelte';
	import type { definitions } from 'src/types/database';
	import type { PostgrestError } from '@supabase/postgrest-js';
	import { goto } from '$app/navigation';

	export let user: Pick<definitions['users'], 'nickname'>;
	let name = '';
	let error: PostgrestError;

	async function handleSubmit() {
		const { data: user, error: userError } = await supabase
			.from('users')
			.select('id')
			.eq('nickname', name)
			.single();

		if (userError) {
			error = userError;
			return;
		}
		let { data: conversation, error: conversationError } = await supabase
			.from<definitions['conversations']>('conversations')
			.insert([
				{
					user_a: supabase.auth.user().id,
					user_b: user.id
				}
			])
			.single();
		const isDuplicate = conversationError?.code === '23505';
		if (isDuplicate) {
			let existingConversation = await supabase
				.from('conversations')
				.select('id')
				.eq('user_b', supabase.auth.user().id)
				.eq('user_a', user.id)
				.single();
			if (!existingConversation.data) {
				existingConversation = await supabase
					.from('conversations')
					.select('id')
					.eq('user_a', supabase.auth.user().id)
					.eq('user_b', user.id)
					.single();
			}
			conversation = existingConversation.data;
			conversationError = existingConversation.error;
		}
		if (conversationError) {
			error = conversationError;
			return;
		}

		goto(`/conversations/${conversation.id}`);
	}
</script>

<Header title="Find Person" />
<main role="main">
	<div id="instructions">
		<p>When someone wants to talk to you, they can find you by your nickname.</p>
		<p>When you want to talk to someone else, you can ask them for their nickname.</p>
		<label class="nickname" for="nickname" aria-label={`Your nickname is ${user.nickname}`}>
			Your Nickname
			<p id="nickname">
				{user.nickname}
			</p>
		</label>
	</div>
	<form action="#" on:submit|preventDefault={handleSubmit}>
		{#if error}
			<p id="error" role="alert">Error: Could not find that person. Try again.</p>
		{/if}
		<div>
			<label for="name">
				<span>Their nickname</span>
				<input type="text" id="name" name="name" aria-describedby="instructions" bind:value={name} required aria-errormessage="error"/>
			</label>
		</div>
		<button>Start Conversation</button>
	</form>
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

	#instructions {
		padding: 0.5rem;
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}

	#instructions p {
		margin-bottom: 0.5rem;
		line-height: 1.2;
		font-size: 1.125em;
	}

	#instructions .nickname {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	#instructions #nickname {
		font-family: serif;
		font-size: 1.5em;
		text-align: center;
		margin: 0.5rem 0 1rem;
	}

	form {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 0.25rem;
	}

	form label {
		width: 100%;
		display: flex;
		flex-direction: column;
		margin-bottom: 0.25rem;
	}

	input {
		padding: 0.75rem 1rem;
		font-size: 1.5em;
	}

	button {
		font-size: 1.5em;
		padding: 0.725rem;
	}

	#error {
		color: red;
	}
</style>
