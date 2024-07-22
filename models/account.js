const { Model, DataTypes } = require("sequelize");
const sequelize = require("../DBConnection");

class Account extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
Account.init(
  {
    balance: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "Account",
  }
);
module.exports = Account;
