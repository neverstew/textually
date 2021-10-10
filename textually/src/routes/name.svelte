<script lang="ts">
	import { goto } from '$app/navigation';

	import Header from '$lib/Header.svelte';
	import supabase from '$lib/supabase';

	let name = '';

	const handleSubmit = async () => {
		const { error } = await supabase.from('users').update({ name });

		if (error) {
			console.error(error);
			return;
		}

		goto('/conversations');
	};
</script>

<Header title="Ally" />
<main>
	<form action="#" on:submit|preventDefault={handleSubmit}>
		<div>
			<label for="name">
				<span>Your name</span>
				<input type="text" id="name" name="name" autocomplete="name" bind:value={name} />
			</label>
		</div>
		<button>Submit</button>
	</form>
</main>

<style>
	main {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
	}

	form {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		justify-content: space-between;
	}

	form > * {
		margin: 1rem 0;
	}

	label {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	span {
		font-size: 1.5em;
	}

	input {
		margin: 0.5rem 0.5rem 0;
		padding: 0.75rem 1rem;
		font-size: 1.5em;
	}

	button {
		font-size: 1.5em;
		padding: 0.725rem;
	}
</style>
