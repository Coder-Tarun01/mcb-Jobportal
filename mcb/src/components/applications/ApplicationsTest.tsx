import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Edit, 
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
  Phone
} from 'lucide-react';
import { applicationsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './ApplicationsTest.css';

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

const ApplicationsTest: React.FC = () => {
  const { user, isEmployer } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    jobId: '',
    coverLetter: '',
    resumeUrl: ''
  });

  // Load applications on component mount
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await applicationsAPI.getUserApplications();
      const applicationsData = response.applications || response || [];
      setApplications(applicationsData);
      addTestResult('✅ Loaded applications successfully', { count: applicationsData.length });
    } catch (err) {
      console.error('Error loading applications:', err);
      setError('Failed to load applications');
      addTestResult('❌ Failed to load applications', { error: err });
    } finally {
      setLoading(false);
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

  const testCreateApplication = async () => {
    try {
      setLoading(true);
      const applicationData = {
        jobId: createForm.jobId || 'test-job-id',
        coverLetter: createForm.coverLetter || 'I am very interested in this position and would like to apply.',
        resumeUrl: createForm.resumeUrl || '/resumes/test-resume.pdf'
      };

      const newApplication = await applicationsAPI.applyToJob(applicationData.jobId, {
        coverLetter: applicationData.coverLetter,
        resumeUrl: applicationData.resumeUrl
      });
      addTestResult('✅ Created application successfully', newApplication);
      setSuccessMessage('Application created successfully!');
      setShowCreateForm(false);
      setCreateForm({
        jobId: '',
        coverLetter: '',
        resumeUrl: ''
      });
      await loadApplications();
    } catch (err) {
      console.error('Error creating application:', err);
      addTestResult('❌ Failed to create application', { error: err });
      setError('Failed to create application');
    } finally {
      setLoading(false);
    }
  };

  const testUpdateApplication = async (application: Application) => {
    try {
      setLoading(true);
      const updateData = {
        ...application,
        coverLetter: `${application.coverLetter} (Updated)`,
        status: 'reviewed' as const
      };

      const updatedApplication = await applicationsAPI.updateApplication(application.id, updateData);
      addTestResult('✅ Updated application successfully', updatedApplication);
      setSuccessMessage('Application updated successfully!');
      await loadApplications();
    } catch (err) {
      console.error('Error updating application:', err);
      addTestResult('❌ Failed to update application', { error: err });
      setError('Failed to update application');
    } finally {
      setLoading(false);
    }
  };

  const testUpdateApplicationStatus = async (applicationId: string, status: 'pending' | 'reviewed' | 'accepted' | 'rejected') => {
    try {
      setLoading(true);
      const updatedApplication = await applicationsAPI.updateApplicationStatus(applicationId, status);
      addTestResult(`✅ Updated application status to ${status}`, updatedApplication);
      setSuccessMessage(`Application status updated to ${status}!`);
      await loadApplications();
    } catch (err) {
      console.error('Error updating application status:', err);
      addTestResult('❌ Failed to update application status', { error: err });
      setError('Failed to update application status');
    } finally {
      setLoading(false);
    }
  };

  const testWithdrawApplication = async (applicationId: string) => {
    try {
      setLoading(true);
      const result = await applicationsAPI.withdrawApplication(applicationId);
      addTestResult('✅ Withdrew application successfully', result);
      setSuccessMessage('Application withdrawn successfully!');
      await loadApplications();
    } catch (err) {
      console.error('Error withdrawing application:', err);
      addTestResult('❌ Failed to withdraw application', { error: err });
      setError('Failed to withdraw application');
    } finally {
      setLoading(false);
    }
  };

  const testGetApplicationById = async (applicationId: string) => {
    try {
      setLoading(true);
      const application = await applicationsAPI.getApplication(applicationId);
      addTestResult('✅ Retrieved application by ID successfully', application);
      setSelectedApplication(application);
    } catch (err) {
      console.error('Error fetching application by ID:', err);
      addTestResult('❌ Failed to fetch application by ID', { error: err });
      setError('Failed to fetch application');
    } finally {
      setLoading(false);
    }
  };

  const testGetApplicationStats = async () => {
    try {
      setLoading(true);
      const stats = await applicationsAPI.getApplicationStats();
      addTestResult('✅ Retrieved application stats successfully', stats);
    } catch (err) {
      console.error('Error fetching application stats:', err);
      addTestResult('❌ Failed to fetch application stats', { error: err });
      setError('Failed to fetch application stats');
    } finally {
      setLoading(false);
    }
  };

  const testSearchApplications = async () => {
    try {
      setLoading(true);
      const searchFilters = {
        keyword: 'developer',
        status: 'pending'
      };

      const results = await applicationsAPI.searchApplications(searchFilters);
      addTestResult('✅ Searched applications successfully', { count: results.length });
    } catch (err) {
      console.error('Error searching applications:', err);
      addTestResult('❌ Failed to search applications', { error: err });
      setError('Failed to search applications');
    } finally {
      setLoading(false);
    }
  };

  const testBulkUpdateStatus = async () => {
    if (applications.length === 0) {
      setError('No applications to update');
      return;
    }

    try {
      setLoading(true);
      const applicationIds = applications.slice(0, 2).map(app => app.id);
      const result = await applicationsAPI.bulkUpdateApplicationStatus(applicationIds, 'reviewed');
      addTestResult('✅ Bulk updated application statuses successfully', result);
      setSuccessMessage('Bulk status update completed!');
      await loadApplications();
    } catch (err) {
      console.error('Error bulk updating applications:', err);
      addTestResult('❌ Failed to bulk update applications', { error: err });
      setError('Failed to bulk update applications');
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
    setError(null);
    setSuccessMessage(null);
  };

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

  return (
    <div className="applications-test-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="applications-test-container"
      >
        {/* Header */}
        <div className="test-header">
          <h1 className="test-title">Applications Module Test</h1>
          <p className="test-subtitle">
            Test all CRUD operations for the Applications API
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
              onClick={loadApplications} 
              className="test-btn primary"
              disabled={loading}
            >
              {loading ? <Loader2 className="btn-icon loading" /> : <RefreshCw className="btn-icon" />}
              Load Applications
            </button>
            
            <button 
              onClick={() => setShowCreateForm(true)} 
              className="test-btn success"
              disabled={loading}
            >
              <Plus className="btn-icon" />
              Create Application
            </button>
            
            <button 
              onClick={testSearchApplications} 
              className="test-btn info"
              disabled={loading}
            >
              <Search className="btn-icon" />
              Search Test
            </button>
            
            <button 
              onClick={testGetApplicationStats} 
              className="test-btn warning"
              disabled={loading}
            >
              <FileText className="btn-icon" />
              Get Stats
            </button>
            
            <button 
              onClick={testBulkUpdateStatus} 
              className="test-btn secondary"
              disabled={loading}
            >
              <CheckCircle className="btn-icon" />
              Bulk Update
            </button>
            
            <button 
              onClick={clearResults} 
              className="test-btn danger"
            >
              Clear Results
            </button>
          </div>
        </div>

        {/* Create Application Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="create-form"
          >
            <h3>Create New Application</h3>
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
              <div className="form-group">
                <label>Cover Letter</label>
                <textarea
                  value={createForm.coverLetter}
                  onChange={(e) => setCreateForm({...createForm, coverLetter: e.target.value})}
                  placeholder="Enter cover letter"
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Resume URL</label>
                <input
                  type="text"
                  value={createForm.resumeUrl}
                  onChange={(e) => setCreateForm({...createForm, resumeUrl: e.target.value})}
                  placeholder="Enter resume URL"
                />
              </div>
            </div>
            <div className="form-actions">
              <button onClick={testCreateApplication} className="test-btn success" disabled={loading}>
                {loading ? <Loader2 className="btn-icon loading" /> : <Plus className="btn-icon" />}
                Create Application
              </button>
              <button onClick={() => setShowCreateForm(false)} className="test-btn danger">
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Applications List */}
        <div className="applications-section">
          <h3>Applications ({applications.length})</h3>
          {loading ? (
            <div className="loading-state">
              <Loader2 className="loading-spinner" />
              <p>Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="empty-state">
              <FileText className="empty-icon" />
              <p>No applications found</p>
            </div>
          ) : (
            <div className="applications-grid">
              {applications.slice(0, 6).map((application, index) => (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="application-card"
                >
                  <div className="application-header">
                    <h4 className="application-title">
                      {application.job?.title || 'Job Title Not Available'}
                    </h4>
                    <div 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(application.status) }}
                    >
                      {getStatusIcon(application.status)}
                      <span>{application.status}</span>
                    </div>
                  </div>
                  
                  <div className="application-details">
                    <div className="detail-item">
                      <Briefcase className="detail-icon" />
                      <span>{application.job?.company || 'Company Not Available'}</span>
                    </div>
                    <div className="detail-item">
                      <User className="detail-icon" />
                      <span>{application.user?.name || 'Applicant Not Available'}</span>
                    </div>
                    <div className="detail-item">
                      <Calendar className="detail-icon" />
                      <span>{new Date(application.appliedAt).toLocaleDateString()}</span>
                    </div>
                    {application.coverLetter && (
                      <div className="cover-letter-preview">
                        <p>{application.coverLetter.substring(0, 100)}...</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="application-actions">
                    <button 
                      onClick={() => testGetApplicationById(application.id)}
                      className="action-btn view"
                      disabled={loading}
                    >
                      <Eye className="btn-icon" />
                    </button>
                    <button 
                      onClick={() => testUpdateApplication(application)}
                      className="action-btn edit"
                      disabled={loading}
                    >
                      <Edit className="btn-icon" />
                    </button>
                    <button 
                      onClick={() => testUpdateApplicationStatus(application.id, 'reviewed')}
                      className="action-btn status"
                      disabled={loading}
                    >
                      <CheckCircle className="btn-icon" />
                    </button>
                    <button 
                      onClick={() => testWithdrawApplication(application.id)}
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

        {/* Selected Application Details */}
        {selectedApplication && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="selected-application"
          >
            <h3>Selected Application Details</h3>
            <div className="application-details-card">
              <pre>{JSON.stringify(selectedApplication, null, 2)}</pre>
              <button onClick={() => setSelectedApplication(null)} className="test-btn danger">
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

export default ApplicationsTest;
