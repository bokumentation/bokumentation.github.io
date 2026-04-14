import { getCollection, render, type CollectionEntry } from 'astro:content'
import { readingTime, calculateWordCountFromHtml } from '@/lib/utils'

export async function getAllAuthors(): Promise<CollectionEntry<'authors'>[]> {
  try {
    return await getCollection('authors')
  } catch (error) {
    console.error('Error loading authors:', error)
    return []
  }
}

export async function getAllPosts(): Promise<CollectionEntry<'blog'>[]> {
  try {
    const posts = await getCollection('blog')
    return posts
      .filter((post: CollectionEntry<'blog'>) => !post.data.draft && !isSubpost(post.id))
      .sort((a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>) => b.data.date.valueOf() - a.data.date.valueOf())
  } catch (error) {
    console.error('Error loading blog posts:', error)
    return []
  }
}

export async function getAllPostsAndSubposts(): Promise<
  CollectionEntry<'blog'>[]
> {
  try {
    const posts = await getCollection('blog')
    return posts
      .filter((post: CollectionEntry<'blog'>) => !post.data.draft)
      .sort((a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>) => b.data.date.valueOf() - a.data.date.valueOf())
  } catch (error) {
    console.error('Error loading blog posts and subposts:', error)
    return []
  }
}

export async function getAllProjects(): Promise<CollectionEntry<'projects'>[]> {
  try {
    const projects = await getCollection('projects')
    return projects.sort((a: CollectionEntry<'projects'>, b: CollectionEntry<'projects'>) => {
      const dateA = a.data.startDate?.getTime() || 0
      const dateB = b.data.startDate?.getTime() || 0
      return dateB - dateA
    })
  } catch (error) {
    console.error('Error loading projects:', error)
    return []
  }
}

export async function getAllEducation(): Promise<CollectionEntry<'education'>[]> {
  try {
    const education = await getCollection('education')
    return education.sort((a: CollectionEntry<'education'>, b: CollectionEntry<'education'>) => {
      const orderA = a.data.order ?? 0
      const orderB = b.data.order ?? 0
      
      if (orderA !== orderB) {
        return orderA - orderB
      }
      
      const dateA = a.data.startDate.getTime()
      const dateB = b.data.startDate.getTime()
      return dateB - dateA
    })
  } catch (error) {
    console.error('Error loading education:', error)
    return []
  }
}

export async function getAllTags(): Promise<Map<string, number>> {
  try {
    const posts = await getAllPosts()
    return posts.reduce((acc: Map<string, number>, post: CollectionEntry<'blog'>) => {
      post.data.tags?.forEach((tag: string) => {
        acc.set(tag, (acc.get(tag) || 0) + 1)
      })
      return acc
    }, new Map<string, number>())
  } catch (error) {
    console.error('Error loading tags:', error)
    return new Map<string, number>()
  }
}

export async function getAdjacentPosts(currentId: string): Promise<{
  newer: CollectionEntry<'blog'> | null
  older: CollectionEntry<'blog'> | null
  parent: CollectionEntry<'blog'> | null
}> {
  try {
    const allPosts = await getAllPosts()

    if (isSubpost(currentId)) {
      const parentId = getParentId(currentId)
      const parent = allPosts.find((post) => post.id === parentId) || null

      const posts = await getCollection('blog')
      const subposts = posts
        .filter(
          (post: CollectionEntry<'blog'>) =>
            isSubpost(post.id) &&
            getParentId(post.id) === parentId &&
            !post.data.draft,
        )
        .sort((a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>) => {
          const dateDiff = a.data.date.valueOf() - b.data.date.valueOf()
          if (dateDiff !== 0) return dateDiff

          const orderA = a.data.order ?? 0
          const orderB = b.data.order ?? 0
          return orderA - orderB
        })

      const currentIndex = subposts.findIndex((post: CollectionEntry<'blog'>) => post.id === currentId)
      if (currentIndex === -1) {
        return { newer: null, older: null, parent }
      }

      return {
        newer:
          currentIndex < subposts.length - 1 ? subposts[currentIndex + 1] : null,
        older: currentIndex > 0 ? subposts[currentIndex - 1] : null,
        parent,
      }
    }

    const parentPosts = allPosts.filter((post: CollectionEntry<'blog'>) => !isSubpost(post.id))
    const currentIndex = parentPosts.findIndex((post: CollectionEntry<'blog'>) => post.id === currentId)

    if (currentIndex === -1) {
      return { newer: null, older: null, parent: null }
    }

    return {
      newer: currentIndex > 0 ? parentPosts[currentIndex - 1] : null,
      older:
        currentIndex < parentPosts.length - 1
          ? parentPosts[currentIndex + 1]
          : null,
      parent: null,
    }
  } catch (error) {
    console.error('Error loading adjacent posts:', error)
    return { newer: null, older: null, parent: null }
  }
}

