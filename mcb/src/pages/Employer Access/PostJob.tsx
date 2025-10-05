import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Briefcase,
  Mail,
  MapPin,
  DollarSign,
  Clock,
  Upload,
  Plus,
  X,
  Save,
  Tag,
  AlertCircle,
  CheckCircle,
  Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import EmployerLayout from '../../components/employer/EmployerLayout';
import './PostJob.css';

const PostJob: React.FC = () => {
  const navigate = useNavigate();
  const { user, isEmployer } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [jobData, setJobData] = useState({
    // Job Details Section
    title: '',
    email: user?.email || '',
    jobTags: [] as string[],
    type: 'Full Time',
    experience: '',
    
    // Salary Section
    minSalary: '',
    maxSalary: '',
    
    // Location Section
    region: '',
    location: '',
    
    // Current tag input
    currentTag: '',
  });

  const jobTypes = [
    'Full Time',
    'Part Time',
    'Contract',
    'Internship',
    'Remote',
    'Freelance',
    'Temporary'
  ];

  React.useEffect(() => {
    if (!user || !isEmployer()) {
      navigate('/login');
      return;
    }
  }, [user, navigate, isEmployer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJobData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddTag = () => {
    if (jobData.currentTag.trim() && !jobData.jobTags.includes(jobData.currentTag.trim())) {
      setJobData(prev => ({
        ...prev,
        jobTags: [...prev.jobTags, prev.currentTag.trim()],
        currentTag: ''
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setJobData(prev => ({
      ...prev,
      jobTags: prev.jobTags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required field validation
    if (!jobData.title.trim()) {
      newErrors.title = 'Job title is required';
    }
    if (!jobData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(jobData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!jobData.minSalary.trim()) {
      newErrors.minSalary = 'Minimum salary is required';
    } else if (isNaN(Number(jobData.minSalary)) || Number(jobData.minSalary) <= 0) {
      newErrors.minSalary = 'Please enter a valid minimum salary';
    }
    if (!jobData.maxSalary.trim()) {
      newErrors.maxSalary = 'Maximum salary is required';
    } else if (isNaN(Number(jobData.maxSalary)) || Number(jobData.maxSalary) <= 0) {
      newErrors.maxSalary = 'Please enter a valid maximum salary';
    } else if (Number(jobData.maxSalary) < Number(jobData.minSalary)) {
      newErrors.maxSalary = 'Maximum salary must be greater than minimum salary';
    }
    if (!jobData.region.trim()) {
      newErrors.region = 'Region is required';
    }
    if (!jobData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccess('');
    
    try {
      // Simulate API call
      console.log('Submitting job:', {
        ...jobData,
        uploadedFile: uploadedFile?.name || null
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess('Job posted successfully!');
      
      // Auto-hide success message and redirect after 3 seconds
      setTimeout(() => {
        setSuccess('');
        navigate('/employer/dashboard');
      }, 3000);
    } catch (error) {
      setErrors({ general: 'Failed to post job. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EmployerLayout>
      <div className="post-job-job-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="post-job-job-container"
        >
        <div className="post-job-header">
          <button onClick={() => navigate('/employer/dashboard')} className="post-job-back-btn">
            <ArrowLeft className="post-job-btn-icon" />
            <span>Back to Dashboard</span>
          </button>
          <div className="post-job-header-content">
            <h1 className="post-job-title">Post a New Job</h1>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="post-job-success-message"
          >
            <CheckCircle className="post-job-success-icon" />
            <span>{success}</span>
          </motion.div>
        )}

        {/* General Error */}
        {errors.general && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="post-job-error-message"
          >
            <AlertCircle className="post-job-error-icon" />
            <span>{errors.general}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="post-job-form">
          {/* Job Details Section */}
          <div className="post-job-section">
            <h2 className="post-job-section-title">
              <Briefcase className="post-job-section-icon" />
              Job Details
            </h2>
            <div className="post-job-form-grid">
              <div className="post-job-group">
                <label className="post-job-label required">Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={jobData.title}
                  onChange={handleInputChange}
                  placeholder="Enter Job Title"
                  className={`post-job-input ${errors.title ? 'post-job-error' : ''}`}
                />
                {errors.title && <span className="post-job-error-text">{errors.title}</span>}
              </div>

              <div className="post-job-group">
                <label className="post-job-label required">
                  <Mail className="post-job-label-icon" />
                  Your Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={jobData.email}
                  onChange={handleInputChange}
                  placeholder="info@gmail.com"
                  className={`post-job-input ${errors.email ? 'post-job-error' : ''}`}
                />
                {errors.email && <span className="post-job-error-text">{errors.email}</span>}
              </div>

              <div className="post-job-group">
                <label className="post-job-label">
                  <Clock className="post-job-label-icon" />
                  Job Type
                </label>
                <select
                  name="type"
                  value={jobData.type}
                  onChange={handleInputChange}
                  className="post-job-select"
                >
                  {jobTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="post-job-group">
                <label className="post-job-label">Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={jobData.experience}
                  onChange={handleInputChange}
                  placeholder="1 Year"
                  className="post-job-input"
                />
              </div>
            </div>

            {/* Job Tags */}
            <div className="post-job-group">
              <label className="post-job-label">
                <Tag className="post-job-label-icon" />
                Job Tags
              </label>
              <div className="post-job-tags-container">
                <div className="post-job-tags-list">
                  {jobData.jobTags.map((tag, index) => (
                    <span key={index} className="post-job-tag">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="post-job-tag-remove"
                      >
                        <X className="post-job-tag-remove-icon" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="post-job-tag-input-container">
                  <input
                    type="text"
                    name="currentTag"
                    value={jobData.currentTag}
                    onChange={handleInputChange}
                    onKeyPress={handleTagKeyPress}
                    placeholder="Add a tag and press Enter"
                    className="post-job-input"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="post-job-add-tag-btn"
                  >
                    <Plus className="post-job-btn-icon" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Salary Section */}
          <div className="post-job-section">
            <h2 className="post-job-section-title">
              <DollarSign className="post-job-section-icon" />
              Salary
            </h2>
            <div className="post-job-form-grid">
              <div className="post-job-group">
                <label className="post-job-label required">
                  <DollarSign className="post-job-label-icon" />
                  Minimum Salary ($)
                </label>
                <input
                  type="number"
                  name="minSalary"
                  value={jobData.minSalary}
                  onChange={handleInputChange}
                  placeholder="e.g. 10000"
                  className={`post-job-input ${errors.minSalary ? 'post-job-error' : ''}`}
                />
                {errors.minSalary && <span className="post-job-error-text">{errors.minSalary}</span>}
              </div>

              <div className="post-job-group">
                <label className="post-job-label required">
                  <DollarSign className="post-job-label-icon" />
                  Maximum Salary ($)
                </label>
                <input
                  type="number"
                  name="maxSalary"
                  value={jobData.maxSalary}
                  onChange={handleInputChange}
                  placeholder="e.g. 20000"
                  className={`post-job-input ${errors.maxSalary ? 'post-job-error' : ''}`}
                />
                {errors.maxSalary && <span className="post-job-error-text">{errors.maxSalary}</span>}
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="post-job-section">
            <h2 className="post-job-section-title">
              <MapPin className="post-job-section-icon" />
              Location
            </h2>
            <div className="post-job-form-grid">
              <div className="post-job-group">
                <label className="post-job-label required">
                  <Globe className="post-job-label-icon" />
                  Region
                </label>
                <input
                  type="text"
                  name="region"
                  value={jobData.region}
                  onChange={handleInputChange}
                  placeholder="New York"
                  className={`post-job-input ${errors.region ? 'post-job-error' : ''}`}
                />
                {errors.region && <span className="post-job-error-text">{errors.region}</span>}
              </div>

              <div className="post-job-group">
                <label className="post-job-label required">
                  <MapPin className="post-job-label-icon" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={jobData.location}
                  onChange={handleInputChange}
                  placeholder="London"
                  className={`post-job-input ${errors.location ? 'post-job-error' : ''}`}
                />
                {errors.location && <span className="post-job-error-text">{errors.location}</span>}
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="post-job-section">
            <h2 className="post-job-section-title">
              <Upload className="post-job-section-icon" />
              File Upload
            </h2>
            <div className="post-job-file-upload-container">
              <div
                className={`post-job-file-upload-area ${dragActive ? 'post-job-drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="post-job-file-upload-content">
                  <Upload className="post-job-upload-icon" />
                  <div className="post-job-upload-text">
                    <p className="post-job-upload-primary">
                      {uploadedFile ? uploadedFile.name : 'Drag and drop your file here'}
                    </p>
                    <p className="post-job-upload-secondary">
                      {uploadedFile ? `Size: ${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB` : 'or'}
                    </p>
                  </div>
                  {!uploadedFile && (
                    <button
                      type="button"
                      onClick={handleBrowseClick}
                      className="post-job-browse-btn"
                    >
                      Browse File
                    </button>
                  )}
                  {uploadedFile && (
                    <button
                      type="button"
                      onClick={() => setUploadedFile(null)}
                      className="post-job-remove-file-btn"
                    >
                      <X className="post-job-btn-icon" />
                      Remove File
                    </button>
                  )}
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="post-job-file-input-hidden"
                accept=".pdf,.doc,.docx,.txt"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="post-job-form-actions">
            <button
              type="button"
              onClick={() => navigate('/employer/dashboard')}
              className="post-job-back-btn-action"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="post-job-submit-btn"
            >
              {isLoading ? (
                <div className="post-job-loading-spinner" />
              ) : (
                <>
                  <Save className="post-job-btn-icon" />
                  <span>Upload / Post Job</span>
                </>
              )}
            </button>
          </div>
        </form>
        </motion.div>
      </div>
    </EmployerLayout>
  );
};

export default PostJob;