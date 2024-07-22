const express = require("express");
const sequelize = require("./DBConnection");
const transactionRouter = require("./routers/transactionRouter");
const logger = require("./log");

const app = express();
const port = 3000;

app.use(express.json());

sequelize
  .authenticate()
  .then(() => {
    logger.info("Connection has been established successfully.");
  })
  .catch((err) => console.error("Unable to connect to the database:", err));

sequelize.sync().then(() => {
  logger.info("Database Synchronzed");
});

app.get("/ping", async (_, res) => {
  res.send("pong");
});

app.use("/account", transactionRouter);

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
    stack: err.stack,
  });
});

process.on("unhandledRejection", (error) => {
  console.log("unhandledRejection: ", error);
  process.exit(1);
});

app.listen(port, () => logger.info(`Listening to http://localhost/${port}`));
