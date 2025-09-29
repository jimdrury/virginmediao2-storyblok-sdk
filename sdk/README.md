# @virginmediao2/storyblok-sdk

A modern TypeScript SDK for Storyblok CMS with Next.js compatibility, providing content delivery API access with flexible middleware support.

## Features

- 🔥 **TypeScript-first** - Fully typed with generic support
- 📦 **Content Delivery SDK** - Optimized for fetching published content
- 🛡️ **Axios-powered** - Built on axios with full middleware support
- 🔧 **Customizable** - Extensive configuration options
- 📖 **Well-documented** - Comprehensive TypeScript interfaces and JSDoc comments

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

// Recommended: Use the comprehensive middleware pattern
import { storyblokCdnAuth, storyblokRelationsResolver, storyblokBasePath } from "@virginmediao2/storyblok-sdk";
import axiosRetry from 'axios-retry';
import curlirize from 'axios-curlirize';

const resolveRelations = [
  'blog_post.author',
  'page.featured_story',
  'card.link'
];

export const storyblokSdk = new StoryblokSdk({
  accessToken: "your-preview-token",
  middlewares: [
    (i) => axiosRetry(i, { retries: 3 }),
    curlirize,
    storyblokCdnAuth({ accessToken: "your-preview-token" }),
    storyblokRelationsResolver({
      resolveRelations,
      removeUnresolvedRelations: false,
    }),
  ],
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

### CDN Authentication Middleware

For custom authentication with your own axios instances:

```typescript
import axios from "axios";
import { storyblokCdnAuth } from "@virginmediao2/storyblok-sdk";

// Create your own axios instance
const customAxios = axios.create({ 
  baseURL: "https://api.storyblok.com/v2/cdn" 
});

// Create the auth middleware with your config
const authMiddleware = storyblokCdnAuth({
  accessToken: "your-access-token"
});

// Apply the middleware to your axios instance
authMiddleware(customAxios);

// Now all requests will automatically include the token
const response = await customAxios.get("/stories");
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

### Middleware

The SDK provides a comprehensive middleware system for extending functionality. See the [Middleware System](#middleware-system) section for complete documentation.

#### Quick Reference

```typescript
import { storyblokCdnAuth, storyblokRelationsResolver, storyblokBasePath } from "@virginmediao2/storyblok-sdk";

// CDN Authentication (applied automatically)
const sdk = new StoryblokSdk({
  accessToken: "your-token" // CDN auth middleware applied automatically
});

// Relations Resolver
const relationsMiddleware = storyblokRelationsResolver({
  resolveRelations: ['blog_post.author', 'page.featured_story']
});

// Custom middleware
const customMiddleware = (axiosInstance: AxiosInstance) => {
  // Your custom logic here
};
```

**Available Middlewares:**
- ✅ **CDN Authentication** - Automatic token injection
- ✅ **Relations Resolver** - Automatic relation resolution
- ✅ **Custom Middlewares** - Extend with your own logic

## Rate Limiting & Exponential Backoff

The SDK includes **built-in exponential backoff** for 429 (rate limit) errors by default:

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

## Middleware System

The SDK includes a powerful middleware system that allows you to extend and customize the behavior of axios instances. Middlewares are applied automatically to the SDK's internal axios instance, and you can also use them with your own custom axios instances.

### Built-in Middlewares

The SDK automatically applies essential middlewares to handle authentication and other core functionality:

#### 1. CDN Authentication Middleware (`storyblokCdnAuth`)

Automatically adds the access token to all requests as a query parameter.

```typescript
import { storyblokCdnAuth } from "@virginmediao2/storyblok-sdk";

// Applied automatically in the SDK constructor
const sdk = new StoryblokSdk({
  accessToken: "your-access-token" // This middleware is applied automatically
});

// Or use with your own axios instance
const customAxios = axios.create({ baseURL: "https://api.storyblok.com/v2/cdn" });
const authMiddleware = storyblokCdnAuth({
  accessToken: "your-access-token"
});
authMiddleware(customAxios);
```

**Features:**
- ✅ **Automatic token injection** - Adds `token` parameter to all requests
- ✅ **Non-destructive** - Won't override existing token parameters
- ✅ **Request interceptor** - Works seamlessly with axios interceptors
- ✅ **TypeScript support** - Fully typed configuration

#### 2. Relations Resolver Middleware (`storyblokRelationsResolver`)

Automatically resolves Storyblok relations in your content, converting UUID references to full story objects.

```typescript
import { storyblokRelationsResolver } from "@virginmediao2/storyblok-sdk";

// Configure which relations to resolve
const relationsMiddleware = storyblokRelationsResolver({
  resolveRelations: [
    'blog_post.author',           // Resolve author field in blog_post component
    'page.featured_story',        // Resolve featured_story field in page component
    'card.link'                   // Resolve link field in card component
  ],
  removeUnresolvedRelations: false // Keep unresolved relations as UUIDs (default: false)
});

// Apply to your axios instance
relationsMiddleware(customAxios);

// Now when you fetch stories, relations will be automatically resolved
const response = await customAxios.get('/stories');
// response.data.story.content.author will be a full story object instead of a UUID
```

**Features:**
- ✅ **Automatic relation resolution** - Converts UUIDs to full story objects
- ✅ **Configurable fields** - Specify which component fields to resolve
- ✅ **Nested support** - Works with deeply nested content structures
- ✅ **Array support** - Handles both single relations and relation arrays
- ✅ **Unresolved handling** - Option to remove or keep unresolved relations
- ✅ **Performance optimized** - Only processes Storyblok CDN API responses

**Configuration Options:**

```typescript
interface StoryblokRelationsResolverConfig {
  resolveRelations: `${string}.${string}`[]; // Array of "component.field" patterns
  removeUnresolvedRelations?: boolean;      // Remove unresolved relations (default: false)
}
```

**Example Usage:**

```typescript
// Basic setup
const relationsMiddleware = storyblokRelationsResolver({
  resolveRelations: ['blog_post.author', 'page.featured_story']
});

// Advanced setup with cleanup
const advancedRelationsMiddleware = storyblokRelationsResolver({
  resolveRelations: [
    'blog_post.author',
    'blog_post.featured_image',
    'page.hero_section',
    'card.link'
  ],
  removeUnresolvedRelations: true // Remove broken relations
});

// Apply to SDK
const sdk = new StoryblokSdk({
  accessToken: "your-token",
  middlewares: [relationsMiddleware]
});
```

#### 3. Base Path Middleware (`storyblokBasePath`)

Automatically appends a `starts_with` query parameter to Stories and GetLinks API calls with a preconfigured base path.

```typescript
import { storyblokBasePath } from "@virginmediao2/storyblok-sdk";

// Configure the base path for automatic starts_with filtering
const basePathMiddleware = storyblokBasePath({
  basePath: "blog/"  // Will automatically add starts_with=blog/ to Stories and Links API calls
});

// Apply to your axios instance
basePathMiddleware(customAxios);

// Now all Stories and Links API calls will automatically include starts_with=blog/
const stories = await customAxios.get('/stories'); // Automatically becomes /stories?starts_with=blog/
const links = await customAxios.get('/links');     // Automatically becomes /links?starts_with=blog/
```

**Features:**
- ✅ **Automatic path filtering** - Adds `starts_with` parameter to Stories and GetLinks APIs
- ✅ **Non-destructive** - Won't override existing `starts_with` parameters
- ✅ **Selective application** - Only affects Stories and GetLinks endpoints
- ✅ **TypeScript support** - Fully typed configuration

**Use Cases:**
- Filter all content to a specific section (e.g., blog posts only)
- Organize content by path structure
- Simplify API calls by removing repetitive `starts_with` parameters

```typescript
// Without middleware - repetitive starts_with parameters
const blogStories = await sdk.getStories({ starts_with: 'blog/' });
const blogLinks = await sdk.getLinks({ starts_with: 'blog/' });

// With middleware - automatic starts_with filtering
const sdk = new StoryblokSdk({
  accessToken: "your-token",
  middlewares: [
    storyblokBasePath({ basePath: 'blog/' })
  ]
});

const blogStories = await sdk.getStories(); // Automatically filtered to blog/
const blogLinks = await sdk.getLinks();     // Automatically filtered to blog/
```

### Custom Middleware

You can create and apply custom middlewares to extend the SDK's functionality:

```typescript
import { StoryblokSdk } from "@virginmediao2/storyblok-sdk";

// Custom logging middleware
const loggingMiddleware = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      console.log(`Making request to: ${config.url}`);
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      console.log(`Response received: ${response.status} ${response.statusText}`);
      return response;
    },
    (error) => Promise.reject(error)
  );
};

