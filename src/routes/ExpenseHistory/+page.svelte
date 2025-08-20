<script>
  import { onMount } from "svelte"
  import { getExpenses, deleteExpense, updateExpense } from "$lib/db.js"
  import { lang } from "$lib/stores/lang.js"
  import i18n from "$lib/i18n.json"

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
  <h1>{i18n[$lang].app.expense_history}</h1>

  <label>
    {i18n[$lang].app.search}:
    <input type="text" bind:value={searchTerm} placeholder={i18n[$lang].app.enter} />
  </label>

  {#if filteredExpenses.length > 0}
    <ul>
      {#each filteredExpenses as expense}
        <li>
          {#if editingId === expense.id}
            <input type="text" bind:value={editData.name} />
            <input type="number" bind:value={editData.amount} />
            <input type="date" bind:value={editData.date} />
            <button on:click={() => saveEdit(expense.id)}>{i18n[$lang].app.save}</button>
            <button on:click={cancelEdit}>{i18n[$lang].app.cancel}</button>
          {:else}
            {expense.name} - ${expense.amount} - {expense.date || "No date"}
            <button on:click={() => startEdit(expense)}>{i18n[$lang].app.edit}</button>
            <button on:click={() => handleDelete(expense.id)}>{i18n[$lang].app.delete}</button>
          {/if}
        </li>
      {/each}
    </ul>
  {:else}
    <p>{i18n[$lang].app.no_matching_results}</p>
  {/if}
</main>
