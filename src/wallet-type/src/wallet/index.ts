import { chainType } from "../chains";

export interface BaseParams<T = unknown>{
    chain: chainType,
    optional?: T
}

export interface WalletCreateParams extends BaseParams{
    mnemonic: string,
}

export interface WalletRestParams extends BaseParams{
    privateKey: string,
}

export interface Wallet<T = unknown> {
    address: string,
    privateKey: string,
    mnemonic?: string,
    meta: T
}