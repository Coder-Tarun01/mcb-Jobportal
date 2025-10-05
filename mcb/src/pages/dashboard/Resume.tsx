import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  FileText, 
  Edit,
  Plus,
  CheckCircle,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  Target,
  UserCircle,
  Upload,
  Save,
  X,
  Settings,
  FolderOpen,
  MapPin,
  Phone,
  Mail,
  Camera
} from 'lucide-react';
import './Resume.css';

const Resume: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  
  // Get the current section from URL
  const getCurrentSection = () => {
    const path = location.pathname;
    if (path === '/dashboard/resume') return 'headline';
    if (path.includes('/skills')) return 'skills';
    if (path.includes('/employment')) return 'employment';
    if (path.includes('/education')) return 'education';
    if (path.includes('/it-skills')) return 'it-skills';
    if (path.includes('/projects')) return 'projects';
    if (path.includes('/summary')) return 'summary';
    if (path.includes('/accomplishments')) return 'accomplishments';
    if (path.includes('/career')) return 'career';
    if (path.includes('/personal')) return 'personal';
    if (path.includes('/attach')) return 'attach';
    return 'headline';
  };
  
  const currentSection = getCurrentSection();

  // Function to render specific section content
  const renderSectionContent = () => {
    switch (currentSection) {
      case 'headline':
        return renderResumeHeadline();
      case 'skills':
        return renderKeySkills();
      case 'employment':
        return renderEmployment();
      case 'education':
        return renderEducation();
      case 'it-skills':
        return renderITSkills();
      case 'projects':
        return renderProjects();
      case 'summary':
        return renderProfileSummary();
      case 'accomplishments':
        return renderAccomplishments();
      case 'career':
        return renderDesiredCareerProfile();
      case 'personal':
        return renderPersonalDetails();
      case 'attach':
        return renderAttachResume();
      default:
        return renderMainResume();
    }
  };

  const [resumeData] = useState({
    resumeHeadline: "Job board currently living in USA",
    keySkills: ["React", "JavaScript", "TypeScript", "Node.js", "Python", "SQL"],
    employment: {
      position: "Senior PHP Developer",
      company: "Various agencies",
      duration: "2020 - Present",
      availability: "Available immediately",
      role: "Freelance Senior PHP Developer at various agencies"
    },
    education: [
      { location: "University of California", level: "Bachelor's Degree", year: "2018" }
    ],
    itSkills: [
      { skill: "PHP", version: "8.0", lastUsed: "2024", experience: "5 years" },
      { skill: "JavaScript", version: "ES6+", lastUsed: "2024", experience: "4 years" },
      { skill: "React", version: "18", lastUsed: "2024", experience: "3 years" }
    ],
    projects: [
      {
        name: "E-commerce Platform",
        company: "TechCorp",
        duration: "2023",
        description: "Built a full-stack e-commerce platform using React and Node.js"
      }
    ],
    desiredCareer: {
      industry: "Technology",
      functionalArea: "Software Development",
      role: "Senior Developer",
      jobType: "Full-time",
      employmentType: "Permanent",
      availabilityToJoin: "Immediately",
      expectedSalary: "$80,000 - $100,000"
    },
    personalDetails: {
      dateOfBirth: "1995-01-15",
      permanentAddress: "123 Main St, Sacramento, CA",
      gender: "Male",
      areaPinCode: "95814",
      maritalStatus: "Single",
      hometown: "Sacramento",
      passportNumber: "N1234567",
      workPermit: "US Citizen",
      differentlyAbled: "No",
      languages: "English, Spanish"
    }
  });


  const handleSubsectionClick = (subsection: string) => {
    navigate(`/dashboard/resume/${subsection}`);
  };


  // Individual section render functions
  const renderResumeHeadline = () => (
    <div>
      <div className="mcb-resume-card">
        <div className="mcb-resume-card-title-section">
          <FileText className="mcb-resume-card-icon" />
          <div className="mcb-resume-card-title-content">
            <h3>Resume Headline</h3>
            <p>Create a compelling headline that summarizes your professional profile</p>
          </div>
          <div className="mcb-resume-card-actions">
            <button className="mcb-resume-edit-btn mcb-resume-edit-btn-primary">
              <Edit className="mcb-resume-edit-icon" />
              Edit
            </button>
          </div>
        </div>
        <div className="mcb-resume-card-content">
          <div className="mcb-resume-form-group">
            <label>Resume Headline</label>
            <input 
              type="text" 
              value={resumeData.resumeHeadline}
              placeholder="Enter your professional headline"
              className="mcb-resume-form-input"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderKeySkills = () => (
    <div>
      <div className="mcb-resume-card">
        <div className="mcb-resume-card-title-section">
          <Code className="mcb-resume-card-icon" />
          <div className="mcb-resume-card-title-content">
            <h3>Key Skills</h3>
            <p>Add your technical and professional skills</p>
          </div>
          <div className="mcb-resume-card-actions">
            <button className="mcb-resume-edit-btn mcb-resume-edit-btn-primary">
              <Edit className="mcb-resume-edit-icon" />
              Edit
            </button>
            <button className="mcb-resume-edit-btn mcb-resume-edit-btn-secondary">
              <Plus className="mcb-resume-edit-icon" />
              Add
            </button>
          </div>
        </div>
        <div className="mcb-resume-card-content">
          <div className="mcb-resume-skills-container">
            {resumeData.keySkills.map((skill, index) => (
              <div key={index} className="mcb-resume-skill-tag">
                <span>{skill}</span>
                <button className="mcb-resume-skill-remove">
                  <X className="mcb-resume-remove-icon" />
                </button>
              </div>
            ))}
            <button className="mcb-resume-add-skill-btn">
              <Plus className="mcb-resume-add-icon" />
              Add Skill
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmployment = () => (
    <div>
      <div className="mcb-resume-card">
        <div className="mcb-resume-card-title-section">
          <Briefcase className="mcb-resume-card-icon" />
          <div className="mcb-resume-card-title-content">
            <h3>Employment</h3>
            <p>Add your work experience and employment history</p>
          </div>
          <div className="mcb-resume-card-actions">
            <button className="mcb-resume-edit-btn mcb-resume-edit-btn-primary">
              <Edit className="mcb-resume-edit-icon" />
              Edit
            </button>
            <button className="mcb-resume-edit-btn mcb-resume-edit-btn-secondary">
              <Plus className="mcb-resume-edit-icon" />
              Add
            </button>
          </div>
        </div>
        <div className="mcb-resume-card-content">
          <div className="mcb-resume-employment-item">
            <div className="mcb-resume-employment-header">
              <h4 className="mcb-resume-position-title">{resumeData.employment.position}</h4>
              <div className="mcb-resume-employment-actions">
                <button className="mcb-resume-action-btn-small">
                  <Edit className="mcb-resume-action-icon" />
                </button>
                <button className="mcb-resume-action-btn-small">
                  <X className="mcb-resume-action-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-employment-details">
              <div className="mcb-resume-detail-row">
                <span className="mcb-resume-detail-label">Company:</span>
                <span className="mcb-resume-detail-value">{resumeData.employment.company}</span>
              </div>
              <div className="mcb-resume-detail-row">
                <span className="mcb-resume-detail-label">Duration:</span>
                <span className="mcb-resume-detail-value">{resumeData.employment.duration}</span>
              </div>
              <div className="mcb-resume-detail-row">
                <span className="mcb-resume-detail-label">Availability:</span>
                <span className="mcb-resume-detail-value">{resumeData.employment.availability}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEducation = () => (
    <div>
      <div className="mcb-resume-card">
        <div className="mcb-resume-card-title-section">
          <GraduationCap className="mcb-resume-card-icon" />
          <div className="mcb-resume-card-title-content">
            <h3>Education</h3>
            <p>Add your educational background and qualifications</p>
          </div>
          <div className="mcb-resume-card-actions">
            <button className="mcb-resume-edit-btn mcb-resume-edit-btn-primary">
              <Edit className="mcb-resume-edit-icon" />
              Edit
            </button>
            <button className="mcb-resume-edit-btn mcb-resume-edit-btn-secondary">
              <Plus className="mcb-resume-edit-icon" />
              Add
            </button>
          </div>
        </div>
        <div className="mcb-resume-card-content">
          {resumeData.education.map((edu, index) => (
            <div key={index} className="mcb-resume-education-item">
              <div className="mcb-resume-education-header">
                <h4 className="mcb-resume-education-degree">{edu.level}</h4>
                <div className="mcb-resume-education-actions">
                  <button className="mcb-resume-action-btn-small">
                    <Edit className="mcb-resume-action-icon" />
                  </button>
                  <button className="mcb-resume-action-btn-small">
                    <X className="mcb-resume-action-icon" />
                  </button>
                </div>
              </div>
              <div className="mcb-resume-education-details">
                <span className="mcb-resume-education-institution">{edu.location}</span>
                <span className="mcb-resume-education-year">{edu.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderITSkills = () => (
    <div>
      <div className="mcb-resume-card">
        <div className="mcb-resume-card-title-section">
          <Settings className="mcb-resume-card-icon" />
          <div className="mcb-resume-card-title-content">
            <h3>IT Skills</h3>
            <p>Add your technical skills with versions and experience</p>
          </div>
          <div className="mcb-resume-card-actions">
            <button className="mcb-resume-edit-btn mcb-resume-edit-btn-primary">
              <Edit className="mcb-resume-edit-icon" />
              Edit
            </button>
            <button className="mcb-resume-edit-btn mcb-resume-edit-btn-secondary">
              <Plus className="mcb-resume-edit-icon" />
              Add
            </button>
          </div>
        </div>
        <div className="mcb-resume-card-content">
          <div className="mcb-resume-skills-table-container">
            <table className="mcb-resume-skills-table">
              <thead>
                <tr>
                  <th>Skills</th>
                  <th>Version</th>
                  <th>Last Used</th>
                  <th>Experience</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {resumeData.itSkills.map((skill, index) => (
                  <tr key={index}>
                    <td>
                      <span className="mcb-resume-skill-text">{skill.skill}</span>
                    </td>
                    <td>
                      <span className="mcb-resume-version-badge">{skill.version}</span>
                    </td>
                    <td>{skill.lastUsed}</td>
                    <td>
                      <span className="mcb-resume-experience-badge">{skill.experience}</span>
                    </td>
                    <td>
                      <div className="mcb-resume-action-buttons">
                        <button className="mcb-resume-action-btn-small">
                          <Edit className="mcb-resume-action-icon" />
                        </button>
                        <button className="mcb-resume-action-btn-small">
                          <X className="mcb-resume-action-icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div>
      <div className="mcb-resume-card">
        <div className="mcb-resume-card-title-section">
          <FolderOpen className="mcb-resume-card-icon" />
          <div className="mcb-resume-card-title-content">
            <h3>Projects</h3>
            <p>Add your portfolio projects and work samples</p>
          </div>
          <div className="mcb-resume-card-actions">
            <button className="mcb-resume-edit-btn mcb-resume-edit-btn-primary">
              <Edit className="mcb-resume-edit-icon" />
              Edit
            </button>
            <button className="mcb-resume-edit-btn mcb-resume-edit-btn-secondary">
              <Plus className="mcb-resume-edit-icon" />
              Add
            </button>
          </div>
        </div>
        <div className="mcb-resume-card-content">
          {resumeData.projects.map((project, index) => (
            <div key={index} className="mcb-resume-project-item">
              <div className="mcb-resume-project-header">
                <h4 className="mcb-resume-project-name">{project.name}</h4>
                <div className="mcb-resume-project-actions">
                  <button className="mcb-resume-action-btn-small">
                    <Edit className="mcb-resume-action-icon" />
                  </button>
                  <button className="mcb-resume-action-btn-small">
                    <X className="mcb-resume-action-icon" />
                  </button>
                </div>
              </div>
              <div className="mcb-resume-project-details">
                <span className="mcb-resume-project-company">{project.company}</span>
                <span className="mcb-resume-project-duration">{project.duration}</span>
                <p className="mcb-resume-project-description">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfileSummary = () => (
    <div>
      <div className="mcb-resume-card">
        <div className="mcb-resume-card-title-section">
          <User className="mcb-resume-card-icon" />
          <div className="mcb-resume-card-title-content">
            <h3>Profile Summary</h3>
            <p>Write a compelling summary of your professional background</p>
          </div>
          <div className="mcb-resume-card-actions">
            <button className="mcb-resume-edit-btn mcb-resume-edit-btn-primary">
              <Edit className="mcb-resume-edit-icon" />
              Edit
            </button>
          </div>
        </div>
        <div className="mcb-resume-card-content">
          <div className="mcb-resume-form-group">
            <label>Professional Summary</label>
            <textarea 
              className="mcb-resume-profile-summary-textarea"
              placeholder="Mention the highlights of your career and education, what your professional interests are, and what kind of a career you are looking for. Write a meaningful summary of more than 50 characters."
              rows={6}
            />
            <div className="mcb-resume-character-count">0 / 500 characters</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccomplishments = () => (
    <div>
      <div className="mcb-resume-card">
        <div className="mcb-resume-card-title-section">
          <Award className="mcb-resume-card-icon" />
          <div className="mcb-resume-card-title-content">
            <h3>Accomplishments</h3>
            <p>Add your achievements, certifications, and accomplishments</p>
          </div>
          <div className="mcb-resume-card-actions">
            <button className="mcb-resume-edit-btn mcb-resume-edit-btn-primary">
              <Edit className="mcb-resume-edit-icon" />
              Edit
            </button>
          </div>
        </div>
        <div className="mcb-resume-card-content">
          <div className="mcb-resume-accomplishments-list">
            <div className="mcb-resume-accomplishment-item">
              <h4>Online Profile</h4>
              <p>Add link to Online profiles (e.g. LinkedIn, Facebook etc.)</p>
              <div className="mcb-resume-input-group">
                <input type="text" placeholder="Enter profile URL" />
                <button className="mcb-resume-add-accomplishment-btn">
                  <Plus className="mcb-resume-add-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-accomplishment-item">
              <h4>Work Sample</h4>
              <p>Add link to your work samples or portfolio</p>
              <div className="mcb-resume-input-group">
                <input type="text" placeholder="Enter work sample URL" />
                <button className="mcb-resume-add-accomplishment-btn">
                  <Plus className="mcb-resume-add-icon" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDesiredCareerProfile = () => (
    <div>
      <div className="mcb-resume-card">
        <div className="mcb-resume-card-title-section">
          <Target className="mcb-resume-card-icon" />
          <div className="mcb-resume-card-title-content">
            <h3>Desired Career Profile</h3>
            <p>Define your career goals and job preferences</p>
          </div>
          <div className="mcb-resume-card-actions">
            <button className="mcb-resume-edit-btn mcb-resume-edit-btn-primary">
              <Edit className="mcb-resume-edit-icon" />
              Edit
            </button>
          </div>
        </div>
        <div className="mcb-resume-card-content">
          <div className="mcb-resume-career-profile-grid">
            <div className="mcb-resume-career-item">
              <label>Industry</label>
              <div className="mcb-resume-career-input-group">
                <input 
                  type="text" 
                  className="mcb-resume-career-input"
                  value={resumeData.desiredCareer.industry}
                  placeholder="Enter desired industry"
                />
                <button className="mcb-resume-career-edit-btn">
                  <Edit className="mcb-resume-edit-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-career-item">
              <label>Functional Area</label>
              <div className="mcb-resume-career-input-group">
                <input 
                  type="text" 
                  className="mcb-resume-career-input"
                  value={resumeData.desiredCareer.functionalArea}
                  placeholder="Enter functional area"
                />
                <button className="mcb-resume-career-edit-btn">
                  <Edit className="mcb-resume-edit-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-career-item">
              <label>Role</label>
              <div className="mcb-resume-career-input-group">
                <input 
                  type="text" 
                  className="mcb-resume-career-input"
                  value={resumeData.desiredCareer.role}
                  placeholder="Enter desired role"
                />
                <button className="mcb-resume-career-edit-btn">
                  <Edit className="mcb-resume-edit-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-career-item">
              <label>Job Type</label>
              <div className="mcb-resume-career-input-group">
                <input 
                  type="text" 
                  className="mcb-resume-career-input"
                  value={resumeData.desiredCareer.jobType}
                  placeholder="Enter job type"
                />
                <button className="mcb-resume-career-edit-btn">
                  <Edit className="mcb-resume-edit-icon" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPersonalDetails = () => (
    <div>
      <div className="mcb-resume-card">
        <div className="mcb-resume-card-title-section">
          <UserCircle className="mcb-resume-card-icon" />
          <div className="mcb-resume-card-title-content">
            <h3>Personal Details</h3>
            <p>Add your personal information and contact details</p>
          </div>
          <div className="mcb-resume-card-actions">
            <button className="mcb-resume-edit-btn mcb-resume-edit-btn-primary">
              <Edit className="mcb-resume-edit-icon" />
              Edit
            </button>
          </div>
        </div>
        <div className="mcb-resume-card-content">
          <div className="mcb-resume-personal-details-grid">
            <div className="mcb-resume-personal-item">
              <label>Date of Birth</label>
              <div className="mcb-resume-personal-input-group">
                <input 
                  type="date" 
                  className="mcb-resume-personal-input"
                  value={resumeData.personalDetails.dateOfBirth}
                />
                <button className="mcb-resume-personal-edit-btn">
                  <Edit className="mcb-resume-edit-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-personal-item">
              <label>Gender</label>
              <div className="mcb-resume-personal-input-group">
                <input 
                  type="text" 
                  className="mcb-resume-personal-input"
                  value={resumeData.personalDetails.gender}
                />
                <button className="mcb-resume-personal-edit-btn">
                  <Edit className="mcb-resume-edit-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-personal-item">
              <label>Marital Status</label>
              <div className="mcb-resume-personal-input-group">
                <input 
                  type="text" 
                  className="mcb-resume-personal-input"
                  value={resumeData.personalDetails.maritalStatus}
                />
                <button className="mcb-resume-personal-edit-btn">
                  <Edit className="mcb-resume-edit-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-personal-item">
              <label>Hometown</label>
              <div className="mcb-resume-personal-input-group">
                <input 
                  type="text" 
                  className="mcb-resume-personal-input"
                  value={resumeData.personalDetails.hometown}
                />
                <button className="mcb-resume-personal-edit-btn">
                  <Edit className="mcb-resume-edit-icon" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAttachResume = () => (
    <div>
      <div className="mcb-resume-card">
        <div className="mcb-resume-card-title-section">
          <Upload className="mcb-resume-card-icon" />
          <div className="mcb-resume-card-title-content">
            <h3>Attach Resume</h3>
            <p>Upload your resume document for better visibility</p>
          </div>
          <div className="mcb-resume-card-actions">
            <button className="mcb-resume-edit-btn mcb-resume-edit-btn-primary">
              <Edit className="mcb-resume-edit-icon" />
              Edit
            </button>
          </div>
        </div>
        <div className="mcb-resume-card-content">
          <div className="mcb-resume-upload-section">
            <div className="mcb-resume-upload-area">
              <div className="mcb-resume-upload-content">
                <Upload className="mcb-resume-upload-icon" />
                <h4>Upload Resume File</h4>
                <p>File size is 3MB</p>
                <p className="mcb-resume-upload-formats">Supported formats: PDF, DOC, DOCX</p>
                <button className="mcb-resume-upload-btn">
                  <Upload className="mcb-resume-upload-icon" />
                  Choose File
                </button>
              </div>
            </div>
            <p className="mcb-resume-alternative-link">
              If you do not have a resume document, you may write your brief professional profile here
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMainResume = () => (
    <div>
      {/* Main Profile Card */}
      <div className="mcb-resume-main-profile-card">
        <div className="mcb-resume-profile-section">
          <div className="mcb-resume-profile-image-section">
            <div className="mcb-resume-profile-image">
              <img src="/api/placeholder/120/120" alt="Profile" />
              <button className="mcb-resume-camera-overlay">
                <Camera className="mcb-resume-camera-icon" />
              </button>
            </div>
          </div>
          
          <div className="mcb-resume-profile-details">
            <div className="mcb-resume-profile-name-section">
              <h2>John Doe</h2>
              <button className="mcb-resume-edit-name-btn">
                <Edit className="mcb-resume-edit-icon" />
              </button>
            </div>
            <p className="mcb-resume-profile-role">Freelance Senior PHP Developer at various agencies</p>
            
            <div className="mcb-resume-profile-info">
              <div className="mcb-resume-info-item">
                <MapPin className="mcb-resume-info-icon" />
                <span>Sacramento, California</span>
              </div>
              <div className="mcb-resume-info-item">
                <Briefcase className="mcb-resume-info-icon" />
                <span>Fresher</span>
              </div>
              <div className="mcb-resume-info-item">
                <Phone className="mcb-resume-info-icon" />
                <span>+1 123 456 7890</span>
              </div>
              <div className="mcb-resume-info-item">
                <Mail className="mcb-resume-info-icon" />
                <span>info@example.com</span>
              </div>
            </div>
            
            <div className="mcb-resume-profile-strength">
              <div className="mcb-resume-strength-header">
                <span>Profile Strength (Average)</span>
                <span className="mcb-resume-strength-percentage">70%</span>
              </div>
              <div className="mcb-resume-strength-bar">
                <div className="mcb-resume-strength-progress" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pending Action Card */}
        <div className="mcb-resume-pending-action-card">
          <h3>Pending Action</h3>
          <div className="mcb-resume-action-list">
            <div className="mcb-resume-action-item mcb-resume-action-item-completed">
              <CheckCircle className="mcb-resume-check-icon" />
              <span>Verify Mobile Number</span>
            </div>
            <div className="mcb-resume-action-item mcb-resume-action-item-completed">
              <CheckCircle className="mcb-resume-check-icon" />
              <span>Add Preferred Location</span>
            </div>
            <div className="mcb-resume-action-item mcb-resume-action-item-completed">
              <CheckCircle className="mcb-resume-check-icon" />
              <span>Add Resume</span>
            </div>
          </div>
        </div>
      </div>


      {/* Resume Headline */}
      <div className="mcb-resume-card">
        <div className="mcb-resume-card-header">
          <div className="mcb-resume-card-title-section">
            <div className="mcb-resume-card-icon">
              <User className="mcb-resume-card-icon-svg" />
            </div>
            <div className="mcb-resume-card-title-content">
              <h3>Resume Headline</h3>
              <p className="mcb-resume-card-subtitle">Your professional summary in one line</p>
            </div>
          </div>
          <div className="mcb-resume-card-actions">
            <button className="mcb-resume-edit-btn mcb-resume-edit-btn-primary">
              <Edit className="mcb-resume-edit-icon" />
              Edit
            </button>
          </div>
        </div>
        <div className="mcb-resume-card-content">
          <div className="mcb-resume-content-display">
            <p className="mcb-resume-headline-text">{resumeData.resumeHeadline}</p>
          </div>
        </div>
      </div>

      {/* Key Skills */}
      <div className="mcb-resume-card">
        <div className="mcb-resume-card-header">
          <div className="mcb-resume-card-title-section">
            <div className="mcb-resume-card-icon">
              <Code className="mcb-resume-card-icon-svg" />
            </div>
            <div className="mcb-resume-card-title-content">
              <h3>Key Skills</h3>
              <p className="mcb-resume-card-subtitle">Your core technical and professional skills</p>
            </div>
          </div>
          <div className="mcb-resume-card-actions">
            <button className="mcb-resume-edit-btn mcb-resume-edit-btn-primary" onClick={() => handleSubsectionClick('skills')}>
              <Edit className="mcb-resume-edit-icon" />
              Edit
            </button>
          </div>
        </div>
        <div className="mcb-resume-card-content">
          <div className="mcb-resume-skills-container">
            {resumeData.keySkills.map((skill, index) => (
              <span key={index} className="mcb-resume-skill-tag">
                {skill}
                <button className="mcb-resume-skill-remove">
                  <X className="mcb-resume-remove-icon" />
                </button>
              </span>
            ))}
            <button className="mcb-resume-add-skill-btn">
              <Plus className="mcb-resume-add-icon" />
              Add Skill
            </button>
          </div>
        </div>
      </div>

      {/* Employment */}
      <div className="mcb-resume-card">
        <div className="mcb-resume-card-header">
          <div className="mcb-resume-card-title-section">
            <div className="mcb-resume-card-icon">
              <Briefcase className="mcb-resume-card-icon-svg" />
            </div>
            <div className="mcb-resume-card-title-content">
              <h3>Employment History</h3>
              <p className="mcb-resume-card-subtitle">Your work experience and career progression</p>
            </div>
          </div>
          <div className="mcb-resume-card-actions">
            <button className="mcb-resume-edit-btn resume-edit-btn-primary" onClick={() => handleSubsectionClick('employment')}>
              <Edit className="mcb-resume-edit-icon" />
              Edit
            </button>
            <button className="mcb-resume-edit-btn resume-edit-btn-secondary">
              <Plus className="mcb-resume-edit-icon" />
              Add
            </button>
          </div>
        </div>
        <div className="mcb-resume-card-content">
          <div className="mcb-resume-employment-item">
            <div className="mcb-resume-employment-header">
              <h4 className="mcb-resume-position-title">{resumeData.employment.position}</h4>
              <div className="mcb-resume-employment-actions">
                <button className="mcb-resume-action-btn-small resume-action-btn-small-edit">
                  <Edit className="mcb-resume-action-icon" />
                </button>
                <button className="mcb-resume-action-btn-small resume-action-btn-small-delete">
                  <X className="mcb-resume-action-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-employment-details">
              <div className="mcb-resume-detail-row">
                <span className="mcb-resume-detail-label">Company:</span>
                <span className="mcb-resume-detail-value resume-detail-value-company">{resumeData.employment.company}</span>
              </div>
              <div className="mcb-resume-detail-row">
                <span className="mcb-resume-detail-label">Duration:</span>
                <span className="mcb-resume-detail-value">{resumeData.employment.duration}</span>
              </div>
              <div className="mcb-resume-detail-row">
                <span className="mcb-resume-detail-label">Availability:</span>
                <span className="mcb-resume-detail-value resume-detail-value-availability">{resumeData.employment.availability}</span>
              </div>
              <div className="mcb-resume-detail-row resume-detail-row-full-width">
                <span className="mcb-resume-detail-label">Role Description:</span>
                <span className="mcb-resume-detail-value">{resumeData.employment.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Education */}
      <div className="mcb-resume-card">
        <div className="mcb-resume-card-header">
          <div className="mcb-resume-card-title-section">
            <div className="mcb-resume-card-icon">
              <GraduationCap className="mcb-resume-card-icon-svg" />
            </div>
            <div className="mcb-resume-card-title-content">
              <h3>Education</h3>
              <p className="mcb-resume-card-subtitle">Your academic qualifications and achievements</p>
            </div>
          </div>
          <div className="mcb-resume-card-actions">
            <button className="mcb-resume-edit-btn resume-edit-btn-primary" onClick={() => handleSubsectionClick('education')}>
              <Edit className="mcb-resume-edit-icon" />
              Edit
            </button>
            <button className="mcb-resume-edit-btn resume-edit-btn-secondary">
              <Plus className="mcb-resume-edit-icon" />
              Add
            </button>
          </div>
        </div>
        <div className="mcb-resume-card-content">
          <div className="mcb-resume-education-list">
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mcb-resume-education-item">
                <div className="mcb-resume-education-header">
                  <div className="mcb-resume-education-info">
                    <h4 className="mcb-resume-education-degree">{edu.level}</h4>
                    <p className="mcb-resume-education-institution">{edu.location}</p>
                    <p className="mcb-resume-education-year">{edu.year}</p>
                  </div>
                  <div className="mcb-resume-education-actions">
                    <button className="mcb-resume-action-btn-small resume-action-btn-small-edit">
                      <Edit className="mcb-resume-action-icon" />
                    </button>
                    <button className="mcb-resume-action-btn-small resume-action-btn-small-delete">
                      <X className="mcb-resume-action-icon" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mcb-resume-add-education">
            <button className="mcb-resume-add-btn">
              <Plus className="mcb-resume-add-icon" />
              Add Doctorate/PhD
            </button>
            <button className="mcb-resume-add-btn">
              <Plus className="mcb-resume-add-icon" />
              Add Masters/Post-Graduation
            </button>
            <button className="mcb-resume-add-btn">
              <Plus className="mcb-resume-add-icon" />
              Add Graduation/Diploma
            </button>
          </div>
        </div>
      </div>

      {/* IT Skills */}
      <div className="mcb-resume-card">
        <div className="mcb-resume-card-header">
          <div className="mcb-resume-card-title-section">
            <div className="mcb-resume-card-icon">
              <Code className="mcb-resume-card-icon-svg" />
            </div>
            <div className="mcb-resume-card-title-content">
              <h3>IT Skills</h3>
              <p className="mcb-resume-card-subtitle">Technical skills with proficiency levels</p>
            </div>
          </div>
          <div className="mcb-resume-card-actions">
            <button className="mcb-resume-edit-btn resume-edit-btn-primary">
              <Edit className="mcb-resume-edit-icon" />
              Edit
            </button>
            <button className="mcb-resume-edit-btn resume-edit-btn-secondary">
              <Plus className="mcb-resume-edit-icon" />
              Add
            </button>
          </div>
        </div>
        <div className="mcb-resume-card-content">
          <div className="mcb-resume-skills-table-container">
            <div className="mcb-resume-skills-table">
              <table>
                <thead>
                  <tr>
                    <th>Skills</th>
                    <th>Version</th>
                    <th>Last Used</th>
                    <th>Experience</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resumeData.itSkills.map((skill, index) => (
                    <tr key={index} className="mcb-resume-skill-row">
                      <td className="mcb-resume-skill-name">
                        <span className="mcb-resume-skill-text">{skill.skill}</span>
                      </td>
                      <td className="mcb-resume-skill-version">
                        <span className="mcb-resume-version-badge">{skill.version}</span>
                      </td>
                      <td className="mcb-resume-skill-last-used">{skill.lastUsed}</td>
                      <td className="mcb-resume-skill-experience">
                        <span className="mcb-resume-experience-badge">{skill.experience}</span>
                      </td>
                      <td className="mcb-resume-skill-actions">
                        <div className="mcb-resume-action-buttons">
                          <button className="mcb-resume-action-btn-small resume-action-btn-small-edit">
                            <Edit className="mcb-resume-action-icon" />
                          </button>
                          <button className="mcb-resume-action-btn-small resume-action-btn-small-delete">
                            <X className="mcb-resume-action-icon" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="mcb-resume-card">
        <div className="mcb-resume-card-header">
          <div className="mcb-resume-card-title-section">
            <div className="mcb-resume-card-icon">
              <Award className="mcb-resume-card-icon-svg" />
            </div>
            <div className="mcb-resume-card-title-content">
              <h3>Projects</h3>
              <p className="mcb-resume-card-subtitle">Your notable projects and achievements</p>
            </div>
          </div>
          <div className="mcb-resume-card-actions">
            <button className="mcb-resume-edit-btn resume-edit-btn-primary">
              <Edit className="mcb-resume-edit-icon" />
              Edit
            </button>
            <button className="mcb-resume-edit-btn resume-edit-btn-secondary">
              <Plus className="mcb-resume-edit-icon" />
              Add
            </button>
          </div>
        </div>
        <div className="mcb-resume-card-content">
          <div className="mcb-resume-projects-list">
            {resumeData.projects.map((project, index) => (
              <div key={index} className="mcb-resume-project-item">
                <div className="mcb-resume-project-header">
                  <div className="mcb-resume-project-info">
                    <h4 className="mcb-resume-project-name">{project.name}</h4>
                    <div className="mcb-resume-project-meta">
                      <span className="mcb-resume-project-company">{project.company}</span>
                      <span className="mcb-resume-project-duration">{project.duration}</span>
                    </div>
                  </div>
                  <div className="mcb-resume-project-actions">
                    <button className="mcb-resume-action-btn-small resume-action-btn-small-edit">
                      <Edit className="mcb-resume-action-icon" />
                    </button>
                    <button className="mcb-resume-action-btn-small resume-action-btn-small-delete">
                      <X className="mcb-resume-action-icon" />
                    </button>
                  </div>
                </div>
                <p className="mcb-resume-project-description">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Summary */}
      <div className="mcb-resume-card">
        <div className="mcb-resume-card-header">
          <div className="mcb-resume-card-title-section">
            <div className="mcb-resume-card-icon">
              <UserCircle className="mcb-resume-card-icon-svg" />
            </div>
            <div className="mcb-resume-card-title-content">
              <h3>Profile Summary</h3>
              <p className="mcb-resume-card-subtitle">A compelling overview of your professional background</p>
            </div>
          </div>
          <div className="mcb-resume-card-actions">
            <button className="mcb-resume-edit-btn resume-edit-btn-primary">
              <Edit className="mcb-resume-edit-icon" />
              Edit
            </button>
          </div>
        </div>
        <div className="mcb-resume-card-content">
          <div className="mcb-resume-summary-container">
            <textarea
              placeholder="Your Profile Summary should mention the highlights of your career and education, what your professional interests are, and what kind of a career you are looking for. Write a meaningful summary of more than 50 characters."
              className="mcb-resume-profile-summary-textarea"
              rows={4}
            />
            <div className="mcb-resume-character-count">
              <span className="mcb-resume-count-text">0 / 500 characters</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accomplishments */}
      <div className="mcb-resume-card">
        <div className="mcb-resume-card-header">
          <div className="mcb-resume-card-title-section">
            <div className="mcb-resume-card-icon">
              <Award className="mcb-resume-card-icon-svg" />
            </div>
            <div className="mcb-resume-card-title-content">
              <h3>Accomplishments</h3>
              <p className="mcb-resume-card-subtitle">Your professional achievements and recognitions</p>
            </div>
          </div>
          <div className="mcb-resume-card-actions">
            <button className="mcb-resume-edit-btn resume-edit-btn-primary">
              <Edit className="mcb-resume-edit-icon" />
              Edit
            </button>
          </div>
        </div>
        <div className="mcb-resume-card-content">
          <div className="mcb-resume-accomplishments-grid">
            <div className="mcb-resume-accomplishment-item">
              <label className="mcb-resume-accomplishment-label">Online Profile</label>
              <div className="mcb-resume-input-group">
                <input type="text" placeholder="Add Online Profile" className="mcb-resume-accomplishment-input" />
                <button className="mcb-resume-add-accomplishment-btn">
                  <Plus className="mcb-resume-add-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-accomplishment-item">
              <label className="mcb-resume-accomplishment-label">Work Sample</label>
              <div className="mcb-resume-input-group">
                <input type="text" placeholder="Add Work Sample" className="mcb-resume-accomplishment-input" />
                <button className="mcb-resume-add-accomplishment-btn">
                  <Plus className="mcb-resume-add-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-accomplishment-item">
              <label className="mcb-resume-accomplishment-label">Research Publication</label>
              <div className="mcb-resume-input-group">
                <input type="text" placeholder="Add Research" className="mcb-resume-accomplishment-input" />
                <button className="mcb-resume-add-accomplishment-btn">
                  <Plus className="mcb-resume-add-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-accomplishment-item">
              <label className="mcb-resume-accomplishment-label">Presentation</label>
              <div className="mcb-resume-input-group">
                <input type="text" placeholder="Add Presentation" className="mcb-resume-accomplishment-input" />
                <button className="mcb-resume-add-accomplishment-btn">
                  <Plus className="mcb-resume-add-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-accomplishment-item">
              <label className="mcb-resume-accomplishment-label">Patent</label>
              <div className="mcb-resume-input-group">
                <input type="text" placeholder="Add Patent" className="mcb-resume-accomplishment-input" />
                <button className="mcb-resume-add-accomplishment-btn">
                  <Plus className="mcb-resume-add-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-accomplishment-item">
              <label className="mcb-resume-accomplishment-label">Certification</label>
              <div className="mcb-resume-input-group">
                <input type="text" placeholder="Add Certification" className="mcb-resume-accomplishment-input" />
                <button className="mcb-resume-add-accomplishment-btn">
                  <Plus className="mcb-resume-add-icon" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desired Career Profile */}
      <div className="mcb-resume-card">
        <div className="mcb-resume-card-header">
          <div className="mcb-resume-card-title-section">
            <div className="mcb-resume-card-icon">
              <Target className="mcb-resume-card-icon-svg" />
            </div>
            <div className="mcb-resume-card-title-content">
              <h3>Desired Career Profile</h3>
              <p className="mcb-resume-card-subtitle">Your career preferences and job requirements</p>
            </div>
          </div>
          <div className="mcb-resume-card-actions">
            <button className="mcb-resume-edit-btn resume-edit-btn-primary">
              <Edit className="mcb-resume-edit-icon" />
              Edit
            </button>
          </div>
        </div>
        <div className="mcb-resume-card-content">
          <div className="mcb-resume-career-grid">
            <div className="mcb-resume-career-item">
              <label className="mcb-resume-career-label">Industry</label>
              <div className="mcb-resume-career-input-group">
                <input type="text" value={resumeData.desiredCareer.industry} readOnly className="mcb-resume-career-input" />
                <button className="mcb-resume-career-edit-btn">
                  <Edit className="mcb-resume-edit-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-career-item">
              <label className="mcb-resume-career-label">Functional Area</label>
              <div className="mcb-resume-career-input-group">
                <input type="text" value={resumeData.desiredCareer.functionalArea} readOnly className="mcb-resume-career-input" />
                <button className="mcb-resume-career-edit-btn">
                  <Edit className="mcb-resume-edit-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-career-item">
              <label className="mcb-resume-career-label">Role</label>
              <div className="mcb-resume-career-input-group">
                <input type="text" value={resumeData.desiredCareer.role} readOnly className="mcb-resume-career-input" />
                <button className="mcb-resume-career-edit-btn">
                  <Edit className="mcb-resume-edit-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-career-item">
              <label className="mcb-resume-career-label">Job Type</label>
              <div className="mcb-resume-career-input-group">
                <input type="text" value={resumeData.desiredCareer.jobType} readOnly className="mcb-resume-career-input" />
                <button className="mcb-resume-career-edit-btn">
                  <Edit className="mcb-resume-edit-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-career-item">
              <label className="mcb-resume-career-label">Employment Type</label>
              <div className="mcb-resume-career-input-group">
                <input type="text" value={resumeData.desiredCareer.employmentType} readOnly className="mcb-resume-career-input" />
                <button className="mcb-resume-career-edit-btn">
                  <Edit className="mcb-resume-edit-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-career-item">
              <label className="mcb-resume-career-label">Availability to Join</label>
              <div className="mcb-resume-career-input-group">
                <input type="text" value={resumeData.desiredCareer.availabilityToJoin} readOnly className="mcb-resume-career-input" />
                <button className="mcb-resume-career-edit-btn">
                  <Edit className="mcb-resume-edit-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-career-item">
              <label className="mcb-resume-career-label">Expected Salary</label>
              <div className="mcb-resume-career-input-group">
                <input type="text" value={resumeData.desiredCareer.expectedSalary} readOnly className="mcb-resume-career-input" />
                <button className="mcb-resume-career-edit-btn">
                  <Edit className="mcb-resume-edit-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-career-item">
              <label className="mcb-resume-career-label">Desired Shift</label>
              <div className="mcb-resume-career-input-group">
                <input type="text" placeholder="Add Desired Shift" className="mcb-resume-career-input" />
                <button className="mcb-resume-career-add-btn">
                  <Plus className="mcb-resume-add-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-career-item">
              <label className="mcb-resume-career-label">Desired Location</label>
              <div className="mcb-resume-career-input-group">
                <input type="text" placeholder="Add Desired Location" className="mcb-resume-career-input" />
                <button className="mcb-resume-career-add-btn">
                  <Plus className="mcb-resume-add-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-career-item">
              <label className="mcb-resume-career-label">Desired Industry</label>
              <div className="mcb-resume-career-input-group">
                <input type="text" placeholder="Add Desired Industry" className="mcb-resume-career-input" />
                <button className="mcb-resume-career-add-btn">
                  <Plus className="mcb-resume-add-icon" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Details */}
      <div className="mcb-resume-card">
        <div className="mcb-resume-card-header">
          <div className="mcb-resume-card-title-section">
            <div className="mcb-resume-card-icon">
              <UserCircle className="mcb-resume-card-icon-svg" />
            </div>
            <div className="mcb-resume-card-title-content">
              <h3>Personal Details</h3>
              <p className="mcb-resume-card-subtitle">Your personal information and contact details</p>
            </div>
          </div>
          <div className="mcb-resume-card-actions">
            <button className="mcb-resume-edit-btn resume-edit-btn-primary">
              <Edit className="mcb-resume-edit-icon" />
              Edit
            </button>
          </div>
        </div>
        <div className="mcb-resume-card-content">
          <div className="mcb-resume-personal-grid">
            <div className="mcb-resume-personal-item">
              <label className="mcb-resume-personal-label">Date of Birth</label>
              <div className="mcb-resume-personal-input-group">
                <input type="text" value={resumeData.personalDetails.dateOfBirth} readOnly className="mcb-resume-personal-input" />
                <button className="mcb-resume-personal-edit-btn">
                  <Edit className="mcb-resume-edit-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-personal-item">
              <label className="mcb-resume-personal-label">Permanent Address</label>
              <div className="mcb-resume-personal-input-group">
                <input type="text" value={resumeData.personalDetails.permanentAddress} readOnly className="mcb-resume-personal-input" />
                <button className="mcb-resume-personal-edit-btn">
                  <Edit className="mcb-resume-edit-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-personal-item">
              <label className="mcb-resume-personal-label">Gender</label>
              <div className="mcb-resume-personal-input-group">
                <input type="text" value={resumeData.personalDetails.gender} readOnly className="mcb-resume-personal-input" />
                <button className="mcb-resume-personal-edit-btn">
                  <Edit className="mcb-resume-edit-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-personal-item">
              <label className="mcb-resume-personal-label">Area Pin Code</label>
              <div className="mcb-resume-personal-input-group">
                <input type="text" value={resumeData.personalDetails.areaPinCode} readOnly className="mcb-resume-personal-input" />
                <button className="mcb-resume-personal-edit-btn">
                  <Edit className="mcb-resume-edit-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-personal-item">
              <label className="mcb-resume-personal-label">Marital Status</label>
              <div className="mcb-resume-personal-input-group">
                <input type="text" value={resumeData.personalDetails.maritalStatus} readOnly className="mcb-resume-personal-input" />
                <button className="mcb-resume-personal-edit-btn">
                  <Edit className="mcb-resume-edit-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-personal-item">
              <label className="mcb-resume-personal-label">Hometown</label>
              <div className="mcb-resume-personal-input-group">
                <input type="text" value={resumeData.personalDetails.hometown} readOnly className="mcb-resume-personal-input" />
                <button className="mcb-resume-personal-edit-btn">
                  <Edit className="mcb-resume-edit-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-personal-item">
              <label className="mcb-resume-personal-label">Passport Number</label>
              <div className="mcb-resume-personal-input-group">
                <input type="text" value={resumeData.personalDetails.passportNumber} readOnly className="mcb-resume-personal-input" />
                <button className="mcb-resume-personal-edit-btn">
                  <Edit className="mcb-resume-edit-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-personal-item">
              <label className="mcb-resume-personal-label">Work Permit</label>
              <div className="mcb-resume-personal-input-group">
                <input type="text" value={resumeData.personalDetails.workPermit} readOnly className="mcb-resume-personal-input" />
                <button className="mcb-resume-personal-edit-btn">
                  <Edit className="mcb-resume-edit-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-personal-item">
              <label className="mcb-resume-personal-label">Differently Abled</label>
              <div className="mcb-resume-personal-input-group">
                <input type="text" value={resumeData.personalDetails.differentlyAbled} readOnly className="mcb-resume-personal-input" />
                <button className="mcb-resume-personal-edit-btn">
                  <Edit className="mcb-resume-edit-icon" />
                </button>
              </div>
            </div>
            <div className="mcb-resume-personal-item">
              <label className="mcb-resume-personal-label">Languages</label>
              <div className="mcb-resume-personal-input-group">
                <input type="text" value={resumeData.personalDetails.languages} readOnly className="mcb-resume-personal-input" />
                <button className="mcb-resume-personal-edit-btn">
                  <Edit className="mcb-resume-edit-icon" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attach Resume */}
      <div className="mcb-resume-card">
        <div className="mcb-resume-card-header">
          <div className="mcb-resume-card-title-section">
            <div className="mcb-resume-card-icon">
              <Upload className="mcb-resume-card-icon-svg" />
            </div>
            <div className="mcb-resume-card-title-content">
              <h3>Attach Resume</h3>
              <p className="mcb-resume-card-subtitle">Upload your professional resume document</p>
            </div>
          </div>
          <div className="mcb-resume-card-actions">
            <button className="mcb-resume-edit-btn resume-edit-btn-primary">
              <Edit className="mcb-resume-edit-icon" />
              Edit
            </button>
          </div>
        </div>
        <div className="mcb-resume-card-content">
          <div className="mcb-resume-upload-section">
            <p className="mcb-resume-description">
              Your resume is the most important document in your job search. It's your first impression with employers, 
              so it needs to be perfect. Upload your resume in PDF, DOC, or DOCX format.
            </p>
            <div className="mcb-resume-upload">
              <div className="mcb-resume-upload-area">
                <Upload className="mcb-resume-upload-icon" />
                <div className="mcb-resume-upload-content">
                  <p className="mcb-resume-upload-title">Upload Resume</p>
                  <p className="mcb-resume-file-size">Maximum file size: 3 MB</p>
                  <p className="mcb-resume-file-formats">Supported formats: PDF, DOC, DOCX</p>
                </div>
                <button className="mcb-resume-upload-btn">
                  <Upload className="mcb-resume-btn-icon" />
                  Choose File
                </button>
              </div>
            </div>
                <div className="mcb-resume-alternative">
                  <p>Don't have a resume? <button className="mcb-resume-alternative-link" onClick={() => console.log('Navigate to profile builder')}>Write your brief professional profile here</button></p>
                </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mcb-resume-save-section">
        <div className="mcb-resume-save-container">
          <button className="mcb-resume-save-all-btn">
            <Save className="mcb-resume-save-icon" />
            Save All Changes
          </button>
          <p className="mcb-resume-save-note">All your resume information will be saved and updated</p>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {renderSectionContent()}
    </motion.div>
  );
};

export default Resume;

