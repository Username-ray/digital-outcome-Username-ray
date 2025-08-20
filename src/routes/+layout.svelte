<script>
  import "../app.scss"
  import { lang } from "$lib/stores/lang.js"
  import i18n from "$lib/i18n.json"

  // translation function
  $: t = (path) => {
    const keys = path.split(".")
    let result = i18n[$lang]
    for (const k of keys) {
      result = result?.[k]
    }
    return result || path
  }
</script>

<main>
  <slot />
</main>
