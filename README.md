# Storyblok SDK Monorepo

This repository contains the @virginmediao2/storyblok-sdk, a modern TypeScript SDK for Storyblok CMS with Next.js compatibility.

## Repository Structure

```
storyblok-sdk/
├── packages/
│   └── sdk/                 # Main SDK package
│       ├── src/            # Source code
│       ├── dist/           # Built files
│       └── README.md       # Package documentation
├── app/
│   └── docs/               # Documentation site
├── CONTRIBUTING.md         # Contribution guidelines
├── DEVELOPMENT.md          # Development setup and workflow
└── package.json            # Root package configuration
```

## Packages

### @virginmediao2/storyblok-sdk

The main SDK package providing both content delivery and management API access for Storyblok CMS.

**Key Features:**
- 🔥 **TypeScript-first** - Fully typed with generic support
- 🚀 **Next.js optimized** - Built specifically for Next.js applications
- 📦 **Two SDK classes** - Separate SDKs for content delivery and management
- 🛡️ **Axios-powered** - Built on axios with full middleware support
- 🔧 **Customizable** - Extensive configuration options
- 📖 **Well-documented** - Comprehensive TypeScript interfaces and JSDoc comments

For detailed usage, examples, and API reference, see the [SDK Documentation](packages/sdk/README.md).

## Documentation Site

The repository includes a Next.js documentation site in the `app/docs/` directory that provides:

- Interactive API documentation
- Live code examples
- TypeScript interface documentation
- Integration guides

## Development

For development setup, workflow, and project information, please see our [Development Guide](DEVELOPMENT.md).

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for detailed information on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## Support

- [GitHub Issues](https://github.com/virginmediao2/storyblok-sdk/issues)
- [Storyblok Documentation](https://www.storyblok.com/docs)