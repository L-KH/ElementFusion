"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import '@/styles/landing.css';

export default function PrivacyPolicy() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page legal-page">
      {/* Navigation */}
      <nav className={`landing-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <Link href="/" className="logo">
          <div className="logo-icon">⚗</div>
          <span className="logo-text">ElementFusion</span>
        </Link>
        
        <div className="nav-actions">
          <div className="chain-badge">
            <span className="dot"></span>
            <span>Linea</span>
          </div>
          <Link href="/game" className="btn-app">
            <span>🎮 Play Now</span>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="legal-container">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last updated: January 2025</p>

        <p>
          Welcome to ElementFusion ("we," "our," or "us"). We are committed to protecting your privacy 
          and ensuring you have a positive experience on our platform. This Privacy Policy explains how 
          we collect, use, disclose, and safeguard your information when you use our Web3 alchemy game 
          and related services.
        </p>

        <h2>1. Information We Collect</h2>
        <p>We collect information in the following ways:</p>
        <p><strong>Wallet Information:</strong> When you connect your Web3 wallet (such as MetaMask), 
        we collect your public wallet address. We do not have access to your private keys or seed phrases.</p>
        <p><strong>Game Data:</strong> We collect information about your gameplay, including elements discovered, 
        fusion attempts, NFTs minted, and quest progress.</p>
        <p><strong>Technical Data:</strong> We automatically collect certain technical information, including 
        your IP address, browser type, device information, and interaction data with our platform.</p>

        <h2>2. How We Use Your Information</h2>
        <p>We use the collected information for the following purposes:</p>
        <ul>
          <li>To provide and maintain our game services</li>
          <li>To process NFT minting and blockchain transactions</li>
          <li>To track your game progress and achievements</li>
          <li>To improve and optimize our platform</li>
          <li>To communicate with you about updates and features</li>
          <li>To detect and prevent fraud or abuse</li>
        </ul>

        <h2>3. Blockchain Data</h2>
        <p>
          ElementFusion operates on the Linea blockchain. Please be aware that blockchain transactions 
          are public and immutable. When you mint NFTs or interact with our smart contracts, this 
          information is permanently recorded on the blockchain and is publicly visible.
        </p>

        <h2>4. Data Sharing</h2>
        <p>We do not sell your personal information. We may share your information with:</p>
        <ul>
          <li>Blockchain networks necessary for transaction processing</li>
          <li>Service providers who assist in operating our platform</li>
          <li>Legal authorities when required by law</li>
        </ul>

        <h2>5. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your information. 
          However, no method of transmission over the internet is 100% secure. We cannot guarantee 
          absolute security of your data.
        </p>

        <h2>6. Your Rights</h2>
        <p>Depending on your location, you may have rights to:</p>
        <ul>
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data (where applicable)</li>
          <li>Object to certain processing activities</li>
          <li>Data portability</li>
        </ul>
        <p>
          Note that blockchain data cannot be deleted due to its immutable nature.
        </p>

        <h2>7. Third-Party Services</h2>
        <p>
          Our platform may integrate with third-party services such as wallet providers, blockchain 
          explorers, and analytics tools. These services have their own privacy policies, and we 
          encourage you to review them.
        </p>

        <h2>8. Children's Privacy</h2>
        <p>
          ElementFusion is not intended for users under the age of 13. We do not knowingly collect 
          information from children under 13. If you believe we have collected such information, 
          please contact us immediately.
        </p>

        <h2>9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by 
          posting the new Privacy Policy on this page and updating the "Last updated" date.
        </p>

        <h2>10. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <ul>
          <li>Twitter: <a href="https://twitter.com/element_fusion_" target="_blank" rel="noopener noreferrer">@element_fusion_</a></li>
          <li>GitHub: <a href="https://github.com/AceVikings/ElementFusion" target="_blank" rel="noopener noreferrer">ElementFusion Repository</a></li>
        </ul>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Link href="/" style={{ color: 'var(--consensus)', textDecoration: 'none' }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
