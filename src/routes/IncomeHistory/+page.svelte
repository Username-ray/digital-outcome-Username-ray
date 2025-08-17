<script>
  import { onMount } from "svelte"
  import { getIncomes, deleteIncome } from "$lib/db.js"

  let incomes = []
  let searchTerm = ""
  let filteredIncomes = []

  async function loadIncomes() {
    incomes = await getIncomes()
    filteredIncomes = incomes
  }

  async function handleDelete(id) {
    await deleteIncome(id)
    await loadIncomes()
  }

  onMount(() => {
    loadIncomes()
  })

  $: if (searchTerm !== "") {
    const term = searchTerm.toLowerCase()
    filteredIncomes = incomes.filter((income) => (income.name && income.name.toLowerCase().includes(term)) || (income.amount && income.amount.toString().includes(term)) || (income.date && income.date.toString().toLowerCase().includes(term)))
  } else {
    filteredIncomes = incomes
  }
</script>

<main>
  <h1>Income History</h1>

  <label>
    Search:
    <input type="text" bind:value={searchTerm} placeholder="Enter name, amount, or date..." />
  </label>

  {#if filteredIncomes.length > 0}
    <ul>
      {#each filteredIncomes as income}
        <li>
          {income.name} - ${income.amount} - {income.date || "No date"}
          <button on:click={() => handleDelete(income.id)}>Delete</button>
        </li>
      {/each}
    </ul>
  {:else}
    <p>No matching results</p>
  {/if}
</main>
