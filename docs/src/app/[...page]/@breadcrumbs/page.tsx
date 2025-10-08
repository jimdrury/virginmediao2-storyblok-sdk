import { type FC, Suspense } from 'react';
import { BreadcrumbsBuilder } from './_components/breadcrumbs-builder';
import { BreadcrumbsSkeleton } from './_components/breadcrumbs-skeleton';

interface PageProps {
  params: Promise<{ page: string[] }>;
}

const Page: FC<PageProps> = ({ params }) => (
  <div className="mb-4">
    <Suspense fallback={<BreadcrumbsSkeleton />}>
      <BreadcrumbsBuilder params={params} />
    </Suspense>
  </div>
);

export default Page;
