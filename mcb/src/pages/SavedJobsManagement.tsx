import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Heart, 
  Trash2, 
  Eye, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Building2, 
  ChevronDown, 
  X, 
  AlertCircle, 
  Loader2,
  Download,
  Upload,
  MoreVertical,
  Grid3X3,
  List,
  Calendar,
  Star,
  CheckCircle
} from 'lucide-react';
import { savedJobsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './SavedJobsManagement.css';

interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  savedAt: string;
  createdAt?: string;
  updatedAt?: string;
  job?: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary?: {
      min: number;
      max: number;
    };
    description?: string;
    skills?: string[];
    postedDate?: string;
    isRemote?: boolean;
  };
}

interface SavedJobFilter {
  search?: string;
  company?: string;
  location?: string;
  jobType?: string;
  dateFrom?: string;
  dateTo?: string;
}

type SortField = 'savedAt' | 'jobTitle' | 'company' | 'location';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

const SavedJobsManagement: React.FC = () => {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [filteredSavedJobs, setFilteredSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SavedJobFilter>({});
  const [sortField, setSortField] = useState<SortField>('savedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [selectedSavedJobs, setSelectedSavedJobs] = useState<string[]>([]);
  const [stats, setStats] = useState<any>(null);
  const itemsPerPage = 12;

  // Load saved jobs on component mount
  useEffect(() => {
    loadSavedJobs();
    loadStats();
  }, []);

  const loadSavedJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await savedJobsAPI.getSavedJobs();
      const savedJobsData = response.savedJobs || response || [];
      setSavedJobs(savedJobsData);
      setFilteredSavedJobs(savedJobsData);
    } catch (err) {
      console.error('Error loading saved jobs:', err);
      setError('Failed to load saved jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await savedJobsAPI.getSavedJobsStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  // Filter and sort saved jobs
  useEffect(() => {
    let filtered = [...savedJobs];

    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(savedJob =>
        savedJob.job?.title?.toLowerCase().includes(searchTerm) ||
        savedJob.job?.company?.toLowerCase().includes(searchTerm) ||
        savedJob.job?.description?.toLowerCase().includes(searchTerm) ||
        savedJob.job?.skills?.some(skill => skill.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.company) {
      filtered = filtered.filter(savedJob =>
        savedJob.job?.company?.toLowerCase().includes(filters.company!.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter(savedJob =>
        savedJob.job?.location?.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.jobType) {
      filtered = filtered.filter(savedJob =>
        savedJob.job?.type?.toLowerCase() === filters.jobType!.toLowerCase()
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(savedJob =>
        new Date(savedJob.savedAt) >= new Date(filters.dateFrom!)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(savedJob =>
        new Date(savedJob.savedAt) <= new Date(filters.dateTo!)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'savedAt') {
        aValue = new Date(a.savedAt).getTime();
        bValue = new Date(b.savedAt).getTime();
      } else if (sortField === 'jobTitle') {
        aValue = a.job?.title || '';
        bValue = b.job?.title || '';
      } else if (sortField === 'company') {
        aValue = a.job?.company || '';
        bValue = b.job?.company || '';
      } else if (sortField === 'location') {
        aValue = a.job?.location || '';
        bValue = b.job?.location || '';
      } else {
        aValue = String(aValue || '').toLowerCase();
        bValue = String(bValue || '').toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredSavedJobs(filtered);
    setCurrentPage(1);
  }, [savedJobs, filters, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredSavedJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSavedJobs = filteredSavedJobs.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handleFilterChange = (newFilters: SavedJobFilter) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleUnsaveJob = async (jobId: string) => {
    try {
      setDeleteLoading(jobId);
      await savedJobsAPI.unsaveJob(jobId);
      setSuccessMessage('Job removed from saved jobs');
      await loadSavedJobs();
    } catch (err) {
      console.error('Error unsaving job:', err);
      setError('Failed to remove job from saved jobs. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleBulkUnsave = async () => {
    if (selectedSavedJobs.length === 0) return;
    
    try {
      await savedJobsAPI.bulkUnsaveJobs(selectedSavedJobs);
      setSuccessMessage(`${selectedSavedJobs.length} jobs removed from saved jobs`);
      setSelectedSavedJobs([]);
      await loadSavedJobs();
    } catch (err) {
      console.error('Error bulk unsaving jobs:', err);
      setError('Failed to remove jobs from saved jobs. Please try again.');
    }
  };

  const handleSelectSavedJob = (savedJobId: string) => {
    setSelectedSavedJobs(prev =>
      prev.includes(savedJobId)
        ? prev.filter(id => id !== savedJobId)
        : [...prev, savedJobId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSavedJobs.length === paginatedSavedJobs.length) {
      setSelectedSavedJobs([]);
    } else {
      setSelectedSavedJobs(paginatedSavedJobs.map(savedJob => savedJob.id));
    }
  };

  const handleViewJob = (jobId: string) => {
    // Navigate to job details page
    window.open(`/jobs/${jobId}`, '_blank');
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ChevronDown className="sort-icon" />;
    return sortDirection === 'asc' ? 
      <ChevronDown className="sort-icon sort-asc" /> : 
      <ChevronDown className="sort-icon sort-desc" />;
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const savedDate = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - savedDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return savedDate.toLocaleDateString();
  };

  return (
    <div className="saved-jobs-management-page">
      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="success-message"
        >
          <CheckCircle className="success-icon" />
          <span>{successMessage}</span>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="error-message"
        >
          <AlertCircle className="error-icon" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="error-close">
            ×
          </button>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="saved-jobs-management-container"
      >
        {/* Header */}
        <div className="saved-jobs-header">
          <div className="header-content">
            <h1 className="page-title">Saved Jobs</h1>
            <p className="page-subtitle">
              Manage your saved job opportunities
            </p>
          </div>
          <div className="header-actions">
            <button className="export-btn">
              <Download className="btn-icon" />
              Export Data
            </button>
            <button className="refresh-btn" onClick={loadSavedJobs}>
              <Loader2 className="btn-icon" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Section */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="stats-section"
          >
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">
                  <Heart className="stat-icon-svg" />
                </div>
                <div className="stat-content">
                  <h3>{stats.totalSavedJobs || 0}</h3>
                  <p>Total Saved Jobs</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <Clock className="stat-icon-svg" />
                </div>
                <div className="stat-content">
                  <h3>{stats.savedThisWeek || 0}</h3>
                  <p>This Week</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <Calendar className="stat-icon-svg" />
                </div>
                <div className="stat-content">
                  <h3>{stats.savedThisMonth || 0}</h3>
                  <p>This Month</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <Building2 className="stat-icon-svg" />
                </div>
                <div className="stat-content">
                  <h3>{stats.mostSavedCompany || 'N/A'}</h3>
                  <p>Top Company</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="filters-section"
        >
          <div className="search-and-filters">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search saved jobs..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                className="search-input"
              />
            </div>
            
            <div className="filter-controls">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
              >
                <Filter className="btn-icon" />
                Filters
                <ChevronDown className={`chevron ${showFilters ? 'rotated' : ''}`} />
              </button>
              
              <div className="view-controls">
                <button
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="btn-icon" />
                  List
                </button>
                <button
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="btn-icon" />
                  Grid
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="advanced-filters"
            >
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Company</label>
                  <input
                    type="text"
                    placeholder="Enter company name"
                    value={filters.company || ''}
                    onChange={(e) => handleFilterChange({ company: e.target.value })}
                    className="filter-input"
                  />
                </div>
                
                <div className="filter-group">
                  <label>Location</label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={filters.location || ''}
                    onChange={(e) => handleFilterChange({ location: e.target.value })}
                    className="filter-input"
                  />
                </div>
                
                <div className="filter-group">
                  <label>Job Type</label>
                  <select
                    value={filters.jobType || ''}
                    onChange={(e) => handleFilterChange({ jobType: e.target.value })}
                    className="filter-select"
                  >
                    <option value="">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Date From</label>
                  <input
                    type="date"
                    value={filters.dateFrom || ''}
                    onChange={(e) => handleFilterChange({ dateFrom: e.target.value })}
                    className="filter-input"
                  />
                </div>
                
                <div className="filter-group">
                  <label>Date To</label>
                  <input
                    type="date"
                    value={filters.dateTo || ''}
                    onChange={(e) => handleFilterChange({ dateTo: e.target.value })}
                    className="filter-input"
                  />
                </div>
              </div>
              
              <div className="filter-actions">
                <button onClick={handleClearFilters} className="clear-filters-btn">
                  <X className="btn-icon" />
                  Clear Filters
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="results-section"
        >
          <div className="results-header">
            <div className="results-info">
              <h2>Saved Jobs</h2>
              <p>{filteredSavedJobs.length} jobs found</p>
            </div>
            
            <div className="results-controls">
              <div className="sort-controls">
                <label>Sort by:</label>
                <select
                  value={`${sortField}-${sortDirection}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split('-');
                    setSortField(field as SortField);
                    setSortDirection(direction as SortDirection);
                  }}
                  className="sort-select"
                >
                  <option value="savedAt-desc">Recently Saved</option>
                  <option value="savedAt-asc">Oldest Saved</option>
                  <option value="jobTitle-asc">Job Title A-Z</option>
                  <option value="jobTitle-desc">Job Title Z-A</option>
                  <option value="company-asc">Company A-Z</option>
                  <option value="company-desc">Company Z-A</option>
                  <option value="location-asc">Location A-Z</option>
                  <option value="location-desc">Location Z-A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedSavedJobs.length > 0 && (
            <div className="bulk-actions">
              <div className="bulk-info">
                <span>{selectedSavedJobs.length} jobs selected</span>
              </div>
              <div className="bulk-buttons">
                <button onClick={handleBulkUnsave} className="bulk-unsave-btn">
                  <Trash2 className="btn-icon" />
                  Remove Selected
                </button>
                <button onClick={() => setSelectedSavedJobs([])} className="bulk-cancel-btn">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Saved Jobs List */}
          <div className="saved-jobs-content">
            {loading ? (
              <div className="loading-state">
                <Loader2 className="loading-spinner" />
                <p>Loading saved jobs...</p>
              </div>
            ) : filteredSavedJobs.length === 0 ? (
              <div className="empty-state">
                <Heart className="empty-icon" />
                <h3>No saved jobs found</h3>
                <p>Start saving jobs you're interested in to see them here.</p>
              </div>
            ) : (
              <div className={`saved-jobs-container ${viewMode === 'grid' ? 'grid-view' : 'list-view'}`}>
                {paginatedSavedJobs.map((savedJob, index) => (
                  <motion.div
                    key={savedJob.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`saved-job-card ${viewMode === 'grid' ? 'grid-card' : 'list-card'}`}
                  >
                    <div className="saved-job-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedSavedJobs.includes(savedJob.id)}
                        onChange={() => handleSelectSavedJob(savedJob.id)}
                      />
                    </div>
                    
                    <div className="saved-job-content">
                      <div className="saved-job-header">
                        <div className="saved-job-title">
                          <h3>{savedJob.job?.title || 'Job Title Not Available'}</h3>
                          <p className="company-name">{savedJob.job?.company || 'Company Not Available'}</p>
                        </div>
                        <div className="saved-job-meta">
                          <span className="saved-date">
                            <Clock className="meta-icon" />
                            Saved {getTimeAgo(savedJob.savedAt)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="saved-job-details">
                        <div className="detail-row">
                          <div className="detail-item">
                            <MapPin className="detail-icon" />
                            <span>{savedJob.job?.location || 'Location Not Available'}</span>
                          </div>
                          <div className="detail-item">
                            <Briefcase className="detail-icon" />
                            <span>{savedJob.job?.type || 'Job Type Not Available'}</span>
                          </div>
                        </div>
                        
                        {savedJob.job?.salary && (
                          <div className="detail-row">
                            <div className="detail-item">
                              <DollarSign className="detail-icon" />
                              <span>
                                ${savedJob.job.salary.min.toLocaleString()} - ${savedJob.job.salary.max.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {savedJob.job?.skills && savedJob.job.skills.length > 0 && (
                          <div className="skills-section">
                            {savedJob.job.skills.slice(0, 3).map((skill, idx) => (
                              <span key={idx} className="skill-tag">{skill}</span>
                            ))}
                            {savedJob.job.skills.length > 3 && (
                              <span className="skill-tag more">+{savedJob.job.skills.length - 3} more</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="saved-job-actions">
                      <button 
                        onClick={() => handleViewJob(savedJob.jobId)}
                        className="action-btn view-btn"
                        title="View Job Details"
                      >
                        <Eye className="btn-icon" />
                      </button>
                      <button 
                        onClick={() => handleUnsaveJob(savedJob.jobId)}
                        className="action-btn unsave-btn"
                        title="Remove from Saved"
                        disabled={deleteLoading === savedJob.jobId}
                      >
                        {deleteLoading === savedJob.jobId ? (
                          <Loader2 className="btn-icon loading" />
                        ) : (
                          <Trash2 className="btn-icon" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>

              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}

          {/* Results Summary */}
          <div className="results-summary">
            <p>
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredSavedJobs.length)} of {filteredSavedJobs.length} saved jobs
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SavedJobsManagement;
