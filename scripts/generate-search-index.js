import { writeFileSync, mkdirSync, existsSync, readdirSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// Helper to read and parse MDX/Markdown files
function parseContentFile(filePath, type) {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const { data, content: body } = matter(content)
    
    // Extract plain text from content
    const plainText = body
      .replace(/<[^>]*>/g, ' ') // Remove HTML tags
      .replace(/[#*`~_\[\]()!]/g, ' ') // Remove markdown formatting
      .replace(/\s+/g, ' ') // Collapse whitespace
      .trim()
      .substring(0, 1000) // Limit length
    
    return {
      id: filePath.split('/').pop().replace(/\.(md|mdx)$/, ''),
      title: data.title || '',
      description: data.description || '',
      content: plainText,
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      tags: data.tags || [],
      draft: data.draft || false,
      type
    }
  } catch (error) {
    console.warn(`⚠️  Could not parse ${filePath}:`, error.message)
    return null
  }
}

// Recursively get all MDX/Markdown files
function getAllContentFiles(dir, type) {
  const files = []
  const items = readdirSync(dir, { withFileTypes: true })
  
  for (const item of items) {
    const fullPath = join(dir, item.name)
    
    if (item.isDirectory()) {
      files.push(...getAllContentFiles(fullPath, type))
    } else if (item.name.match(/\.(md|mdx)$/)) {
      files.push({ path: fullPath, type })
    }
  }
  
  return files
}

async function generateSearchIndex() {
  try {
    console.log('🔍 Generating search index...')
    
    // Define content directories
    const contentDirs = [
      { path: join(__dirname, '..', 'src', 'content', 'blog'), type: 'blog' },
      { path: join(__dirname, '..', 'src', 'content', 'projects'), type: 'project' }
    ]
    
    const searchableItems = []
    
    // Process each content directory
    for (const { path: contentDir, type } of contentDirs) {
      if (!existsSync(contentDir)) {
        console.warn(`⚠️  Content directory not found: ${contentDir}`)
        continue
      }
      
      const contentFiles = getAllContentFiles(contentDir, type)
      console.log(`   Found ${contentFiles.length} ${type} files`)
      
      for (const { path: filePath, type: fileType } of contentFiles) {
        const item = parseContentFile(filePath, fileType)
        
        if (item && !item.draft) {
          // Generate URL based on type
          let url = ''
          if (fileType === 'blog') {
            // Remove 'src/content/blog/' prefix and file extension
            const relativePath = filePath.replace(join(__dirname, '..', 'src', 'content', 'blog') + '/', '')
            const dirName = dirname(relativePath).replace(/\.(md|mdx)$/, '')
            url = `/blog/${dirName}`
          } else if (fileType === 'project') {
            url = `/projects#${item.id}`
          }
          
          searchableItems.push({
            id: item.id,
            title: item.title,
            description: item.description,
            content: item.content,
            url,
            date: item.date,
            type: fileType,
            tags: item.tags
          })
        }
      }
    }
    
    // Create search index object
    const searchIndex = {
      items: searchableItems,
      generatedAt: new Date().toISOString(),
      totalItems: searchableItems.length,
      blogCount: searchableItems.filter(item => item.type === 'blog').length,
      projectCount: searchableItems.filter(item => item.type === 'project').length
    }
    
    // Ensure public directory exists
    const publicDir = join(__dirname, '..', 'public')
    if (!existsSync(publicDir)) {
      mkdirSync(publicDir, { recursive: true })
    }
    
    // Write search index to public directory
    const outputPath = join(publicDir, 'search-index.json')
    writeFileSync(outputPath, JSON.stringify(searchIndex, null, 2))
    
    console.log(`✅ Search index generated: ${outputPath}`)
    console.log(`   - Total items: ${searchableItems.length}`)
    console.log(`   - Blog posts: ${searchIndex.blogCount}`)
    console.log(`   - Projects: ${searchIndex.projectCount}`)
    
  } catch (error) {
    console.error('❌ Error generating search index:', error)
    process.exit(1)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSearchIndex()
}

export default generateSearchIndex
