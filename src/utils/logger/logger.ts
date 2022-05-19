import chalk from 'chalk';
import util from 'node:util';
import winston, { format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

interface LoggerOptions {
    fileNameBase: string;
}

const { printf } = format;

const createCustomFormat = ({ colors }: { colors: boolean }) => {
    const customFormatting = printf(({ timestamp, level, message }) => {
        if (typeof timestamp !== 'string') {
            throw new TypeError('Timestamp is not a string.');
        }

        const hoursOnly = timestamp.replace(/.*T/, '').replace('Z', '');

        let formatted =
            typeof message === 'string'
                ? message
                : util.formatWithOptions(
                      {
                          colors,
                          depth: 3,
                          maxStringLength: 10_000,
                      },
                      message,
                  );

        const hasNewlines = /\n/.test(formatted);
        if (hasNewlines) formatted = '-> ... \n' + formatted;

        if (colors) {
            if (level === 'error') {
                return `[${chalk.red.bold(level)}] (${chalk.gray(
                    hoursOnly,
                )}) -> ${formatted}`;
            } else if (level === 'warn') {
                return `[${chalk.yellow.bold(level)}] (${chalk.gray(
                    hoursOnly,
                )}) -> ${formatted}`;
            } else {
                return `[${chalk.green.bold(level)}] (${chalk.gray(
                    hoursOnly,
                )}) -> ${formatted}`;
            }
        }

        return `[${level}] ${hoursOnly} ${formatted}`;
    });

    return format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD[T]HH:mm:ss.S[Z]',
        }),
        customFormatting,
    );
};

export const makeWinstonLogger = (options?: LoggerOptions) => {
    const fileNameSuffix = '%DATE%.log';
    const fileNameBase = options?.fileNameBase || 'bot';

    const rotatingCombinedFileTransport = new DailyRotateFile({
        dirname: 'logs/combined',
        filename: `${fileNameBase}-${fileNameSuffix}`,
        format: createCustomFormat({ colors: false }),
    });

    const rotatingErrorFileTransport = new DailyRotateFile({
        dirname: 'logs/errors',
        filename: `err-${fileNameBase}-${fileNameSuffix}`,
        format: createCustomFormat({ colors: false }),
        level: 'error',
    });

    const logger = winston.createLogger({
        transports: [rotatingCombinedFileTransport, rotatingErrorFileTransport],
    });

    if (process.env.NODE_ENV !== 'production') {
        logger.add(
            new winston.transports.Console({
                format: createCustomFormat({ colors: true }),
            }),
        );
    }

    return logger;
};
