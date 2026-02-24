import { defineConfig } from 'wxt'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifestVersion: 3,
  manifest: {
    name: 'Host Info',
    description: 'Get host information',
    version: '2.0.0',
    permissions: [
      'tabs',
      'webRequest',
      'webNavigation',
      'storage'
    ],
    host_permissions: [
      '<all_urls>',
    ],
    action: {
      default_title: 'Host Info',
    },
    browser_specific_settings: {
      gecko: {
        id: '{6271af71-3c09-452a-9c28-181723a4ed96}',
      },
    }
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
})
