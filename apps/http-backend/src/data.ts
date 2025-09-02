import { v4 as uuidv4 } from "uuid";
interface User {
  id: string;
  email: string;
  password: string;
  balance: number;
  lockedBalance: number;
  assets: Record<string, number>;
}

interface Order {
  orderId: string;
  userId: string;
  asset: string;
  type: "buy" | "sell";
  quantity: number;
  openPrice: number;
  margin: number;
  leverage: number;
  closePrice?: number;
  autoClosePrice?: number;
  PorL?: number;
}
type createOrderInputs = Pick<
  Order,
  "userId" | "asset" | "type" | "openPrice" | "margin" | "leverage"
>;

type closeOrderInputs = Pick<Order, "orderId" | "closePrice">;

const usersData: User[] = [];
export const openPositions: Order[] = [];
export const closedPositions: Order[] = [];

export function createUser(email: string, password: string): string {
  const genId = uuidv4();
  const newUser: User = {
    id: genId,
    email,
    password,
    balance: 500000,
    lockedBalance: 0,
    assets: {},
  };
  usersData.push(newUser);
  return genId;
}

export function findUser(email: string, password: string): User | null {
  const user = usersData.find((u) => {
    return u.email === email && u.password === password;
  });
  if (!user) {
    return null;
  }
  return user;
}

export function createOrder(inputs: createOrderInputs) {
  if (inputs.type === "buy" && inputs.leverage === 1) {
    let openPriceDecimal = inputs.openPrice / 10000;
    let marginDecimal = inputs.margin / 100;
    let quantity = (marginDecimal * inputs.leverage) / openPriceDecimal;
    let newOrder = {
      orderId: uuidv4(),
      userId: inputs.userId,
      asset: inputs.asset,
      type: inputs.type,
      quantity,
      openPrice: inputs.openPrice,
      margin: inputs.margin,
      leverage: inputs.leverage,
    };
    openPositions.push(newOrder);
    console.log("open: ", openPositions);
    console.log("closed: ", closedPositions);
    return newOrder.orderId;
  } else if (inputs.type === "buy" && inputs.leverage > 1) {
    let openPriceDecimal = inputs.openPrice / 10000;
    let marginDecimal = inputs.margin / 100;
    let quantity = (marginDecimal * inputs.leverage) / openPriceDecimal;
    const buffer = 0.2;
    const maxLossDecimal = marginDecimal * (1 - buffer);
    let autoClosePriceDecimal = openPriceDecimal - maxLossDecimal / quantity;
    let autoClosePrice = Math.round(autoClosePriceDecimal * 10000);
    let newOrder = {
      orderId: uuidv4(),
      userId: inputs.userId,
      asset: inputs.asset,
      type: inputs.type,
      quantity,
      openPrice: inputs.openPrice,
      margin: inputs.margin,
      leverage: inputs.leverage,
      autoClosePrice,
    };
    openPositions.push(newOrder);
    console.log("open: ", openPositions);
    console.log("closed: ", closedPositions);
    return newOrder.orderId;
  } else if (inputs.type === "sell") {
    let openPriceDecimal = inputs.openPrice / 10000;
    let marginDecimal = inputs.margin / 100;
    let quantity = (marginDecimal * inputs.leverage) / openPriceDecimal;
    const buffer = 0.2;
    const maxLossDecimal = marginDecimal * (1 - buffer);
    let autoClosePriceDecimal = openPriceDecimal + maxLossDecimal / quantity;
    let autoClosePrice = Math.round(autoClosePriceDecimal * 10000);
    let newOrder = {
      orderId: uuidv4(),
      userId: inputs.userId,
      asset: inputs.asset,
      type: inputs.type,
      quantity,
      openPrice: inputs.openPrice,
      margin: inputs.margin,
      leverage: inputs.leverage,
      autoClosePrice,
    };
    openPositions.push(newOrder);
    console.log("open: ", openPositions);
    console.log("closed: ", closedPositions);
    return newOrder.orderId;
  }
}

export function closeOrder(inputs: closeOrderInputs) {
  const PRICE_SCALE = 10 ** 4;
  const MARGIN_SCALE = 10 ** 2;
  let orderIndex = openPositions.findIndex((o) => o.orderId === inputs.orderId);
  if (orderIndex !== -1) {
    let [completedOrder] = openPositions.splice(orderIndex, 1);
    if (completedOrder) {
      completedOrder.closePrice = inputs.closePrice;
      if (completedOrder.type === "buy") {
        const priceDiff = completedOrder.closePrice! - completedOrder.openPrice;
        const pnl = (priceDiff / PRICE_SCALE) * completedOrder.quantity;
        const finalPnL = Math.round(pnl * MARGIN_SCALE);
        completedOrder.PorL = Math.max(-completedOrder.margin, finalPnL);
        closedPositions.push(completedOrder);
        console.log("open: ", openPositions);
        console.log("closed: ", closedPositions);
        return;
      } else if (completedOrder.type === "sell") {
        const priceDiff = completedOrder.openPrice - completedOrder.closePrice!;
        const pnl = (priceDiff / PRICE_SCALE) * completedOrder.quantity;
        const finalPnL = Math.round(pnl * MARGIN_SCALE);
        completedOrder.PorL = Math.max(-completedOrder.margin, finalPnL);
        closedPositions.push(completedOrder);
        console.log("open: ", openPositions);
        console.log("closed: ", closedPositions);
        return;
      }
    }
  }
}
