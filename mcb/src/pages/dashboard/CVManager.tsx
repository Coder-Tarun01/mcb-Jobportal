import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Download, Eye, Edit, Trash2, Plus, CheckCircle, AlertCircle, Calendar, File, Grid3X3, List, RefreshCw } from 'lucide-react';
import './CVManager.css';

interface CVFile {
  id: number;
  name: string;
  type: 'resume' | 'cover-letter' | 'portfolio' | 'certificate';
  size: number;
  uploadDate: string;
  isPrimary: boolean;
  isPublic: boolean;
  downloadCount: number;
  lastViewed: string;
  status: 'active' | 'archived' | 'draft';
}

const initialCVFiles: CVFile[] = [
  {
    id: 1,
    name: 'John_Doe_Resume_2024.pdf',
    type: 'resume',
    size: 245760, // 240 KB
    uploadDate: '2024-01-15',
    isPrimary: true,
    isPublic: true,
    downloadCount: 12,
    lastViewed: '2024-01-20',
    status: 'active'
  },
  {
    id: 2,
    name: 'Frontend_Developer_Cover_Letter.docx',
    type: 'cover-letter',
    size: 51200, // 50 KB
    uploadDate: '2024-01-12',
    isPrimary: false,
    isPublic: false,
    downloadCount: 3,
    lastViewed: '2024-01-18',
    status: 'active'
  },
  {
    id: 3,
    name: 'Portfolio_Projects_2024.pdf',
    type: 'portfolio',
    size: 1048576, // 1 MB
    uploadDate: '2024-01-10',
    isPrimary: false,
    isPublic: true,
    downloadCount: 8,
    lastViewed: '2024-01-19',
    status: 'active'
  },
  {
    id: 4,
    name: 'AWS_Certification.pdf',
    type: 'certificate',
    size: 307200, // 300 KB
    uploadDate: '2024-01-08',
    isPrimary: false,
    isPublic: true,
    downloadCount: 1,
    lastViewed: '2024-01-15',
    status: 'active'
  },
  {
    id: 5,
    name: 'Old_Resume_2023.pdf',
    type: 'resume',
    size: 198656, // 194 KB
    uploadDate: '2023-12-20',
    isPrimary: false,
    isPublic: false,
    downloadCount: 0,
    lastViewed: '2023-12-25',
    status: 'archived'
  }
];

