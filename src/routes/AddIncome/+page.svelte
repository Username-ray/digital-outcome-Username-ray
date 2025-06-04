<script>
  import { addIncome, getIncomes } from "$lib/db.js"

  let incomes = getIncomes()

  let newIncomes = {
    name: "",
    amount: 0,
    date: "",
  }
</script>

<main>
  {#await incomes}
    <p>Loading...</p>
  {:then incomes}
    {#each incomes as income}
      <p>{income.name} {income.amount} {income.date}</p>
    {/each}
  {/await}

  <label class="label">
    Name: <input bind:value={newIncomes.name} />
  </label>

  <label class="label">
    Amount: $<input type="number" bind:value={newIncomes.amount} />
  </label>

  <label class="label">
    Date: <input type="date" bind:value={newIncomes.month} />
  </label>

  <button
    class="button"
    on:click={() => {
      addIncome(newIncomes)
    }}
  >
    Add
  </button>
  <button>Import from E-Wallet</button>
</main>
