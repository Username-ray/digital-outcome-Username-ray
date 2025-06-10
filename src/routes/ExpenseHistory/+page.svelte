<script>
  import { onMount } from "svelte"
  import { getExpenses, deleteExpense } from "$lib/db.js"

  let expenses = []

  async function loadExpenses() {
    expenses = await getExpenses()
  }

  async function handleDelete(id) {
    await deleteExpense(id)
    await loadExpenses() // Reload to the latest version.
  }

  onMount(() => {
    loadExpenses()
  })
</script>

<main>
  <h1>Expense History</h1>

  {#if expenses.length === 0}
    <p>No expense records found.</p>
  {:else}
    <ul>
      {#each expenses as expense}
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
