import type { CollectionEntry } from 'astro:content'
import Fuse from 'fuse.js'

export type SearchableItem = {
  id: string
  title: string
  description: string
  content: string
  url: string
  date: string
  type: 'blog' | 'project'
  tags?: string[]
}

export type SearchResult = {
  item: SearchableItem
  score: number
  matches?: Array<{
    indices: [number, number][]
    value: string
    key: string
  }>
}

// Type for Fuse.js matches that we can safely cast to
export type FuseMatch = {
  indices: [number, number][]
  value: string
  key: string
}

export type SearchIndex = {
  items: SearchableItem[]
  generatedAt: string
}

// Fuse.js search configuration
const fuseOptions = {
  keys: [
    { name: 'title', weight: 2 },
    { name: 'description', weight: 1.5 },
    { name: 'content', weight: 1 },
    { name: 'tags', weight: 1.5 }
  ],
  includeScore: true,
  includeMatches: true,
  threshold: 0.4, // Lower = stricter matching
  distance: 100, // Maximum distance for fuzzy matching
  minMatchCharLength: 2,
  shouldSort: true,
  useExtendedSearch: true,
  ignoreLocation: true,
  findAllMatches: true
}

let fuseInstance: Fuse<SearchableItem> | null = null
let searchIndex: SearchableItem[] = []

/**
 * Initialize the search index
 */
export async function initSearch(indexData: SearchIndex): Promise<void> {
  searchIndex = indexData.items
  fuseInstance = new Fuse(searchIndex, fuseOptions)
}

/**
 * Perform a search query
 */
export function search(query: string, type?: 'blog' | 'project'): SearchResult[] {
  if (!fuseInstance || !query.trim()) {
    return []
  }

  let searchResults = fuseInstance.search(query)
  
  // Filter by type if specified
  if (type) {
    searchResults = searchResults.filter(result => result.item.type === type)
  }
  
  // Convert Fuse results to our SearchResult type
  return searchResults.slice(0, 20).map(result => ({
    item: result.item,
    score: result.score || 0,
    matches: result.matches ? result.matches.map(match => ({
      indices: match.indices as [number, number][],
      value: match.value || '',
      key: match.key || ''
    })) : undefined
  }))
}

/**
 * Convert blog post to searchable item
 */
export function blogPostToSearchable(post: CollectionEntry<'blog'>): SearchableItem {
  // Extract plain text from HTML/MDX content (simplified)
  const content = typeof post.body === 'string' 
    ? post.body.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    : ''
  
  return {
    id: post.id,
    title: post.data.title,
    description: post.data.description,
    content: content.substring(0, 1000), // Limit content length
    url: `/blog/${post.id}`,
    date: post.data.date.toISOString(),
    type: 'blog',
    tags: post.data.tags
  }
}

/**
 * Convert project to searchable item
 */
export function projectToSearchable(project: CollectionEntry<'projects'>): SearchableItem {
  return {
    id: project.id,
    title: project.data.name,
    description: project.data.description,
    content: project.data.description, // Projects don't have body content
    url: `/projects#${project.id}`,
    date: project.data.startDate?.toISOString() || new Date().toISOString(),
    type: 'project',
    tags: project.data.tags
  }
}

/**
 * Get search placeholder text based on page type
 */
export function getSearchPlaceholder(pageType?: 'blog' | 'project'): string {
  switch (pageType) {
    case 'blog':
      return 'Search blog posts...'
    case 'project':
      return 'Search projects...'
    default:
      return 'Search...'
  }
}

/**
 * Type guard to check if value is 'blog' or 'project'
 */
export function isValidPageType(value: string): value is 'blog' | 'project' {
  return value === 'blog' || value === 'project'
}

/**
 * Debounce function for search input
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}