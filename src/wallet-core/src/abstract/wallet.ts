import type { BaseConfigurations, Erc20Transaction, EstimateGasParams, EstimateGasResponse, GetBalanceParams, GetNftsParams, GetTokensParams, NftListResponse, TokenListResponse, TransferParams, Wallet } from 'wallet-type'

export abstract class WalletCore<ConfigType extends BaseConfigurations = any> {
    config: ConfigType | undefined;
    protected wallet: Wallet

    constructor(wallet: Wallet) {
      this.wallet = wallet
    }

    static fromMnemonic(_mnemonic: string, _path: string): WalletCore {
      throw new Error('fromMnemonic must be implemented in subclass');
    }

    static fromPrivateKey(_privateKey: string): WalletCore {
      throw new Error('fromPrivateKey must be implemented in subclass');
    }
  
    abstract getAddress(): string ;
    abstract getPrivateKey(): string ;
    abstract getBalance<T extends GetBalanceParams>(params: T): Promise<string> ;
    abstract getTokens<T extends GetTokensParams>(params: T): Promise<TokenListResponse> ;
    abstract getNfts<T extends GetNftsParams>(params: T): Promise<NftListResponse> ;
    abstract estimateGas<T extends EstimateGasParams>(params: T): Promise<EstimateGasResponse> ;
    abstract transfer<T extends TransferParams>(params: T): Promise<string> ;
    abstract transferWithSponsorGas<T extends Omit<Erc20Transaction, 'type'>>(params: T): Promise<string> ;
}