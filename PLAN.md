# Bokumentation — Plan & Roadmap

## Phase 1: Content Pipeline (Blog)

| # | Topic | Status | Notes |
|---|-------|--------|-------|
| 1 | ESP-IDF Get Started depth post (CMake, sdkconfig, partitions) | 🟡 Planned | Expand the existing intro |
| 2 | FreeRTOS on ESP32: tasks, queues, semaphores | 🟡 Planned | Series: 2–3 parts |
| 3 | PWM, ADC, I2C on ESP-IDF | 🟡 Planned | Practical walkthroughs |
| 4 | ESP-NOW / BLE crash course | 🟡 Planned | Low-level wireless |
| 5 | Rust on ESP32 (esp-rs) | 🔵 Idea | Experimental |
| 6 | Cinematography: color grading in DaVinci Resolve | 🔵 Idea | Non-embedded content |
| 7 | Minimal Linux boot on qemu | 🔵 Idea | Low-level systems |

**Goal:** Publish **1 post every 2–3 weeks** minimum. Batch write on weekends.

---

## Phase 2: Gallery Tab (`/gallery`)

### New content collection: `gallery`

Schema fields: title, date, camera, lens, location, tags, image, watermark?

### Implementation

- Add `gallery` collection to `src/content.config.ts`
- Create `src/pages/gallery/[...page].astro` — paginated grid (masonry or uniform 3-col)
- Create `src/pages/gallery/index.astro` — gallery landing page
- Create `src/components/GalleryCard.astro` — thumbnail overlay card
- Add "gallery" link to `NAV_LINKS` in `src/consts.ts`
- Upload images as WebP, ~1200px wide max

### Design direction

- Full-bleed image grid, no text except on hover/click
- Lightbox on click (simple overlay, no heavy JS plugin)
- Minimal — let photos speak

---

## Phase 3: Professional Portfolio (`/projects`)

### Current issues

- `image` is required in project schema — all 3 sample projects use the same banner placeholder
- No live/demo vs source repo distinction
- No project detail pages (external link only)

### Upgrades

| Change | Detail |
|--------|--------|
| Make `image` optional in schema | Fall back to colored gradient placeholder |
| Add `github` field | Separate from `link` (demo/site) |
| Add `featured` boolean | Pinned projects on homepage |
| Create `src/pages/projects/[id].astro` | Dedicated detail page per project |
| Add rich Markdown body to project posts | Write actual content per project |
| Update `ProjectCard.astro` | Show "Featured" badge, GitHub icon, richer metadata |

### Projects to write about (real content)

1. **AVR Emulator** (if exists) — cycle-accurate emulation
2. **ESP32 MIDI Controller** — custom firmware + hardware
3. **Bokumentation (this site)** — Astro + GitHub Pages
4. **Any open-source contributions** — PRs made, maintainer work
5. **Cinematography reel** — embed YouTube

---

## Phase 4: About Page Redesign (`/about`)

### Current state

- Static page with AuthorCard + brief tech stack blurb
- No timeline, no skills, no downloadable resume/CV

### Proposed structure

```
Meet the Author        ← AuthorCard with avatar + socials

Resume / CV download   ← button/icon

Bio                    ← expanded prose (who you are, your journey)

Skills & Tools         ← visual grid (embedded, systems, cinematography)
  Embedded/Systems: C, Rust, ESP32, ESP-IDF, FreeRTOS, ARM Cortex-M, AVR
  Development: Python, Bash, Git, Linux, Make, CMake
  Creative: DaVinci Resolve, Fujifilm, color grading

Experience Timeline    ← vertical timeline style
  Education (from education collection) — already has data!
    - Telkom University
    - Sebelas Maret University
  Projects (from projects collection) — highlight only featured

Blog activity          ← chart/bar of posts by month

Photography / Creative ← link to /gallery
```

### Implementation steps

1. Enrich `src/content/authors/ibe.md` with: full bio, skills list, resume URL
2. Add `skills` field to author schema in `src/content.config.ts`
3. Redesign `about.astro` with timeline sections using existing education + project collections
4. Add simple "Blog activity" section (last 12 months, posts-count bar)
5. Add resume/CV download link
6. Polish page layout — use consistent card components

---

## Phase 5: Remaining Design Polish

- [x] Fix TOC sidebar title font size
- [x] Remove broken font preloads
- [x] Change homepage blog grid to `sm:grid-cols-2`
- [x] Change blog listing grid to `sm:grid-cols-2`
- [x] Make blog cards 2-column down to 480px
- [x] Unify text colors across prose (remove hardcoded `#242424`)
- [x] Switch blog content headings to Merriweather
- [x] Soften dark mode foreground for reading comfort
- [ ] Reduce BlogCard title size (YouTube-style)
- [ ] Reduce "Latest posts" / "Blog" heading sizes for consistency
- [ ] Add GitHub-style paper/sheet layout to blog post page

---

## Phase 6: SEO & Metadata

- [x] 100/100 on PageSpeed SEO score
- [ ] Add OpenGraph images per-post (auto-generated from title + description)
- [ ] Add breadcrumb structured data (JSON-LD)
- [ ] Add BlogPosting schema (JSON-LD) to each blog post
- [ ] Add Person/Organization schema to about page
- [ ] Submit sitemap to Google Search Console (verify if not done)
- [ ] Add alt-text to all images in blog posts (SEO + accessibility)

---

## Priority Order

1. **Content** → publish real projects, more blog posts (SEO feeds content)
2. **Portfolio upgrade** → transforms `/projects` from Lorem ipsum → real work
3. **About redesign** → makes you look professional, not just a tech stack list
4. **Gallery** → new feature, lower urgency
5. **Design polish** → small remaining UI tweaks
6. **SEO depth** → structured data, OG images
