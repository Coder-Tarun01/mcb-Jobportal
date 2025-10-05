import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock, 
  MapPin, 
  Briefcase, 
  DollarSign,
  Building2,
  Calendar,
  Filter,
  Search,
  Bookmark,
  BookmarkCheck,
  ArrowRight
} from 'lucide-react';
import { jobsAPI } from '../../services/api';
import { Job } from '../../types/job';
import './RecentJobs.css';

// Using Job type from types/job.ts instead of local interface

const RecentJobs: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('24h');

  useEffect(() => {
    loadRecentJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchQuery, locationFilter, jobTypeFilter, timeFilter]);

  const loadRecentJobs = async () => {
    setLoading(true);
    try {
      const response = await jobsAPI.fetchJobs({ limit: 20 });
      const jobs = response.jobs || response || [];
      setJobs(Array.isArray(jobs) ? jobs : []);
    } catch (error) {
      console.error('Error loading recent jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = [...jobs];

    // Time filter
    const now = Date.now();
    const timeFilters = {
      '1h': 1 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    if (timeFilter !== 'all') {
      const timeLimit = timeFilters[timeFilter as keyof typeof timeFilters];
      filtered = filtered.filter(job => 
        job.postedDate && now - new Date(job.postedDate).getTime() <= timeLimit
      );
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.skills && job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }

    // Location filter
    if (locationFilter) {
      filtered = filtered.filter(job =>
        job.location && job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Job type filter
    if (jobTypeFilter) {
      filtered = filtered.filter(job =>
        job.type && job.type.toLowerCase() === jobTypeFilter.toLowerCase()
      );
    }

    setFilteredJobs(filtered);
  };

  const handleBookmark = (jobId: string) => {
    setJobs(jobs.map(job =>
      job.id === jobId ? { ...job, isBookmarked: !job.isBookmarked } : job
    ));
  };

  const handleApplyClick = (jobId: string) => {
    // Navigate to apply page with job ID
    navigate(`/apply/${jobId}`);
  };

  const handleViewDetails = (jobId: string) => {
    // Navigate to job details page
    navigate(`/job/${jobId}`);
  };

  const getTimeAgo = (dateString: string) => {
    if (!dateString) return 'Date not specified';
    
    const now = Date.now();
    const posted = new Date(dateString).getTime();
    const diffInHours = Math.floor((now - posted) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just posted';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  if (loading) {
    return (
      <div className="recent-jobs-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading recent jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-jobs-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="recent-jobs-container"
      >
        {/* Header */}
        <div className="recent-jobs-header">
          <h1 className="page-title">Recent Jobs</h1>
          <p className="page-subtitle">
            Latest job opportunities posted in the last 30 days
          </p>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="filters-section"
        >
          <div className="filters-row">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-group">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="filter-select"
              >
                <option value="1h">Last hour</option>
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="all">All time</option>
              </select>
            </div>

            <div className="filter-group">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Locations</option>
                <option value="remote">Remote</option>
                <option value="san francisco">San Francisco</option>
                <option value="new york">New York</option>
                <option value="seattle">Seattle</option>
                <option value="austin">Austin</option>
              </select>
            </div>

            <div className="filter-group">
              <select
                value={jobTypeFilter}
                onChange={(e) => setJobTypeFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>

          <div className="results-info">
            <span>{filteredJobs.length} jobs found</span>
          </div>
        </motion.div>

        {/* Jobs List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="jobs-section"
        >
          {filteredJobs.length === 0 ? (
            <div className="empty-state">
              <Clock className="empty-icon" />
              <h3>No recent jobs found</h3>
              <p>Try adjusting your filters to see more opportunities.</p>
            </div>
          ) : (
            <div className="jobs-list">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`job-card ${job.isNew ? 'new' : ''}`}
                >
                  {job.isNew && <div className="new-badge">New</div>}
                  
                  <div className="job-header">
                    <div className="company-info">
                      <div className="company-logo">
                        {job.companyLogo ? (
                          <img src={job.companyLogo} alt={job.company} />
                        ) : (
                          <Building2 className="logo-icon" />
                        )}
                      </div>
                      <div className="job-info">
                        <h3 className="job-title">{job.title}</h3>
                        <p className="company-name">{job.company}</p>
                      </div>
                    </div>
                    
                    <div className="job-actions">
                      <div className="posted-time">
                        <Clock className="time-icon" />
                        <span>{getTimeAgo(job.postedDate)}</span>
                      </div>
                      <button
                        className={`bookmark-btn ${job.isBookmarked ? 'bookmarked' : ''}`}
                        onClick={() => handleBookmark(job.id)}
                      >
                        {job.isBookmarked ? (
                          <BookmarkCheck className="bookmark-icon" />
                        ) : (
                          <Bookmark className="bookmark-icon" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="job-details">
                    <div className="detail-item">
                      <MapPin className="detail-icon" />
                      <span>{job.location}</span>
                    </div>
                    <div className="detail-item">
                      <Briefcase className="detail-icon" />
                      <span>{job.type || 'Type not specified'}</span>
                    </div>
                    <div className="detail-item">
                      <DollarSign className="detail-icon" />
                      <span>
                        {job.salary ? 
                          `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}` : 
                          'Salary not specified'
                        }
                      </span>
                    </div>
                  </div>

                  <div className="job-description">
                    <p>{job.description}</p>
                  </div>

                  <div className="job-skills">
                    {job.skills && job.skills.slice(0, 4).map((skill, skillIndex) => (
                      <span key={skillIndex} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                    {job.skills && job.skills.length > 4 && (
                      <span className="skill-more">+{job.skills.length - 4} more</span>
                    )}
                  </div>

                  <div className="job-footer">
                    <button 
                      className="apply-btn"
                      onClick={() => handleApplyClick(job.id)}
                    >
                      Apply Now
                      <ArrowRight className="btn-icon" />
                    </button>
                    <button 
                      className="view-details-btn"
                      onClick={() => handleViewDetails(job.id)}
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RecentJobs;
