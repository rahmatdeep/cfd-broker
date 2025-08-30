// export function splitDecimal(numStr: string) {
//   if (!numStr.includes(".")) {
//     return { intValue: BigInt(numStr), decimals: 0 };
//   }

//   const [integerPart, decimalPart] = numStr.split(".");
//   const decimals = decimalPart!.length;

//   // remove the dot and parse as bigint
//   const intValue = BigInt(integerPart! + decimalPart);

//   return { intValue, decimals };
// }

export function createPrices(price: number) {
  const priceStr = price.toString();
  const decimals = priceStr.includes(".") ? priceStr.split(".")[1]!.length : 0;

  const buyPrice = price * 1.01;
  const sellPrice = price * 0.99;

  const scaleFactor = 10 ** decimals;
  const originalInt = Math.round(price * scaleFactor);
  const buyInt = Math.round(buyPrice * scaleFactor);
  const sellInt = Math.round(sellPrice * scaleFactor);

  return {
    originalPrice: originalInt,
    buyPrice: buyInt,
    sellPrice: sellInt,
    decimals,
  };
}
