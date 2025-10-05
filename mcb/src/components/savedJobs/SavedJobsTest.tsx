import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Heart, 
  Trash2, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Briefcase, 
  Calendar, 
  MapPin, 
  CheckCircle as Check, 
  AlertCircle, 
  Loader2,
  RefreshCw,
  FileText,
  Mail,
  Phone,
  Building2,
  DollarSign,
  Star
} from 'lucide-react';
import { savedJobsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './SavedJobsTest.css';

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

const SavedJobsTest: React.FC = () => {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [selectedSavedJob, setSelectedSavedJob] = useState<SavedJob | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    jobId: ''
  });
  const [stats, setStats] = useState<any>(null);

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
      addTestResult('✅ Loaded saved jobs successfully', { count: savedJobsData.length });
    } catch (err) {
      console.error('Error loading saved jobs:', err);
      setError('Failed to load saved jobs');
      addTestResult('❌ Failed to load saved jobs', { error: err });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await savedJobsAPI.getSavedJobsStats();
      setStats(statsData);
      addTestResult('✅ Loaded saved jobs stats successfully', statsData);
    } catch (err) {
      console.error('Error loading stats:', err);
      addTestResult('❌ Failed to load saved jobs stats', { error: err });
    }
  };

  const addTestResult = (message: string, data?: any) => {
    const result = {
      id: Date.now(),
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    };
    setTestResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
  };

  const testSaveJob = async () => {
    try {
      setLoading(true);
      const jobId = createForm.jobId || 'test-job-id-' + Date.now();

      const newSavedJob = await savedJobsAPI.saveJob(jobId);
      addTestResult('✅ Saved job successfully', newSavedJob);
      setSuccessMessage('Job saved successfully!');
      setShowCreateForm(false);
      setCreateForm({ jobId: '' });
      await loadSavedJobs();
    } catch (err) {
      console.error('Error saving job:', err);
      addTestResult('❌ Failed to save job', { error: err });
      setError('Failed to save job');
    } finally {
      setLoading(false);
    }
  };

  const testUnsaveJob = async (jobId: string) => {
    try {
      setLoading(true);
      const result = await savedJobsAPI.unsaveJob(jobId);
      addTestResult('✅ Unsaved job successfully', result);
      setSuccessMessage('Job removed from saved jobs!');
      await loadSavedJobs();
    } catch (err) {
      console.error('Error unsaving job:', err);
      addTestResult('❌ Failed to unsave job', { error: err });
      setError('Failed to unsave job');
    } finally {
      setLoading(false);
    }
  };

  const testIsJobSaved = async (jobId: string) => {
    try {
      setLoading(true);
      const isSaved = await savedJobsAPI.isJobSaved(jobId);
      addTestResult(`✅ Checked if job is saved: ${isSaved}`, { jobId, isSaved });
    } catch (err) {
      console.error('Error checking if job is saved:', err);
      addTestResult('❌ Failed to check if job is saved', { error: err });
      setError('Failed to check if job is saved');
    } finally {
      setLoading(false);
    }
  };

  const testBulkSaveJobs = async () => {
    if (savedJobs.length === 0) {
      setError('No saved jobs to test bulk operations');
      return;
    }

    try {
      setLoading(true);
      const jobIds = ['bulk-test-1', 'bulk-test-2', 'bulk-test-3'];
      const result = await savedJobsAPI.bulkSaveJobs(jobIds);
      addTestResult('✅ Bulk saved jobs successfully', result);
      setSuccessMessage('Bulk save completed!');
      await loadSavedJobs();
    } catch (err) {
      console.error('Error bulk saving jobs:', err);
      addTestResult('❌ Failed to bulk save jobs', { error: err });
      setError('Failed to bulk save jobs');
    } finally {
      setLoading(false);
    }
  };

  const testBulkUnsaveJobs = async () => {
    if (savedJobs.length === 0) {
      setError('No saved jobs to test bulk operations');
      return;
    }

    try {
      setLoading(true);
      const jobIds = savedJobs.slice(0, 2).map(savedJob => savedJob.jobId);
      const result = await savedJobsAPI.bulkUnsaveJobs(jobIds);
      addTestResult('✅ Bulk unsaved jobs successfully', result);
      setSuccessMessage('Bulk unsave completed!');
      await loadSavedJobs();
    } catch (err) {
      console.error('Error bulk unsaving jobs:', err);
      addTestResult('❌ Failed to bulk unsave jobs', { error: err });
      setError('Failed to bulk unsave jobs');
    } finally {
      setLoading(false);
    }
  };

  const testSearchSavedJobs = async () => {
    try {
      setLoading(true);
      const searchFilters = {
        keyword: 'developer',
        company: 'tech'
      };

      const results = await savedJobsAPI.searchSavedJobs(searchFilters);
      addTestResult('✅ Searched saved jobs successfully', { count: results.length });
    } catch (err) {
      console.error('Error searching saved jobs:', err);
      addTestResult('❌ Failed to search saved jobs', { error: err });
      setError('Failed to search saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const testGetAnalytics = async () => {
    try {
      setLoading(true);
      const analytics = await savedJobsAPI.getSavedJobsAnalytics();
      addTestResult('✅ Retrieved saved jobs analytics successfully', analytics);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      addTestResult('❌ Failed to fetch analytics', { error: err });
      setError('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const testClearAllSavedJobs = async () => {
    if (!window.confirm('Are you sure you want to clear all saved jobs? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const result = await savedJobsAPI.clearAllSavedJobs();
      addTestResult('✅ Cleared all saved jobs successfully', result);
      setSuccessMessage('All saved jobs cleared!');
      await loadSavedJobs();
    } catch (err) {
      console.error('Error clearing all saved jobs:', err);
      addTestResult('❌ Failed to clear all saved jobs', { error: err });
      setError('Failed to clear all saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
    setError(null);
    setSuccessMessage(null);
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
    <div className="saved-jobs-test-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="saved-jobs-test-container"
      >
        {/* Header */}
        <div className="test-header">
          <h1 className="test-title">Saved Jobs Module Test</h1>
          <p className="test-subtitle">
            Test all CRUD operations for the Saved Jobs API
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="success-message"
          >
            <Check className="success-icon" />
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

        {/* Test Controls */}
        <div className="test-controls">
          <div className="test-buttons">
            <button 
              onClick={loadSavedJobs} 
              className="test-btn primary"
              disabled={loading}
            >
              {loading ? <Loader2 className="btn-icon loading" /> : <RefreshCw className="btn-icon" />}
              Load Saved Jobs
            </button>
            
            <button 
              onClick={() => setShowCreateForm(true)} 
              className="test-btn success"
              disabled={loading}
            >
              <Plus className="btn-icon" />
              Save Job
            </button>
            
            <button 
              onClick={testSearchSavedJobs} 
              className="test-btn info"
              disabled={loading}
            >
              <Search className="btn-icon" />
              Search Test
            </button>
            
            <button 
              onClick={loadStats} 
              className="test-btn warning"
              disabled={loading}
            >
              <FileText className="btn-icon" />
              Get Stats
            </button>
            
            <button 
              onClick={testBulkSaveJobs} 
              className="test-btn secondary"
              disabled={loading}
            >
              <Heart className="btn-icon" />
              Bulk Save
            </button>
            
            <button 
              onClick={testBulkUnsaveJobs} 
              className="test-btn danger"
              disabled={loading}
            >
              <Trash2 className="btn-icon" />
              Bulk Unsave
            </button>
            
            <button 
              onClick={testGetAnalytics} 
              className="test-btn info"
              disabled={loading}
            >
              <Star className="btn-icon" />
              Analytics
            </button>
            
            <button 
              onClick={testClearAllSavedJobs} 
              className="test-btn danger"
              disabled={loading}
            >
              <XCircle className="btn-icon" />
              Clear All
            </button>
            
            <button 
              onClick={clearResults} 
              className="test-btn danger"
            >
              Clear Results
            </button>
          </div>
        </div>

        {/* Create Saved Job Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="create-form"
          >
            <h3>Save a Job</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Job ID</label>
                <input
                  type="text"
                  value={createForm.jobId}
                  onChange={(e) => setCreateForm({...createForm, jobId: e.target.value})}
                  placeholder="Enter job ID"
                />
              </div>
            </div>
            <div className="form-actions">
              <button onClick={testSaveJob} className="test-btn success" disabled={loading}>
                {loading ? <Loader2 className="btn-icon loading" /> : <Heart className="btn-icon" />}
                Save Job
              </button>
              <button onClick={() => setShowCreateForm(false)} className="test-btn danger">
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Stats Section */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="stats-section"
          >
            <h3>Saved Jobs Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <Heart className="stat-icon" />
                <div>
                  <h4>{stats.totalSavedJobs || 0}</h4>
                  <p>Total Saved Jobs</p>
                </div>
              </div>
              <div className="stat-item">
                <Clock className="stat-icon" />
                <div>
                  <h4>{stats.savedThisWeek || 0}</h4>
                  <p>This Week</p>
                </div>
              </div>
              <div className="stat-item">
                <Calendar className="stat-icon" />
                <div>
                  <h4>{stats.savedThisMonth || 0}</h4>
                  <p>This Month</p>
                </div>
              </div>
              <div className="stat-item">
                <Building2 className="stat-icon" />
                <div>
                  <h4>{stats.mostSavedCompany || 'N/A'}</h4>
                  <p>Top Company</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Saved Jobs List */}
        <div className="saved-jobs-section">
          <h3>Saved Jobs ({savedJobs.length})</h3>
          {loading ? (
            <div className="loading-state">
              <Loader2 className="loading-spinner" />
              <p>Loading saved jobs...</p>
            </div>
          ) : savedJobs.length === 0 ? (
            <div className="empty-state">
              <Heart className="empty-icon" />
              <p>No saved jobs found</p>
            </div>
          ) : (
            <div className="saved-jobs-grid">
              {savedJobs.slice(0, 6).map((savedJob, index) => (
                <motion.div
                  key={savedJob.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="saved-job-card"
                >
                  <div className="saved-job-header">
                    <h4 className="saved-job-title">
                      {savedJob.job?.title || 'Job Title Not Available'}
                    </h4>
                    <div className="saved-job-meta">
                      <span className="saved-date">
                        <Clock className="meta-icon" />
                        {getTimeAgo(savedJob.savedAt)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="saved-job-details">
                    <div className="detail-item">
                      <Building2 className="detail-icon" />
                      <span>{savedJob.job?.company || 'Company Not Available'}</span>
                    </div>
                    <div className="detail-item">
                      <MapPin className="detail-icon" />
                      <span>{savedJob.job?.location || 'Location Not Available'}</span>
                    </div>
                    <div className="detail-item">
                      <Briefcase className="detail-icon" />
                      <span>{savedJob.job?.type || 'Job Type Not Available'}</span>
                    </div>
                    {savedJob.job?.salary && (
                      <div className="detail-item">
                        <DollarSign className="detail-icon" />
                        <span>
                          ${savedJob.job.salary.min.toLocaleString()} - ${savedJob.job.salary.max.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="saved-job-actions">
                    <button 
                      onClick={() => testIsJobSaved(savedJob.jobId)}
                      className="action-btn check"
                      disabled={loading}
                    >
                      <CheckCircle className="btn-icon" />
                    </button>
                    <button 
                      onClick={() => testUnsaveJob(savedJob.jobId)}
                      className="action-btn delete"
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="btn-icon loading" /> : <Trash2 className="btn-icon" />}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Saved Job Details */}
        {selectedSavedJob && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="selected-saved-job"
          >
            <h3>Selected Saved Job Details</h3>
            <div className="saved-job-details-card">
              <pre>{JSON.stringify(selectedSavedJob, null, 2)}</pre>
              <button onClick={() => setSelectedSavedJob(null)} className="test-btn danger">
                Close Details
              </button>
            </div>
          </motion.div>
        )}

        {/* Test Results */}
        <div className="test-results">
          <h3>Test Results ({testResults.length})</h3>
          {testResults.length === 0 ? (
            <p className="no-results">No test results yet. Run some tests to see results here.</p>
          ) : (
            <div className="results-list">
              {testResults.map((result) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="result-item"
                >
                  <div className="result-header">
                    <span className="result-message">{result.message}</span>
                    <span className="result-time">{result.timestamp}</span>
                  </div>
                  {result.data && (
                    <div className="result-data">
                      <pre>{JSON.stringify(result.data, null, 2)}</pre>
                    </div>
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

export default SavedJobsTest;
