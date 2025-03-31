import { WalletCore } from 'wallet-core'
import type { Wallet, NetworkConfig, chainType, GetBalanceParams, GetTokensParams, TokenInfo, TokenListResponse, EstimateGasParams, EstimateGasResponse, TransferParams, NftListResponse, GetNftsParams, NativeTransaction, Erc20Transaction, NftTransaction } from 'wallet-type'
import { fetchNetworks, fetchNftsList, fetchTokenList } from './api'
import Web3 from 'web3'
import { mnemonicToSeedSync, validateMnemonic } from 'bip39'
import { hdkey, Wallet as hdWallet } from '@ethereumjs/wallet';
import { ERC20_ABI, ERC721_ABI } from './constants'
import { get } from 'lodash-es'
import { InvalidMnemonicError, TransferFailedError, UnsupportedTransactionTypeError } from 'wallet-validator'
// import { ERC20_ABI } from './constants'

export class EvmWallet extends WalletCore<any>{
  static instance: EvmWallet
  public networks: NetworkConfig[] = []
  private providerCached: Map<chainType, Web3> = new Map()
  
  constructor(wallet: Wallet) {
    super(wallet)

    this.init().catch((error) => {
      console.error('Error during initialization:', error);
    });
  }

  static fromMnemonic(mnemonic: string, path = '60') {
    if (!validateMnemonic(mnemonic)) throw new InvalidMnemonicError('Invalid mnemonic')

    const seed = mnemonicToSeedSync(mnemonic)
    const hdWallet = hdkey.EthereumHDKey.fromMasterSeed(seed)
    const pathDerivetion = `m/44'/${path}'/0'/0/0`
    const evmWallet = hdWallet.derivePath(pathDerivetion).getWallet()

    const address = evmWallet.getAddressString()
    const privateKey = evmWallet.getPrivateKeyString()


    const wallet: Wallet = {
      address,
      privateKey,
      mnemonic,
    }
    return new EvmWallet(wallet);
  }

  static fromPrivateKey(privateKey: string) {
    if (!/^(0x)?[a-fA-F0-9]{64}$/.test(privateKey)) throw new Error('Invalid private key')

    const walletHD = hdWallet.fromPrivateKey(Buffer.from(privateKey, 'hex'))
    const address = walletHD.getAddressString()

    const wallet: Wallet = {
      address,
      privateKey,
      mnemonic: undefined,
    }
    return new EvmWallet(wallet);
  }

  getAddress() {
    return this.wallet.address;
  }

  getPrivateKey() {
      return '0x' + this.wallet.privateKey;
  }

  async init() {
    this.config = {
      networks: await fetchNetworks()
    }
  }

  async getBalance<T extends GetBalanceParams>(params: T): Promise<string> {
    const { chain, tokenAddress } = params
    const address = this.getAddress()

    if (!Web3.utils.isAddress(address)) {
      throw new Error('Invalid address');
    }

    try {
      if(!EvmWallet.instance.config) await this.create()
      const provider = await this.getProvider(chain)

      if(!tokenAddress){
        const balanceRaw = await provider.eth.getBalance(address);
        return balanceRaw.toString();
      }else {
        if (!Web3.utils.isAddress(tokenAddress as string)) {
          throw new Error('Invalid token contract address');
        }

        const tokenContract = new provider.eth.Contract(ERC20_ABI as any, tokenAddress);
        const balance = await tokenContract.methods.balanceOf(address).call();
        return String(balance); 
      }
    } catch (error) {
      return '0'
   }
  }

  async getTokens<T extends GetTokensParams>(params: T): Promise<TokenListResponse> {
    const { chain } = params

    const address = this.getAddress()

    const balanceNative = await this.getBalance({ chain })
    const networkData = this.getNetworkSync(chain)

    const tokensNative: TokenInfo = {
      tokenAddress: '',
      symbol: get(networkData, 'nativeCurrency.symbol',''),
      balance: balanceNative,
      decimals: get(networkData, 'nativeCurrency.decimals', 18),
      name: get(networkData, 'nativeCurrency.name', ''),
    }

    try {
      const tokens = await fetchTokenList(networkData?.chain as string, address)

      const tokensFormatted = tokens.map((token: TokenInfo) => {
        return {
          tokenAddress: get(token, 'token_address', ''),
          symbol: get(token, 'symbol', ''),
          balance: get(token, 'balance', ''),
          decimals: get(token, 'decimals', 18),
          name: get(token, 'name', ''),
        }
      })

      return {
        address,
        chain,
        tokens: tokensFormatted.concat(tokensNative)
      }
    } catch (error) {
      return {
        address,
        chain,
        tokens: [tokensNative]
      }
    }
  }

  async getNfts<T extends GetNftsParams>(params: T): Promise<NftListResponse> {
    const { chain } = params

    const address = this.getAddress()
    try {
      const networkData = this.getNetworkSync(chain)

      const nfts = await fetchNftsList(networkData?.chain as string, address)

      return {
        chain,
        address,
        nfts
      }
    } catch (error) {
      return {
        chain,
        address,
        nfts: []
      }
    }
  }

