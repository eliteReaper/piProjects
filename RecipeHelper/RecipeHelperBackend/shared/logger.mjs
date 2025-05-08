import winston from 'winston';
import format from 'winston';

const logger = winston.createLogger({
    level: 'debug',
    format: format.format.combine(
        format.format.timestamp(),
        format.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.format.errors({ stack: true }),
        format.format.splat(),
        format.format.json()
    ),
    defaultMeta: { service: 'RecipeHelper' },
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log', level: 'debug' }),
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: 'exceptions.log' })
    ],
    exitOnError: false
});

export { logger }