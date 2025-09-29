import type { FC, ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  navigation: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children, navigation }) => (
  <div className="px-2 py-4 md:px-6 md:py-6">
    <div className="container mx-auto gap-4 lg:gap-6 flex flex-col-reverse lg:flex-row">
      <div className="lg:w-1/3 xl:w-1/4">{navigation}</div>
      <div className="lg:w-2/3 xl:w-3/4">{children}</div>
    </div>
  </div>
);

export default Layout;
