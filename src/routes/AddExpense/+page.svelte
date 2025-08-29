<script>
  import Header from "$lib/Header.svelte"
  import Footer from "$lib/Footer.svelte"
  import Nav from "$lib/Nav.svelte"
  import { addExpense } from "$lib/db.js"
  import { goto } from "$app/navigation"
  import { lang } from "$lib/stores/lang.js"
  import i18n from "$lib/i18n.json"

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

<Header />

<Nav />

<main>
  <h1>{i18n[$lang].dashboard.add_expense}</h1>

  <div class="contents">
    <div class="form">
      <label class="labels">
        {i18n[$lang].app.name}:
        <input bind:value={newExpenses.name} placeholder={i18n[$lang].app.name} />
      </label>

      <label class="labels">
        {i18n[$lang].app.amount}:
        <input type="number" bind:value={newExpenses.amount} />
      </label>

      <label class="labels">
        {i18n[$lang].app.date}:
        <input type="date" bind:value={newExpenses.date} />
      </label>
    </div>

    <div class="button-group">
      <button
        class="buttons"
        on:click={() => {
          addExpense(newExpenses)
          handleAdd
        }}
      >
        {i18n[$lang].app.add}
      </button>

      <p>OR</p>

      <button class="buttons" on:click={() => goto("/ScanReceipt")}> {i18n[$lang].app.scan_receipt} </button>
    </div>
  </div>
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
  input {
    padding: 0.6rem 1.2rem;
    border-radius: 12px;
    border: 1px solid #ffffff;
    margin-right: 80px;
    font-size: 18px;
  }

  button {
    background: #a70000;
    color: white;
    padding: 0.8rem 4rem;
    margin-top: 40px;
    margin-right: 300px;
    border-radius: 20px;
    font-family: "Fredoka", cursive;
    font-size: 30px;
    font-weight: bold;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    text-decoration: none;
    width: 350px;
  }

  button:hover {
    background: #a70000;
  }

  .buttons,
  p {
    display: flex;
    flex-direction: column;
    text-align: center;
  }

  p {
    font-family: "Inter", sans-serif;
    font-size: 18px;
    margin-right: 300px;
  }
  label {
    font-family: "Inter", sans-serif;
    color: #000000;
    display: flex;
    flex-flow: column;
    padding: 10px;
    margin: 10px;
    font-size: 18px;
  }

  .contents {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin: 40px 400px;
    gap: 60px;
  }

  .form {
    flex: 1;
  }

  .button-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
</style>
