import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  MapPin,
  Star,
  MessageCircle,
  Bookmark,
  BookmarkCheck,
  Filter,
  Users,
  Award,
  Calendar,
  Mail,
  ChevronDown,
  X,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './BrowseCandidates.css';

interface Candidate {
  id: string;
  name: string;
  title: string;
  location: string;
  rating: number;
  experience: string;
  skills: string[];
  avatar: string;
  isBookmarked: boolean;
  lastActive: string;
  hourlyRate: string;
}

const BrowseCandidates: React.FC = () => {
  const navigate = useNavigate();
  const { user, isEmployer } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [skillsFilter, setSkillsFilter] = useState('all');
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [isJobTypeDropdownOpen, setIsJobTypeDropdownOpen] = useState(false);
  const jobTypeDropdownRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!user || !isEmployer()) {
      navigate('/login');
      return;
    }
  }, [user, navigate, isEmployer]);

  // Available job types
  const jobTypes = ['Freelance', 'Internship', 'Full Time', 'Part Time', 'Temporary'];

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (jobTypeDropdownRef.current && !jobTypeDropdownRef.current.contains(event.target as Node)) {
        setIsJobTypeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Sample candidate data
  const candidates: Candidate[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      title: 'Senior Frontend Developer',
      location: 'New York, NY',
      rating: 4.9,
      experience: '5+ years',
      skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
      avatar: 'SJ',
      isBookmarked: false,
      lastActive: '2 hours ago',
      hourlyRate: '$85/hr'
    },
    {
      id: '2',
      name: 'Michael Chen',
      title: 'UI/UX Designer',
      location: 'San Francisco, CA',
      rating: 4.8,
      experience: '4+ years',
      skills: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
      avatar: 'MC',
      isBookmarked: true,
      lastActive: '1 hour ago',
      hourlyRate: '$75/hr'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      title: 'Full Stack Developer',
      location: 'Remote',
      rating: 4.7,
      experience: '6+ years',
      skills: ['Python', 'Django', 'React', 'PostgreSQL'],
      avatar: 'ER',
      isBookmarked: false,
      lastActive: '30 minutes ago',
      hourlyRate: '$90/hr'
    },
    {
      id: '4',
      name: 'David Kim',
      title: 'DevOps Engineer',
      location: 'Seattle, WA',
      rating: 4.9,
      experience: '7+ years',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      avatar: 'DK',
      isBookmarked: true,
      lastActive: '4 hours ago',
      hourlyRate: '$95/hr'
    },
    {
      id: '5',
      name: 'Lisa Thompson',
      title: 'Product Manager',
      location: 'Austin, TX',
      rating: 4.6,
      experience: '5+ years',
      skills: ['Product Strategy', 'Agile', 'Analytics', 'User Stories'],
      avatar: 'LT',
      isBookmarked: false,
      lastActive: '1 day ago',
      hourlyRate: '$80/hr'
    },
    {
      id: '6',
      name: 'James Wilson',
      title: 'Backend Developer',
      location: 'Chicago, IL',
      rating: 4.8,
      experience: '4+ years',
      skills: ['Java', 'Spring Boot', 'MySQL', 'Microservices'],
      avatar: 'JW',
      isBookmarked: false,
      lastActive: '3 hours ago',
      hourlyRate: '$78/hr'
    },
    {
      id: '7',
      name: 'Amanda Davis',
      title: 'Digital Marketing Specialist',
      location: 'Miami, FL',
      rating: 4.7,
      experience: '3+ years',
      skills: ['SEO', 'Google Ads', 'Social Media', 'Analytics'],
      avatar: 'AD',
      isBookmarked: true,
      lastActive: '2 days ago',
      hourlyRate: '$65/hr'
    },
    {
      id: '8',
      name: 'Robert Brown',
      title: 'Data Scientist',
      location: 'Boston, MA',
      rating: 4.9,
      experience: '6+ years',
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
      avatar: 'RB',
      isBookmarked: false,
      lastActive: '5 hours ago',
      hourlyRate: '$100/hr'
    }
  ];

  // Filter candidates based on search and filters
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLocation = locationFilter === 'all' || 
      candidate.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesExperience = experienceFilter === 'all' || 
      candidate.experience.includes(experienceFilter);
    
    const matchesSkills = skillsFilter === 'all' || 
      candidate.skills.some(skill => skill.toLowerCase().includes(skillsFilter.toLowerCase()));
    
    // For job types, if none selected, show all candidates
    // If some selected, candidate must match at least one (this would be based on candidate's preferred job types)
    const matchesJobTypes = selectedJobTypes.length === 0 || 
      selectedJobTypes.some(jobType => {
        // In a real app, candidates would have preferred job types
        // For demo purposes, we'll assume all candidates are available for all job types
        return true;
      });
    
    return matchesSearch && matchesLocation && matchesExperience && matchesSkills && matchesJobTypes;
  });

  const handleBookmarkToggle = (candidateId: string) => {
    // In a real app, this would update the backend
    console.log(`Toggling bookmark for candidate ${candidateId}`);
  };

  const handleContactCandidate = (candidateId: string) => {
    // In a real app, this would open a messaging interface
    console.log(`Contacting candidate ${candidateId}`);
  };

  const handleJobTypeToggle = (jobType: string) => {
    setSelectedJobTypes(prev => {
      if (prev.includes(jobType)) {
        return prev.filter(type => type !== jobType);
      } else {
        return [...prev, jobType];
      }
    });
  };

  const handleJobTypeRemove = (jobType: string) => {
    setSelectedJobTypes(prev => prev.filter(type => type !== jobType));
  };

  const toggleJobTypeDropdown = () => {
    setIsJobTypeDropdownOpen(!isJobTypeDropdownOpen);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`star-icon ${i < Math.floor(rating) ? 'filled' : ''}`}
      />
    ));
  };

  return (
    <div className="browse-cand-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="browse-cand-container"
      >
        <div className="browse-cand-header">
          <button onClick={() => navigate('/employer/dashboard')} className="back-btn">
            <ArrowLeft className="btn-icon" />
            <span>Back to Dashboard</span>
          </button>
          <div className="header-content">
            <h1 className="page-title">Browse Candidates</h1>
          </div>
        </div>

        <div className="browse-candidates-content">
          {/* Search and Filters Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="search-section"
          >
            <div className="search-bar">
              <div className="search-container">
                <Search className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search by skills, job title, or name..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <button className="search-btn">
                <Search className="btn-icon" />
                <span>Search</span>
              </button>
            </div>
            
            <div className="filters-row">
              <div className="browse-cand-group">
                <Filter className="filter-icon" />
                <select 
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="browse-cand-select"
                >
                  <option value="all">All Locations</option>
                  <option value="remote">Remote</option>
                  <option value="new york">New York</option>
                  <option value="san francisco">San Francisco</option>
                  <option value="seattle">Seattle</option>
                  <option value="austin">Austin</option>
                  <option value="chicago">Chicago</option>
                </select>
              </div>
              
              <div className="browse-cand-group">
                <Award className="filter-icon" />
                <select 
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value)}
                  className="browse-cand-select"
                >
                  <option value="all">All Experience Levels</option>
                  <option value="1">1-2 years</option>
                  <option value="3">3-4 years</option>
                  <option value="5">5+ years</option>
                  <option value="7">7+ years</option>
                </select>
              </div>
              
              <div className="browse-cand-group">
                <Users className="filter-icon" />
                <select 
                  value={skillsFilter}
                  onChange={(e) => setSkillsFilter(e.target.value)}
                  className="browse-cand-select"
                >
                  <option value="all">All Skills</option>
                  <option value="react">React</option>
                  <option value="python">Python</option>
                  <option value="node">Node.js</option>
                  <option value="aws">AWS</option>
                  <option value="figma">Figma</option>
                </select>
              </div>

              <div className="browse-cand-group job-type-filter" ref={jobTypeDropdownRef}>
                <Briefcase className="filter-icon" />
                <div className="job-type-dropdown">
                  <div 
                    className="job-type-input"
                    onClick={toggleJobTypeDropdown}
                  >
                    <div className="job-type-content">
                      {selectedJobTypes.length === 0 ? (
                        <span className="placeholder">Select Job Types</span>
                      ) : (
                        <div className="selected-job-types">
                          {selectedJobTypes.map((jobType, index) => (
                            <span key={index} className="job-type-tag">
                              {jobType}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleJobTypeRemove(jobType);
                                }}
                                className="tag-remove"
                              >
                                <X className="tag-remove-icon" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <ChevronDown className={`dropdown-arrow ${isJobTypeDropdownOpen ? 'open' : ''}`} />
                  </div>
                  
                  {isJobTypeDropdownOpen && (
                    <div className="job-type-options">
                      {jobTypes.map((jobType) => (
                        <label key={jobType} className="job-type-option">
                          <input
                            type="checkbox"
                            checked={selectedJobTypes.includes(jobType)}
                            onChange={() => handleJobTypeToggle(jobType)}
                            className="job-type-checkbox"
                          />
                          <span className="job-type-label">{jobType}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="results-count">
              <Users className="count-icon" />
              <span>{filteredCandidates.length} candidates found</span>
            </div>
          </motion.div>

          {/* Candidates Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="candidates-section"
          >
            <div className="browse-cand-grid">
              {filteredCandidates.map((candidate) => (
                <div key={candidate.id} className="browse-cand-card">
                  <div className="candidate-header">
                    <div className="browse-cand-avatar">
                      {candidate.avatar}
                    </div>
                    <div className="browse-cand-info">
                      <h3 className="browse-cand-name">{candidate.name}</h3>
                      <p className="browse-cand-title">{candidate.title}</p>
                      <div className="browse-cand-location">
                        <MapPin className="location-icon" />
                        <span>{candidate.location}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBookmarkToggle(candidate.id)}
                      className={`bookmark-btn ${candidate.isBookmarked ? 'bookmarked' : ''}`}
                    >
                      {candidate.isBookmarked ? 
                        <BookmarkCheck className="bookmark-icon" /> : 
                        <Bookmark className="bookmark-icon" />
                      }
                    </button>
                  </div>

                  <div className="candidate-rating">
                    <div className="stars">
                      {renderStars(candidate.rating)}
                    </div>
                    <span className="rating-value">{candidate.rating}</span>
                  </div>

                  <div className="candidate-details">
                    <div className="detail-item">
                      <Award className="detail-icon" />
                      <span>{candidate.experience} experience</span>
                    </div>
                    <div className="detail-item">
                      <Calendar className="detail-icon" />
                      <span>Active {candidate.lastActive}</span>
                    </div>
                    <div className="detail-item">
                      <span className="hourly-rate">{candidate.hourlyRate}</span>
                    </div>
                  </div>

                  <div className="browse-cand-skills">
                    {candidate.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="browse-cand-tag">
                        {skill}
                      </span>
                    ))}
                    {candidate.skills.length > 3 && (
                      <span className="skill-more">
                        +{candidate.skills.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="browse-cand-actions">
                    <button 
                      onClick={() => handleContactCandidate(candidate.id)}
                      className="browse-cand-btn"
                    >
                      <MessageCircle className="btn-icon" />
                      <span>Contact</span>
                    </button>
                    <button className="browse-cand-profile-btn">
                      <Mail className="btn-icon" />
                      <span>View Profile</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredCandidates.length === 0 && (
              <div className="empty-state">
                <Users className="empty-icon" />
                <h3>No candidates found</h3>
                <p>Try adjusting your search criteria or filters to find more candidates.</p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default BrowseCandidates;