// Custom caching middleware
const cachingMiddleware = (axiosInstance: AxiosInstance) => {
  const cache = new Map();
  
  axiosInstance.interceptors.request.use(
    (config) => {
      const cacheKey = `${config.method}:${config.url}:${JSON.stringify(config.params)}`;
      
      if (cache.has(cacheKey)) {
        console.log('Cache hit!');
        return Promise.resolve({ data: cache.get(cacheKey), status: 200, statusText: 'OK', headers: {}, config });
      }
      
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      const cacheKey = `${response.config.method}:${response.config.url}:${JSON.stringify(response.config.params)}`;
      cache.set(cacheKey, response.data);
      return response;
    },
    (error) => Promise.reject(error)
  );
};

// Apply custom middlewares
const sdk = new StoryblokSdk({
  accessToken: "your-token",
  middlewares: [
    loggingMiddleware,
    cachingMiddleware
  ]
});
```

### Middleware with Custom Axios Instances

You can also use the built-in middlewares with your own axios instances:

```typescript
import axios from "axios";
import { storyblokCdnAuth, storyblokRelationsResolver, storyblokBasePath } from "@virginmediao2/storyblok-sdk";

// Create custom axios instance
const customAxios = axios.create({
  baseURL: "https://api.storyblok.com/v2/cdn",
  timeout: 15000
});

