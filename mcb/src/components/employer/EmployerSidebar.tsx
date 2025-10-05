import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  Briefcase,
  FileText,
  CreditCard,
  Users,
  Search,
  Shield,
  BarChart3,
  Edit,
  User,
  UserCheck,
  FileUser,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCompanyProfile } from '../../hooks/useCompanyProfile';
import './EmployerSidebar.css';

interface EmployerSidebarProps {
  className?: string;
}

const EmployerSidebar: React.FC<EmployerSidebarProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { companyProfile, isLoadingProfile, getCompanyName, getCompanyLogo, forceRefresh } = useCompanyProfile();

  const navigationItems = [
    {
      id: 'company-profile',
      label: 'Company Profile',
      icon: User,
      path: '/employer/profile',
      isActive: location.pathname === '/employer/profile'
    },
    {
      id: 'post-job',
      label: 'Post A Job',
      icon: FileText,
      path: '/employer/post-job',
      isActive: location.pathname === '/employer/post-job'
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: CreditCard,
      path: '/employer/transactions',
      isActive: location.pathname === '/employer/transactions'
    },
    {
      id: 'manage-jobs',
      label: 'Manage Jobs',
      icon: Briefcase,
      path: '/employer/jobs',
      isActive: location.pathname === '/employer/jobs'
    },
    {
      id: 'company-overview',
      label: 'Company Overview',
      icon: FileText,
      path: '/employer/overview',
      isActive: location.pathname === '/employer/overview'
    },
    {
      id: 'browse-candidates',
      label: 'Browse Candidates',
      icon: Search,
      path: '/employer/candidates',
      isActive: location.pathname === '/employer/candidates'
    },
    {
      id: 'resume',
      label: 'Resume',
      icon: FileUser,
      path: '/employer/resume',
      isActive: location.pathname === '/employer/resume'
    },
    {
      id: 'register',
      label: 'Register',
      icon: UserCheck,
      path: '/employer/register',
      isActive: location.pathname === '/employer/register' || location.pathname === '/employer/company-register'
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`employer-sidebar ${className}`}>
      {/* Company Profile Section */}
      <div className="company-profile-section">
        <div className="company-logo-container">
          <div className="company-logo">
            {isLoadingProfile ? (
              <div className="loading-placeholder">...</div>
            ) : getCompanyLogo() ? (
              <img src={getCompanyLogo()} alt={getCompanyName()} className="logo-image" />
            ) : (
              <Building2 className="logo-icon" />
            )}
            <button className="edit-logo-btn" title="Edit Company Logo">
              <Edit className="edit-icon" />
            </button>
          </div>
          <div className="company-name">
            @{getCompanyName()}
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-navigation">
        {navigationItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => handleNavigation(item.path)}
            className={`nav-item ${item.isActive ? 'active' : ''}`}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <item.icon className="nav-icon" />
            <span className="nav-label">{item.label}</span>
          </motion.button>
        ))}
        
        {/* Logout Button */}
        <motion.button
          onClick={handleLogout}
          className="nav-item logout-btn"
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="nav-icon" />
          <span className="nav-label">Log Out</span>
        </motion.button>
      </nav>

    </div>
  );
};

export default EmployerSidebar;
