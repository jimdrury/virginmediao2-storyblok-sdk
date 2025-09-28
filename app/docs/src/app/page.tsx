import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Storyblok SDK Documentation
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A comprehensive TypeScript SDK for Storyblok CMS with Next.js
            compatibility. Auto-generated documentation from source code with
            full type safety.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/docs"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View Documentation
            </Link>
            <a
              href="https://github.com/virginmediao2/storyblok-sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              🚀 Content Delivery
            </h3>
            <p className="text-gray-600">
              Access published and draft content with full TypeScript support
              and automatic pagination.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              ⚙️ Management API
            </h3>
            <p className="text-gray-600">
              Create, update, and manage content with comprehensive management
              operations.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              🔧 Auto-Generated Docs
            </h3>
            <p className="text-gray-600">
              Documentation automatically generated from TypeScript source code
              with JSDoc comments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
