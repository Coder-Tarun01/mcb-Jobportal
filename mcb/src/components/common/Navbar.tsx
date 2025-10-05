import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import JobsDropdown from '../jobs/JobsDropdown';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, logout, isEmployee, isEmployer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isJobsDropdownOpen, setIsJobsDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleJobsDropdownClose = () => {
    setIsJobsDropdownOpen(false);
  };


  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="mcb-navbar">
      <div className="mcb-navbar-container">
        {/* Logo */}
        <Link to="/" className="mcb-navbar-logo">
          <img src="/logo.png" alt="MyCareerbuild JOBS" className="mcb-logo-image" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="mcb-navbar-nav" role="navigation" aria-label="Main navigation">
          <ul className="mcb-nav-list">
            {/* Home */}
            <li className="mcb-nav-item">
              <Link 
                to="/" 
                className={`mcb-nav-link ${isActive('/') ? 'mcb-active' : ''}`}
              >
                Home
              </Link>
            </li>
            

            {/* Jobs Dropdown */}
            <li 
              className="mcb-nav-item mcb-dropdown-item"
              onMouseEnter={() => setIsJobsDropdownOpen(true)}
              onMouseLeave={() => setIsJobsDropdownOpen(false)}
            >
              <button 
                className={`mcb-dropdown-trigger ${isActive('/jobs') ? 'mcb-active' : ''}`}
                onClick={() => navigate('/jobs')}
              >
                Job Provider
                <ChevronDown className="mcb-dropdown-arrow" />
              </button>
              <JobsDropdown
                isOpen={isJobsDropdownOpen}
                onClose={handleJobsDropdownClose}
              />
            </li>

            {/* Blogs */}
            <li className="mcb-nav-item">
              <Link 
                to="/blogs" 
                className={`mcb-nav-link ${isActive('/blogs') ? 'mcb-active' : ''}`}
              >
                Blogs
              </Link>
            </li>

            {/* Contact Us */}
            <li className="mcb-nav-item">
              <Link 
                to="/contact" 
                className={`mcb-nav-link ${isActive('/contact') ? 'mcb-active' : ''}`}
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className={`mcb-navbar-search ${isSearchFocused ? 'mcb-focused' : ''}`}>
          <div className="mcb-search-input-container">
            <Search className="mcb-search-icon" />
            <input
              type="text"
              placeholder="Search jobs, companies, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="mcb-search-input"
            />
          </div>
        </form>

        {/* User Actions */}
        <div className="mcb-navbar-actions">
          {user ? (
            <div className="mcb-user-menu">
              {isEmployee() && (
                <Link 
                  to="/dashboard" 
                  className={`mcb-action-link ${isActive('/dashboard') ? 'mcb-active' : ''}`}
                >
                  <User className="mcb-action-icon" />
                  <span>Dashboard</span>
                </Link>
              )}
              {isEmployer() && (
                <Link 
                  to="/employer/dashboard" 
                  className={`mcb-action-link ${isActive('/employer/dashboard') ? 'mcb-active' : ''}`}
                >
                  <Building2 className="mcb-action-icon" />
                  <span>Employer Dashboard</span>
                </Link>
              )}
              <button onClick={handleLogout} className="mcb-logout-btn">
                <LogOut className="mcb-logout-icon" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="mcb-auth-links">
              <Link 
                to="/login" 
                className={`mcb-auth-link ${isActive('/login') ? 'mcb-active' : ''}`}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className={`mcb-auth-link mcb-signup-link ${isActive('/signup') ? 'mcb-active' : ''}`}
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mcb-mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mcb-mobile-menu"
          >
            <div className="mcb-mobile-menu-content">
              <nav className="mcb-mobile-nav" role="navigation" aria-label="Mobile navigation">
                <ul className="mcb-mobile-nav-list">
                  <li className="mcb-mobile-nav-item">
                    <Link 
                      to="/" 
                      className={`mcb-mobile-nav-link ${isActive('/') ? 'mcb-active' : ''}`} 
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Home
                    </Link>
                  </li>
                  
                  <li className="mcb-mobile-nav-item">
                    <Link 
                      to="/jobs" 
                      className={`mcb-mobile-nav-link ${isActive('/jobs') ? 'mcb-active' : ''}`} 
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Job Provider
                    </Link>
                  </li>
                  
                  <li className="mcb-mobile-nav-item">
                    <Link 
                      to="/blogs" 
                      className={`mcb-mobile-nav-link ${isActive('/blogs') ? 'mcb-active' : ''}`} 
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Blogs
                    </Link>
                  </li>
                  
                  <li className="mcb-mobile-nav-item">
                    <Link 
                      to="/contact" 
                      className={`mcb-mobile-nav-link ${isActive('/contact') ? 'mcb-active' : ''}`} 
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Contact Us
                    </Link>
                  </li>
                  
                  {user ? (
                    <>
                      {isEmployee() && (
                        <li className="mcb-mobile-nav-item">
                          <Link 
                            to="/dashboard" 
                            className={`mcb-mobile-nav-link ${isActive('/dashboard') ? 'mcb-active' : ''}`} 
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <User className="mcb-mobile-nav-icon" />
                            <span>Dashboard</span>
                          </Link>
                        </li>
                      )}
                      {isEmployer() && (
                        <li className="mcb-mobile-nav-item">
                          <Link 
                            to="/employer/dashboard" 
                            className={`mcb-mobile-nav-link ${isActive('/employer/dashboard') ? 'mcb-active' : ''}`} 
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Building2 className="mcb-mobile-nav-icon" />
                            <span>Employer Dashboard</span>
                          </Link>
                        </li>
                      )}
                      <li className="mcb-mobile-nav-item">
                        <button onClick={handleLogout} className="mcb-mobile-logout-btn">
                          <LogOut className="mcb-mobile-nav-icon" />
                          <span>Logout</span>
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="mcb-mobile-nav-item">
                        <Link 
                          to="/login" 
                          className={`mcb-mobile-nav-link ${isActive('/login') ? 'mcb-active' : ''}`} 
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Login
                        </Link>
                      </li>
                      <li className="mcb-mobile-nav-item">
                        <Link 
                          to="/signup" 
                          className={`mcb-mobile-nav-link mcb-signup-link ${isActive('/signup') ? 'mcb-active' : ''}`} 
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Register
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  );
};

export default Navbar;
