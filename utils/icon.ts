export async function updateIcon(countryCode: string | null) {
  let validCode
  if (countryCode === 'cloudflare') {
    validCode = 'cloudflare'
  } else {
    validCode =
      countryCode?.match(/^[A-Z]{2}$/i)?.[0]?.toLowerCase() || 'unknown'
  }

  const loadImageBitmap = async (code: string): Promise<ImageBitmap> => {
    const url = browser.runtime.getURL('/')
    try {
      const response = await fetch(url + `${code}.webp`)
      if (!response.ok) throw new Error('Flag not found')
      const blob = await response.blob()
      return await createImageBitmap(blob)
    } catch (error) {
      throw new Error(
        `Failed to load flag: ${code} - ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    }
  }

  const processImage = async (bitmap: ImageBitmap) => {
    const canvas = new OffscreenCanvas(128, 128)
    const ctx = canvas.getContext('2d')!

    const ratio = Math.min(
      canvas.width / bitmap.width,
      canvas.height / bitmap.height
    )
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(
      bitmap,
      0,
      0,
      bitmap.width,
      bitmap.height,
      (canvas.width - bitmap.width * ratio) / 2,
      (canvas.height - bitmap.height * ratio) / 2,
      bitmap.width * ratio,
      bitmap.height * ratio
    )

    const sizes = [16, 32, 48, 128]
    return Object.fromEntries(
      sizes.map(size => {
        const resizedCanvas = new OffscreenCanvas(size, size)
        const ctx = resizedCanvas.getContext('2d')!
        ctx.drawImage(canvas, 0, 0, size, size)
        return [size, ctx.getImageData(0, 0, size, size)]
      })
    )
  }

  try {
    const bitmap = await loadImageBitmap(validCode)
    chrome.action.setIcon({ imageData: await processImage(bitmap) })
  } catch (error) {
    console.error('Primary flag failed, trying unknown:', error)
    try {
      const unknownBitmap = await loadImageBitmap('unknown')
      chrome.action.setIcon({ imageData: await processImage(unknownBitmap) })
    } catch (fallbackError) {
      console.error('Both flag assets failed:', fallbackError)
    }
  }
}
