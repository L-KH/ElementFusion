// QuestComponent.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useQuests, QuestInfo } from '../hooks/WriteContract';
import { useAccount } from 'wagmi';
import { useToast } from '@chakra-ui/react';
import Countdown from './Countdown'; // Add this import at the top of the file
import { waitForTransactionReceipt } from '@wagmi/core';
//----------------------------

// Animations
const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.5); }
  50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.8); }
  100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.5); }
`;

const rainbow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;
//-----new style:
const QuestContainer = styled.div`
  margin-top: 30px;
  padding: 30px;
  width: 100%;
`;

const QuestTitle = styled.h2`
  font-size: 24px;
  text-align: center;
  margin-top: 40px; // This adds space above the header
  margin-bottom: 20px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  font-weight: bold;
`;

const CategoryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
`;

const CategoryCard = styled.div<{ borderColor: string }>`
  border: 1px solid ${props => props.borderColor};
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 1px rgba(0,0,0,.05);
  border-top: 10px solid ${props => props.borderColor};
  max-height: 400px; // Set a maximum height
  display: flex;
  flex-direction: column;
`;

const CardBody = styled.div`
  padding: 1.25rem;
  overflow-y: auto; // Add vertical scroll
  flex-grow: 1;
`;


const CardHeader = styled.div`
  padding: 0.75rem 1.25rem;
  margin-bottom: 0;
  background-color: rgba(0,0,0,.03);
  border-bottom: 3px solid rgba(0,0,0,.125);
`;

const CardTitle = styled.h3`
  margin-bottom: 0;
  font-size: 1.1rem;
  text-align: center;
  font-weight: bold;
`;


// border-left: 5px solid ${props => {
//   switch (props.status) {
//     case 'active':
//     case 'completed':
//       return '#2eb85c'; // Green
//     case 'expired':
//       return '#e55353'; // Red
//     default:
//       return 'transparent';
//   }
// }}; ----- down--------
const QuestRow = styled.div<{ status: 'active' | 'completed' | 'expired' | 'upcoming' }>`
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;

  padding-left: 10px;
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;


const QuestName = styled.h4`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  //color: #333;
`;

const QuestInfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const QuestProgress = styled.span`
  font-size: 0.9rem;

`;

const QuestStatus = styled.span<{ status: 'active' | 'completed' | 'expired' | 'upcoming' }>`
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background-color: ${props => {
    switch (props.status) {
      case 'active':
        return '#02c795'; // Green
      case 'completed':
        return '#2eb85c'; // Green
      case 'expired':
        return '#e55353'; // Red
      case 'upcoming':
      default:
        return '#00d5ff'; // Blue (original color)
    }
  }};
  color: white;
