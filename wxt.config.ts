import { defineConfig } from 'wxt'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifestVersion: 3,
  manifest: {
    name: 'Host Info',
    description: 'Get host information',
    version: '2.6',
    permissions: [
      'tabs',
      'webRequest',
      'webNavigation',
      'storage',
      'alarms'
    ],
    host_permissions: [
      '<all_urls>',
    ],
    action: {
      default_title: 'Host Info',
    },
    browser_specific_settings: {
      gecko: {
        id: 'hostinfo@albert.lol',
        strict_min_version: '142.0',
        data_collection_permissions: {
          required: ['none']
        }
      },
    }
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
})
