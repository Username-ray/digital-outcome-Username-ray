<script>
  import Header from "$lib/Header.svelte"
  import Footer from "$lib/Footer.svelte"
  import Nav from "$lib/Nav.svelte"
  import { auth, changeEmail, changePassword, logout, updateDisplayName } from "$lib/db.js"
  import { goto } from "$app/navigation"
  import { onMount } from "svelte"
  import { lang } from "$lib/stores/lang.js"
  import i18n from "$lib/i18n.json"

  let newEmail = ""
  let newPassword = ""
  let newDisplayName = ""
  let message = ""

  onMount(() => {
    if (auth.currentUser) {
      newDisplayName = auth.currentUser.displayName || auth.currentUser.email
    }
  })

  async function handleEmailChange() {
    try {
      await changeEmail(newEmail)
      message = "Email updated!"
    } catch (e) {
      message = e.message
    }
  }

  async function handlePasswordChange() {
    try {
      await changePassword(newPassword)
      message = "Password updated!"
    } catch (e) {
      message = e.message
    }
  }

  async function handleDisplayNameChange() {
    try {
      await updateDisplayName(newDisplayName)
      message = "User name updated!"
    } catch (e) {
      message = e.message
    }
  }

  async function handleLogout() {
    await logout()
    goto("/login")
  }

  function handleLanguageChange(e) {
    lang.set(e.target.value)
  }
</script>

<Header />

<Nav />

<main>
  <h1>{i18n[$lang].settings.title}</h1>

  <p class="user">{i18n[$lang].settings.current_user}:</p>
  <p>{auth.currentUser?.email}</p>

  <div>
    <h2>{i18n[$lang].settings.change_user_name}:</h2>
    <input type="text" bind:value={newDisplayName} placeholder={i18n[$lang].settings.user_name} /><button class="update" on:click={handleDisplayNameChange}>{i18n[$lang].settings.update}</button>
  </div>

  <div>
    <h2>{i18n[$lang].settings.change_email}:</h2>
    <input type="email" bind:value={newEmail} placeholder={i18n[$lang].settings.new_email} /><button class="update" on:click={handleEmailChange}>{i18n[$lang].settings.update}</button>
  </div>

  <div>
    <h2>{i18n[$lang].settings.change_password}:</h2>
    <input type="password" bind:value={newPassword} placeholder={i18n[$lang].settings.new_password} /><button class="update" on:click={handlePasswordChange}>{i18n[$lang].settings.update}</button>
  </div>

  <div class="language">
    <label for="lang-select">{i18n[$lang]?.settings?.language}:</label>
    <select id="lang-select" on:change={handleLanguageChange} bind:value={$lang}>
      <option value="en">English</option>
      <option value="ja">日本語</option>
      <option value="mi">Te Reo Maori</option>
    </select>
  </div>

  <p style="color:green">{message}</p>

  <div class="logout"><button class="logoutbutton" on:click={handleLogout}>{i18n[$lang].settings.logout}</button></div>
</main>

<Footer />

<style>
  main {
    display: grid;
    justify-content: center;
    margin: 30px;
  }

  h1 {
    font-family: "Fredoka", cursive;
    font-weight: bold;
    font-size: 58px;
    text-align: center;
    color: #a70000;
    margin: 30px;
  }

  h2 {
    margin: 10px 0px;
    font-weight: bold;
  }

  .user {
    font-weight: bold;
  }

  .update {
    margin-left: 10px;
    background-color: #a70000;
    padding: 0.4rem 1.2rem;
    border-radius: 10px;
    color: #ffffff;
  }

  .language,
  .logout {
    margin-top: 10px;
  }

  .logoutbutton {
    background-color: #a70000;
    padding: 0.5rem 1.2rem;
    font-family: "Fredoka", cursive;
    margin: 20px 0px;
    border-radius: 10px;
    font-weight: bold;
    font-size: 20px;
    color: #ffffff;
  }

  input {
    padding: 0.6rem 1.2rem;
    border-radius: 10px;
    border: 1px solid #ffffff;
  }
</style>
