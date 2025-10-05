import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Shield, Key } from 'lucide-react';
import './ChangePassword.css';

interface PasswordStrength {
  score: number;
  feedback: string[];
  isStrong: boolean;
}

const ChangePassword: React.FC = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    isStrong: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Check password strength for new password
    if (name === 'newPassword') {
      checkPasswordStrength(value);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const checkPasswordStrength = (password: string): PasswordStrength => {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One uppercase letter');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One lowercase letter');
    }

    // Number check
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('One number');
    }

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One special character');
    }

    // Common patterns check
    if (password.length >= 12) {
      score += 1;
    }

    const strength = {
      score,
      feedback,
      isStrong: score >= 4
    };

    setPasswordStrength(strength);
    return strength;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Current password validation
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    // New password validation
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    } else if (!passwordStrength.isStrong) {
      newErrors.newPassword = 'Password is not strong enough';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Check if new password is same as current
    if (formData.currentPassword && formData.newPassword && 
        formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success/error
      const success = Math.random() > 0.2; // 80% success rate for demo
      
      if (success) {
        setSubmitStatus('success');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setPasswordStrength({
          score: 0,
          feedback: [],
          isStrong: false
        });
      } else {
        setSubmitStatus('error');
        setErrors({ currentPassword: 'Current password is incorrect' });
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = (score: number) => {
    if (score <= 2) return '#ef4444';
    if (score <= 4) return '#f59e0b';
    return '#10b981';
  };

  const getPasswordStrengthText = (score: number) => {
    if (score <= 2) return 'Weak';
    if (score <= 4) return 'Medium';
    return 'Strong';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="password-header">
        <div className="header-content">
          <div className="header-icon">
            <Shield className="shield-icon" />
          </div>
          <div className="header-text">
            <h2 className="page-title">Change Password</h2>
            <p className="page-description">
              Keep your account secure by updating your password regularly
            </p>
          </div>
        </div>
      </div>
      {/* Password Form */}
      <div className="password-form-container">
        <form onSubmit={handleSubmit} className="password-form">
          {/* Current Password */}
          <div className="form-group">
            <label className="form-label">
              <Lock className="label-icon" />
              Current Password
            </label>
            <div className="password-input-container">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className={`form-input ${errors.currentPassword ? 'error' : ''}`}
                placeholder="Enter your current password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPasswords.current ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
              </button>
            </div>
            {errors.currentPassword && (
              <div className="error-message">
                <AlertCircle className="error-icon" />
                {errors.currentPassword}
              </div>
            )}
          </div>

          {/* New Password */}
          <div className="form-group">
            <label className="form-label">
              <Lock className="label-icon" />
              New Password
            </label>
            <div className="password-input-container">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className={`form-input ${errors.newPassword ? 'error' : ''}`}
                placeholder="Enter your new password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="password-strength">
                <div className="strength-header">
                  <span className="strength-label">Password Strength:</span>
                  <span 
                    className="strength-text"
                    style={{ color: getPasswordStrengthColor(passwordStrength.score) }}
                  >
                    {getPasswordStrengthText(passwordStrength.score)}
                  </span>
                </div>
                <div className="strength-bar">
                  <div 
                    className="strength-progress"
                    style={{ 
                      width: `${(passwordStrength.score / 6) * 100}%`,
                      backgroundColor: getPasswordStrengthColor(passwordStrength.score)
                    }}
                  ></div>
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <div className="strength-feedback">
                    <p className="feedback-title">Password should include:</p>
                    <ul className="feedback-list">
                      {passwordStrength.feedback.map((item, index) => (
                        <li key={index} className="feedback-item">
                          <AlertCircle className="feedback-icon" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {errors.newPassword && (
              <div className="error-message">
                <AlertCircle className="error-icon" />
                {errors.newPassword}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label">
              <Lock className="label-icon" />
              Confirm New Password
            </label>
            <div className="password-input-container">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirm your new password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="error-message">
                <AlertCircle className="error-icon" />
                {errors.confirmPassword}
              </div>
            )}
          </div>

          {/* Submit Status */}
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="success-message"
            >
              <CheckCircle className="success-icon" />
              <span>Password updated successfully!</span>
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="error-message global-error"
            >
              <AlertCircle className="error-icon" />
              <span>Failed to update password. Please try again.</span>
            </motion.div>
          )}

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
              disabled={isSubmitting || !passwordStrength.isStrong}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  Updating Password...
                </>
              ) : (
                <>
                  <Shield className="submit-icon" />
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Security Notice */}
      <div className="security-notice">
        <div className="notice-content">
          <AlertCircle className="notice-icon" />
          <div className="notice-text">
            <h4>Security Notice</h4>
            <p>
              After changing your password, you'll need to log in again on all devices. 
              Make sure to update your password manager and other applications that use this account.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChangePassword;
