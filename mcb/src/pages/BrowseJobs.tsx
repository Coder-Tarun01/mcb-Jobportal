import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Star,
  Bookmark,
  BookmarkCheck,
  Grid3X3,
  List,
  ChevronDown,
  X,
  Building2,
  Calendar,
  Users
} from 'lucide-react';
import JobCard from '../components/jobs/JobCard';
import JobListCard from '../components/jobs/JobListCard';
import FilterSidebar from '../components/jobs/FilterSidebar';
import { jobsAPI } from '../services/api';
import { Job } from '../types/job';
import './BrowseJobs.css';

// Using Job type from types/job.ts instead of local interface

interface FilterOptions {
  search: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  salaryRange: string;
  category: string;
  isRemote: boolean;
  datePosted: string;
}

const BrowseJobs: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || 'all',
    jobType: searchParams.get('jobType') || 'all',
    experienceLevel: searchParams.get('experienceLevel') || 'all',
    salaryRange: searchParams.get('salaryRange') || 'all',
    category: searchParams.get('category') || 'all',
    isRemote: searchParams.get('isRemote') === 'true',
    datePosted: searchParams.get('datePosted') || 'all'
  });

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    // Update URL when filters change
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        params.set(key, value.toString());
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const response = await jobsAPI.fetchJobs();
      const jobs = response.jobs || response || [];
      setJobs(Array.isArray(jobs) ? jobs : []);
    } catch (error) {
      console.error('Error loading jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = filters.search === '' || 
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
      (job.skills && job.skills.some(skill => skill.toLowerCase().includes(filters.search.toLowerCase()))) ||
      (job.description && job.description.toLowerCase().includes(filters.search.toLowerCase()));

    const matchesLocation = filters.location === 'all' || 
      (job.location && job.location.toLowerCase().includes(filters.location.toLowerCase())) ||
      (filters.isRemote && job.isRemote);

    const matchesJobType = filters.jobType === 'all' || 
      (job.type && job.type.toLowerCase() === filters.jobType.toLowerCase());

    const matchesExperience = filters.experienceLevel === 'all' || 
      (job.experienceLevel && job.experienceLevel.toLowerCase() === filters.experienceLevel.toLowerCase());

    const matchesCategory = filters.category === 'all' || 
      (job.category && job.category.toLowerCase() === filters.category.toLowerCase());

    return matchesSearch && matchesLocation && matchesJobType && matchesExperience && matchesCategory;
  });

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      location: 'all',
      jobType: 'all',
      experienceLevel: 'all',
      salaryRange: 'all',
      category: 'all',
      isRemote: false,
      datePosted: 'all'
    });
  };

  const handleBookmark = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, isBookmarked: !job.isBookmarked } : job
    ));
  };

  const handleJobClick = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== '' && value !== 'all' && value !== false
  ).length;

  if (loading) {
    return (
      <div className="browse-jobs-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="browse-jobs-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="browse-jobs-container"
      >
        {/* Header */}
        <div className="browse-header">
          <div className="header-content">
            <h1 className="page-title">Browse Jobs</h1>
            <p className="page-subtitle">
              Discover {filteredJobs.length} amazing job opportunities
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="search-filters-section">
          <div className="search-bar">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search jobs, companies, or skills..."
                value={filters.search}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                className="search-input"
              />
            </div>
            <button 
              className={`filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="filter-icon" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="filter-count">{activeFiltersCount}</span>
              )}
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="filters-panel"
            >
              <div className="filters-content">
                <div className="filter-row">
                  <div className="filter-group">
                    <label className="filter-label">Location</label>
                    <select
                      value={filters.location}
                      onChange={(e) => handleFilterChange({ location: e.target.value })}
                      className="filter-select"
                    >
                      <option value="all">All Locations</option>
                      <option value="remote">Remote</option>
                      <option value="san francisco">San Francisco</option>
                      <option value="new york">New York</option>
                      <option value="seattle">Seattle</option>
                      <option value="austin">Austin</option>
                      <option value="miami">Miami</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label className="filter-label">Job Type</label>
                    <select
                      value={filters.jobType}
                      onChange={(e) => handleFilterChange({ jobType: e.target.value })}
                      className="filter-select"
                    >
                      <option value="all">All Types</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label className="filter-label">Experience Level</label>
                    <select
                      value={filters.experienceLevel}
                      onChange={(e) => handleFilterChange({ experienceLevel: e.target.value })}
                      className="filter-select"
                    >
                      <option value="all">All Levels</option>
                      <option value="entry-level">Entry Level</option>
                      <option value="mid-level">Mid Level</option>
                      <option value="senior">Senior</option>
                      <option value="executive">Executive</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label className="filter-label">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange({ category: e.target.value })}
                      className="filter-select"
                    >
                      <option value="all">All Categories</option>
                      <option value="technology">Technology</option>
                      <option value="design">Design</option>
                      <option value="product">Product</option>
                      <option value="marketing">Marketing</option>
                      <option value="sales">Sales</option>
                    </select>
                  </div>
                </div>

                <div className="filter-actions">
                  <button onClick={handleClearFilters} className="clear-filters-btn">
                    <X className="btn-icon" />
                    Clear All Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Header */}
        <div className="results-header">
          <div className="results-info">
            <h2 className="results-title">
              {filteredJobs.length} Jobs Found
            </h2>
            <p className="results-subtitle">
              {filters.search && `for "${filters.search}"`}
            </p>
          </div>

          <div className="view-controls">
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="view-icon" />
                Grid
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List className="view-icon" />
                List
              </button>
            </div>
          </div>
        </div>

        {/* Jobs Grid/List */}
        <div className="jobs-section">
          {filteredJobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Briefcase className="icon" />
              </div>
              <h3>No jobs found</h3>
              <p>Try adjusting your search criteria or filters to find more opportunities.</p>
              <button onClick={handleClearFilters} className="clear-filters-btn">
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className={`jobs-container ${viewMode}`}>
              {filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {viewMode === 'grid' ? (
                    <JobCard
                      job={job}
                      onBookmark={handleBookmark}
                      onClick={handleJobClick}
                    />
                  ) : (
                    <JobListCard
                      job={job}
                      onBookmark={handleBookmark}
                      onClick={handleJobClick}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default BrowseJobs;
