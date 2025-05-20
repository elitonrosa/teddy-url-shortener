import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

const customFormat = winston.format.printf(
  ({ level, message, timestamp, context, trace, ...meta }) => {
    const requestId = meta.requestId || '';
    const method = meta.method || '';
    const url = meta.url || '';
    const statusCode = meta.statusCode || '';
    const responseTime = meta.responseTime || '';

    let logMessage = `${timestamp} [${level}] ${context ? `[${context}]` : ''} ${message}`;

    if (requestId || method || url) {
      logMessage += `\nRequest: ${method} ${url} ${statusCode} ${responseTime}ms`;
    }

    if (trace) {
      logMessage += `\nStack: ${trace}`;
    }

    return logMessage;
  },
);

export const loggerConfig: WinstonModuleOptions = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.ms(),
        winston.format.errors({ stack: true }),
        customFormat,
      ),
    }),
  ],
};
