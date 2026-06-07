import { defineConfig } from 'wxt'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifestVersion: 3,
  manifest: {
    name: 'Host Info',
    description: 'Get host information',
    version: '2.3',
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
        id: '{6271af71-3c09-452a-9c28-181723a4ed96}',
        strict_min_version: '140.0',
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
