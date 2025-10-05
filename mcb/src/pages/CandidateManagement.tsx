import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Star, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Users, 
  ChevronDown, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Download,
  Upload,
  MoreVertical
} from 'lucide-react';
import { candidatesAPI } from '../services/api';
import './CandidateManagement.css';

interface Candidate {
  id: string;
  name: string;
  jobTitle?: string;
  location?: string;
  skills?: string[];
  experience?: string;
  salary?: string;
  rating?: number;
  avatar?: string;
  resumeUrl?: string;
  profileImage?: string;
  company?: string;
  education?: string;
  lastActive?: string;
  isBookmarked?: boolean;
  status?: 'active' | 'inactive' | 'archived';
  createdAt?: string;
  updatedAt?: string;
}

interface CandidateFilter {
  search?: string;
  location?: string;
  skills?: string[];
  experience?: string;
  salaryMin?: number;
  salaryMax?: number;
  status?: string;
}

type SortField = 'name' | 'location' | 'experience' | 'rating' | 'createdAt';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

const CandidateManagement: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<CandidateFilter>({});
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const itemsPerPage = 12;

  // Load candidates from API
  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await candidatesAPI.fetchCandidates();
      const candidatesData = response.candidates || response || [];
      
      // Transform API data to match our interface
      const transformedCandidates: Candidate[] = candidatesData.map((candidate: any) => ({
        ...candidate,
        rating: candidate.rating || Math.floor(Math.random() * 5) + 1,
        isBookmarked: Math.random() > 0.5,
        status: 'active',
        lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: candidate.createdAt || new Date().toISOString(),
      }));
      
      setCandidates(transformedCandidates);
      setFilteredCandidates(transformedCandidates);
    } catch (err) {
      console.error('Error loading candidates:', err);
      setError('Failed to load candidates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort candidates
  useEffect(() => {
    let filtered = [...candidates];

    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(candidate =>
        candidate.name?.toLowerCase().includes(searchTerm) ||
        candidate.jobTitle?.toLowerCase().includes(searchTerm) ||
        candidate.company?.toLowerCase().includes(searchTerm) ||
        candidate.skills?.some(skill => skill.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.location) {
      filtered = filtered.filter(candidate =>
        candidate.location?.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.skills && filters.skills.length > 0) {
      filtered = filtered.filter(candidate =>
        candidate.skills?.some(skill => filters.skills!.includes(skill))
      );
    }

    if (filters.experience) {
      filtered = filtered.filter(candidate =>
        candidate.experience?.toLowerCase().includes(filters.experience!.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(candidate => candidate.status === filters.status);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'rating') {
        aValue = a.rating || 0;
        bValue = b.rating || 0;
      } else if (sortField === 'createdAt') {
        aValue = new Date(a.createdAt || 0).getTime();
        bValue = new Date(b.createdAt || 0).getTime();
      } else {
        aValue = String(aValue || '').toLowerCase();
        bValue = String(bValue || '').toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredCandidates(filtered);
    setCurrentPage(1);
  }, [candidates, filters, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCandidates = filteredCandidates.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handleFilterChange = (newFilters: CandidateFilter) => {
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

  const handleDeleteCandidate = async (candidateId: string) => {
    if (!window.confirm('Are you sure you want to delete this candidate? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(candidateId);
      await candidatesAPI.deleteCandidate(candidateId);
      setSuccessMessage('Candidate deleted successfully!');
      await loadCandidates();
    } catch (err) {
      console.error('Error deleting candidate:', err);
      setError('Failed to delete candidate. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCandidates.length === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedCandidates.length} candidates? This action cannot be undone.`)) {
      return;
    }

    try {
      await candidatesAPI.bulkDeleteCandidates(selectedCandidates);
      setSuccessMessage(`${selectedCandidates.length} candidates deleted successfully!`);
      setSelectedCandidates([]);
      await loadCandidates();
    } catch (err) {
      console.error('Error bulk deleting candidates:', err);
      setError('Failed to delete candidates. Please try again.');
    }
  };

  const handleSelectCandidate = (candidateId: string) => {
    setSelectedCandidates(prev =>
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCandidates.length === paginatedCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(paginatedCandidates.map(candidate => candidate.id));
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

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ChevronDown className="sort-icon" />;
    return sortDirection === 'asc' ? 
      <ChevronDown className="sort-icon sort-asc" /> : 
      <ChevronDown className="sort-icon sort-desc" />;
  };

  return (
    <div className="candidate-management-page">
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
        className="candidate-management-container"
      >
        {/* Header */}
        <div className="candidate-header">
          <div className="header-content">
            <h1 className="page-title">Candidate Management</h1>
            <p className="page-subtitle">
              Manage and track all candidates in your talent pool
            </p>
          </div>
          <div className="header-actions">
            <button className="import-btn">
              <Upload className="btn-icon" />
              Import Candidates
            </button>
            <button className="export-btn">
              <Download className="btn-icon" />
              Export Data
            </button>
            <button className="add-candidate-btn">
              <Plus className="btn-icon" />
              Add Candidate
            </button>
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
                placeholder="Search candidates by name, title, or skills..."
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
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </button>
                <button
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  List
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
                  <label>Experience</label>
                  <select
                    value={filters.experience || ''}
                    onChange={(e) => handleFilterChange({ experience: e.target.value })}
                    className="filter-select"
                  >
                    <option value="">All Experience</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Status</label>
                  <select
                    value={filters.status || ''}
                    onChange={(e) => handleFilterChange({ status: e.target.value })}
                    className="filter-select"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="archived">Archived</option>
                  </select>
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
              <h2>All Candidates</h2>
              <p>{filteredCandidates.length} candidates found</p>
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
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="location-asc">Location A-Z</option>
                  <option value="location-desc">Location Z-A</option>
                  <option value="experience-asc">Experience Low-High</option>
                  <option value="experience-desc">Experience High-Low</option>
                  <option value="rating-desc">Rating High-Low</option>
                  <option value="rating-asc">Rating Low-High</option>
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedCandidates.length > 0 && (
            <div className="bulk-actions">
              <div className="bulk-info">
                <span>{selectedCandidates.length} candidates selected</span>
              </div>
              <div className="bulk-buttons">
                <button onClick={handleBulkDelete} className="bulk-delete-btn">
                  <Trash2 className="btn-icon" />
                  Delete Selected
                </button>
                <button onClick={() => setSelectedCandidates([])} className="bulk-cancel-btn">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Candidates Grid/List */}
          <div className="candidates-content">
            {loading ? (
              <div className="loading-state">
                <Loader2 className="loading-spinner" />
                <p>Loading candidates...</p>
              </div>
            ) : filteredCandidates.length === 0 ? (
              <div className="empty-state">
                <Users className="empty-icon" />
                <h3>No candidates found</h3>
                <p>Try adjusting your search criteria or filters.</p>
              </div>
            ) : (
              <div className={`candidates-container ${viewMode === 'grid' ? 'grid-view' : 'list-view'}`}>
                {paginatedCandidates.map((candidate, index) => (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`candidate-card ${viewMode === 'grid' ? 'grid-card' : 'list-card'}`}
                  >
                    <div className="candidate-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedCandidates.includes(candidate.id)}
                        onChange={() => handleSelectCandidate(candidate.id)}
                      />
                    </div>
                    
                    <div className="candidate-avatar">
                      {candidate.avatar || candidate.profileImage ? (
                        <img 
                          src={candidate.avatar || candidate.profileImage} 
                          alt={candidate.name}
                          className="avatar-img"
                        />
                      ) : (
                        <div className="avatar-placeholder">
                          {candidate.name?.charAt(0) || '?'}
                        </div>
                      )}
                    </div>
                    
                    <div className="candidate-info">
                      <div className="candidate-header">
                        <h3 className="candidate-name">{candidate.name}</h3>
                        <div className="candidate-rating">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`star ${i < (candidate.rating || 0) ? 'filled' : ''}`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="candidate-details">
                        <div className="detail-item">
                          <Briefcase className="detail-icon" />
                          <span>{candidate.jobTitle || 'No title specified'}</span>
                        </div>
                        <div className="detail-item">
                          <MapPin className="detail-icon" />
                          <span>{candidate.location || 'Location not specified'}</span>
                        </div>
                        <div className="detail-item">
                          <Clock className="detail-icon" />
                          <span>{candidate.experience || 'Experience not specified'}</span>
                        </div>
                        {candidate.salary && (
                          <div className="detail-item">
                            <DollarSign className="detail-icon" />
                            <span>{candidate.salary}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="candidate-skills">
                        {candidate.skills?.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="skill-tag">{skill}</span>
                        ))}
                        {candidate.skills && candidate.skills.length > 3 && (
                          <span className="skill-tag more">+{candidate.skills.length - 3} more</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="candidate-actions">
                      <button className="action-btn view-btn" title="View Profile">
                        <Eye className="btn-icon" />
                      </button>
                      <button className="action-btn edit-btn" title="Edit Candidate">
                        <Edit className="btn-icon" />
                      </button>
                      <button 
                        className="action-btn delete-btn" 
                        title="Delete Candidate"
                        onClick={() => handleDeleteCandidate(candidate.id)}
                        disabled={deleteLoading === candidate.id}
                      >
                        {deleteLoading === candidate.id ? (
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
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredCandidates.length)} of {filteredCandidates.length} candidates
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CandidateManagement;
