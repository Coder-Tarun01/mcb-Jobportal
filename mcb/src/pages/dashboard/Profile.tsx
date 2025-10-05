import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { usersAPI } from '../../services/api';
import './Profile.css';

const Profile: React.FC = () => {
  const { user, isEmployee } = useAuth();
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    professionalTitle: '',
    languages: '',
    age: '',
    currentSalary: '',
    expectedSalary: '',
    description: '',
    // Contact Information
    phone: '',
    email: '',
    country: '',
    postcode: '',
    city: '',
    fullAddress: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Load user data from API
        const userData = await usersAPI.fetchUserById(user.id);
        
        setFormData({
          name: userData.name || '',
          professionalTitle: (userData as any).professionalTitle || (userData as any).jobTitle || '',
          languages: (userData as any).languages || '',
          age: (userData as any).age || '',
          currentSalary: (userData as any).currentSalary || '',
          expectedSalary: (userData as any).expectedSalary || '',
          description: (userData as any).description || (userData as any).bio || '',
          phone: userData.phone || '',
          email: userData.email || '',
          country: (userData as any).country || '',
          postcode: (userData as any).postcode || '',
          city: (userData as any).city || (userData as any).location || '',
          fullAddress: (userData as any).fullAddress || (userData as any).address || ''
        });
      } catch (error) {
        console.error('Error loading user data:', error);
        setMessage({ type: 'error', text: 'Failed to load profile data' });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    
    setIsSaving(true);
    setMessage(null);
    
    try {
      await usersAPI.updateUser(user.id, {
        name: formData.name,
        professionalTitle: formData.professionalTitle,
        languages: formData.languages,
        age: formData.age,
        currentSalary: formData.currentSalary,
        expectedSalary: formData.expectedSalary,
        description: formData.description,
        phone: formData.phone,
        country: formData.country,
        postcode: formData.postcode,
        city: formData.city,
        fullAddress: formData.fullAddress
      } as any);
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: 'Failed to save profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile data...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Message Display */}
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Basic Information Section */}
      <div className="basic-info-section">
        <h2 className="section-heading">BASIC INFORMATION</h2>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Your Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. John Doe"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Professional Title:</label>
            <input
              type="text"
              name="professionalTitle"
              value={formData.professionalTitle}
              onChange={handleInputChange}
              placeholder="e.g. Web Developer, Designer"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Languages:</label>
            <input
              type="text"
              name="languages"
              value={formData.languages}
              onChange={handleInputChange}
              placeholder="e.g. English, Spanish, French"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Age:</label>
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="e.g. 25 Years"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Current Salary ($):</label>
            <input
              type="text"
              name="currentSalary"
              value={formData.currentSalary}
              onChange={handleInputChange}
              placeholder="e.g. 50000"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Expected Salary:</label>
            <input
              type="text"
              name="expectedSalary"
              value={formData.expectedSalary}
              onChange={handleInputChange}
              placeholder="e.g. 60000"
              className="form-input"
            />
          </div>
        </div>
        <div className="form-group full-width">
          <label className="form-label">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Tell us about yourself, your experience, and what makes you unique..."
            className="form-input"
            rows={4}
          />
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="contact-info-section">
        <h2 className="section-heading">CONTACT INFORMATION</h2>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="e.g. +1 234 567 8900"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="e.g. john.doe@email.com"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Country:</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="e.g. United States"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Postcode:</label>
            <input
              type="text"
              name="postcode"
              value={formData.postcode}
              onChange={handleInputChange}
              placeholder="e.g. 12345"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">City:</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="e.g. New York"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Full Address:</label>
            <input
              type="text"
              name="fullAddress"
              value={formData.fullAddress}
              onChange={handleInputChange}
              placeholder="e.g. 123 Main St, Apt 4B"
              className="form-input"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="save-section">
        <button 
          className="save-btn" 
          onClick={handleSaveSettings}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default Profile;