export async function getPostsByAuthor(
  authorId: string,
): Promise<CollectionEntry<'blog'>[]> {
  try {
    const posts = await getAllPosts()
    return posts.filter((post) => post.data.authors?.includes(authorId))
  } catch (error) {
    console.error('Error loading posts by author:', error)
    return []
  }
}

export async function getPostsByTag(
  tag: string,
): Promise<CollectionEntry<'blog'>[]> {
  try {
    const posts = await getAllPosts()
    return posts.filter((post) => post.data.tags?.includes(tag))
  } catch (error) {
    console.error('Error loading posts by tag:', error)
    return []
  }
}

export async function getRecentPosts(
  count: number,
): Promise<CollectionEntry<'blog'>[]> {
  try {
    const posts = await getAllPosts()
    return posts.slice(0, count)
  } catch (error) {
    console.error('Error loading recent posts:', error)
    return []
  }
}

export async function getSortedTags(): Promise<
  { tag: string; count: number }[]
> {
  try {
    const tagCounts = await getAllTags()
    return [...tagCounts.entries()]
      .map(([tag, count]) => ({ tag, count }))
      .sort((a: { tag: string; count: number }, b: { tag: string; count: number }) => {
        const countDiff = b.count - a.count
        return countDiff !== 0 ? countDiff : a.tag.localeCompare(b.tag)
      })
  } catch (error) {
    console.error('Error loading sorted tags:', error)
    return []
  }
}

export function getParentId(subpostId: string): string {
  return subpostId.split('/')[0]
}

export async function getSubpostsForParent(
  parentId: string,
): Promise<CollectionEntry<'blog'>[]> {
  try {
    const posts = await getCollection('blog')
    return posts
      .filter(
        (post: CollectionEntry<'blog'>) =>
          !post.data.draft &&
          isSubpost(post.id) &&
          getParentId(post.id) === parentId,
      )
      .sort((a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>) => {
        const dateDiff = a.data.date.valueOf() - b.data.date.valueOf()
        if (dateDiff !== 0) return dateDiff

        const orderA = a.data.order ?? 0
        const orderB = b.data.order ?? 0
        return orderA - orderB
      })
  } catch (error) {
    console.error('Error loading subposts for parent:', error)
    return []
  }
}

export function groupPostsByYear(
  posts: CollectionEntry<'blog'>[],
): Record<string, CollectionEntry<'blog'>[]> {
  return posts.reduce(
    (acc: Record<string, CollectionEntry<'blog'>[]>, post) => {
      const year = post.data.date.getFullYear().toString()
      ;(acc[year] ??= []).push(post)
      return acc
    },
    {},
  )
}

export async function hasSubposts(postId: string): Promise<boolean> {
  try {
    const subposts = await getSubpostsForParent(postId)
    return subposts.length > 0
  } catch (error) {
    console.error('Error checking for subposts:', error)
    return false
  }
}

export function isSubpost(postId: string): boolean {
  return postId.includes('/')
}

export async function getParentPost(
  subpostId: string,
): Promise<CollectionEntry<'blog'> | null> {
  try {
    if (!isSubpost(subpostId)) {
      return null
    }

    const parentId = getParentId(subpostId)
    const allPosts = await getAllPosts()
    return allPosts.find((post) => post.id === parentId) || null
  } catch (error) {
    console.error('Error loading parent post:', error)
    return null
  }
}

