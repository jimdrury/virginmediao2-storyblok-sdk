import Link from 'next/link';
import type { FC } from 'react';
import { FaHome } from 'react-icons/fa';
import { getAllLinksWithFolders } from '@/storyblok/utils/get-all-links';
import { buildBreadcrumbTrail } from './build-breadcrumb-trail';

interface BreadcrumbsProps {
  storyId: number;
}

export const Breadcrumbs: FC<BreadcrumbsProps> = async ({ storyId }) => {
  const links = await getAllLinksWithFolders();
  const breadcrumbs = buildBreadcrumbTrail(links, storyId);

  return (
    <div className="breadcrumbs text-sm pl-1">
      <ul>
        <li>
          <Link href="/" prefetch={false}>
            <FaHome className="w-4 h-4" />
          </Link>
        </li>
        {breadcrumbs.map((link, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={link.id}>
              {isLast ? (
                <span
                  aria-current="page"
                  className="font-semibold hover:no-underline! cursor-default!"
                >
                  {link.name}
                </span>
              ) : (
                <Link href={link.real_path} prefetch={false}>
                  {link.name}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
