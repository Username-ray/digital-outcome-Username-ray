<script>
  import { onMount } from "svelte"
  import { getIncomes, deleteIncome, updateIncome } from "$lib/db.js"
  import { lang } from "$lib/stores/lang.js"
  import i18n from "$lib/i18n.json"

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
  <h1>{i18n[$lang].app.income_history}</h1>

  <label>
    {i18n[$lang].app.search}:
    <input type="text" bind:value={searchTerm} placeholder={i18n[$lang].app.enter} />
  </label>

  {#if filteredIncomes.length > 0}
    <ul>
      {#each filteredIncomes as income}
        <li>
          {#if editingId === income.id}
            <input type="text" bind:value={editName} />
            <input type="number" bind:value={editAmount} />
            <input type="date" bind:value={editDate} />

            <button on:click={saveEdit}>{i18n[$lang].app.save}</button>
            <button on:click={cancelEdit}>{i18n[$lang].app.cancel}</button>
          {:else}
            {income.name} - ${income.amount} - {income.date || "No date"}
            <button on:click={() => startEdit(income)}>{i18n[$lang].app.edit}</button>
            <button on:click={() => handleDelete(income.id)}>{i18n[$lang].app.delete}</button>
          {/if}
        </li>
      {/each}
    </ul>
  {:else}
    <p>{i18n[$lang].app.no_matching_results}</p>
  {/if}
</main>
