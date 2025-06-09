<script>
  import { onMount } from "svelte"
  import { getIncomes } from "$lib/db.js"

  let incomes = []

  onMount(async () => {
    incomes = await getIncomes()
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
        </li>
      {/each}
    </ul>
  {/if}
</main>
