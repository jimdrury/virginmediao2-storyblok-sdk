import clsx from 'clsx';
import type { FC, ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  navigation: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children, navigation }) => (
  <>
    <div className="px-2 py-8 md:px-6 md:py-10">
      <div
        className={clsx(
          'container mx-auto ',
          'flex flex-col-reverse lg:flex-row',
          'gap-4 lg:gap-10',
        )}
      >
        <div className="lg:w-1/3 xl:w-1/5">{navigation}</div>
        <div className="w-auto">{children}</div>
        <div className="none xl:block xl:w-1/5" />
      </div>
    </div>
  </>
);

export default Layout;
