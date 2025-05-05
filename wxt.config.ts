import tailwindcss from "@tailwindcss/vite"
import react from '@vitejs/plugin-react'
import biomePlugin from 'vite-plugin-biome'
import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ['scripting', 'storage', 'sidePanel', 'tabs'],
    name: 'doc pagination',
    version: '0.0.1',
    description: 'extension template',
    host_permissions: ['<all_urls>'],
    action: {
      default_title: 'Click to open panel',
    },
  },
  vite: () => ({
    plugins: [
      react(),
      tailwindcss(),
      biomePlugin({
        mode: 'format',
        files: 'entrypoints/', // Format only JavaScript files in src
        applyFixes: true,
      }),
    ],
  }),
})
