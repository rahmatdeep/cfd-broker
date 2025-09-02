import { Router } from "express";
import { openPositions } from "../data";

const router: Router = Router();

router.get("/", (req, res) => {
  /*
    RESPONSE
    {
    trades: [
        {
            orderId: "uuid",
            type: "buy" | "sell",
            margin: 50000, // decimal is 2, so this means 500$
            leverage: 10, // so the user is trying to buy $5000 of exposure
            openPrice: 1000000000, // decimal is 4, so $100k		
            closePrice: 2000000000,
            pnl: 500000 // decimal is 2
        }
    ]
    }
    */
});

router.get("/open", (req, res) => {
  /*
    RESPONSE
    {
	trades: [
		{
			orderId: "uuid",
			type: "buy" | "sell",
			margin: 50000, // decimal is 2, so this means 500$
			leverage: 10, // so the user is trying to buy $5000 of exposure
			openPrice: 1000000000, // decimal is 4, so $100k			
		}
	]
    }
     */
  const { userId } = req.body;

  const trades = openPositions
    .filter((i) => {
      return i.userId === userId;
    })
    .map(({ orderId, type, margin, leverage, openPrice, asset }) => ({
      orderId,
      asset,
      type,
      margin,
      leverage,
      openPrice,
    }));
  console.log("trades: ", trades);
  console.log("open positions: ", openPositions);
  res.json({
    trades,
  });
});

export { router as tradesRouter };
