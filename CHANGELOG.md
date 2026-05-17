# Changelog

## [Unreleased] — 2026-05-18

### Layout & UI

- Redesign blog post layout to GitHub-style: sticky sidebar with scroll-aware TOC
- Add sidebar pane CSS variables (`--pane-min-width`, `--pane-max-width`)
- Add horizontal divider under "Table of Contents" in both desktop and mobile TOCs
- Reduce TOC font size and list spacing for tighter fit
- Make "Table of Contents" label bold in both TOCs
- Adjust dark mode foreground for improved contrast
- Widen paragraph spacing and fix list margins for better readability
- Match code block title size to body text
- Align navigation to the right with `font-heading` applied

### Config

- Add `.editorconfig` (UTF-8, LF, 2-space indent for source files)
- Add `.vscode/settings.json` (format-on-save, Tailwind IntelliSense)
- Track `.vscode/` in git (remove from `.gitignore`)
- Remove `CODE-PLAN.md` from project

### Typography & Fonts

- Switch body font from Geist to **Merriweather** (regular / italic / 700)
- Switch heading font to **DM Sans** (regular / italic / 700)
- Reduce body text size for better readability on laptop displays
- Code block line-height: `leading-snug` → `leading-tight` (matches GitHub)

### Cleanup

- Delete `.zed/` (Zed editor config — not used)
- Delete old Geist font files (`GeistVF.woff2`, `GeistMonoVF.woff2`)
- Delete unused images (`avatarboku.jpg`, `favicon.ico`, `favicon.png`, `favicon.svg`, `ibe.jpeg`)
- Delete `Timeline.astro` component

### Content

- Add new blog post: "260505-image-hello"
- Add `.webp` cover images to all blog posts
- Update author info

### Meta

- Add `CHANGELOG.md` to track project changes
- Add GitHub Actions build badge to `README.md`

### PageSpeed Optimizations

- Add `fetchpriority="high"` to hero blog post image (LCP)
- Remove 6 font preload `<link>` tags — redundant with `@font-face font-display: swap`
- Remove Google Fonts preconnect — all fonts are self-hosted woff2
- Defer pagination component JS: `client:load` → `client:idle`

### Lock Files

- Add `pnpm-lock.yaml` to `.gitignore`
