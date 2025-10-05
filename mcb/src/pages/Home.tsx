import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  ArrowRight,
  Star,
  Globe,
  Shield,
  Users
} from 'lucide-react';
import JobSearchBar from '../components/jobs/JobSearchBar';
import SEOHead from '../components/seo/SEOHead';
import OrganizationSchema from '../components/seo/OrganizationSchema';
import WebsiteSchema from '../components/seo/WebsiteSchema';
import { Job } from '../types/job';
import { jobsAPI } from '../services/api';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [remoteJobs, setRemoteJobs] = useState<Job[]>([]);
  const [domainJobs, setDomainJobs] = useState<Job[]>([]);
  const [isLoadingRemote, setIsLoadingRemote] = useState(true);
  const [isLoadingDomain, setIsLoadingDomain] = useState(true);
  const [forceRender, setForceRender] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);

  // Force component re-render on navigation back
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setForceRender(prev => prev + 1);
      }
    };

    const handleFocus = () => {
      setForceRender(prev => prev + 1);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleApplyClick = (jobId: string) => {
    // Force button to lose focus before navigation to prevent state persistence
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    navigate(`/apply/${jobId}`);
  };


  useEffect(() => {
    const loadRemoteJobs = async () => {
      try {
        const response = await jobsAPI.fetchJobs({ 
          isRemote: true, 
          limit: 3 
        });
        // Handle both response structures
        const jobs = response.jobs || response || [];
        console.log('Remote jobs data:', jobs);
        setRemoteJobs(Array.isArray(jobs) ? jobs : []);
        setIsLoadingRemote(false);
      } catch (error) {
        console.error('Error loading remote jobs:', error);
        setApiError('Unable to load jobs. Please make sure the backend server is running.');
        setRemoteJobs([]);
        setIsLoadingRemote(false);
      }
    };

    const loadDomainJobs = async () => {
      try {
        const response = await jobsAPI.fetchJobs({ 
          isRemote: false, 
          limit: 3 
        });
        // Handle both response structures
        const jobs = response.jobs || response || [];
        console.log('Domain jobs data:', jobs);
        setDomainJobs(Array.isArray(jobs) ? jobs : []);
        setIsLoadingDomain(false);
      } catch (error) {
        console.error('Error loading domain jobs:', error);
        setApiError('Unable to load jobs. Please make sure the backend server is running.');
        setDomainJobs([]);
        setIsLoadingDomain(false);
      }
    };

    loadRemoteJobs();
    loadDomainJobs();
  }, []);


  const collaborations = [
    {
      name: 'AICTE',
      logo: '/collaboration/aicte.webp',
      description: 'All India Council for Technical Education'
    },
    {
      name: 'NASSCOM',
      logo: '/collaboration/nasscom.webp',
      description: 'National Association of Software and Service Companies'
    },
    {
      name: 'Digital India',
      logo: '/collaboration/digital.webp',
      description: 'Digital India Initiative'
    },
    {
      name: 'Make in India',
      logo: '/collaboration/make-in-india.webp',
      description: 'Make in India Campaign'
    },
    {
      name: 'STPI',
      logo: '/collaboration/STPI.webp',
      description: 'Software Technology Parks of India'
    },
    {
      name: 'Startup India',
      logo: '/collaboration/startup-india.webp',
      description: 'Startup India Initiative'
    },
    {
      name: 'Government of India',
      logo: '/collaboration/ind.webp',
      description: 'Government of India'
    },
    {
      name: 'Andhra Pradesh Government',
      logo: '/collaboration/govt-ap.webp',
      description: 'Government of Andhra Pradesh'
    },
    {
      name: 'NRDC',
      logo: '/collaboration/nrdc.webp',
      description: 'National Research Development Corporation'
    },
    {
      name: 'APSCHE',
      logo: '/collaboration/apsche.webp',
      description: 'Andhra Pradesh State Council of Higher Education'
    }
  ];

  const features = [
    {
      icon: Search,
      title: 'Smart Job Search',
      description: 'Find the perfect job with our advanced search and filtering options.'
    },
    {
      icon: Briefcase,
      title: 'Top Companies',
      description: 'Connect with leading companies and startups across various industries.'
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: 'Get personalized career guidance from our team of experts.'
    }
  ];

  return (
    <div className="home-page">
      {/* SEO Head */}
      <SEOHead
        title="MCB Jobs - Find Your Dream Career | Job Portal India"
        description="Discover 50,000+ jobs at MCB. Connect with top employers, build your career. Free job alerts, resume builder & career guidance."
        keywords="jobs, careers, employment, job portal, job search, recruitment, hiring, software engineer jobs, data scientist jobs, marketing jobs, hr jobs, remote jobs, work from home"
        canonical="https://mcb.com"
        ogTitle="MCB Jobs - Find Your Dream Career | Job Portal India"
        ogDescription="Discover 50,000+ jobs at MCB. Connect with top employers, build your career. Free job alerts, resume builder & career guidance."
        ogImage="https://mcb.com/logo.png"
        ogUrl="https://mcb.com"
      />
      
      {/* Organization Schema */}
      <OrganizationSchema />
      
      {/* Website Schema */}
      <WebsiteSchema />
      
      {/* Hero Section */}
      <section className="hero-section">
        {/* 3D Background Elements */}
        <div className="hero-3d-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
            <div className="shape shape-5"></div>
            <div className="shape shape-6"></div>
          </div>
          <div className="particle-field">
            {Array.from({ length: 50 }).map((_, i) => (
              <div key={i} className="particle" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}></div>
            ))}
          </div>
        </div>
        
        <div className="hero-container">
          <div className="hero-layout">
            {/* Left Side - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="hero-content"
            >
              <h1 className="hero-title">
                Find Your <span className="highlight">Dream Job</span> with MCB - India's Leading Job Portal
              </h1>
              <p className="hero-subtitle">
                Connect with top companies and discover amazing career opportunities. 
                Join thousands of professionals who found their perfect match.
              </p>
              
              <div className="hero-search">
                <JobSearchBar />
              </div>
            </motion.div>

            {/* Right Side - YouTube Video */}
            <motion.div
              initial={{ opacity: 0, x: 30, rotateY: 15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hero-video-container"
            >
              <iframe 
                width="560" 
                height="315" 
                src="https://www.youtube.com/embed/Imv_Of5TV2g?si=E6oX4Vo_qUjvpChr" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                className="hero-youtube-video"
              ></iframe>
            </motion.div>
          </div>
        </div>
          </section>


          {/* Remote Jobs Section */}
          <section className="remote-jobs-section">
            <div className="remote-jobs-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <div className="section-badge">
            <Globe className="badge-icon" />
            <span className="badge-text-white">Work from Anywhere</span>
          </div>
          <h2 className="section-title">
            Explore 50,000+ Jobs Across Top Companies
          </h2>
          <p className="section-subtitle">
            Find flexible opportunities that let you work from anywhere in the world
          </p>
          {apiError && (
            <div className="api-error-message" style={{
              background: '#fee2e2',
              color: '#dc2626',
              padding: '12px 16px',
              borderRadius: '8px',
              marginTop: '16px',
              border: '1px solid #fecaca',
              fontSize: '14px'
            }}>
              ⚠️ {apiError}
            </div>
          )}
        </motion.div>

              {isLoadingRemote ? (
                <div className="jobs-loading">
                  <div className="loading-spinner" />
                  <p>Loading remote jobs...</p>
                </div>
              ) : (
                <div className="compact-jobs-grid" key={`remote-${forceRender}`}>
                  {(remoteJobs || []).map((job, index) => (
                    <motion.div
                      key={`${job.id}-${forceRender}`}
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
                      className="compact-job-card"
                      data-force-render={forceRender}
                    >
                      <div className="job-badge">
                        <span className="remote-badge-text">Remote</span>
                      </div>
                      <div className="job-content">
                        <h3 className="job-title">{job.title}</h3>
                        <p className="job-company">{job.company}</p>
                        <div className="job-details">
                          <div className="job-location">
                            <MapPin className="detail-icon" />
                            <span>{job.location}</span>
                          </div>
                          <div className="job-experience">
                            <Briefcase className="detail-icon" />
                            <span>
                              {(() => {
                                if (!job.experience) return 'Experience not specified';
                                if (typeof job.experience === 'string') return job.experience;
                                if (job.experience.min && job.experience.max) {
                                  return `${job.experience.min}-${job.experience.max} years`;
                                }
                                return 'Experience not specified';
                              })()}
                            </span>
                          </div>
                        </div>
                        <div className="job-actions">
                          <button 
                            className="homepage-apply-btn remote-apply-btn"
                            onClick={() => handleApplyClick(job.id)}
                            style={{
                              marginTop: '0.75rem',
                              marginBottom: '0',
                              padding: '12px 16px',
                              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              width: '100%',
                              minHeight: '44px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              textAlign: 'center',
                              whiteSpace: 'nowrap',
                              lineHeight: '1',
                              boxSizing: 'border-box',
                              transition: 'all 0.2s ease',
                              textDecoration: 'none',
                              outline: 'none'
                            }}
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="section-footer"
              >
                <a href="/jobs?location=remote" className="view-all-btn">
                  <span className="view-all-remote-text">View All Remote Jobs</span>
                  <ArrowRight className="btn-icon" />
                </a>
              </motion.div>
            </div>
          </section>

          {/* Domain Jobs Section */}
          <section className="domain-jobs-section">
            <div className="domain-jobs-container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="section-header"
              >
                <div className="section-badge">
                  <Briefcase className="badge-icon" />
                  <span className="badge-text-specialized">Specialized Roles</span>
                </div>
                <h2 className="section-title">
                  Popular Job Categories
                </h2>
                <p className="section-subtitle">
                  Explore specialized positions across various domains and industries
                </p>
                
                {/* Domain Categories */}
                <div className="domain-categories">
                  <div className="category-tag category-tag-it">IT</div>
                  <div className="category-tag category-tag-sales">Sales</div>
                  <div className="category-tag category-tag-finance">Finance</div>
                  <div className="category-tag category-tag-marketing">Marketing</div>
                  <div className="category-tag category-tag-telesales">Telesales</div>
                  <div className="category-tag category-tag-hr">HR</div>
                  <div className="category-tag category-tag-other">Other</div>
                </div>
              </motion.div>

              {isLoadingDomain ? (
                <div className="jobs-loading">
                  <div className="loading-spinner" />
                  <p>Loading domain jobs...</p>
                </div>
              ) : (
                <div className="compact-jobs-grid" key={`domain-${forceRender}`}>
                  {(domainJobs || []).map((job, index) => (
                    <motion.div
                      key={`${job.id}-${forceRender}`}
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
                      className="compact-job-card domain-card"
                      data-force-render={forceRender}
                    >
                      <div className="job-badge domain-badge">
                        <span className="specialized-badge-text">Specialized</span>
                      </div>
                      <div className="job-content">
                        <h3 className="job-title">{job.title}</h3>
                        <p className="job-company">{job.company}</p>
                        <div className="job-details">
                          <div className="job-location">
                            <MapPin className="detail-icon" />
                            <span>{job.location}</span>
                          </div>
                          <div className="job-experience">
                            <Briefcase className="detail-icon" />
                            <span>
                              {(() => {
                                if (!job.experience) return 'Experience not specified';
                                if (typeof job.experience === 'string') return job.experience;
                                if (job.experience.min && job.experience.max) {
                                  return `${job.experience.min}-${job.experience.max} years`;
                                }
                                return 'Experience not specified';
                              })()}
                            </span>
                          </div>
                        </div>
                        <div className="job-actions">
                          <button 
                            className="homepage-domain-apply-btn specialized-apply-btn"
                            onClick={() => handleApplyClick(job.id)}
                            style={{
                              marginTop: '0.75rem',
                              marginBottom: '0',
                              padding: '12px 16px',
                              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              width: '100%',
                              minHeight: '44px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              textAlign: 'center',
                              whiteSpace: 'nowrap',
                              lineHeight: '1',
                              boxSizing: 'border-box',
                              transition: 'all 0.2s ease',
                              textDecoration: 'none',
                              outline: 'none'
                            }}
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="section-footer"
              >
                <a href="/jobs?type=domain" className="view-all-btn">
                  <span className="view-all-domain-text">View All Domain Jobs</span>
                  <ArrowRight className="btn-icon" />
                </a>
              </motion.div>
            </div>
          </section>


      {/* Compact Features Section */}
      <section className="compact-features-section">
        <div className="compact-features-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-header-compact"
          >
            <div className="section-badge-compact">
              <Star className="badge-icon" />
              <span>Why Choose Us?</span>
            </div>
            <h2 className="section-title-compact">
              Why Choose MCB?
            </h2>
            <p className="section-subtitle-compact">
              Experience the future of job searching with our cutting-edge platform
            </p>
          </motion.div>

          <div className="compact-features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -8,
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
                className="compact-feature-card"
              >
                <div className="feature-icon-compact">
                      <feature.icon className="icon" />
                    <div className="icon-glow"></div>
                  </div>
                <div className="feature-content-compact">
                  <h3 className="feature-title-compact">{feature.title}</h3>
                  <p className="feature-description-compact">{feature.description}</p>
                </div>
                <div className="feature-accent"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="cta-content"
          >
            <h2 className="cta-title">Ready to Start Your Journey?</h2>
            <p className="cta-subtitle">
              Join thousands of professionals who found their dream jobs with us
            </p>
            <div className="cta-buttons">
              <a href="/signup" className="cta-btn primary">
                Get Started Free
              </a>
              <a href="/jobs" className="cta-btn secondary">
                Browse Jobs
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Collaboration Section */}
      <section className="collaboration-section">
        <div className="collaboration-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <div className="section-badge">
              <Shield className="badge-icon" />
              <span className="badge-text-trusted">Trusted Partnerships</span>
            </div>
            <h2 className="section-title">
              WE <span className="highlight-text">COLLABORATED</span> WITH
            </h2>
            <p className="section-subtitle">
              Proud to partner with leading government organizations and industry bodies 
              to provide the best opportunities for job seekers.
            </p>
          </motion.div>

          <div className="collab-icons-grid">
            {collaborations.map((collaboration, index) => (
              <motion.div
                key={collaboration.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 100,
                  damping: 12
                }}
                whileHover={{ 
                  scale: 1.1,
                  transition: { duration: 0.2 }
                }}
                drag
                dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
                dragElastic={0.1}
                dragMomentum={false}
                whileDrag={{ 
                  scale: 1.15,
                  rotate: 5,
                  zIndex: 1000,
                  boxShadow: "0 25px 80px rgba(59, 130, 246, 0.3)"
                }}
                className="collab-icon-item draggable-icon"
                title={`${collaboration.name} - Drag to move`}
              >
                <img 
                  src={collaboration.logo} 
                  alt={collaboration.name}
                  className="collab-icon-image"
                />
                <div className="drag-indicator">
                  <div className="drag-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;