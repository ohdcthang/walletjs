// Định nghĩa kiểu cho nativeCurrency
export interface NativeCurrency {
    name: string;
    symbol: string;
    decimals: number;
  }
  
  // Định nghĩa kiểu cho từng feature
  export interface Feature {
    name: string;
  }
  
  // Định nghĩa kiểu cho explorer
  export interface Explorer {
    name: string;
    url: string;
    standard: string;
  }
  
  // Define network
  export interface NetworkConfig {
    name: string;
    chain: string;
    icon: string;
    rpc: string[];
    faucets: string[];
    nativeCurrency: NativeCurrency;
    features: Feature[];
    infoURL: string;
    shortName: string;
    chainId: number;
    networkId: number;
    slip44: number;
    explorers: Explorer[];
    gasSponsorContract: string;
  }
  