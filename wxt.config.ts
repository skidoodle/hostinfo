import { defineConfig } from 'wxt';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['tabs', 'activeTab', 'webRequest', 'file://*', 'debugger'],
    host_permissions: ['https://ip.albert.lol/*', 'https://dns.google/*', 'https://flagcdn.com/*'],
  },
  vite: () => ({
    plugins: [tailwindcss()],
  })
});
