import { createClient } from "redis";
import { closeOrder, openPositions } from "./data";

const redisSub = createClient();

export let prices = {
  BTC: {
    buy: 0,
    sell: 0,
  },
  SOL: {
    buy: 0,
    sell: 0,
  },
  ETH: {
    buy: 0,
    sell: 0,
  },
};

(async () => {
  try {
    await redisSub.connect();
    console.log("Connected to redis client");
    await executeOrders();
  } catch (err) {
    console.error("Error while connecting to redis client", err);
  }
})();

async function executeOrders() {
  await redisSub.subscribe("trades", (message) => {
    try {
      let trade = JSON.parse(message);
      // console.log(prices);
      if (trade.symbol === "BTCUSDT") {
        prices.BTC.buy = trade.buyPrice;
        prices.BTC.sell = trade.sellPrice;
        openPositions.forEach((i) => {
          if (i.asset === "BTC" && i.autoClosePrice && !i.closePrice) {
            if (i.type === "buy") {
              if (i.autoClosePrice > trade.sellPrice) {
                closeOrder({ orderId: i.orderId, closePrice: trade.sellPrice });
              }
            } else if (i.type === "sell") {
              if (i.autoClosePrice < trade.buyPrice) {
                closeOrder({ orderId: i.orderId, closePrice: trade.buyPrice });
              }
            }
          }
        });
      }

      if (trade.symbol === "ETHUSDT") {
        prices.ETH.buy = trade.buyPrice;
        prices.ETH.sell = trade.sellPrice;
        openPositions.forEach((i) => {
          if (i.asset === "ETH" && i.autoClosePrice && !i.closePrice) {
            if (i.type === "buy") {
              if (i.autoClosePrice > trade.sellPrice) {
                closeOrder({ orderId: i.orderId, closePrice: trade.sellPrice });
              }
            } else if (i.type === "sell") {
              if (i.autoClosePrice < trade.buyPrice) {
                closeOrder({ orderId: i.orderId, closePrice: trade.buyPrice });
              }
            }
          }
        });
      }

      if (trade.symbol === "SOLUSDT") {
        prices.SOL.buy = trade.buyPrice;
        prices.SOL.sell = trade.sellPrice;
        openPositions.forEach((i) => {
          if (i.asset === "SOL" && i.autoClosePrice && !i.closePrice) {
            if (i.type === "buy") {
              if (i.autoClosePrice > trade.sellPrice) {
                closeOrder({ orderId: i.orderId, closePrice: trade.sellPrice });
              }
            } else if (i.type === "sell") {
              if (i.autoClosePrice < trade.buyPrice) {
                closeOrder({ orderId: i.orderId, closePrice: trade.buyPrice });
              }
            }
          }
        });
      }
    } catch (err) {
      console.error("An error has occured", err);
    }
  });
}
