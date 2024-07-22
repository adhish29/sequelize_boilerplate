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
        config
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
