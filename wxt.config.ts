import { defineConfig } from 'wxt';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  extensionApi: 'webextension-polyfill',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['tabs', 'activeTab', 'webRequest'],
    host_permissions: ['https://ip.albert.lol/*', 'https://dns.google/*', 'https://flagcdn.com/*'],
    action: {
      default_title: 'Host Info',
    },
  },
  vite: () => ({
    plugins: [tailwindcss()],
  })
});
