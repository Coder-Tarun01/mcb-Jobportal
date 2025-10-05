import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  X, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Building2,
  Clock,
  ChevronDown
} from 'lucide-react';
import { JobFilter as JobFilterType } from '../../types/job';
import './JobFilter.css';

interface JobFilterProps {
  filters: JobFilterType;
  onFiltersChange: (filters: JobFilterType) => void;
  onClearFilters: () => void;
  className?: string;
}

const JobFilter: React.FC<JobFilterProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
  const experienceLevels = ['0-1', '1-3', '3-5', '5-10', '10+'];
  const salaryRanges = [
    { label: '0-3L', min: 0, max: 300000 },
    { label: '3-6L', min: 300000, max: 600000 },
    { label: '6-10L', min: 600000, max: 1000000 },
    { label: '10L+', min: 1000000, max: 999999999 }
  ];

  const handleFilterChange = (key: keyof JobFilterType, value: string | number) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== undefined && value !== '' && value !== null
    ).length;
  };

  return (
    <div className={`job-filter ${className}`}>
      {/* Filter Toggle Button */}
      <div className="filter-header">
        <button
          className="filter-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Filter className="filter-icon" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="filter-count">{getActiveFiltersCount()}</span>
          )}
          <ChevronDown className={`chevron ${isOpen ? 'open' : ''}`} />
        </button>
        
        {hasActiveFilters && (
          <button
            className="clear-filters-btn"
            onClick={onClearFilters}
          >
            <X className="clear-icon" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="filter-panel"
          >
            <div className="filter-content">
              {/* Location Filter */}
              <div className="filter-group">
                <label className="filter-label">
                  <MapPin className="label-icon" />
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter city or state"
                  value={filters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="filter-input"
                />
              </div>

              {/* Salary Range Filter */}
              <div className="filter-group">
                <label className="filter-label">
                  <DollarSign className="label-icon" />
                  Salary Range
                </label>
                <div className="salary-inputs">
                  <input
                    type="number"
                    placeholder="Min (LPA)"
                    value={filters.salaryMin ? filters.salaryMin / 100000 : ''}
                    onChange={(e) => handleFilterChange('salaryMin', e.target.value ? parseFloat(e.target.value) * 100000 : '')}
                    className="filter-input"
                  />
                  <span className="salary-separator">to</span>
                  <input
                    type="number"
                    placeholder="Max (LPA)"
                    value={filters.salaryMax ? filters.salaryMax / 100000 : ''}
                    onChange={(e) => handleFilterChange('salaryMax', e.target.value ? parseFloat(e.target.value) * 100000 : '')}
                    className="filter-input"
                  />
                </div>
                <div className="salary-ranges">
                  {salaryRanges.map((range) => (
                    <button
                      key={range.label}
                      className={`salary-range-btn ${
                        filters.salaryMin === range.min && filters.salaryMax === range.max ? 'active' : ''
                      }`}
                      onClick={() => {
                        handleFilterChange('salaryMin', range.min);
                        handleFilterChange('salaryMax', range.max);
                      }}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Filter */}
              <div className="filter-group">
                <label className="filter-label">
                  <Clock className="label-icon" />
                  Experience
                </label>
                <div className="experience-options">
                  {experienceLevels.map((level) => (
                    <button
                      key={level}
                      className={`experience-btn ${
                        filters.experience === level ? 'active' : ''
                      }`}
                      onClick={() => handleFilterChange('experience', level)}
                    >
                      {level} years
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Type Filter */}
              <div className="filter-group">
                <label className="filter-label">
                  <Briefcase className="label-icon" />
                  Job Type
                </label>
                <div className="job-type-options">
                  {jobTypes.map((type) => (
                    <button
                      key={type}
                      className={`job-type-btn ${
                        filters.jobType === type ? 'active' : ''
                      }`}
                      onClick={() => handleFilterChange('jobType', type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Company Filter */}
              <div className="filter-group">
                <label className="filter-label">
                  <Building2 className="label-icon" />
                  Company
                </label>
                <input
                  type="text"
                  placeholder="Enter company name"
                  value={filters.company || ''}
                  onChange={(e) => handleFilterChange('company', e.target.value)}
                  className="filter-input"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobFilter;
