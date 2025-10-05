import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  FileText,
  Award,
  Star,
  Eye,
  Save
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import EmployerLayout from '../../components/employer/EmployerLayout';
import './CompanyOverview.css';

const CompanyOverview: React.FC = () => {
  const navigate = useNavigate();
  const { user, isEmployer } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (!user || !isEmployer()) {
      navigate('/login');
      return;
    }
  }, [user, navigate, isEmployer]);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  const handlePreview = () => {
    // Open preview modal or navigate to preview page
    console.log('Preview company profile');
  };

  return (
    <EmployerLayout>
      <div className="comp-over-overview-page">
        <div className="comp-over-overview-container">
        {/* Header */}
        <div className="comp-over-header">
          <button 
            onClick={() => navigate('/employer/dashboard')}
            className="comp-over-back-btn"
          >
            <ArrowLeft className="comp-over-back-icon" />
            <span>Back to Dashboard</span>
          </button>
          <div className="comp-over-header-content">
            <h1 className="comp-over-title">Company Overview</h1>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="comp-over-form">
          {/* Company Story Section */}
          <div className="comp-over-form-section">
            <h2 className="comp-over-section-title">
              <FileText className="comp-over-section-icon" />
              Company Story
            </h2>
            <div className="comp-over-form-group">
              <label className="comp-over-form-label">Company Story</label>
              <textarea 
                className="comp-over-form-textarea comp-over-story-textarea" 
                rows={8}
                placeholder="Share your company's journey, mission, and what makes you unique. Tell potential candidates about your history, achievements, and vision for the future..."
              />
              <div className="comp-over-textarea-hint">
                <span className="comp-over-char-count">0 / 1000 characters</span>
              </div>
            </div>
          </div>

          {/* Culture & Values Section */}
          <div className="comp-over-form-section">
            <h2 className="comp-over-section-title">
              <Award className="comp-over-section-icon" />
              Culture & Values
            </h2>
            <div className="comp-over-form-group">
              <label className="comp-over-form-label">Culture & Values</label>
              <textarea 
                className="comp-over-form-textarea comp-over-culture-textarea" 
                rows={6}
                placeholder="Describe your company culture, values, and work environment. What makes your workplace special? How do you support employee growth and well-being?"
              />
              <div className="comp-over-textarea-hint">
                <span className="comp-over-char-count">0 / 800 characters</span>
              </div>
            </div>
          </div>

          {/* Benefits & Perks Section */}
          <div className="comp-over-form-section">
            <h2 className="comp-over-section-title">
              <Star className="comp-over-section-icon" />
              Benefits & Perks
            </h2>
            <div className="comp-over-benefits-grid">
              <div className="comp-over-benefit-category">
                <h3 className="comp-over-category-title">Health & Wellness</h3>
                <div className="comp-over-benefit-items">
                  <label className="comp-over-benefit-item">
                    <input type="checkbox" className="comp-over-benefit-checkbox" />
                    <span>Health Insurance</span>
                  </label>
                  <label className="comp-over-benefit-item">
                    <input type="checkbox" className="comp-over-benefit-checkbox" />
                    <span>Dental Coverage</span>
                  </label>
                  <label className="comp-over-benefit-item">
                    <input type="checkbox" className="comp-over-benefit-checkbox" />
                    <span>Vision Coverage</span>
                  </label>
                  <label className="comp-over-benefit-item">
                    <input type="checkbox" className="comp-over-benefit-checkbox" />
                    <span>Mental Health Support</span>
                  </label>
                  <label className="comp-over-benefit-item">
                    <input type="checkbox" className="comp-over-benefit-checkbox" />
                    <span>Gym Membership</span>
                  </label>
                </div>
              </div>

              <div className="comp-over-benefit-category">
                <h3 className="comp-over-category-title">Work-Life Balance</h3>
                <div className="comp-over-benefit-items">
                  <label className="comp-over-benefit-item">
                    <input type="checkbox" className="comp-over-benefit-checkbox" />
                    <span>Remote Work</span>
                  </label>
                  <label className="comp-over-benefit-item">
                    <input type="checkbox" className="comp-over-benefit-checkbox" />
                    <span>Flexible Hours</span>
                  </label>
                  <label className="comp-over-benefit-item">
                    <input type="checkbox" className="comp-over-benefit-checkbox" />
                    <span>Unlimited PTO</span>
                  </label>
                  <label className="comp-over-benefit-item">
                    <input type="checkbox" className="comp-over-benefit-checkbox" />
                    <span>Paid Time Off</span>
                  </label>
                  <label className="comp-over-benefit-item">
                    <input type="checkbox" className="comp-over-benefit-checkbox" />
                    <span>Sabbatical Leave</span>
                  </label>
                </div>
              </div>

              <div className="comp-over-benefit-category">
                <h3 className="comp-over-category-title">Financial</h3>
                <div className="comp-over-benefit-items">
                  <label className="comp-over-benefit-item">
                    <input type="checkbox" className="comp-over-benefit-checkbox" />
                    <span>401(k) Matching</span>
                  </label>
                  <label className="comp-over-benefit-item">
                    <input type="checkbox" className="comp-over-benefit-checkbox" />
                    <span>Stock Options</span>
                  </label>
                  <label className="comp-over-benefit-item">
                    <input type="checkbox" className="comp-over-benefit-checkbox" />
                    <span>Bonus Programs</span>
                  </label>
                  <label className="comp-over-benefit-item">
                    <input type="checkbox" className="comp-over-benefit-checkbox" />
                    <span>Commuter Benefits</span>
                  </label>
                  <label className="comp-over-benefit-item">
                    <input type="checkbox" className="comp-over-benefit-checkbox" />
                    <span>Life Insurance</span>
                  </label>
                </div>
              </div>

              <div className="comp-over-benefit-category">
                <h3 className="comp-over-category-title">Growth & Development</h3>
                <div className="comp-over-benefit-items">
                  <label className="comp-over-benefit-item">
                    <input type="checkbox" className="comp-over-benefit-checkbox" />
                    <span>Professional Development</span>
                  </label>
                  <label className="comp-over-benefit-item">
                    <input type="checkbox" className="comp-over-benefit-checkbox" />
                    <span>Conference Attendance</span>
                  </label>
                  <label className="comp-over-benefit-item">
                    <input type="checkbox" className="comp-over-benefit-checkbox" />
                    <span>Training Programs</span>
                  </label>
                  <label className="comp-over-benefit-item">
                    <input type="checkbox" className="comp-over-benefit-checkbox" />
                    <span>Mentorship Programs</span>
                  </label>
                  <label className="comp-over-benefit-item">
                    <input type="checkbox" className="comp-over-benefit-checkbox" />
                    <span>Tuition Reimbursement</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="comp-over-form-actions">
            <button
              type="button"
              onClick={() => navigate('/employer/dashboard')}
              className="comp-over-back-btn-action"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePreview}
              className="comp-over-preview-btn"
            >
              <Eye className="comp-over-btn-icon" />
              <span>Preview Profile</span>
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="comp-over-update-btn"
            >
              {isLoading ? (
                <div className="comp-over-loading-spinner" />
              ) : (
                <>
                  <Save className="comp-over-btn-icon" />
                  <span>Save Changes</span>
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

export default CompanyOverview;
