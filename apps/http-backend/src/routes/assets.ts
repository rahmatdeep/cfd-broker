import { Router } from "express";

const router: Router = Router();

router.get("/", (req, res)=>{
    /*
    RESPONSE
    {
	assets: [{
		name: "Bitcoin",
		symbol: "BTC",
		buyPrice: 1002000000, // decimal is 4
		sellPrice: 1000000000,
		decimals: 4,
		imageUrl: "image_url"
	},
	...]
    }
    */
})

export { router as assetsRouter };
