import { createClient } from "redis";
import { WebSocket, WebSocketServer } from "ws";

const WS_PORT = Number(process.env.WS_PORT || 8180);
const redisSub = createClient();
let usersConnectedCount = 0;

(async () => {
  try {
    await redisSub.connect();
    console.log("Connected to redis client");
    await listenAndSend();
  } catch (err) {
    console.error("Error while connecting to redis client", err);
  }
})();

let usersWS: WebSocket[] = [];

const wss = new WebSocketServer({ port: WS_PORT });

wss.on("connection", function (ws, req) {
  console.log("user connected");
  usersConnectedCount += 1;

  ws.on("message", async function (data) {
    try {
      const parsedData = JSON.parse(data as unknown as string);
      if (parsedData.message === "SUBSCRIBE") {
        usersWS.push(ws);
        console.log("User subscribed");
        console.log("UserWS length: ", usersWS.length);
      } else if (parsedData.message === "UNSUBSCRIBE") {
        usersWS = usersWS.filter((i) => {
          return i !== ws;
        });
        console.log("UserWS length: ", usersWS.length);
      }
    } catch (err) {
      console.error(err);
    }
  });

  ws.on("close", function () {
    usersWS = usersWS.filter((i) => {
      return i !== ws;
    });
  });
});

async function listenAndSend() {
  await redisSub.subscribe("trades", (message) => {
    // console.log(message);
    try {
      // let trade = JSON.parse(message);
      // console.log(trade);
      usersWS.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    } catch (err) {
      console.error("Error while parseing message", err);
    }
  });
  redisSub.on("error", (err) => {
    console.error("Redis error: ", err);
  });
  redisSub.on("end", () => {
    console.warn("Redis connection closed. Retrying...");
    setTimeout(() => redisSub.connect(), 1000);
  });
}
