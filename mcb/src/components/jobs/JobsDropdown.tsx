import React from 'react';
import { useNavigate } from 'react-router-dom';
import './JobsDropdown.css';

interface JobsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const JobsDropdown: React.FC<JobsDropdownProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const dropdownItems = [
    { title: 'Job Search', path: '/job-search' },
    { title: 'Search by Categories', path: '/job-categories' },
    { title: 'Free Job Alerts', path: '/free-job-alerts' },
    { title: 'Recent Jobs', path: '/recent-jobs' }
  ];

  if (!isOpen) return null;

  return (
    <div className="jobs-dropdown">
      {dropdownItems.map((item) => (
        <button
          key={item.path}
          className="dropdown-item"
          onClick={() => handleNavigation(item.path)}
        >
          {item.title}
        </button>
      ))}
    </div>
  );
};

export default JobsDropdown;
