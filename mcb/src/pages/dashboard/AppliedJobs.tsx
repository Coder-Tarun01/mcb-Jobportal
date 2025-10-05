import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, DollarSign, Eye, FileText, CheckCircle, Clock, XCircle, Grid3X3, List, Search } from 'lucide-react';
import './AppliedJobs.css';

interface AppliedJob {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'interview';
  jobType: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
}

const initialAppliedJobs: AppliedJob[] = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'TechCorp Solutions',
    location: 'San Francisco, CA',
    salary: '$80,000 - $120,000',
    appliedDate: '2024-01-15',
    status: 'shortlisted',
    jobType: 'Full-time',
    experience: '3-5 years',
    description: 'We are looking for a skilled Frontend Developer to join our team...',
    requirements: ['React', 'TypeScript', 'CSS3', 'HTML5', 'JavaScript'],
    benefits: ['Health Insurance', '401k', 'Remote Work', 'Flexible Hours']
  },
  {
    id: 2,
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    location: 'New York, NY',
    salary: '$70,000 - $100,000',
    appliedDate: '2024-01-12',
    status: 'interview',
    jobType: 'Full-time',
    experience: '2-4 years',
    description: 'Join our dynamic team as a Full Stack Developer...',
    requirements: ['Node.js', 'React', 'MongoDB', 'Express', 'AWS'],
    benefits: ['Stock Options', 'Health Insurance', 'Learning Budget']
  },
  {
    id: 3,
    title: 'React Developer',
    company: 'WebAgency Inc',
    location: 'Remote',
    salary: '$60,000 - $90,000',
    appliedDate: '2024-01-10',
    status: 'reviewed',
    jobType: 'Contract',
    experience: '1-3 years',
    description: 'Remote React Developer position for exciting projects...',
    requirements: ['React', 'Redux', 'CSS', 'Git', 'REST APIs'],
    benefits: ['Remote Work', 'Flexible Schedule', 'Project Bonuses']
  },
  {
    id: 4,
    title: 'UI/UX Developer',
    company: 'DesignStudio',
    location: 'Los Angeles, CA',
    salary: '$65,000 - $95,000',
    appliedDate: '2024-01-08',
    status: 'rejected',
    jobType: 'Full-time',
    experience: '2-4 years',
    description: 'Creative UI/UX Developer with strong design skills...',
    requirements: ['Figma', 'React', 'CSS3', 'JavaScript', 'Design Systems'],
    benefits: ['Health Insurance', 'Dental', 'Vision', 'Gym Membership']
  },
  {
    id: 5,
    title: 'JavaScript Developer',
    company: 'CodeCraft',
    location: 'Austin, TX',
    salary: '$55,000 - $85,000',
    appliedDate: '2024-01-05',
    status: 'pending',
    jobType: 'Full-time',
    experience: '1-3 years',
    description: 'Entry-level JavaScript Developer position...',
    requirements: ['JavaScript', 'HTML', 'CSS', 'Git', 'Problem Solving'],
    benefits: ['Mentorship Program', 'Health Insurance', '401k']
  }
];

