import { chainType } from '../chains';

export interface BaseParams<T = unknown> {
  chain: chainType;
  optional?: T;
}

export interface WalletCreateParams extends BaseParams {
  mnemonic: string;
}

export interface WalletRestoreParams extends BaseParams {
  privateKeyOrMnemonic: string;
}

export interface GetBalanceParams extends BaseParams {
  tokenAddress?: string;
}

export interface GetTokensParams extends BaseParams {}

export interface GetNftsParams extends BaseParams {}

export interface EstimateGasParams extends BaseParams {}

export interface EstimateGasResponse {
  low: number;
  standard: number;
  fast: number;
}

// Base transaction parameters
interface BaseTransaction {
  chain: chainType; // Chain ID
  to: string; // Recipient address
  gasPrice?: string; // Gas price in Gwei
}

// Native token transfer parameters
export interface NativeTransaction extends BaseTransaction {
  type: 'native';
  amount: string; // Amount in Ether
}

// ERC20 token transfer parameters
export interface Erc20Transaction extends BaseTransaction {
  type: 'erc20';
  tokenAddress: string; // ERC20 token contract address
  amount: string; // Amount in token units
}

// NFT transfer parameters
export interface NftTransaction extends BaseTransaction {
  type: 'nft';
  tokenAddress: string; // NFT contract address
  tokenId: string; // Token ID of the NFT
}

// Union type for TransferParams
export type TransferParams = NativeTransaction | Erc20Transaction | NftTransaction;

export interface Wallet<T = unknown> {
  address: string;
  privateKey: string;
  mnemonic?: string;
  meta?: T;
}
