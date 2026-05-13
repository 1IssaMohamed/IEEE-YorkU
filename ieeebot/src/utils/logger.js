/**
 * Simple structured logger.
 * Prefixes all output with timestamps and log level.
 * In production, this could be swapped for Winston/Pino.
 */

const timestamp = () => new Date().toISOString();

const logger = {
  info: (...args) => console.log(`[${timestamp()}] [INFO]`, ...args),
  warn: (...args) => console.warn(`[${timestamp()}] [WARN]`, ...args),
  error: (...args) => console.error(`[${timestamp()}] [ERROR]`, ...args),
  debug: (...args) => {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[${timestamp()}] [DEBUG]`, ...args);
    }
  },
};

export default logger;
