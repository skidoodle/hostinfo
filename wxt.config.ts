import { defineConfig } from 'wxt'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['tabs', 'activeTab'],
    host_permissions: [
      'https://ip.albert.lol/*',
      'https://cloudflare-dns.com/*',
    ],
    action: {
      default_title: 'Host Info',
    },
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
})
