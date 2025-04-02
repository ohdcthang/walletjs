export const toWei = (amount: string | number, decimals: number): string => {
  const [intPart, decPart = "0"] = amount.toString().split(".");
  const factor = BigInt(10 ** decimals);
  const weiValue = BigInt(intPart) * factor + (BigInt(decPart) * factor) / BigInt(10 ** decPart.length);

  return weiValue.toString();
};

export const fromWei = (amount: string | number, decimals: number): string => {
  const weiValue = BigInt(amount);
  const factor = BigInt(10 ** decimals);
  const intPart = weiValue / factor;
  const decPart = ((weiValue % factor) * BigInt(10 ** decimals)) / factor;

  return `${intPart}.${decPart.toString().padStart(decimals, "0")}`.replace(/\.?0+$/, ""); // Xóa số 0 dư
}
