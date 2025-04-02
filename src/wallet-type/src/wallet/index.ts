import { chainType } from '../chains';
import { NftItem, TokenInfo } from '../tokens';

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
  low: string;
  standard: string;
  fast: string;
  eip1559?: {
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
  }
}

// Base transaction parameters
export interface BaseTransaction<T = any> {
  chain: chainType; // Chain ID
  from: string;
  to: string; // Recipient address
  gasPrice?: string; // Legacy gas price in Gwei
  eip1559?: {
    maxFeePerGas?: string; // EIP-1559 max fee per gas in Gwei
    maxPriorityFeePerGas?: string; // EIP-1559 max priority fee per gas in Gwei
  },
  amount: string; // Amount in Ether
  data?: string; // Amount in Ether
  optional?: T;
}

// Native token transfer parameters
export interface NativeTransaction extends BaseTransaction {
  type: 'native';
}

// ERC20 token transfer parameters
export interface Erc20Transaction extends BaseTransaction {
  type: 'erc20';
  token: TokenInfo
}

// NFT transfer parameters
export interface NftTransaction extends Omit<BaseTransaction, 'amount'> {
  type: 'nft';
  nft: NftItem
}

// Union type for TransferParams
export type TransferParams = NativeTransaction | Erc20Transaction | NftTransaction;

export interface Wallet<T = unknown> {
  address: string;
  privateKey: string;
  mnemonic?: string;
  meta?: T;
}
