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
})

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
    const {userId} = req.body

    const userOpenOrders = openPositions.filter((i) => {
        i.userId === userId
    })
    
})


export { router as tradesRouter };
