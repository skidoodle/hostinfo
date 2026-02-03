import { browser } from 'wxt/browser';

const ICON_CACHE = new Map<string, Record<string, ImageData>>();

export const IconService = {
  async update(tabId: number, countryCode: string | null, isLocal: boolean) {
    try {
      const code = isLocal ? 'unknown' : (countryCode ? countryCode.toLowerCase() : 'unknown');

      const imageData = await this.getIconData(code);
      await browser.action.setIcon({ tabId, imageData });
    } catch (e) {
      console.warn('Failed to update icon', e);
    }
  },

  async getIconData(code: string): Promise<Record<string, ImageData>> {
    if (ICON_CACHE.has(code)) return ICON_CACHE.get(code)!;

    const path = `/${code}.webp`;
    const url = browser.runtime.getURL(path as any);

    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('Icon not found');

      const blob = await resp.blob();
      const bitmap = await createImageBitmap(blob);
      const data = await this.processBitmap(bitmap);

      ICON_CACHE.set(code, data);
      return data;
    } catch {
      if (code !== 'unknown') return this.getIconData('unknown');
      throw new Error('Failed to load fallback icon');
    }
  },

  async processBitmap(bitmap: ImageBitmap): Promise<Record<string, ImageData>> {
    const canvas = new OffscreenCanvas(128, 128);
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

    // Center and contain
    const ratio = Math.min(canvas.width / bitmap.width, canvas.height / bitmap.height);
    const offsetX = (canvas.width - bitmap.width * ratio) / 2;
    const offsetY = (canvas.height - bitmap.height * ratio) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height, offsetX, offsetY, bitmap.width * ratio, bitmap.height * ratio);

    const sizes = [16, 32, 48, 128];
    const result: Record<string, ImageData> = {};

    for (const size of sizes) {
      const sCanvas = new OffscreenCanvas(size, size);
      const sCtx = sCanvas.getContext('2d')!;
      sCtx.drawImage(canvas, 0, 0, size, size);
      result[size] = sCtx.getImageData(0, 0, size, size);
    }

    return result;
  }
};
