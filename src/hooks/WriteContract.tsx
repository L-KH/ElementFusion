// WriteContract.tsx
import { writeContract, readContract } from '@wagmi/core'
import { useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { addresses } from '@/constants/config'
import { wagmiConfig } from '@/wagmi'
import NFTAbi from './abi/NFT2.json'
import { waitForTransactionReceipt } from '@wagmi/core'

export const useMint = () => {
  const account = useAccount()

  const handleMint = async (name: string, rarity: number) => {
    try {
      const chainId = account.chainId || 534351 // Sepolia Testnet
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
        parseEther('0.05')     // hidden
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

      //console.log("Minting with parameters:", { name, rarity, tokenURI, price: price.toString() });

      const tx = await writeContract(wagmiConfig, {
        address: NFTAddress as `0x${string}`,
        abi: NFTAbi as any,
        functionName: 'mintElement',
        args: [name, rarity, tokenURI],
        value: price,
      })
      
      //console.log("Transaction submitted:", tx);
      
      return tx // This should be the transaction hash
      
    } catch (error) {
      console.error("Error in handleMint:", error)
      throw error
    }
  }

  return { handleMint }
}

export const useHintPurchase = () => {
  const account = useAccount()

  const handleHintPurchase = async (isPremium: boolean) => {
    try {
      const chainId = account.chainId || 534351 // Sepolia Testnet
      const NFTAddress = addresses[chainId]?.nft?.address

      if (!NFTAddress) {
        throw new Error("NFT address not found")
      }

      const price = isPremium ? parseEther('0.002') : parseEther('0.001');

      //console.log("Purchasing hint package:", { isPremium, price: price.toString() });

      const tx = await writeContract(wagmiConfig, {
        address: NFTAddress as `0x${string}`,
        abi: NFTAbi as any,
        functionName: 'purchaseHintPackage',
        args: [isPremium],
        value: price,
      })
      
      //console.log("Transaction submitted:", tx);
      
      return tx // This should be the transaction hash
      
    } catch (error) {
      //console.error("Error in handleHintPurchase:", error)
      throw error
    }
  }

  return { handleHintPurchase }
}



export interface QuestInfo {
  name: string;
  startTime: bigint;
  endTime: bigint;
  requiredCount: bigint;
  rewardPoints: bigint;
  rarityRequirement: bigint;
}

export const useQuests = () => {
  const account = useAccount()

  const getQuestInfo = async (periodType: number, questId: number): Promise<QuestInfo> => {
    try {
      const chainId = account.chainId || 534351 // Sepolia Testnet
      const NFTAddress = addresses[chainId]?.nft?.address

      if (!NFTAddress) {
        throw new Error("NFT address not found")
      }

     // console.log(`Calling getQuestInfo with periodType: ${periodType}, questId: ${questId}`);
      const questInfo = await readContract(wagmiConfig, {
        address: NFTAddress as `0x${string}`,
        abi: NFTAbi as any,
        functionName: 'getQuestInfo',
        args: [periodType, questId],
      }) as QuestInfo

     // console.log("Quest info received:", questInfo);
      return questInfo
    } catch (error) {
     // console.error("Error in getQuestInfo:", error)
      throw error
    }
  }
  const getUserPoints = async (): Promise<bigint> => {
    try {
      const chainId = account.chainId || 534351 // Sepolia Testnet
      const NFTAddress = addresses[chainId]?.nft?.address
      const userAddress = account.address
  
      if (!NFTAddress) {
        throw new Error("NFT address not found")
      }
  
      if (!userAddress) {
        throw new Error("User address not found")
      }
  
      //console.log(`Calling getUserPoints for userAddress: ${userAddress}`);
      const points = await readContract(wagmiConfig, {
        address: NFTAddress,
        abi: NFTAbi as any,
        functionName: 'userPoints',
        args: [userAddress],
      })
  
      //console.log(`User points:`, points);
      return points as bigint
    } catch (error) {
     // console.error("Error in getUserPoints:", error)
      throw error
    }
  }
  
  const getUserQuestProgress = async (periodType: number, questId: number): Promise<bigint> => {
    try {
      const chainId = account.chainId || 534351 // Sepolia Testnet
      const NFTAddress = addresses[chainId]?.nft?.address
      const userAddress = account.address

      if (!NFTAddress) {
        throw new Error("NFT address not found")
      }

      if (!userAddress) {
        throw new Error("User address not found")
      }

      //console.log(`Calling getUserQuestProgress with userAddress: ${userAddress}, periodType: ${periodType}, questId: ${questId}`);
      const progress = await readContract(wagmiConfig, {
        address: NFTAddress,
        abi: NFTAbi as any,
        functionName: 'getUserQuestProgress',
        args: [userAddress, periodType, questId],
      })

     // console.log(`User progress for periodType: ${periodType}, questId: ${questId}:`, progress);
      return progress as bigint
    } catch (error) {
    //  console.error("Error in getUserQuestProgress:", error)
      throw error
    }
  }

  const completeQuest = async (periodType: number, questId: number) => {
    try {
      const chainId = account.chainId || 534351 // Sepolia Testnet
      const NFTAddress = addresses[chainId]?.nft?.address
  
      if (!NFTAddress) {
        throw new Error("NFT address not found")
      }
  
      const txHash = await writeContract(wagmiConfig, {
        address: NFTAddress as `0x${string}`,
        abi: NFTAbi as any,
        functionName: 'completeQuest',
        args: [periodType, questId],
      })
  
      console.log("Quest completion transaction submitted:", txHash);
  
      // Wait for the transaction to be mined
      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: txHash,
      })
  
      console.log("Transaction receipt:", receipt);
  
      // Update the local quest progress
      const updatedProgress = await getUserQuestProgress(periodType, questId);
      return { txHash, receipt, updatedProgress };
    } catch (error) {
      console.error("Error in completeQuest:", error)
      throw error
    }
  }

  return { getQuestInfo, getUserQuestProgress, completeQuest, getUserPoints }
}