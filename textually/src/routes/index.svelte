<script lang="ts">
  import generateUserId from '$lib/generateUserKey';
  import Header from '$lib/Header.svelte'
  import { onMount } from 'svelte';
  import fetch from 'cross-fetch';
  import { goto } from '$app/navigation';
  import { session } from '$app/stores';
  import supabase from '$lib/supabase';

  $:loading = true
  $:errorName = null
  $:errorMessage = null

  onMount(async () => {
    let userKey: string = window.localStorage.getItem('user') || generateUserId()
    window.localStorage.setItem('user', userKey)

    try {
      loading = true
      errorName = null
      errorMessage = null
      const loginResponse = await fetch(`/login/${userKey}`)
      const loginResponseBody = await loginResponse.json()
      if (!loginResponse.ok) {
        const { name, message } = loginResponseBody
        errorName = name
        errorMessage = message
      }
      const { user, refreshToken } = loginResponseBody
      $session.user = user
      $session.refreshToken = refreshToken

      supabase.auth.setSession(refreshToken)
      const { count } = await supabase
        .from('users')
        .select('name', { count: 'exact', head: true })
        .neq('name', null)

      const params = new URLSearchParams(window.location.search)
      const redirectToDefault = count > 0 ? '/conversations' : '/name'
      const redirectTo = params.get('redirectTo') || redirectToDefault
      await goto(redirectTo)
    } catch(e) {
      console.error(e)
    } finally {
      loading = false
    }
  })
</script>

<Header title="Ally" />
<main>
  {#if loading}
    <p class="loading-message">Loading your profile...</p>
  {:else if errorName}
    <p class="loading-message">{errorName}</p>
    <pre class="loading-message">{errorMessage}</pre>
  {/if}
</main>

<style>
    main {
        flex-grow: 1;
        display: flex;
        justify-content: center;
    }

    .loading-message {
        margin-top: 10rem;
        font-size: 1.5em;
        max-width: 100%;
    }
</style>