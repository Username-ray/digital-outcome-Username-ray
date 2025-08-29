<script>
  import Header from "$lib/Header.svelte"
  import Footer from "$lib/Footer.svelte"
  import Nav from "$lib/Nav.svelte"
  import { onMount } from "svelte"
  import Tesseract from "tesseract.js"
  import { addExpense } from "$lib/db.js"
  import { lang } from "$lib/stores/lang.js"
  import i18n from "$lib/i18n.json"

  let videoEl
  let canvasEl

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      videoEl.srcObject = stream
    } catch (err) {
      console.error("Camera error:", err)
      alert("Camera not available:" + err.message)
    }
  }

  async function captureAndProcess() {
    try {
      const ctx = canvasEl.getContext("2d")
      ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height)

      const imgData = canvasEl.toDataURL("image/png")

      const {
        data: { text },
      } = await Tesseract.recognize(imgData, "eng")
      console.log("OCR result:", text)

      const match = text.match(/\d+(\.\d{1,2})?/)
      const amount = match ? parseFloat(match[0]) : 0

      if (amount > 0) {
        await addExpense({
          name: "Receipt Scan",
          amount: amount,
          date: new Date().toISOString().split("T")[0],
        })
        alert("Expense saved: $" + amount)
      } else {
        alert("Failed to add expense.")
      }
    } catch (err) {
      console.error("Processing error:", err)
      alert("Processing Error: " + err.message)
    }
  }

  onMount(() => {
    videoEl = document.getElementById("video")
    canvasEl = document.getElementById("canvas")
    startCamera()
  })
</script>

<Header />

<Nav />

<main class="p-4">
  <h1>{i18n[$lang].app.scan_receipt}</h1>

  <video id="video" autoplay playsinline />
  <canvas id="canvas" width="400" height="300" class="hidden"></canvas>

  <button on:click={captureAndProcess}> {i18n[$lang].app.scan_save} </button>
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

  button {
    background: #a70000;
    color: white;
    padding: 0.8rem 1.2rem;
    margin-bottom: 20px;
    border-radius: 20px;
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
</style>
