import type { APIRoute } from 'astro'

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL('sitemap-index.xml', site)

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}