<script>
  import { addExpense, getExpenses } from "$lib/db.js"

  let expenses = getExpenses()

  let newExpenses = {
    name: "",
    amount: 0,
    date: "",
  }
</script>

<main>
  {#await expenses}
    <p>Loading...</p>
  {:then expenses}
    {#each expenses as expense}
      <p>{expense.name} {expense.amount} {expense.date}</p>
    {/each}
  {/await}

  <label class="label">
    Name: <input bind:value={newExpenses.name} />
  </label>

  <label class="label">
    Amount: $<input type="number" bind:value={newExpenses.amount} />
  </label>

  <label class="label">
    Date: <input type="date" bind:value={newExpenses.month} />
  </label>

  <button
    class="button"
    on:click={() => {
      addIncome(newExpenses)
    }}
  >
    Add
  </button>
  <button>Scan Receipt</button>
</main>
