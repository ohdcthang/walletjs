import { WalletCore } from 'wallet-core'
import type { Wallet, WalletCreateParams, WalletRestParams } from 'wallet-type'

export class EvmWallet extends WalletCore<any> {
  constructor() {
    super()
  }

  createWallet(_params: WalletCreateParams): Promise<Wallet> {
    throw new Error('Method not implemented.');
    // Implementation for creating a wallet
  }

  restoreWallet(_params: WalletRestParams): Promise<Wallet> {
    throw new Error('Method not implemented.');
    // Implementation for restoring a wallet
  }
}