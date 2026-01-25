"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import '@/styles/landing.css';

export default function CookiePolicy() {
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
        <h1>Cookie Policy</h1>
        <p className="last-updated">Last updated: January 2025</p>

        <p>
          This Cookie Policy explains how ElementFusion uses cookies and similar technologies 
          to recognize you when you visit our platform. It explains what these technologies are 
          and why we use them, as well as your rights to control our use of them.
        </p>

        <h2>1. What Are Cookies?</h2>
        <p>
          Cookies are small data files that are placed on your computer or mobile device when 
          you visit a website. Cookies are widely used by website owners to make their websites 
          work, or to work more efficiently, as well as to provide reporting information.
        </p>
        <p>
          Cookies set by the website owner (in this case, ElementFusion) are called "first-party 
          cookies." Cookies set by parties other than the website owner are called "third-party 
          cookies."
        </p>

        <h2>2. Types of Cookies We Use</h2>
        
        <h3>Essential Cookies</h3>
        <p>
          These cookies are strictly necessary to provide you with services available through our 
          platform and to use some of its features, such as:
        </p>
        <ul>
          <li>Maintaining your session when playing the game</li>
          <li>Remembering your wallet connection preferences</li>
          <li>Storing your game progress locally</li>
          <li>Security and authentication</li>
        </ul>

        <h3>Performance Cookies</h3>
        <p>
          These cookies allow us to count visits and traffic sources so we can measure and improve 
          the performance of our platform. They help us know which pages are the most and least 
          popular and see how visitors move around the site.
        </p>

        <h3>Functional Cookies</h3>
        <p>
          These cookies enable the platform to provide enhanced functionality and personalization, such as:
        </p>
        <ul>
          <li>Remembering your game settings (sound, animations)</li>
          <li>Storing discovered elements locally</li>
          <li>Remembering your preferred game mode (Normal/Web3)</li>
        </ul>

        <h2>3. Local Storage</h2>
        <p>
          In addition to cookies, ElementFusion uses browser local storage to:
        </p>
        <ul>
          <li>Save your game progress when not connected to a wallet</li>
          <li>Store your discovered elements</li>
          <li>Remember your game preferences</li>
          <li>Cache game data for faster loading</li>
        </ul>

        <h2>4. Third-Party Cookies</h2>
        <p>
          Our platform may include third-party cookies from:
        </p>
        <ul>
          <li><strong>Web3 Wallet Providers:</strong> When you connect wallets like MetaMask</li>
          <li><strong>Analytics Services:</strong> To understand how users interact with our platform</li>
          <li><strong>RainbowKit/WalletConnect:</strong> For wallet connection functionality</li>
        </ul>

        <h2>5. How to Control Cookies</h2>
        <p>
          You can control and manage cookies in various ways. Please note that removing or 
          blocking cookies may impact your user experience and parts of our platform may no 
          longer be fully accessible.
        </p>

        <h3>Browser Controls</h3>
        <p>
          Most browsers allow you to control cookies through their settings. You can:
        </p>
        <ul>
          <li>Block all cookies</li>
          <li>Block only third-party cookies</li>
          <li>Clear all cookies when you close your browser</li>
          <li>Open a "private browsing" / "incognito" session</li>
        </ul>

        <h3>Local Storage</h3>
        <p>
          You can clear local storage through your browser's developer tools or settings. 
          Note that this will reset your game progress if you haven't saved it to the blockchain.
        </p>

        <h2>6. Impact of Disabling Cookies</h2>
        <p>
          If you disable or decline cookies, some features of ElementFusion may not function 
          properly. Specifically:
        </p>
        <ul>
          <li>Your game progress may not be saved locally</li>
          <li>You may need to reconfigure your settings each visit</li>
          <li>Wallet connections may not persist between sessions</li>
        </ul>

        <h2>7. Updates to This Policy</h2>
        <p>
          We may update this Cookie Policy from time to time to reflect changes in technology 
          or legal requirements. We encourage you to periodically review this page for the 
          latest information on our cookie practices.
        </p>

        <h2>8. Contact Us</h2>
        <p>
          If you have any questions about our use of cookies, please contact us:
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
