// const winston = require("winston");
// const Transport = require("winston-transport");
// const amqp = require("amqplib");
// const chalk = require("chalk");
// const connectToRabbitMQ = require("../rabbitMQConnection");

// const queue = "logs";

// const initializeLogger = async () => {
//   const channel = await connectToRabbitMQ(queue);
//   const customLevels = {
//     levels: {
//       error: 0,
//       warn: 1,
//       info: 2,
//       http: 3,
//       debug: 4,
//     },
//     colors: {
//       error: "red",
//       warn: "yellow",
//       info: "green",
//       http: "magenta",
//       debug: "blue",
//     },
//   };

//   class RabbitMQTransport extends Transport {
//     constructor() {
//       super();
//       this.queue = queue;
//       this.channel = channel;
//       // this.connection = null;
//       // this.connect();
//     }

//     // async connect() {
//     //   try {
//     //     this.connection = await amqp.connect("amqp://localhost");
//     //     this.channel = await this.connection.createChannel();
//     //     await this.channel.assertQueue(this.queue, { durable: true });
//     //     console.log("Connected to RabbitMQ successfully✅✅✅");
//     //   } catch (error) {
//     //     console.error("Error while connecting: ", error);
//     //   }
//     // }

//     log(info, callback) {
//       setImmediate(() => {
//         this.emit("logged", info);
//       });
//       console.log(this.channel);

//       const msg = JSON.stringify(info);
//       this.channel.sendToQueue(this.queue, Buffer.from(msg));
//       console.log("[X] Message published to Queue: ", msg);

//       callback();
//     }
//   }

//   winston.addColors(customLevels.colors);

//   const colorizeTimestamp = winston.format((info) => {
//     info.timestamp = chalk.black.bgYellow.bold(info.timestamp); // Color the timestamp
//     return info;
//   });

//   const logger = winston.createLogger({
//     levels: customLevels.levels,
//     format: winston.format.combine(
//       winston.format.timestamp({ format: "DD-MM-YYYY hh:mm:ss" }),
//       colorizeTimestamp(),
//       winston.format.colorize(),
//       winston.format.printf(({ timestamp, level, message }) => {
//         return `[${timestamp}] [${level}]: ${message}`;
//       })
//     ),
//     transports: [
//       new winston.transports.Console(),
//       new RabbitMQTransport(),
//       // new winston.transports.File({ filename: "app.log" }),
//     ],
//   });

//   return logger;
// };

// // (async () => {

// // })();

// const logger = initializeLogger();

// module.exports = logger;

//****************************************************

const winston = require("winston");
const Transport = require("winston-transport");
const amqp = require("amqplib");
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

class RabbitMQTransport extends winston.Transport {
  constructor(opts) {
    super(opts);
    this.queue = opts.queue;
    this.channel = null;
    this.connection = null;
    this.connect();
  }

  async connect() {
    try {
      this.connection = await amqp.connect("amqp://localhost");
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queue, { durable: true });
      console.log("Connected to RabbitMQ successfully✅✅✅");
    } catch (error) {
      console.error("Error while connecting: ", error);
    }
  }

  log(info, callback) {
    if (this.channel) {
      const msg = JSON.stringify(info);
      this.channel.sendToQueue(this.queue, Buffer.from(msg));
      console.log("[X] Message published to Queue: ", msg);
    }

    callback();
  }
}

winston.addColors(customLevels.colors);

const colorizeTimestamp = winston.format((info) => {
  info.timestamp = chalk.black.bgYellow.bold(info.timestamp); // Color the timestamp
  return info;
});

const logger = winston.createLogger({
  levels: customLevels.levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
    // colorizeTimestamp(),
    // winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message }) => {
      // return `[${timestamp}] [${level}]: ${message}`;
      return `${timestamp} ${level} ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new RabbitMQTransport({ queue: "logs" }),
    // new winston.transports.File({ filename: "app.log" }),
  ],
});

module.exports = logger;
