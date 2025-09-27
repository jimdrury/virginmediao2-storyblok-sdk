# Contributing

We welcome contributions to the @virginmediao2/storyblok-sdk! Please follow these guidelines when contributing to the project.

## Development Setup

### Prerequisites

- Node.js (version 18 or higher)
- Yarn package manager

### Installation

```bash
# Install dependencies
yarn install
```

### Development Workflow

```bash
# Run tests
yarn test

# Run tests with coverage
yarn test --coverage

# Lint and format
yarn check --write

# Build the library
yarn build

# Type check
yarn type-check

# Validate commit message
yarn commitlint --from HEAD~1 --to HEAD
```

## Git Hooks

The project uses [lefthook](https://github.com/evilmartians/lefthook) for git hooks to ensure code quality:

**Pre-commit hooks:**
- ✅ **Lint-staged** - Runs Biome linting and formatting on staged files
- ✅ **Type-check** - Runs TypeScript type checking on changed files

**Commit-msg hooks:**
- ✅ **Commitlint** - Enforces conventional commit message format

**Pre-push hooks:**
- ✅ **Tests** - Runs all tests before pushing
- ✅ **Build** - Ensures the project builds successfully

## Conventional Commits

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for consistent commit messages:

```bash
# ✅ Good commit messages
git commit -m "feat: add getAllStories pagination method"
git commit -m "fix: resolve 429 retry logic issue"
git commit -m "docs: update API documentation"
git commit -m "test: add comprehensive SDK tests"
git commit -m "refactor: extract pagination utility"

# ❌ Bad commit messages (will be rejected)
git commit -m "update stuff"
git commit -m "Fix bug"
git commit -m "WIP"
```

**Supported types:**
- `feat` - New features
- `fix` - Bug fixes  
- `docs` - Documentation changes
- `style` - Code style changes
- `refactor` - Code refactoring
- `test` - Test changes
- `chore` - Maintenance tasks
- `perf` - Performance improvements
- `ci` - CI/CD changes
- `build` - Build system changes
- `revert` - Revert previous commit

## How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes (hooks will automatically run linting and formatting)
4. Commit your changes using conventional commits (`git commit -m 'feat: add amazing feature'`)
5. Push to the branch (hooks will run tests and build)
6. Open a Pull Request

## Code Quality Standards

- All code must pass linting and formatting checks
- TypeScript types must be properly defined
- Tests must be written for new functionality
- Code must build successfully
- Commit messages must follow conventional commit format

## Questions?

If you have any questions about contributing, please open an issue on GitHub or reach out to the maintainers.
