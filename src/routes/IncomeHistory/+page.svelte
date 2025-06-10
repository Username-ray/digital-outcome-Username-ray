<script>
  import { onMount } from "svelte"
  import { getIncomes, deleteIncome } from "$lib/db.js"

  let incomes = []

  async function loadIncomes() {
    incomes = await getIncomes()
  }

  async function handleDelete(id) {
    await deleteIncome(id)
    await loadIncomes() // Reload to the latest version.
  }

  onMount(() => {
    loadIncomes()
  })
</script>

<main>
  <h1>Income History</h1>

  {#if incomes.length === 0}
    <p>No income records found.</p>
  {:else}
    <ul>
      {#each incomes as income}
        <li>
          {income.name} - ${income.amount} - {income.date}
          <button
            on:click={() => {
              handleDelete(income.id)
            }}>Delete</button
          >
        </li>
      {/each}
    </ul>
  {/if}
</main>
