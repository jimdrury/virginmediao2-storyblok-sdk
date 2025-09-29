# Documentation Preview System

This repository uses GitHub Pages to host documentation with automatic preview links for pull requests.

## 🌐 URLs Structure

### Main Documentation
- **Production**: `https://virginmediao2.github.io/storyblok-sdk/`
- **Source**: Main branch deployments

### Preview Documentation
- **PR Previews**: `https://virginmediao2.github.io/storyblok-sdk/preview/PR-{number}/`
- **Example**: `https://virginmediao2.github.io/storyblok-sdk/preview/PR-123/`

## 🚀 How It Works

### 1. **Main Branch (Production)**
- Pushes to `main` branch trigger GitHub Pages deployment
- Documentation is deployed to the root URL
- Uses the official GitHub Pages deployment action

### 2. **Pull Request Previews**
- PRs affecting docs/SDK files trigger preview builds
- Each PR gets its own preview URL under `/preview/PR-{number}/`
- Preview URLs are automatically commented on PRs
- Previews are updated when new commits are pushed to the PR

### 3. **File Structure on GitHub Pages**
```
/
├── index.html                    # Main docs
├── typedoc/                      # SDK documentation
├── _next/                        # Next.js assets
└── preview/
    ├── PR-123/                   # PR #123 preview
    │   ├── index.html
    │   ├── typedoc/
    │   └── _next/
    └── PR-456/                   # PR #456 preview
        ├── index.html
        ├── typedoc/
        └── _next/
```

## 🔧 Workflow Files

- **`.github/workflows/pages.yml`** - Main documentation deployment
- **`.github/workflows/preview.yml`** - PR preview deployments
- **`.github/workflows/ci.yml`** - Core CI tasks
- **`.github/workflows/library.yml`** - SDK-specific CI

## 📝 Features

- ✅ **Automatic Previews**: Every PR gets a live preview URL
- ✅ **Real-time Updates**: Previews update on new commits
- ✅ **Clean URLs**: Organized preview structure
- ✅ **Automatic Cleanup**: Old previews are cleaned up automatically
- ✅ **PR Comments**: Automatic comments with preview links
- ✅ **Build Status**: Clear feedback on documentation builds

## 🛠️ Setup Requirements

1. **Enable GitHub Pages** in repository settings:
   - Go to Settings → Pages
   - Source: "GitHub Actions"
   - This creates the `github-pages` environment

2. **Repository Permissions**:
   - Contents: Read (for checking out code)
   - Pages: Write (for deploying)
   - Pull Requests: Write (for commenting)

## 🎯 Usage

### For Contributors
1. Create a PR affecting docs or SDK files
2. Wait for the preview workflow to complete
3. Check the PR comments for the preview URL
4. Click the preview link to see your changes live

### For Maintainers
1. Review PRs using the preview URLs
2. Merge to main branch to deploy to production
3. Production documentation updates automatically

## 🔍 Troubleshooting

### Preview Not Working
- Check if the PR affects docs/SDK files
- Verify GitHub Pages is enabled
- Check workflow permissions

### Build Failures
- Review the Actions tab for error details
- Ensure all dependencies are properly configured
- Check for linting or build errors

### Missing Preview URLs
- Ensure the preview workflow completed successfully
- Check PR comments for the preview link
- Verify the workflow has proper permissions
