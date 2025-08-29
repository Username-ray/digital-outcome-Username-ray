<script>
  import { lang } from "$lib/stores/lang.js"
  import i18n from "$lib/i18n.json"
</script>

<header class="hero is-primary">
  <div class="hero-body">
    <h1 class="title">{i18n[$lang].app.app}</h1>
  </div>
</header>

<style>
  .title {
    font-size: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0rem;
  }
</style>
