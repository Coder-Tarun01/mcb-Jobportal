import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-header">
          <h1 className="about-title">About MyCareerbuild JOBS</h1>
          <p className="about-subtitle">
            Connecting talented professionals with amazing career opportunities
          </p>
        </div>

        <div className="about-content">
          <div className="about-section">
            <h2 className="section-title">Our Mission</h2>
            <p className="section-text">
              At MyCareerbuild JOBS, we believe that every professional deserves access to 
              meaningful career opportunities. Our platform bridges the gap between talented 
              individuals and forward-thinking companies, creating connections that drive 
              success for both parties.
            </p>
          </div>

          <div className="about-section">
            <h2 className="section-title">What We Offer</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3>Job Search</h3>
                <p>Find your dream job from thousands of opportunities across various industries.</p>
              </div>
              <div className="feature-card">
                <h3>Company Profiles</h3>
                <p>Discover company culture, benefits, and growth opportunities before applying.</p>
              </div>
              <div className="feature-card">
                <h3>Career Resources</h3>
                <p>Access expert advice, resume tips, and interview preparation materials.</p>
              </div>
              <div className="feature-card">
                <h3>Professional Network</h3>
                <p>Connect with industry professionals and expand your professional network.</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2 className="section-title">Our Values</h2>
            <div className="values-list">
              <div className="value-item">
                <h3>Transparency</h3>
                <p>We believe in honest communication and clear expectations.</p>
              </div>
              <div className="value-item">
                <h3>Innovation</h3>
                <p>We continuously improve our platform to serve you better.</p>
              </div>
              <div className="value-item">
                <h3>Excellence</h3>
                <p>We strive for the highest quality in everything we do.</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2 className="section-title">Get Started</h2>
            <p className="section-text">
              Ready to take the next step in your career? Join thousands of professionals 
              who have found their perfect match through MyCareerbuild JOBS.
            </p>
            <div className="cta-buttons">
              <a href="/signup" className="cta-button primary">Create Account</a>
              <a href="/jobs" className="cta-button secondary">Browse Jobs</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
