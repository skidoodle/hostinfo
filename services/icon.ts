export const IconService = {
  async updateIcon(tabId: number, countryCode: string | null, isLocal: boolean) {
    const code = isLocal ? 'unknown' : (countryCode?.toLowerCase() || 'unknown');
    const fileName = `${code}.png`;

    let success = await this.setIconSafe(tabId, fileName);

    if (!success && code !== 'unknown') {
      await this.setIconSafe(tabId, 'unknown.png');
    }

    try {
      const title = isLocal ? 'Local Resource' : (countryCode ? `Hosted in ${countryCode.toUpperCase()}` : 'Host Info');

      if (typeof chrome !== 'undefined' && chrome.action && chrome.action.setTitle) {
        chrome.action.setTitle({ tabId, title }, () => {
          void chrome.runtime.lastError;
        });
      } else {
        await browser.action.setTitle({ tabId, title });
      }
    } catch (e) {
    }
  },

  async setIconSafe(tabId: number, fileName: string): Promise<boolean> {
    let success = await new Promise<boolean>((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.action && chrome.action.setIcon) {
        chrome.action.setIcon({ tabId, path: fileName }, () => {
          resolve(!chrome.runtime.lastError);
        });
      } else {
        browser.action.setIcon({ tabId, path: fileName })
          .then(() => resolve(true))
          .catch(() => resolve(false));
      }
    });

    if (success) return true;

    try {
      const url = browser.runtime.getURL(`/${fileName}` as any);
      const res = await fetch(url);

      if (!res.ok) {
        return false;
      }

      const blob = await res.blob();
      const bitmap = await createImageBitmap(blob);
      const size = Math.max(bitmap.width, bitmap.height);

      if (typeof OffscreenCanvas !== 'undefined') {
        const canvas = new OffscreenCanvas(size, size);
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return false;

        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(bitmap, (size - bitmap.width) / 2, (size - bitmap.height) / 2);
        const imageData = ctx.getImageData(0, 0, size, size);

        return await new Promise<boolean>((resolve) => {
          if (typeof chrome !== 'undefined' && chrome.action && chrome.action.setIcon) {
            chrome.action.setIcon({ tabId, imageData: { [size.toString()]: imageData } }, () => {
              resolve(!chrome.runtime.lastError);
            });
          } else {
            browser.action.setIcon({ tabId, imageData: { [size.toString()]: imageData } })
              .then(() => resolve(true))
              .catch(() => resolve(false));
          }
        });
      }
      return false;
    } catch (e) {
      return false;
    }
  }
};
