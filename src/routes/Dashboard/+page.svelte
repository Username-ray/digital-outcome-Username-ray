<script>
  import Header from "$lib/Header.svelte"
  import Footer from "$lib/Footer.svelte"
  import Nav from "$lib/Nav.svelte"
  import { onMount } from "svelte"
  import Chart from "chart.js/auto"
  import { getWeeklyTotals } from "$lib/db.js"
  import { lang } from "$lib/stores/lang.js"
  import i18n from "$lib/i18n.json"

  let canvas
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

    new Chart(canvas, {
      type: "pie",
      data: {
        labels: ["Income", "Expense"],
        datasets: [
          {
            data: [incomeTotal, expenseTotal],
            backgroundColor: ["#36A2EB", "#FF6384"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    })
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

<main class="content section">
  <h1>{i18n[$lang].dashboard.title}</h1>

  <Nav />

  <p>{weekRange}</p>
  <canvas bind:this={canvas}></canvas>
  <p>{i18n[$lang].dashboard.balance}: ${balance}</p>

  <nav><a href="/IncomeHistory"> {i18n[$lang].dashboard.look_income_history} </a></nav>
  <nav><a href="/ExpenseHistory"> {i18n[$lang].dashboard.look_expense_history} </a></nav>
  <nav><a href="/AddIncome"> {i18n[$lang].dashboard.add_income} </a></nav>
  <nav><a href="/AddExpense"> {i18n[$lang].dashboard.add_expense} </a></nav>
</main>

<Footer />
