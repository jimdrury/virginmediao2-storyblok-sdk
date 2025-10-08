import { type FC, Suspense } from 'react';
import { NavBuilder } from './_components/nav-builder';
import { NavSkeleton } from './_components/nav-skeleton';

interface PageProps {
  params: Promise<{ page: string[] }>;
}
const Page: FC<PageProps> = ({ params }) => (
  <div className=" bg-base-200 shadow-sm rounded-lg">
    <Suspense fallback={<NavSkeleton />}>
      <NavBuilder params={params} />
    </Suspense>
  </div>
);

export default Page;
