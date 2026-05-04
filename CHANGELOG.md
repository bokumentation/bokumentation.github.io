# Changelog

## [Unreleased] — 2026-05-05

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

### Lock Files

- Add `pnpm-lock.yaml` to `.gitignore`
