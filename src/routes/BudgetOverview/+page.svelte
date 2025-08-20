<script>
  import { onMount } from "svelte"
  import Chart from "chart.js/auto"
  import { getMonthlyExpenses } from "$lib/db.js"
  import { lang } from "$lib/stores/lang.js"
  import i18n from "$lib/i18n.json"

  let canvas
  let chart
  let currentDate = new Date()
  let year = currentDate.getFullYear()
  let month = currentDate.getMonth()
  let expenses = []
  let daysInMonth = new Date(year, month + 1, 0).getDate()
  let today = currentDate.getDate()

  let days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  async function drawChart() {
    const data = await getMonthlyExpenses(year, month + 1) // month is 1-indexed here
    console.log("取得されたデータ：", data)
    expenses = Array(daysInMonth).fill(0)

    data.forEach(({ date, amount }) => {
      const d = new Date(date)
      const day = d.getDate() - 1
      expenses[day] += Number(amount)
    })

    if (chart) chart.destroy()

    chart = new Chart(canvas, {
      type: "line",
      data: {
        labels: days.map((day) => `${day}`),
        datasets: [
          {
            label: "Daily Expenses",
            data: expenses,
            borderColor: "darkred",
            tension: 0.3,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `$${value.toFixed(2)}`,
            },
          },
        },
      },
    })
  }

  onMount(drawChart)
</script>

<main>
  <div class="container">
    <div class="budget">
      <h2>{i18n[$lang].app.budget_overview}</h2>
      <p>{year} {currentDate.toLocaleString("default", { month: "long" })}</p>

      <div class="weekdays">
        {#each ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as d}
          <div>{d}</div>
        {/each}
      </div>

      <div class="calendar">
        {#each Array(new Date(year, month, 1).getDay()) as _}
          <div></div>
        {/each}

        {#each days as day}
          <div class="day {day === today ? 'today' : ''}">{day}</div>
        {/each}
      </div>
    </div>

    <div class="graph">
      <canvas bind:this={canvas}></canvas>
    </div>
  </div>
</main>

<style>
  .container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 32px;
  }

  .budget {
    flex: 1;
  }

  .budget p {
    font-size: 40px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .weekdays,
  .calendar {
    display: grid;
    grid-template-columns: repeat(7, 40px);
    gap: 8px;
    text-align: center;
  }

  .weekdays div {
    font-weight: bold;
  }

  .calendar .day {
    width: 40px;
    height: 40px;
    line-height: 40px;
    border-radius: 50%;
    background-color: transparent;
    transition: background-color 0.3s;
  }

  .calendar .day.today {
    background-color: darkred;
    color: white;
    font-weight: bold;
  }

  .graph {
    flex: 1;
    background-color: white;
    padding: 16px;
    border-radius: 16px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  canvas {
    width: 100%;
    height: auto;
  }
</style>
