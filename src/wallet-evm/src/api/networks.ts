import axios from "axios"
import { NetworkConfig } from "wallet-type"

export const fetchNetworks = async (): Promise<NetworkConfig[]> => { 
    try {
        const { data } = await axios.get("https://chainid.network/chains.json")
        return data
    } catch (error) {
        throw new Error("Failed to fetch networks")
    }
}