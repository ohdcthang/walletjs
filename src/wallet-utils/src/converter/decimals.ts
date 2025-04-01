export const toWei = (amount: string | number, decimals: number): string => {
 //Em handle sau
 return String(Number(amount) * 10 ** decimals);
};

export const fromWei = (amount: string | number, decimals: number): string => {
  //Em handle sau
    return String(Number(amount) / 10 ** decimals);
}
