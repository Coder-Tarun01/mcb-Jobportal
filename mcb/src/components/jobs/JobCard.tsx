import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  DollarSign
} from 'lucide-react';
import { Job } from '../../types/job';
import './JobCard.css';

interface JobCardProps {
  job: Job;
  index: number;
}

const JobCard: React.FC<JobCardProps> = ({ job, index }) => {
  const navigate = useNavigate();

  const handleApplyClick = () => {
    navigate(`/apply/${job.id}`);
  };

  return (
    <motion.div
      className="job-card-compact"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -5,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
    >
      <div className="job-card-badge">
        <span className="job-card-badge-text">{job.isRemote ? 'Remote' : (job.type || 'Full-time')}</span>
      </div>
      <div className="job-card-content">
        <h3 className="job-card-title">{job.title}</h3>
        <p className="job-card-company">{job.company}</p>
        <div className="job-card-details">
          <div className="job-card-location">
            <MapPin className="job-card-detail-icon" />
            <span>{job.location || 'Location not specified'}</span>
          </div>
          {job.salary && (
            <div className="job-card-experience">
              <DollarSign className="job-card-detail-icon" />
              <span>${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}</span>
            </div>
          )}
        </div>
        <div className="job-card-actions">
          <button className="job-card-apply-btn" onClick={handleApplyClick}>
            Apply Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;