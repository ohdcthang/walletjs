import axios from "axios"
import { NetworkConfig } from "wallet-type"

export const fetchNetworks = async (): Promise<NetworkConfig[]> => { 
    try {
        const { data } = await axios.get("https://raw.githubusercontent.com/ohdcthang/network/refs/heads/main/network.json")
        return data
    } catch (error) {
        throw new Error("Failed to fetch networks")
    }
}