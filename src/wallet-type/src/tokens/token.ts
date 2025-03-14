export interface TokenInfo {
  tokenAddress: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  usdValue?: number;
}
export interface TokenListResponse {
  address: string;
  chain: string;
  tokens: TokenInfo[];
}
