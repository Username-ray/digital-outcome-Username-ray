<script>
  import Header from "$lib/Header.svelte"
  import Footer from "$lib/Footer.svelte"
  import Nav from "$lib/Nav.svelte"
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

<Header />

<Nav />

<main>
  <h1>{i18n[$lang].app.income_history}</h1>

  <label>
    <img src="icons8-search-48.png" alt={i18n[$lang].app.search} />
    <input type="text" bind:value={searchTerm} placeholder={i18n[$lang].app.enter} />
  </label>

  {#if filteredIncomes.length > 0}
    <div class="card-grid">
      {#each filteredIncomes as income}
        <div class="card">
          {#if editingId === income.id}
            <input type="text" bind:value={editName} />
            <input type="number" bind:value={editAmount} />
            <input type="date" bind:value={editDate} />

            <div class="buttons">
              <button on:click={saveEdit}>{i18n[$lang].app.save}</button>
              <button on:click={cancelEdit}>{i18n[$lang].app.cancel}</button>
            </div>
          {:else}
            <div class="contents">
              <div class="name">{income.name}</div>
              <div class="amount">${income.amount}</div>
            </div>
            <div class="date">{income.date || "No date"}</div>
            <div class="buttons">
              <button on:click={() => startEdit(income)}>{i18n[$lang].app.edit}</button>
              <button on:click={() => handleDelete(income.id)}>{i18n[$lang].app.delete}</button>
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

  @media (max-width: 768px) {
    h1 {
      font-size: 32px;
      text-align: center;
    }

    img {
      width: 20px;
      height: 20px;
    }

    input {
      padding: 0.2rem 1.9rem;
      margin-left: 10px;
      border-radius: 12px;
      width: 250px;
      font-size: 15px;
      text-decoration: none;
      border: 1px solid #ffffff;
    }

    .card-grid {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin: 0 auto;
      text-align: center;
    }

    .name {
      font-size: 25px;
      font-family: "Fredoka", cursive;
      font-weight: bold;
    }
    .amount {
      font-size: 15px;
      font-family: "Fredoka", cursive;
      font-weight: bold;
    }

    .date {
      font-size: 12px;
      text-align: left;
    }

    button {
      background: #a70000;
      color: white;
      padding: 0.2rem 1.9rem;
      margin-top: 40px;
      border-radius: 10px;
      font-family: "Fredoka", cursive;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
      text-decoration: none;
    }
  }
</style>
