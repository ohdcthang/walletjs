import { WalletCore } from 'wallet-core'
import type { Wallet, NetworkConfig, chainType, GetBalanceParams, GetTokensParams, TokenInfo, TokenListResponse, EstimateGasParams, EstimateGasResponse, TransferParams, NftListResponse, GetNftsParams } from 'wallet-type'
import { fetchNetworks, fetchNftsList, fetchTokenList } from './api'
import Web3 from 'web3'
import { mnemonicToSeedSync, validateMnemonic } from 'bip39'
import { hdkey, Wallet as hdWallet } from '@ethereumjs/wallet';
import { ERC20_ABI, ERC721_ABI } from './constants'
import { get } from 'lodash-es'
// import { ERC20_ABI } from './constants'

export class EvmWallet extends WalletCore<any>{
  static instance: EvmWallet
  public networks: NetworkConfig[] = []
  private providerCached: Map<chainType, Web3> = new Map()
  
  constructor(wallet: Wallet) {
    super(wallet)

    if (EvmWallet.instance) return EvmWallet.instance
    EvmWallet.instance = this
  }

  static fromMnemonic(mnemonic: string, path = '60') {
    if (!validateMnemonic(mnemonic)) throw new Error('Invalid mnemonic')

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
      await this.init()
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

  async estimateGas<T extends EstimateGasParams>(params: T): Promise<EstimateGasResponse> {
    const { chain } = params

    try {
      await this.init()
      const provider = await this.getProvider(chain)
      const gasPriceWei = await provider.eth.getGasPrice(); // Giá gas mặc định từ mạng (Wei)

      const gasPriceGwei = Number(Web3.utils.fromWei(gasPriceWei, 'gwei'));

      return {
        low: Number((gasPriceGwei * 0.8).toFixed(2)),     // 80% của standard
        standard: Number(gasPriceGwei.toFixed(2)),        // Standard gas price
        fast: Number((gasPriceGwei * 1.2).toFixed(2))     // 120% của standard
      };

    } catch (error) {
      const gasPriceGwei = Number(Web3.utils.fromWei('21000', 'gwei'))

      return {
        low: Number((gasPriceGwei * 0.8).toFixed(2)),     // 80% của standard
        standard: Number(gasPriceGwei.toFixed(2)),        // Standard gas price
        fast: Number((gasPriceGwei * 1.2).toFixed(2))     // 120% của standard
      }
    }
  }

  async transfer<T extends TransferParams>(params: T): Promise<string> {
    const { chain, type, transaction } = params
    const {to, gasPrice, amount} = transaction

    try {
      await this.init()
      const provider = await this.getProvider(chain)

      let tx: any;
      let data: string | undefined;

      const from = this.getAddress();

      if(type === 'native') {
        tx = {
          from,
          to,
          value: Web3.utils.toWei(amount, 'ether'),
        };
      }

      if(type === 'erc20') {
        const contract = new provider.eth.Contract(ERC20_ABI as any, params.transaction.tokenAddress);
        const decimals = await contract.methods.decimals().call();
        const amountInWei = (Number(amount) * Number(10 ** decimals)).toString();
        data = contract.methods.transfer(to, amountInWei).encodeABI();
      }

      if(type === 'nft') {
        const contract = new provider.eth.Contract(ERC721_ABI as any, params.transaction.tokenAddress);
        data = contract.methods.safeTransferFrom(from, to, params.transaction.tokenId).encodeABI();
      }

      if (data) {
        tx = {
          from,
          to: params.transaction.tokenAddress,
          data
        };
      }

      tx.gas = await provider.eth.estimateGas(tx);
      tx.gasPrice = Web3.utils.toWei(gasPrice.toString(), 'gwei');

      const privateKey = this.getPrivateKey();

      const signedTx = await provider.eth.accounts.signTransaction(tx, privateKey);
      const { transactionHash } = await provider.eth.sendSignedTransaction(signedTx.rawTransaction as string);

      return transactionHash

    } catch (error) {
        throw new Error('Transaction failed');
    }
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