/**
 * AppBar Component - Glassmorphism design, positioned on the right
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GLASSMORPHISM, SPACING, TYPOGRAPHY, COLORS } from '@/src/utils/theme';

export default function AppBar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className={`${GLASSMORPHISM.bg} ${GLASSMORPHISM.blur} ${GLASSMORPHISM.rounded} ${GLASSMORPHISM.border} ${GLASSMORPHISM.shadow} ${SPACING.sm}`}>
      <div className={`flex items-center justify-between ${SPACING.gapMd}`}>
        <div className={`flex flex-wrap ${SPACING.gapXs}`}>
          <Link
            href="/"
            className={`px-3 sm:px-4 py-2 sm:py-2.5 ${GLASSMORPHISM.roundedSmall} font-medium ${TYPOGRAPHY.bodySm} ${GLASSMORPHISM.transition} ${GLASSMORPHISM.blurLight} ${GLASSMORPHISM.borderLight} ${
              isActive('/')
                ? `${GLASSMORPHISM.bgActive} ${COLORS.textPrimary} ${GLASSMORPHISM.borderMedium} ${GLASSMORPHISM.shadowMd}`
                : `${GLASSMORPHISM.bgLight} ${COLORS.textTertiary} ${GLASSMORPHISM.bgHover}`
            }`}
          >
            Home
          </Link>
          <Link
            href="/map"
            className={`px-3 sm:px-4 py-2 sm:py-2.5 ${GLASSMORPHISM.roundedSmall} font-medium ${TYPOGRAPHY.bodySmall} ${GLASSMORPHISM.transition} ${GLASSMORPHISM.blurLight} ${GLASSMORPHISM.borderLight} ${
              isActive('/map')
                ? `${GLASSMORPHISM.bgHeavy} ${COLORS.textPrimary} ${GLASSMORPHISM.borderActive} ${GLASSMORPHISM.shadowLight}`
                : `${GLASSMORPHISM.bgLight} ${COLORS.textSecondary} ${GLASSMORPHISM.bgHover}`
            }`}
          >
            Map
          </Link>
        </div>
        <Link
          href="/settings"
          className={`p-2 sm:p-3 ${GLASSMORPHISM.roundedSmall} ${GLASSMORPHISM.transition} ${GLASSMORPHISM.blurLight} ${GLASSMORPHISM.borderLight} ${
            isActive('/settings')
              ? `${GLASSMORPHISM.bgHeavy} ${COLORS.textPrimary} ${GLASSMORPHISM.borderActive} ${GLASSMORPHISM.shadowLight}`
              : `${GLASSMORPHISM.bgLight} ${COLORS.textSecondary} ${GLASSMORPHISM.bgHover}`
          }`}
          aria-label="Settings"
          title="Settings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

