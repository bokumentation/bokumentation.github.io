# Code Quality Plan

## Issues Found During Audit

### 1. Performance: Multiple Redundant Async Calls

**File:** `src/lib/data-utils.ts`

**Problem:** Functions like `getCombinedReadingTime`, `getPostReadingTime`, and `getTOCSections` make multiple `getCollection()` calls that fetch the same data, causing unnecessary database/file reads.

**Current Issue:**
```typescript
export async function getCombinedReadingTime(postId: string) {
  const post = await getPostById(postId) // Calls getAllPostsAndSubposts()
  // ... then separately fetches subposts
}
```

**Fix:**
- Cache collection data on first fetch
- Use Promise.all() for parallel operations where possible
- Consider memoizing expensive computations

---

### 2. Search: Page Type Filter Not Working

**File:** `src/components/SearchBar.astro`

**Problem:** Line 206 has a template literal bug - it creates a static string instead of using the component prop.

**Current Code:**
```javascript
const pageType = '${pageType}'  // Static string, NOT the prop!
```

**Fix:**
```javascript
const pageType = pageType || 'blog'  // Use the component prop directly
```

---

### 3. Missing Error Boundaries

**Files:** `src/lib/data-utils.ts`, `scripts/generate-search-index.js`

**Problem:** No try/catch blocks around async operations, which could crash the app on partial failures.

**Fix:**
- Add try/catch with graceful degradation
- Return defaults or empty arrays on error
- Log errors for debugging

---

### 4. Hard-coded Social URLs

**File:** `src/consts.ts`

**Problem:** Social media URLs are hard-coded, making migration or configuration changes difficult.

**Current:**
```typescript
href: 'https://youtube.com/@bokumentation'
```

**Fix:**
- Move to `.env.example` for environment variables
- Update consts.ts to read from `import.meta.env`

---

## Implementation Priority

1. **HIGH** - Fix SearchBar pageType bug (broken search filtering) ✅
2. **HIGH** - Add error handling to content collections ✅
3. **MEDIUM** - Optimize data-utils async calls with caching ✅
4. **LOW** - Migrate social URLs to environment variables ✅

---

## Testing Checklist

After fixes:
- [x] Search filters by blog/project page type
- [x] RSS feed generates without errors
- [x] Blog post pages load quickly (< 200ms dev)
- [x] Build completes without warnings
- [x] Search index generates all content
