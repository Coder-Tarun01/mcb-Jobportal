import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Upload,
  Check,
  X
} from 'lucide-react';
import './RegisterProfessional.css';

interface FormData {
  name: string;
  email: string;
  password: string;
  mobile: string;
  currentCity: string;
  resume: File | null;
  agreeToTerms: boolean;
  // Employment fields
  currentDestination: string;
  currentCompany: string;
  expectedSalaryUSD: string;
  expectedSalaryINR: string;
  annualSalary: string;
  workingSinceYear: string;
  workingSinceMonth: string;
  currentLocation: string;
  noticePeriod: string;
  skills: string[];
  industry: string;
  functionalArea: string;
  role: string;
  // Education fields
  highestQualification: string;
  course: string;
  specialization: string;
  university: string;
  courseType: string;
  passingYear: string;
  education: string;
}

const RegisterProfessional: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    mobile: '',
    currentCity: '',
    resume: null,
    agreeToTerms: false,
    // Employment fields
    currentDestination: '',
    currentCompany: '',
    expectedSalaryUSD: '',
    expectedSalaryINR: '',
    annualSalary: '',
    workingSinceYear: '',
    workingSinceMonth: '',
    currentLocation: '',
    noticePeriod: '05 Days',
    skills: [],
    industry: '',
    functionalArea: '',
    role: '',
    // Education fields
    highestQualification: '',
    course: '',
    specialization: '',
    university: '',
    courseType: 'Full Time',
    passingYear: '',
    education: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSkillsChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const input = e.currentTarget;
      const skill = input.value.trim();
      
      if (skill && !formData.skills.includes(skill)) {
        setFormData(prev => ({
          ...prev,
          skills: [...prev.skills, skill]
        }));
        input.value = '';
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        resume: file
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    if (!formData.currentCity.trim()) newErrors.currentCity = 'Current city is required';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms and conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Professional registration data:', formData);
      alert('Registration successful! Please check your email for verification.');
      navigate('/login');
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal', active: true },
    { id: 'employment', label: 'Employment', active: false },
    { id: 'education', label: 'Education', active: false }
  ];

  return (
    <div className="reg-prof-professional-page">
      <div className="register-container">
        <div className="register-header">
          <button onClick={() => navigate('/register')} className="back-btn">
            <ArrowLeft className="btn-icon" />
            <span>Back</span>
          </button>
          <h1 className="register-title">Register as a Professional</h1>
        </div>

        <div className="register-content">
          <div className="reg-prof-section">
            {/* Tab Navigation */}
            <div className="tab-navigation">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="register-form">
              {activeTab === 'personal' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="tab-content"
                >
                  <div className="reg-prof-group">
                    <label className="reg-prof-label">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter Full Name"
                      className={`reg-prof-input ${errors.name ? 'error' : ''}`}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>

                  <div className="reg-prof-group">
                    <label className="reg-prof-label">Email ID*</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter Your Email"
                      className={`reg-prof-input ${errors.email ? 'error' : ''}`}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  <div className="reg-prof-group">
                    <label className="reg-prof-label">Create Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Minimum 6 characters"
                      className={`reg-prof-input ${errors.password ? 'error' : ''}`}
                    />
                    {errors.password && <span className="error-message">{errors.password}</span>}
                  </div>

                  <div className="reg-prof-group">
                    <label className="reg-prof-label">Mobile number</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="+91 123 456 7890"
                      className={`reg-prof-input ${errors.mobile ? 'error' : ''}`}
                    />
                    {errors.mobile && <span className="error-message">{errors.mobile}</span>}
                  </div>

                  <div className="reg-prof-group">
                    <label className="reg-prof-label">Current City</label>
                    <input
                      type="text"
                      name="currentCity"
                      value={formData.currentCity}
                      onChange={handleInputChange}
                      placeholder="Tell us about your current city"
                      className={`reg-prof-input ${errors.currentCity ? 'error' : ''}`}
                    />
                    {errors.currentCity && <span className="error-message">{errors.currentCity}</span>}
                  </div>

                  <div className="reg-prof-group">
                    <label className="reg-prof-label">Upload Resume</label>
                    <div className="file-upload-container">
                      <input
                        type="file"
                        id="resume"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="file-input"
                      />
                      <label htmlFor="resume" className="file-upload-btn">
                        <Upload className="upload-icon" />
                        Upload File
                      </label>
                      {formData.resume ? (
                        <span className="file-name">{formData.resume.name}</span>
                      ) : (
                        <span className="file-placeholder">No file chosen</span>
                      )}
                    </div>
                    <p className="file-help">
                      If you do not have a resume document, you may write your brief professional profile{' '}
                      <button type="button" className="profile-link">here</button>.
                    </p>
                  </div>

                  <div className="reg-prof-group checkbox-group">
                    <div 
                      className={`checkbox-wrapper ${formData.agreeToTerms ? 'checked' : ''}`} 
                      onClick={() => setFormData(prev => ({ ...prev, agreeToTerms: !prev.agreeToTerms }))}
                    >
                      <div className="checkbox-custom">
                        {formData.agreeToTerms && <Check className="check-icon" />}
                      </div>
                      <span className="checkbox-text">I agree to the Terms and Conditions and Privacy Policy</span>
                    </div>
                    {errors.agreeToTerms && <span className="error-message">{errors.agreeToTerms}</span>}
                  </div>

                  <button type="submit" className="register-btn">
                    Register Now
                  </button>
                </motion.div>
              )}

              {activeTab === 'employment' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="tab-content"
                >
                  <div className="reg-prof-group">
                    <label className="reg-prof-label">Current Destination*</label>
                    <input
                      type="text"
                      name="currentDestination"
                      value={formData.currentDestination}
                      onChange={handleInputChange}
                      placeholder="Your Job Title"
                      className={`reg-prof-input ${errors.currentDestination ? 'error' : ''}`}
                    />
                    {errors.currentDestination && <span className="error-message">{errors.currentDestination}</span>}
                  </div>

                  <div className="reg-prof-group">
                    <label className="reg-prof-label">Current Company*</label>
                    <input
                      type="text"
                      name="currentCompany"
                      value={formData.currentCompany}
                      onChange={handleInputChange}
                      placeholder="Where you are currently working"
                      className={`reg-prof-input ${errors.currentCompany ? 'error' : ''}`}
                    />
                    {errors.currentCompany && <span className="error-message">{errors.currentCompany}</span>}
                  </div>

                  <div className="reg-prof-group">
                    <label className="reg-prof-label">Expected Salary</label>
                    <div className="salary-group">
                      <div className="salary-item">
                        <label className="salary-label">US Dollars</label>
                        <input
                          type="number"
                          name="expectedSalaryUSD"
                          value={formData.expectedSalaryUSD}
                          onChange={handleInputChange}
                          placeholder="0"
                          className="reg-prof-input salary-input"
                        />
                      </div>
                      <div className="salary-item">
                        <label className="salary-label">Indian Rupees</label>
                        <input
                          type="number"
                          name="expectedSalaryINR"
                          value={formData.expectedSalaryINR}
                          onChange={handleInputChange}
                          placeholder="0"
                          className="reg-prof-input salary-input"
                        />
                      </div>
                      <div className="salary-item">
                        <label className="salary-label">Annual Salary</label>
                        <input
                          type="number"
                          name="annualSalary"
                          value={formData.annualSalary}
                          onChange={handleInputChange}
                          placeholder="0"
                          className="reg-prof-input salary-input"
                        />
                        <span className="salary-range">0 lakh – 05 Thousand</span>
                      </div>
                    </div>
                  </div>

                  <div className="reg-prof-group">
                    <label className="reg-prof-label">Working Since</label>
                    <div className="working-since-group">
                      <select
                        name="workingSinceYear"
                        value={formData.workingSinceYear}
                        onChange={handleInputChange}
                        className="reg-prof-select working-since-select"
                      >
                        <option value="">Year</option>
                        {Array.from({ length: 16 }, (_, i) => 2025 - i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      <select
                        name="workingSinceMonth"
                        value={formData.workingSinceMonth}
                        onChange={handleInputChange}
                        className="reg-prof-select working-since-select"
                      >
                        <option value="">Month</option>
                        <option value="Jan">Jan</option>
                        <option value="Feb">Feb</option>
                        <option value="Mar">Mar</option>
                        <option value="Apr">Apr</option>
                        <option value="May">May</option>
                        <option value="Jun">Jun</option>
                        <option value="Jul">Jul</option>
                        <option value="Aug">Aug</option>
                        <option value="Sep">Sep</option>
                        <option value="Oct">Oct</option>
                        <option value="Nov">Nov</option>
                        <option value="Dec">Dec</option>
                      </select>
                    </div>
                  </div>

                  <div className="reg-prof-group">
                    <label className="reg-prof-label">Current Location</label>
                    <input
                      type="text"
                      name="currentLocation"
                      value={formData.currentLocation}
                      onChange={handleInputChange}
                      placeholder="Current location"
                      className="reg-prof-input"
                    />
                  </div>

                  <div className="reg-prof-group">
                    <label className="reg-prof-label">Duration of Notice Period</label>
                    <select
                      name="noticePeriod"
                      value={formData.noticePeriod}
                      onChange={handleInputChange}
                      className="reg-prof-select"
                    >
                      <option value="05 Days">05 Days</option>
                      <option value="15 Days">15 Days</option>
                      <option value="1 Month">1 Month</option>
                      <option value="2 Months">2 Months</option>
                      <option value="3 Months">3 Months</option>
                    </select>
                  </div>

                  <div className="reg-prof-group">
                    <label className="reg-prof-label">Skills*</label>
                    <div className="skills-container">
                      <div className="skills-tags">
                        {formData.skills.map((skill, index) => (
                          <span key={index} className="skill-tag">
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="skill-remove"
                            >
                              <X className="skill-remove-icon" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        onKeyDown={handleSkillsChange}
                        placeholder="HTML, CSS, Bootstrap, Photoshop"
                        className="reg-prof-input skills-input"
                      />
                    </div>
                    {errors.skills && <span className="error-message">{errors.skills}</span>}
                  </div>

                  <div className="reg-prof-group">
                    <label className="reg-prof-label">Industry</label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="reg-prof-select"
                    >
                      <option value="">Your Industry</option>
                      <option value="Technology">Technology</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Education">Education</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Retail">Retail</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>

                  <div className="reg-prof-group">
                    <label className="reg-prof-label">Functional Area</label>
                    <select
                      name="functionalArea"
                      value={formData.functionalArea}
                      onChange={handleInputChange}
                      className="reg-prof-select"
                    >
                      <option value="">Your Department</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Sales">Sales</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                      <option value="Customer Service">Customer Service</option>
                    </select>
                  </div>

                  <div className="reg-prof-group">
                    <label className="reg-prof-label">Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="reg-prof-select"
                    >
                      <option value="">Select the role that you work in</option>
                      <option value="Software Engineer">Software Engineer</option>
                      <option value="Product Manager">Product Manager</option>
                      <option value="Designer">Designer</option>
                      <option value="Data Analyst">Data Analyst</option>
                      <option value="Marketing Manager">Marketing Manager</option>
                      <option value="Sales Representative">Sales Representative</option>
                      <option value="Project Manager">Project Manager</option>
                    </select>
                  </div>

                  <button type="button" className="continue-btn">
                    Continue
                  </button>
                </motion.div>
              )}

              {activeTab === 'education' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="tab-content"
                >
                  <div className="reg-prof-group">
                    <label className="reg-prof-label">Highest Qualification</label>
                    <input
                      type="text"
                      name="highestQualification"
                      value={formData.highestQualification}
                      onChange={handleInputChange}
                      placeholder="Your highest qualification"
                      className="reg-prof-input"
                    />
                  </div>

                  <div className="reg-prof-group">
                    <label className="reg-prof-label">Course</label>
                    <input
                      type="text"
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      placeholder="Your course"
                      className="reg-prof-input"
                    />
                  </div>

                  <div className="reg-prof-group">
                    <label className="reg-prof-label">Specialization</label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      placeholder="Specialization"
                      className="reg-prof-input"
                    />
                  </div>

                  <div className="reg-prof-group">
                    <label className="reg-prof-label">University / College</label>
                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleInputChange}
                      placeholder="Institute Name"
                      className="reg-prof-input"
                    />
                  </div>

                  <div className="reg-prof-group">
                    <label className="reg-prof-label">Course Type</label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="courseType"
                          value="Full Time"
                          checked={formData.courseType === 'Full Time'}
                          onChange={handleInputChange}
                          className="radio-input"
                        />
                        <span className="radio-custom"></span>
                        Full Time
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="courseType"
                          value="Part Time"
                          checked={formData.courseType === 'Part Time'}
                          onChange={handleInputChange}
                          className="radio-input"
                        />
                        <span className="radio-custom"></span>
                        Part Time
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="courseType"
                          value="Correspondence"
                          checked={formData.courseType === 'Correspondence'}
                          onChange={handleInputChange}
                          className="radio-input"
                        />
                        <span className="radio-custom"></span>
                        Correspondence
                      </label>
                    </div>
                  </div>

                  <div className="reg-prof-group">
                    <label className="reg-prof-label">Passing Year</label>
                    <select
                      name="passingYear"
                      value={formData.passingYear}
                      onChange={handleInputChange}
                      className="reg-prof-select"
                    >
                      <option value="">Select</option>
                      {Array.from({ length: 26 }, (_, i) => 2025 - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div className="reg-prof-group">
                    <label className="reg-prof-label">Education</label>
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      placeholder="Additional education details (optional)"
                      className="reg-prof-input"
                    />
                  </div>

                  <button type="button" className="continue-btn">
                    Continue
                  </button>
                </motion.div>
              )}
            </form>
          </div>

          {/* Job Alert Sidebar */}
          <div className="job-alert-sidebar">
            <div className="job-alert-card">
              <h3 className="alert-title">Why should you create a job alert</h3>
              
              <div className="alert-benefits">
                <div className="benefit-item">
                  <Check className="benefit-icon" />
                  <span>Get relevant jobs directly in your inbox</span>
                </div>
                <div className="benefit-item">
                  <Check className="benefit-icon" />
                  <span>Stay updated with latest opportunities</span>
                </div>
                <div className="benefit-item">
                  <Check className="benefit-icon" />
                  <span>Be the first one to apply</span>
                </div>
                <div className="benefit-item">
                  <Check className="benefit-icon" />
                  <span>Create up to 5 personalized job alerts</span>
                </div>
              </div>

              <div className="stats-section">
                <div className="stat-item">
                  <span className="stat-label">Why info@example.com</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">800,000+</span>
                  <span className="stat-label">Jobs</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">100,000+</span>
                  <span className="stat-label">CV searches daily</span>
                </div>
                <p className="industry-note">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry has been the industry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterProfessional;