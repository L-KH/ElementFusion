"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import '@/styles/landing.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
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

      <div className="contact-container">
        <div className="contact-header">
          <h1>📬 Contact Us</h1>
          <p>Have questions, feedback, or partnership inquiries? We&apos;d love to hear from you!</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-card">
              <div className="icon">🐦</div>
              <h3>Twitter / X</h3>
              <p>Follow us for updates and announcements. DMs are open!</p>
              <a href="https://twitter.com/element_fusion_" target="_blank" rel="noopener noreferrer">
                @element_fusion_
              </a>
            </div>

            <div className="contact-card">
              <div className="icon">💬</div>
              <h3>Discord Community</h3>
              <p>Join our community to chat with other alchemists and get support.</p>
              <a href="#" target="_blank" rel="noopener noreferrer">
                Join Discord (Coming Soon)
              </a>
            </div>

            <div className="contact-card">
              <div className="icon">💻</div>
              <h3>GitHub</h3>
              <p>Check out our open-source code and submit issues or feature requests.</p>
              <a href="https://github.com/AceVikings/ElementFusion" target="_blank" rel="noopener noreferrer">
                ElementFusion Repository
              </a>
            </div>

            <div className="contact-card">
              <div className="icon">📧</div>
              <h3>Email</h3>
              <p>For business inquiries and partnerships.</p>
              <a href="mailto:contact@elementfusion.tech">
                contact@elementfusion.tech
              </a>
            </div>

            <div className="social-links">
              <a href="https://twitter.com/element_fusion_" target="_blank" rel="noopener noreferrer" className="social-link">
                <span className="icon">𝕏</span>
                <span>Twitter</span>
              </a>
              <a href="#" className="social-link">
                <span className="icon">💬</span>
                <span>Discord</span>
              </a>
              <a href="https://github.com/AceVikings/ElementFusion" target="_blank" rel="noopener noreferrer" className="social-link">
                <span className="icon">⌨</span>
                <span>GitHub</span>
              </a>
              <a href="#" className="social-link">
                <span className="icon">✈</span>
                <span>Telegram</span>
              </a>
            </div>
          </div>

          <div className="contact-form">
            <h3>Send us a Message</h3>
            {submitted ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem',
                background: 'rgba(0, 255, 136, 0.1)',
                borderRadius: '16px',
                border: '1px solid rgba(0, 255, 136, 0.3)'
              }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>✅</span>
                <h4 style={{ marginBottom: '0.5rem', color: '#00ff88' }}>Message Sent!</h4>
                <p style={{ color: '#a1a1aa' }}>Thank you for reaching out. We&apos;ll get back to you soon.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="btn-secondary"
                  style={{ marginTop: '1.5rem', padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select 
                    id="subject" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="press">Press / Media</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea 
                    id="message" 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what's on your mind..."
                    required
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="loader-orb" style={{ width: '16px', height: '16px' }}></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <span>📨</span>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
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
