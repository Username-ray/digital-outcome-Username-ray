<script>
  import { onMount } from "svelte"
  import { getExpenses } from "$lib/db.js"

  let expenses = []

  onMount(async () => {
    expenses = await getExpenses()
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
        </li>
      {/each}
    </ul>
  {/if}
</main>
