'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="mb-6 sm:mb-8">
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
        <Link
          href="/"
          className={`px-4 py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base transition-all backdrop-blur-sm border ${
            isActive('/')
              ? 'bg-white/20 text-white border-white/30'
              : 'bg-white/10 text-gray-200 hover:bg-white/20 border-white/20'
          }`}
        >
          Home
        </Link>
        <Link
          href="/map"
          className={`px-4 py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base transition-all backdrop-blur-sm border ${
            isActive('/map')
              ? 'bg-white/20 text-white border-white/30'
              : 'bg-white/10 text-gray-200 hover:bg-white/20 border-white/20'
          }`}
        >
          Weather Map
        </Link>
        <Link
          href="/settings"
          className={`px-4 py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base transition-all backdrop-blur-sm border ${
            isActive('/settings')
              ? 'bg-white/20 text-white border-white/30'
              : 'bg-white/10 text-gray-200 hover:bg-white/20 border-white/20'
          }`}
        >
          Settings
        </Link>
      </div>
    </nav>
  );
}

