import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Briefcase, 
  Calendar, 
  MapPin, 
  ChevronDown, 
  X, 
  AlertCircle, 
  Loader2,
  Download,
  Upload,
  MoreVertical,
  FileText,
  Mail,
  Phone
} from 'lucide-react';
import { applicationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './ApplicationManagement.css';

interface Application {
  id: string;
  userId: string;
  jobId: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  coverLetter?: string;
  resumeUrl?: string;
  appliedAt: string;
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
  };
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
}

interface ApplicationFilter {
  search?: string;
  status?: string;
  jobTitle?: string;
  company?: string;
  dateFrom?: string;
  dateTo?: string;
}

type SortField = 'appliedAt' | 'status' | 'jobTitle' | 'userName';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

const ApplicationManagement: React.FC = () => {
  const { user, isEmployer } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ApplicationFilter>({});
  const [sortField, setSortField] = useState<SortField>('appliedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showApplicationDetails, setShowApplicationDetails] = useState(false);
  const itemsPerPage = 12;

  // Load applications on component mount
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (isEmployer()) {
        // For employers, we need to get applications for their jobs
        // This would typically be done by getting all jobs for the employer first
        // For now, we'll use a general applications endpoint
        response = await applicationsAPI.getUserApplications();
      } else {
        // For employees, get their applications
        response = await applicationsAPI.getUserApplications();
      }
      
      const applicationsData = response.applications || response || [];
      setApplications(applicationsData);
      setFilteredApplications(applicationsData);
    } catch (err) {
      console.error('Error loading applications:', err);
      setError('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort applications
  useEffect(() => {
    let filtered = [...applications];

    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(application =>
        application.job?.title?.toLowerCase().includes(searchTerm) ||
        application.job?.company?.toLowerCase().includes(searchTerm) ||
        application.user?.name?.toLowerCase().includes(searchTerm) ||
        application.coverLetter?.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(application => application.status === filters.status);
    }

    if (filters.jobTitle) {
      filtered = filtered.filter(application =>
        application.job?.title?.toLowerCase().includes(filters.jobTitle!.toLowerCase())
      );
    }

    if (filters.company) {
      filtered = filtered.filter(application =>
        application.job?.company?.toLowerCase().includes(filters.company!.toLowerCase())
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(application =>
        new Date(application.appliedAt) >= new Date(filters.dateFrom!)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(application =>
        new Date(application.appliedAt) <= new Date(filters.dateTo!)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'appliedAt') {
        aValue = new Date(a.appliedAt).getTime();
        bValue = new Date(b.appliedAt).getTime();
      } else if (sortField === 'jobTitle') {
        aValue = a.job?.title || '';
        bValue = b.job?.title || '';
      } else if (sortField === 'userName') {
        aValue = a.user?.name || '';
        bValue = b.user?.name || '';
      } else {
        aValue = String(aValue || '').toLowerCase();
        bValue = String(bValue || '').toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredApplications(filtered);
    setCurrentPage(1);
  }, [applications, filters, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = filteredApplications.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handleFilterChange = (newFilters: ApplicationFilter) => {
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

  const handleUpdateStatus = async (applicationId: string, status: 'pending' | 'reviewed' | 'accepted' | 'rejected') => {
    try {
      setUpdateLoading(applicationId);
      await applicationsAPI.updateApplicationStatus(applicationId, status);
      setSuccessMessage(`Application status updated to ${status}`);
      await loadApplications();
    } catch (err) {
      console.error('Error updating application status:', err);
      setError('Failed to update application status. Please try again.');
    } finally {
      setUpdateLoading(null);
    }
  };

  const handleBulkUpdateStatus = async (status: 'pending' | 'reviewed' | 'accepted' | 'rejected') => {
    if (selectedApplications.length === 0) return;
    
    try {
      await applicationsAPI.bulkUpdateApplicationStatus(selectedApplications, status);
      setSuccessMessage(`${selectedApplications.length} applications updated to ${status}`);
      setSelectedApplications([]);
      await loadApplications();
    } catch (err) {
      console.error('Error bulk updating applications:', err);
      setError('Failed to update applications. Please try again.');
    }
  };

  const handleWithdrawApplication = async (applicationId: string) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    try {
      await applicationsAPI.withdrawApplication(applicationId);
      setSuccessMessage('Application withdrawn successfully');
      await loadApplications();
    } catch (err) {
      console.error('Error withdrawing application:', err);
      setError('Failed to withdraw application. Please try again.');
    }
  };

  const handleSelectApplication = (applicationId: string) => {
    setSelectedApplications(prev =>
      prev.includes(applicationId)
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedApplications.length === paginatedApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(paginatedApplications.map(application => application.id));
    }
  };

  const handleViewApplication = async (applicationId: string) => {
    try {
      const application = await applicationsAPI.getApplication(applicationId);
      setSelectedApplication(application);
      setShowApplicationDetails(true);
    } catch (err) {
      console.error('Error fetching application details:', err);
      setError('Failed to load application details');
    }
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="status-icon pending" />;
      case 'reviewed': return <Eye className="status-icon reviewed" />;
      case 'accepted': return <CheckCircle className="status-icon accepted" />;
      case 'rejected': return <XCircle className="status-icon rejected" />;
      default: return <Clock className="status-icon" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'reviewed': return '#3b82f6';
      case 'accepted': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ChevronDown className="sort-icon" />;
    return sortDirection === 'asc' ? 
      <ChevronDown className="sort-icon sort-asc" /> : 
      <ChevronDown className="sort-icon sort-desc" />;
  };

  return (
    <div className="application-management-page">
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
        className="application-management-container"
      >
        {/* Header */}
        <div className="application-header">
          <div className="header-content">
            <h1 className="page-title">Application Management</h1>
            <p className="page-subtitle">
              {isEmployer() ? 'Manage job applications from candidates' : 'Track your job applications'}
            </p>
          </div>
          <div className="header-actions">
            <button className="export-btn">
              <Download className="btn-icon" />
              Export Data
            </button>
            {isEmployer() && (
              <button className="bulk-actions-btn">
                <MoreVertical className="btn-icon" />
                Bulk Actions
              </button>
            )}
          </div>
        </div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="filters-section"
        >
          <div className="search-and-filters">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search applications..."
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
                  List
                </button>
                <button
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
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
                  <label>Status</label>
                  <select
                    value={filters.status || ''}
                    onChange={(e) => handleFilterChange({ status: e.target.value })}
                    className="filter-select"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Job Title</label>
                  <input
                    type="text"
                    placeholder="Enter job title"
                    value={filters.jobTitle || ''}
                    onChange={(e) => handleFilterChange({ jobTitle: e.target.value })}
                    className="filter-input"
                  />
                </div>
                
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
          transition={{ duration: 0.6, delay: 0.2 }}
          className="results-section"
        >
          <div className="results-header">
            <div className="results-info">
              <h2>Applications</h2>
              <p>{filteredApplications.length} applications found</p>
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
                  <option value="appliedAt-desc">Newest First</option>
                  <option value="appliedAt-asc">Oldest First</option>
                  <option value="status-asc">Status A-Z</option>
                  <option value="status-desc">Status Z-A</option>
                  <option value="jobTitle-asc">Job Title A-Z</option>
                  <option value="jobTitle-desc">Job Title Z-A</option>
                  <option value="userName-asc">Applicant A-Z</option>
                  <option value="userName-desc">Applicant Z-A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedApplications.length > 0 && isEmployer() && (
            <div className="bulk-actions">
              <div className="bulk-info">
                <span>{selectedApplications.length} applications selected</span>
              </div>
              <div className="bulk-buttons">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleBulkUpdateStatus(e.target.value as any);
                      e.target.value = '';
                    }
                  }}
                  className="bulk-status-select"
                >
                  <option value="">Update Status</option>
                  <option value="pending">Mark as Pending</option>
                  <option value="reviewed">Mark as Reviewed</option>
                  <option value="accepted">Mark as Accepted</option>
                  <option value="rejected">Mark as Rejected</option>
                </select>
                <button onClick={() => setSelectedApplications([])} className="bulk-cancel-btn">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Applications List */}
          <div className="applications-content">
            {loading ? (
              <div className="loading-state">
                <Loader2 className="loading-spinner" />
                <p>Loading applications...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="empty-state">
                <FileText className="empty-icon" />
                <h3>No applications found</h3>
                <p>Try adjusting your search criteria or filters.</p>
              </div>
            ) : (
              <div className={`applications-container ${viewMode === 'grid' ? 'grid-view' : 'list-view'}`}>
                {paginatedApplications.map((application, index) => (
                  <motion.div
                    key={application.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`application-card ${viewMode === 'grid' ? 'grid-card' : 'list-card'}`}
                  >
                    <div className="application-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedApplications.includes(application.id)}
                        onChange={() => handleSelectApplication(application.id)}
                      />
                    </div>
                    
                    <div className="application-content">
                      <div className="application-header">
                        <div className="application-title">
                          <h3>{application.job?.title || 'Job Title Not Available'}</h3>
                          <p className="company-name">{application.job?.company || 'Company Not Available'}</p>
                        </div>
                        <div className="application-status">
                          <div 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(application.status) }}
                          >
                            {getStatusIcon(application.status)}
                            <span>{application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="application-details">
                        <div className="detail-row">
                          <div className="detail-item">
                            <User className="detail-icon" />
                            <span>{application.user?.name || 'Applicant Name Not Available'}</span>
                          </div>
                          <div className="detail-item">
                            <Calendar className="detail-icon" />
                            <span>{new Date(application.appliedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="detail-row">
                          <div className="detail-item">
                            <MapPin className="detail-icon" />
                            <span>{application.job?.location || 'Location Not Available'}</span>
                          </div>
                          <div className="detail-item">
                            <Briefcase className="detail-icon" />
                            <span>{application.job?.type || 'Job Type Not Available'}</span>
                          </div>
                        </div>
                        
                        {application.coverLetter && (
                          <div className="cover-letter-preview">
                            <p>{application.coverLetter.substring(0, 150)}...</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="application-actions">
                      <button 
                        onClick={() => handleViewApplication(application.id)}
                        className="action-btn view-btn"
                        title="View Details"
                      >
                        <Eye className="btn-icon" />
                      </button>
                      
                      {isEmployer() && (
                        <>
                          <select
                            value=""
                            onChange={(e) => {
                              if (e.target.value) {
                                handleUpdateStatus(application.id, e.target.value as any);
                                e.target.value = '';
                              }
                            }}
                            className="status-select"
                            disabled={updateLoading === application.id}
                          >
                            <option value="">Update Status</option>
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </>
                      )}
                      
                      {!isEmployer() && (
                        <button 
                          onClick={() => handleWithdrawApplication(application.id)}
                          className="action-btn withdraw-btn"
                          title="Withdraw Application"
                        >
                          <Trash2 className="btn-icon" />
                        </button>
                      )}
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
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredApplications.length)} of {filteredApplications.length} applications
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Application Details Modal */}
      {showApplicationDetails && selectedApplication && (
        <div className="modal-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="modal"
          >
            <div className="modal-header">
              <h3>Application Details</h3>
              <button 
                onClick={() => setShowApplicationDetails(false)}
                className="close-btn"
              >
                <X className="btn-icon" />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="application-details-full">
                <div className="detail-section">
                  <h4>Job Information</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <Briefcase className="detail-icon" />
                      <span>{selectedApplication.job?.title || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <User className="detail-icon" />
                      <span>{selectedApplication.job?.company || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <MapPin className="detail-icon" />
                      <span>{selectedApplication.job?.location || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <Calendar className="detail-icon" />
                      <span>{new Date(selectedApplication.appliedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Applicant Information</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <User className="detail-icon" />
                      <span>{selectedApplication.user?.name || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <Mail className="detail-icon" />
                      <span>{selectedApplication.user?.email || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <Phone className="detail-icon" />
                      <span>{selectedApplication.user?.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                {selectedApplication.coverLetter && (
                  <div className="detail-section">
                    <h4>Cover Letter</h4>
                    <div className="cover-letter-full">
                      <p>{selectedApplication.coverLetter}</p>
                    </div>
                  </div>
                )}
                
                {selectedApplication.resumeUrl && (
                  <div className="detail-section">
                    <h4>Resume</h4>
                    <a 
                      href={selectedApplication.resumeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="resume-link"
                    >
                      <FileText className="btn-icon" />
                      View Resume
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ApplicationManagement;
