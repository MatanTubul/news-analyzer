const appRoot = require('app-root-path');
const winston = require('winston');

/**
 * Logger
 * @type {{console: {handleExceptions: boolean, colorize: boolean, level: string, json: boolean, timestamp: boolean}, file: {filename: string, handleExceptions: boolean, colorize: boolean, level: string, json: boolean, maxsize: number, maxFiles: number}}}
 */

// define the custom settings for each transport (file, console)
const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: false,
    maxsize: 52428800, // 50MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    timestamp: true,
  },
};




// instantiate a new Winston Logger with the settings defined above
const logger = winston.createLogger({
  format: winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf(({ level, message, timestamp, stack }) => {
        if (stack) {
          // print log trace
          return `${timestamp} ${level}: ${message} - ${stack}`;
        }
        return `${timestamp} ${level}: ${message}`;
      })),
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

module.exports = logger;