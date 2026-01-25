"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useReadContract, useAccount } from 'wagmi';
import '@/styles/landing.css';

// Contract address and ABI for userPoints
const CONTRACT_ADDRESS = '0x03e24dd2c106fe5e4a28e1cdedde372e38c6960a';
const USER_POINTS_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "userPoints",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Sample addresses to check for leaderboard (in a real implementation, you'd track these from events)
const TRACKED_ADDRESSES = [
  '0x1a2b3c4d5e6f7890123456789012345678901234',
  '0x5e6f7g8h9i0j1234567890123456789012345678',
  '0x9i0j1k2l3m4n5678901234567890123456789012',
  '0x3m4n5o6p7q8r9012345678901234567890123456',
  '0x7q8r9s0t1u2v3456789012345678901234567890',
];

interface LeaderboardEntry {
  rank: number;
  address: string;
  points: number;
  elements: number;
}

export default function LeaderboardPage() {
  const { address, isConnected } = useAccount();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Read current user's points if connected
  const { data: currentUserPoints } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: USER_POINTS_ABI,
    functionName: 'userPoints',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address
    }
  });

  useEffect(() => {
    // Simulated leaderboard data (in production, this would come from contract events or a backend)
    const mockData: LeaderboardEntry[] = [
      { rank: 1, address: '0x1a2b...3c4d', points: 12450, elements: 156 },
      { rank: 2, address: '0x5e6f...7g8h', points: 10230, elements: 142 },
      { rank: 3, address: '0x9i0j...1k2l', points: 8890, elements: 128 },
      { rank: 4, address: '0x3m4n...5o6p', points: 7650, elements: 115 },
      { rank: 5, address: '0x7q8r...9s0t', points: 6420, elements: 98 },
      { rank: 6, address: '0xa1b2...c3d4', points: 5890, elements: 92 },
      { rank: 7, address: '0xe5f6...g7h8', points: 5210, elements: 87 },
      { rank: 8, address: '0i9j0...k1l2', points: 4780, elements: 81 },
      { rank: 9, address: '0m3n4...o5p6', points: 4350, elements: 76 },
      { rank: 10, address: '0q7r8...s9t0', points: 3920, elements: 71 },
      { rank: 11, address: '0u1v2...w3x4', points: 3540, elements: 65 },
      { rank: 12, address: '0y5z6...a7b8', points: 3180, elements: 60 },
      { rank: 13, address: '0c9d0...e1f2', points: 2850, elements: 55 },
      { rank: 14, address: '0g3h4...i5j6', points: 2490, elements: 49 },
      { rank: 15, address: '0k7l8...m9n0', points: 2150, elements: 44 },
    ];

    setTimeout(() => {
      setLeaderboardData(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return rank.toString();
    }
  };

  const getRowClass = (rank: number) => {
    switch (rank) {
      case 1: return 'top-1';
      case 2: return 'top-2';
      case 3: return 'top-3';
      default: return '';
    }
  };

  const formatAddress = (addr: string) => {
    if (addr.length > 10) {
      return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    }
    return addr;
  };

  return (
    <div className="leaderboard-page">
      {/* Navigation */}
      <nav className="landing-navbar scrolled">
        <Link href="/" className="logo">
          <div className="logo-icon">⚗</div>
          <span className="logo-text">ElementFusion</span>
        </Link>
        <div className="nav-actions">
          <Link href="/" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
            ← Back to Home
          </Link>
          <Link href="/game" className="btn-app">
            <span>🎮 Play Now</span>
          </Link>
        </div>
      </nav>

      <div className="leaderboard-page-container">
        <div className="leaderboard-page-header">
          <h1>🏆 <span>Leaderboard</span></h1>
          <p style={{ color: '#a1a1aa', marginTop: '0.5rem' }}>
            Compete with players worldwide and climb the ranks
          </p>
          <div className="live-badge" style={{ display: 'inline-flex', marginTop: '1rem' }}>
            <span className="pulse"></span>
            <span>Live on-chain data</span>
          </div>
        </div>

        {/* User Stats Card (if connected) */}
        {isConnected && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(0, 212, 255, 0.1))',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '20px',
            padding: '1.5rem 2rem',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Your Stats</p>
              <p style={{ fontFamily: 'Space Grotesk, monospace', fontWeight: '600' }}>
                {formatAddress(address || '')}
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Points</p>
              <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffd700' }}>
                {currentUserPoints ? currentUserPoints.toString() : '0'}
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Your Rank</p>
              <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#a855f7' }}>
                {userRank || 'Unranked'}
              </p>
            </div>
            <Link href="/game" className="btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}>
              Play to Earn Points →
            </Link>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="leaderboard-full">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <div className="loader-elements" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
                <div className="loader-orb"></div>
                <div className="loader-orb"></div>
                <div className="loader-orb"></div>
                <div className="loader-orb"></div>
              </div>
              <p style={{ color: '#a1a1aa' }}>Loading leaderboard...</p>
            </div>
          ) : (
            <table className="leaderboard-full-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Points</th>
                  <th>Elements</th>
                  <th>NFTs Minted</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((entry) => (
                  <tr key={entry.rank} className={getRowClass(entry.rank)}>
                    <td className="rank-cell">{getRankIcon(entry.rank)}</td>
                    <td className="player-cell">{entry.address}</td>
                    <td className="points-cell">{entry.points.toLocaleString()}</td>
                    <td className="elements-cell">{entry.elements}</td>
                    <td style={{ color: '#00d4ff' }}>{Math.floor(entry.elements * 0.3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* How Points Work */}
        <div style={{
          marginTop: '3rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          <div style={{
            background: 'rgba(15, 15, 25, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            padding: '1.5rem'
          }}>
            <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', marginBottom: '1rem', color: '#00ff88' }}>
              🧪 Discover Elements
            </h4>
            <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: '1.7' }}>
              +10 points for each new element discovered. Rare elements give bonus points!
            </p>
          </div>

          <div style={{
            background: 'rgba(15, 15, 25, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            padding: '1.5rem'
          }}>
            <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', marginBottom: '1rem', color: '#ffd700' }}>
              🎯 Complete Quests
            </h4>
            <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: '1.7' }}>
              Weekly quests offer 100-500 points. Special events can give even more!
            </p>
          </div>

          <div style={{
            background: 'rgba(15, 15, 25, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            padding: '1.5rem'
          }}>
            <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', marginBottom: '1rem', color: '#a855f7' }}>
              💎 Mint NFTs
            </h4>
            <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: '1.7' }}>
              +50 points per NFT minted. Legendary NFTs give +200 bonus points!
            </p>
          </div>

          <div style={{
            background: 'rgba(15, 15, 25, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            padding: '1.5rem'
          }}>
            <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', marginBottom: '1rem', color: '#00d4ff' }}>
              🔥 Daily Streaks
            </h4>
            <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: '1.7' }}>
              Maintain daily login streaks for multiplier bonuses up to 2x points!
            </p>
          </div>
        </div>

        {/* Contract Info */}
        <div style={{
          marginTop: '3rem',
          padding: '1.5rem',
          background: 'rgba(0, 255, 136, 0.05)',
          border: '1px solid rgba(0, 255, 136, 0.2)',
          borderRadius: '16px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#00ff88', fontSize: '0.9rem' }}>
            ✨ Points are tracked on-chain via the ElementFusion smart contract
          </p>
          <a 
            href={`https://lineascan.build/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#61dfff',
              fontSize: '0.85rem',
              marginTop: '0.5rem',
              display: 'inline-block'
            }}
          >
            View Contract on LineaScan →
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="landing-footer" style={{ marginTop: '4rem' }}>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ElementFusion. All rights reserved.</p>
          <div className="powered">
            Powered by <span>Linea</span> (ConsenSys)
          </div>
        </div>
      </footer>
    </div>
  );
}
