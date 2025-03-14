import axios from "axios";
import { NftItem } from "wallet-type";

const moralisClient = axios.create({
    baseURL: 'https://deep-index.moralis.io/api/',
    headers: {
        'X-API-Key': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjNmNGI1YTAyLTY2NzEtNDQ3Yy1hMGE3LWM5MDIzZmRjZDQ4YSIsIm9yZ0lkIjoiNDM2MzExIiwidXNlcklkIjoiNDQ4ODYyIiwidHlwZUlkIjoiMmIxMjM2MDktY2Y1Ni00MzU2LWFkOGYtM2Q1ZDNjMDkyOTY2IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDE5NDIzMzksImV4cCI6NDg5NzcwMjMzOX0.tM3870du9tZAlf7RUK4717gUF7GhIWnQU87O13--rr0"
    }
})

export const fetchTokenList = async (chain: string, address: string) => {
    try {
        const {data} = await moralisClient.get(`/v2.2/${address}/erc20?chain=${chain}`)

        return data
    } catch (error) {
        throw new Error(error as string)
    }
}

export const fetchNftsList = async (chain: string, address: string): Promise<NftItem[]> => {
    try {
        const {data} = await moralisClient.get(`/v2.2/${address}/erc20?chain=${chain}`)

        return data
    } catch (error) {
        throw new Error(error as string)
    }
}