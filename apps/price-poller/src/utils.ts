export function splitDecimal(numStr: string) {
  if (!numStr.includes(".")) {
    return { intValue: BigInt(numStr), decimals: 0 };
  }

  const [integerPart, decimalPart] = numStr.split(".");
  const decimals = decimalPart!.length;

  // remove the dot and parse as bigint
  const intValue = BigInt(integerPart! + decimalPart);

  return { intValue, decimals };
}
