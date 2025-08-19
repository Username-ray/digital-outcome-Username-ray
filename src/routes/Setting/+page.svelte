<script>
  import { auth, changeEmail, changePassword, logout, updateDisplayName } from "$lib/db.js"
  import { goto } from "$app/navigation"
  import { onMount } from "svelte"

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
</script>

<main>
  <h1>Settings</h1>

  <p><b>Current User:</b> {auth.currentUser?.email}</p>

  <div>
    <h3>Change User Name</h3>
    <input type="text" bind:value={newDisplayName} placeholder="User Name" />
    <button on:click={handleDisplayNameChange}>Update Name</button>
  </div>

  <div>
    <h3>Change Email</h3>
    <input type="email" bind:value={newEmail} placeholder="New Email" />
    <button on:click={handleEmailChange}>Update Email</button>
  </div>

  <div>
    <h3>Change Password</h3>
    <input type="password" bind:value={newPassword} placeholder="New Password" />
    <button on:click={handlePasswordChange}>Update Password</button>
  </div>

  <p style="color:green">{message}</p>

  <button on:click={handleLogout}>Log out</button>
</main>
