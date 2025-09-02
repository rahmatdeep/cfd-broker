import { createClient } from "redis";
import WebSocket from "ws";
import { createPrices } from "./utils";

const redisQueue = createClient();
const redisPub = createClient();

let ws: WebSocket;
let hearbeat: NodeJS.Timeout;
let subscriptions: string[] = [
  "btcusdt@trade",
  "ethusdt@trade",
  "solusdt@trade",
];

/**
 * Connects to the binance websocket stream.
 * Subscribes to the assets from the subscriptions array.
 * On recieving the trade data from binance sends to a queue and a pub sub.
 *
 * Also handles reconnecting to binance.
 */
function connect(): void {
  ws = new WebSocket("wss://stream.binance.com/ws");

  ws.on("open", () => {
    console.log("Connected to Binance");

    //to subscribe to all the tokens once connected
    ws.send(
      JSON.stringify({
        method: "SUBSCRIBE",
        params: subscriptions,
        id: Date.now(),
      })
    );
  });

  ws.on("message", async (message) => {
    try {
      const parsedData = JSON.parse(message.toString());
      // console.log(parsedData);

      if (!parsedData.s || !parsedData.p) return; // ignore non-trade messages
      // const price = Number(parsedData.p).toString();
      // const { intValue: priceInt, decimals: priceDecimal } =
      //   splitDecimal(price);
      // const buyPrice = (Number(parsedData.p) * 1.01).toString();
      // const { intValue: buyInt, decimals: buyDecimals } =
      //   splitDecimal(buyPrice);
      // const sellPrice = (Number(parsedData.p) * 0.99).toString();
      // const { intValue: sellInt, decimals: sellDecimals } =
      //   splitDecimal(sellPrice);

      const { originalPrice, buyPrice, sellPrice, decimals } = createPrices(
        Number(parsedData.p)
      );

      const queueData = {
        symbol: parsedData.s,
        price: parsedData.p,
        quantity: parsedData.q,
        timestamp: parsedData.T.toString(),
      };

      const tradeData = {
        symbol: parsedData.s,
        price: originalPrice.toString(),
        buyPrice: buyPrice.toString(),
        sellPrice: sellPrice.toString(),
        decimals: decimals.toString(),
        timestamp: parsedData.T.toString(),
      };

      // console.log(tradeData);
      await redisQueue.rPush("trades", JSON.stringify(queueData));

      await redisPub.publish("trades", JSON.stringify(tradeData));
    } catch (err) {
      console.error("Failed to parse message:", err);
    }
  });

  ws.on("close", () => {
    console.log("Disconnected from binance, attempting to reconnect");
    setTimeout(connect, 2000); //timeout so that the binance server does not ratelimit us.
  });

  ws.on("error", (err) => {
    console.error("Websocket error:", err);
    ws.close();
  });
}

(async () => {
  try {
    await redisQueue.connect();
    console.log("connected to redis queue");

    await redisPub.connect();
    console.log("connected to redis pubsub");

    connect();
  } catch (err) {
    console.error("Failed to connect: ", err);
  }
})();
