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

//Transfer ERC-20
const trasnferNative = await wallet.transfer({
  chain: 'pol',
  type: 'native',
  transaction: {
    to: '0x8C835175FECa5491079d26F50E190aA0b3E1415B',
    amount: '0.001',
    gasPrice: Number(gas.standard),
  }
}),

//Transfer ERC-20
const trasnferERC20 = await wallet.transfer({
  chain: 'pol',
  type: 'erc20',
  transaction: {
    to: '0x8C835175FECa5491079d26F50E190aA0b3E1415B',
    tokenAddress: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"
    amount: '0.001',
    gasPrice: Number(gas.standard),
  },
});

//Transfer nft
const trasnferERC20 = await wallet.transfer({
  chain: 'pol',
  type: 'nft',
  transaction: {
    to: '0x8C835175FECa5491079d26F50E190aA0b3E1415B',
    tokenAddress: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"
    tokenId: ".....",
    amount: '0.001',
    gasPrice: Number(gas.standard),
  },
});
```
