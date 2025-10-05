import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin as Location,
  Calendar,
  Save,
  Facebook,
  Twitter,
  Linkedin,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usersAPI } from '../../services/api';
import { useCompanyProfile } from '../../hooks/useCompanyProfile';
import EmployerLayout from '../../components/employer/EmployerLayout';
import './CompanyProfile.css';

const CompanyProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, isEmployer } = useAuth();
  const { companyProfile, isLoadingProfile, refreshCompanyProfile } = useCompanyProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    // Company Details
    companyName: user?.companyName || '',
    companyEmail: user?.email || '',
    website: '',
    foundedDate: '',
    category: '',
    country: 'London',
    description: '',
    
    // Contact Information
    phone: '',
    contactEmail: '',
    contactCountry: 'India',
    city: 'Delhi',
    zip: '',
    address: '',
    
    // Social Links
    facebook: '',
    twitter: '',
    google: '',
    linkedin: ''
  });

  const categories = [
    'Web Designer',
    'IT',
    'Marketing',
    'Software Development',
    'Data Science',
    'Digital Marketing',
    'E-commerce',
    'Finance',
    'Healthcare',
    'Education',
    'Real Estate',
    'Consulting',
    'Manufacturing',
    'Retail',
    'Other'
  ];

  const countries = [
    'London',
    'United States',
    'Canada',
    'Australia',
    'Germany',
    'France',
    'India',
    'Singapore',
    'Japan',
    'Brazil',
    'Other'
  ];

  // Load company profile data and update form
  useEffect(() => {
    if (companyProfile) {
      // Update form data with real company data
      setFormData({
        // Company Details - STRICT: Only use companyName field
        companyName: companyProfile.companyName || user?.companyName || '',
        companyEmail: companyProfile.email || user?.email || '',
        website: companyProfile.website || '',
        foundedDate: companyProfile.foundedYear || '',
        category: companyProfile.industry || '',
        country: companyProfile.country || 'London',
        description: companyProfile.companyDescription || companyProfile.description || '',
        
        // Contact Information
        phone: companyProfile.phone || '',
        contactEmail: companyProfile.email || '',
        contactCountry: companyProfile.country || 'India',
        city: companyProfile.city || companyProfile.location || 'Delhi',
        zip: companyProfile.postcode || '',
        address: companyProfile.fullAddress || companyProfile.address || '',
        
        // Social Links
        facebook: companyProfile.facebook || '',
        twitter: companyProfile.twitter || '',
        google: companyProfile.google || '',
        linkedin: companyProfile.linkedin || ''
      });
    }
  }, [companyProfile, user]);

  // Redirect if not authorized
  useEffect(() => {
    if (!user || !isEmployer()) {
      navigate('/login');
    }
  }, [user, isEmployer, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!formData.companyEmail.trim()) {
      newErrors.companyEmail = 'Company email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.companyEmail)) {
      newErrors.companyEmail = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Company description is required';
    }

    // URL validation for website and social links
    const urlFields = ['website', 'facebook', 'twitter', 'google', 'linkedin'];
    urlFields.forEach(field => {
      const value = formData[field as keyof typeof formData];
      if (value && !/^https?:\/\/.+/.test(value)) {
        newErrors[field] = 'Please enter a valid URL starting with http:// or https://';
      }
    });

    // Email validation for contact email
    if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    // Zip code validation
    if (formData.zip && !/^\d+$/.test(formData.zip)) {
      newErrors.zip = 'Zip code must contain only numbers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!user || !validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccess('');
    
    try {
      // Update company profile via API
      await usersAPI.updateUser(user.id, {
        companyName: formData.companyName,
        email: formData.companyEmail,
        website: formData.website,
        foundedYear: formData.foundedDate,
        industry: formData.category,
        country: formData.country,
        companyDescription: formData.description,
        phone: formData.phone,
        city: formData.city,
        postcode: formData.zip,
        fullAddress: formData.address,
        facebook: formData.facebook,
        twitter: formData.twitter,
        google: formData.google,
        linkedin: formData.linkedin
      } as any);
      
      setSuccess('Company profile updated successfully!');
      
      // Refresh company profile data to reflect changes
      await refreshCompanyProfile();
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Error updating company profile:', error);
      setErrors({ general: 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <EmployerLayout>
        <div className="comp-prof-profile-page">
          <div className="comp-prof-loading">
            <div className="comp-prof-loading-spinner"></div>
            <p>Loading company profile...</p>
          </div>
        </div>
      </EmployerLayout>
    );
  }

  return (
    <EmployerLayout>
      <div className="comp-prof-profile-page">
        <div className="comp-prof-profile-container">
        {/* Header */}
        <div className="comp-prof-header">
          <button 
            onClick={() => navigate('/employer/dashboard')}
            className="comp-prof-back-btn"
          >
            <ArrowLeft className="comp-prof-back-icon" />
            <span>Back to Dashboard</span>
          </button>
          <div className="comp-prof-header-content">
            <h1 className="comp-prof-title">Company Profile</h1>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="comp-prof-success-message"
          >
            <CheckCircle className="comp-prof-success-icon" />
            <span>{success}</span>
          </motion.div>
        )}

        {/* General Error */}
        {errors.general && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="comp-prof-error-message"
          >
            <AlertCircle className="comp-prof-error-icon" />
            <span>{errors.general}</span>
          </motion.div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="comp-prof-form">
          {/* Company Details Section */}
          <div className="comp-prof-section">
            <h2 className="comp-prof-section-title">
              <Building2 className="comp-prof-section-icon" />
              Company Details
            </h2>
            <div className="comp-prof-form-grid">
              <div className="comp-prof-group">
                <label className="comp-prof-label required">
                  Company Name
                </label>
                <input 
                  type="text" 
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Enter Company Name"
                  className={`comp-prof-input ${errors.companyName ? 'comp-prof-error' : ''}`}
                />
                {errors.companyName && <span className="comp-prof-error-text">{errors.companyName}</span>}
              </div>

              <div className="comp-prof-group">
                <label className="comp-prof-label required">
                  <Mail className="comp-prof-label-icon" />
                  Your Email
                </label>
                <input 
                  type="email" 
                  name="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleInputChange}
                  placeholder="info@gmail.com"
                  className={`comp-prof-input ${errors.companyEmail ? 'comp-prof-error' : ''}`}
                />
                {errors.companyEmail && <span className="comp-prof-error-text">{errors.companyEmail}</span>}
              </div>

              <div className="comp-prof-group">
                <label className="comp-prof-label">
                  <Globe className="comp-prof-label-icon" />
                  Website
                </label>
                <input 
                  type="url" 
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="Website Link"
                  className={`comp-prof-input ${errors.website ? 'comp-prof-error' : ''}`}
                />
                {errors.website && <span className="comp-prof-error-text">{errors.website}</span>}
              </div>

              <div className="comp-prof-group">
                <label className="comp-prof-label">
                  <Calendar className="comp-prof-label-icon" />
                  Founded Date
                </label>
                <input 
                  type="date" 
                  name="foundedDate"
                  value={formData.foundedDate}
                  onChange={handleInputChange}
                  className="comp-prof-input"
                />
              </div>

              <div className="comp-prof-group">
                <label className="comp-prof-label required">
                  Category
                </label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`comp-prof-select ${errors.category ? 'comp-prof-error' : ''}`}
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <span className="comp-prof-error-text">{errors.category}</span>}
              </div>

              <div className="comp-prof-group">
                <label className="comp-prof-label">
                  Country
                </label>
                <select 
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="comp-prof-select"
                >
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="comp-prof-group">
              <label className="comp-prof-label required">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`comp-prof-textarea ${errors.description ? 'comp-prof-error' : ''}`}
                rows={4}
                placeholder="Tell candidates about your company, culture, and mission..."
              />
              {errors.description && <span className="comp-prof-error-text">{errors.description}</span>}
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="comp-prof-section">
            <h2 className="comp-prof-section-title">
              <Phone className="comp-prof-section-icon" />
              Contact Information
            </h2>
            <div className="comp-prof-form-grid">
              <div className="comp-prof-group">
                <label className="comp-prof-label required">
                  <Phone className="comp-prof-label-icon" />
                  Phone
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 123 456 7890"
                  className={`comp-prof-input ${errors.phone ? 'comp-prof-error' : ''}`}
                />
                {errors.phone && <span className="comp-prof-error-text">{errors.phone}</span>}
              </div>

              <div className="comp-prof-group">
                <label className="comp-prof-label">
                  <Mail className="comp-prof-label-icon" />
                  Email
                </label>
                <input 
                  type="email" 
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="example@gmail.com"
                  className={`comp-prof-input ${errors.contactEmail ? 'comp-prof-error' : ''}`}
                />
                {errors.contactEmail && <span className="comp-prof-error-text">{errors.contactEmail}</span>}
              </div>

              <div className="comp-prof-group">
                <label className="comp-prof-label">
                  Country
                </label>
                <select 
                  name="contactCountry"
                  value={formData.contactCountry}
                  onChange={handleInputChange}
                  className="comp-prof-select"
                >
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div className="comp-prof-group">
                <label className="comp-prof-label">
                  <Location className="comp-prof-label-icon" />
                  City
                </label>
                <input 
                  type="text" 
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Delhi"
                  className="comp-prof-input"
                />
              </div>

              <div className="comp-prof-group">
                <label className="comp-prof-label">
                  Zip
                </label>
                <input 
                  type="text" 
                  name="zip"
                  value={formData.zip}
                  onChange={handleInputChange}
                  placeholder="504030"
                  className={`comp-prof-input ${errors.zip ? 'comp-prof-error' : ''}`}
                />
                {errors.zip && <span className="comp-prof-error-text">{errors.zip}</span>}
              </div>

              <div className="comp-prof-group">
                <label className="comp-prof-label">
                  Address
                </label>
                <input 
                  type="text" 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="New York City"
                  className="comp-prof-input"
                />
              </div>
            </div>
          </div>

          {/* Social Links Section */}
          <div className="comp-prof-section">
            <h2 className="comp-prof-section-title">
              <Globe className="comp-prof-section-icon" />
              Social Links
            </h2>
            <div className="comp-prof-form-grid">
              <div className="comp-prof-group">
                <label className="comp-prof-label">
                  <Facebook className="comp-prof-label-icon" />
                  Facebook
                </label>
                <input 
                  type="url" 
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  placeholder="https://www.facebook.com/"
                  className={`comp-prof-input ${errors.facebook ? 'comp-prof-error' : ''}`}
                />
                {errors.facebook && <span className="comp-prof-error-text">{errors.facebook}</span>}
              </div>

              <div className="comp-prof-group">
                <label className="comp-prof-label">
                  <Twitter className="comp-prof-label-icon" />
                  Twitter
                </label>
                <input 
                  type="url" 
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  placeholder="https://www.twitter.com/"
                  className={`comp-prof-input ${errors.twitter ? 'comp-prof-error' : ''}`}
                />
                {errors.twitter && <span className="comp-prof-error-text">{errors.twitter}</span>}
              </div>

              <div className="comp-prof-group">
                <label className="comp-prof-label">
                  <Globe className="comp-prof-label-icon" />
                  Google
                </label>
                <input 
                  type="url" 
                  name="google"
                  value={formData.google}
                  onChange={handleInputChange}
                  placeholder="https://www.google.com/"
                  className={`comp-prof-input ${errors.google ? 'comp-prof-error' : ''}`}
                />
                {errors.google && <span className="comp-prof-error-text">{errors.google}</span>}
              </div>

              <div className="comp-prof-group">
                <label className="comp-prof-label">
                  <Linkedin className="comp-prof-label-icon" />
                  LinkedIn
                </label>
                <input 
                  type="url" 
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  placeholder="https://www.linkedin.com/"
                  className={`comp-prof-input ${errors.linkedin ? 'comp-prof-error' : ''}`}
                />
                {errors.linkedin && <span className="comp-prof-error-text">{errors.linkedin}</span>}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="comp-prof-form-actions">
            <button
              type="button"
              onClick={() => navigate('/employer/dashboard')}
              className="comp-prof-back-btn-action"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="comp-prof-update-btn"
            >
              {isLoading ? (
                <div className="comp-prof-loading-spinner" />
              ) : (
                <>
                  <Save className="comp-prof-btn-icon" />
                  <span>Update Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
        </div>
      </div>
    </EmployerLayout>
  );
};

export default CompanyProfile;
