const winston = require("winston");
const chalk = require("chalk");

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "blue",
  },
};

winston.addColors(customLevels.colors);

const colorizeTimestamp = winston.format((info) => {
  info.timestamp = chalk.black.bgYellow.bold(info.timestamp); // Color the timestamp
  return info;
});

const logger = winston.createLogger({
  levels: customLevels.levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: "DD-MM-YYYY hh:mm:ss" }),
    colorizeTimestamp(),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: "app.log" }),
  ],
});

module.exports = logger;
