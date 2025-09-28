import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Storyblok SDK Documentation',
  description: 'Comprehensive documentation for the Storyblok TypeScript SDK',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  Storyblok SDK
                </h1>
                <span className="ml-2 text-sm text-gray-500">
                  Documentation
                </span>
              </div>
              <nav className="flex space-x-8">
                <a
                  href="/docs"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Documentation
                </a>
                <a
                  href="/typedoc"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  API Reference
                </a>
                <a
                  href="https://github.com/virginmediao2/storyblok-sdk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  GitHub
                </a>
              </nav>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-gray-800 text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-gray-300">
                Storyblok SDK Documentation - Auto-generated from TypeScript
                source
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
