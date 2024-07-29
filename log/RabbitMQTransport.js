const Transport = require("winston-transport");
const { getChannel } = require("../rabbitMQConnection");

module.exports = class RabbitMQTransport extends Transport {
  constructor(opts) {
    super(opts);
    this.channel = null;
    this.queue = opts.queue;
  }

  async log(info, callback) {
    this.channel = getChannel();
    if (this.channel) {
      try {
        const msg = JSON.stringify(info);
        this.channel.sendToQueue(this.queue, Buffer.from(msg), {
          persistent: true,
        });
        await this.channel.waitForConfirms();
        console.log("[X] Message published to Queue: ", msg);
      } catch (error) {
        console.log("Unable to publish messages to Queue❌❌❌");
      }
    }

    callback();
  }
};
