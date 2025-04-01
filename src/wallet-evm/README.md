# WALLET EVM LIBRARY

Tụi tui làm Ví

> This TSDX setup is meant for developing libraries (not apps!) that can be published to NPM. If you’re looking to build a Node app, you could use `ts-node-dev`, plain `ts-node`, or simple `tsc`.

> If you’re new to TypeScript, checkout [this handy cheatsheet](https://devhints.io/typescript)

## Commands

To install, use:

```bash
npm i victoria-wallet-evm # or yarn add wallet-evm
```

```ts
const mnemonic = 'woman dirt weather ugly success.......';
const privateKey = 'c9467b2296a3ebd7757b0......';

const wallet = EvmWallet.fromPrivateKey(privateKey);
//Or
const wallet = EvmWallet.fromMnemonic(mnemonic);

//Get tokens
const tokens = await wallet.getTokens({ chain: 'pol' });

//Get balance
const balance = await wallet.getBalance({ chain: 'pol' });

//Gas
const gasPriceStep = wallet.estimateGas({ chain: 'pol' });

//Transfer
const nativeTransfer: TransferParams = {
  type: 'native',
  to: '0xRecipientAddress',
  amount: '0.001',
    eip1559: {
    maxFeePerGas: gas.eip1559?.maxFeePerGas,
    maxPriorityFeePerGas: gas.eip1559?.maxPriorityFeePerGas,
  }
  gasPrice: gas.standard,
  chain: 'pol',
};

const erc20Transfer: TransferParams = {
  type: 'erc20',
  to: '0xRecipientAddress',
  token: {}
  amount: '0.001',
  eip1559: {
    maxFeePerGas: gas.eip1559?.maxFeePerGas,
    maxPriorityFeePerGas: gas.eip1559?.maxPriorityFeePerGas,
  }
  gasPrice: gas.standard,
  chain: 'pol',
};

const nftTransfer: TransferParams = {
  type: 'nft',
  to: '0xRecipientAddress',
  nft: {},
  eip1559: {
    maxFeePerGas: gas.eip1559?.maxFeePerGas,
    maxPriorityFeePerGas: gas.eip1559?.maxPriorityFeePerGas,
  }
  gasPrice: gas.standard,
  chain: 'pol',
};

const tx = await wallet.transfer(
  nativeTransfer || erc20Transfer || nftTransfer
);
```
