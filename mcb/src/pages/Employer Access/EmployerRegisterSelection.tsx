import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Briefcase,
  Backpack
} from 'lucide-react';
import './EmployerRegisterSelection.css';

const EmployerRegisterSelection: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToSignup = () => {
    try {
      // Use replace to prevent redirect issues
      navigate('/signup', { replace: true });
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback navigation
      navigate('/');
    }
  };

  const handleRegisterOption = (type: string) => {
    switch (type) {
      case 'professional':
        navigate('/register/professional');
        break;
      case 'fresher':
        navigate('/register/fresher');
        break;
      default:
        break;
    }
  };

  return (
    <div className="emp-reg-sel-register-selection-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="register-container"
      >
        <div className="register-header">
          <button 
            onClick={handleBackToSignup} 
            className="emp-reg-sel-btn"
            title="Go back to Sign Up"
          >
            <ArrowLeft className="btn-icon" />
            <span>Back</span>
          </button>
          <h1 className="page-title">Employers Register</h1>
          <p className="page-subtitle">Complete Your Steps</p>
        </div>

        <div className="register-options">
          {/* Professional Registration Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="register-card professional-card"
          >
            <div className="card-icon">
              <Briefcase className="icon" />
            </div>
            <div className="card-content">
              <h3 className="card-title">I am a Professional</h3>
              <p className="card-description">
                I have at least 1 month of work experience
              </p>
            </div>
            <button 
              onClick={() => handleRegisterOption('professional')}
              className="register-btn"
            >
              Register
            </button>
          </motion.div>

          {/* Fresher Registration Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="register-card fresher-card"
          >
            <div className="card-icon">
              <Backpack className="icon" />
            </div>
            <div className="card-content">
              <h3 className="card-title">I am a Fresher</h3>
              <p className="card-description">
                I have just graduated / I haven't worked after graduation
              </p>
            </div>
            <button 
              onClick={() => handleRegisterOption('fresher')}
              className="register-btn"
            >
              Register
            </button>
          </motion.div>
        </div>

        <div className="register-footer">
          <p className="footer-text">
            Already have an account? <button onClick={() => navigate('/login')} className="login-link">Sign In</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default EmployerRegisterSelection;
