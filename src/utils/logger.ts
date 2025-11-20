/**
 * Lightweight logging utility to centralize console usage.
 * Info/warn logs are suppressed in production builds to keep output clean,
 * while errors always print to aid debugging.
 */
const isProduction = process.env.NODE_ENV === 'production';

type LogArgs = unknown[];

const logInfo = (...args: LogArgs) => {
  if (!isProduction) {
    console.log(...args);
  }
};

const logWarn = (...args: LogArgs) => {
  if (!isProduction) {
    console.warn(...args);
  }
};

const logError = (...args: LogArgs) => {
  console.error(...args);
};

export const logger = {
  info: logInfo,
  warn: logWarn,
  error: logError,
};

export type Logger = typeof logger;

