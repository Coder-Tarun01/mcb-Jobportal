import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Users,
  MapPin,
  Clock,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { jobsAPI } from '../../services/api';
import { Job } from '../../types/job';
import EmployerLayout from '../../components/employer/EmployerLayout';
import './ManageJobs.css';

interface JobData extends Job {
  applications: number;
  date: string;
  status: 'active' | 'pending' | 'expired';
  isRead: boolean;
  isStarred: boolean;
}

type SortField = 'title' | 'applications' | 'date' | 'status';
type SortDirection = 'asc' | 'desc';
type FilterTab = 'all' | 'none' | 'read' | 'unread' | 'starred' | 'unstarred';
type SortBy = 'latest' | 'oldest' | 'active' | 'pending' | 'expired';

const ManageJobs: React.FC = () => {
  const navigate = useNavigate();
  const { user, isEmployer } = useAuth();

  // State management
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [sortBy, setSortBy] = useState<SortBy>('latest');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Load jobs from API
  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobsAPI.fetchJobs();
      const jobsData = response.jobs || [];
      
      // Transform API data to match our interface
      const transformedJobs: JobData[] = jobsData.map((job: Job) => ({
        ...job,
        applications: Math.floor(Math.random() * 20) + 1, // Mock applications count
        date: new Date(job.createdAt || Date.now()).toLocaleDateString(),
        status: 'active' as const, // Default status
        isRead: Math.random() > 0.3,
        isStarred: Math.random() > 0.7,
      }));
      
      setJobs(transformedJobs);
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !isEmployer()) {
      navigate('/login');
      return;
    }
  }, [user, navigate, isEmployer]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Filtered and sorted jobs
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs.filter(job => {
      // Search filter
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Tab filter
      let matchesTab = true;
      switch (activeTab) {
        case 'none':
          matchesTab = false;
          break;
        case 'read':
          matchesTab = job.isRead;
          break;
        case 'unread':
          matchesTab = !job.isRead;
          break;
        case 'starred':
          matchesTab = job.isStarred;
          break;
        case 'unstarred':
          matchesTab = !job.isStarred;
          break;
        default:
          matchesTab = true;
      }

      // Sort by filter
      let matchesSortBy = true;
      switch (sortBy) {
        case 'active':
          matchesSortBy = job.status === 'active';
          break;
        case 'pending':
          matchesSortBy = job.status === 'pending';
          break;
        case 'expired':
          matchesSortBy = job.status === 'expired';
          break;
        default:
          matchesSortBy = true;
      }
      
      return matchesSearch && matchesTab && matchesSortBy;
    });

    // Sort jobs
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle different data types
      if (sortField === 'applications') {
        aValue = a.applications;
        bValue = b.applications;
      } else if (sortField === 'date') {
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [jobs, searchTerm, activeTab, sortBy, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredAndSortedJobs.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleApplicationsClick = (jobId: string, applications: number) => {
    // Navigate to applications page for this job
    console.log(`Viewing ${applications} applications for job ${jobId}`);
    // In a real app: navigate(`/employer/jobs/${jobId}/applications`);
  };


  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="manage-jobs-sort-icon" />;
    return sortDirection === 'asc' ? 
      <ArrowUp className="manage-jobs-sort-icon manage-jobs-active" /> : 
      <ArrowDown className="manage-jobs-sort-icon manage-jobs-active" />;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active': return 'manage-jobs-status-active';
      case 'pending': return 'manage-jobs-status-pending';
      case 'expired': return 'manage-jobs-status-expired';
      default: return 'manage-jobs-status-default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'pending': return 'Pending';
      case 'expired': return 'Closed';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };


  const handleEditJob = (jobId: string) => {
    console.log('Edit job:', jobId);
    // Navigate to edit job page
    navigate(`/employer/edit-job/${jobId}`);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(jobId);
      await jobsAPI.deleteJob(jobId);
      setSuccessMessage('Job deleted successfully!');
      // Reload jobs after deletion
      await loadJobs();
    } catch (err) {
      console.error('Error deleting job:', err);
      setError('Failed to delete job. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const getTabCount = (tab: FilterTab) => {
    switch (tab) {
      case 'all':
        return jobs.length;
      case 'none':
        return 0;
      case 'read':
        return jobs.filter(job => job.isRead).length;
      case 'unread':
        return jobs.filter(job => !job.isRead).length;
      case 'starred':
        return jobs.filter(job => job.isStarred).length;
      case 'unstarred':
        return jobs.filter(job => !job.isStarred).length;
      default:
        return 0;
    }
  };

  return (
    <EmployerLayout>
      <div className="manage-jobs-page">
        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="manage-jobs-success-message"
          >
            <CheckCircle className="manage-jobs-success-icon" />
            <span>{successMessage}</span>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="manage-jobs-error-message"
          >
            <AlertCircle className="manage-jobs-error-icon" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="manage-jobs-error-close">
              ×
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="manage-jobs-container"
        >
        <div className="manage-jobs-header">
          <button onClick={() => navigate('/employer/dashboard')} className="manage-jobs-back-btn">
            <ArrowLeft className="manage-jobs-btn-icon" />
            <span>Back to Dashboard</span>
          </button>
          <div className="manage-jobs-header-content">
            <h1 className="manage-jobs-title">Manage Jobs</h1>
          </div>
          <button onClick={() => navigate('/employer/post-job')} className="manage-jobs-add-btn">
            <Plus className="manage-jobs-btn-icon" />
            <span>Add New Job</span>
          </button>
        </div>

        <div className="manage-jobs-content">
          {/* Filters Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="manage-jobs-filters-section"
          >
            <div className="manage-jobs-search-and-sort">
              <div className="manage-jobs-search-container">
                <Search className="manage-jobs-search-icon" />
                <input
                  type="text"
                  placeholder="Search by job title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="manage-jobs-search-input"
                />
              </div>
              <div className="manage-jobs-sort-container">
                <Filter className="manage-jobs-sort-icon" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="manage-jobs-sort-select"
                >
                  <option value="latest">Latest</option>
                  <option value="oldest">Oldest</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>

            <div className="manage-jobs-filter-tabs">
              {(['all', 'none', 'read', 'unread', 'starred', 'unstarred'] as FilterTab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`manage-jobs-filter-tab ${activeTab === tab ? 'manage-jobs-active' : ''}`}
                >
                  <span className="manage-jobs-tab-label">
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </span>
                  <span className="manage-jobs-tab-count">({getTabCount(tab)})</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Jobs Table Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="manage-jobs-table-section"
          >
            <div className="manage-jobs-table-container">
              <div className="manage-jobs-table">
                <div className="manage-jobs-table-header">
                  <div 
                    className="manage-jobs-header-cell manage-jobs-sortable"
                    onClick={() => handleSort('title')}
                  >
                    <span>Job Title</span>
                    {getSortIcon('title')}
                  </div>
                  <div 
                    className="manage-jobs-header-cell manage-jobs-sortable manage-jobs-applications-header"
                    onClick={() => handleSort('applications')}
                  >
                    <span>Applications</span>
                    {getSortIcon('applications')}
                  </div>
                  <div 
                    className="manage-jobs-header-cell manage-jobs-sortable manage-jobs-date-header"
                    onClick={() => handleSort('date')}
                  >
                    <span>Date</span>
                    {getSortIcon('date')}
                  </div>
                  <div 
                    className="manage-jobs-header-cell manage-jobs-sortable manage-jobs-status-header"
                    onClick={() => handleSort('status')}
                  >
                    <span>Status</span>
                    {getSortIcon('status')}
                  </div>
                  <div className="manage-jobs-header-cell manage-jobs-actions-header">
                    <span>Actions</span>
                  </div>
                </div>

                <div className="manage-jobs-table-body">
                  {loading ? (
                    <div className="manage-jobs-loading">
                      <Loader2 className="manage-jobs-loading-icon" />
                      <span>Loading jobs...</span>
                    </div>
                  ) : paginatedJobs.length === 0 ? (
                    <div className="manage-jobs-empty-state">
                      <Briefcase className="manage-jobs-empty-icon" />
                      <h3>No jobs found</h3>
                      <p>Try adjusting your search criteria or filters.</p>
                    </div>
                  ) : (
                    paginatedJobs.map((job, index) => (
                      <div 
                        key={job.id} 
                        className={`manage-jobs-row ${index % 2 === 1 ? 'manage-jobs-alternate' : ''} ${!job.isRead ? 'manage-jobs-unread' : ''}`}
                      >
                      <div className="manage-jobs-table-cell manage-jobs-title-cell">
                        <div className="manage-jobs-title-content">
                          <h3 className="manage-jobs-job-title">{job.title}</h3>
                          <div className="manage-jobs-job-meta">
                            <span className="manage-jobs-job-location">
                              <MapPin className="manage-jobs-meta-icon" />
                              {job.location}
                            </span>
                            <span className="manage-jobs-job-type">
                              <Clock className="manage-jobs-meta-icon" />
                              {job.jobType}
                            </span>
                            <span className="manage-jobs-job-category">
                              <Briefcase className="manage-jobs-meta-icon" />
                              {job.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="manage-jobs-table-cell manage-jobs-applications-cell">
                        <button
                          onClick={() => handleApplicationsClick(job.id, job.applications)}
                          className="manage-jobs-applications-btn"
                        >
                          <Users className="manage-jobs-applications-icon" />
                          <span className="manage-jobs-applications-count">({job.applications})</span>
                          <span className="manage-jobs-applications-text">Applications</span>
                        </button>
                      </div>
                      <div className="manage-jobs-table-cell manage-jobs-date-cell">
                        <span className="manage-jobs-job-date">{job.date}</span>
                      </div>
                      <div className="manage-jobs-table-cell manage-jobs-status-cell">
                        <div className={`manage-jobs-status-badge ${getStatusBadgeClass(job.status)}`}>
                          <span className="manage-jobs-status-dot"></span>
                          <span className="manage-jobs-status-text">{getStatusLabel(job.status)}</span>
                        </div>
                      </div>
                      <div className="manage-jobs-table-cell manage-jobs-actions-cell">
                        <div className="manage-jobs-action-buttons">
                          <button
                            onClick={() => handleEditJob(job.id)}
                            className="manage-jobs-action-btn manage-jobs-action-btn--edit"
                            title="Edit Job"
                          >
                            <Edit className="manage-jobs-action-icon" />
                            <span className="manage-jobs-action-label"></span>
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            disabled={deleteLoading === job.id}
                            className="manage-jobs-action-btn manage-jobs-action-btn--delete"
                            title="Delete Job"
                          >
                            {deleteLoading === job.id ? (
                              <Loader2 className="manage-jobs-action-icon manage-jobs-loading" />
                            ) : (
                              <Trash2 className="manage-jobs-action-icon" />
                            )}
                            <span className="manage-jobs-action-label"></span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                  )}
                </div>
              </div>

            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="manage-jobs-pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="manage-jobs-pagination-btn"
                >
                  <ChevronLeft className="manage-jobs-pagination-icon" />
                  <span>Prev</span>
                </button>

                <div className="manage-jobs-pagination-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`manage-jobs-pagination-number ${currentPage === page ? 'manage-jobs-active' : ''}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="manage-jobs-pagination-btn"
                >
                  <span>Next</span>
                  <ChevronRight className="manage-jobs-pagination-icon" />
                </button>
              </div>
            )}

            {/* Results Summary */}
            <div className="manage-jobs-results-summary">
              <p>
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedJobs.length)} of {filteredAndSortedJobs.length} jobs
              </p>
            </div>
          </motion.div>
        </div>
        </motion.div>
      </div>
    </EmployerLayout>
  );
};

export default ManageJobs;