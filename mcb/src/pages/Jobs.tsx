import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { 
  Grid3X3, 
  List, 
  Filter, 
  SortAsc, 
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Building2
} from 'lucide-react';
import JobCard from '../components/jobs/JobCard';
import JobSearchBar from '../components/jobs/JobSearchBar';
import JobFilter from '../components/jobs/JobFilter';
import { Job, JobFilter as JobFilterType } from '../types/job';
import { jobsAPI } from '../services/api';
import './Jobs.css';

const Jobs: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<JobFilterType>({});

  // Read URL parameters and set filters
  useEffect(() => {
    const query = searchParams.get('q');
    const location = searchParams.get('location');
    
    if (query || location) {
      setFilters(prev => ({
        ...prev,
        keyword: query || '',
        location: location || ''
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const response = await jobsAPI.fetchJobs();
        // Handle both response structures
        const jobs = response.jobs || response || [];
        const jobsArray = Array.isArray(jobs) ? jobs : [];
        setJobs(jobsArray);
        setFilteredJobs(jobsArray);
      } catch (error) {
        console.error('Error loading jobs:', error);
        setJobs([]);
        setFilteredJobs([]);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  useEffect(() => {
    let filtered = [...jobs];

    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      filtered = filtered.filter(job => 
        job.title?.toLowerCase().includes(keyword) ||
        job.company?.toLowerCase().includes(keyword) ||
        job.description?.toLowerCase().includes(keyword) ||
        (job.skills && job.skills.some(skill => skill.toLowerCase().includes(keyword)))
      );
    }

    if (filters.location) {
      const location = filters.location.toLowerCase();
      filtered = filtered.filter(job => 
        job.location?.toLowerCase().includes(location)
      );
    }

    if (filters.salaryMin !== undefined) {
      filtered = filtered.filter(job => job.salary?.min >= filters.salaryMin!);
    }

    if (filters.salaryMax !== undefined) {
      filtered = filtered.filter(job => job.salary?.max <= filters.salaryMax!);
    }

    if (filters.jobType) {
      filtered = filtered.filter(job => job.type === filters.jobType);
    }

    if (filters.company) {
      const company = filters.company.toLowerCase();
      filtered = filtered.filter(job => 
        job.company?.toLowerCase().includes(company)
      );
    }

    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => {
          const dateA = a.postedDate ? new Date(a.postedDate).getTime() : 0;
          const dateB = b.postedDate ? new Date(b.postedDate).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'oldest':
        filtered.sort((a, b) => {
          const dateA = a.postedDate ? new Date(a.postedDate).getTime() : 0;
          const dateB = b.postedDate ? new Date(b.postedDate).getTime() : 0;
          return dateA - dateB;
        });
        break;
      case 'salary-high':
        filtered.sort((a, b) => (b.salary?.max || 0) - (a.salary?.max || 0));
        break;
      case 'salary-low':
        filtered.sort((a, b) => (a.salary?.min || 0) - (b.salary?.min || 0));
        break;
      case 'company':
        filtered.sort((a, b) => (a.company || '').localeCompare(b.company || ''));
        break;
    }

    setFilteredJobs(filtered);
  }, [jobs, filters, sortBy]);

  const handleFiltersChange = (newFilters: JobFilterType) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleSearch = (searchFilters: { keyword: string; location: string }) => {
    setFilters(prev => ({
      ...prev,
      keyword: searchFilters.keyword,
      location: searchFilters.location
    }));
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== undefined && value !== '' && value !== null
    ).length;
  };

  return (
    <div className="jobs-page">
      {/* Professional Banner */}
      <header className="jobs-banner">
        <div className="jobs-banner-content">
          <div className="jobs-banner-text">
            <h1 className="jobs-banner-title">Career Opportunities</h1>
            <p className="jobs-banner-subtitle">Find your next professional opportunity</p>
          </div>
          <div className="jobs-banner-search">
            <JobSearchBar onSearch={handleSearch} />
          </div>
        </div>
      </header>

      <div className="jobs-container">
        {/* Main Content Area */}
        <main className="jobs-main">
            {/* Results Header */}
            <div className="jobs-results-header">
              <div className="jobs-results-info">
                <h2 className="jobs-results-title">
                  {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Available
                </h2>
                <p className="jobs-results-subtitle">
                  {getActiveFiltersCount() > 0 ? `${getActiveFiltersCount()} filter${getActiveFiltersCount() !== 1 ? 's' : ''} applied` : 'All opportunities'}
                </p>
              </div>

              <div className="jobs-results-controls">
                <div className="jobs-sort-control">
                  <SortAsc className="jobs-sort-icon" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="jobs-sort-select"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="salary-high">Salary: High to Low</option>
                    <option value="salary-low">Salary: Low to High</option>
                    <option value="company">Company A-Z</option>
                  </select>
                </div>

                <div className="jobs-view-controls">
                  <button
                    className={`jobs-view-btn ${viewMode === 'grid' ? 'jobs-active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid View"
                  >
                    <Grid3X3 className="jobs-view-icon" />
                  </button>
                  <button
                    className={`jobs-view-btn ${viewMode === 'list' ? 'jobs-active' : ''}`}
                    onClick={() => setViewMode('list')}
                    title="List View"
                  >
                    <List className="jobs-view-icon" />
                  </button>
                </div>
              </div>
            </div>

            {/* Job Cards Grid */}
            {loading ? (
              <div className="jobs-loading">
                <div className="jobs-loading-spinner"></div>
                <p>Loading opportunities...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="jobs-no-jobs">
                <Search className="jobs-no-jobs-icon" />
                <h3 className="jobs-no-jobs-title">No jobs found</h3>
                <p className="jobs-no-jobs-subtitle">
                  Try adjusting your search criteria or filters to find more opportunities.
                </p>
                {getActiveFiltersCount() > 0 && (
                  <button
                    className="jobs-clear-filters-btn"
                    onClick={handleClearFilters}
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className={`jobs-grid ${viewMode === 'list' ? 'jobs-list-view' : ''}`}>
                <AnimatePresence>
                  {(filteredJobs || []).map((job, index) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default Jobs;