import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, AlertCircle, CheckCircle, Briefcase, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, User } from '../../types/user';
import './AuthForm.css';

const SignupForm: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee' as UserRole,
    companyName: '',
    skills: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = 'checked' in e.target ? e.target.checked : false;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!formData.acceptTerms) {
      setError('Please accept the Terms of Service and Privacy Policy to continue');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare additional data based on role
      const additionalData: Partial<User> = {};
      
      if (formData.role === 'employer') {
        additionalData.companyName = formData.companyName;
      } else if (formData.role === 'employee') {
        additionalData.skills = formData.skills.split(',').map(skill => skill.trim()).filter(Boolean);
      }

      const success = await signup(
        formData.name, 
        formData.email, 
        formData.password, 
        formData.role,
        additionalData
      );
      
      if (success) {
        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => {
          const redirectPath = formData.role === 'employer' ? '/employer/dashboard' : '/dashboard';
          navigate(redirectPath);
        }, 1500);
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-card">
      <div className="auth-form-header">
        <div className="auth-form-logo">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#logoGradient)"/>
              <path d="M8 12h16v2H8v-2zm0 4h16v2H8v-2zm0 4h12v2H8v-2z" fill="white"/>
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563eb"/>
                  <stop offset="100%" stopColor="#3b82f6"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="error-message"
          >
            <AlertCircle className="error-icon" />
            <span>{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="success-message"
          >
            <CheckCircle className="success-icon" />
            <span>{success}</span>
          </motion.div>
        )}

        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <div className="input-group">
            <UserIcon className="input-icon" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <div className="input-group">
            <Mail className="input-icon" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">I am a</label>
          <div className="role-selection">
            <label className={`role-option ${formData.role === 'employee' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="role"
                value="employee"
                checked={formData.role === 'employee'}
                onChange={handleChange}
                className="role-radio"
              />
              <div className="role-card">
                <Briefcase className="role-icon" />
                <span className="role-title">Job Seeker</span>
                <span className="role-description">Looking for opportunities</span>
              </div>
            </label>
            
            <label className={`role-option ${formData.role === 'employer' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="role"
                value="employer"
                checked={formData.role === 'employer'}
                onChange={handleChange}
                className="role-radio"
              />
              <div className="role-card">
                <Building2 className="role-icon" />
                <span className="role-title">Employer</span>
                <span className="role-description">Hiring talent</span>
              </div>
            </label>
          </div>
        </div>

        {formData.role === 'employer' && (
          <div className="form-group">
            <label htmlFor="companyName" className="form-label">
              Company Name
            </label>
            <div className="input-group">
              <Building2 className="input-icon" />
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter your company name"
                className="form-input"
                required
              />
            </div>
          </div>
        )}

        {formData.role === 'employee' && (
          <div className="form-group">
            <label htmlFor="skills" className="form-label">
              Skills (comma-separated)
            </label>
            <div className="input-group">
              <UserIcon className="input-icon" />
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g., React, JavaScript, Python"
                className="form-input"
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="input-group">
            <Lock className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="form-input password-input"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
            >
              {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <div className="input-group">
            <Lock className="input-icon" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="form-input password-input"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="password-toggle"
            >
              {showConfirmPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
            </button>
          </div>
        </div>

        <div className="form-options">
          <label className={`checkbox-label ${formData.acceptTerms ? 'checked' : ''}`}>
            <input 
              type="checkbox" 
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="checkbox-input" 
              required 
            />
            <span className="checkbox-text">
              I agree to the{' '}
              <Link to="/terms" className="terms-link">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="terms-link">
                Privacy Policy
              </Link>
            </span>
          </label>
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="submit-button"
        >
          {isLoading ? (
            <div className="loading-spinner" />
          ) : (
            'Create Account'
          )}
        </motion.button>
      </form>

      <div className="auth-form-footer">
        <p className="auth-form-footer-text">
          Already have an account?{' '}
          <Link to="/login" className="auth-form-link">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
