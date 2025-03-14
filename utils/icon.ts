export async function updateIcon(countryCode: string | null) {
    const validCode = countryCode?.match(/^[A-Z]{2}$/i)?.[0]?.toLowerCase() || 'unknown';

    try {
      // Existing flag image handling
      const flagUrl = `https://flagcdn.com/w160/${validCode}.png`;
      const response = await fetch(flagUrl);
      if (!response.ok) throw new Error('Invalid flag');

      const blob = await response.blob();
      const bitmap = await createImageBitmap(blob);
      const canvas = new OffscreenCanvas(128, 128);
      const ctx = canvas.getContext('2d')!;

      const ratio = Math.min(
        canvas.width / bitmap.width,
        canvas.height / bitmap.height
      );
      ctx.drawImage(
        bitmap,
        0, 0, bitmap.width, bitmap.height,
        (canvas.width - bitmap.width * ratio) / 2,
        (canvas.height - bitmap.height * ratio) / 2,
        bitmap.width * ratio,
        bitmap.height * ratio
      );

      const sizes = [16, 32, 48, 128];
      const imageData = Object.fromEntries(
        sizes.map(size => {
          const resizedCanvas = new OffscreenCanvas(size, size);
          const resizedCtx = resizedCanvas.getContext('2d')!;
          resizedCtx.drawImage(canvas, 0, 0, size, size);
          return [size, resizedCtx.getImageData(0, 0, size, size)];
        })
      );

      chrome.action.setIcon({ imageData });
    } catch (error) {
      console.error('Error updating extension icon:', error);

      // Fixed fallback SVG
      const fallbackSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="#666" rx="20"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
              font-size="60" fill="#fff">?</text>
      </svg>`;

      // Properly encode SVG
      const encodedSVG = encodeURIComponent(fallbackSVG)
        .replace(/'/g, '%27')
        .replace(/"/g, '%22');

      const fallbackUrl = `data:image/svg+xml;charset=utf-8,${encodedSVG}`;

      // Set icon using path with size-specific URLs
      chrome.action.setIcon({
        path: {
          "16": fallbackUrl,
          "32": fallbackUrl,
          "48": fallbackUrl,
          "128": fallbackUrl
        }
      });
    }
  }
