<script>
  import { onMount } from "svelte"
  import { auth, loginWithGoogle, logout } from "$lib/auth"
  import { goto } from "$app/navigation"

  let user = null

  onMount(() => {
    auth.onAuthStateChanged((u) => {
      user = u
      if (user) {
        goto("/Dashboard")
      }
    })
  })

  function handleLogin() {
    loginWithGoogle()
  }

  function handleLogout() {
    logout()
  }
</script>

<main>
  {#if user}
    <p>Welcome {user.email}</p>
    <button on:click={handleLogout}>Logout</button>
  {:else}
    <h1>Sign in</h1>
    <button on:click={handleLogin}>Sign in with Google</button>
  {/if}
</main>
