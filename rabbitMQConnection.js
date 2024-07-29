const amqp = require("amqplib");
let channel = null;

// async function connectToRabbitMQ(queue) {
//   try {
//     const connection = await amqp.connect("amqp://localhost");
//     channel = await connection.createChannel();
//     await channel.assertQueue(queue, { durable: true });
//     console.log("Connected to RabbitMQ successfully✅✅✅");
//   } catch (error) {
//     console.error("Error while connecting: ", error);
//   }
// }
async function connectToRabbitMQ(queue, maxAttempts = 5, delay = 5000) {
  let attempts = 0;
  while (attempts < maxAttempts) {
    try {
      const connection = await amqp.connect("amqp://localhost");
      channel = await connection.createConfirmChannel();
      await channel.assertQueue(queue, { durable: true });
      console.log("Connected to RabbitMQ successfully✅✅✅");
      return;
    } catch (error) {
      attempts++;
      console.error(
        `Error while connecting to RabbitMQ host: attempt ${attempts}/${maxAttempts}`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  // throw new Error(
  //   `Failed to connect to RabbitMQ after ${maxAttempts} attempts`
  // );
}

function getChannel() {
  return channel;
}

module.exports = { connectToRabbitMQ, getChannel };
