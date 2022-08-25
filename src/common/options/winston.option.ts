import * as winston from 'winston';
import { WinstonModuleAsyncOptions } from 'nest-winston';
import * as winstonDaily from 'winston-daily-rotate-file';
const logDir = 'logs';
const { colorize, splat, combine, timestamp, prettyPrint, printf, label, ms } =
  winston.format;
const logFormat = printf((info) => {
  //   console.log(info);
  return `${'\x1B[32m[' + info.label + ']\x1B[39m'} - ${info.timestamp}    ${
    info.level === 'info'
      ? '\x1B[32m' + info.level.toUpperCase() + '\x1B[39m'
      : '\x1B[31m' + info.level.toUpperCase() + '\x1B[39m'
  } \x1B[33m ${info.context ? '[' + info.context + ']' : ''}\x1B[39m \x1B[33m ${
    info.stack ? '[' + info.stack + ']' : ''
  }\x1B[39m ${info.message} \x1B[33m${info.ms}\x1B[39m`;
});

const fileFormat = printf((info) => {
  return `[${info.label}] - ${info.timestamp}   ${info.level.toUpperCase()}  ${
    info.context ? '[' + info.context + ']' : ''
  }  ${info.stack ? '[' + info.stack + ']' : ''} ${info.message} ${info.ms}`;
});

// [Nest] 76609  - 2022. 08. 26. 오전 12:17:55   ERROR [ExceptionHandler] Nest could not find NestWinston element (this provider does not exist in the current context)
// Error: Nest could not find NestWinston element (this provider does not exist in the current context)
export const options = {
  file: {
    level: 'info',
    datePattern: 'YYYY-MM-DD',
    dirname: logDir,
    filename: `%DATE%.log`,
    handleExceptions: true,
    // json: false,
    // maxsize: 5242880, // 5MB
    prettyPrint: true,
    maxFiles: 30,
    colorize: false,
    zippedArchive: true,
    format: combine(
      splat(),
      ms(),
      label({ label: 'Nest' }),
      timestamp({
        format: 'YYYY. MM. DD HH:mm:ss',
      }),
      fileFormat,
    ),
  },
  error: {
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + '/error', // error.log 파일은 /logs/error 하위에 저장
    filename: `%DATE%.error.log`,
    maxFiles: 30,
    prettyPrint: true,
    zippedArchive: true,
    colorize: false,
    handleExceptions: true,
    format: combine(
      splat(),
      ms(),
      label({ label: 'Nest' }),
      timestamp({
        format: 'YYYY. MM. DD   HH:mm:ss',
      }),
      fileFormat,
    ),
  },
  console: {
    level: 'info',
    datePattern: 'YYYY-MM-DD',
    prettyPrint: true,
    handleExceptions: true,
    json: false,
    colorize: true,
    format: combine(
      label({ label: 'Nest' }),
      timestamp({
        format: 'YYYY. MM. DD   HH:mm:ss',
      }),
      colorize({ message: true }),
      splat(),
      prettyPrint(),
      ms(),
      logFormat,
    ),
  },
};
export const infoOption = { level: 'info', datePattern: 'YYYY.MM.DD' };
export const winstonModuleAsyncOptions: WinstonModuleAsyncOptions = {
  useFactory: () => ({
    level: process.env.NODE_ENV !== 'production' ? 'silly' : 'info',

    transports:
      process.env.NODE_ENV === 'production'
        ? [new winstonDaily(options.file), new winstonDaily(options.error)]
        : [
            new winstonDaily(options.file),
            new winstonDaily(options.error),
            new winston.transports.Console(options.console),
            // new winston.transports.Console(options.consoleError),
          ],
  }),
  inject: [],
};
