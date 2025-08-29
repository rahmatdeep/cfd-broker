import { Router } from "express";

const router: Router = Router();

router.get("/", (req, res) => {
  const { asset, startTime, endTime, ts } = req.query;
  /*
  {
	candles: [{
		timestamp: unix_timestamp,
		open: 2000000, // decimal is 4
		close: 2100000,
		high: 2000000,
		low: 2000000,
		decimal: 4
	}, ...]
}
  */
});

// GET 

export { router as candlesRouter };
