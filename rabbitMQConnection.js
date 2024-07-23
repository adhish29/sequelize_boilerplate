const amqp = require("amqplib");

async function connectToRabbitMQ(queue) {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queue, { durable: true });
  return channel;
}

module.exports = connectToRabbitMQ;
