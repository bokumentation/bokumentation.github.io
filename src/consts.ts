// SITE SETTING ARE HERE!
import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'Bokumentation',
  description:
    'This are my boku blog',
  href: 'https://bokumentation.vercel.app',
  author: 'Ibe Ibrahim',
  locale: 'en-US',
  featuredPostCount: 6,
  postsPerPage: 10,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/blog',
    label: 'blog',
  },
  {
    href: '/about',
    label: 'about',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://youtube.com/bokumentation',
    label: 'Youtube',
  },
  {
    href: 'https://github.com/bokumentation',
    label: 'GitHub',
  },
  {
    href: 'https://instagram.com/bokumentation',
    label: 'Instagram',
  },
  {
    href: 'mailto:no_email@gmail.com',
    label: 'Email',
  },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  Twitter: 'lucide:twitter',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
  Instagram: 'lucide:instagram',
  Youtube: 'lucide:youtube',
}