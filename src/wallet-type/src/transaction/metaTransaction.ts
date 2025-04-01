export interface SignMetaTransaction {
    rpcUrl: string
    privateKey: string
    from: string, 
    to: string, 
    amount: string,
    nonce: string | number, 
    gasSponsorContract: string,
}