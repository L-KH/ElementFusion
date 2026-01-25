"use client";
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import type { Mesh } from 'three';
import '@/styles/landing.css';

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Three.js background setup
    const initThreeJS = async () => {
      const THREE = await import('three');
      
      if (!canvasRef.current) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ 
        canvas: canvasRef.current, 
        alpha: true,
        antialias: true 
      });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Create particle system for elements
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 2000;
      const posArray = new Float32Array(particlesCount * 3);
      const colorsArray = new Float32Array(particlesCount * 3);
      
      const colors = [
        new THREE.Color(0x00d4ff), // water
        new THREE.Color(0xff6b35), // fire
        new THREE.Color(0x00ff88), // code
        new THREE.Color(0xa855f7), // consensus
      ];

      for (let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 15;
        posArray[i + 1] = (Math.random() - 0.5) * 15;
        posArray[i + 2] = (Math.random() - 0.5) * 15;
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        colorsArray[i] = color.r;
        colorsArray[i + 1] = color.g;
        colorsArray[i + 2] = color.b;
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });

      const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particlesMesh);

      // Create glowing orbs
      const orbGeometry = new THREE.SphereGeometry(0.2, 32, 32);
      const orbs: Mesh[] = [];
      
      colors.forEach((color, index) => {
        const orbMaterial = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.6
        });
        const orb = new THREE.Mesh(orbGeometry, orbMaterial);
        orb.position.set(
          Math.cos(index * Math.PI / 2) * 3,
          Math.sin(index * Math.PI / 2) * 2,
          -3
        );
        orbs.push(orb);
        scene.add(orb);
      });

      camera.position.z = 5;

      // Mouse interaction
      let mouseX = 0;
      let mouseY = 0;
      
      const handleMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      };
      
      window.addEventListener('mousemove', handleMouseMove);

      // Animation loop
      const clock = new THREE.Clock();
      
      const animate = () => {
        const elapsedTime = clock.getElapsedTime();
        
        // Rotate particles
        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = elapsedTime * 0.03;
        
        // Animate orbs
        orbs.forEach((orb, index) => {
          orb.position.x = Math.cos(elapsedTime * 0.5 + index * Math.PI / 2) * 3;
          orb.position.y = Math.sin(elapsedTime * 0.5 + index * Math.PI / 2) * 2;
          orb.scale.setScalar(1 + Math.sin(elapsedTime * 2 + index) * 0.2);
        });
        
        // Mouse follow
        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };
      
      animate();

      // Handle resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
      };
    };

    // Initialize Anime.js animations
    const initAnimeJS = async () => {
      const anime = (await import('animejs')).default;
      
      // Animate hero text
      anime({
        targets: '.hero h1 .line',
        translateY: [50, 0],
        opacity: [0, 1],
        delay: anime.stagger(200, { start: 500 }),
        easing: 'easeOutExpo',
        duration: 1200
      });

      anime({
        targets: '.hero-tagline span',
        translateY: [30, 0],
        opacity: [0, 1],
        delay: anime.stagger(100, { start: 900 }),
        easing: 'easeOutExpo',
        duration: 800
      });

      anime({
        targets: '.hero-badge',
        scale: [0.8, 1],
        opacity: [0, 1],
        delay: 300,
        easing: 'easeOutElastic(1, .5)',
        duration: 1500
      });

      anime({
        targets: '.hero-buttons a',
        translateY: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(150, { start: 1100 }),
        easing: 'easeOutExpo',
        duration: 800
      });

      anime({
        targets: '.element-orb',
        scale: [0, 1],
        opacity: [0, 1],
        delay: anime.stagger(100, { start: 1300 }),
        easing: 'easeOutElastic(1, .6)',
        duration: 1200
      });

      // Floating animation for orbs
      anime({
        targets: '.element-orb',
        translateY: [-10, 10],
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutSine',
        duration: 2000,
        delay: anime.stagger(200)
      });
    };

    // Initialize everything
    const init = async () => {
      await initThreeJS();
      
      const timer = setTimeout(async () => {
        setIsLoading(false);
        await initAnimeJS();
      }, 1500);

      return () => clearTimeout(timer);
    };

    init();

    // Scroll handler
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const faqData = [
    {
      question: "What is ElementFusion?",
      answer: "ElementFusion is a Web3 alchemy game built on the Linea blockchain where players combine basic elements to discover new compounds, complete quests, and mint their discoveries as NFTs. It merges science education with blockchain gaming for an engaging and educational experience."
    },
    {
      question: "How do I start playing?",
      answer: "Simply connect your Web3 wallet (like MetaMask) to the Linea network, and you're ready to play! Start with basic elements like Water, Fire, Code, and Consensus, then combine them to discover new elements. No initial purchase is required to start playing."
    },
    {
      question: "What are the gas fees for playing?",
      answer: "ElementFusion is built on Linea, a Layer 2 solution that offers extremely low gas fees (typically less than $0.01 per transaction). Playing the game and discovering new elements is free, you only pay minimal gas when minting NFTs."
    },
    {
      question: "How does the NFT minting work?",
      answer: "When you discover a new element, you can mint it as an NFT on the Linea blockchain. Each element has a rarity level (Common, Rare, Epic, Legendary) which determines its minting cost. Minted NFTs are yours to keep, trade, or sell on any compatible marketplace."
    },
    {
      question: "What is the Points system?",
      answer: "Players earn points by discovering new elements, completing quests, and achieving milestones. Points are tracked on-chain and determine your position on the leaderboard. Top players may receive special rewards and recognition in the community."
    },
    {
      question: "Can I play on mobile?",
      answer: "Yes! ElementFusion is fully responsive and works on any device with a Web3 wallet. You can use mobile wallets like MetaMask Mobile to connect and play on your smartphone or tablet."
    },
    {
      question: "Is there a marketplace for trading elements?",
      answer: "Our NFT Marketplace is currently in development and will launch soon! You'll be able to buy, sell, and trade your element NFTs directly on our platform or on any Linea-compatible NFT marketplace like Element Market."
    },
    {
      question: "How are element combinations determined?",
      answer: "Our fusion system includes over 700 unique combinations based on real scientific principles and blockchain concepts. The AI-powered explanation system helps you understand the logic behind each fusion, making it both fun and educational."
    }
  ];

  return (
    <div className="landing-page">
      {/* Three.js Canvas Background */}
      <canvas ref={canvasRef} className="three-canvas" />

      {/* Loading Screen */}
      <div className={`loader ${!isLoading ? 'hidden' : ''}`}>
        <div className="loader-elements">
          <div className="loader-orb"></div>
          <div className="loader-orb"></div>
          <div className="loader-orb"></div>
          <div className="loader-orb"></div>
        </div>
        <p className="loader-text">Initializing Fusion...</p>
      </div>

      {/* Navigation */}
      <nav className={`landing-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <Link href="/" className="logo">
          <div className="logo-icon">⚗</div>
          <span className="logo-text">ElementFusion</span>
        </Link>
        
        <ul className="nav-links">
          <li><a onClick={() => scrollToSection('how-it-works')} style={{ cursor: 'pointer' }}>How It Works</a></li>
          <li><a onClick={() => scrollToSection('features')} style={{ cursor: 'pointer' }}>Features</a></li>
          <li><a onClick={() => scrollToSection('leaderboard')} style={{ cursor: 'pointer' }}>Leaderboard</a></li>
          <li><a onClick={() => scrollToSection('marketplace')} style={{ cursor: 'pointer' }}>Marketplace</a></li>
          <li><a onClick={() => scrollToSection('roadmap')} style={{ cursor: 'pointer' }}>Roadmap</a></li>
          <li><a onClick={() => scrollToSection('faq')} style={{ cursor: 'pointer' }}>FAQ</a></li>
        </ul>

        <div className="nav-actions">
          <div className="chain-badge">
            <span className="dot"></span>
            <span>Linea</span>
          </div>
          <Link href="/game" className="btn-app">
            <span>🎮 Play Now</span>
          </Link>
        </div>

        <button 
          className="mobile-menu-btn" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <a onClick={() => scrollToSection('how-it-works')}>How It Works</a>
        <a onClick={() => scrollToSection('features')}>Features</a>
        <a onClick={() => scrollToSection('leaderboard')}>Leaderboard</a>
        <a onClick={() => scrollToSection('marketplace')}>Marketplace</a>
        <a onClick={() => scrollToSection('roadmap')}>Roadmap</a>
        <a onClick={() => scrollToSection('faq')}>FAQ</a>
        <Link href="/game" className="btn-app" style={{ marginTop: '1rem' }}>
          🎮 Play Now
        </Link>
      </div>

      {/* Hero Section */}
      <section className="hero" id="hero" ref={heroRef}>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="icon">⚗️</span>
            <span>Web3 Alchemy Game on Linea Blockchain</span>
          </div>
          <h1>
            <span className="line">The Future of</span>
            <span className="line gradient-text">Blockchain Gaming</span>
          </h1>
          <p className="hero-tagline">
            <span>Combine</span><span>,&nbsp;</span><span>Create</span><span>,&nbsp;</span><span>Collect</span>
          </p>
          <p>
            Discover the art of elemental fusion. Combine basic elements to unlock new concepts, 
            mint unique NFTs, and learn blockchain & science through immersive gameplay.
          </p>
          <div className="hero-buttons">
            <Link href="/game" className="btn-primary">
              <span>🔥 Start Fusing</span>
            </Link>
            <a onClick={() => scrollToSection('how-it-works')} className="btn-secondary" style={{ cursor: 'pointer' }}>
              <span>Learn More</span>
            </a>
          </div>
          <div className="hero-elements">
            <div className="element-orb water">
              💧
              <span className="label">Water</span>
            </div>
            <div className="element-orb fire">
              🔥
              <span className="label">Fire</span>
            </div>
            <div className="element-orb code">
              💻
              <span className="label">Code</span>
            </div>
            <div className="element-orb consensus">
              🔗
              <span className="label">Consensus</span>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <span>Scroll</span>
          <div className="scroll-mouse"></div>
        </div>
      </section>

      {/* How It Works */}
      <section className="landing-section how-it-works" id="how-it-works">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Master the ancient art of elemental fusion in just four simple steps</p>
        </div>
        <div className="steps-container">
          <div className="step-card">
            <span className="step-icon">🦊</span>
            <div className="step-number">1</div>
            <h3>Connect Your Wallet</h3>
            <p>Link your MetaMask or compatible Web3 wallet to access the Linea blockchain and start your alchemical journey.</p>
          </div>
          <div className="step-card">
            <span className="step-icon">🧪</span>
            <div className="step-number">2</div>
            <h3>Select Elements</h3>
            <p>Choose from foundational elements like Water, Fire, Code, and Consensus. Each combination unlocks new possibilities.</p>
          </div>
          <div className="step-card">
            <span className="step-icon">✨</span>
            <div className="step-number">3</div>
            <h3>Fuse & Discover</h3>
            <p>Combine elements to create new concepts. Discover Steam, Smart Contracts, Decentralized Networks, and thousands more.</p>
          </div>
          <div className="step-card">
            <span className="step-icon">🏆</span>
            <div className="step-number">4</div>
            <h3>Mint Your NFTs</h3>
            <p>Transform your unique discoveries into collectible NFTs. Own, trade, or showcase your alchemical creations.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-section features" id="features">
        <div className="section-header">
          <h2>Game Features</h2>
          <p>Experience the perfect blend of gaming, education, and blockchain technology</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon fusion">⚡</div>
            <h3>Element Fusion System</h3>
            <p>Experiment with thousands of possible combinations. Mix natural elements with blockchain concepts to discover unique creations that teach real scientific principles.</p>
            <div className="feature-tags">
              <span>Trial & Error</span>
              <span>700+ Combinations</span>
              <span>Progressive Discovery</span>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon nft">🎨</div>
            <h3>NFT Minting & Ownership</h3>
            <p>Every unique discovery can be minted as an NFT on the Linea blockchain. True digital ownership lets you collect, trade, and sell your creations.</p>
            <div className="feature-tags">
              <span>True Ownership</span>
              <span>Tradeable</span>
              <span>Collectible</span>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon learn">📚</div>
            <h3>Learn Through Play</h3>
            <p>Gamified education makes learning fun. Understand chemistry, physics, consensus mechanisms, and coding basics through interactive fusion mechanics.</p>
            <div className="feature-tags">
              <span>Science</span>
              <span>Blockchain</span>
              <span>AI Explanations</span>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon blockchain">🔐</div>
            <h3>Built on Linea L2</h3>
            <p>Powered by ConsenSys Linea—an Ethereum Layer 2 solution ensuring lightning-fast transactions, minimal gas fees, and enterprise-grade security.</p>
            <div className="feature-tags">
              <span>Low Fees</span>
              <span>Fast Transactions</span>
              <span>Ethereum Security</span>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="landing-section leaderboard-section" id="leaderboard">
        <div className="section-header">
          <h2>🏆 Leaderboard</h2>
          <p>Compete with players worldwide and climb to the top</p>
        </div>
        <div className="leaderboard-preview">
          <div className="leaderboard-card">
            <div className="leaderboard-header">
              <span className="trophy">🏆</span>
              <h3>Top Alchemists</h3>
              <span className="live-badge">
                <span className="pulse"></span>
                Live on-chain
              </span>
            </div>
            <div className="leaderboard-table">
              <div className="leaderboard-row header">
                <span className="rank">Rank</span>
                <span className="player">Player</span>
                <span className="points">Points</span>
                <span className="elements">Elements</span>
              </div>
              <div className="leaderboard-row gold">
                <span className="rank">🥇</span>
                <span className="player">0x1a2b...3c4d</span>
                <span className="points">12,450</span>
                <span className="elements">156</span>
              </div>
              <div className="leaderboard-row silver">
                <span className="rank">🥈</span>
                <span className="player">0x5e6f...7g8h</span>
                <span className="points">10,230</span>
                <span className="elements">142</span>
              </div>
              <div className="leaderboard-row bronze">
                <span className="rank">🥉</span>
                <span className="player">0x9i0j...1k2l</span>
                <span className="points">8,890</span>
                <span className="elements">128</span>
              </div>
              <div className="leaderboard-row">
                <span className="rank">4</span>
                <span className="player">0x3m4n...5o6p</span>
                <span className="points">7,650</span>
                <span className="elements">115</span>
              </div>
              <div className="leaderboard-row">
                <span className="rank">5</span>
                <span className="player">0x7q8r...9s0t</span>
                <span className="points">6,420</span>
                <span className="elements">98</span>
              </div>
            </div>
            <Link href="/leaderboard" className="view-all-btn">
              View Full Leaderboard →
            </Link>
          </div>
          <div className="leaderboard-info">
            <h4>Earn Points By:</h4>
            <ul>
              <li><span className="icon">🧪</span> Discovering new elements</li>
              <li><span className="icon">🎯</span> Completing weekly quests</li>
              <li><span className="icon">💎</span> Minting rare NFTs</li>
              <li><span className="icon">🔥</span> Achieving fusion streaks</li>
              <li><span className="icon">⭐</span> Finding legendary combinations</li>
            </ul>
            <p className="note">Points are tracked on-chain via smart contract. Your progress is permanent and verifiable!</p>
          </div>
        </div>
      </section>

      {/* NFT Marketplace Coming Soon */}
      <section className="landing-section marketplace-section" id="marketplace">
        <div className="section-header">
          <h2>🛒 NFT Marketplace</h2>
          <p>Trade your element discoveries with players worldwide</p>
        </div>
        <div className="marketplace-preview">
          <div className="coming-soon-card">
            <div className="coming-soon-badge">
              <span className="pulse-ring"></span>
              Coming Soon
            </div>
            <div className="marketplace-mockup">
              <div className="nft-grid-preview">
                <div className="nft-item blur">
                  <div className="nft-image">♨️</div>
                  <div className="nft-price">0.01 ETH</div>
                </div>
                <div className="nft-item blur">
                  <div className="nft-image">📜</div>
                  <div className="nft-price">0.05 ETH</div>
                </div>
                <div className="nft-item blur">
                  <div className="nft-image">🌐</div>
                  <div className="nft-price">0.1 ETH</div>
                </div>
                <div className="nft-item blur">
                  <div className="nft-image legendary">🏛️</div>
                  <div className="nft-price">0.5 ETH</div>
                </div>
              </div>
              <div className="overlay-text">
                <span className="icon">🚀</span>
                <h3>Launching Q2 2026</h3>
                <p>Buy, sell, and trade your element NFTs directly on our marketplace</p>
              </div>
            </div>
            <div className="marketplace-features">
              <div className="mkt-feature">
                <span className="icon">💰</span>
                <span>Zero Platform Fees</span>
              </div>
              <div className="mkt-feature">
                <span className="icon">⚡</span>
                <span>Instant Transfers</span>
              </div>
              <div className="mkt-feature">
                <span className="icon">🔒</span>
                <span>Secure Escrow</span>
              </div>
              <div className="mkt-feature">
                <span className="icon">📊</span>
                <span>Price Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Element Showcase */}
      <section className="landing-section element-showcase" id="elements">
        <div className="showcase-container">
          <div className="section-header">
            <h2>Elemental Alchemy</h2>
            <p>Witness the magic of fusion—combine basic elements to unlock infinite possibilities</p>
          </div>
          <div className="fusion-demo">
            <div className="demo-element water">
              💧
              <span className="name">Water</span>
            </div>
            <span className="fusion-operator">+</span>
            <div className="demo-element fire">
              🔥
              <span className="name">Fire</span>
            </div>
            <span className="fusion-operator">=</span>
            <div className="demo-element result">
              ♨️
              <span className="name">Steam</span>
            </div>
          </div>
          <div className="combinations">
            <div className="combo-card">
              <div className="combo-elements">
                <div className="combo-el code">💻</div>
                <span className="combo-arrow">+</span>
                <div className="combo-el consensus">🔗</div>
              </div>
              <span className="combo-arrow">→</span>
              <div className="combo-result">
                <div className="name">📜 Smart Contract</div>
                <div className="type">Blockchain Element</div>
              </div>
            </div>
            <div className="combo-card">
              <div className="combo-elements">
                <div className="combo-el consensus">🔗</div>
                <span className="combo-arrow">+</span>
                <div className="combo-el consensus">🔗</div>
              </div>
              <span className="combo-arrow">→</span>
              <div className="combo-result">
                <div className="name">🌐 Decentralized Network</div>
                <div className="type">Web3 Concept</div>
              </div>
            </div>
            <div className="combo-card">
              <div className="combo-elements">
                <div className="combo-el water">💧</div>
                <span className="combo-arrow">+</span>
                <div className="combo-el water">💧</div>
              </div>
              <span className="combo-arrow">→</span>
              <div className="combo-result">
                <div className="name">🌊 Ocean</div>
                <div className="type">Natural Element</div>
              </div>
            </div>
            <div className="combo-card">
              <div className="combo-elements">
                <div className="combo-el fire">🔥</div>
                <span className="combo-arrow">+</span>
                <div className="combo-el code">💻</div>
              </div>
              <span className="combo-arrow">→</span>
              <div className="combo-result">
                <div className="name">⚡ Energy Protocol</div>
                <div className="type">Hybrid Fusion</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="stats-grid">
          <div className="stat-item">
            <h3>700+</h3>
            <p>Unique Combinations</p>
          </div>
          <div className="stat-item">
            <h3>8+</h3>
            <p>Base Elements</p>
          </div>
          <div className="stat-item">
            <h3>∞</h3>
            <p>NFTs Mintable</p>
          </div>
          <div className="stat-item">
            <h3>Linea</h3>
            <p>Blockchain Network</p>
          </div>
        </div>
      </section>

      {/* Roadmap - Updated for 2026 */}
      <section className="landing-section roadmap" id="roadmap">
        <div className="section-header">
          <h2>Roadmap 2026</h2>
          <p>Our journey to revolutionize blockchain gaming education</p>
        </div>
        <div className="roadmap-container">
          <div className="roadmap-item completed">
            <div className="roadmap-dot">✓</div>
            <div className="roadmap-content">
              <h4><span className="phase">Q4 2025</span>Foundation & Development</h4>
              <ul>
                <li>✅ Core game mechanics & fusion engine</li>
                <li>✅ Smart contract development & audit</li>
                <li>✅ UI/UX design system</li>
                <li>✅ 700+ element combinations database</li>
                <li>✅ Linea testnet deployment</li>
              </ul>
            </div>
          </div>
          <div className="roadmap-item current">
            <div className="roadmap-dot">🔥</div>
            <div className="roadmap-content">
              <h4><span className="phase">Q1 2026</span>Linea Mainnet Launch</h4>
              <ul>
                <li>🚀 Official Linea mainnet deployment</li>
                <li>🎮 Public game launch</li>
                <li>🏆 Leaderboard system activation</li>
                <li>🎯 Quest system with rewards</li>
                <li>📱 Mobile-responsive optimization</li>
              </ul>
            </div>
          </div>
          <div className="roadmap-item">
            <div className="roadmap-dot">🛒</div>
            <div className="roadmap-content">
              <h4><span className="phase">Q2 2026</span>NFT Marketplace & Economy</h4>
              <ul>
                <li>🛒 Native NFT marketplace launch</li>
                <li>💰 Trading & auction system</li>
                <li>📊 Analytics dashboard</li>
                <li>🎁 Seasonal events & limited editions</li>
                <li>🤝 Partnership integrations</li>
              </ul>
            </div>
          </div>
          <div className="roadmap-item">
            <div className="roadmap-dot">⚔️</div>
            <div className="roadmap-content">
              <h4><span className="phase">Q3 2026</span>Competitive Features</h4>
              <ul>
                <li>⚔️ PvP fusion battles</li>
                <li>🏟️ Tournament system</li>
                <li>👥 Guild/team mechanics</li>
                <li>🎖️ Achievement badges as SBTs</li>
                <li>📈 Enhanced point economy</li>
              </ul>
            </div>
          </div>
          <div className="roadmap-item">
            <div className="roadmap-dot">🌟</div>
            <div className="roadmap-content">
              <h4><span className="phase">Q4 2026</span>Ecosystem Expansion</h4>
              <ul>
                <li>🗳️ DAO governance launch</li>
                <li>🧬 Community-created elements</li>
                <li>🌉 Cross-chain NFT bridging</li>
                <li>🎓 Educational partnerships</li>
                <li>📲 Native mobile app release</li>
              </ul>
            </div>
          </div>
          <div className="roadmap-item">
            <div className="roadmap-dot">🚀</div>
            <div className="roadmap-content">
              <h4><span className="phase">2027 & Beyond</span>Metaverse Integration</h4>
              <ul>
                <li>🌐 Metaverse labs & virtual spaces</li>
                <li>🤖 AI-enhanced gameplay</li>
                <li>🎮 VR/AR fusion experiences</li>
                <li>🌍 Global expansion & localization</li>
                <li>🔮 Secret features TBA</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="landing-section faq-section" id="faq">
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about ElementFusion</p>
        </div>
        <div className="faq-container">
          {faqData.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${openFaq === index ? 'open' : ''}`}
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
            >
              <div className="faq-question">
                <span className="icon">❓</span>
                <h4>{faq.question}</h4>
                <span className="toggle">{openFaq === index ? '−' : '+'}</span>
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="faq-cta">
          <p>Still have questions?</p>
          <Link href="/contact" className="btn-secondary">
            <span>Contact Us</span>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-box">
          <h2>Ready to Begin Your Alchemical Journey?</h2>
          <p>Connect your wallet and start discovering the endless possibilities of elemental fusion on Linea blockchain.</p>
          <Link href="/game" className="btn-primary">
            <span>🧪 Launch Game</span>
          </Link>
        </div>
      </section>

      {/* Footer - Updated without docs/blog/whitepaper */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Link href="/" className="logo">
              <div className="logo-icon">⚗</div>
              <span className="logo-text">ElementFusion</span>
            </Link>
            <p>The pioneering Web3 alchemy game that gamifies learning blockchain and science through immersive elemental fusion gameplay.</p>
            <div className="footer-socials">
              <a href="https://twitter.com/element_fusion_" target="_blank" rel="noopener noreferrer" aria-label="Twitter">𝕏</a>
              <a href="#" aria-label="Discord">💬</a>
              <a href="https://github.com/L-KH/ElementFusion" target="_blank" rel="noopener noreferrer" aria-label="GitHub">⌨</a>
              <a href="#" aria-label="Telegram">✈</a>
            </div>
          </div>
          <div className="footer-links">
            <h4>Game</h4>
            <ul>
              <li><Link href="/game">Play Now</Link></li>
              <li><a onClick={() => scrollToSection('elements')} style={{ cursor: 'pointer' }}>Element Guide</a></li>
              <li><a onClick={() => scrollToSection('marketplace')} style={{ cursor: 'pointer' }}>NFT Marketplace</a></li>
              <li><Link href="/leaderboard">Leaderboard</Link></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Support</h4>
            <ul>
              <li><a onClick={() => scrollToSection('faq')} style={{ cursor: 'pointer' }}>FAQs</a></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><a href="https://github.com/L-KH/ElementFusion/issues" target="_blank" rel="noopener noreferrer">Report Bug</a></li>
              <li><a href="https://twitter.com/element_fusion_" target="_blank" rel="noopener noreferrer">Community</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Legal</h4>
            <ul>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/cookies">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
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
