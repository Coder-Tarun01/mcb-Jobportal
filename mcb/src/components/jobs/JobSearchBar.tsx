import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import './JobSearchBar.css';

interface SearchFilters {
  keyword: string;
  location: string;
}

interface JobSearchBarProps {
  onSearch?: (filters: SearchFilters) => void;
  className?: string;
}

const JobSearchBar: React.FC<JobSearchBarProps> = ({ onSearch, className = '' }) => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: '',
    location: ''
  });

  const [isSearching, setIsSearching] = useState(false);

  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    try {
      // Build search parameters
      const searchParams = new URLSearchParams();
      
      if (filters.keyword.trim()) {
        searchParams.set('q', filters.keyword.trim());
      }
      if (filters.location.trim()) {
        searchParams.set('location', filters.location.trim());
      }

      // Call the onSearch callback if provided
      if (onSearch) {
        onSearch(filters);
      }

      // Navigate to jobs page with search parameters
      const searchQuery = searchParams.toString();
      navigate(`/jobs${searchQuery ? `?${searchQuery}` : ''}`);
      
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className={`job-search-container ${className}`}>
      <form onSubmit={handleSearch} className="job-search-form">
        <div className="job-search-input-group">
          <div className="job-search-field">
            <Search className="job-search-icon" />
            <input
              type="text"
              placeholder="Job title, keywords, or company"
              value={filters.keyword}
              onChange={(e) => handleInputChange('keyword', e.target.value)}
              className="job-search-input"
            />
          </div>
          
          <div className="job-search-field">
            <MapPin className="job-search-icon" />
            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="job-search-input"
            />
          </div>
          
          <button type="submit" className="job-search-button" disabled={isSearching}>
            <Search className="job-search-btn-icon" />
            <span>{isSearching ? 'Searching...' : 'Search Jobs'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobSearchBar;