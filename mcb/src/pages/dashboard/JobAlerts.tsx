import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Plus, Edit, Trash2, Search, Filter, MapPin, Briefcase, DollarSign, Calendar, Clock, Grid3X3, List, RefreshCw, Settings, Eye } from 'lucide-react';
import './JobAlerts.css';

interface JobAlert {
  id: number;
  name: string;
  keywords: string[];
  location: string;
  salaryMin: number;
  salaryMax: number;
  jobType: string;
  experience: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  isActive: boolean;
  lastSent: string;
  nextSend: string;
  totalMatches: number;
  newMatches: number;
}

const initialAlerts: JobAlert[] = [
  {
    id: 1,
    name: 'Frontend Developer Jobs',
    keywords: ['React', 'JavaScript', 'Frontend', 'UI/UX'],
    location: 'San Francisco, CA',
    salaryMin: 70000,
    salaryMax: 120000,
    jobType: 'Full-time',
    experience: '2-5 years',
    frequency: 'daily',
    isActive: true,
    lastSent: '2024-01-15',
    nextSend: '2024-01-16',
    totalMatches: 45,
    newMatches: 8
  },
  {
    id: 2,
    name: 'Remote React Jobs',
    keywords: ['React', 'Remote', 'TypeScript', 'Node.js'],
    location: 'Remote',
    salaryMin: 60000,
    salaryMax: 100000,
    jobType: 'Full-time',
    experience: '1-4 years',
    frequency: 'weekly',
    isActive: true,
    lastSent: '2024-01-10',
    nextSend: '2024-01-17',
    totalMatches: 23,
    newMatches: 3
  },
  {
    id: 3,
    name: 'Senior Developer Positions',
    keywords: ['Senior', 'Lead', 'Architect', 'Full Stack'],
    location: 'New York, NY',
    salaryMin: 100000,
    salaryMax: 150000,
    jobType: 'Full-time',
    experience: '5+ years',
    frequency: 'weekly',
    isActive: false,
    lastSent: '2024-01-08',
    nextSend: '2024-01-15',
    totalMatches: 12,
    newMatches: 0
  },
  {
    id: 4,
    name: 'Startup Jobs',
    keywords: ['Startup', 'Early Stage', 'Equity', 'Growth'],
    location: 'Austin, TX',
    salaryMin: 50000,
    salaryMax: 80000,
    jobType: 'Full-time',
    experience: '0-3 years',
    frequency: 'monthly',
    isActive: true,
    lastSent: '2024-01-01',
    nextSend: '2024-02-01',
    totalMatches: 8,
    newMatches: 2
  }
];

const JobAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<JobAlert[]>(initialAlerts);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    frequency: 'all'
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAlert, setEditingAlert] = useState<JobAlert | null>(null);
  const [newAlert, setNewAlert] = useState<Partial<JobAlert>>({
    name: '',
    keywords: [],
    location: '',
    salaryMin: 0,
    salaryMax: 0,
    jobType: 'Full-time',
    experience: '',
    frequency: 'daily',
    isActive: true
  });

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleToggleAlert = (id: number) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const handleDeleteAlert = (id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const handleEditAlert = (alert: JobAlert) => {
    setEditingAlert(alert);
    setNewAlert(alert);
    setShowCreateModal(true);
  };

  const handleCreateAlert = () => {
    setNewAlert({
      name: '',
      keywords: [],
      location: '',
      salaryMin: 0,
      salaryMax: 0,
      jobType: 'Full-time',
      experience: '',
      frequency: 'daily',
      isActive: true
    });
    setEditingAlert(null);
    setShowCreateModal(true);
  };

  const handleSaveAlert = () => {
    if (editingAlert) {
      setAlerts(prev => prev.map(alert => 
        alert.id === editingAlert.id ? { ...alert, ...newAlert } as JobAlert : alert
      ));
    } else {
      const alert: JobAlert = {
        id: Date.now(),
        ...newAlert,
        lastSent: new Date().toISOString().split('T')[0],
        nextSend: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalMatches: 0,
        newMatches: 0
      } as JobAlert;
      setAlerts(prev => [...prev, alert]);
    }
    setShowCreateModal(false);
    setEditingAlert(null);
  };

  const handleKeywordChange = (keywords: string) => {
    setNewAlert(prev => ({
      ...prev,
      keywords: keywords.split(',').map(k => k.trim()).filter(k => k)
    }));
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         alert.keywords.some(keyword => keyword.toLowerCase().includes(filters.search.toLowerCase()));
    const matchesStatus = filters.status === 'all' || 
                         (filters.status === 'active' && alert.isActive) ||
                         (filters.status === 'inactive' && !alert.isActive);
    const matchesFrequency = filters.frequency === 'all' || alert.frequency === filters.frequency;
    return matchesSearch && matchesStatus && matchesFrequency;
  });

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return '#10b981';
      case 'weekly': return '#3b82f6';
      case 'monthly': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'daily': return <Clock className="job-alerts-frequency-icon" />;
      case 'weekly': return <Calendar className="job-alerts-frequency-icon" />;
      case 'monthly': return <Calendar className="job-alerts-frequency-icon" />;
      default: return <Clock className="job-alerts-frequency-icon" />;
    }
  };

  const totalAlerts = alerts.length;
  const activeAlerts = alerts.filter(alert => alert.isActive).length;
  const totalMatches = alerts.reduce((sum, alert) => sum + alert.totalMatches, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="job-alerts-container"
    >
      {/* Header Section */}
      <div className="job-alerts-header-section">
        <div className="job-alerts-header-content">
          <h2 className="job-alerts-main-title">Job Alerts</h2>
          <p className="job-alerts-main-subtitle">Manage your job search notifications and stay updated with new opportunities.</p>
          <div className="job-alerts-stats">
            <div className="job-alerts-stat-card">
              <Bell className="job-alerts-stat-icon" />
              <span className="job-alerts-stat-number">{totalAlerts}</span>
              <span className="job-alerts-stat-label">Total Alerts</span>
            </div>
            <div className="job-alerts-stat-card">
              <Settings className="job-alerts-stat-icon" />
              <span className="job-alerts-stat-number">{activeAlerts}</span>
              <span className="job-alerts-stat-label">Active</span>
            </div>
            <div className="job-alerts-stat-card">
              <Eye className="job-alerts-stat-icon" />
              <span className="job-alerts-stat-number">{totalMatches}</span>
              <span className="job-alerts-stat-label">Total Matches</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="job-alerts-controls-section">
        <div className="job-alerts-search-bar">
          <Search className="job-alerts-search-icon" />
          <input
            type="text"
            placeholder="Search job alerts..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="job-alerts-search-input"
          />
        </div>
        <div className="job-alerts-filter-sort-group">
          <div className="job-alerts-filter-group">
            <label htmlFor="status-filter" className="job-alerts-label">Status:</label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="job-alerts-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="job-alerts-filter-group">
            <label htmlFor="frequency-filter" className="job-alerts-label">Frequency:</label>
            <select
              id="frequency-filter"
              value={filters.frequency}
              onChange={(e) => handleFilterChange('frequency', e.target.value)}
              className="job-alerts-select"
            >
              <option value="all">All Frequencies</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="job-alerts-view-toggle">
            <button
              className={`job-alerts-view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List className="job-alerts-view-icon" />
            </button>
            <button
              className={`job-alerts-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid3X3 className="job-alerts-view-icon" />
            </button>
          </div>
          <button className="job-alerts-create-alert-btn" onClick={handleCreateAlert}>
            <Plus className="job-alerts-create-icon" />
            Create Alert
          </button>
        </div>
      </div>

      {/* Alerts Display */}
      {filteredAlerts.length === 0 ? (
        <div className="job-alerts-no-alerts">
          <div className="job-alerts-no-alerts-icon">🔔</div>
          <h3>No job alerts found</h3>
          <p>Create your first job alert to get notified about new opportunities.</p>
          <button className="job-alerts-create-first-alert-btn" onClick={handleCreateAlert}>
            <Plus className="job-alerts-create-icon" />
            Create Your First Alert
          </button>
        </div>
      ) : viewMode === 'list' ? (
        <div className="job-alerts-table-container">
          <table className="job-alerts-table">
            <thead>
              <tr>
                <th className="job-alerts-th job-alerts-th-alert-name">Alert Name</th>
                <th className="job-alerts-th job-alerts-th-keywords">Keywords</th>
                <th className="job-alerts-th job-alerts-th-location">Location</th>
                <th className="job-alerts-th job-alerts-th-salary">Salary Range</th>
                <th className="job-alerts-th job-alerts-th-frequency">Frequency</th>
                <th className="job-alerts-th job-alerts-th-status">Status</th>
                <th className="job-alerts-th job-alerts-th-matches">Matches</th>
                <th className="job-alerts-th job-alerts-th-action">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((alert) => (
                <tr key={alert.id} className="job-alerts-tr">
                  <td className="job-alerts-td job-alerts-td-alert-name">
                    <div className="job-alerts-alert-info">
                      <h4 className="job-alerts-alert-title-text">{alert.name}</h4>
                      <p className="job-alerts-alert-type">{alert.jobType} • {alert.experience}</p>
                    </div>
                  </td>
                  <td className="job-alerts-td job-alerts-td-keywords">
                    <div className="job-alerts-keywords-list">
                      {alert.keywords.slice(0, 2).map((keyword, index) => (
                        <span key={index} className="job-alerts-keyword-tag">{keyword}</span>
                      ))}
                      {alert.keywords.length > 2 && (
                        <span className="job-alerts-keyword-more">+{alert.keywords.length - 2} more</span>
                      )}
                    </div>
                  </td>
                  <td className="job-alerts-td job-alerts-td-location">
                    <div className="job-alerts-location-info">
                      <MapPin className="job-alerts-location-icon" />
                      <span>{alert.location}</span>
                    </div>
                  </td>
                  <td className="job-alerts-td job-alerts-td-salary">
                    <div className="job-alerts-salary-info">
                      <DollarSign className="job-alerts-salary-icon" />
                      <span>${alert.salaryMin.toLocaleString()} - ${alert.salaryMax.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="job-alerts-td job-alerts-td-frequency">
                    <div className="job-alerts-frequency-info">
                      {getFrequencyIcon(alert.frequency)}
                      <span className="job-alerts-frequency-text" style={{ color: getFrequencyColor(alert.frequency) }}>
                        {alert.frequency.charAt(0).toUpperCase() + alert.frequency.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="job-alerts-td job-alerts-td-status">
                    <div className={`job-alerts-status-badge ${alert.isActive ? 'active' : 'inactive'}`}>
                      <div className={`job-alerts-status-indicator ${alert.isActive ? 'active' : 'inactive'}`}></div>
                      <span className="job-alerts-status-text">{alert.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </td>
                  <td className="job-alerts-td job-alerts-td-matches">
                    <div className="job-alerts-matches-info">
                      <span className="job-alerts-total-matches">{alert.totalMatches}</span>
                      {alert.newMatches > 0 && (
                        <span className="job-alerts-new-matches">+{alert.newMatches} new</span>
                      )}
                    </div>
                  </td>
                  <td className="job-alerts-td job-alerts-td-action">
                    <div className="job-alerts-action">
                      <button
                        className="job-alerts-action-btn job-alerts-edit"
                        onClick={() => handleEditAlert(alert)}
                        title="Edit Alert"
                      >
                        <Edit className="job-alerts-action-icon" />
                      </button>
                      <button
                        className="job-alerts-action-btn job-alerts-delete"
                        onClick={() => handleDeleteAlert(alert.id)}
                        title="Delete Alert"
                      >
                        <Trash2 className="job-alerts-action-icon" />
                      </button>
                      <button
                        className={`job-alerts-toggle-btn ${alert.isActive ? 'deactivate' : 'activate'}`}
                        onClick={() => handleToggleAlert(alert.id)}
                        title={alert.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {alert.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="job-alerts-grid-view">
          {filteredAlerts.map((alert) => (
            <div key={alert.id} className="job-alerts-alert-card">
              <div className="job-alerts-card-header">
                <h4 className="job-alerts-card-title">{alert.name}</h4>
                <p className="job-alerts-card-type">{alert.jobType} • {alert.experience}</p>
              </div>
              <div className="job-alerts-card-body">
                <div className="job-alerts-card-keywords">
                  <h5>Keywords:</h5>
                  <div className="job-alerts-keywords-list">
                    {alert.keywords.map((keyword, index) => (
                      <span key={index} className="job-alerts-keyword-tag">{keyword}</span>
                    ))}
                  </div>
                </div>
                <div className="job-alerts-card-details">
                  <div className="job-alerts-detail-row">
                    <MapPin className="job-alerts-detail-icon" />
                    <span>{alert.location}</span>
                  </div>
                  <div className="job-alerts-detail-row">
                    <DollarSign className="job-alerts-detail-icon" />
                    <span>${alert.salaryMin.toLocaleString()} - ${alert.salaryMax.toLocaleString()}</span>
                  </div>
                  <div className="job-alerts-detail-row">
                    {getFrequencyIcon(alert.frequency)}
                    <span className="job-alerts-frequency-text" style={{ color: getFrequencyColor(alert.frequency) }}>
                      {alert.frequency.charAt(0).toUpperCase() + alert.frequency.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="job-alerts-card-stats">
                  <div className="job-alerts-stat-item">
                    <span className="job-alerts-stat-label">Total Matches:</span>
                    <span className="job-alerts-stat-value">{alert.totalMatches}</span>
                  </div>
                  <div className="job-alerts-stat-item">
                    <span className="job-alerts-stat-label">New Matches:</span>
                    <span className="job-alerts-stat-value new">{alert.newMatches}</span>
                  </div>
                </div>
              </div>
              <div className="job-alerts-card-footer">
                <div className={`job-alerts-status-badge ${alert.isActive ? 'active' : 'inactive'}`}>
                  <div className={`job-alerts-status-indicator ${alert.isActive ? 'active' : 'inactive'}`}></div>
                  <span className="job-alerts-status-text">{alert.isActive ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="job-alerts-card-actions">
                  <button
                    className="job-alerts-action-btn job-alerts-edit"
                    onClick={() => handleEditAlert(alert)}
                    title="Edit Alert"
                  >
                    <Edit className="job-alerts-action-icon" />
                  </button>
                  <button
                    className="job-alerts-action-btn job-alerts-delete"
                    onClick={() => handleDeleteAlert(alert.id)}
                    title="Delete Alert"
                  >
                    <Trash2 className="job-alerts-action-icon" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="job-alerts-alert-modal"
          onClick={() => setShowCreateModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="job-alerts-alert-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="job-alerts-modal-header">
              <h3>{editingAlert ? 'Edit Job Alert' : 'Create Job Alert'}</h3>
              <button className="job-alerts-close-btn" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            
            <div className="job-alerts-modal-body">
              <div className="job-alerts-form-group">
                <label>Alert Name</label>
                <input
                  type="text"
                  value={newAlert.name || ''}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Frontend Developer Jobs"
                  className="job-alerts-form-input"
                />
              </div>

              <div className="job-alerts-form-group">
                <label>Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={newAlert.keywords?.join(', ') || ''}
                  onChange={(e) => handleKeywordChange(e.target.value)}
                  placeholder="e.g. React, JavaScript, Frontend"
                  className="job-alerts-form-input"
                />
              </div>

              <div className="job-alerts-form-row">
                <div className="job-alerts-form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={newAlert.location || ''}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g. San Francisco, CA"
                    className="job-alerts-form-input"
                  />
                </div>
                <div className="job-alerts-form-group">
                  <label>Job Type</label>
                  <select
                    value={newAlert.jobType || 'Full-time'}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, jobType: e.target.value }))}
                    className="job-alerts-form-select"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="job-alerts-form-row">
                <div className="job-alerts-form-group">
                  <label>Min Salary ($)</label>
                  <input
                    type="number"
                    value={newAlert.salaryMin || ''}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, salaryMin: parseInt(e.target.value) || 0 }))}
                    placeholder="50000"
                    className="job-alerts-form-input"
                  />
                </div>
                <div className="job-alerts-form-group">
                  <label>Max Salary ($)</label>
                  <input
                    type="number"
                    value={newAlert.salaryMax || ''}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, salaryMax: parseInt(e.target.value) || 0 }))}
                    placeholder="100000"
                    className="job-alerts-form-input"
                  />
                </div>
              </div>

              <div className="job-alerts-form-row">
                <div className="job-alerts-form-group">
                  <label>Experience Level</label>
                  <select
                    value={newAlert.experience || ''}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, experience: e.target.value }))}
                    className="job-alerts-form-select"
                  >
                    <option value="">Select Experience</option>
                    <option value="0-1 years">0-1 years</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                </div>
                <div className="job-alerts-form-group">
                  <label>Frequency</label>
                  <select
                    value={newAlert.frequency || 'daily'}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, frequency: e.target.value as 'daily' | 'weekly' | 'monthly' }))}
                    className="job-alerts-form-select"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div className="job-alerts-form-group">
                <label className="job-alerts-checkbox-label">
                  <input
                    type="checkbox"
                    checked={newAlert.isActive || false}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="job-alerts-checkbox-input"
                  />
                  <span className="job-alerts-checkbox-text">Activate this alert immediately</span>
                </label>
              </div>
            </div>

            <div className="job-alerts-modal-footer">
              <button className="job-alerts-btn-secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
              <button className="job-alerts-btn-primary" onClick={handleSaveAlert}>
                {editingAlert ? 'Update Alert' : 'Create Alert'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default JobAlerts;