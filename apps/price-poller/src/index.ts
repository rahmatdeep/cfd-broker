import { createClient } from "redis";
import WebSocket from "ws";

const redisQueue = createClient();

let ws: WebSocket;
let hearbeat: NodeJS.Timeout;
let subscriptions: string[] = [
  "btcusdt@trade",
  "ethusdt@trade",
  "solusdt@trade",
];

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

  ws.on("message", async(message) => {
    try {
      const parsedData = JSON.parse(message.toString());
      if (!parsedData.s || !parsedData.p) return; // ignore non-trade messages
      const queueData = {
        symbol: parsedData.s,
        price: parsedData.p,
        quantity: parsedData.q,
        timestamp: parsedData.T,
      };
      try {
        await redisQueue.rPush("trades", JSON.stringify(queueData));
      } catch (err) {
        console.error("Failed to push to redis:", err);
      }
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
  redisQueue
    .connect()
    .then(() => {
      console.log("connected to redis client");
      connect();
    })
    .catch((err) => {
      console.log(`Failed to connected to redis: ${err}`);
    });
})();
