import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Filter,
  Grid3X3,
  List,
  Clock,
  Building2,
  Star,
  ArrowRight,
  Calendar,
  Users,
  X,
  ChevronDown
} from 'lucide-react';
import { Job, JobFilter } from '../../types/job';
import { jobsAPI } from '../../services/api';
import './JobSearch.css';

const JobSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [experience, setExperience] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const performSearch = useCallback(async () => {
    console.log('performSearch called with:', { searchQuery, location, jobType, salaryMin, salaryMax, experience });
    
    // Always perform client-side filtering for better responsiveness
    let filtered = [...jobs];
    
    if (searchQuery) {
      filtered = filtered.filter(job => 
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.skills && job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (job.description && job.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (location) {
      filtered = filtered.filter(job => 
        (job.location && job.location.toLowerCase().includes(location.toLowerCase())) ||
        (location.toLowerCase() === 'remote' && job.isRemote)
      );
    }
    
    if (jobType) {
      filtered = filtered.filter(job => job.type && job.type.toLowerCase() === jobType.toLowerCase());
    }
    
    if (salaryMin) {
      filtered = filtered.filter(job => job.salary && job.salary.min >= parseInt(salaryMin));
    }
    
    if (salaryMax) {
      filtered = filtered.filter(job => job.salary && job.salary.max <= parseInt(salaryMax));
    }
    
    setFilteredJobs(filtered);
    console.log('Filtered jobs count:', filtered.length);
  }, [searchQuery, location, jobType, salaryMin, salaryMax, experience, jobs]);

  useEffect(() => {
    loadJobs();
  }, []);

  // Auto-search when filters change or jobs are loaded
  useEffect(() => {
    if (jobs.length > 0) {
      const timeoutId = setTimeout(() => {
        performSearch();
      }, 100); // Reduced debounce for better responsiveness
      
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, location, jobType, salaryMin, salaryMax, experience, jobs.length, performSearch]);

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      console.log('Loading jobs...');
      const response = await jobsAPI.fetchJobs();
      console.log('Load jobs response:', response);
      const jobs = response.jobs || response || [];
      const jobsArray = Array.isArray(jobs) ? jobs : [];
      console.log('Jobs loaded:', jobsArray.length, 'jobs');
      console.log('Sample job:', jobsArray[0]);
      setJobs(jobsArray);
      setFilteredJobs(jobsArray);
    } catch (error) {
      console.error('Error loading jobs:', error);
      setJobs([]);
      setFilteredJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Manual search triggered');
    await performSearch();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setLocation('');
    setJobType('');
    setSalaryMin('');
    setSalaryMax('');
    setExperience('');
    setFilteredJobs(jobs);
  };

  const handleApplyClick = (jobId: string) => {
    navigate(`/apply/${jobId}`);
  };

  const handleSort = (sortType: string) => {
    setSortBy(sortType);
    let sorted = [...filteredJobs];
    
    switch (sortType) {
      case 'newest':
        sorted.sort((a, b) => {
          const dateA = a.postedDate ? new Date(a.postedDate).getTime() : 0;
          const dateB = b.postedDate ? new Date(b.postedDate).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'oldest':
        sorted.sort((a, b) => {
          const dateA = a.postedDate ? new Date(a.postedDate).getTime() : 0;
          const dateB = b.postedDate ? new Date(b.postedDate).getTime() : 0;
          return dateA - dateB;
        });
        break;
      case 'salary-high':
        sorted.sort((a, b) => (b.salary?.max || 0) - (a.salary?.max || 0));
        break;
      case 'salary-low':
        sorted.sort((a, b) => (a.salary?.min || 0) - (b.salary?.min || 0));
        break;
      case 'company':
        sorted.sort((a, b) => (a.company || '').localeCompare(b.company || ''));
        break;
      default:
        break;
    }
    
    setFilteredJobs(sorted);
  };

  return (
    <div className="job-search-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="job-search-container"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="job-search-header"
        >
          <h1 className="page-title">Find Your Dream Job</h1>
          <p className="page-subtitle">
            Discover thousands of opportunities from top companies worldwide
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="search-section"
        >
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-main-row">
              <div className="search-field search-field-large">
                <div className="search-input-container">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>

              <div className="search-field">
                <div className="search-input-container">
                  <MapPin className="search-icon" />
                  <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>

              <button type="submit" className="search-btn">
                <Search className="btn-icon" />
                Search Jobs
              </button>
            </div>

            {/* Advanced Filters */}
            <div className={`advanced-filters ${showFilters ? 'show' : ''}`}>
              <div className="filters-row">
                <div className="search-field">
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="search-select"
                  >
                    <option value="">Job Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div className="search-field">
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="search-select"
                  >
                    <option value="">Experience Level</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>

                <div className="search-field">
                  <input
                    type="number"
                    placeholder="Min Salary"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                    className="search-input"
                  />
                </div>

                <div className="search-field">
                  <input
                    type="number"
                    placeholder="Max Salary"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>

              <div className="filters-actions">
                <button type="button" onClick={handleClearFilters} className="clear-filters-btn">
                  <X className="btn-icon" />
                  Clear Filters
                </button>
              </div>
            </div>

            <div className="filters-toggle">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="toggle-filters-btn"
              >
                <Filter className="btn-icon" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
                <ChevronDown className={`chevron ${showFilters ? 'rotated' : ''}`} />
              </button>
            </div>
          </form>
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
              <h2>Search Results</h2>
              <p>{filteredJobs.length} jobs found</p>
            </div>
            
            <div className="results-controls">
              <div className="sort-controls">
                <label htmlFor="sort-select">Sort by:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  className="sort-select"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="salary-high">Salary: High to Low</option>
                  <option value="salary-low">Salary: Low to High</option>
                  <option value="company">Company A-Z</option>
                </select>
              </div>
              
              <div className="view-controls">
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

          <div className="results-content">
            {isLoading ? (
              <div className="loading-state">
                <div className="loading-spinner" />
                <p>Searching for jobs...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="empty-state">
                <Search className="empty-icon" />
                <h3>No Jobs Found</h3>
                <p>Try adjusting your search criteria to find more opportunities.</p>
              </div>
            ) : (
              <div className={`jobs-container ${viewMode === 'grid' ? 'grid-view' : 'list-view'}`}>
                {filteredJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`job-card ${viewMode === 'grid' ? 'grid-card' : 'list-card'}`}
                  >
                    {viewMode === 'grid' ? (
                      // Grid View - Matching Homepage Style
                      <>
                        <div className="job-badge">
                          <span className="job-search-badge-text">{job.isRemote ? 'REMOTE' : job.type}</span>
                        </div>
                        <div className="job-content">
                          <div className="job-header">
                            <h3 className="job-title">{job.title}</h3>
                            <p className="job-company">{job.company}</p>
                          </div>
                          <div className="job-details">
                            <div className="job-detail-item">
                              <MapPin className="detail-icon" />
                              <span>{job.location}</span>
                            </div>
                            <div className="job-detail-item">
                              <Briefcase className="detail-icon" />
                              <span>
                                {job.experienceLevel || 
                                 (job.experience ? `${job.experience.min}-${job.experience.max} years` : 'Experience not specified')
                                }
                              </span>
                            </div>
                            <div className="job-detail-item">
                              <DollarSign className="detail-icon" />
                              <span>
                                {job.salary ? 
                                  `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}` : 
                                  'Salary not specified'
                                }
                              </span>
                            </div>
                          </div>
                          <div className="job-skills">
                            {job.skills && job.skills.slice(0, 3).map((skill, idx) => (
                              <span key={idx} className="skill-tag">{skill}</span>
                            ))}
                            {job.skills && job.skills.length > 3 && (
                              <span className="skill-tag more">+{job.skills.length - 3} more</span>
                            )}
                          </div>
                          <div className="job-actions">
                            <button 
                              className="apply-btn"
                              onClick={() => handleApplyClick(job.id)}
                            >
                              Apply Now
                              <ArrowRight className="btn-icon" />
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      // List View - Matching JobListCard Style
                      <>
                        <div className="job-main-info">
                          <div className="job-header">
                            <h3 className="job-title">{job.title}</h3>
                            <p className="job-company">{job.company}</p>
                          </div>
                          <div className="job-description">
                            <p>{job.description}</p>
                          </div>
                          <div className="job-skills">
                            {job.skills && job.skills.slice(0, 5).map((skill, idx) => (
                              <span key={idx} className="skill-tag">{skill}</span>
                            ))}
                          </div>
                        </div>
                        <div className="job-side-info">
                          <div className="job-badge">
                            <span className="job-search-badge-text">{job.isRemote ? 'REMOTE' : job.type}</span>
                          </div>
                          <div className="job-details">
                            <div className="job-detail-item">
                              <MapPin className="detail-icon" />
                              <span>{job.location}</span>
                            </div>
                            <div className="job-detail-item">
                              <Briefcase className="detail-icon" />
                              <span>
                                {job.experienceLevel || 
                                 (job.experience ? `${job.experience.min}-${job.experience.max} years` : 'Experience not specified')
                                }
                              </span>
                            </div>
                            <div className="job-detail-item">
                              <DollarSign className="detail-icon" />
                              <span>
                                {job.salary ? 
                                  `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}` : 
                                  'Salary not specified'
                                }
                              </span>
                            </div>
                            <div className="job-detail-item">
                              <Calendar className="detail-icon" />
                              <span>Posted {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'Date not specified'}</span>
                            </div>
                          </div>
                          <div className="job-actions">
                            <button 
                              className="apply-btn"
                              onClick={() => handleApplyClick(job.id)}
                            >
                              Apply Now
                              <ArrowRight className="btn-icon" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default JobSearch;
