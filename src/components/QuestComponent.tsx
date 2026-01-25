// QuestComponent.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useQuests, QuestInfo } from '../hooks/WriteContract';
import { useAccount } from 'wagmi';
import { useToast } from '@chakra-ui/react';
import Countdown from './Countdown';
import { waitForTransactionReceipt } from '@wagmi/core';
import { parseBlockchainError } from '../utils/errorHandler';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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

const QuestContainer = styled.div`
  margin-top: 30px;
  padding: 30px;
  width: 100%;
`;

const QuestTitle = styled.h2`
  font-size: 24px;
  text-align: center;
  margin-top: 40px;
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
  max-height: 400px;
  display: flex;
  flex-direction: column;
`;

const CardBody = styled.div`
  padding: 1.25rem;
  overflow-y: auto;
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
        return '#02c795';
      case 'completed':
        return '#2eb85c';
      case 'expired':
        return '#e55353';
      case 'upcoming':
      default:
        return '#00d5ff';
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

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const RefreshButton = styled.button`
  background-color: #321fdb;
  color: #fff;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  font-weight: 400;

  &:hover {
    background-color: #2a1ab9;
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const ToggleExpiredButton = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${props => props.isActive ? '#e55353' : 'transparent'};
  color: ${props => props.isActive ? '#fff' : '#e55353'};
  border: 1px solid #e55353;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  font-weight: 400;

  &:hover {
    background-color: ${props => props.isActive ? '#d64545' : 'rgba(229, 83, 83, 0.1)'};
  }

  svg {
    font-size: 14px;
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

const ExpiredCount = styled.span`
  font-size: 0.75rem;
  opacity: 0.8;
  margin-left: 5px;
`;

interface Quest extends QuestInfo {
  progress: bigint;
  periodType: number;
  questId: number;
  isActive: boolean;
  isCompleted: boolean;
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
  const [showExpired, setShowExpired] = useState(false);

  const fetchQuests = useCallback(async () => {
    if (!address || fetchingRef.current) {
      return;
    }
  
    fetchingRef.current = true;
    setLoading(true);
    setError(null);
  
    try {
      // Removed Daily Quest (periodType: 0) from the list
      const questTypes = [
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
            const isCompleted = progress >= questInfo.requiredCount;
  
            allQuests.push({
              ...questInfo,
              progress,
              periodType,
              questId,
              isActive,
              isCompleted,
            });
  
            questId++;
          } catch (error) {
            console.error(`Error fetching quest for periodType: ${periodType}, questId: ${questId}`, error);
            emptyQuestCount++;
            questId++;
          }
        }
      }
  
      setQuests(allQuests);
  
      const points = await getUserPoints();
      setUserPoints(points);
  
    } catch (error: any) {
      console.error("Error fetching quests:", error);
      const parsedError = parseBlockchainError(error);
      setError(parsedError.description);
      toast({
        title: parsedError.title,
        description: parsedError.description,
        status: parsedError.status,
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
        title: "Quest Completed! 🎉",
        description: "Congratulations! You've earned your reward.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      setQuests(prevQuests => prevQuests.map(quest => 
        quest.periodType === periodType && quest.questId === questId
          ? { ...quest, progress: updatedProgress }
          : quest
      ));
  
      const updatedPoints = await getUserPoints();
      setUserPoints(updatedPoints);
  
      manualRefresh();
  
    } catch (error: any) {
      console.error("Error completing quest:", error);
      const parsedError = parseBlockchainError(error);
      
      toast({
        title: parsedError.title,
        description: parsedError.description,
        status: parsedError.status,
        duration: 5000,
        isClosable: true,
      });
    }
  }, [address, completeQuest, getUserPoints, toast, manualRefresh]);

  // Count expired quests
  const getExpiredQuestsCount = useCallback((periodType: number) => {
    const currentTime = BigInt(Math.floor(Date.now() / 1000));
    return quests.filter(quest => 
      quest.periodType === periodType && 
      currentTime > quest.endTime &&
      quest.progress < quest.requiredCount
    ).length;
  }, [quests]);

  const totalExpiredCount = quests.filter(quest => {
    const currentTime = BigInt(Math.floor(Date.now() / 1000));
    return currentTime > quest.endTime && quest.progress < quest.requiredCount;
  }).length;

  const renderQuestCategory = (
    periodType: number, 
    categoryName: string, 
    quests: Quest[], 
    handleCompleteQuest: (periodType: number, questId: number) => void, 
    color: string
  ) => {
    const currentTime = BigInt(Math.floor(Date.now() / 1000));
    let categoryQuests = quests.filter(quest => quest.periodType === periodType);
    
    // Filter out expired quests if showExpired is false
    if (!showExpired) {
      categoryQuests = categoryQuests.filter(quest => {
        const isExpired = currentTime > quest.endTime;
        const isCompleted = quest.progress >= quest.requiredCount;
        return !isExpired || isCompleted; // Show completed quests even if expired
      });
    }
    
    const expiredCount = getExpiredQuestsCount(periodType);
    
    return (
      <CategoryCard key={periodType} borderColor={color}>
        <CardHeader>
          <CardTitle>
            {categoryName}
            {!showExpired && expiredCount > 0 && (
              <ExpiredCount>({expiredCount} expired hidden)</ExpiredCount>
            )}
          </CardTitle>
        </CardHeader>
        <CardBody>
          {categoryQuests.length === 0 ? (
            <EmptyQuestMessage>
              {!showExpired && expiredCount > 0 
                ? `${expiredCount} expired quest${expiredCount > 1 ? 's' : ''} hidden. Click "Show Expired" to view.`
                : 'No quests available.'
              }
            </EmptyQuestMessage>
          ) : (
            categoryQuests.map((quest, index) => {
              const isActive = currentTime >= quest.startTime && currentTime <= quest.endTime;
              const isCompleted = quest.progress >= quest.requiredCount;
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
                      Check Progress
                    </CompleteButton>
                  )}
                  {(isCompleted || isExpired) && (
                    <CompleteButton disabled>
                      {isCompleted ? '✓ Completed' : 'Expired'}
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
        <QuestTitle>Epic Quests</QuestTitle>
        <EmptyQuestMessage>Please connect your wallet to view quests.</EmptyQuestMessage>
      </QuestContainer>
    );
  }

  return (
    <QuestContainer>
      <QuestTitle>Epic Quests</QuestTitle>
      <ButtonsContainer>
        <RefreshButton onClick={manualRefresh} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Quests'}
        </RefreshButton>
        <ToggleExpiredButton 
          isActive={showExpired} 
          onClick={() => setShowExpired(!showExpired)}
        >
          {showExpired ? <FaEyeSlash /> : <FaEye />}
          {showExpired ? 'Hide Expired' : 'Show Expired'}
          {totalExpiredCount > 0 && !showExpired && (
            <ExpiredCount>({totalExpiredCount})</ExpiredCount>
          )}
        </ToggleExpiredButton>
      </ButtonsContainer>
  
      {loading && <LoadingText>Loading epic quests...</LoadingText>}
      {error && <ErrorText>{error}</ErrorText>}
      {!loading && !error && (
        <CategoryContainer>
          {/* Removed Daily Challenges (periodType 0) */}
          {renderQuestCategory(1, "Weekly Missions", quests, handleCompleteQuest, "#2eb85c")}
          {renderQuestCategory(2, "Monthly Epics", quests, handleCompleteQuest, "#e55353")}
          {renderQuestCategory(3, "Yearly Legends", quests, handleCompleteQuest, "#f9b115")}
        </CategoryContainer>
      )}
    </QuestContainer>
  );
};

export default QuestComponent;
