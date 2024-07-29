const { Sequelize } = require("sequelize");

class Database {
  constructor() {
    const env = process.env.NODE_ENV || "development";
    const config = require(__dirname + "/../config/config.json")[env];

    if (!Database.instance) {
      this.sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        // config
        {
          host: config.host,
          dialect: config.dialect,
          retry: {
            maxAttempts: 5, // maximum number of attempts
            match: [/Deadlock/, /Timeout/, /Connection lost/], // retry on specific errors
            backoffBase: 1000, // initial backoff time in milliseconds
            backoffExponent: 1.5, // exponent for calculating next backoff time
            backoffMax: 30000, // maximum backoff time in milliseconds
            retryDelay: 1000, // initial retry delay in milliseconds
          },
        }
      );
      Database.instance = this;
    }

    return Database.instance;
  }

  getInstance() {
    return this.sequelize;
  }
}

const instance = new Database();
Object.freeze(instance);

module.exports = instance.getInstance();
