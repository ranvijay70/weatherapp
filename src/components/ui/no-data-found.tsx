/**
 * No Data Found Component
 */

import { COLORS, TYPOGRAPHY } from '@/src/utils/theme';

interface NoDataFoundProps {
  displayMessage: string;
  className?: string;
}

export default function NoDataFound({ displayMessage, className = '' }: NoDataFoundProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 px-4 sm:px-6 ${className}`}>
      <div className="text-center max-w-md">
        <svg
          className={`mx-auto h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 ${COLORS.textTertiary} mb-3 sm:mb-4`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
          />
        </svg>
        <p className={`${TYPOGRAPHY.body} font-medium ${COLORS.textSecondary} mb-2 sm:mb-3 px-2`}>{displayMessage}</p>
        <p className={`${TYPOGRAPHY.bodySmall} ${COLORS.textTertiary} px-2`}>Please try searching for a different location</p>
      </div>
    </div>
  );
}

