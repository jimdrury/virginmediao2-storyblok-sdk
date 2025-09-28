# Development

This document contains information for developers working on the @virginmediao2/storyblok-sdk project.

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

## Development Workflow

```bash
# Install dependencies
yarn install

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

## Project Structure

The project is organized as a monorepo with the following structure:

```
storyblok-sdk/
├── sdk/                    # Main SDK package
│   ├── src/               # Source code
│   ├── dist/              # Built files
│   └── package.json       # Package configuration
├── docs/                  # Documentation site
└── package.json           # Root package configuration
```

## Code Quality Standards

- All code must pass linting and formatting checks using Biome
- TypeScript types must be properly defined
- Tests must be written for new functionality
- Code must build successfully
- Commit messages must follow conventional commit format

## Testing

The project uses Vitest for testing with comprehensive coverage:

```bash
# Run all tests
yarn test

# Run tests with coverage report
yarn test --coverage

# Run tests in watch mode
yarn test --watch
```

## Building

The project uses Vite for fast builds:

```bash
# Build the library
yarn build

# Build in watch mode
yarn build --watch
```

## Documentation

Documentation is generated using TypeDoc and served via a Next.js application:

```bash
# Generate documentation
yarn docs:build

# Serve documentation locally
yarn docs:dev
```
