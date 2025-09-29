import localFont from 'next/font/local';
import type { FC, ReactNode } from 'react';
import './globals.css';

import type { Metadata } from 'next';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

export const metadata: Metadata = {
  title: {
    template: '%s - Storyblok SDK - Virgin Media O2',
    default: 'Storyblok SDK - Virgin Media O2',
  },
};

const onAir = localFont({
  src: [
    { path: '../fonts/onairvar.woff2' },
    { path: '../fonts/onairvar.woff' },
    { path: '../fonts/onairvar.ttf' },
  ],
  variable: '--font-sans',
});

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body className={`${onAir.className} flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
