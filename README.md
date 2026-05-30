# Shiro Automation Documentation Website

Documentation website for Shiro Automation - AI-Native CI Workflow Runtime.

**Live Site**: `docs.shiro-automation.rajit.cc`

## Features

- **Linear-inspired dark theme** - Modern developer-focused design
- **Interactive workflow validator** - Browser-based JSON validation
- **Comprehensive documentation** - Getting started, CLI reference, module library
- **Static export** - Self-host ready

## Tech Stack

- Next.js 14+ (App Router, Static Export)
- Tailwind CSS
- Radix UI components
- FlexSearch (client-side search)

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build static site
npm run build

# Preview production build
npx serve dist
```

## Project Structure

```
app/
├── page.tsx              # Landing page
├── docs/                 # Documentation pages
│   ├── page.tsx          # Introduction
│   ├── quickstart/       # Quick start guide
│   ├── installation/     # Installation instructions
│   ├── cli/              # CLI reference
│   ├── modules/          # Module library
│   └── layout.tsx        # Docs layout with sidebar
├── tools/
│   └── validator/        # Interactive workflow validator
components/
├── docs/                 # Documentation components
│   ├── sidebar.tsx       # Navigation sidebar
│   └── header.tsx        # Page header
└── ui/                   # UI components (shadcn)
Dockerfile                # Docker build
nginx.conf                # Nginx config
└── docker-compose.yml    # Docker Compose setup
dist/                     # Static build output (gitignored)
```

## Deployment

### Docker (Recommended)

Build and run with Docker Compose:

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

The site will be available at `http://localhost:3325`

### Manual Build

If you prefer to build manually:

```bash
npm run build
# Output: dist/
```

Then serve with any static file server.

## Adding Documentation

1. Create a new page in `app/docs/<section>/page.tsx`
2. Add the route to `components/docs/sidebar.tsx`
3. Use the `CodeBlock` component for code examples
4. Export metadata for SEO

## License

Apache 2.0 - same as Shiro Automation
