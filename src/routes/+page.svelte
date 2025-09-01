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

<style>
  main {
    background-color: #b0dcf5;
  }

  h1 {
    font-family: "Fredoka", cursive;
    font-size: 58px;
    color: #a70000;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    font-weight: bold;
    margin: 1.5rem 0;
  }

  button {
    background: #a70000;
    color: white;
    padding: 0.8rem 4rem;
    margin-top: 40px;
    margin-right: 300px;
    border-radius: 20px;
    font-family: "Fredoka", cursive;
    font-size: 30px;
    font-weight: bold;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    text-decoration: none;
    width: 350px;
  }

  button:hover {
    background: #a70000;
  }

  button,
  p {
    display: flex;
    flex-direction: column;
    text-align: center;
  }
  @media (max-width: 768px) {
    h1 {
      font-size: 32px;
      text-align: center;
    }

    button {
      font-size: 20px;
      padding: 0.6rem 1rem;
      border-radius: 15px;
      margin: 0 auto;
      width: 80%;
    }
  }
</style>
