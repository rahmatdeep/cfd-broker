import { Router } from "express";
import { createOrder } from "../data";
import { prices } from "../execution";

const router: Router = Router();

type Asset = keyof typeof prices;
type TradeType = keyof typeof prices.BTC;

interface OrderInput {
  userId: string;
  type: TradeType;
  margin: number;
  leverage: number;
  asset: Asset;
}

router.post("/", (req, res) => {
  /*
    BODY
    {
	asset: "BTC",
	type: "buy" | "sell",
	margin: 50000, // decimal is 2, so this means 500$
	leverage: 10, // so the user is trying to buy $5000 of exposure
    }
    RESPONSE
    411
    {
	message: "Incorrect inputs"
    }

    200
    {
	orderId: "uuid"
    }
    */

  //   const { userId } = req.headers;
  const { type, margin, leverage, asset, userId }: OrderInput = req.body;

  if ((!userId && typeof userId !== "string") || !margin || !leverage) {
    res.status(411).json({
      message: "Incorrect Inputs",
    });
    return;
  }
  const openPrice = Number(prices[asset][type]);

  const orderId = createOrder({
    asset,
    margin: Number(margin),
    leverage: Number(leverage),
    userId,
    type,
    openPrice,
  });

  res.json({
    orderId: orderId,
  });
});

export { router as tradeRouter };
