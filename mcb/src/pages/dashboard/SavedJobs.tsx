import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, DollarSign, Eye, Trash2, RefreshCw, Grid3X3, List } from 'lucide-react';
import { savedJobsAPI } from '../../services/api';
import { Job } from '../../types/job';
import './SavedJobs.css';

const SavedJobs: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unsaveLoading, setUnsaveLoading] = useState<string | null>(null);

  // Load saved jobs from API
  useEffect(() => {
    const loadSavedJobs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await savedJobsAPI.getSavedJobs();
        const savedJobsData = response.savedJobs || response || [];
        // Transform saved jobs data to match Job interface
        const transformedJobs = savedJobsData.map((savedJob: any) => ({
          id: savedJob.jobId,
          title: savedJob.job?.title || 'Job Title Not Available',
          company: savedJob.job?.company || 'Company Not Available',
          location: savedJob.job?.location || 'Location Not Available',
          jobType: savedJob.job?.type || 'Job Type Not Available',
          salary: savedJob.job?.salary ? 
            `${savedJob.job.salary.min} - ${savedJob.job.salary.max}` : 
            'Salary Not Available',
          savedDate: new Date(savedJob.savedAt).toLocaleDateString(),
          description: savedJob.job?.description || '',
          skills: savedJob.job?.skills || [],
          isRemote: savedJob.job?.isRemote || false
        }));
        setSavedJobs(transformedJobs);
      } catch (err) {
        console.error('Error loading saved jobs:', err);
        setError('Failed to load saved jobs');
        setSavedJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedJobs();
  }, []);

  const handleUnsaveJob = async (jobId: string) => {
    try {
      setUnsaveLoading(jobId);
      await savedJobsAPI.unsaveJob(jobId);
      // Remove the job from the local state
      setSavedJobs(prev => prev.filter(job => job.id !== jobId));
    } catch (err) {
      console.error('Error unsaving job:', err);
      setError('Failed to remove job from saved jobs');
    } finally {
      setUnsaveLoading(null);
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="saved-jobs-loading"
      >
        <div className="loading-spinner"></div>
        <p>Loading saved jobs...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="saved-jobs-error"
      >
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="saved-jobs-header">
        <div className="saved-jobs-header-left">
          <h2 className="saved-jobs-count">{savedJobs.length} SAVED JOBS</h2>
          <div className="saved-jobs-filter-controls">
            <div className="saved-jobs-filter-group">
              <label>Status:</label>
              <select className="saved-jobs-filter-select">
                <option>All Status</option>
                <option>Active</option>
                <option>Expired</option>
              </select>
            </div>
            <div className="saved-jobs-filter-group">
              <label>Sort by:</label>
              <select className="saved-jobs-filter-select">
                <option>Saved Date</option>
                <option>Job Title</option>
                <option>Company</option>
              </select>
            </div>
          </div>
        </div>
        <div className="saved-jobs-header-actions">
          <div className="saved-jobs-view-toggle">
            <button 
              className={`saved-jobs-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid3X3 className="saved-jobs-view-icon" />
            </button>
            <button 
              className={`saved-jobs-view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List className="saved-jobs-view-icon" />
            </button>
          </div>
          <button className="saved-jobs-refresh-btn">
            <RefreshCw className="saved-jobs-refresh-icon" />
            Refresh
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="saved-jobs-search-section">
        <input
          type="text"
          placeholder="Search saved jobs..."
          className="saved-jobs-search-input"
        />
      </div>

      {/* Jobs Content */}
      {viewMode === 'list' ? (
        <div className="saved-jobs-table">
          <div className="saved-jobs-table-header">
            <div className="saved-jobs-header-cell">JOB TITLE</div>
            <div className="saved-jobs-header-cell">COMPANY</div>
            <div className="saved-jobs-header-cell">LOCATION</div>
            <div className="saved-jobs-header-cell">SALARY</div>
            <div className="saved-jobs-header-cell">SAVED DATE</div>
            <div className="saved-jobs-header-cell">STATUS</div>
            <div className="saved-jobs-header-cell">ACTION</div>
          </div>

          <div className="saved-jobs-table-body">
            {savedJobs.length > 0 ? (
              savedJobs.map((job, index) => (
                <div key={job.id} className={`saved-jobs-table-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
                  <div className="saved-jobs-cell">
                    <div className="saved-jobs-job-info">
                      <div className="saved-jobs-job-title-text">{job.title}</div>
                      <div className="saved-jobs-job-type">{job.jobType || 'Full-time'}</div>
                    </div>
                  </div>
                  <div className="saved-jobs-cell">
                    <span className="saved-jobs-company-name">@{job.company}</span>
                  </div>
                  <div className="saved-jobs-cell">
                    <div className="saved-jobs-location-info">
                      <MapPin className="saved-jobs-location-icon" />
                      {job.location}
                    </div>
                  </div>
                  <div className="saved-jobs-cell">
                    <div className="saved-jobs-salary-info">
                      <DollarSign className="saved-jobs-salary-icon" />
                      {job.salary}
                    </div>
                  </div>
                  <div className="saved-jobs-cell">
                    <span className="saved-jobs-saved-date">{job.savedDate}</span>
                  </div>
                  <div className="saved-jobs-cell">
                    <div className="saved-jobs-status-badge">
                      <span className="saved-jobs-status-text">Saved</span>
                    </div>
                  </div>
                  <div className="saved-jobs-cell">
                    <div className="saved-jobs-action">
                      <button className="saved-jobs-action-btn saved-jobs-view" title="View Details">
                        <Eye className="saved-jobs-action-icon" />
                      </button>
                      <button className="saved-jobs-action-btn saved-jobs-delete" title="Remove from Saved">
                        <Trash2 className="saved-jobs-action-icon" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="saved-jobs-no-jobs">
                <div className="saved-jobs-no-jobs-icon">💼</div>
                <h3>No saved jobs found</h3>
                <p>Start saving jobs you're interested in to see them here.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="saved-jobs-grid">
          {savedJobs.length > 0 ? (
            savedJobs.map((job) => (
              <div key={job.id} className="saved-jobs-job-card">
                <div className="saved-jobs-card-header">
                  <div className="saved-jobs-job-title">{job.title}</div>
                  <div className="saved-jobs-job-type">{job.jobType}</div>
                </div>
                <div className="saved-jobs-card-body">
                  <div className="saved-jobs-company-info">
                    <span className="saved-jobs-company-name">@{job.company}</span>
                  </div>
                  <div className="saved-jobs-location-info">
                    <MapPin className="saved-jobs-location-icon" />
                    {job.location}
                  </div>
                  <div className="saved-jobs-salary-info">
                    <DollarSign className="saved-jobs-salary-icon" />
                    {job.salary}
                  </div>
                  <div className="saved-jobs-saved-date">
                    <span>Saved: {job.savedDate}</span>
                  </div>
                </div>
                <div className="saved-jobs-card-footer">
                  <div className="saved-jobs-status-badge">
                    <span className="saved-jobs-status-text">Saved</span>
                  </div>
                  <div className="saved-jobs-card-actions">
                    <button className="saved-jobs-action-btn saved-jobs-view" title="View Details">
                      <Eye className="saved-jobs-action-icon" />
                    </button>
                    <button 
                      className="saved-jobs-action-btn saved-jobs-delete" 
                      title="Remove from Saved"
                      onClick={() => handleUnsaveJob(job.id)}
                      disabled={unsaveLoading === job.id}
                    >
                      {unsaveLoading === job.id ? (
                        <div className="saved-jobs-loading-spinner"></div>
                      ) : (
                        <Trash2 className="saved-jobs-action-icon" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="saved-jobs-no-jobs">
              <div className="saved-jobs-no-jobs-icon">💼</div>
              <h3>No saved jobs found</h3>
              <p>Start saving jobs you're interested in to see them here.</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default SavedJobs;

