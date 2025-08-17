<script>
  import { onMount } from "svelte"
  import Tesseract from "tesseract.js"
  import { addExpense } from "$lib/db.js"

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

<main class="p-4">
  <h1 class="text-xl font-bold">Scan Receipt</h1>

  <video id="video" autoplay playsinline class="w-full max-w-md rounded" />
  <canvas id="canvas" width="400" height="300" class="hidden"></canvas>

  <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded" on:click={captureAndProcess}> Scan and save </button>
</main>