export async function parseAuthors(authorIds: string[] = []) {
  try {
    if (!authorIds.length) return []

    const allAuthors = await getAllAuthors()
    const authorMap = new Map(allAuthors.map((author) => [author.id, author]))

    return authorIds.map((id) => {
      const author = authorMap.get(id)
      return {
        id,
        name: author?.data?.name || id,
        avatar: author?.data?.avatar || '/static/logo.png',
        isRegistered: !!author,
      }
    })
  } catch (error) {
    console.error('Error parsing authors:', error)
    return []
  }
}

export async function getPostById(
  postId: string,
): Promise<CollectionEntry<'blog'> | null> {
  try {
    const allPosts = await getAllPostsAndSubposts()
    return allPosts.find((post) => post.id === postId) || null
  } catch (error) {
    console.error('Error loading post by ID:', error)
    return null
  }
}

export async function getSubpostCount(parentId: string): Promise<number> {
  try {
    const subposts = await getSubpostsForParent(parentId)
    return subposts.length
  } catch (error) {
    console.error('Error counting subposts:', error)
    return 0
  }
}

export async function getCombinedReadingTime(postId: string): Promise<string> {
  try {
    const post = await getPostById(postId)
    if (!post) return readingTime(0)

    let totalWords = calculateWordCountFromHtml(post.body)

    if (!isSubpost(postId)) {
      const subposts = await getSubpostsForParent(postId)
      for (const subpost of subposts) {
        totalWords += calculateWordCountFromHtml(subpost.body)
      }
    }

    return readingTime(totalWords)
  } catch (error) {
    console.error('Error calculating combined reading time:', error)
    return readingTime(0)
  }
}

export async function getPostReadingTime(postId: string): Promise<string> {
  try {
    const post = await getPostById(postId)
    if (!post) return readingTime(0)

    const wordCount = calculateWordCountFromHtml(post.body)
    return readingTime(wordCount)
  } catch (error) {
    console.error('Error calculating post reading time:', error)
    return readingTime(0)
  }
}

export type TOCHeading = {
  slug: string
  text: string
  depth: number
  isSubpostTitle?: boolean
}

export type TOCSection = {
  type: 'parent' | 'subpost'
  title: string
  headings: TOCHeading[]
  subpostId?: string
}

export async function getTOCSections(postId: string): Promise<TOCSection[]> {
  try {
    const post = await getPostById(postId)
    if (!post) return []

    const parentId = isSubpost(postId) ? getParentId(postId) : postId
    const parentPost = isSubpost(postId) ? await getPostById(parentId) : post

    if (!parentPost) return []

    const sections: TOCSection[] = []

    const { headings: parentHeadings } = await render(parentPost)
    if (parentHeadings.length > 0) {
      sections.push({
        type: 'parent',
        title: 'Overview',
        headings: parentHeadings.map((heading: { slug: string; text: string; depth: number }) => ({
          slug: heading.slug,
          text: heading.text,
          depth: heading.depth,
        })),
      })
    }

    const subposts = await getSubpostsForParent(parentId)
    
    const subpostSections = await Promise.all(
      subposts.map(async (subpost: CollectionEntry<'blog'>) => {
        const { headings: subpostHeadings } = await render(subpost)
        if (subpostHeadings.length === 0) return null
        
        return {
          type: 'subpost' as const,
          title: subpost.data.title,
          headings: subpostHeadings.map((heading: { slug: string; text: string; depth: number }, index: number) => ({
            slug: heading.slug,
            text: heading.text,
            depth: heading.depth,
            isSubpostTitle: index === 0,
          })),
          subpostId: subpost.id,
        }
      })
    )

    const validSubpostSections = subpostSections.filter((section): section is NonNullable<typeof section> => section !== null)
    sections.push(...validSubpostSections)

    return sections
  } catch (error) {
    console.error('Error loading TOC sections:', error)
    return []
  }
}