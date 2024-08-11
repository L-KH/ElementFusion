export interface ContractConfig {
    nft: {
      address: string;
    };
  }
  
  export interface Config {
    [key: string]: ContractConfig;
  }
  export interface Element {
    name: string;
    rarity: string;
    imagePath: string;
    combination?: string;
    // Add any other properties your Element type might have
  }