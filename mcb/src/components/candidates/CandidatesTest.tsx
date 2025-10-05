import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
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
  CheckCircle, 
  AlertCircle, 
  Loader2,
  RefreshCw
} from 'lucide-react';
import { candidatesAPI } from '../../services/api';
import './CandidatesTest.css';

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

const CandidatesTest: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    jobTitle: '',
    location: '',
    skills: '',
    experience: '',
    salary: '',
    company: '',
    education: ''
  });

  // Load candidates on component mount
  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await candidatesAPI.fetchCandidates();
      const candidatesData = response.candidates || response || [];
      setCandidates(candidatesData);
      addTestResult('✅ Loaded candidates successfully', { count: candidatesData.length });
    } catch (err) {
      console.error('Error loading candidates:', err);
      setError('Failed to load candidates');
      addTestResult('❌ Failed to load candidates', { error: err });
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

  const testCreateCandidate = async () => {
    try {
      setLoading(true);
      const candidateData = {
        name: createForm.name || 'Test Candidate',
        jobTitle: createForm.jobTitle || 'Software Developer',
        location: createForm.location || 'Remote',
        skills: createForm.skills ? createForm.skills.split(',').map(s => s.trim()) : ['JavaScript', 'React'],
        experience: createForm.experience || '3+ years',
        salary: createForm.salary || '$80,000 - $100,000',
        company: createForm.company || 'Tech Corp',
        education: createForm.education || 'BS Computer Science'
      };

      const newCandidate = await candidatesAPI.createCandidate(candidateData);
      addTestResult('✅ Created candidate successfully', newCandidate);
      setSuccessMessage('Candidate created successfully!');
      setShowCreateForm(false);
      setCreateForm({
        name: '',
        jobTitle: '',
        location: '',
        skills: '',
        experience: '',
        salary: '',
        company: '',
        education: ''
      });
      await loadCandidates();
    } catch (err) {
      console.error('Error creating candidate:', err);
      addTestResult('❌ Failed to create candidate', { error: err });
      setError('Failed to create candidate');
    } finally {
      setLoading(false);
    }
  };

  const testUpdateCandidate = async (candidate: Candidate) => {
    try {
      setLoading(true);
      const updateData = {
        ...candidate,
        name: `${candidate.name} (Updated)`,
        jobTitle: `${candidate.jobTitle} - Updated`
      };

      const updatedCandidate = await candidatesAPI.updateCandidate(candidate.id, updateData);
      addTestResult('✅ Updated candidate successfully', updatedCandidate);
      setSuccessMessage('Candidate updated successfully!');
      await loadCandidates();
    } catch (err) {
      console.error('Error updating candidate:', err);
      addTestResult('❌ Failed to update candidate', { error: err });
      setError('Failed to update candidate');
    } finally {
      setLoading(false);
    }
  };

  const testDeleteCandidate = async (candidateId: string) => {
    try {
      setLoading(true);
      const result = await candidatesAPI.deleteCandidate(candidateId);
      addTestResult('✅ Deleted candidate successfully', result);
      setSuccessMessage('Candidate deleted successfully!');
      await loadCandidates();
    } catch (err) {
      console.error('Error deleting candidate:', err);
      addTestResult('❌ Failed to delete candidate', { error: err });
      setError('Failed to delete candidate');
    } finally {
      setLoading(false);
    }
  };

  const testGetCandidateById = async (candidateId: string) => {
    try {
      setLoading(true);
      const candidate = await candidatesAPI.fetchCandidateById(candidateId);
      addTestResult('✅ Retrieved candidate by ID successfully', candidate);
      setSelectedCandidate(candidate);
    } catch (err) {
      console.error('Error fetching candidate by ID:', err);
      addTestResult('❌ Failed to fetch candidate by ID', { error: err });
      setError('Failed to fetch candidate');
    } finally {
      setLoading(false);
    }
  };

  const testSearchCandidates = async () => {
    try {
      setLoading(true);
      const searchFilters = {
        keyword: 'developer',
        location: 'remote',
        skills: ['JavaScript', 'React']
      };

      const results = await candidatesAPI.searchCandidates(searchFilters);
      addTestResult('✅ Searched candidates successfully', { count: results.length });
    } catch (err) {
      console.error('Error searching candidates:', err);
      addTestResult('❌ Failed to search candidates', { error: err });
      setError('Failed to search candidates');
    } finally {
      setLoading(false);
    }
  };

  const testGetCandidateStats = async () => {
    try {
      setLoading(true);
      const stats = await candidatesAPI.getCandidateStats();
      addTestResult('✅ Retrieved candidate stats successfully', stats);
    } catch (err) {
      console.error('Error fetching candidate stats:', err);
      addTestResult('❌ Failed to fetch candidate stats', { error: err });
      setError('Failed to fetch candidate stats');
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <div className="candidates-test-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="candidates-test-container"
      >
        {/* Header */}
        <div className="test-header">
          <h1 className="test-title">Candidates Module Test</h1>
          <p className="test-subtitle">
            Test all CRUD operations for the Candidates API
          </p>
        </div>

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

        {/* Test Controls */}
        <div className="test-controls">
          <div className="test-buttons">
            <button 
              onClick={loadCandidates} 
              className="test-btn primary"
              disabled={loading}
            >
              {loading ? <Loader2 className="btn-icon loading" /> : <RefreshCw className="btn-icon" />}
              Load Candidates
            </button>
            
            <button 
              onClick={() => setShowCreateForm(true)} 
              className="test-btn success"
              disabled={loading}
            >
              <Plus className="btn-icon" />
              Create Candidate
            </button>
            
            <button 
              onClick={testSearchCandidates} 
              className="test-btn info"
              disabled={loading}
            >
              <Search className="btn-icon" />
              Search Test
            </button>
            
            <button 
              onClick={testGetCandidateStats} 
              className="test-btn warning"
              disabled={loading}
            >
              <Users className="btn-icon" />
              Get Stats
            </button>
            
            <button 
              onClick={clearResults} 
              className="test-btn danger"
            >
              Clear Results
            </button>
          </div>
        </div>

        {/* Create Candidate Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="create-form"
          >
            <h3>Create New Candidate</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                  placeholder="Enter candidate name"
                />
              </div>
              <div className="form-group">
                <label>Job Title</label>
                <input
                  type="text"
                  value={createForm.jobTitle}
                  onChange={(e) => setCreateForm({...createForm, jobTitle: e.target.value})}
                  placeholder="Enter job title"
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={createForm.location}
                  onChange={(e) => setCreateForm({...createForm, location: e.target.value})}
                  placeholder="Enter location"
                />
              </div>
              <div className="form-group">
                <label>Skills (comma-separated)</label>
                <input
                  type="text"
                  value={createForm.skills}
                  onChange={(e) => setCreateForm({...createForm, skills: e.target.value})}
                  placeholder="JavaScript, React, Node.js"
                />
              </div>
              <div className="form-group">
                <label>Experience</label>
                <input
                  type="text"
                  value={createForm.experience}
                  onChange={(e) => setCreateForm({...createForm, experience: e.target.value})}
                  placeholder="3+ years"
                />
              </div>
              <div className="form-group">
                <label>Salary</label>
                <input
                  type="text"
                  value={createForm.salary}
                  onChange={(e) => setCreateForm({...createForm, salary: e.target.value})}
                  placeholder="$80,000 - $100,000"
                />
              </div>
            </div>
            <div className="form-actions">
              <button onClick={testCreateCandidate} className="test-btn success" disabled={loading}>
                {loading ? <Loader2 className="btn-icon loading" /> : <Plus className="btn-icon" />}
                Create Candidate
              </button>
              <button onClick={() => setShowCreateForm(false)} className="test-btn danger">
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Candidates List */}
        <div className="candidates-section">
          <h3>Candidates ({candidates.length})</h3>
          {loading ? (
            <div className="loading-state">
              <Loader2 className="loading-spinner" />
              <p>Loading candidates...</p>
            </div>
          ) : candidates.length === 0 ? (
            <div className="empty-state">
              <Users className="empty-icon" />
              <p>No candidates found</p>
            </div>
          ) : (
            <div className="candidates-grid">
              {candidates.slice(0, 6).map((candidate, index) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="candidate-card"
                >
                  <div className="candidate-header">
                    <h4 className="candidate-name">{candidate.name}</h4>
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
                      <span>{candidate.jobTitle || 'No title'}</span>
                    </div>
                    <div className="detail-item">
                      <MapPin className="detail-icon" />
                      <span>{candidate.location || 'No location'}</span>
                    </div>
                    <div className="detail-item">
                      <Clock className="detail-icon" />
                      <span>{candidate.experience || 'No experience'}</span>
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
                      <span className="skill-tag more">+{candidate.skills.length - 3}</span>
                    )}
                  </div>
                  
                  <div className="candidate-actions">
                    <button 
                      onClick={() => testGetCandidateById(candidate.id)}
                      className="action-btn view"
                      disabled={loading}
                    >
                      <Eye className="btn-icon" />
                    </button>
                    <button 
                      onClick={() => testUpdateCandidate(candidate)}
                      className="action-btn edit"
                      disabled={loading}
                    >
                      <Edit className="btn-icon" />
                    </button>
                    <button 
                      onClick={() => testDeleteCandidate(candidate.id)}
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

        {/* Selected Candidate Details */}
        {selectedCandidate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="selected-candidate"
          >
            <h3>Selected Candidate Details</h3>
            <div className="candidate-details-card">
              <pre>{JSON.stringify(selectedCandidate, null, 2)}</pre>
              <button onClick={() => setSelectedCandidate(null)} className="test-btn danger">
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

export default CandidatesTest;
