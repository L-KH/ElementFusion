"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import '@/styles/landing.css';

export default function TermsOfService() {
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
        <h1>Terms of Service</h1>
        <p className="last-updated">Last updated: January 2025</p>

        <p>
          Welcome to ElementFusion. By accessing or using our Web3 alchemy game and related services, 
          you agree to be bound by these Terms of Service. Please read them carefully.
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By connecting your wallet and using ElementFusion, you acknowledge that you have read, 
          understood, and agree to be bound by these Terms. If you do not agree to these Terms, 
          please do not use our services.
        </p>

        <h2>2. Eligibility</h2>
        <p>
          You must be at least 13 years old to use ElementFusion. If you are under 18, you must 
          have permission from a parent or legal guardian. By using our services, you represent 
          that you meet these requirements.
        </p>

        <h2>3. Description of Services</h2>
        <p>ElementFusion provides:</p>
        <ul>
          <li>A Web3-based element fusion game</li>
          <li>NFT minting capabilities on the Linea blockchain</li>
          <li>Educational content about blockchain and science concepts</li>
          <li>Quest systems with rewards</li>
          <li>AI-powered explanations for element combinations</li>
        </ul>

        <h2>4. Wallet and Blockchain Interactions</h2>
        <p>
          To use certain features, you must connect a compatible Web3 wallet. You are solely 
          responsible for:
        </p>
        <ul>
          <li>Maintaining the security of your wallet and private keys</li>
          <li>All activities that occur through your wallet</li>
          <li>Any transaction fees (gas fees) associated with blockchain interactions</li>
          <li>Ensuring you are connected to the correct network (Linea)</li>
        </ul>

        <h2>5. NFTs and Digital Assets</h2>
        <p>
          When you mint NFTs through ElementFusion:
        </p>
        <ul>
          <li>You own the NFT token recorded on the blockchain</li>
          <li>ElementFusion retains intellectual property rights to the underlying artwork and game concepts</li>
          <li>NFTs are minted as-is without warranties</li>
          <li>Blockchain transactions are irreversible</li>
          <li>We cannot recover lost or stolen NFTs</li>
        </ul>

        <h2>6. User Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use bots, scripts, or automated tools to interact with the game</li>
          <li>Exploit bugs or vulnerabilities in the smart contracts</li>
          <li>Attempt to manipulate the game mechanics unfairly</li>
          <li>Engage in any activity that disrupts our services</li>
          <li>Use the platform for illegal activities</li>
          <li>Infringe on the intellectual property rights of others</li>
        </ul>

        <h2>7. Intellectual Property</h2>
        <p>
          All content, features, and functionality of ElementFusion, including but not limited to 
          text, graphics, logos, icons, images, audio clips, and software, are owned by ElementFusion 
          and are protected by intellectual property laws.
        </p>

        <h2>8. Disclaimer of Warranties</h2>
        <p>
          ElementFusion is provided "as is" and "as available" without any warranties of any kind. 
          We do not guarantee that our services will be uninterrupted, error-free, or secure. 
          We are not responsible for:
        </p>
        <ul>
          <li>Losses due to wallet compromise or user error</li>
          <li>Smart contract vulnerabilities or blockchain network issues</li>
          <li>Changes in cryptocurrency or NFT values</li>
          <li>Third-party service failures</li>
        </ul>

        <h2>9. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, ElementFusion and its team shall not be liable 
          for any indirect, incidental, special, consequential, or punitive damages, including 
          but not limited to loss of profits, data, or other intangible losses.
        </p>

        <h2>10. Modifications to Services</h2>
        <p>
          We reserve the right to modify, suspend, or discontinue any part of our services at 
          any time without notice. We may also update these Terms from time to time. Continued 
          use after changes constitutes acceptance of the new Terms.
        </p>

        <h2>11. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with applicable laws, 
          without regard to conflict of law principles.
        </p>

        <h2>12. Dispute Resolution</h2>
        <p>
          Any disputes arising from these Terms or your use of ElementFusion shall first be 
          attempted to be resolved through good-faith negotiation. If resolution cannot be 
          reached, disputes may be submitted to binding arbitration.
        </p>

        <h2>13. Severability</h2>
        <p>
          If any provision of these Terms is found to be unenforceable, the remaining provisions 
          will continue to be valid and enforceable.
        </p>

        <h2>14. Contact Information</h2>
        <p>
          For questions about these Terms, please contact us:
        </p>
        <ul>
          <li>Twitter: <a href="https://twitter.com/element_fusion_" target="_blank" rel="noopener noreferrer">@element_fusion_</a></li>
          <li>GitHub: <a href="https://github.com/L-KH/ElementFusion" target="_blank" rel="noopener noreferrer">ElementFusion Repository</a></li>
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
