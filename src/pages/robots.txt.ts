import type { APIRoute } from 'astro'

const getRobotsTxt = (sitemapURL: URL, siteURL: URL) => `
# Bokumentation - Robots.txt
# Generated: ${new Date().toISOString()}

# Main search engines
User-agent: Googlebot
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Crawl-delay: 2

User-agent: Yandex
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Crawl-delay: 2

# All other crawlers
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /search/
Disallow: /login/
Disallow: /register/
Disallow: /dashboard/
Disallow: /*.json$
Disallow: /*.xml$?*
Disallow: /*?*sort=
Disallow: /*?*filter=
Disallow: /*?*page=
Crawl-delay: 3

# Sitemaps
Sitemap: ${sitemapURL.href}

# Host
Host: ${siteURL.host}

# Clean-param directives (for dynamic URLs)
Clean-param: ref /blog/
Clean-param: utm_source /
Clean-param: utm_medium /
Clean-param: utm_campaign /
Clean-param: utm_term /
Clean-param: utm_content /

# Allow specific file types
Allow: /*.css$
Allow: /*.js$
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.gif$
Allow: /*.svg$
Allow: /*.webp$
Allow: /*.woff2$
Allow: /*.woff$
Allow: /*.ttf$

# Performance hints
Request-rate: 1/5
Visit-time: 0600-2200
`

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL('sitemap-index.xml', site)
  const siteURL = site || new URL('https://bokumentation.site')
  return new Response(getRobotsTxt(sitemapURL, siteURL), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=7200',
    },
  })
}