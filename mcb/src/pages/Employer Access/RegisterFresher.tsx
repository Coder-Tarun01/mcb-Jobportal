import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Upload,
  Check
} from 'lucide-react';
import './RegisterFresher.css';

interface FormData {
  // Personal fields
  name: string;
  email: string;
  password: string;
  mobile: string;
  currentCity: string;
  resume: File | null;
  agreeToTerms: boolean;
  // Education fields
  highestQualification: string;
  course: string;
  specialization: string;
  university: string;
  courseType: string;
  passingYear: string;
  education: string;
}

const RegisterFresher: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState<FormData>({
    // Personal fields
    name: '',
    email: '',
    password: '',
    mobile: '',
    currentCity: '',
    resume: null,
    agreeToTerms: false,
    // Education fields
    highestQualification: '',
    course: '',
    specialization: '',
    university: '',
    courseType: 'Full Time',
    passingYear: '',
    education: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        resume: file
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    if (activeTab === 'personal') {
      if (!formData.name) newErrors.name = 'Full Name is required';
      if (!formData.email) newErrors.email = 'Email ID is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email ID is invalid';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form Data:', formData);
      // In a real app, send data to backend
      alert('Registration Successful!');
      navigate('/login'); // Redirect to login after successful registration
    } else {
      console.log('Form has errors:', errors);
    }
  };

  return (
    <div className="reg-fresh-fresher-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="register-container"
      >
        <div className="register-header">
          <button onClick={() => navigate('/register')} className="back-btn">
            <ArrowLeft className="btn-icon" />
            <span>Back</span>
          </button>
          <h1 className="page-title">Register as a Fresher</h1>
          <p className="page-subtitle">Start your career journey with us and find your dream job.</p>
        </div>

        <div className="register-content">
          {/* Main Form Section */}
          <div className="main-form-section">
            {/* Tabs */}
            <div className="tabs-navigation">
              <button
                className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
                onClick={() => setActiveTab('personal')}
              >
                Personal
              </button>
              <button
                className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`}
                onClick={() => setActiveTab('education')}
              >
                Education
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="register-form">
              {activeTab === 'personal' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="tab-content"
                >
                  <div className="reg-fresh-group">
                    <label className="reg-fresh-label">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter Full Name"
                      className={`reg-fresh-input ${errors.name ? 'error' : ''}`}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>

                  <div className="reg-fresh-group">
                    <label className="reg-fresh-label">Email ID*</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter Your Email"
                      className={`reg-fresh-input ${errors.email ? 'error' : ''}`}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  <div className="reg-fresh-group">
                    <label className="reg-fresh-label">Create Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Minimum 6 characters"
                      className={`reg-fresh-input ${errors.password ? 'error' : ''}`}
                    />
                    {errors.password && <span className="error-message">{errors.password}</span>}
                  </div>

                  <div className="reg-fresh-group">
                    <label className="reg-fresh-label">Mobile number</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="+91 123 456 7890"
                      className={`reg-fresh-input ${errors.mobile ? 'error' : ''}`}
                    />
                    {errors.mobile && <span className="error-message">{errors.mobile}</span>}
                  </div>

                  <div className="reg-fresh-group">
                    <label className="reg-fresh-label">Current City</label>
                    <input
                      type="text"
                      name="currentCity"
                      value={formData.currentCity}
                      onChange={handleInputChange}
                      placeholder="Tell us about your current city"
                      className={`reg-fresh-input ${errors.currentCity ? 'error' : ''}`}
                    />
                    {errors.currentCity && <span className="error-message">{errors.currentCity}</span>}
                  </div>

                  <div className="reg-fresh-group">
                    <label className="reg-fresh-label">Upload Resume</label>
                    <div className="file-upload-container">
                      <input
                        type="file"
                        id="resume"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="file-input"
                      />
                      <label htmlFor="resume" className="file-upload-btn">
                        <Upload className="upload-icon" />
                        Upload File
                      </label>
                      {formData.resume ? (
                        <span className="file-name">{formData.resume.name}</span>
                      ) : (
                        <span className="file-placeholder">No file chosen</span>
                      )}
                    </div>
                    <p className="file-help">
                      If you do not have a resume document, you may write your brief professional profile{' '}
                      <button type="button" className="profile-link">here</button>.
                    </p>
                  </div>

                  <div className="reg-fresh-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className="checkbox-input"
                      />
                      <span className="checkbox-custom">
                        {formData.agreeToTerms && <Check className="check-icon" />}
                      </span>
                      I agree to the Terms and Conditions and Privacy Policy
                    </label>
                    {errors.agreeToTerms && <span className="error-message">{errors.agreeToTerms}</span>}
                  </div>

                  <button type="submit" className="register-btn">
                    Register Now
                  </button>
                </motion.div>
              )}

              {activeTab === 'education' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="tab-content"
                >
                  <div className="reg-fresh-group">
                    <label className="reg-fresh-label">Highest Qualification</label>
                    <input
                      type="text"
                      name="highestQualification"
                      value={formData.highestQualification}
                      onChange={handleInputChange}
                      placeholder="Your highest qualification"
                      className="reg-fresh-input"
                    />
                  </div>

                  <div className="reg-fresh-group">
                    <label className="reg-fresh-label">Course</label>
                    <input
                      type="text"
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      placeholder="Your course"
                      className="reg-fresh-input"
                    />
                  </div>

                  <div className="reg-fresh-group">
                    <label className="reg-fresh-label">Specialization</label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      placeholder="Specialization"
                      className="reg-fresh-input"
                    />
                  </div>

                  <div className="reg-fresh-group">
                    <label className="reg-fresh-label">University / College</label>
                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleInputChange}
                      placeholder="Institute Name"
                      className="reg-fresh-input"
                    />
                  </div>

                  <div className="reg-fresh-group">
                    <label className="reg-fresh-label">Course Type</label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="courseType"
                          value="Full Time"
                          checked={formData.courseType === 'Full Time'}
                          onChange={handleInputChange}
                          className="radio-input"
                        />
                        <span className="radio-custom"></span>
                        Full Time
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="courseType"
                          value="Part Time"
                          checked={formData.courseType === 'Part Time'}
                          onChange={handleInputChange}
                          className="radio-input"
                        />
                        <span className="radio-custom"></span>
                        Part Time
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="courseType"
                          value="Correspondence"
                          checked={formData.courseType === 'Correspondence'}
                          onChange={handleInputChange}
                          className="radio-input"
                        />
                        <span className="radio-custom"></span>
                        Correspondence
                      </label>
                    </div>
                  </div>

                  <div className="reg-fresh-group">
                    <label className="reg-fresh-label">Passing Year</label>
                    <select
                      name="passingYear"
                      value={formData.passingYear}
                      onChange={handleInputChange}
                      className="reg-fresh-select"
                    >
                      <option value="">Select</option>
                      {Array.from({ length: 26 }, (_, i) => 2025 - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div className="reg-fresh-group">
                    <label className="reg-fresh-label">Education</label>
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      placeholder="Additional education details (optional)"
                      className="reg-fresh-input"
                    />
                  </div>

                  <button type="button" className="continue-btn">
                    Continue
                  </button>
                </motion.div>
              )}
            </form>
          </div>

          {/* Job Alert Sidebar */}
          <div className="job-alert-sidebar">
            <h3 className="sidebar-title">Why should you create a job alert?</h3>
            <ul className="benefits-list">
              <li>
                <Check className="check-icon" /> Get relevant jobs directly in your inbox
              </li>
              <li>
                <Check className="check-icon" /> Stay updated with latest opportunities
              </li>
              <li>
                <Check className="check-icon" /> Be the first one to apply
              </li>
              <li>
                <Check className="check-icon" /> Create up to 5 personalized job alerts
              </li>
            </ul>

            <div className="stats-section">
              <p className="stats-text">Why info@example.com</p>
              <p className="stats-highlight">800,000+ Jobs</p>
              <p className="stats-highlight">100,000+ CV searches daily</p>
              <p className="stats-description">
                We are a leading job portal connecting job seekers with top employers.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterFresher;
