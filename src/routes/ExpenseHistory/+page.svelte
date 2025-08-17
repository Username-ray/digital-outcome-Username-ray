<script>
  import { onMount } from "svelte"
  import { getExpenses, deleteExpense } from "$lib/db.js"

  let expenses = []
  let searchQuery = ""

  async function loadExpenses() {
    expenses = await getExpenses()
  }

  async function handleDelete(id) {
    await deleteExpense(id)
    await loadExpenses() // Reload to the latest version.
  }

  $: filteredExpenses = expenses.filter((expense) => {
    const query = searchQuery.toLowerCase()
    return expense.name.toLowerCase().includes(query) || String(expense.amount).toLowerCase().includes(query) || String(expense.date).toLowerCase().includes(query)
  })

  onMount(() => {
    loadExpenses()
  })
</script>

<main>
  <h1>Expense History</h1>
  <input type="text" placeholder="Search by name, amount, or date..." bind:value={searchQuery} />

  {#if filteredExpenses.length === 0}
    <p>No expense records found.</p>
  {:else}
    <ul>
      {#each filteredExpenses as expense}
        <li>
          {expense.name} - ${expense.amount} - {expense.date}
          <button
            on:click={() => {
              handleDelete(expense.id)
            }}>Delete</button
          >
        </li>
      {/each}
    </ul>
  {/if}
</main>
