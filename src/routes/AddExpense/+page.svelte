<script>
  import { addExpense, getExpenses } from "$lib/db.js"
  import { goto } from "$app/navigation"
  import { lang } from "$lib/stores/lang.js"
  import i18n from "$lib/i18n.json"

  let expenses = getExpenses()

  let newExpenses = {
    name: "",
    amount: 0,
    date: "",
  }

  async function handleAdd() {
    await addExpense(newExpenses)
    goto("/ExpenseHistory")
  }
</script>

<main>
  {#await expenses}
    <p>{i18n[$lang].app.loading}</p>
  {:then expenses}
    {#each expenses as expense}
      <p>{expense.name} {expense.amount} {expense.date}</p>
    {/each}
  {/await}

  <label class="label">
    {i18n[$lang].app.name}: <input bind:value={newExpenses.name} />
  </label>

  <label class="label">
    {i18n[$lang].app.amount}: $<input type="number" bind:value={newExpenses.amount} />
  </label>

  <label class="label">
    {i18n[$lang].app.date}: <input type="date" bind:value={newExpenses.date} />
  </label>

  <button
    class="button"
    on:click={() => {
      addExpense(newExpenses)
      handleAdd
    }}
  >
    {i18n[$lang].app.add}
  </button>
  <button on:click={() => goto("/ScanReceipt")}> {i18n[$lang].app.scan_receipt} </button>
</main>
