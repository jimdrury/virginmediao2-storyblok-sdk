# Storyblok SDK Documentation

This is a Next.js documentation app for the Storyblok TypeScript SDK, featuring auto-generated documentation from TypeScript source code.

## Features

- 🚀 **Static Site Generation** - Optimized for static hosting
- 📚 **Auto-Generated Docs** - Documentation generated from TypeScript source
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- 🔍 **Type Safety** - Full TypeScript support
- ⚡ **Fast Performance** - Optimized for speed and SEO

## Getting Started

### Prerequisites

- Node.js 22+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Generate documentation from SDK source
npm run generate-docs

# Start development server
npm run dev
```

### Building for Production

```bash
# Generate docs and build
npm run generate-docs
npm run build

# Export static files
npm run export
```

## Auto-Generation

The documentation is automatically generated from the TypeScript SDK source code using:

- **JSDoc Comments** - Extracted from source code
- **Type Definitions** - Interfaces, types, and classes
- **Method Signatures** - Parameters, return types, and async indicators
- **Code Examples** - Syntax highlighting and formatting

### Generation Process

1. **Parse TypeScript** - Uses `ts-morph` to analyze source files
2. **Extract Documentation** - Pulls JSDoc comments and type information
3. **Generate Markdown** - Creates structured documentation files
4. **Build Static Site** - Next.js generates static HTML pages

## Project Structure

```
src/
├── app/
│   ├── docs/
│   │   ├── page.tsx          # Documentation index
│   │   └── [slug]/
│   │       └── page.tsx      # Individual doc pages
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── lib/
│   └── markdown.ts           # Markdown processing utilities
└── docs/                     # Auto-generated documentation files
    ├── index.md
    ├── storybloksdk.md
    ├── storyblokmanagersdk.md
    └── ...
scripts/
└── generate-docs.js          # Auto-generation script
```

## Customization

### Adding Custom Documentation

1. Create markdown files in `src/app/docs/`
2. Add frontmatter metadata:
   ```markdown
   ---
   title: "Custom Page"
   description: "Description of the page"
   category: "Guide"
   ---
   ```

### Styling

- Uses Tailwind CSS for styling
- Custom prose styles in `globals.css`
- Responsive design for all screen sizes

### Configuration

- **Next.js Config** - Static export configuration
- **Biome Config** - Code formatting and linting
- **TypeScript Config** - Type checking and compilation

## Deployment

The app is configured for static site generation and can be deployed to:

- **Vercel** - Zero-config deployment
- **Netlify** - Static site hosting
- **GitHub Pages** - Free hosting
- **AWS S3** - Scalable static hosting

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run export` - Export static files
- `npm run generate-docs` - Generate documentation
- `npm run check` - Run Biome checks
- `npm run format` - Format code with Biome

### Code Quality

- **Biome** - Fast formatter and linter
- **TypeScript** - Type safety and IntelliSense
- **ESLint** - Code quality checks (optional)

## Contributing

1. Make changes to the SDK source code
2. Run `npm run generate-docs` to update documentation
3. Test the generated docs with `npm run dev`
4. Build and deploy with `npm run build`

## License

MIT License - see the main project repository for details.