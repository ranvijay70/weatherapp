/**
 * Loading Spinner Component
 */

import { COLORS } from '@/src/utils/theme';

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-8 sm:py-12 md:py-16">
      <div className={`animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:h-12 border-t-2 border-b-2 ${COLORS.textPrimary}`}></div>
    </div>
  );
}
