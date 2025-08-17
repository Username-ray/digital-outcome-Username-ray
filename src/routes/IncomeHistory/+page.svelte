<script>
  import { onMount } from "svelte"
  import { getIncomes, deleteIncome } from "$lib/db.js"

  let incomes = []
  let searchTerm = ""

  let filteredIncomes = []

  onMount(async () => {
    incomes = await getIncomes()
    filteredIncomes = incomes
  })

  async function handleDelete(id) {
    await deleteIncome(id)
  }

  // Update the filter whenever the input changes
  $: if (searchTerm !== "") {
    filteredIncomes = incomes.filter((income) => income.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  } else {
    filteredIncomes = incomes
  }
</script>

<main>
  <h1>Income History</h1>

  <label>
    Search:
    <input type="text" bind:value={searchTerm} placeholder="Enter name..." />
  </label>

  {#if filteredIncomes.length > 0}
    <ul>
      {#each filteredIncomes as income}
        <li>{income.name} - ${income.amount} - {income.date || "No date"}</li>
      {/each}
    </ul>
  {:else}
    <p>No matching results</p>
  {/if}

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
