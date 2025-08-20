<script>
  import { addIncome, getIncomes } from "$lib/db.js"
  import { goto } from "$app/navigation"
  import { lang } from "$lib/stores/lang.js"
  import i18n from "$lib/i18n.json"

  let incomes = getIncomes()

  let newIncomes = {
    name: "",
    amount: 0,
    date: "",
  }

  async function handleAdd() {
    await addIncome(newIncomes)
    goto("/IncomeHistory")
  }
</script>

<main>
  {#await incomes}
    <p>{i18n[$lang].app.loading}</p>
  {:then incomes}
    {#each incomes as income}
      <p>{income.name} {income.amount} {income.date}</p>
    {/each}
  {/await}

  <label class="label">
    {i18n[$lang].app.name}: <input bind:value={newIncomes.name} />
  </label>

  <label class="label">
    {i18n[$lang].app.amount}: $<input type="number" bind:value={newIncomes.amount} />
  </label>

  <label class="label">
    {i18n[$lang].app.date}: <input type="date" bind:value={newIncomes.date} />
  </label>

  <button
    class="button"
    on:click={() => {
      addIncome(newIncomes)
      handleAdd
    }}
  >
    {i18n[$lang].app.add}
  </button>
  <button>{i18n[$lang].app.import}</button>
</main>
