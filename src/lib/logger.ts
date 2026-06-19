import pino from "pino";

const isDev = process.env.NODE_ENV === "development";

const logger = pino({
  level: process.env.LOG_LEVEL ?? (isDev ? "debug" : "info"),
  ...(isDev
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
          },
        },
      }
    : {}),
  base: { service: "portal-pwa" },
});

export const log = {
  info: (msg: string, data?: object) => logger.info(data ?? {}, msg),
  warn: (msg: string, data?: object) => logger.warn(data ?? {}, msg),
  error: (msg: string, error?: unknown, data?: object) => logger.error({ err: error, ...data }, msg),
  debug: (msg: string, data?: object) => logger.debug(data ?? {}, msg),
};

export default logger;
