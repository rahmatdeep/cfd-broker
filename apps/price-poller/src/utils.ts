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

// export function createPrices(price: number) {
//   const priceStr = price.toString();
//   const decimals = priceStr.includes(".") ? priceStr.split(".")[1]!.length : 0;

//   const buyPrice = price * 1.01;
//   const sellPrice = price * 0.99;

//   const scaleFactor = 10 ** decimals;
//   const originalInt = Math.round(price * scaleFactor);
//   const buyInt = Math.round(buyPrice * scaleFactor);
//   const sellInt = Math.round(sellPrice * scaleFactor);

//   return {
//     originalPrice: originalInt,
//     buyPrice: buyInt,
//     sellPrice: sellInt,
//     decimals,
//   };
// }
export function createPrices(price: number) {
  // force price into 4 decimal places
  const fixedPrice = Number(price.toFixed(4));
  const decimals = 4;

  const buyPrice = Number((fixedPrice * 1.01).toFixed(decimals));
  const sellPrice = Number((fixedPrice * 0.99).toFixed(decimals));

  const scaleFactor = 10 ** decimals;
  const originalInt = Math.round(fixedPrice * scaleFactor);
  const buyInt = Math.round(buyPrice * scaleFactor);
  const sellInt = Math.round(sellPrice * scaleFactor);

  return {
    originalPrice: originalInt,
    buyPrice: buyInt,
    sellPrice: sellInt,
    decimals, // always 4
  };
}

