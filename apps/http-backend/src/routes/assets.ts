import { Router } from "express";
import { prices } from "../execution";

const router: Router = Router();

router.get("/", (req, res) => {
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
  const assets = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      buyPrice: prices.BTC.buy,
      sellPrice: prices.BTC.sell,
      decimals: 4,
      imageUrl: "image",
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      buyPrice: prices.ETH.buy,
      sellPrice: prices.ETH.sell,
      decimals: 4,
      imageUrl: "image",
    },
    {
      name: "Solana",
      symbol: "SOL",
      buyPrice: prices.SOL.buy,
      sellPrice: prices.SOL.sell,
      decimals: 4,
      imageUrl: "image",
    },
  ];
  res.json(assets);
  return;
});

export { router as assetsRouter };
