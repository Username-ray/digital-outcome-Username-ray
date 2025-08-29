<script>
  import Header from "$lib/Header.svelte"
  import Footer from "$lib/Footer.svelte"
  import Nav from "$lib/Nav.svelte"
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

<Header />

<Nav />

<main>
  <h1>{i18n[$lang].app.expense_history}</h1>

  <label>
    <img src="icons8-search-48.png" alt={i18n[$lang].app.search} />
    <input type="text" bind:value={searchTerm} placeholder={i18n[$lang].app.enter} />
  </label>

  {#if filteredExpenses.length > 0}
    <div class="card-grid">
      {#each filteredExpenses as expense}
        <div class="card">
          {#if editingId === expense.id}
            <input type="text" bind:value={editData.name} />
            <input type="number" bind:value={editData.amount} />
            <input type="date" bind:value={editData.date} />

            <div class="buttons">
              <button on:click={() => saveEdit(expense.id)}>{i18n[$lang].app.save}</button>
              <button on:click={cancelEdit}>{i18n[$lang].app.cancel}</button>
            </div>
          {:else}
            <div class="contents">
              <div class="name">{expense.name}</div>
              <div class="amount">${expense.amount}</div>
            </div>
            <div class="date">{expense.date || "No date"}</div>
            <div class="buttons">
              <button on:click={() => startEdit(expense)}>{i18n[$lang].app.edit}</button>
              <button on:click={() => handleDelete(expense.id)}>{i18n[$lang].app.delete}</button>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {:else}
    <p>{i18n[$lang].app.no_matching_results}</p>
  {/if}
</main>

<Footer />

<style>
  h1 {
    font-family: "Fredoka", cursive;
    font-size: 58px;
    color: #a70000;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    font-weight: bold;
    margin: 1.5rem 0;
  }

  label {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img {
    width: 30px;
    height: 30px;
  }

  .card-grid {
    margin: 0px 120px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    padding: 20px;
  }

  .card {
    background-color: #ffffff;
    color: #000000;
    padding: 0.8rem 1.2rem;
    margin: 20px;
    border-radius: 20px;
    text-decoration: none;
  }

  .name {
    font-size: 30px;
    font-family: "Fredoka", cursive;
    font-weight: bold;
  }
  .amount {
    font-size: 25px;
    font-family: "Fredoka", cursive;
    font-weight: bold;
  }

  .contents {
    display: flex;
    justify-content: space-between;
  }

  .date {
    font-size: 15px;
  }

  .buttons {
    display: flex;
    justify-content: space-between;
  }

  button {
    background: #a70000;
    color: white;
    padding: 0.2rem 1.9rem;
    margin-top: 40px;
    border-radius: 10px;
    font-family: "Fredoka", cursive;
    font-size: 30px;
    font-weight: bold;
    text-align: center;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    text-decoration: none;
  }

  button:hover {
    background: #a70000;
  }

  input {
    padding: 0.2rem 1.9rem;
    margin-left: 10px;
    border-radius: 12px;
    width: 450px;
    font-size: 20px;
    text-decoration: none;
    border: 1px solid #ffffff;
  }
</style>
