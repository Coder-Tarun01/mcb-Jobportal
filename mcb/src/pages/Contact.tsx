import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  Users,
  Headphones,
  CheckCircle
} from 'lucide-react';
import './Contact.css';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: ['info@mycareerbuild.com', 'support@mycareerbuild.com'],
      description: 'Send us an email anytime'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
      description: 'Mon-Fri 9AM-6PM EST'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['123 Business Ave', 'Suite 100, New York, NY 10001'],
      description: 'Come say hello at our office'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Monday - Friday: 9:00 AM - 6:00 PM', 'Saturday: 10:00 AM - 4:00 PM'],
      description: 'We\'re here to help'
    }
  ];

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Technical Support' },
    { value: 'billing', label: 'Billing Question' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="contact-hero-content"
          >
            <h1 className="contact-hero-title">
              Get in <span className="contact-highlight-text">Touch</span>
            </h1>
            <p className="contact-hero-subtitle">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-content">
        <div className="contact-container">
          <div className="contact-grid">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="contact-info-section"
            >
              <h2 className="contact-section-title">Contact Information</h2>
              <p className="contact-section-subtitle">
                Choose your preferred way to reach us
              </p>

              <div className="contact-info-grid">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="contact-info-card"
                  >
                    <div className="contact-info-icon">
                      <info.icon className="contact-icon" />
                    </div>
                    <div className="contact-info-content">
                      <h3 className="contact-info-title">{info.title}</h3>
                      <p className="contact-info-description">{info.description}</p>
                      <div className="contact-info-details">
                        {info.details.map((detail, idx) => (
                          <span key={idx} className="contact-detail">{detail}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="contact-quick-actions">
                <h3 className="contact-quick-actions-title">Quick Actions</h3>
                <div className="contact-quick-actions-grid">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="contact-quick-action-btn"
                  >
                    <MessageCircle className="contact-btn-icon" />
                    <span>Live Chat</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="contact-quick-action-btn"
                  >
                    <Headphones className="contact-btn-icon" />
                    <span>Schedule Call</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="contact-quick-action-btn"
                  >
                    <Users className="contact-btn-icon" />
                    <span>Join Community</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="contact-form-section"
            >
              <div className="contact-form-container">
                <h2 className="contact-form-title">Send us a Message</h2>
                <p className="contact-form-subtitle">
                  Fill out the form below and we'll get back to you within 24 hours
                </p>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="contact-success-message"
                  >
                    <CheckCircle className="contact-success-icon" />
                    <h3>Message Sent Successfully!</h3>
                    <p>Thank you for contacting us. We'll get back to you soon.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="contact-form-group">
                      <label htmlFor="name" className="contact-form-label">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="contact-form-input"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="contact-form-group">
                      <label htmlFor="email" className="contact-form-label">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="contact-form-input"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    <div className="contact-form-group">
                      <label htmlFor="inquiryType" className="contact-form-label">Inquiry Type</label>
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleInputChange}
                        className="contact-form-select"
                      >
                        {inquiryTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="contact-form-group">
                      <label htmlFor="subject" className="contact-form-label">Subject *</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="contact-form-input"
                        placeholder="What's this about?"
                        required
                      />
                    </div>

                    <div className="contact-form-group">
                      <label htmlFor="message" className="contact-form-label">Message *</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="contact-form-textarea"
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                        required
                      />
                    </div>

                    <motion.button
                      type="submit"
                      className="contact-submit-btn"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="contact-loading-spinner" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="contact-btn-icon" />
                          <span>Send Message</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="contact-faq">
        <div className="contact-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="contact-faq-content"
          >
            <h2 className="contact-faq-title">Frequently Asked Questions</h2>
            <p className="contact-faq-subtitle">
              Can't find what you're looking for? Contact us directly.
            </p>

            <div className="contact-faq-grid">
              <div className="contact-faq-item">
                <h3 className="contact-faq-question">How quickly do you respond?</h3>
                <p className="contact-faq-answer">
                  We typically respond to all inquiries within 24 hours during business days.
                </p>
              </div>
              <div className="contact-faq-item">
                <h3 className="contact-faq-question">Do you offer phone support?</h3>
                <p className="contact-faq-answer">
                  Yes, we provide phone support during business hours. Call us at +1 (555) 123-4567.
                </p>
              </div>
              <div className="contact-faq-item">
                <h3 className="contact-faq-question">Can I schedule a meeting?</h3>
                <p className="contact-faq-answer">
                  Absolutely! Use our "Schedule Call" button above to book a convenient time.
                </p>
              </div>
              <div className="contact-faq-item">
                <h3 className="contact-faq-question">Is there a live chat option?</h3>
                <p className="contact-faq-answer">
                  Yes, you can start a live chat session using the "Live Chat" button above.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
