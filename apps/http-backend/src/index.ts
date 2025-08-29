import express from "express";
import "dotenv/config";
import cors from "cors";
import { userRouter } from "./routes/user";
import { tradeRouter } from "./routes/trade";
import { tradesRouter } from "./routes/trades";
import { candlesRouter } from "./routes/candles";
import { assetsRouter } from "./routes/assets";

const PORT = process.env.HTTP_PORT || 3200;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/trade", tradeRouter);
app.use("/api/v1/trades", tradesRouter);
app.use("/api/v1/candles", candlesRouter);
app.use("/api/v1/assets", assetsRouter);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
