import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Plus, 
  Edit, 
  Trash2, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { jobsAPI } from '../../services/api';
import { Job } from '../../types/job';
import './JobsTest.css';

const JobsTest: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Load jobs on component mount
  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobsAPI.fetchJobs();
      const jobsData = response.jobs || response || [];
      setJobs(Array.isArray(jobsData) ? jobsData : []);
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError('Failed to load jobs. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async () => {
    try {
      setActionLoading('create');
      const newJob = {
        title: 'Test Job Position',
        company: 'Test Company',
        location: 'Test Location',
        type: 'Full Time',
        category: 'Technology',
        description: 'This is a test job created via the Jobs API',
        isRemote: false
      };
      
      const createdJob = await jobsAPI.createJob(newJob);
      setSuccessMessage('Job created successfully!');
      await loadJobs(); // Reload jobs
    } catch (err) {
      console.error('Error creating job:', err);
      setError('Failed to create job. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateJob = async (jobId: string) => {
    try {
      setActionLoading(jobId);
      const updateData = {
        title: 'Updated Job Title',
        description: 'This job has been updated via the Jobs API'
      };
      
      await jobsAPI.updateJob(jobId, updateData);
      setSuccessMessage('Job updated successfully!');
      await loadJobs(); // Reload jobs
    } catch (err) {
      console.error('Error updating job:', err);
      setError('Failed to update job. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      setActionLoading(jobId);
      await jobsAPI.deleteJob(jobId);
      setSuccessMessage('Job deleted successfully!');
      await loadJobs(); // Reload jobs
    } catch (err) {
      console.error('Error deleting job:', err);
      setError('Failed to delete job. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <div className="jobs-test-container">
      <div className="jobs-test-header">
        <h2>Jobs Module Test</h2>
        <p>Test the Jobs API functionality with real backend integration</p>
      </div>

      {/* Messages */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="jobs-test-success"
        >
          <CheckCircle className="jobs-test-icon" />
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)}>×</button>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="jobs-test-error"
        >
          <AlertCircle className="jobs-test-icon" />
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </motion.div>
      )}

      {/* Actions */}
      <div className="jobs-test-actions">
        <button
          onClick={handleCreateJob}
          disabled={actionLoading === 'create'}
          className="jobs-test-btn jobs-test-btn--primary"
        >
          {actionLoading === 'create' ? (
            <Loader2 className="jobs-test-btn-icon" />
          ) : (
            <Plus className="jobs-test-btn-icon" />
          )}
          Create Test Job
        </button>

        <button
          onClick={loadJobs}
          disabled={loading}
          className="jobs-test-btn jobs-test-btn--secondary"
        >
          {loading ? (
            <Loader2 className="jobs-test-btn-icon" />
          ) : (
            <RefreshCw className="jobs-test-btn-icon" />
          )}
          Refresh Jobs
        </button>

        <button
          onClick={clearMessages}
          className="jobs-test-btn jobs-test-btn--tertiary"
        >
          Clear Messages
        </button>
      </div>

      {/* Jobs List */}
      <div className="jobs-test-content">
        <h3>Jobs from API ({jobs.length})</h3>
        
        {loading ? (
          <div className="jobs-test-loading">
            <Loader2 className="jobs-test-loading-icon" />
            <span>Loading jobs...</span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="jobs-test-empty">
            <Briefcase className="jobs-test-empty-icon" />
            <p>No jobs found. Create a test job to get started!</p>
          </div>
        ) : (
          <div className="jobs-test-list">
            {jobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="jobs-test-item"
              >
                <div className="jobs-test-item-content">
                  <h4>{job.title}</h4>
                  <p><strong>Company:</strong> {job.company}</p>
                  <p><strong>Location:</strong> {job.location || 'Not specified'}</p>
                  <p><strong>Type:</strong> {job.type || 'Not specified'}</p>
                  <p><strong>Category:</strong> {job.category || 'Not specified'}</p>
                  {job.description && (
                    <p><strong>Description:</strong> {job.description}</p>
                  )}
                  <p><strong>Remote:</strong> {job.isRemote ? 'Yes' : 'No'}</p>
                </div>
                
                <div className="jobs-test-item-actions">
                  <button
                    onClick={() => handleUpdateJob(job.id)}
                    disabled={actionLoading === job.id}
                    className="jobs-test-action-btn jobs-test-action-btn--edit"
                    title="Update Job"
                  >
                    {actionLoading === job.id ? (
                      <Loader2 className="jobs-test-action-icon" />
                    ) : (
                      <Edit className="jobs-test-action-icon" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    disabled={actionLoading === job.id}
                    className="jobs-test-action-btn jobs-test-action-btn--delete"
                    title="Delete Job"
                  >
                    {actionLoading === job.id ? (
                      <Loader2 className="jobs-test-action-icon" />
                    ) : (
                      <Trash2 className="jobs-test-action-icon" />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* API Status */}
      <div className="jobs-test-status">
        <h4>API Status</h4>
        <div className="jobs-test-status-item">
          <span>Backend URL:</span>
          <code>http://localhost:4000/api/jobs</code>
        </div>
        <div className="jobs-test-status-item">
          <span>Jobs Count:</span>
          <code>{jobs.length}</code>
        </div>
        <div className="jobs-test-status-item">
          <span>Loading:</span>
          <code>{loading ? 'Yes' : 'No'}</code>
        </div>
      </div>
    </div>
  );
};

export default JobsTest;
