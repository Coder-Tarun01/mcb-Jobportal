import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Plus, 
  Users, 
  Briefcase,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  MapPin,
  DollarSign,
  Clock,
  FileText,
  CreditCard,
  Search,
  Shield,
  Star,
  Award,
  Upload,
  Save,
  Phone,
  Mail,
  Globe,
  MapPin as Location
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchJobs, usersAPI } from '../../services/api';
import { Job } from '../../types/job';
import EmployerLayout from '../../components/employer/EmployerLayout';
import './EmployerDashboard.css';

const EmployerDashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isEmployer } = useAuth();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [postedJobs, setPostedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companyProfile, setCompanyProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    if (!user || !isEmployer()) {
      navigate('/login');
      return;
    }
    loadPostedJobs();
    loadCompanyProfile();
  }, [user, navigate, isEmployer]);

  const loadCompanyProfile = async () => {
    if (!user) return;
    
    setIsLoadingProfile(true);
    try {
      const userData = await usersAPI.fetchUserById(user.id);
      setCompanyProfile(userData);
    } catch (error) {
      console.error('Error loading company profile:', error);
      setCompanyProfile(null);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const loadPostedJobs = async () => {
    try {
      const jobs = await fetchJobs();
      // Filter jobs posted by this employer
      const employerJobs = jobs.filter(job => 
        job.company === user?.companyName
      );
      setPostedJobs(employerJobs);
    } catch (error) {
      console.error('Error loading posted jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    {
      icon: Briefcase,
      label: 'Posted Jobs',
      value: postedJobs.length,
      color: '#2563eb',
      change: '+12%'
    },
    {
      icon: Users,
      label: 'Total Applications',
      value: '156',
      color: '#10b981',
      change: '+8%'
    },
    {
      icon: Eye,
      label: 'Profile Views',
      value: '2.4k',
      color: '#f59e0b',
      change: '+15%'
    },
    {
      icon: TrendingUp,
      label: 'Response Rate',
      value: '94%',
      color: '#8b5cf6',
      change: '+3%'
    }
  ];

  const renderOverviewTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="emp-dash-tab"
    >
      <div className="emp-dash-header">
        <h2 className="emp-dash-title">Dashboard Overview</h2>
        <p className="emp-dash-subtitle">
          Welcome back, {user?.name}! Here's what's happening with your job postings.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="emp-dash-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="emp-dash-card"
          >
            <div className="emp-dash-icon" style={{ backgroundColor: stat.color + '20' }}>
              <stat.icon className="icon" style={{ color: stat.color }} />
            </div>
            <div className="emp-dash-content">
              <h3 className="emp-dash-value">{stat.value}</h3>
              <p className="emp-dash-label">{stat.label}</p>
              <span className="emp-dash-change positive">{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="emp-dash-activity">
        <h3 className="emp-dash-title">Recent Activity</h3>
        <div className="emp-dash-list">
          <div className="emp-dash-item">
            <div className="emp-dash-icon">
              <Users className="icon" />
        </div>
            <div className="emp-dash-content">
              <p className="emp-dash-text">New application received for Senior Developer position</p>
              <span className="emp-dash-time">2 hours ago</span>
            </div>
          </div>
          <div className="emp-dash-item">
            <div className="emp-dash-icon">
              <Eye className="icon" />
            </div>
            <div className="emp-dash-content">
              <p className="emp-dash-text">Your company profile was viewed 15 times today</p>
              <span className="emp-dash-time">4 hours ago</span>
            </div>
          </div>
          <div className="emp-dash-item">
            <div className="emp-dash-icon">
              <Briefcase className="icon" />
            </div>
            <div className="emp-dash-content">
              <p className="emp-dash-text">Job posting "Frontend Developer" is now live</p>
              <span className="emp-dash-time">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderJobsTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="jobs-tab"
    >
      <div className="jobs-header">
        <div className="jobs-header-content">
          <h2 className="emp-dash-title">Posted Jobs</h2>
          <p className="emp-dash-subtitle">
            Manage your job postings and track applications
          </p>
        </div>
        <button
          onClick={() => navigate('/employer/post-job')}
          className="post-job-btn"
        >
          <Plus className="btn-icon" />
          <span>Post New Job</span>
        </button>
      </div>

      {isLoading ? (
        <div className="jobs-loading">
          <div className="loading-spinner" />
          <p>Loading your jobs...</p>
        </div>
      ) : postedJobs.length > 0 ? (
        <div className="jobs-grid">
          {postedJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="job-card"
            >
              <div className="job-card-header">
                <div className="job-title-section">
                <h3 className="job-title">{job.title}</h3>
                <div className="job-meta">
                  <span className="job-type">{job.type}</span>
                    <span className="job-posted">
                      <Clock className="meta-icon" />
                      {new Date(job.postedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
                <div className="job-actions">
                  <button className="action-btn view">
                    <Eye className="btn-icon" />
                  </button>
                  <button className="action-btn edit">
                    <Edit className="btn-icon" />
                  </button>
                  <button className="action-btn delete">
                    <Trash2 className="btn-icon" />
                  </button>
                </div>
              </div>

              <div className="job-card-content">
                <div className="job-details">
                  <div className="job-detail">
                    <MapPin className="detail-icon" />
                    <span>{job.location}</span>
                  </div>
                  <div className="job-detail">
                    <DollarSign className="detail-icon" />
                    <span>${(job.salary.min / 1000)}k - ${(job.salary.max / 1000)}k</span>
                  </div>
                  <div className="job-detail">
                    <Users className="detail-icon" />
                    <span>{job.experience.min}-{job.experience.max} years</span>
                  </div>
                </div>

              <div className="job-stats">
                <div className="stat">
                    <span className="emp-dash-value">24</span>
                  <span className="emp-dash-label">Applications</span>
                </div>
                <div className="stat">
                    <span className="emp-dash-value">156</span>
                  <span className="emp-dash-label">Views</span>
                </div>
                  <div className="stat">
                    <span className="emp-dash-value">8</span>
                    <span className="emp-dash-label">Shortlisted</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="no-jobs">
          <Briefcase className="no-jobs-icon" />
          <h3 className="no-jobs-title">No Jobs Posted Yet</h3>
          <p className="no-jobs-subtitle">
            Start by posting your first job to attract top talent
          </p>
          <button
            onClick={() => navigate('/employer/post-job')}
            className="post-first-job-btn"
          >
            <Plus className="btn-icon" />
            <span>Post Your First Job</span>
          </button>
      </div>
      )}
    </motion.div>
  );

  const renderApplicationsTab = () => (
            <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="applications-tab"
    >
      <div className="applications-header">
        <h2 className="emp-dash-title">Applications</h2>
        <p className="emp-dash-subtitle">
          Review and manage job applications
        </p>
                  </div>

      <div className="applications-filters">
        <div className="filter-group">
          <label className="filter-label">Filter by Job</label>
          <select className="filter-select">
            <option value="">All Jobs</option>
            {postedJobs.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
              </div>
        <div className="filter-group">
          <label className="filter-label">Status</label>
          <select className="filter-select">
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="applications-list">
        <div className="application-card">
          <div className="application-header">
              <div className="candidate-info">
              <div className="candidate-avatar">
                <span>JD</span>
                </div>
              <div className="candidate-details">
                <h4 className="candidate-name">John Doe</h4>
                <p className="candidate-title">Senior Frontend Developer</p>
                <p className="candidate-location">New York, NY</p>
                </div>
              </div>
            <div className="application-meta">
              <span className="application-status new">New</span>
              <span className="application-date">2 hours ago</span>
                </div>
              </div>
          <div className="application-content">
            <p className="application-text">
              Experienced frontend developer with 5+ years in React and TypeScript. 
              Looking for new challenges in a dynamic team environment.
            </p>
            <div className="application-skills">
              <span className="skill-tag">React</span>
              <span className="skill-tag">TypeScript</span>
              <span className="skill-tag">Node.js</span>
              <span className="skill-tag">AWS</span>
            </div>
          </div>
          <div className="application-actions">
            <button className="action-btn view-resume">
              <FileText className="btn-icon" />
              <span>View Resume</span>
            </button>
            <button className="action-btn shortlist">
              <Users className="btn-icon" />
              <span>Shortlist</span>
            </button>
            <button className="action-btn reject">
              <Trash2 className="btn-icon" />
              <span>Reject</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );


  const renderCompanyProfileTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="company-profile-tab"
    >
      <div className="profile-header">
        <h2 className="emp-dash-title">Company Profile</h2>
        <p className="emp-dash-subtitle">
          Manage your company information and public profile
        </p>
      </div>

      <div className="profile-sections">
        {/* Basic Information */}
        <div className="profile-section">
          <div className="section-header">
            <Building2 className="section-icon" />
            <h3 className="emp-dash-title">Basic Information</h3>
            <button className="edit-section-btn">
              <Edit className="btn-icon" />
              <span>Edit</span>
            </button>
          </div>
          
          <div className="profile-form">
            <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Company Name</label>
                <input 
                  type="text" 
                  value={isLoadingProfile ? 'Loading...' : companyProfile?.companyName || user?.companyName || ''} 
                  className="form-input" 
                  readOnly 
                />
            </div>
            <div className="form-group">
              <label className="form-label">Industry</label>
                <input 
                  type="text" 
                  value={isLoadingProfile ? 'Loading...' : companyProfile?.industry || ''}
                  placeholder="e.g., Technology, Healthcare" 
                  className="form-input" 
                />
            </div>
            <div className="form-group">
              <label className="form-label">Company Size</label>
              <select className="form-select" value={companyProfile?.companySize || ''}>
                <option value="">Select company size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </div>
            <div className="form-group">
                <label className="form-label">Founded Year</label>
                <input 
                  type="number" 
                  value={companyProfile?.foundedYear || ''}
                  placeholder="2020" 
                  className="form-input" 
                />
            </div>
            </div>

            <div className="form-group">
              <label className="form-label">Company Description</label>
              <textarea 
                className="form-textarea" 
                rows={4}
                value={isLoadingProfile ? 'Loading...' : companyProfile?.companyDescription || companyProfile?.description || ''}
                placeholder="Tell candidates about your company, culture, and mission..."
              />
            </div>
            </div>
          </div>

        {/* Contact Information */}
        <div className="profile-section">
          <div className="section-header">
            <Phone className="section-icon" />
            <h3 className="emp-dash-title">Contact Information</h3>
          </div>
          
          <div className="profile-form">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  <Mail className="label-icon" />
                  Email Address
                </label>
                <input 
                  type="email" 
                  value={isLoadingProfile ? 'Loading...' : companyProfile?.email || user?.email || ''} 
                  className="form-input" 
                  readOnly 
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <Phone className="label-icon" />
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  value={isLoadingProfile ? 'Loading...' : companyProfile?.phone || ''}
                  placeholder="+1 (555) 123-4567" 
                  className="form-input" 
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <Globe className="label-icon" />
                  Website
                </label>
                <input 
                  type="url" 
                  value={isLoadingProfile ? 'Loading...' : companyProfile?.website || ''}
                  placeholder="https://yourcompany.com" 
                  className="form-input" 
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <Location className="label-icon" />
                  Address
                </label>
                <input 
                  type="text" 
                  value={isLoadingProfile ? 'Loading...' : companyProfile?.fullAddress || companyProfile?.address || ''}
                  placeholder="123 Business St, City, State 12345" 
                  className="form-input" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Company Logo */}
        <div className="profile-section">
          <div className="section-header">
            <Upload className="section-icon" />
            <h3 className="emp-dash-title">Company Logo</h3>
          </div>
          
          <div className="logo-upload">
            <div className="current-logo">
              {isLoadingProfile ? (
                <div className="logo-placeholder">
                  <Building2 className="placeholder-icon" />
                  <span>Loading...</span>
                </div>
              ) : companyProfile?.companyLogo ? (
                <img src={companyProfile.companyLogo} alt="Company Logo" className="logo-preview" />
              ) : (
                <div className="logo-placeholder">
                  <Building2 className="placeholder-icon" />
                  <span>No logo uploaded</span>
                </div>
              )}
            </div>
            <div className="upload-actions">
              <button className="upload-btn">
                <Upload className="btn-icon" />
                <span>Upload Logo</span>
              </button>
              <p className="upload-hint">Recommended: 200x200px, PNG or JPG</p>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="save-btn">
            <Save className="btn-icon" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderEmployerResumeTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="employer-resume-tab"
    >
      <div className="resume-header">
        <h2 className="emp-dash-title">Company Overview</h2>
        <p className="emp-dash-subtitle">
          Create a comprehensive company profile that attracts top talent
        </p>
        </div>

      <div className="resume-sections">
        {/* Company Story */}
        <div className="resume-section">
          <div className="section-header">
            <FileText className="section-icon" />
            <h3 className="emp-dash-title">Company Story</h3>
        </div>
          <textarea 
            className="form-textarea" 
            rows={6}
            placeholder="Share your company's journey, mission, and what makes you unique..."
          />
      </div>

        {/* Culture & Values */}
        <div className="resume-section">
          <div className="section-header">
            <Award className="section-icon" />
            <h3 className="emp-dash-title">Culture & Values</h3>
        </div>
          <textarea 
            className="form-textarea" 
            rows={4}
            placeholder="Describe your company culture, values, and work environment..."
          />
              </div>

        {/* Benefits & Perks */}
        <div className="resume-section">
          <div className="section-header">
            <Star className="section-icon" />
            <h3 className="emp-dash-title">Benefits & Perks</h3>
            </div>
          <div className="benefits-grid">
            <div className="benefit-item">
              <input type="checkbox" className="benefit-checkbox" />
              <span>Health Insurance</span>
            </div>
            <div className="benefit-item">
              <input type="checkbox" className="benefit-checkbox" />
              <span>Remote Work</span>
            </div>
            <div className="benefit-item">
              <input type="checkbox" className="benefit-checkbox" />
              <span>Flexible Hours</span>
              </div>
            <div className="benefit-item">
              <input type="checkbox" className="benefit-checkbox" />
              <span>401(k) Matching</span>
            </div>
            <div className="benefit-item">
              <input type="checkbox" className="benefit-checkbox" />
              <span>Professional Development</span>
            </div>
            <div className="benefit-item">
              <input type="checkbox" className="benefit-checkbox" />
              <span>Paid Time Off</span>
            </div>
          </div>
        </div>

        <div className="resume-actions">
          <button className="preview-btn">
                  <Eye className="btn-icon" />
            <span>Preview Profile</span>
                </button>
          <button className="save-btn">
            <Save className="btn-icon" />
            <span>Save Changes</span>
                </button>
              </div>
      </div>
    </motion.div>
  );




  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'applications':
        return renderApplicationsTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <EmployerLayout>
    <div className="emp-dash-page">
      <div className="emp-dash-container">
          {/* Main Content */}
          <div className="emp-dash-main">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </EmployerLayout>
  );
};

export default EmployerDashboard;