const CVManager: React.FC = () => {
  const [cvFiles, setCvFiles] = useState<CVFile[]>(initialCVFiles);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    status: 'all'
  });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleFileAction = (id: number, action: 'view' | 'download' | 'edit' | 'delete' | 'setPrimary' | 'togglePublic') => {
    switch (action) {
      case 'view':
        console.log('Viewing file:', id);
        break;
      case 'download':
        console.log('Downloading file:', id);
        break;
      case 'edit':
        console.log('Editing file:', id);
        break;
      case 'delete':
        setCvFiles(prev => prev.filter(file => file.id !== id));
        break;
      case 'setPrimary':
        setCvFiles(prev => prev.map(file => ({
          ...file,
          isPrimary: file.id === id
        })));
        break;
      case 'togglePublic':
        setCvFiles(prev => prev.map(file => 
          file.id === id ? { ...file, isPublic: !file.isPublic } : file
        ));
        break;
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      const newFile: CVFile = {
        id: Date.now(),
        name: file.name,
        type: 'resume', // Default type
        size: file.size,
        uploadDate: new Date().toISOString().split('T')[0],
        isPrimary: false,
        isPublic: false,
        downloadCount: 0,
        lastViewed: new Date().toISOString().split('T')[0],
        status: 'active'
      };
      
      setCvFiles(prev => [...prev, newFile]);
      setUploading(false);
      setShowUploadModal(false);
    }, 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'resume': return <FileText className="file-type-icon" />;
      case 'cover-letter': return <FileText className="file-type-icon" />;
      case 'portfolio': return <File className="file-type-icon" />;
      case 'certificate': return <CheckCircle className="file-type-icon" />;
      default: return <File className="file-type-icon" />;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'resume': return '#3b82f6';
      case 'cover-letter': return '#10b981';
      case 'portfolio': return '#8b5cf6';
      case 'certificate': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'archived': return '#6b7280';
      case 'draft': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const filteredFiles = cvFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesType = filters.type === 'all' || file.type === filters.type;
    const matchesStatus = filters.status === 'all' || file.status === filters.status;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="cv-manager-container"
    >
      {/* Header Section */}
      <div className="cv-manager-header-section">
        <div className="cv-manager-header-content">
          <div className="cv-manager-title-section">
            <h1 className="cv-manager-main-title">CV Manager</h1>
            <p className="cv-manager-main-subtitle">Manage your documents and files</p>
          </div>
          <div className="cv-manager-stats">
            <div className="cv-manager-stat-card">
              <FileText className="cv-manager-stat-icon" />
              <div className="cv-manager-stat-content">
                <span className="cv-manager-stat-number">{cvFiles.length}</span>
                <span className="cv-manager-stat-label">Total Files</span>
              </div>
            </div>
            <div className="cv-manager-stat-card">
              <CheckCircle className="cv-manager-stat-icon" />
              <div className="cv-manager-stat-content">
                <span className="cv-manager-stat-number">{cvFiles.filter(f => f.isPrimary).length}</span>
                <span className="cv-manager-stat-label">Primary</span>
              </div>
            </div>
            <div className="cv-manager-stat-card">
              <Eye className="cv-manager-stat-icon" />
              <div className="cv-manager-stat-content">
                <span className="cv-manager-stat-number">{cvFiles.filter(f => f.isPublic).length}</span>
                <span className="cv-manager-stat-label">Public</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="cv-manager-controls-section">
        <div className="cv-manager-controls-left">
          <div className="cv-manager-search-group">
            <input
              type="text"
              placeholder="Search files..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="cv-manager-search-input"
            />
          </div>
          <div className="cv-manager-filter-group">
            <select 
              value={filters.type} 
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="cv-manager-filter-select"
            >
              <option value="all">All Types</option>
              <option value="resume">Resume</option>
              <option value="cover-letter">Cover Letter</option>
              <option value="portfolio">Portfolio</option>
              <option value="certificate">Certificate</option>
            </select>
          </div>
          <div className="cv-manager-filter-group">
            <select 
              value={filters.status} 
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="cv-manager-filter-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
        <div className="cv-manager-controls-right">
          <div className="cv-manager-view-toggle">
            <button 
              className={`cv-manager-view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List className="cv-manager-view-icon" />
            </button>
            <button 
              className={`cv-manager-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid3X3 className="cv-manager-view-icon" />
            </button>
          </div>
          <button className="cv-manager-refresh-btn" title="Refresh">
            <RefreshCw className="cv-manager-refresh-icon" />
          </button>
          <button className="cv-manager-upload-btn" onClick={() => setShowUploadModal(true)}>
            <Upload className="cv-manager-upload-icon" />
            Upload File
          </button>
        </div>
      </div>

      {/* Files Display */}
      {viewMode === 'list' ? (
        <div className="cv-manager-table-container">
          <div className="cv-manager-files-table">
            <div className="cv-manager-table-header">
              <div className="cv-manager-header-cell">File Name</div>
              <div className="cv-manager-header-cell">Type</div>
              <div className="cv-manager-header-cell">Size</div>
              <div className="cv-manager-header-cell">Date</div>
              <div className="cv-manager-header-cell">Status</div>
              <div className="cv-manager-header-cell">Actions</div>
            </div>
          {filteredFiles.length > 0 ? (
            filteredFiles.map((file) => (
              <motion.div
                key={file.id}
                className="cv-manager-table-row"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className="cv-manager-table-cell">
                  <div className="cv-manager-file-info">
                    <div className="cv-manager-file-icon" style={{ color: getFileTypeColor(file.type) }}>
                      {getFileTypeIcon(file.type)}
                    </div>
                    <div className="cv-manager-file-details">
                      <div className="cv-manager-file-name-text">{file.name}</div>
                      {file.isPrimary && (
                        <span className="cv-manager-primary-badge">Primary</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="cv-manager-table-cell">
                  <span className="cv-manager-file-type-badge" style={{ backgroundColor: getFileTypeColor(file.type) }}>
                    {file.type.charAt(0).toUpperCase() + file.type.slice(1).replace('-', ' ')}
                  </span>
                </div>
                <div className="cv-manager-table-cell">
                  <span className="cv-manager-file-size">{formatFileSize(file.size)}</span>
                </div>
                <div className="cv-manager-table-cell">
                  <span className="cv-manager-upload-date">{new Date(file.uploadDate).toLocaleDateString()}</span>
                </div>
                <div className="cv-manager-table-cell">
                  <div className="cv-manager-status-group">
                    <span className="cv-manager-status-badge" style={{ backgroundColor: getStatusColor(file.status) }}>
                      {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                    </span>
                    <span className={`cv-manager-visibility-badge ${file.isPublic ? 'public' : 'private'}`}>
                      {file.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
                <div className="cv-manager-table-cell">
                  <div className="cv-manager-action">
                    <div className="cv-manager-action-buttons">
                      <button 
                        className="cv-manager-action-btn cv-manager-view" 
                        onClick={() => handleFileAction(file.id, 'view')}
                        title="View File"
                      >
                        <Eye className="cv-manager-action-icon" />
                      </button>
                      <button 
                        className="cv-manager-action-btn cv-manager-download" 
                        onClick={() => handleFileAction(file.id, 'download')}
                        title="Download File"
                      >
                        <Download className="cv-manager-action-icon" />
                      </button>
                      <button 
                        className="cv-manager-action-btn cv-manager-edit" 
                        onClick={() => handleFileAction(file.id, 'edit')}
                        title="Edit File"
                      >
                        <Edit className="cv-manager-action-icon" />
                      </button>
                      <button 
                        className="cv-manager-action-btn cv-manager-delete" 
                        onClick={() => handleFileAction(file.id, 'delete')}
                        title="Delete File"
                      >
                        <Trash2 className="cv-manager-action-icon" />
                      </button>
                    </div>
                    <div className="cv-manager-control-buttons">
                      <button 
                        className={`cv-manager-control-btn ${file.isPrimary ? 'active' : ''}`}
                        onClick={() => handleFileAction(file.id, 'setPrimary')}
                        disabled={file.isPrimary}
                        title={file.isPrimary ? 'Primary File' : 'Set as Primary'}
                      >
                        {file.isPrimary ? 'Primary' : 'Set Primary'}
                      </button>
                      <button 
                        className={`cv-manager-control-btn ${file.isPublic ? 'active' : ''}`}
                        onClick={() => handleFileAction(file.id, 'togglePublic')}
                        title={file.isPublic ? 'Make Private' : 'Make Public'}
                      >
                        {file.isPublic ? 'Public' : 'Private'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="cv-manager-no-files">
              <div className="cv-manager-no-files-icon">📁</div>
              <h3>No files found</h3>
              <p>Upload your first file to get started with CV management.</p>
              <button className="cv-manager-upload-first-btn" onClick={() => setShowUploadModal(true)}>
                <Upload className="cv-manager-upload-icon" />
                Upload Your First File
              </button>
            </div>
          )}
          </div>
        </div>
      ) : (
      <div className="cv-manager-files-grid">
        {filteredFiles.length > 0 ? (
          filteredFiles.map((file) => (
            <motion.div
              key={file.id}
              className={`cv-manager-file-card ${file.isPrimary ? 'primary' : ''} ${file.status}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="cv-manager-file-header">
                <div className="cv-manager-file-info">
                  <div className="cv-manager-file-icon" style={{ color: getFileTypeColor(file.type) }}>
                    {getFileTypeIcon(file.type)}
                  </div>
                  <div className="cv-manager-file-details">
                    <h3 className="cv-manager-file-name">{file.name}</h3>
                    <p className="cv-manager-file-meta">
                      {file.type.charAt(0).toUpperCase() + file.type.slice(1).replace('-', ' ')} • {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <div className="cv-manager-file-badges">
                  {file.isPrimary && (
                    <span className="cv-manager-badge cv-manager-primary">Primary</span>
                  )}
                  <span className="cv-manager-badge cv-manager-status" style={{ backgroundColor: getStatusColor(file.status) }}>
                    {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="cv-manager-file-content">
                <div className="cv-manager-file-stats">
                  <div className="cv-manager-stat-item">
                    <span className="cv-manager-stat-label">Uploaded:</span>
                    <span className="cv-manager-stat-value">{new Date(file.uploadDate).toLocaleDateString()}</span>
                  </div>
                  <div className="cv-manager-stat-item">
                    <span className="cv-manager-stat-label">Downloads:</span>
                    <span className="cv-manager-stat-value">{file.downloadCount}</span>
                  </div>
                  <div className="cv-manager-stat-item">
                    <span className="cv-manager-stat-label">Last Viewed:</span>
                    <span className="cv-manager-stat-value">{new Date(file.lastViewed).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="cv-manager-file-actions">
                  <button 
                    className="cv-manager-action-btn cv-manager-view" 
                    onClick={() => handleFileAction(file.id, 'view')}
                    title="View File"
                  >
                    <Eye className="cv-manager-action-icon" />
                  </button>
                  <button 
                    className="cv-manager-action-btn cv-manager-download" 
                    onClick={() => handleFileAction(file.id, 'download')}
                    title="Download File"
                  >
                    <Download className="cv-manager-action-icon" />
                  </button>
                  <button 
                    className="cv-manager-action-btn cv-manager-edit" 
                    onClick={() => handleFileAction(file.id, 'edit')}
                    title="Edit File"
                  >
                    <Edit className="cv-manager-action-icon" />
                  </button>
                  <button 
                    className="cv-manager-action-btn cv-manager-delete" 
                    onClick={() => handleFileAction(file.id, 'delete')}
                    title="Delete File"
                  >
                    <Trash2 className="cv-manager-action-icon" />
                  </button>
                </div>
              </div>

              <div className="cv-manager-file-footer">
                <div className="cv-manager-file-controls">
                  <button 
                    className={`cv-manager-control-btn ${file.isPrimary ? 'active' : ''}`}
                    onClick={() => handleFileAction(file.id, 'setPrimary')}
                    disabled={file.isPrimary}
                  >
                    {file.isPrimary ? 'Primary' : 'Set Primary'}
                  </button>
                  <button 
                    className={`cv-manager-control-btn ${file.isPublic ? 'active' : ''}`}
                    onClick={() => handleFileAction(file.id, 'togglePublic')}
                  >
                    {file.isPublic ? 'Public' : 'Private'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="cv-manager-no-files">
            <div className="cv-manager-no-files-icon">📁</div>
            <h3>No files found</h3>
            <p>Upload your first file to get started with CV management.</p>
            <button className="cv-manager-upload-first-btn" onClick={() => setShowUploadModal(true)}>
              <Upload className="cv-manager-upload-icon" />
              Upload Your First File
            </button>
          </div>
        )}
      </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="cv-manager-upload-modal"
          onClick={() => setShowUploadModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="cv-manager-upload-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cv-manager-modal-header">
              <h3>Upload New File</h3>
              <button className="cv-manager-close-btn" onClick={() => setShowUploadModal(false)}>×</button>
            </div>
            
            <div className="cv-manager-modal-body">
              <div 
                className={`cv-manager-upload-area ${dragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {uploading ? (
                  <div className="cv-manager-upload-progress">
                    <div className="cv-manager-progress-spinner"></div>
                    <p>Uploading file...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="cv-manager-upload-icon-large" />
                    <h4>Drag & Drop your file here</h4>
                    <p>or click to browse</p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                      className="cv-manager-file-input"
                    />
                  </>
                )}
              </div>
              
              <div className="cv-manager-upload-info">
                <h4>Supported file types:</h4>
                <ul>
                  <li>PDF files (.pdf)</li>
                  <li>Word documents (.doc, .docx)</li>
                  <li>Text files (.txt)</li>
                </ul>
                <p className="cv-manager-file-size-limit">Maximum file size: 10 MB</p>
              </div>
            </div>

            <div className="cv-manager-modal-footer">
              <button className="cv-manager-btn-secondary" onClick={() => setShowUploadModal(false)}>
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CVManager;
