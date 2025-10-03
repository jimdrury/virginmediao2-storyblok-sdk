import Image from 'next/image';
import type { FC, ReactNode } from 'react';
import logo from '../../../public/virgin-media-o2-logo.svg';

interface HeaderProps {
  start?: ReactNode;
  end?: ReactNode;
}

export const Header: FC<HeaderProps> = ({ start, end }) => (
  <header className="shadow-md px-2 py-4 md:px-6 z-50 bg-white">
    <div className="grid grid-cols-[1fr_auto_1fr] items-center container mx-auto">
      <div className="flex justify-start">{start}</div>
      <div className="flex justify-center">
        <div className="flex items-center gap-2">
          <Image
            src={logo.src || '/virgin-media-o2-logo.svg'}
            width={logo.width || 200}
            height={logo.height || 40}
            alt="Virgin Media O2 Logo"
            className="h-10 w-auto"
            priority
          />
        </div>
      </div>
      <div className="flex justify-end">{end}</div>
    </div>
  </header>
);
