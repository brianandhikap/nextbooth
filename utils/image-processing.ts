export async function cropToSquare(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      // Calculate the square size and offset
      const size = Math.min(img.width, img.height)
      const xOffset = (img.width - size) / 2
      const yOffset = (img.height - size) / 2

      // Set canvas to 1:1 aspect ratio
      canvas.width = size
      canvas.height = size

      // Draw the cropped image
      ctx.drawImage(img, xOffset, yOffset, size, size, 0, 0, size, size)

      // Convert to data URL
      resolve(canvas.toDataURL("image/jpeg", 0.9))
    }

    img.onerror = () => {
      reject(new Error("Failed to load image"))
    }

    img.src = URL.createObjectURL(file)
  })
}

