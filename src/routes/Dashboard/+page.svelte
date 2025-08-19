<script>
  import Header from "$lib/Header.svelte"
  import Footer from "$lib/Footer.svelte"
  import Nav from "$lib/Nav.svelte"
  import { onMount } from "svelte"
  import Chart from "chart.js/auto"
  import { getWeeklyTotals } from "$lib/db.js"

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

<Header />

<main class="content section">
  <h2>Dashboard</h2>

  <Nav />

  <p>{weekRange}</p>
  <canvas bind:this={canvas}></canvas>
  <p>Total Balance: ${balance}</p>

  <nav><a href="/IncomeHistory"> Look Income History</a></nav>
  <nav><a href="/ExpenseHistory"> Look Expense History</a></nav>
  <nav><a href="/AddIncome"> Add Income</a></nav>
  <nav><a href="/AddExpense"> Add Expense</a></nav>
</main>

<Footer />
