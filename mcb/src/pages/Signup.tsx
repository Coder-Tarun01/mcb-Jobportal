import React from 'react';
import { motion } from 'framer-motion';
import SignupForm from '../components/auth/SignupForm';
import './Auth.css';

const Signup: React.FC = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side - Branding & Info */}
        <div className="auth-left-panel">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="auth-branding"
          >
            <div className="brand-logo">
              <h1 className="brand-title">JobPortal</h1>
            </div>
            
            <div className="brand-content">
              <h2 className="brand-heading">
                Join JobPortal Today
              </h2>
              <p className="brand-description">
                Create your account and start your journey to find the perfect job opportunity.
              </p>
              
              <div className="brand-features">
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <span>Access to top companies</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <span>Personalized job recommendations</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <span>Advanced search filters</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="auth-right-panel">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="auth-form-container"
          >
            <div className="auth-form-header">
              <h2 className="auth-form-title">Create Account</h2>
              <p className="auth-form-subtitle">Join thousands of job seekers and employers.</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="auth-form-wrapper"
            >
              <SignupForm />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
