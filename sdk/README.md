# @virginmediao2/storyblok-sdk

A modern TypeScript SDK for Storyblok CMS with Next.js compatibility, providing both content delivery and management API access.

## Features

- 🔥 **TypeScript-first** - Fully typed with generic support
- 🚀 **Next.js optimized** - Built specifically for Next.js applications
- 📦 **Two SDK classes** - Separate SDKs for content delivery and management
- 🛡️ **Axios-powered** - Built on axios with full middleware support
- 🔧 **Customizable** - Extensive configuration options
- 📖 **Well-documented** - Comprehensive TypeScript interfaces and JSDoc comments
- 🧹 **Code Quality** - Biome for fast linting, formatting, and import sorting
- 🧪 **Thoroughly Tested** - 70 tests with high coverage
- 📁 **Clean Architecture** - Kebab-case file naming and modular structure
- ⚡ **Modern Tooling** - Vite for fast builds, Vitest for testing
- 📝 **Conventional Commits** - Enforced commit message standards
- 🪝 **Git Hooks** - Automated quality checks with lefthook

## Installation

```bash
npm install @virginmediao2/storyblok-sdk axios
# or
yarn add @virginmediao2/storyblok-sdk axios
```

## Quick Start

Get up and running with the @virginmediao2/storyblok-sdk in minutes.

### Content Delivery SDK

For fetching published content:

```typescript
import { StoryblokSdk } from "@virginmediao2/storyblok-sdk";

const sdk = new StoryblokSdk({
  accessToken: "your-preview-token",
});

// Get all stories - returns full axios response
const response = await sdk.getStories();
const stories = response.data.stories;
console.log('Status:', response.status);
console.log('Headers:', response.headers);

// Get stories with filtering
const blogResponse = await sdk.getStories({
  starts_with: "blog/",
  filter_query: {
    component: { is: "blog_post" },
    published: { is: true },
    created_at: { gte: "2024-01-01" },
    tags: { in_array: "featured" }
  }
});

// Get a specific story with type safety
interface BlogPost {
  title: string;
  content: string;
  author: string;
}

const storyResponse = await sdk.getStory<BlogPost>("blog/my-first-post");
const story = storyResponse.data.story;

// Get ALL stories with automatic pagination
const allBlogPosts = await sdk.getAllStories<BlogPost>({
  starts_with: "blog/",
  filter_query: {
    component: { is: "blog_post" }
  }
}, {
  perPage: 100, // Optional: items per page (max 100)
  maxPages: 5,  // Optional: limit to 5 pages
  onProgress: (page, fetched, total) => {
    console.log(`Page ${page}: ${fetched}/${total || '?'} stories fetched`);
  }
});

// allBlogPosts is now a simplified array of { id, name, slug, full_slug, content }
console.log(`Fetched ${allBlogPosts.length} blog posts total`);
```

### Management SDK

For content management operations:

```typescript
import { StoryblokManagerSdk } from "@virginmediao2/storyblok-sdk";

const managerSdk = new StoryblokManagerSdk({
  personalAccessToken: "your-management-token",
  // or use oauthToken: 'your-oauth-token'
});

// Get space information - returns full axios response
const spaceResponse = await managerSdk.getSpace();
const space = spaceResponse.data.space;
console.log('Rate limit remaining:', spaceResponse.headers['x-ratelimit-remaining']);

// Create a new story
const newStoryResponse = await managerSdk.createStory(spaceId, {
  name: "My New Story",
  slug: "my-new-story",
  content: {
    component: "page",
    title: "Hello World",
  },
});
const newStory = newStoryResponse.data.story;
```

## API Reference

### StoryblokSdk

The main SDK for content delivery API operations.

#### Constructor Options

```typescript
interface StoryblokSdkOptions {
  accessToken: string; // Required: Your Storyblok access token
  baseURL?: string; // Optional: Custom API base URL
  timeout?: number; // Optional: Request timeout (default: 10000ms)
  retry?: StoryblokRetryOptions; // Optional: Retry configuration for rate limiting
}
```

