import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Briefcase, 
  Heart, 
  DollarSign,
  Users,
  Truck,
  GraduationCap,
  Palette,
  Search,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { jobsAPI } from '../../services/api';
import { Job } from '../../types/job';
import './JobCategories.css';

const JobCategories: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryStats, setCategoryStats] = useState<{[key: string]: number}>({});

  useEffect(() => {
    loadJobsAndCalculateStats();
  }, []);

  const loadJobsAndCalculateStats = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.fetchJobs();
      const jobsData = response.jobs || response || [];
      const jobsArray = Array.isArray(jobsData) ? jobsData : [];
      
      setJobs(jobsArray);
      
      // Calculate job counts by category
      const stats: {[key: string]: number} = {};
      jobsArray.forEach(job => {
        if (job.category) {
          stats[job.category] = (stats[job.category] || 0) + 1;
        }
      });
      setCategoryStats(stats);
    } catch (error) {
      console.error('Error loading jobs for categories:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      id: 'technology',
      name: 'Technology',
      icon: Code,
      jobCount: categoryStats['Technology'] || categoryStats['technology'] || 0,
      color: '#3b82f6',
      subcategories: ['Software Development', 'Data Science', 'DevOps', 'Cybersecurity']
    },
    {
      id: 'business',
      name: 'Business & Management',
      icon: Briefcase,
      jobCount: categoryStats['Business'] || categoryStats['business'] || 0,
      color: '#059669',
      subcategories: ['Project Management', 'Business Analysis', 'Operations', 'Strategy']
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      icon: Heart,
      jobCount: categoryStats['Healthcare'] || categoryStats['healthcare'] || 0,
      color: '#dc2626',
      subcategories: ['Nursing', 'Medical', 'Healthcare Admin', 'Pharmacy']
    },
    {
      id: 'finance',
      name: 'Finance & Accounting',
      icon: DollarSign,
      jobCount: categoryStats['Finance'] || categoryStats['finance'] || 0,
      color: '#7c3aed',
      subcategories: ['Accounting', 'Financial Analysis', 'Banking', 'Investment']
    },
    {
      id: 'marketing',
      name: 'Marketing & Sales',
      icon: Users,
      jobCount: categoryStats['Marketing'] || categoryStats['marketing'] || 0,
      color: '#ea580c',
      subcategories: ['Digital Marketing', 'Sales', 'Content Marketing', 'Brand Management']
    },
    {
      id: 'logistics',
      name: 'Logistics & Supply Chain',
      icon: Truck,
      jobCount: categoryStats['Logistics'] || categoryStats['logistics'] || 0,
      color: '#0891b2',
      subcategories: ['Supply Chain', 'Logistics', 'Procurement', 'Transportation']
    },
    {
      id: 'education',
      name: 'Education',
      icon: GraduationCap,
      jobCount: categoryStats['Education'] || categoryStats['education'] || 0,
      color: '#65a30d',
      subcategories: ['Teaching', 'Training', 'Curriculum Development', 'Educational Technology']
    },
    {
      id: 'design',
      name: 'Design & Creative',
      icon: Palette,
      jobCount: categoryStats['Design'] || categoryStats['design'] || 0,
      color: '#c026d3',
      subcategories: ['UI/UX Design', 'Graphic Design', 'Creative Direction', 'Web Design']
    }
  ];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.subcategories.some(sub => sub.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCategoryClick = (categoryId: string) => {
    // Navigate to category-specific job listings
    console.log('Navigating to category:', categoryId);
    // You can implement navigation to filtered job listings here
    // For example: navigate(`/jobs?category=${categoryId}`);
  };

  return (
    <div className="job-categories-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="job-categories-container"
      >
        {/* Header */}
        <div className="categories-header">
          <h1 className="page-title">Job Categories</h1>
          <p className="page-subtitle">
            Explore job opportunities by industry and specialization
          </p>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="search-section"
        >
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="loading-section"
          >
            <div className="loading-container">
              <Loader2 className="loading-spinner" />
              <p>Loading job categories...</p>
            </div>
          </motion.div>
        ) : (
          /* Categories Grid */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="categories-grid"
          >
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
              className="category-card"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="category-icon" style={{ backgroundColor: `${category.color}20` }}>
                <category.icon 
                  className="icon" 
                  style={{ color: category.color }}
                />
              </div>
              
              <div className="category-content">
                <h3 className="category-name">{category.name}</h3>
                <p className="category-job-count">{category.jobCount} jobs available</p>
                
                <div className="subcategories">
                  {category.subcategories.map((sub, subIndex) => (
                    <span key={subIndex} className="subcategory-tag">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <div className="category-arrow">
                <ArrowRight className="arrow-icon" />
              </div>
            </motion.div>
          ))}
            {filteredCategories.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="empty-state"
              >
                <Search className="empty-icon" />
                <h3>No categories found</h3>
                <p>Try adjusting your search terms to find relevant categories.</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="stats-section"
        >
          <div className="stats-grid">
            <div className="stat-item">
              <h3>{jobs.length.toLocaleString()}</h3>
              <p>Total Jobs</p>
            </div>
            <div className="stat-item">
              <h3>{categories.length}</h3>
              <p>Categories</p>
            </div>
            <div className="stat-item">
              <h3>{new Set(jobs.map(job => job.company)).size}</h3>
              <p>Companies</p>
            </div>
            <div className="stat-item">
              <h3>{new Set(jobs.map(job => job.location).filter(Boolean)).size}</h3>
              <p>Locations</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default JobCategories;
