'use client';

import { useEffect } from 'react';
import { logger } from '@/src/utils/logger';
import { COLORS, TYPOGRAPHY, LAYOUT, GLASSMORPHISM } from '@/src/utils/theme';
import AppBar from '@/src/components/layout/AppBar.view';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    logger.error('Uncaught application error:', error);
  }, [error]);

  return (
    <html>
      <body className={`min-h-screen ${COLORS.bgGradient} ${LAYOUT.containerPadding}`}>
        <div className={`${LAYOUT.containerMaxWidth} mx-auto flex flex-col gap-8`}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
            <h1 className={`${TYPOGRAPHY.heading1} ${COLORS.textPrimary}`}>Something went wrong</h1>
            <div className="w-full sm:w-auto">
              <AppBar />
            </div>
          </div>

          <div className={`${GLASSMORPHISM.bgLight} ${GLASSMORPHISM.blur} ${GLASSMORPHISM.borderMedium} ${GLASSMORPHISM.shadow} ${GLASSMORPHISM.roundedLarge} p-6 sm:p-8 flex flex-col gap-4`}>
            <p className={`${TYPOGRAPHY.body} ${COLORS.textSecondary}`}>
              We hit an unexpected error. You can try again or head back to the home page.
            </p>
            {error?.message && (
              <pre className={`${GLASSMORPHISM.bgMedium} ${GLASSMORPHISM.roundedSmall} p-4 text-sm overflow-auto`}>
                {error.message}
              </pre>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => reset()}
                className={`px-5 py-3 ${GLASSMORPHISM.bgLight} ${GLASSMORPHISM.bgHover} ${GLASSMORPHISM.roundedFull} ${TYPOGRAPHY.body} ${GLASSMORPHISM.transitionFast}`}
              >
                Try Again
              </button>
              <a
                href="/"
                className={`px-5 py-3 text-center ${GLASSMORPHISM.bgMedium} ${GLASSMORPHISM.bgHover} ${GLASSMORPHISM.roundedFull} ${TYPOGRAPHY.body} ${GLASSMORPHISM.transitionFast}`}
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

