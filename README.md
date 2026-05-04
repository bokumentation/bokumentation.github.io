# Hai there 👋

[![Deploy to GitHub Pages](https://github.com/bokumentation/bokumentation.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/bokumentation/bokumentation.github.io/actions/workflows/deploy.yml)

Welcome to the Bokumentation!

This is my personal website. Made with Astro with Erudite Theme with my custom touch.

## Environment Setup

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and set your contact email:
   ```
   PUBLIC_CONTACT_EMAIL=your-email@example.com
   ```

3. The email will be used in:
   - Social links in the header/footer
   - Author contact cards
   - Any other contact links throughout the site

## Security Notes

- Email addresses are no longer hardcoded in the source code
- All email references use environment variables
- The `PUBLIC_CONTACT_EMAIL` variable is exposed to client-side code (as indicated by the `PUBLIC_` prefix)
- Never put sensitive information (API keys, passwords, etc.) in `PUBLIC_` variables

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This site is configured for static deployment. Build the project and deploy the `dist` folder to your hosting service.
