import { Router } from "express";

const router: Router = Router();

router.post("/", (req, res) => {
    /*
    BODY
    {
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
})

export { router as tradeRouter };

