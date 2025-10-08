import clsx from 'clsx';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  navigation: ReactNode;
  breadcrumbs: ReactNode;
}

const Layout = ({ children, navigation, breadcrumbs }: LayoutProps) => {
  return (
    <div
      className={clsx(
        'w-full max-w-6xl mx-auto',
        'gap-4 lg:gap-10',
        'flex flex-col md:flex-row',
      )}
    >
      <aside className="sm:min-w-[250px]">{navigation}</aside>
      <main className="flex-grow w-full">
        <div>{breadcrumbs}</div>
        <div>{children}</div>
      </main>
    </div>
  );
};

export default Layout;