`;


const QuestTimestamp = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const CompleteButton = styled.button`
  background-color: transparent;
  color: #321fdb;
  border: 1px solid #321fdb;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  width: 100%;
  font-weight: 400;
  text-align: center;

  &:hover {
    background-color: #321fdb;
    color: #fff;
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const RefreshButton = styled.button`
  background-color: #321fdb;
  color: #fff;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  display: block;
  margin: 0 auto 1.5rem;
  font-weight: 400;

  &:hover {
    background-color: #2a1ab9;
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const UserPoints = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 25px;
  text-align: center;
  color: #f1c40f;
  text-shadow: 0 0 10px rgba(241, 196, 15, 0.5);
  animation: ${rainbow} 5s linear infinite;
  background: linear-gradient(to right, #f1c40f, #e67e22, #e74c3c, #3498db, #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 500% 500%;
`;

const LoadingText = styled.p`
  font-style: italic;
  color: #666;
  text-align: center;
`;

const ErrorText = styled.p`
  color: #e55353;
  text-align: center;
`;

const EmptyQuestMessage = styled.p`
  color: #666;
  text-align: center;
  font-style: italic;
`;

// Styled Component

//----------------------------


interface Quest extends QuestInfo {
  progress: bigint;
  periodType: number;
  questId: number;
  isActive: boolean;
  isCompleted: boolean; // Add this line
}

const QuestComponent: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getQuestInfo, getUserQuestProgress, completeQuest, getUserPoints } = useQuests();
  const { address } = useAccount();
  const toast = useToast();
  const fetchingRef = useRef(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [userPoints, setUserPoints] = useState<bigint>(0n);


  const fetchQuests = useCallback(async () => {
    if (!address || fetchingRef.current) {
      return;
    }
  
    fetchingRef.current = true;
    setLoading(true);
    setError(null);
  
    try {
      const questTypes = [
        { periodType: 0, name: "Daily Quest" },
        { periodType: 1, name: "Weekly Quest" },
        { periodType: 2, name: "Monthly Quest" },
        { periodType: 3, name: "Yearly Quest" },
      ];
  
      const allQuests: Quest[] = [];
      const currentTime = BigInt(Math.floor(Date.now() / 1000));
  
      for (const { periodType } of questTypes) {
        let questId = 0;
        let emptyQuestCount = 0;
  
        while (emptyQuestCount < 2 && questId < 10) {
          try {
            const questInfo = await getQuestInfo(periodType, questId);
  
            if (questInfo.name === "" && questInfo.startTime === 0n && questInfo.endTime === 0n) {
              emptyQuestCount++;
              questId++;
              continue;
            }
  
            emptyQuestCount = 0;
  
            const progress = await getUserQuestProgress(periodType, questId);
            const isActive = currentTime >= questInfo.startTime && currentTime <= questInfo.endTime;
            const isUpcoming = currentTime < questInfo.startTime;
            const isCompleted = progress >= questInfo.requiredCount; // Add this line
  
            allQuests.push({
              ...questInfo,
              progress,
              periodType,
              questId,
              isActive,
              isCompleted, // Add this line
            });
  
            questId++;
          } catch (error) {
            console.error(`Error fetching quest for periodType: ${periodType}, questId: ${questId}`, error);
            emptyQuestCount++;
            questId++;
          }
        }
      }
  
      //console.log("All quests fetched:", allQuests);
      setQuests(allQuests);
  
      // Fetch user points
      const points = await getUserPoints();
      setUserPoints(points);
  
    } catch (error: any) {
      console.error("Error fetching quests:", error);
      setError(error.message || "Failed to fetch quests");
      toast({
        title: "Error fetching quests",
        description: error.message || "Unknown error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [address, getQuestInfo, getUserQuestProgress, getUserPoints, toast]);
  

  const manualRefresh = useCallback(() => {
    setLastRefresh(Date.now());
  }, []);

  useEffect(() => {
    if (address) {
      fetchQuests();
    }
  }, [address, lastRefresh]);

  const handleCompleteQuest = useCallback(async (periodType: number, questId: number) => {
    if (!address) return;
  
    try {
      const { txHash, receipt, updatedProgress } = await completeQuest(periodType, questId);
      toast({
        title: "Quest completed",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      // Update the quest status locally
      setQuests(prevQuests => prevQuests.map(quest => 
        quest.periodType === periodType && quest.questId === questId
          ? { ...quest, progress: updatedProgress }
          : quest
      ));
  
      // Fetch updated user points
      const updatedPoints = await getUserPoints();
      setUserPoints(updatedPoints);
  
      // Trigger a refresh of all quests
      manualRefresh();
  
    } catch (error: any) {
      console.error("Error completing quest:", error);
      let errorMessage = "Unable to complete quest. Please try again later.";
  
      if (error.message.includes("Quest requirements not met")) {
        errorMessage = "Quest requirements not met. Please check the quest conditions and try again.";
      } else if (error.message.includes("Quest is not active")) {
        errorMessage = "This quest is not currently active. Please check the quest status and try again.";
      }
  
      toast({
        title: "Failed to complete quest",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [address, completeQuest, getUserPoints, toast, manualRefresh]);
  
  
  
  
  


  const renderQuestCategory = (periodType: number, categoryName: string, quests: Quest[], handleCompleteQuest: (periodType: number, questId: number) => void, color: string) => {
    const currentTime = BigInt(Math.floor(Date.now() / 1000));
    const categoryQuests = quests.filter(quest => quest.periodType === periodType);
    
    //console.log(`Rendering ${categoryName}:`, categoryQuests);
    
    return (
      <CategoryCard key={periodType} borderColor={color}>
        <CardHeader>
          <CardTitle>{categoryName}</CardTitle>
        </CardHeader>
        <CardBody>
          {categoryQuests.length === 0 ? (
            <EmptyQuestMessage>No quests available.</EmptyQuestMessage>
          ) : (
            categoryQuests.map((quest, index) => {
              const isActive = currentTime >= quest.startTime && currentTime <= quest.endTime;
              const isCompleted = quest.progress > quest.requiredCount;
              const isExpired = currentTime > quest.endTime;
              const isUpcoming = currentTime < quest.startTime;
  
              let status: 'active' | 'completed' | 'expired' | 'upcoming';
              if (isCompleted) status = 'completed';
              else if (isActive) status = 'active';
              else if (isExpired) status = 'expired';
              else status = 'upcoming';
  
              return (
                <QuestRow key={index} status={status}>
                  <QuestName>{quest.name}</QuestName>
                  <QuestInfoWrapper>
                    <QuestProgress>Progress: {String(quest.progress)} / {String(quest.requiredCount)}</QuestProgress>
                    <QuestStatus status={status}>
                      {isCompleted ? 'Completed' : (isActive ? 'Active' : (isExpired ? 'Expired' : 'Upcoming'))}
                    </QuestStatus>
                  </QuestInfoWrapper>
                  <QuestTimestamp>
                    {isActive ? (
                      <>Ends in: <Countdown endTime={quest.endTime} /></>
                    ) : (
                      currentTime < quest.startTime ? (
                        <>Starts in: <Countdown endTime={quest.startTime} /></>
                      ) : (
                        isCompleted ? 'Completed' : 'Expired'
                      )
                    )}
                  </QuestTimestamp>
                  {isActive && !isCompleted && (
                    <CompleteButton
                      onClick={() => handleCompleteQuest(quest.periodType, quest.questId)}
                    >
                      Check
                    </CompleteButton>
                  )}
                  {(isCompleted || isExpired) && (
                    <CompleteButton disabled>
                      {isCompleted ? 'Completed' : 'Expired'}
                    </CompleteButton>
                  )}
                </QuestRow>
              );
            })
          )}
        </CardBody>
      </CategoryCard>
    );
  };
  
  
  
  
  

  


  if (!address) {
    return (
      <QuestContainer>
        <QuestTitle>Quests</QuestTitle>
        <p>Please connect your wallet to view quests.</p>
      </QuestContainer>
    );
  }

  
  return (
    <QuestContainer>
      <QuestTitle>Epic Quests</QuestTitle>
      {/* <UserPoints>Your Points: {userPoints.toString()}</UserPoints> */}
      <RefreshButton onClick={manualRefresh} disabled={loading}>Refresh Quests</RefreshButton>
  
      {loading && <LoadingText>Loading epic quests...</LoadingText>}
      {error && <ErrorText>Quest Error: {error}</ErrorText>}
      {!loading && !error && (
        <CategoryContainer>
          {renderQuestCategory(0, "Daily Challenges", quests, handleCompleteQuest, "#321fdb")}
          {renderQuestCategory(1, "Weekly Missions", quests, handleCompleteQuest, "#2eb85c")}
          {renderQuestCategory(2, "Monthly Epics", quests, handleCompleteQuest, "#e55353")}
          {renderQuestCategory(3, "Yearly Legends", quests, handleCompleteQuest, "#f9b115")}
        </CategoryContainer>
      )}
    </QuestContainer>
  );
};

export default QuestComponent;