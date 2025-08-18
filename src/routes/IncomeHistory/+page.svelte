<script>
  import { onMount } from "svelte"
  import { getIncomes, deleteIncome, updateIncome } from "$lib/db.js"

  let incomes = []
  let searchTerm = ""
  let filteredIncomes = []

  let editingId = null
  let editName = ""
  let editAmount = ""
  let editDate = ""

  onMount(async () => {
    incomes = await getIncomes()
    filteredIncomes = incomes
  })

  async function handleDelete(id) {
    await deleteIncome(id)
    incomes = await getIncomes()
    filteredIncomes = incomes
  }

  function startEdit(income) {
    editingId = income.id
    editName = income.name
    editAmount = income.amount
    editDate = income.date
  }

  async function saveEdit() {
    if (!editingId) return

    await updateIncome(editingId, {
      name: editName,
      amount: Number(editAmount),
      date: editDate,
    })

    incomes = await getIncomes()
    filteredIncomes = incomes
    editingId = null
  }

  function cancelEdit() {
    editingId = null
  }

  $: if (searchTerm !== "") {
    filteredIncomes = incomes.filter((income) => income.name?.toLowerCase().includes(searchTerm.toLowerCase()) || income.amount?.toString().includes(searchTerm) || income.date?.toLowerCase().includes(searchTerm.toLowerCase()))
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
          {#if editingId === income.id}
            <input type="text" bind:value={editName} />
            <input type="number" bind:value={editAmount} />
            <input type="date" bind:value={editDate} />

            <button on:click={saveEdit}>Save</button>
            <button on:click={cancelEdit}>Cancel</button>
          {:else}
            {income.name} - ${income.amount} - {income.date || "No date"}
            <button on:click={() => startEdit(income)}>Edit</button>
            <button on:click={() => handleDelete(income.id)}>Delete</button>
          {/if}
        </li>
      {/each}
    </ul>
  {:else}
    <p>No matching results</p>
  {/if}
</main>
