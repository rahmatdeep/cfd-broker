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
  let newOrder: Order;
  if (inputs.type === "buy" && inputs.leverage === 1) {
    let quantity = (inputs.margin * inputs.leverage) / inputs.openPrice;
    newOrder = {
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
  } else if (inputs.type === "buy" && inputs.leverage > 1){
    let quantity = (inputs.margin * inputs.leverage) / inputs.openPrice;
    let openPriceDecimal = inputs.openPrice / 100;
    let marginDecimal = inputs.margin / 100;
    let autoClosePriceDecimal = openPriceDecimal - marginDecimal / quantity;
    let autoClosePrice = Math.round(autoClosePriceDecimal * 100);
    newOrder = {
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
    return newOrder.orderId
  }
   else if (inputs.type === "sell") {
    let quantity = (inputs.margin * inputs.leverage) / inputs.openPrice;
    let openPriceDecimal = inputs.openPrice / 100;
    let marginDecimal = inputs.margin / 100;
    let autoClosePriceDecimal = openPriceDecimal + marginDecimal / quantity;
    let autoClosePrice = Math.round(autoClosePriceDecimal * 100);
    newOrder = {
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
  let orderIndex = openPositions.findIndex((o) => o.orderId === inputs.orderId);
  if (orderIndex !== -1) {
    let [completedOrder] = openPositions.splice(orderIndex, 1);
    if (completedOrder) {
      completedOrder.closePrice = inputs.closePrice;
      if (completedOrder.type === "buy") {
        completedOrder.PorL =
          completedOrder.closePrice! - completedOrder.openPrice;
        closedPositions.push(completedOrder);
        console.log("open: ", openPositions);
        console.log("closed: ", closedPositions);
        return;
      } else if (completedOrder.type === "sell") {
        completedOrder.PorL =
          completedOrder.openPrice - completedOrder.closePrice!;
        closedPositions.push(completedOrder);
        console.log("open: ", openPositions);
        console.log("closed: ", closedPositions);
        return;
      }
    }
  }
}
