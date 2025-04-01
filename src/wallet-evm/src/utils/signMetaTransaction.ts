import { ethers } from "ethers";
import { SignMetaTransaction } from "wallet-type";

export const signMetaTransaction = async (params: SignMetaTransaction) => {
    const { gasSponsorContract, privateKey, from, to, amount, nonce, rpcUrl} = params
    const domain = {
        name: "GasSponsoredTokenSender",
        version: "1",
        chainId: 137, // Chain ID của Sepolia
        verifyingContract: gasSponsorContract
    };

    const types = {
        MetaTransaction: [
            { name: "from", type: "address" },
            { name: "to", type: "address" },
            { name: "amount", type: "uint256" },
            { name: "nonce", type: "uint256" }
        ]
    };

    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey.replace('0x', ''), provider); // Người dùng ký giao dịch

    const value = { from, to, amount, nonce };
    const signature = await wallet._signTypedData(domain, types, value);

    const { v, r, s } = ethers.utils.splitSignature(signature);
    return { v, r, s };
}