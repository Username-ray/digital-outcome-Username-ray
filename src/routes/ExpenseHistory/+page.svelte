<script>
  import { onMount } from "svelte"
  import { getExpenses, deleteExpense, updateExpense } from "$lib/db.js"

  let expenses = []
  let searchTerm = ""
  let filteredExpenses = []
  let editingId = null
  let editData = { name: "", amount: "", date: "" }

  onMount(async () => {
    expenses = await getExpenses()
    filteredExpenses = expenses
  })

  async function handleDelete(id) {
    await deleteExpense(id)
    expenses = await getExpenses()
    filterExpenses()
  }

  function startEdit(expense) {
    editingId = expense.id
    editData = { ...expense }
  }

  async function saveEdit(id) {
    await updateExpense(id, editData)
    expenses = await getExpenses()
    filterExpenses()
    editingId = null
  }

  function cancelEdit() {
    editingId = null
  }

  function filterExpenses() {
    if (searchTerm !== "") {
      filteredExpenses = expenses.filter((expense) => expense.name?.toLowerCase().includes(searchTerm.toLowerCase()) || expense.amount?.toString().includes(searchTerm) || expense.date?.includes(searchTerm))
    } else {
      filteredExpenses = expenses
    }
  }

  $: filterExpenses()
</script>

<main>
  <h1>Expense History</h1>

  <label>
    Search:
    <input type="text" bind:value={searchTerm} placeholder="Enter name, amount, or date..." />
  </label>

  {#if filteredExpenses.length > 0}
    <ul>
      {#each filteredExpenses as expense}
        <li>
          {#if editingId === expense.id}
            <input type="text" bind:value={editData.name} placeholder="Name" />
            <input type="number" bind:value={editData.amount} placeholder="Amount" />
            <input type="date" bind:value={editData.date} />
            <button on:click={() => saveEdit(expense.id)}>Save</button>
            <button on:click={cancelEdit}>Cancel</button>
          {:else}
            {expense.name} - ${expense.amount} - {expense.date || "No date"}
            <button on:click={() => startEdit(expense)}>Edit</button>
            <button on:click={() => handleDelete(expense.id)}>Delete</button>
          {/if}
        </li>
      {/each}
    </ul>
  {:else}
    <p>No matching results</p>
  {/if}

  {#if expenses.length === 0}
    <p>No expense records found.</p>
  {/if}
</main>
