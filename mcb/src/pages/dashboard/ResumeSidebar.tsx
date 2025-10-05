import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Code, 
  Briefcase, 
  GraduationCap, 
  Settings, 
  FolderOpen, 
  User, 
  Award, 
  Target, 
  Upload,
  UserCircle,
  ArrowLeft
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ResumeSidebar.css';

interface ResumeSidebarProps {
  onBack: () => void;
}

const ResumeSidebar: React.FC<ResumeSidebarProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const resumeSections = [
    { id: 'overview', label: 'Resume Overview', icon: FileText, path: '/dashboard/resume' },
    { id: 'headline', label: 'Resume Headline', icon: FileText, path: '/dashboard/resume/headline' },
    { id: 'skills', label: 'Key Skills', icon: Code, path: '/dashboard/resume/skills' },
    { id: 'employment', label: 'Employment', icon: Briefcase, path: '/dashboard/resume/employment' },
    { id: 'education', label: 'Education', icon: GraduationCap, path: '/dashboard/resume/education' },
    { id: 'it-skills', label: 'IT Skills', icon: Settings, path: '/dashboard/resume/it-skills' },
    { id: 'projects', label: 'Projects', icon: FolderOpen, path: '/dashboard/resume/projects' },
    { id: 'summary', label: 'Profile Summary', icon: User, path: '/dashboard/resume/summary' },
    { id: 'accomplishments', label: 'Accomplishments', icon: Award, path: '/dashboard/resume/accomplishments' },
    { id: 'career', label: 'Desired Career Profile', icon: Target, path: '/dashboard/resume/career' },
    { id: 'personal', label: 'Personal Details', icon: UserCircle, path: '/dashboard/resume/personal' },
    { id: 'attach', label: 'Attach Resume', icon: Upload, path: '/dashboard/resume/attach' }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSectionClick = (path: string) => {
    navigate(path);
  };

  return (
    <motion.div 
      className="mcb-resume-sidebar"
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Back Button */}
      <motion.button
        className="mcb-resume-back-btn"
        onClick={onBack}
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <ArrowLeft className="mcb-back-icon" />
        <span>Back to Dashboard</span>
      </motion.button>

      {/* Resume Navigation */}
      <nav className="mcb-resume-nav">
        <div className="mcb-resume-nav-header">
          <FileText className="mcb-resume-nav-icon" />
          <h3 className="resume-sections-title">Resume Sections</h3>
        </div>
        
        <div className="mcb-resume-nav-items">
          <AnimatePresence>
            {resumeSections.map((section, index) => (
              <motion.button
                key={section.id}
                className={`mcb-resume-nav-item ${isActive(section.path) ? 'mcb-active' : ''}`}
                onClick={() => handleSectionClick(section.path)}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.05,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  x: 8,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <section.icon className="mcb-resume-nav-icon" />
                <span className="mcb-resume-nav-label">{section.label}</span>
                {isActive(section.path) && (
                  <motion.div
                    className="mcb-resume-active-indicator"
                    layoutId="mcbResumeActiveIndicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </nav>

      {/* Resume Progress */}
      <motion.div 
        className="mcb-resume-progress"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="mcb-progress-header">
          <span className="mcb-progress-label">Resume Completion</span>
          <span className="mcb-progress-percentage">75%</span>
        </div>
        <div className="mcb-progress-bar">
          <motion.div 
            className="mcb-progress-fill"
            initial={{ width: 0 }}
            animate={{ width: '75%' }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        <p className="mcb-progress-note">Complete all sections for better visibility</p>
      </motion.div>
    </motion.div>
  );
};

export default ResumeSidebar;