const AppliedJobs: React.FC = () => {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>(initialAppliedJobs);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sortBy: 'appliedDate'
  });
  const [selectedJob, setSelectedJob] = useState<AppliedJob | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="applied-jobs-status-icon" />;
      case 'reviewed': return <Eye className="applied-jobs-status-icon" />;
      case 'shortlisted': return <CheckCircle className="applied-jobs-status-icon" />;
      case 'interview': return <Calendar className="applied-jobs-status-icon" />;
      case 'rejected': return <XCircle className="applied-jobs-status-icon" />;
      default: return <Clock className="applied-jobs-status-icon" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'reviewed': return '#3b82f6';
      case 'shortlisted': return '#10b981';
      case 'interview': return '#8b5cf6';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const filteredJobs = appliedJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         job.company.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === 'all' || job.status === filters.status;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (filters.sortBy === 'appliedDate') {
      return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
    }
    if (filters.sortBy === 'title') return a.title.localeCompare(b.title);
    if (filters.sortBy === 'company') return a.company.localeCompare(b.company);
    return 0;
  });

  const handleJobAction = (id: number, action: 'view' | 'withdraw') => {
    if (action === 'view') {
      const job = appliedJobs.find(j => j.id === id);
      setSelectedJob(job || null);
    } else if (action === 'withdraw') {
      setAppliedJobs(prev => prev.filter(job => job.id !== id));
    }
  };

  const closeJobDetails = () => {
    setSelectedJob(null);
  };

  const getStatusCount = (status: string) => {
    return appliedJobs.filter(job => job.status === status).length;
  };

  return (
    <div className="applied-jobs-container">
      {/* Modern Header */}
      <div className="applied-jobs-header">
        <div className="applied-jobs-header-content">
          <div>
            <h1 className="applied-jobs-title">Applied Jobs</h1>
            <p className="applied-jobs-subtitle">Track your job applications and their progress</p>
          </div>
          <div className="applied-jobs-stats">
            <div className="applied-jobs-stat">
              <span className="applied-jobs-stat-number">{appliedJobs.length}</span>
              <span className="applied-jobs-stat-label">Total Applied</span>
            </div>
            <div className="applied-jobs-stat">
              <span className="applied-jobs-stat-number">{getStatusCount('shortlisted')}</span>
              <span className="applied-jobs-stat-label">Shortlisted</span>
            </div>
            <div className="applied-jobs-stat">
              <span className="applied-jobs-stat-number">{getStatusCount('interview')}</span>
              <span className="applied-jobs-stat-label">Interviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Controls */}
      <div className="applied-jobs-controls">
        <div className="applied-jobs-controls-row">
          <div className="applied-jobs-search-container">
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', width: '16px', height: '16px' }} />
              <input
                type="text"
                placeholder="Search applied jobs..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="applied-jobs-search-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>
          <div className="applied-jobs-filters">
            <div className="applied-jobs-filter-group">
              <label className="applied-jobs-filter-label">Status:</label>
              <select 
                value={filters.status} 
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="applied-jobs-filter-select"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview">Interview</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="applied-jobs-filter-group">
              <label className="applied-jobs-filter-label">Sort by:</label>
              <select 
                value={filters.sortBy} 
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="applied-jobs-filter-select"
              >
                <option value="appliedDate">Applied Date</option>
                <option value="title">Job Title</option>
                <option value="company">Company</option>
              </select>
            </div>
            <div className="applied-jobs-view-toggle">
              <button 
                className={`applied-jobs-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <List style={{ width: '18px', height: '18px' }} />
              </button>
              <button 
                className={`applied-jobs-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <Grid3X3 style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Content */}
      {viewMode === 'list' ? (
        <div className="applied-jobs-table-container">
          <table className="applied-jobs-table">
            <thead>
              <tr>
                <th className="applied-jobs-th-job-title">Job Title</th>
                <th className="applied-jobs-th-company">Company</th>
                <th className="applied-jobs-th-location">Location</th>
                <th className="applied-jobs-th-salary">Salary</th>
                <th className="applied-jobs-th-applied-date">Applied Date</th>
                <th className="applied-jobs-th-status">Status</th>
                <th className="applied-jobs-th-action">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr key={job.id}>
                    <td className="applied-jobs-td-job-title">
                      <div className="applied-jobs-job-title">{job.title}</div>
                      <div className="applied-jobs-job-meta">{job.jobType} • {job.experience}</div>
                    </td>
                    <td className="applied-jobs-td-company">
                      <div className="applied-jobs-company-name">@{job.company}</div>
                    </td>
                    <td className="applied-jobs-td-location">
                      <div className="applied-jobs-location">
                        <MapPin className="applied-jobs-location-icon" />
                        {job.location}
                      </div>
                    </td>
                    <td className="applied-jobs-td-salary">
                      <div className="applied-jobs-salary">
                        <DollarSign className="applied-jobs-salary-icon" />
                        {job.salary}
                      </div>
                    </td>
                    <td className="applied-jobs-td-applied-date">
                      <div className="applied-jobs-applied-date">
                        {new Date(job.appliedDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="applied-jobs-td-status">
                      <div className={`applied-jobs-status-badge ${job.status}`}>
                        {getStatusIcon(job.status)}
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </div>
                    </td>
                    <td className="applied-jobs-td-action">
                      <div className="applied-jobs-actions">
                        <button 
                          className="applied-jobs-action-btn view" 
                          onClick={() => handleJobAction(job.id, 'view')}
                          title="View Details"
                        >
                          <Eye className="applied-jobs-action-icon" />
                        </button>
                        <button 
                          className="applied-jobs-action-btn withdraw" 
                          onClick={() => handleJobAction(job.id, 'withdraw')}
                          title="Withdraw Application"
                        >
                          <XCircle className="applied-jobs-action-icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="applied-jobs-no-jobs">
                      <div className="applied-jobs-no-jobs-icon">📋</div>
                      <h3>No applied jobs found</h3>
                      <p>Start applying to jobs to see them here.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="applied-jobs-grid">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} className="applied-jobs-job-card">
                <div className="applied-jobs-card-header">
                  <h3 className="applied-jobs-card-title">{job.title}</h3>
                  <p className="applied-jobs-card-meta">{job.jobType} • {job.experience}</p>
                </div>
                <div className="applied-jobs-card-body">
                  <div className="applied-jobs-card-info">
                    <div className="applied-jobs-card-info-item">
                      <span className="applied-jobs-company-name">@{job.company}</span>
                    </div>
                    <div className="applied-jobs-card-info-item">
                      <MapPin className="applied-jobs-location-icon" />
                      {job.location}
                    </div>
                    <div className="applied-jobs-card-info-item">
                      <DollarSign className="applied-jobs-salary-icon" />
                      {job.salary}
                    </div>
                    <div className="applied-jobs-card-info-item">
                      <Calendar className="applied-jobs-location-icon" />
                      Applied: {new Date(job.appliedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="applied-jobs-card-footer">
                  <div className={`applied-jobs-status-badge ${job.status}`}>
                    {getStatusIcon(job.status)}
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </div>
                  <div className="applied-jobs-card-actions">
                    <button 
                      className="applied-jobs-action-btn view"
                      onClick={() => handleJobAction(job.id, 'view')}
                      title="View Details"
                    >
                      <Eye className="applied-jobs-action-icon" />
                    </button>
                    <button 
                      className="applied-jobs-action-btn withdraw"
                      onClick={() => handleJobAction(job.id, 'withdraw')}
                      title="Withdraw Application"
                    >
                      <XCircle className="applied-jobs-action-icon" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="applied-jobs-no-jobs">
              <div className="applied-jobs-no-jobs-icon">📋</div>
              <h3>No applied jobs found</h3>
              <p>Start applying to jobs to see them here.</p>
            </div>
          )}
        </div>
      )}

      {/* Modern Job Details Modal */}
      {selectedJob && (
        <div className="applied-jobs-modal" onClick={closeJobDetails}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="applied-jobs-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="applied-jobs-modal-header">
              <h3 className="applied-jobs-modal-title">{selectedJob.title}</h3>
              <button className="applied-jobs-modal-close" onClick={closeJobDetails}>×</button>
            </div>
            
            <div className="applied-jobs-modal-body">
              <div className="applied-jobs-modal-info">
                <div className="applied-jobs-modal-info-item">
                  <span className="applied-jobs-modal-label">Company</span>
                  <span className="applied-jobs-modal-value">{selectedJob.company}</span>
                </div>
                <div className="applied-jobs-modal-info-item">
                  <span className="applied-jobs-modal-label">Location</span>
                  <span className="applied-jobs-modal-value">{selectedJob.location}</span>
                </div>
                <div className="applied-jobs-modal-info-item">
                  <span className="applied-jobs-modal-label">Salary</span>
                  <span className="applied-jobs-modal-value">{selectedJob.salary}</span>
                </div>
                <div className="applied-jobs-modal-info-item">
                  <span className="applied-jobs-modal-label">Applied Date</span>
                  <span className="applied-jobs-modal-value">{new Date(selectedJob.appliedDate).toLocaleDateString()}</span>
                </div>
                <div className="applied-jobs-modal-info-item">
                  <span className="applied-jobs-modal-label">Status</span>
                  <div className={`applied-jobs-status-badge ${selectedJob.status}`}>
                    {getStatusIcon(selectedJob.status)}
                    {selectedJob.status.charAt(0).toUpperCase() + selectedJob.status.slice(1)}
                  </div>
                </div>
              </div>

              <div className="applied-jobs-modal-section">
                <h4>Job Description</h4>
                <p>{selectedJob.description}</p>
              </div>

              <div className="applied-jobs-modal-section">
                <h4>Requirements</h4>
                <div className="applied-jobs-modal-tags">
                  {selectedJob.requirements.map((req, index) => (
                    <span key={index} className="applied-jobs-modal-tag">{req}</span>
                  ))}
                </div>
              </div>

              <div className="applied-jobs-modal-section">
                <h4>Benefits</h4>
                <div className="applied-jobs-modal-tags">
                  {selectedJob.benefits.map((benefit, index) => (
                    <span key={index} className="applied-jobs-modal-tag benefit">{benefit}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="applied-jobs-modal-footer">
              <button className="applied-jobs-modal-btn secondary" onClick={closeJobDetails}>
                Close
              </button>
              <button 
                className="applied-jobs-modal-btn danger" 
                onClick={() => {
                  handleJobAction(selectedJob.id, 'withdraw');
                  closeJobDetails();
                }}
              >
                Withdraw Application
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;