  async estimateGas(params: EstimateGasParams): Promise<EstimateGasResponse> {
    const { chain } = params
    try {
      const provider = await this.getProvider(chain);
  
      const isEip1559Supported = await provider.eth.getBlock('latest').then((block: any) => {
        return block.baseFeePerGas !== undefined; // EIP-1559 chains have `baseFeePerGas`
      });
  
      if (isEip1559Supported) {
        const feeHistory = await provider.eth.getFeeHistory(1, 'latest', [10, 50, 90]);
        const baseFeePerGas = Number(Web3.utils.fromWei(feeHistory.baseFeePerGas[0], 'gwei'));
        const maxPriorityFeePerGas = Number(Web3.utils.fromWei(feeHistory.reward[0][1], 'gwei'));
  
        return {
          low: Number((baseFeePerGas + maxPriorityFeePerGas * 0.8).toFixed(2)).toString(),
          standard: Number((baseFeePerGas + maxPriorityFeePerGas).toFixed(2)).toString(),
          fast: Number((baseFeePerGas + maxPriorityFeePerGas * 1.2).toFixed(2)).toString(),
          eip1559: {
            maxFeePerGas: Number((baseFeePerGas + maxPriorityFeePerGas).toFixed(2)).toString(),
            maxPriorityFeePerGas: Number(maxPriorityFeePerGas.toFixed(2)).toString(),
          },
        };
      } else {
        // Fallback to legacy gas price estimation
        const gasPrice = await provider.eth.getGasPrice();
        const gasPriceGwei = Number(Web3.utils.fromWei(gasPrice, 'gwei'));
  
        return {
          low: Number((gasPriceGwei * 0.8).toFixed(2)).toString(), 
          standard: Number(gasPriceGwei.toFixed(2)).toString(), 
          fast: Number((gasPriceGwei * 1.2).toFixed(2)).toString(),
        };
      }
    } catch (error) {
      const gasPriceGwei = Number(Web3.utils.fromWei('21000', 'gwei'));
      return {
        low: Number((gasPriceGwei * 0.8).toFixed(2)).toString(),
        standard: Number(gasPriceGwei.toFixed(2)).toString(),
        fast: Number((gasPriceGwei * 1.2).toFixed(2)).toString(),
      };
    }
  }


  async transfer<T extends TransferParams>(params: T): Promise<string> {
    const { chain, type, ...transaction } = params;
  
    try {
      const provider = await this.getProvider(chain);
      const from = this.getAddress();
  
      let tx: any = { from };
      let data: string | undefined;
  
        // Use a type guard to narrow the type of `transaction`
      if (type === 'native') {
        const nativeTransaction = transaction as unknown as NativeTransaction;
        tx = this.buildNativeTx(from, nativeTransaction.to, nativeTransaction.amount);
      } else if (type === 'erc20') {
        const erc20Transaction = transaction as unknown as Erc20Transaction;
        data = await this.buildErc20Tx(provider, erc20Transaction);
      } else if (type === 'nft') {
        const nftTransaction = transaction as unknown as NftTransaction;
        data = await this.buildNftTx(provider, from, nftTransaction.to, nftTransaction);
      } else {
        throw new UnsupportedTransactionTypeError({ type });
      }
      if (data) {
        tx = {
          ...tx,
          //@ts-expect-error
          to: 'tokenAddress' in transaction ? transaction.tokenAddress : tx.to,
          data,
        };
      }
  
      tx.gas = await provider.eth.estimateGas(tx);
  
      // Add gas price if provided
      if ('maxFeePerGas' in transaction && 'maxPriorityFeePerGas' in transaction) {
        // EIP-1559 gas pricing
        tx.maxFeePerGas = Web3.utils.toWei(transaction.maxFeePerGas!.toString(), 'gwei');
        tx.maxPriorityFeePerGas = Web3.utils.toWei(transaction.maxPriorityFeePerGas!.toString(), 'gwei');
      } else if (transaction.gasPrice) {
        // Legacy gas pricing
        tx.gasPrice = Web3.utils.toWei(transaction.gasPrice.toString(), 'gwei');
      }
      const signedTx = await provider.eth.accounts.signTransaction(tx, this.getPrivateKey());
      const receipt = await provider.eth.sendSignedTransaction(signedTx.rawTransaction!);
  
      return receipt.transactionHash;
    } catch (error) {
      throw new TransferFailedError({ params, error });
    }
  }
  
  private buildNativeTx(from: string, to: string, amount: string) {
    return {
      from,
      to,
      value: Web3.utils.toWei(amount, 'ether'),
    };
  }
  
  private async buildErc20Tx(provider: Web3, transaction: Erc20Transaction): Promise<string> {
    const { to, amount, tokenAddress } = transaction;
    const contract = new provider.eth.Contract(ERC20_ABI as any, tokenAddress);
    const decimals = await contract.methods.decimals().call();
    const amountInWei = (Number(amount) * Number(10 ** decimals)).toString();
    return contract.methods.transfer(to, amountInWei).encodeABI();
  }
  
  private async buildNftTx(provider: Web3, from: string, to: string, transaction: NftTransaction): Promise<string> {
    const { tokenAddress, tokenId } = transaction;
    const contract = new provider.eth.Contract(ERC721_ABI as any, tokenAddress);
    return contract.methods.safeTransferFrom(from, to, tokenId).encodeABI();
  }
  

  async getProvider(network: chainType): Promise<Web3> {
    if (this.providerCached.has(network)) return this.providerCached.get(network) as Web3

    const networkData = this.getNetworkSync(network)
    if (!networkData || !networkData.rpc?.length) throw new Error(`RPC ${network} not supported`)

    const provider = new Web3(networkData.rpc[0])
    this.providerCached.set(network, provider)
    return provider
  }

  private getNetworkSync(network: chainType): NetworkConfig | undefined {
    return this.config?.networks.find((net: NetworkConfig) => net.shortName === network)
  }

  async create() {
    await this.init();
  }
}