<script>
  import Header from "$lib/Header.svelte"
  import Footer from "$lib/Footer.svelte"
  import Nav from "$lib/Nav.svelte"

  function formatDate(date) {
    const year = date.getFullYear()
    const month = date.toLocaleString("en-US", { month: "short" })
    const day = String(date.getDate()).padStart(2, "0")
    return `${year} ${month} ${day}`
  }

  const today = new Date()

  // Create a new Date object and subtract 7 days, so that we can show the day of one week ago
  const weekAgo = new Date()
  weekAgo.setDate(today.getDate() - 7)

  const start = formatDate(weekAgo)
  const end = formatDate(today)
</script>

<Header />

<main class="content section">
  <h2>Dashboard</h2>

  <Nav />

  <p>{start} - {end}</p>

  <nav><a href="/IncomeHistory"> Look Income History</a></nav>
  <nav><a href="/ExpenseHistory"> Look Expense History</a></nav>
  <nav><a href="/AddIncome"> Add Income</a></nav>
  <nav><a href="/AddExpense"> Add Expense</a></nav>
</main>

<Footer />