#### Methods

- `getStories<T>(params?)` - Get multiple stories with optional filtering
- `getAllStories<T>(params?, options?)` - Get all stories with automatic pagination
- `getStory<T>(slug, params?)` - Get a single story by slug
- `getStoriesByTag<T>(tag, params?)` - Get stories filtered by tag
- `getAllStoriesByTag<T>(tag, params?, options?)` - Get all stories by tag with pagination
- `getStoriesByPath<T>(path, params?)` - Get stories starting with a path
- `getAllStoriesByPath<T>(path, params?, options?)` - Get all stories by path with pagination
- `searchStories<T>(searchTerm, params?)` - Search stories by term
- `searchAllStories<T>(searchTerm, params?, options?)` - Search all stories with pagination
- `getTags(params?)` - Get tags with optional pagination
- `getAllTags(options?)` - Get all tags with automatic pagination
- `getLinks(params?)` - Get navigation links with optional pagination
- `getAllLinks(options?)` - Get all links with automatic pagination
- `getDatasourceEntries(datasource, params?)` - Get datasource entries with optional pagination
- `getAllDatasourceEntries(datasource, options?)` - Get all datasource entries with automatic pagination

#### getAll*() Methods - Automatic Pagination

All collection endpoints support automatic pagination with `getAll*()` methods that handle [Storyblok's pagination](https://www.storyblok.com/docs/api/content-delivery/v2/getting-started/pagination) automatically:

```typescript
// Basic usage - fetch all stories
const allStories = await sdk.getAllStories();

// With filtering and options
const allBlogPosts = await sdk.getAllStories<BlogPost>({
  starts_with: "blog/",
  filter_query: { component: { is: "blog_post" } }
}, {
  perPage: 50,      // Items per page (max 100, default 100)
  maxPages: 10,     // Maximum pages to fetch (default: unlimited)
  onProgress: (page, fetched, total) => {
    console.log(`Fetching page ${page}: ${fetched}/${total || '?'} stories`);
  }
});

// Returns simplified story objects: { id, name, slug, full_slug, content }

// Other getAll methods work similarly
const allTags = await sdk.getAllTags();
const allLinks = await sdk.getAllLinks();
const allDatasourceEntries = await sdk.getAllDatasourceEntries("my-datasource", {
  perPage: 1000, // Datasource entries support up to 1000 per page
});

// Convenience getAll methods with filtering
const allFeaturedPosts = await sdk.getAllStoriesByTag<BlogPost>("featured");
const allBlogPosts = await sdk.getAllStoriesByPath<BlogPost>("blog/");
const allNextjsPosts = await sdk.searchAllStories<BlogPost>("Next.js", {
  filter_query: { component: { is: "blog_post" } }
});
```

**Features:**

- ✅ **Automatic pagination** - Handles all pages automatically
- ✅ **Progress callbacks** - Real-time progress updates
- ✅ **Configurable page size** - Up to 100 items per page (1000 for datasource entries)
- ✅ **Safety limits** - Maximum page limits to prevent runaway requests
- ✅ **Efficient** - Uses Storyblok's `total` header for optimization
- ✅ **Consistent API** - Same options interface across all `getAll*()` methods

#### Filter Query Types

The SDK provides comprehensive typing for Storyblok's filter query syntax:

```typescript
interface StoryblokFilterOperators {
  is?: string | number | boolean;        // Exact match
  not_in?: string | number | boolean;    // Not equal
  in?: string;                           // In array (comma-separated)
  not_in_array?: string;                 // Not in array
  in_array?: string;                     // Contains (for arrays)
  all_in_array?: string;                 // All in array
  gt?: string | number;                  // Greater than
  gte?: string | number;                 // Greater than or equal
  lt?: string | number;                  // Less than
  lte?: string | number;                 // Less than or equal
  like?: string;                         // Partial match
  not_like?: string;                     // Not like
  regex?: string;                        // Regex match
}

// Usage examples:
const stories = await sdk.getStories({
  filter_query: {
    component: { is: "blog_post" },
    published: { is: true },
    created_at: { gte: "2024-01-01", lt: "2024-12-31" },
    tags: { in_array: "featured,trending" },
    title: { like: "Next.js" },
    author: { not_in: "draft-author" }
  }
});
```

- `request<T>(config)` - Make custom API requests

### StoryblokManagerSdk

The management SDK for content management API operations.

#### Constructor Options

```typescript
interface StoryblokManagerSdkOptions {
  personalAccessToken?: string; // Personal access token
  oauthToken?: string; // OAuth token (alternative to personal token)
  baseURL?: string; // Optional: Custom API base URL
  timeout?: number; // Optional: Request timeout
  retry?: StoryblokRetryOptions; // Optional: Retry configuration for rate limiting
}
```

#### Methods

**Space Management:**

- `getSpace()` - Get current space information

**Story Management:**

- `getStories<T>(spaceId, params?)` - Get stories (including drafts)
- `getStory<T>(spaceId, storyId)` - Get a single story
- `createStory<T>(spaceId, storyData)` - Create a new story
- `updateStory<T>(spaceId, storyId, storyData)` - Update an existing story
- `deleteStory(spaceId, storyId)` - Delete a story
- `publishStory<T>(spaceId, storyId)` - Publish a story
- `unpublishStory<T>(spaceId, storyId)` - Unpublish a story

**Component Management:**

- `getComponents(spaceId)` - Get all components
- `getComponent(spaceId, componentId)` - Get a single component
- `createComponent(spaceId, componentData)` - Create a new component
- `updateComponent(spaceId, componentId, componentData)` - Update a component
- `deleteComponent(spaceId, componentId)` - Delete a component

**Asset Management:**

- `getAssets(spaceId, params?)` - Get assets
- `uploadAsset(spaceId, file, filename, options?)` - Upload an asset
- `deleteAsset(spaceId, assetId)` - Delete an asset

## Rate Limiting & Exponential Backoff

Both SDKs include **built-in exponential backoff** for 429 (rate limit) errors by default:

```typescript
import { StoryblokSdk } from "@virginmediao2/storyblok-sdk";

// Retry is enabled by default with sensible defaults
const sdk = new StoryblokSdk({
  accessToken: "your-token",
});

// Customize retry behavior
const customSdk = new StoryblokSdk({
  accessToken: "your-token",
  retry: {
    baseDelay: 100,     // Start with 100ms delay (default: 50ms)
    maxDelay: 5000,     // Max delay of 5s (default: 2000ms)
  }
});
```

**Retry Behavior:**

- ✅ **Always enabled**: Automatically handles all 429 errors
- ✅ **Exponential backoff**: 50ms → 100ms → 200ms → 400ms → 800ms → 1600ms → 2000ms (max)
- ✅ **Jitter**: Random 10% variance to prevent thundering herd
- ✅ **Smart stopping**: Stops retrying when delay reaches maximum
- ✅ **Focused**: Only retries on 429 errors (rate limiting)

## Interceptor Utilities

The SDK provides reusable interceptor utilities that you can use with your own axios instances:

```typescript
import axios from "axios";
import { addRetryInterceptor, addAccessTokenInterceptor } from "@virginmediao2/storyblok-sdk";

// Create your own axios instance
const customAxios = axios.create({ baseURL: "https://api.storyblok.com/v2" });

// Add Storyblok interceptors manually
addAccessTokenInterceptor(customAxios, "your-access-token");
addRetryInterceptor(customAxios, {
  baseDelay: 100,
  maxDelay: 5000
});

// Now your custom instance has the same retry behavior as the SDK
```

## Utility Functions

The SDK also exports utility functions for advanced use cases:

```typescript
import { fetchAllPaginated, type PaginationOptions } from "@virginmediao2/storyblok-sdk";

// Use the pagination utility with any API
const allItems = await fetchAllPaginated(
  (page, perPage) => customAxios.get(`/custom-endpoint?page=${page}&per_page=${perPage}`),
  (response) => response.items, // Extract items from response
  {
    perPage: 50,
    maxPages: 10,
    onProgress: (page, fetched, total) => console.log(`Page ${page}: ${fetched}/${total}`)
  }
);
```

## Custom Axios Middleware

You can still add custom interceptors for other use cases:

```typescript
// Add custom request interceptor
sdk.interceptors.request.use(
  (config) => {
    console.log("Making request:", config);
    return config;
  },
  (error) => Promise.reject(error)
);

// Add custom response interceptor (runs after built-in retry)
sdk.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status);
    return response;
  },
  (error) => Promise.reject(error)
);
```

## Next.js Integration

### App Router (Recommended)

```typescript
// app/lib/storyblok.ts
import { StoryblokSdk } from "@virginmediao2/storyblok-sdk";

export const storyblok = new StoryblokSdk({
  accessToken: process.env.STORYBLOK_ACCESS_TOKEN!,
});

// app/blog/[slug]/page.tsx
import { storyblok } from "@/lib/storyblok";

interface BlogPost {
  title: string;
  content: string;
  publishedAt: string;
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const response = await storyblok.getStory<BlogPost>(`blog/${params.slug}`);
  const story = response.data.story;

  return (
    <article>
      <h1>{story.content.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: story.content.content }} />
    </article>
  );
}
```

### Pages Router

```typescript
// lib/storyblok.ts
import { StoryblokSdk } from "@virginmediao2/storyblok-sdk";

export const storyblok = new StoryblokSdk({
  accessToken: process.env.STORYBLOK_ACCESS_TOKEN!,
});

// pages/blog/[slug].tsx
import { GetStaticProps, GetStaticPaths } from "next";
import { storyblok } from "@/lib/storyblok";

interface BlogPost {
  title: string;
  content: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await storyblok.getStoriesByPath("blog/");
  const stories = response.data.stories;

  const paths = stories.map((story) => ({
    params: { slug: story.slug },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const response = await storyblok.getStory<BlogPost>(`blog/${params!.slug}`);

  return {
    props: {
      story: response.data.story,
    },
  };
};
```

## TypeScript Support

The SDK is built with TypeScript-first approach and provides excellent type safety:

```typescript
import { StoryblokSdk, StoryblokStory } from "@virginmediao2/storyblok-sdk";

// Define your content types
interface PageContent {
  title: string;
  body: string;
  seo: {
    title: string;
    description: string;
  };
}

interface BlogContent {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  tags: string[];
}

const sdk = new StoryblokSdk({ accessToken: "token" });

// Type-safe story fetching
const pageResponse = await sdk.getStory<PageContent>("about");
const page = pageResponse.data.story;

const blogResponse = await sdk.getStoriesByPath<BlogContent>("blog/");
const blogPosts = blogResponse.data.stories;

// TypeScript will enforce the correct content structure
console.log(page.content.title); // ✅ string
console.log(page.content.invalidField); // ❌ TypeScript error

// Access response metadata
console.log(pageResponse.status); // ✅ number
console.log(pageResponse.headers); // ✅ axios headers
```

## Error Handling

The SDK provides consistent error handling:

```typescript
import { StoryblokError } from "@virginmediao2/storyblok-sdk";

try {
  const response = await sdk.getStory("non-existent-story");
  const story = response.data.story;
} catch (error) {
  if (error.response) {
    console.log("Status:", error.response.status);
    console.log("Message:", error.response.data?.message);
    console.log("Headers:", error.response.headers);
  } else {
    console.log("Network error:", error.message);
  }
}
```
