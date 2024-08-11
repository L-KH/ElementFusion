// WriteContract.tsx
import { writeContract } from '@wagmi/core'
import { useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { addresses } from '@/constants/config'
import { wagmiConfig } from '@/wagmi'
import NFTAbi from './abi/NFT2.json'


export const useMint = () => {
  const account = useAccount()

  const handleMint = async (name: string, rarity: number) => {
    try {
      const chainId = account.chainId || 11155111 // Sepolia Testnet
      const NFTAddress = addresses[chainId]?.nft?.address

      if (!NFTAddress) {
        throw new Error("NFT address not found")
      }

      const rarityPrices = [
        parseEther('0.00001'), // common
        parseEther('0.00005'), // uncommon
        parseEther('0.0001'),  // rare
        parseEther('0.0005'),   // epic
        parseEther('0.005'),     // legendary
        parseEther('0.01')     // legendary
      ];

      const price = rarityPrices[rarity];

      if (!price) {
        throw new Error("Invalid rarity");
      }

      // Fetch the metadata from the local JSON file
      const response = await fetch(`/nft-metadata/${name.replace(' ', '%20')}.json`);
      const metadata = await response.json();

      // Encode the entire metadata as base64
      const encodedMetadata = btoa(JSON.stringify(metadata));
      const tokenURI = `data:application/json;base64,${encodedMetadata}`;

      console.log("Minting with parameters:", { name, rarity, tokenURI, price: price.toString() });

      const tx = await writeContract(wagmiConfig, {
        address: NFTAddress as `0x${string}`,
        abi: NFTAbi as any,
        functionName: 'mintElement',
        args: [name, rarity, tokenURI],
        value: price,
      })
      
      console.log("Transaction submitted:", tx);
      
      return tx // This should be the transaction hash
      
    } catch (error) {
      console.error("Error in handleMint:", error)
      throw error
    }
  }

  return { handleMint }
}