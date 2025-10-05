import React from 'react';
import EmployerSidebar from './EmployerSidebar';
import './EmployerLayout.css';

interface EmployerLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const EmployerLayout: React.FC<EmployerLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`employer-layout ${className}`}>
      <EmployerSidebar />
      {children}
    </div>
  );
};

export default EmployerLayout;
