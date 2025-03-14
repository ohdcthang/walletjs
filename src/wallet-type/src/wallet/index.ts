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

interface BaseTransferParams {
  to: string;
  amount: string;
  gasPrice: number;
  tokenAddress?: string ,
  tokenId?: string
}

export interface TransferParams extends BaseParams {
    type: 'native' | 'erc20' | 'nft';
    transaction: BaseTransferParams
}

export interface Wallet<T = unknown> {
  address: string;
  privateKey: string;
  mnemonic?: string;
  meta?: T;
}
