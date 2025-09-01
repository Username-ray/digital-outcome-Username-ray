<script>
  import { lang } from "$lib/stores/lang.js"
  import i18n from "$lib/i18n.json"
  import { page } from "$app/stores"
  $: currentPage = $page.url.pathname
</script>

<nav>
  <a href="/Dashboard" class={currentPage === "/Dashboard" ? "active" : ""}>
    <img src="icons8-pie-chart-48.png" alt={i18n[$lang].app.dashboard} />
  </a>
  <a href="/BudgetOverview" class={currentPage === "/BudgetOverview" ? "active" : ""}>
    <img src="icons8-calendar-48.png" alt={i18n[$lang].app.budget_overview} />
  </a>
  <a href="/Setting" class={currentPage === "/Setting" ? "active" : ""}>
    <img src="icons8-settings-48.png" alt={i18n[$lang].app.setting} />
  </a>
</nav>

<style>
  nav {
    background-color: #89b1fb;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 7px;
  }

  a {
    position: relative;
  }

  a.active::after {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 5px;
    background: black;
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    nav {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background: white; /* デザイン次第で変更 */
      box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
      z-index: 1000;
    }
  }
</style>
