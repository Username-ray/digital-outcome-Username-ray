<script>
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

<main>
  <h1>{i18n[$lang].settings.title}</h1>

  <p><b>{i18n[$lang].settings.current_user}:</b> {auth.currentUser?.email}</p>

  <div>
    <h3>{i18n[$lang].settings.change_user_name}</h3>
    <input type="text" bind:value={newDisplayName} placeholder={i18n[$lang].settings.user_name} />
    <button on:click={handleDisplayNameChange}>{i18n[$lang].settings.update_name}</button>
  </div>

  <div>
    <h3>{i18n[$lang].settings.change_email}</h3>
    <input type="email" bind:value={newEmail} placeholder={i18n[$lang].settings.new_email} />
    <button on:click={handleEmailChange}>{i18n[$lang].settings.update_email}</button>
  </div>

  <div>
    <h3>{i18n[$lang].settings.change_password}</h3>
    <input type="password" bind:value={newPassword} placeholder={i18n[$lang].settings.new_password} />
    <button on:click={handlePasswordChange}>{i18n[$lang].settings.update_password}</button>
  </div>

  <div>
    <label for="lang-select">{i18n[$lang]?.settings?.language}</label>
    <select id="lang-select" on:change={handleLanguageChange} bind:value={$lang}>
      <option value="en">English</option>
      <option value="ja">日本語</option>
      <option value="mi">Te Reo Maori</option>
    </select>
  </div>

  <p style="color:green">{message}</p>

  <button on:click={handleLogout}>{i18n[$lang].settings.logout}</button>
</main>
