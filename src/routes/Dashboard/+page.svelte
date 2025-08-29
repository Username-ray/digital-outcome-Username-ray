<script>
  import Header from "$lib/Header.svelte"
  import Footer from "$lib/Footer.svelte"
  import Nav from "$lib/Nav.svelte"
  import { onMount } from "svelte"
  import { getWeeklyTotals } from "$lib/db.js"
  import { lang } from "$lib/stores/lang.js"
  import i18n from "$lib/i18n.json"

  let weekRange = ""
  let balance = 0

  function formatDate(date) {
    return date.toLocaleDateString("en-GB") // e.g. 28/04/2025
  }

  onMount(async () => {
    const today = new Date()
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(today.getDate() - 6)
    weekRange = `${formatDate(oneWeekAgo)} - ${formatDate(today)}`

    const { incomeTotal, expenseTotal } = await getWeeklyTotals()

    balance = incomeTotal - expenseTotal
  })

  import { auth, loginWithGoogle, logout } from "$lib/auth.js"
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
    <p>{i18n[$lang].dashboard.welcome} {user.email}</p>
    <button on:click={handleLogout}>{i18n[$lang].settings.logout}</button>
  {:else}
    <p>{i18n[$lang].dashboard.sign_in}</p>
    <button on:click={handleLogin}>{i18n[$lang].dashboard.sign_in_with_google}</button>
  {/if}
</main>

<Header />

<Nav />

<main class="dashboard section">
  <h1 class="title">{i18n[$lang].dashboard.title}</h1>

  <p class="period">{weekRange}</p>

  <div class="content">
    <div class="balance-chart">
      <div class="circle">
        <span class="label">
          <p>{i18n[$lang].dashboard.balance}:</p>
          <h2>${balance}</h2>
        </span>
      </div>
    </div>

    <div class="actions">
      <a href="/IncomeHistory" class="action-btn">
        {i18n[$lang].dashboard.look_income_history}
      </a>
      <a href="/ExpenseHistory" class="action-btn">
        {i18n[$lang].dashboard.look_expense_history}
      </a>
      <a href="/AddExpense" class="action-btn">
        {i18n[$lang].dashboard.add_expense}
      </a>
      <a href="/AddIncome" class="action-btn">
        {i18n[$lang].dashboard.add_income}
      </a>
    </div>
  </div>
</main>

<button class="chatbot">Chatbot</button>

<Footer />

<style>
  .dashboard {
    background: #b0dcf5;
    min-height: 100vh;
  }

  .title {
    font-family: "Fredoka", cursive;
    font-size: 58px;
    color: #a70000;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
  }

  .period {
    font-weight: bold;
    font-size: 24px;
    margin: 1rem 0;
    font-family: "Fredoka", cursive;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .content {
    display: flex;
    align-items: center;
    gap: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 50px;
  }

  .balance-chart {
    height: 300px;
  }

  .circle {
    position: relative;
    width: 470px;
    height: 470px;
    border-radius: 50%;
    background: #89b1fb;
    margin: -25px auto 0;
  }

  .circle::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 35px solid transparent;
    border-top-color: #a70000;
    transform: rotate(90deg);
    clip-path: inset(0 0 50% 0);
  }

  .label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .circle p {
    font-size: 30px;
    color: #333;
  }

  .circle h2 {
    margin: 0.5rem 0 0;
    font-size: 45px;
    font-weight: bold;
    color: #000000;
    font-family: "Fredoka", cursive;
  }

  .actions {
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 1rem;
    margin-top: 100px;
  }

  .action-btn {
    background: #a70000;
    color: white;
    padding: 0.8rem 1.2rem;
    margin-bottom: 20px;
    border-radius: 20px;
    font-family: "Fredoka", cursive;
    font-size: 30px;
    font-weight: bold;
    text-align: center;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    text-decoration: none;
  }

  .action-btn:hover {
    background: #a70000;
  }

  .chatbot {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    background: #a70000;
    color: white;
    border: none;
    padding: 0.8rem 1.2rem;
    border-radius: 20px;
    font-family: "Fredoka", cursive;
    cursor: pointer;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  }
</style>