// Apply authentication middleware
const authMiddleware = storyblokCdnAuth({
  accessToken: "your-access-token"
});
authMiddleware(customAxios);

// Apply relations resolver middleware
const relationsMiddleware = storyblokRelationsResolver({
  resolveRelations: ['blog_post.author', 'page.featured_story']
});
relationsMiddleware(customAxios);

// Now your custom instance has the same functionality as the SDK
const response = await customAxios.get('/stories');
```

### Middleware Execution Order

Middlewares are applied in the order they are provided:

```typescript
const sdk = new StoryblokSdk({
  accessToken: "your-token",
  middlewares: [
    loggingMiddleware,        // 1. Applied first
    relationsMiddleware,      // 2. Applied second
    cachingMiddleware         // 3. Applied last
  ]
});
```

**Execution Flow:**
1. **Built-in middlewares** (CDN auth) are applied first
2. **Custom middlewares** are applied in the order specified
3. **Request interceptors** run in the order they were added
4. **Response interceptors** run in reverse order (last added, first executed)

### Advanced Middleware Patterns

#### Error Handling Middleware

```typescript
const errorHandlingMiddleware = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 404) {
        console.warn('Story not found:', error.config.url);
        return Promise.resolve({ 
          data: { story: null }, 
          status: 404, 
          statusText: 'Not Found',
          headers: {},
          config: error.config 
        });
      }
      
      if (error.response?.status === 429) {
        console.warn('Rate limited, retrying...');
        // Let the built-in retry middleware handle this
      }
      
      return Promise.reject(error);
    }
  );
};
```

#### Request Transformation Middleware

```typescript
const requestTransformMiddleware = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      // Add custom headers
      config.headers = {
        ...config.headers,
        'X-Custom-Header': 'my-value',
        'X-Request-ID': Math.random().toString(36).substr(2, 9)
      };
      
      // Transform request data
      if (config.data && typeof config.data === 'object') {
        config.data = {
          ...config.data,
          timestamp: new Date().toISOString()
        };
      }
      
      return config;
    },
    (error) => Promise.reject(error)
  );
};
```

#### Response Transformation Middleware

```typescript
const responseTransformMiddleware = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => {
      // Add custom metadata to responses
      response.data = {
        ...response.data,
        _metadata: {
          fetchedAt: new Date().toISOString(),
          requestId: response.config.headers['X-Request-ID']
        }
      };
      
      return response;
    },
    (error) => Promise.reject(error)
  );
};
```

### Best Practices

1. **Order matters**: Apply middlewares in the correct order for your use case
2. **Error handling**: Always handle errors in your middleware
3. **Performance**: Consider the performance impact of your middleware
4. **Testing**: Test your middleware in isolation
5. **Documentation**: Document your custom middleware behavior

```typescript
// Good: Well-documented middleware
const myMiddleware = (axiosInstance: AxiosInstance) => {
  /**
   * Custom middleware that adds request timing
   * - Adds start time to request config
   * - Logs request duration on response
   */
  axiosInstance.interceptors.request.use(
    (config) => {
      config.metadata = { startTime: Date.now() };
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      const duration = Date.now() - response.config.metadata.startTime;
      console.log(`Request to ${response.config.url} took ${duration}ms`);
      return response;
    },
    (error) => Promise.reject(error)
  );
};
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

You can add custom interceptors for other use cases:

```typescript
// Add custom request interceptor
sdk.axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Making request:", config);
    return config;
  },
  (error) => Promise.reject(error)
);

// Add custom response interceptor (runs after built-in retry)
sdk.axiosInstance.interceptors.response.use(
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
