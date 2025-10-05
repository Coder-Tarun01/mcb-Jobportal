import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  FileText, 
  Heart, 
  Briefcase, 
  Bell,
  Lock,
  LogOut,
  Camera,
  Code,
  GraduationCap,
  Settings,
  FolderOpen,
  Award,
  Target,
  UserCircle,
  Upload,
  CheckCircle,
  Edit
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usersAPI } from '../../services/api';
import ResumeSidebar from './ResumeSidebar';
import './DashboardLayout.css';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Load user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;
      
      setIsLoadingProfile(true);
      try {
        const userData = await usersAPI.fetchUserById(user.id);
        setUserProfile(userData);
      } catch (error) {
        console.error('Error loading user profile:', error);
        setUserProfile(null);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadUserProfile();
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  const handleNavigation = (path: string, action?: () => void) => {
    if (action) {
      action();
    } else if (path) {
      navigate(path);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Check if we're on a resume page
  const isResumePage = location.pathname.startsWith('/dashboard/resume');

  const mainSidebarItems = [
    { id: 'profile', label: 'Profile', icon: User, path: '/dashboard/profile' },
    { id: 'resume', label: 'My Resume', icon: FileText, path: '/dashboard/resume' },
    { id: 'saved', label: 'Saved Jobs', icon: Heart, path: '/dashboard/saved' },
    { id: 'applied', label: 'Applied Jobs', icon: Briefcase, path: '/dashboard/applied' },
    { id: 'alerts', label: 'Job Alerts', icon: Bell, path: '/dashboard/alerts' },
    { id: 'cv-manager', label: 'CV Manager', icon: FileText, path: '/dashboard/cv-manager' },
    { id: 'password', label: 'Change Password', icon: Lock, path: '/dashboard/password' },
    { id: 'logout', label: 'Log Out', icon: LogOut, action: handleLogout }
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const renderResumeSection = () => {
    const currentPath = location.pathname;
    
    // Resume Overview - show all sections
    if (currentPath === '/dashboard/resume') {
      return (
        <div className="resume-overview-container">
          {/* Resume Headline */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Resume Headline</h3>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
            <div className="text-gray-700">
              <p className="text-base">Job board currently living in USA</p>
            </div>
          </div>

          {/* Key Skills */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Key Skills</h3>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Javascript', 'CSS', 'HTML', 'Bootstrap', 'Web Designing', 'Photoshop'].map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors cursor-pointer">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Employment */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Employment</h3>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="text-base font-semibold text-gray-800">Junior Software Developer</h4>
                <p className="text-gray-600 font-medium">W3itexperts</p>
                <p className="text-gray-500 text-sm">Oct 2015 to Present (3 years 4 months)</p>
                <p className="text-green-600 text-sm font-medium">Available to join in 1 Months</p>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Education</h3>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-base font-semibold text-gray-800">London - 12th</p>
                <p className="text-gray-500 text-sm">2017</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-base font-semibold text-gray-800">London - 10th</p>
                <p className="text-gray-500 text-sm">2015</p>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-200 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                  Add Doctorate/PhD
                </button>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-200 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                  Add Masters/Post-Graduation
                </button>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-200 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                  Add Graduation/Diploma
                </button>
              </div>
            </div>
          </div>

          {/* IT Skills */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">IT Skills</h3>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                  <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Skills</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Version</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Last Used</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Experience</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {[
                    { skill: 'Bootstrap', version: '3', lastUsed: '2018', experience: '1 Year 5 Months' },
                    { skill: 'Bootstrap', version: '4', lastUsed: '2013', experience: '5 Year 5 Months' },
                    { skill: 'HTML', version: '5', lastUsed: '2016', experience: '2 Year 7 Months' },
                    { skill: 'CSS', version: '3', lastUsed: '2018', experience: '0 Year 5 Months' },
                    { skill: 'Photoshop', version: '6-bit', lastUsed: '2017', experience: '1 Year 0 Months' }
                  ].map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 text-gray-700">{item.skill}</td>
                      <td className="py-3 px-2 text-gray-600">{item.version}</td>
                      <td className="py-3 px-2 text-gray-600">{item.lastUsed}</td>
                      <td className="py-3 px-2 text-gray-600">{item.experience}</td>
                      <td className="py-3 px-2">
                        <button className="text-blue-600 hover:text-blue-800 p-1 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
            </div>
          </div>

          {/* Projects */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Projects</h3>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="text-base font-semibold text-gray-800">Job Board</h4>
                <p className="text-gray-600 font-medium">w3itexpert (Offsite)</p>
                <p className="text-gray-500 text-sm">Dec 2018 to Present (Full Time)</p>
                <p className="text-gray-600 text-sm italic">Job Board Template</p>
              </div>
            </div>
          </div>

          {/* Profile Summary */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Profile Summary</h3>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
            <div className="min-h-[120px] p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500 italic">
                Your Profile Summary should mention the highlights of your career and education, 
                what your professional Interests are, and what kind of a career you are looking for. 
                Write a meaningful summary of more than 50 characters.
              </p>
            </div>
          </div>

          {/* Accomplishments */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Accomplishments</h3>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Online Profile', desc: 'Add link to Online profiles (e.g. LinkedIn, Facebook etc.)' },
                { title: 'Work Sample', desc: 'Add link to your Projects (e.g. Github links etc.)' },
                { title: 'White Paper/Research Publication/Journal Entry', desc: 'Add links to your Online publications' },
                { title: 'Presentation', desc: 'Add links to your Online presentations (e.g. Slideshare presentation links etc.)' },
                { title: 'Patent', desc: 'Add details of Patents you have filed' },
                { title: 'Certification', desc: 'Add details of Certification you have filed' }
              ].map((item, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <h4 className="font-semibold text-gray-800 mb-2">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
              ))}
            </div>
          </div>

          {/* Desired Career Profile */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Desired Career Profile</h3>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Industry:</span>
                  <span className="text-gray-600">IT Software/Software Services</span>
                  </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Role:</span>
                  <span className="text-gray-600">Web Designer</span>
                  </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Employment Type:</span>
                  <span className="text-gray-600">Full Time</span>
                  </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Availability to Join:</span>
                  <span className="text-gray-600">1234y</span>
                  </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Desired Location:</span>
                  <span className="text-gray-600">Add Desired Location</span>
                  </div>
                </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Functional Area:</span>
                  <span className="text-gray-600">Design/Creative/User Experience</span>
                  </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Job Type:</span>
                  <span className="text-gray-600">permanent</span>
                  </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Desired Shift:</span>
                  <span className="text-gray-600">Add Desired Shift</span>
                  </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Expected Salary:</span>
                  <span className="text-gray-600">1 Lakhs</span>
                  </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Desired Industry:</span>
                  <span className="text-gray-600">Add Desired Industry</span>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Personal Details</h3>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Date of Birth:</span>
                  <span className="text-gray-600">31 July 1998</span>
                  </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Gender:</span>
                  <span className="text-gray-600">male</span>
                  </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Marital Status:</span>
                  <span className="text-gray-600">Single/unmarried</span>
                  </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Passport Number:</span>
                  <span className="text-gray-600">1234567890</span>
                  </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Differently Abled:</span>
                  <span className="text-gray-600">None</span>
                  </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Languages:</span>
                  <span className="text-gray-600">English</span>
                  </div>
                </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Permanent Address:</span>
                  <span className="text-gray-600">Add Permanent Address</span>
                  </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Area Pin Code:</span>
                  <span className="text-gray-600">302010</span>
                  </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Hometown:</span>
                  <span className="text-gray-600">Delhi</span>
                  </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Work permit of other country:</span>
                  <span className="text-gray-600">USA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Attach Resume */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Attach Resume</h3>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                Resume is the most important document recruiters look for. Recruiters generally do not look at profiles without resumes.
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Upload Resume File size is 3 MB</p>
                <p className="text-gray-500 text-sm mt-2">Drag and drop your resume here or click to browse</p>
                </div>
              <p className="text-gray-500 text-sm italic">
                If you do not have a resume document, you may write your brief professional profile here.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Individual sections
    switch (currentPath) {
      case '/dashboard/resume/headline':
        return (
          <div className="resume-section-container">
            <div className="section-header">
              <div className="section-title-group">
                <h2 className="section-title">Resume Headline</h2>
                <p className="section-description">Create a compelling headline that summarizes your professional identity</p>
            </div>
            </div>
            
            <div className="section-content">
              <div className="form-group">
                <label className="form-label">Your Professional Headline</label>
                <textarea 
                  className="form-textarea"
                  placeholder="e.g., Experienced Software Developer with 5+ years in full-stack development"
                  rows={4}
                  defaultValue="Job board currently living in USA"
                />
                <div className="form-help">
                  <span className="char-count">0/100 characters</span>
                  <span className="help-text">Keep it concise and impactful</span>
                </div>
              </div>
              
              <div className="section-actions">
                <button className="btn-secondary">Cancel</button>
                <button className="btn-primary">Save Headline</button>
              </div>
            </div>
          </div>
        );

      case '/dashboard/resume/skills':
        return (
          <div className="resume-section-container">
            <div className="section-header">
              <div className="section-title-group">
                <h2 className="section-title">Key Skills</h2>
                <p className="section-description">Add your core competencies and technical skills</p>
            </div>
            </div>
            
            <div className="section-content">
              <div className="form-group">
                <label className="form-label">Add Skills</label>
                <div className="skill-input-container">
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="Enter a skill and press Enter"
                  />
                  <button className="btn-add-skill">Add Skill</button>
                </div>
                <div className="form-help">
                  <span className="help-text">Press Enter or click Add Skill to add to your list</span>
                </div>
              </div>
              
              <div className="skills-display">
                <h4 className="skills-title">Your Skills</h4>
              <div className="skills-tags">
                  <span className="skill-tag">
                    Javascript
                    <button className="skill-remove">×</button>
                  </span>
                  <span className="skill-tag">
                    CSS
                    <button className="skill-remove">×</button>
                  </span>
                  <span className="skill-tag">
                    HTML
                    <button className="skill-remove">×</button>
                  </span>
                  <span className="skill-tag">
                    Bootstrap
                    <button className="skill-remove">×</button>
                  </span>
                  <span className="skill-tag">
                    Web Designing
                    <button className="skill-remove">×</button>
                  </span>
                  <span className="skill-tag">
                    Photoshop
                    <button className="skill-remove">×</button>
                  </span>
                </div>
              </div>
              
              <div className="section-actions">
                <button className="btn-secondary">Cancel</button>
                <button className="btn-primary">Save Skills</button>
              </div>
            </div>
          </div>
        );

      case '/dashboard/resume/employment':
        return (
          <div className="resume-section-container">
            <div className="section-header">
              <div className="section-title-group">
                <h2 className="section-title">Employment History</h2>
                <p className="section-description">Add your work experience in chronological order</p>
            </div>
              <button className="btn-add-experience">+ Add Experience</button>
            </div>
            
            <div className="section-content">
              <div className="experience-list">
                <div className="experience-item">
                  <div className="experience-header">
                    <h4 className="job-title">Junior Software Developer</h4>
                    <div className="experience-actions">
                      <button className="btn-edit">Edit</button>
                      <button className="btn-delete">Delete</button>
                    </div>
                  </div>
                  <div className="experience-details">
                    <div className="detail-row">
                      <span className="detail-label">Company:</span>
                      <span className="detail-value">W3itexperts</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Duration:</span>
                      <span className="detail-value">Oct 2015 to Present (3 years 4 months)</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Availability:</span>
                      <span className="detail-value available">Available to join in 1 Months</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Role:</span>
                      <span className="detail-value">Junior Software Developer</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="section-actions">
                <button className="btn-secondary">Cancel</button>
                <button className="btn-primary">Save Employment</button>
              </div>
            </div>
          </div>
        );

      case '/dashboard/resume/education':
        return (
          <div className="resume-section-container">
            <div className="section-header">
              <div className="section-title-group">
                <h2 className="section-title">Education</h2>
                <p className="section-description">Add your educational qualifications</p>
            </div>
              <button className="btn-add-education">+ Add Education</button>
            </div>
            
            <div className="section-content">
              <div className="education-list">
              <div className="education-item">
                  <div className="education-header">
                    <h4 className="degree-title">London - 12th</h4>
                    <div className="education-actions">
                      <button className="btn-edit">Edit</button>
                      <button className="btn-delete">Delete</button>
              </div>
                  </div>
                  <div className="education-details">
                    <div className="detail-row">
                      <span className="detail-label">Year:</span>
                      <span className="detail-value">2017</span>
                    </div>
                  </div>
                </div>
                
              <div className="education-item">
                  <div className="education-header">
                    <h4 className="degree-title">London - 10th</h4>
                    <div className="education-actions">
                      <button className="btn-edit">Edit</button>
                      <button className="btn-delete">Delete</button>
              </div>
                  </div>
                  <div className="education-details">
                    <div className="detail-row">
                      <span className="detail-label">Year:</span>
                      <span className="detail-value">2015</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="quick-add-section">
                <h4 className="quick-add-title">Quick Add</h4>
                <div className="quick-add-buttons">
                  <button className="btn-quick-add">Add Doctorate/PhD</button>
                  <button className="btn-quick-add">Add Masters/Post-Graduation</button>
                  <button className="btn-quick-add">Add Graduation/Diploma</button>
                </div>
              </div>
              
              <div className="section-actions">
                <button className="btn-secondary">Cancel</button>
                <button className="btn-primary">Save Education</button>
              </div>
            </div>
          </div>
        );

      case '/dashboard/resume/it-skills':
        return (
          <div className="resume-section-container">
            <div className="section-header">
              <div className="section-title-group">
                <h2 className="section-title">IT Skills</h2>
                <p className="section-description">Add your technical skills with proficiency levels</p>
            </div>
              <button className="btn-add-skill">+ Add IT Skill</button>
            </div>
            
            <div className="section-content">
              <div className="skills-table-container">
                <table className="skills-table">
                  <thead>
                    <tr>
                      <th>Skill</th>
                      <th>Version</th>
                      <th>Last Used</th>
                      <th>Experience</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="skill-name">Bootstrap</td>
                      <td className="skill-version">3</td>
                      <td className="skill-last-used">2018</td>
                      <td className="skill-experience">1 Year 5 Months</td>
                      <td className="skill-actions">
                        <button className="btn-edit-small">Edit</button>
                        <button className="btn-delete-small">Delete</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="skill-name">Bootstrap</td>
                      <td className="skill-version">4</td>
                      <td className="skill-last-used">2013</td>
                      <td className="skill-experience">5 Year 5 Months</td>
                      <td className="skill-actions">
                        <button className="btn-edit-small">Edit</button>
                        <button className="btn-delete-small">Delete</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="skill-name">HTML</td>
                      <td className="skill-version">5</td>
                      <td className="skill-last-used">2016</td>
                      <td className="skill-experience">2 Year 7 Months</td>
                      <td className="skill-actions">
                        <button className="btn-edit-small">Edit</button>
                        <button className="btn-delete-small">Delete</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="skill-name">CSS</td>
                      <td className="skill-version">3</td>
                      <td className="skill-last-used">2018</td>
                      <td className="skill-experience">0 Year 5 Months</td>
                      <td className="skill-actions">
                        <button className="btn-edit-small">Edit</button>
                        <button className="btn-delete-small">Delete</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="skill-name">Photoshop</td>
                      <td className="skill-version">6-bit</td>
                      <td className="skill-last-used">2017</td>
                      <td className="skill-experience">1 Year 0 Months</td>
                      <td className="skill-actions">
                        <button className="btn-edit-small">Edit</button>
                        <button className="btn-delete-small">Delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="section-actions">
                <button className="btn-secondary">Cancel</button>
                <button className="btn-primary">Save IT Skills</button>
              </div>
            </div>
          </div>
        );

      case '/dashboard/resume/projects':
        return (
          <div className="resume-section-container">
            <div className="section-header">
              <div className="section-title-group">
                <h2 className="section-title">Projects</h2>
                <p className="section-description">Showcase your work and achievements</p>
            </div>
              <button className="btn-add-project">+ Add Project</button>
            </div>
            
            <div className="section-content">
              <div className="projects-list">
              <div className="project-item">
                  <div className="project-header">
                    <h4 className="project-title">Job Board</h4>
                    <div className="project-actions">
                      <button className="btn-edit">Edit</button>
                      <button className="btn-delete">Delete</button>
                    </div>
                  </div>
                  <div className="project-details">
                    <div className="detail-row">
                      <span className="detail-label">Company:</span>
                      <span className="detail-value">w3itexpert (Offsite)</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Duration:</span>
                      <span className="detail-value">Dec 2018 to Present (Full Time)</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Description:</span>
                      <span className="detail-value">Job Board Template</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="section-actions">
                <button className="btn-secondary">Cancel</button>
                <button className="btn-primary">Save Projects</button>
              </div>
            </div>
          </div>
        );

      case '/dashboard/resume/summary':
        return (
          <div className="resume-section-container">
            <div className="section-header">
              <div className="section-title-group">
                <h2 className="section-title">Profile Summary</h2>
                <p className="section-description">Write a compelling summary of your professional background</p>
            </div>
            </div>
            
            <div className="section-content">
              <div className="form-group">
                <label className="form-label">Professional Summary</label>
                <textarea 
                  className="form-textarea large"
                  placeholder="Your Profile Summary should mention the highlights of your career and education, what your professional Interests are, and what kind of a career you are looking for. Write a meaningful summary of more than 50 characters."
                  rows={8}
                />
                <div className="form-help">
                  <span className="char-count">0/500 characters</span>
                  <span className="help-text">Minimum 50 characters recommended</span>
                </div>
              </div>
              
              <div className="summary-tips">
                <h4 className="tips-title">Writing Tips</h4>
                <ul className="tips-list">
                  <li>Highlight your key achievements and skills</li>
                  <li>Mention your career objectives</li>
                  <li>Keep it concise but impactful</li>
                  <li>Use action words and quantifiable results</li>
                </ul>
              </div>
              
              <div className="section-actions">
                <button className="btn-secondary">Cancel</button>
                <button className="btn-primary">Save Summary</button>
              </div>
            </div>
          </div>
        );

      case '/dashboard/resume/accomplishments':
        return (
          <div className="resume-section-container">
            <div className="section-header">
              <div className="section-title-group">
                <h2 className="section-title">Accomplishments</h2>
                <p className="section-description">Add your professional achievements and credentials</p>
            </div>
            </div>
            
            <div className="section-content">
              <div className="accomplishments-grid">
                <div className="accomplishment-card">
                  <div className="accomplishment-header">
                    <h4 className="accomplishment-title">Online Profile</h4>
                    <button className="btn-add-link">+ Add Link</button>
              </div>
                  <p className="accomplishment-description">Add link to Online profiles (e.g. LinkedIn, Facebook etc.)</p>
                  <div className="accomplishment-links">
                    <div className="link-item">
                      <span className="link-text">No links added yet</span>
                      <button className="btn-remove">×</button>
              </div>
              </div>
              </div>
                
                <div className="accomplishment-card">
                  <div className="accomplishment-header">
                    <h4 className="accomplishment-title">Work Sample</h4>
                    <button className="btn-add-link">+ Add Link</button>
              </div>
                  <p className="accomplishment-description">Add link to your Projects (e.g. Github links etc.)</p>
                  <div className="accomplishment-links">
                    <div className="link-item">
                      <span className="link-text">No links added yet</span>
                      <button className="btn-remove">×</button>
                    </div>
                  </div>
                </div>
                
                <div className="accomplishment-card">
                  <div className="accomplishment-header">
                    <h4 className="accomplishment-title">Publications</h4>
                    <button className="btn-add-link">+ Add Link</button>
                  </div>
                  <p className="accomplishment-description">Add links to your Online publications</p>
                  <div className="accomplishment-links">
                    <div className="link-item">
                      <span className="link-text">No links added yet</span>
                      <button className="btn-remove">×</button>
                    </div>
                  </div>
                </div>
                
                <div className="accomplishment-card">
                  <div className="accomplishment-header">
                    <h4 className="accomplishment-title">Presentations</h4>
                    <button className="btn-add-link">+ Add Link</button>
                  </div>
                  <p className="accomplishment-description">Add links to your Online presentations</p>
                  <div className="accomplishment-links">
                    <div className="link-item">
                      <span className="link-text">No links added yet</span>
                      <button className="btn-remove">×</button>
                    </div>
                  </div>
                </div>
                
                <div className="accomplishment-card">
                  <div className="accomplishment-header">
                    <h4 className="accomplishment-title">Patents</h4>
                    <button className="btn-add-link">+ Add Patent</button>
                  </div>
                  <p className="accomplishment-description">Add details of Patents you have filed</p>
                  <div className="accomplishment-links">
                    <div className="link-item">
                      <span className="link-text">No patents added yet</span>
                      <button className="btn-remove">×</button>
                    </div>
                  </div>
                </div>
                
                <div className="accomplishment-card">
                  <div className="accomplishment-header">
                    <h4 className="accomplishment-title">Certifications</h4>
                    <button className="btn-add-link">+ Add Certification</button>
                  </div>
                  <p className="accomplishment-description">Add details of Certifications you have filed</p>
                  <div className="accomplishment-links">
                    <div className="link-item">
                      <span className="link-text">No certifications added yet</span>
                      <button className="btn-remove">×</button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="section-actions">
                <button className="btn-secondary">Cancel</button>
                <button className="btn-primary">Save Accomplishments</button>
              </div>
            </div>
          </div>
        );

      case '/dashboard/resume/career':
        return (
          <div className="resume-section-container">
            <div className="section-header">
              <div className="section-title-group">
                <h2 className="section-title">Desired Career Profile</h2>
                <p className="section-description">Define your career preferences and expectations</p>
            </div>
            </div>
            
            <div className="section-content">
              <div className="career-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Industry</label>
                    <select className="form-select">
                      <option value="IT Software/Software Services">IT Software/Software Services</option>
                      <option value="Banking/Financial Services">Banking/Financial Services</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Functional Area</label>
                    <select className="form-select">
                      <option value="Design/Creative/User Experience">Design/Creative/User Experience</option>
                      <option value="Software Development">Software Development</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                    </select>
                  </div>
                  </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <input type="text" className="form-input" defaultValue="Web Designer" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Job Type</label>
                    <select className="form-select">
                      <option value="permanent">Permanent</option>
                      <option value="contract">Contract</option>
                      <option value="freelance">Freelance</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Employment Type</label>
                    <select className="form-select">
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Expected Salary</label>
                    <input type="text" className="form-input" defaultValue="1 Lakhs" />
                  </div>
                  </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Desired Location</label>
                    <input type="text" className="form-input" placeholder="Add Desired Location" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Availability to Join</label>
                    <input type="text" className="form-input" defaultValue="1234y" />
                  </div>
                </div>
              </div>
              
              <div className="section-actions">
                <button className="btn-secondary">Cancel</button>
                <button className="btn-primary">Save Career Profile</button>
              </div>
            </div>
          </div>
        );

      case '/dashboard/resume/personal':
        return (
          <div className="resume-section-container">
            <div className="section-header">
              <div className="section-title-group">
                <h2 className="section-title">Personal Details</h2>
                <p className="section-description">Add your personal information and contact details</p>
            </div>
            </div>
            
            <div className="section-content">
              <div className="personal-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input type="date" className="form-input" defaultValue="1998-07-31" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select className="form-select">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Marital Status</label>
                    <select className="form-select">
                      <option value="Single/unmarried">Single/Unmarried</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Languages</label>
                    <input type="text" className="form-input" defaultValue="English" />
                  </div>
                  </div>
                
                <div className="form-group">
                  <label className="form-label">Permanent Address</label>
                  <textarea className="form-textarea" placeholder="Add Permanent Address" rows={3}></textarea>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Area Pin Code</label>
                    <input type="text" className="form-input" defaultValue="302010" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hometown</label>
                    <input type="text" className="form-input" defaultValue="Delhi" />
                  </div>
                  </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Passport Number</label>
                    <input type="text" className="form-input" defaultValue="1234567890" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Work Permit Country</label>
                    <input type="text" className="form-input" defaultValue="USA" />
                </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Differently Abled</label>
                  <select className="form-select">
                    <option value="None">None</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>
              
              <div className="section-actions">
                <button className="btn-secondary">Cancel</button>
                <button className="btn-primary">Save Personal Details</button>
              </div>
            </div>
          </div>
        );

      case '/dashboard/resume/attach':
        return (
          <div className="resume-section-container">
            <div className="section-header">
              <div className="section-title-group">
                <h2 className="section-title">Attach Resume</h2>
                <p className="section-description">Upload your resume document or create a professional profile</p>
            </div>
            </div>
            
            <div className="section-content">
              <div className="upload-section">
                <div className="upload-info">
                  <p className="upload-description">
                Resume is the most important document recruiters look for. Recruiters generally do not look at profiles without resumes.
              </p>
                </div>
                
              <div className="upload-area">
                <div className="upload-content">
                  <Upload className="upload-icon" />
                    <h4 className="upload-title">Upload Resume</h4>
                    <p className="upload-subtitle">File size limit: 3 MB</p>
                    <p className="upload-hint">Drag and drop your resume here or click to browse</p>
                    <button className="btn-upload">Choose File</button>
                </div>
              </div>
                
                <div className="file-requirements">
                  <h4 className="requirements-title">Supported Formats</h4>
                  <div className="format-tags">
                    <span className="format-tag">PDF</span>
                    <span className="format-tag">DOC</span>
                    <span className="format-tag">DOCX</span>
                  </div>
                </div>
              </div>
              
              <div className="alternative-section">
                <div className="divider">
                  <span className="divider-text">OR</span>
                </div>
                
                <div className="profile-builder">
                  <h4 className="profile-title">Create Professional Profile</h4>
                  <p className="profile-description">
                If you do not have a resume document, you may write your brief professional profile here.
              </p>
                  <button className="btn-profile-builder">Start Building Profile</button>
                </div>
              </div>
              
              <div className="section-actions">
                <button className="btn-secondary">Cancel</button>
                <button className="btn-primary">Save Resume</button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="resume-section-card">
            <div className="section-header">
              <h3>Resume Overview</h3>
            </div>
            <div className="section-content">
              <p>Select a section from the sidebar to view and edit your resume details.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-layout">
        {/* Left Sidebar */}
        <AnimatePresence mode="wait">
          {isResumePage ? (
            <ResumeSidebar key="resume-sidebar" onBack={handleBackToDashboard} />
          ) : (
            <motion.div 
              key="main-sidebar"
              className="dashboard-sidebar"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Profile Section */}
              <motion.div 
                className="sidebar-profile"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="profile-avatar">
                  <div className="avatar-placeholder">
                    <span>
                      {isLoadingProfile ? '...' : 
                       userProfile ? 
                         (userProfile.name ? userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U') : 
                         (user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U')
                      }
                    </span>
                  </div>
                  <motion.button 
                    className="camera-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Camera className="camera-icon" />
                  </motion.button>
                </div>
                <h3 className="profile-name">
                  {isLoadingProfile ? 'Loading...' : 
                   userProfile?.name || user?.name || 'User'}
                </h3>
                <p className="profile-title">
                  {isLoadingProfile ? 'Loading...' : 
                   userProfile?.professionalTitle || userProfile?.jobTitle || 'Professional'}
                </p>
              </motion.div>

              {/* Navigation Menu */}
              <nav className="sidebar-nav">
                <AnimatePresence>
                  {mainSidebarItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      className={`nav-item ${isActive(item.path || '') ? 'active' : ''}`}
                      onClick={() => handleNavigation(item.path || '', item.action)}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: 0.3 + (index * 0.1),
                        ease: "easeOut"
                      }}
                      whileHover={{ 
                        x: 8,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <item.icon className="nav-icon" />
                      <span className="nav-label">{item.label}</span>
                      {isActive(item.path || '') && (
                        <motion.div
                          className="active-indicator"
                          layoutId="activeIndicator"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="dashboard-main"
        >
          {isResumePage ? (
            <div className="resume-dashboard-content">
              {renderResumeSection()}
            </div>
          ) : (
            <Outlet />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardLayout;

