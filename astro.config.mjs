import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  site: 'https://barrakudesbegur.org',
  integrations: [mdx(), sitemap(), icon()],
  redirects: {
    '/agenda': '/#esdeveniments',
    '/agenda/[...slug]': '/esdeveniments/[...slug]',
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
