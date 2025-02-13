import type { WalletCreateParams, WalletRestParams, Wallet, BaseConfigurations } from 'wallet-type'

export abstract class WalletCore<ConfigType extends BaseConfigurations = any> {
    config: ConfigType | undefined;

    constructor() {
      console.log('WalletCore constructor');
    }
  
    abstract createWallet(params: WalletCreateParams): Promise<Wallet> ;
    abstract restoreWallet(params: WalletRestParams): Promise<Wallet> ;
}