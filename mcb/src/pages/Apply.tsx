import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Upload, 
  File, 
  CheckCircle, 
  AlertCircle,
  User,
  Mail,
  Phone,
  Briefcase,
  Building2
} from 'lucide-react';
import { jobsAPI, applicationsAPI } from '../services/api';
import { Job } from '../types/job';
import { useAuth } from '../context/AuthContext';
import ResumeUploader from '../components/dashboard/ResumeUploader';
import './Apply.css';

const Apply: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    coverLetter: ''
  });
  const [resume, setResume] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (id) {
      loadJob();
    }
  }, [id, user, navigate]);

  const loadJob = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const jobData = await jobsAPI.fetchJobById(id);
      setJob(jobData);
      setFormData(prev => ({
        ...prev,
        name: user?.name || '',
        email: user?.email || ''
      }));
    } catch (error) {
      console.error('Error loading job:', error);
      navigate('/jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleResumeUpload = (file: File) => {
    setResume(file);
    if (error) setError('');
  };

  const handleResumeRemove = () => {
    setResume(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    if (!resume) {
      setError('Please upload your resume');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const result = await applicationsAPI.applyToJob(id!, {
        coverLetter: formData.coverLetter,
        resume: resume || undefined
      });

      if (result.success) {
        setSuccess('Application submitted successfully! We will review your application and get back to you soon.');
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setError('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setError('An error occurred while submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="apply-loading">
        <div className="loading-spinner" />
        <p className="apply-loading-text">Loading application form...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="apply-error">
        <h2 className="apply-error-title">Job Not Found</h2>
        <p className="apply-error-text">The job you're trying to apply for doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/jobs')} className="back-to-jobs-btn">
          <ArrowLeft className="btn-icon" />
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="apply-page">
      <div className="apply-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="apply-header"
        >
          <button
            onClick={() => navigate(-1)}
            className="back-button"
          >
            <ArrowLeft className="back-icon" />
            <span>Back</span>
          </button>

          <div className="header-content">
            <h1 className="page-title apply-page-title">Apply for Position</h1>
            <p className="page-subtitle apply-page-subtitle">
              Complete your application for this exciting opportunity
            </p>
          </div>
        </motion.div>

        <div className="apply-content">
          {/* Job Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="job-summary"
          >
            <div className="job-summary-header">
              <div className="company-logo">
                {job.companyLogo ? (
                  <img src={job.companyLogo} alt={`${job.company} logo`} />
                ) : (
                  <Building2 className="default-logo" />
                )}
              </div>
              <div className="job-info">
                <h2 className="job-title apply-job-title">{job.title}</h2>
                <div className="company-info">
                  <Building2 className="company-icon" />
                  <span className="company-name apply-company-name">{job.company}</span>
                </div>
                <div className="job-location">
                  <Briefcase className="location-icon" />
                  <span className="apply-job-location">{job.location}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Application Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="application-form-container"
          >
            <div className="form-header">
              <h3 className="form-title apply-form-title">Application Details</h3>
              <p className="form-subtitle apply-form-subtitle">
                Please fill in your information and upload your resume
              </p>
            </div>

            <form onSubmit={handleSubmit} className="application-form">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="error-message"
                >
                  <AlertCircle className="error-icon" />
                  <span className="apply-error-message-text">{error}</span>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="success-message"
                >
                  <CheckCircle className="success-icon" />
                  <span className="apply-success-message-text">{success}</span>
                </motion.div>
              )}

              {/* Personal Information */}
              <div className="form-section">
                <h4 className="section-title apply-section-title">Personal Information</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      <User className="label-icon" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      <Mail className="label-icon" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      <Phone className="label-icon" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Resume Upload */}
              <div className="form-section">
                <h4 className="section-title apply-section-title">Resume</h4>
                <ResumeUploader
                  currentResume={resume ? URL.createObjectURL(resume) : null}
                  onResumeUpload={handleResumeUpload}
                  onResumeRemove={handleResumeRemove}
                />
              </div>

              {/* Cover Letter */}
              <div className="form-section">
                <h4 className="section-title apply-section-title">Cover Letter (Optional)</h4>
                <div className="form-group">
                  <label htmlFor="coverLetter" className="form-label">
                    Tell us why you're interested in this position
                  </label>
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows={6}
                    placeholder="Write a brief cover letter explaining your interest and qualifications for this position..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="form-actions">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="submit-button"
                >
                  {isSubmitting ? (
                    <>
                      <div className="loading-spinner small" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="submit-icon" />
                      <span>Submit Application</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Apply;
