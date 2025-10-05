import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Mail,
  Phone,
  Star,
  Bookmark,
  Share2,
  CheckCircle,
  ExternalLink,
  Building2,
  Award,
  GraduationCap
} from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import JobPostingSchema from '../components/seo/JobPostingSchema';
import { jobsAPI } from '../services/api';
import { Job } from '../types/job';
import './JobDetails.css';

interface JobDetails {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  postedDate: string;
  applicationDeadline?: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: {
    skills: string[];
    education: string;
    experience: string;
    preferred: string[];
  };
  responsibilities: string[];
  benefits: string[];
  howToApply: string;
  contact: {
    hrContact: string;
    email: string;
    phone?: string;
  };
  isBookmarked: boolean;
  rating: number;
  applicantsCount: number;
}

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const loadJobDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const jobData = await jobsAPI.fetchJobById(id);
        
        // Transform the API data to match the JobDetails interface
        const transformedJob: JobDetails = {
          id: jobData.id,
          title: jobData.title,
          company: jobData.company,
          companyLogo: jobData.companyLogo,
          location: jobData.location,
          jobType: jobData.type,
          experienceLevel: `${jobData.experience.min}-${jobData.experience.max} years`,
          postedDate: jobData.postedDate,
          applicationDeadline: jobData.applicationDeadline,
          salary: jobData.salary,
          description: jobData.description,
          requirements: {
            skills: jobData.skills,
            education: 'Bachelor\'s degree in relevant field preferred',
            experience: `${jobData.experience.min}+ years of experience`,
            preferred: jobData.requirements || []
          },
          responsibilities: [
            'Develop and maintain high-quality software solutions',
            'Collaborate with cross-functional teams',
            'Write clean, maintainable, and well-documented code',
            'Participate in code reviews and technical discussions'
          ],
          benefits: [
            'Competitive salary package',
            'Health insurance',
            'Flexible working hours',
            'Professional development opportunities'
          ],
          howToApply: 'To apply for this position, please submit your resume and cover letter through our online application portal.',
          contact: {
            hrContact: 'HR Team',
            email: 'hr@company.com',
            phone: '+1 (555) 123-4567'
          },
          isBookmarked: false,
          rating: 4.5,
          applicantsCount: 50
        };
        
        setJob(transformedJob);
        setIsBookmarked(transformedJob.isBookmarked);
      } catch (error) {
        console.error('Error loading job details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadJobDetails();
  }, [id]);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, this would update the backend
    console.log(`Bookmark toggled for job ${id}`);
  };

  const handleApply = () => {
    // Navigate to apply page with job ID
    navigate(`/apply/${id}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: `Check out this job opportunity: ${job?.title} at ${job?.company}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Job link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="job-details-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-details-page">
        <div className="error-container">
          <h2>Job Not Found</h2>
          <p>The job you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/jobs')} className="back-button">
            <ArrowLeft className="btn-icon" />
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="job-details-page">
      {/* SEO Head */}
      <SEOHead
        title={`${job.title} at ${job.company} - ${job.location} | MCB Jobs`}
        description={`Apply for ${job.title} at ${job.company} in ${job.location}. ${job.jobType} position with salary ${job.salary.currency} ${job.salary.min}-${job.salary.max}. Find more jobs at MCB.`}
        keywords={`${job.title}, ${job.company}, jobs in ${job.location}, ${job.jobType} jobs, ${job.requirements.skills.join(', ')}, career opportunities`}
        canonical={`https://mcb.com/jobs/${job.id}`}
        ogTitle={`${job.title} at ${job.company} - ${job.location}`}
        ogDescription={`Apply for ${job.title} at ${job.company} in ${job.location}. ${job.jobType} position with competitive salary.`}
        ogImage={job.companyLogo || "https://mcb.com/logo.png"}
        ogUrl={`https://mcb.com/jobs/${job.id}`}
      />
      
      {/* Job Posting Schema */}
      <JobPostingSchema
        jobTitle={job.title}
        jobDescription={job.description}
        companyName={job.company}
        companyLogo={job.companyLogo}
        companyUrl={job.contact.website}
        jobLocation={{
          addressLocality: job.location.split(',')[0],
          addressRegion: job.location.split(',')[1] || '',
          postalCode: '',
          addressCountry: 'IN'
        }}
        baseSalary={{
          currency: job.salary.currency,
          minValue: job.salary.min,
          maxValue: job.salary.max
        }}
        employmentType={job.jobType.toUpperCase().replace('-', '_') as any}
        datePosted={job.postedDate}
        validThrough={job.applicationDeadline}
        qualifications={job.requirements.education}
        responsibilities={job.responsibilities.join(', ')}
        skills={job.requirements.skills.join(', ')}
        workHours="40 hours per week"
        benefits={job.benefits.join(', ')}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="job-details-container"
      >
        {/* Header */}
        <div className="job-header">
          <button onClick={() => navigate('/jobs')} className="back-button">
            <ArrowLeft className="btn-icon" />
            Back to Jobs
          </button>
          
          <div className="job-header-content">
            <div className="job-title-section">
              <h1 className="job-title">{job.title}</h1>
              <div className="company-info">
                <Building2 className="company-icon" />
                <span className="company-name">{job.company}</span>
                <div className="job-rating">
                  <Star className="star-icon" />
                  <span>{job.rating}</span>
                </div>
              </div>
            </div>
            
            <div className="job-actions">
              <button onClick={handleBookmark} className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}>
                <Bookmark className="bookmark-icon" />
                {isBookmarked ? 'Saved' : 'Save'}
              </button>
              <button onClick={handleShare} className="share-btn">
                <Share2 className="share-icon" />
                Share
              </button>
              <button onClick={handleApply} className="apply-btn">
                Apply Now
              </button>
            </div>
          </div>
        </div>

        {/* Job Info Cards */}
        <div className="job-info-cards">
          <div className="info-card">
            <MapPin className="info-icon" />
            <div className="info-content">
              <span className="info-label">Location</span>
              <span className="info-value">{job.location}</span>
            </div>
          </div>
          
          <div className="info-card">
            <Briefcase className="info-icon" />
            <div className="info-content">
              <span className="info-label">Job Type</span>
              <span className="info-value">{job.jobType}</span>
            </div>
          </div>
          
          <div className="info-card">
            <Award className="info-icon" />
            <div className="info-content">
              <span className="info-label">Experience</span>
              <span className="info-value">{job.experienceLevel}</span>
            </div>
          </div>
          
          <div className="info-card">
            <DollarSign className="info-icon" />
            <div className="info-content">
              <span className="info-label">Salary</span>
              <span className="info-value">{typeof job.salary === 'string' ? job.salary : `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}`}</span>
            </div>
          </div>
          
          <div className="info-card">
            <Calendar className="info-icon" />
            <div className="info-content">
              <span className="info-label">Posted</span>
              <span className="info-value">{new Date(job.postedDate).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="info-card">
            <Users className="info-icon" />
            <div className="info-content">
              <span className="info-label">Applicants</span>
              <span className="info-value">{job.applicantsCount}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="job-content">
          <div className="content-main">
            {/* Job Description */}
            <section className="content-section">
              <h2 className="section-title">Job Description</h2>
              <div className="section-content">
                <p>{job.description}</p>
              </div>
            </section>

            {/* Requirements & Qualifications */}
            <section className="content-section">
              <h2 className="section-title">Requirements & Qualifications</h2>
              <div className="section-content">
                <div className="requirements-grid">
                  <div className="requirement-group">
                    <h3 className="requirement-title">
                      <CheckCircle className="requirement-icon" />
                      Required Skills
                    </h3>
                    <div className="skills-list">
                      {job.requirements.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="requirement-group">
                    <h3 className="requirement-title">
                      <GraduationCap className="requirement-icon" />
                      Education
                    </h3>
                    <p>{job.requirements.education}</p>
                  </div>
                  
                  <div className="requirement-group">
                    <h3 className="requirement-title">
                      <Clock className="requirement-icon" />
                      Experience
                    </h3>
                    <p>{job.requirements.experience}</p>
                  </div>
                  
                  {job.requirements.preferred.length > 0 && (
                    <div className="requirement-group">
                      <h3 className="requirement-title">
                        <Star className="requirement-icon" />
                        Preferred Qualifications
                      </h3>
                      <div className="skills-list">
                        {job.requirements.preferred.map((skill, index) => (
                          <span key={index} className="skill-tag preferred">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Responsibilities */}
            <section className="content-section">
              <h2 className="section-title">Responsibilities</h2>
              <div className="section-content">
                <ul className="responsibilities-list">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="responsibility-item">
                      <CheckCircle className="list-icon" />
                      {responsibility}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Benefits & Perks */}
            <section className="content-section">
              <h2 className="section-title">Benefits & Perks</h2>
              <div className="section-content">
                <div className="benefits-grid">
                  {job.benefits.map((benefit, index) => (
                    <div key={index} className="benefit-item">
                      <CheckCircle className="benefit-icon" />
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* How to Apply */}
            <section className="content-section">
              <h2 className="section-title">How to Apply</h2>
              <div className="section-content">
                <div className="apply-instructions">
                  <p>{job.howToApply}</p>
                  <button onClick={handleApply} className="apply-button-large">
                    <ExternalLink className="btn-icon" />
                    Apply Now
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="content-sidebar">
            {/* Contact Information */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">Contact Information</h3>
              <div className="contact-info">
                <div className="contact-item">
                  <Users className="contact-icon" />
                  <div className="contact-details">
                    <span className="contact-label">HR Contact</span>
                    <span className="contact-value">{job.contact.hrContact}</span>
                  </div>
                </div>
                
                <div className="contact-item">
                  <Mail className="contact-icon" />
                  <div className="contact-details">
                    <span className="contact-label">Email</span>
                    <a href={`mailto:${job.contact.email}`} className="contact-value link">
                      {job.contact.email}
                    </a>
                  </div>
                </div>
                
                {job.contact.phone && (
                  <div className="contact-item">
                    <Phone className="contact-icon" />
                    <div className="contact-details">
                      <span className="contact-label">Phone</span>
                      <a href={`tel:${job.contact.phone}`} className="contact-value link">
                        {job.contact.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Application Deadline */}
            {job.applicationDeadline && (
              <div className="sidebar-card deadline-card">
                <h3 className="sidebar-title">Application Deadline</h3>
                <div className="deadline-content">
                  <Calendar className="deadline-icon" />
                  <span className="deadline-date">
                    {new Date(job.applicationDeadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            {/* Quick Apply */}
            <div className="sidebar-card cta-card">
              <h3 className="sidebar-title">Ready to Apply?</h3>
              <p className="cta-description">
                Join our team and make a difference in the tech industry.
              </p>
              <button onClick={handleApply} className="cta-button">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default JobDetails;