import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, MapPin, DollarSign, ExternalLink, User, Building2, Briefcase } from 'lucide-react';
import EmployerLayout from '../../components/employer/EmployerLayout';
import Pagination from '../../components/common/Pagination';
import './Resume.css';

interface Candidate {
  id: number;
  name: string;
  jobTitle: string;
  company: string;
  location: string;
  salary: string;
  skills: string[];
  experience: string;
  education: string;
  resumeUrl: string;
  profileImage?: string;
}

const Resume: React.FC = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const candidatesPerPage = 6;

  useEffect(() => {
    // Simulate loading data
    const loadCandidates = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        const response = await fetch('/candidates.json');
        const data = await response.json();
        setCandidates(data);
      } catch (error) {
        console.error('Error loading candidates:', error);
        // Fallback data if JSON file doesn't exist
        setCandidates(getFallbackData());
      }
      setLoading(false);
    };

    loadCandidates();
  }, []);

  const getFallbackData = (): Candidate[] => [
    {
      id: 1,
      name: "Tammy Dixon",
      jobTitle: "UX / UI Designer",
      company: "Atract Solutions",
      location: "Sacramento, California",
      salary: "$2,500",
      skills: ["PHP", "Angular", "Bootstrap"],
      experience: "3+ years",
      education: "BS Design",
      resumeUrl: "/resumes/tammy-dixon.pdf"
    },
    {
      id: 2,
      name: "John Doe",
      jobTitle: "UX / UI Designer",
      company: "Atract Solutions",
      location: "Sacramento, California",
      salary: "$2,500",
      skills: ["PHP", "Angular", "Bootstrap"],
      experience: "2+ years",
      education: "BA Design",
      resumeUrl: "/resumes/john-doe.pdf"
    },
    {
      id: 3,
      name: "Sarah Johnson",
      jobTitle: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      salary: "$120,000 - $150,000",
      skills: ["React", "TypeScript", "Node.js", "AWS", "Docker"],
      experience: "5+ years",
      education: "BS Computer Science",
      resumeUrl: "/resumes/sarah-johnson.pdf"
    },
    {
      id: 4,
      name: "Michael Chen",
      jobTitle: "Full Stack Engineer",
      company: "StartupXYZ",
      location: "New York, NY",
      salary: "$100,000 - $130,000",
      skills: ["Vue.js", "Python", "PostgreSQL", "Redis", "Kubernetes"],
      experience: "4+ years",
      education: "MS Software Engineering",
      resumeUrl: "/resumes/michael-chen.pdf"
    },
    {
      id: 5,
      name: "Emily Rodriguez",
      jobTitle: "UI/UX Designer",
      company: "DesignStudio",
      location: "Austin, TX",
      salary: "$80,000 - $110,000",
      skills: ["Figma", "Adobe XD", "Sketch", "HTML/CSS", "JavaScript"],
      experience: "3+ years",
      education: "BFA Graphic Design",
      resumeUrl: "/resumes/emily-rodriguez.pdf"
    },
    {
      id: 6,
      name: "David Kim",
      jobTitle: "Backend Developer",
      company: "DataFlow Systems",
      location: "Seattle, WA",
      salary: "$110,000 - $140,000",
      skills: ["Java", "Spring Boot", "Microservices", "MongoDB", "Kafka"],
      experience: "6+ years",
      education: "BS Computer Engineering",
      resumeUrl: "/resumes/david-kim.pdf"
    },
    {
      id: 7,
      name: "Lisa Wang",
      jobTitle: "DevOps Engineer",
      company: "CloudTech Solutions",
      location: "Denver, CO",
      salary: "$115,000 - $145,000",
      skills: ["AWS", "Terraform", "Jenkins", "Docker", "Linux"],
      experience: "4+ years",
      education: "MS Information Technology",
      resumeUrl: "/resumes/lisa-wang.pdf"
    },
    {
      id: 8,
      name: "James Wilson",
      jobTitle: "Mobile App Developer",
      company: "AppCraft",
      location: "Miami, FL",
      salary: "$90,000 - $120,000",
      skills: ["React Native", "Flutter", "iOS", "Android", "Firebase"],
      experience: "3+ years",
      education: "BS Mobile Development",
      resumeUrl: "/resumes/james-wilson.pdf"
    }
  ];

  const handleDownload = (candidate: Candidate) => {
    // In a real app, this would trigger a download
    console.log(`Downloading resume for ${candidate.name}`);
    // For demo purposes, we'll just show an alert
    alert(`Downloading resume for ${candidate.name}`);
  };

  const handleNameClick = (candidate: Candidate) => {
    // Redirect to employee dashboard resume page
    navigate('/dashboard', { 
      state: { 
        candidateId: candidate.id,
        candidateName: candidate.name,
        fromResumePage: true 
      } 
    });
  };

  const totalPages = Math.ceil(candidates.length / candidatesPerPage);
  const startIndex = (currentPage - 1) * candidatesPerPage;
  const endIndex = startIndex + candidatesPerPage;
  const currentCandidates = candidates.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <EmployerLayout>
        <div className="resume-page">
          <div className="resume-header">
            <h1 className="resume-title">Resume</h1>
          </div>
          <div className="resume-loading-container">
            <div className="resume-loading-spinner"></div>
            <p>Loading candidates...</p>
          </div>
        </div>
      </EmployerLayout>
    );
  }

  return (
    <EmployerLayout>
      <div className="resume-page">
        <div className="resume-header">
          <h1 className="resume-title">Resume</h1>
        </div>

        <div className="resume-content">
          {candidates.length === 0 ? (
            <div className="resume-no-candidates">
              <div className="resume-no-candidates-icon">
                <User className="resume-icon" />
              </div>
              <h3>No candidates found</h3>
              <p>There are no resumes available at the moment.</p>
            </div>
          ) : (
            <>
              <div className="resume-candidates-stats">
                <span className="resume-stats-text">
                  Showing {startIndex + 1}-{Math.min(endIndex, candidates.length)} of {candidates.length} candidates
                </span>
              </div>

              <div className="resume-candidates-grid">
                {currentCandidates.map((candidate) => (
                  <div key={candidate.id} className="resume-candidate-card">
                    <div className="resume-card-header">
                      <div className="resume-candidate-avatar">
                        <User className="resume-avatar-icon" />
                      </div>
                      <div className="resume-candidate-info">
                        <h3 
                          className="resume-candidate-name resume-clickable-name"
                          onClick={() => handleNameClick(candidate)}
                          title="View candidate profile in dashboard"
                        >
                          {candidate.name}
                          <ExternalLink className="resume-external-link-icon" />
                        </h3>
                        <div className="resume-candidate-role">
                          <Briefcase className="resume-role-icon" />
                          <span>{candidate.jobTitle}</span>
                        </div>
                        <div className="resume-candidate-company">
                          <Building2 className="resume-company-icon" />
                          <span>{candidate.company}</span>
                        </div>
                      </div>
                      <button
                        className="resume-download-button"
                        onClick={() => handleDownload(candidate)}
                        title="Download Resume"
                      >
                        <Download className="resume-download-icon" />
                      </button>
                    </div>

                    <div className="resume-card-details">
                      <div className="resume-detail-item">
                        <MapPin className="resume-detail-icon" />
                        <span>{candidate.location}</span>
                      </div>
                      <div className="resume-detail-item">
                        <DollarSign className="resume-detail-icon" />
                        <span>{candidate.salary}</span>
                      </div>
                    </div>

                    <div className="resume-skills-section">
                      <h4 className="resume-skills-title">Skills</h4>
                      <div className="resume-skills-container">
                        {candidate.skills.map((skill, index) => (
                          <span key={index} className="resume-skill-tag">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="resume-pagination-container">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    showPrevNext={true}
                    maxVisiblePages={5}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </EmployerLayout>
  );
};

export default Resume;
