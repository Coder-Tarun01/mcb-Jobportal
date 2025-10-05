import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Twitter, 
  Facebook, 
  Instagram 
} from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-logo">
              <img src="/logo.png" alt="MyCareerbuild JOBS" className="footer-logo-image" />
            </div>
            <p className="footer-description">
              Connecting talented professionals with amazing career opportunities. 
              Find your dream job or hire the best talent.
            </p>
            <div className="footer-social-links">
              <a href="https://linkedin.com" className="footer-social-link" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <Linkedin className="footer-social-icon" />
              </a>
              <a href="https://twitter.com" className="footer-social-link" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <Twitter className="footer-social-icon" />
              </a>
              <a href="https://facebook.com" className="footer-social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <Facebook className="footer-social-icon" />
              </a>
              <a href="https://instagram.com" className="footer-social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <Instagram className="footer-social-icon" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/jobs" className="footer-link">Browse Jobs</Link></li>
              <li><Link to="/jobs?type=remote" className="footer-link">Remote Jobs</Link></li>
              <li><Link to="/jobs?type=full-time" className="footer-link">Full-time Jobs</Link></li>
              <li><Link to="/jobs?type=part-time" className="footer-link">Part-time Jobs</Link></li>
              <li><Link to="/jobs?type=contract" className="footer-link">Contract Jobs</Link></li>
            </ul>
          </div>

          {/* For Job Seekers */}
          <div className="footer-section">
            <h3 className="footer-title">For Job Seekers</h3>
            <ul className="footer-links">
              <li><Link to="/dashboard" className="footer-link">My Dashboard</Link></li>
              <li><Link to="/dashboard?tab=profile" className="footer-link">Profile</Link></li>
              <li><Link to="/dashboard?tab=applications" className="footer-link">My Applications</Link></li>
              <li><Link to="/dashboard?tab=resume" className="footer-link">Resume Builder</Link></li>
              <li><Link to="/jobs?category=technology" className="footer-link">Tech Jobs</Link></li>
            </ul>
          </div>

          {/* For Employers */}
          <div className="footer-section">
            <h3 className="footer-title">For Employers</h3>
            <ul className="footer-links">
              <li><Link to="/employer/post-job" className="footer-link">Post a Job</Link></li>
              <li><Link to="/employer/browse-candidates" className="footer-link">Browse Candidates</Link></li>
              <li><Link to="/pricing" className="footer-link">Pricing</Link></li>
              <li><Link to="/employer/solutions" className="footer-link">Recruitment Solutions</Link></li>
              <li><Link to="/employer/company-profile" className="footer-link">Company Profiles</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3 className="footer-title">Contact Us</h3>
            <div className="footer-contact-info">
              <div className="footer-contact-item">
                <Mail className="footer-contact-icon" />
                <span className="footer-text">support@jobportal.com</span>
              </div>
              <div className="footer-contact-item">
                <Phone className="footer-contact-icon" />
                <span className="footer-text">+1 (555) 123-4567</span>
              </div>
              <div className="footer-contact-item">
                <MapPin className="footer-contact-icon" />
                <span className="footer-text">123 Business St, City, State 12345</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} MyCareerbuild JOBS. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <Link to="/privacy" className="footer-bottom-link">Privacy Policy</Link>
              <Link to="/terms" className="footer-bottom-link">Terms of Service</Link>
              <Link to="/cookies" className="footer-bottom-link">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
