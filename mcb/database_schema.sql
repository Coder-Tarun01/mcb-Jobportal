-- MCB Job Portal Database Schema
-- PostgreSQL Database Schema for MCB Job Portal

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('employee', 'employer');
CREATE TYPE job_type AS ENUM ('full-time', 'part-time', 'contract', 'internship', 'freelance', 'temporary');
CREATE TYPE job_status AS ENUM ('draft', 'active', 'paused', 'closed', 'expired');
CREATE TYPE application_status AS ENUM ('submitted', 'under_review', 'shortlisted', 'interview_scheduled', 'interviewed', 'rejected', 'hired', 'withdrawn');
CREATE TYPE notification_type AS ENUM ('application_status_update', 'new_job_match', 'job_alert', 'interview_scheduled', 'message_received', 'profile_viewed', 'job_expiring', 'application_deadline', 'company_update', 'system_announcement');
CREATE TYPE notification_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE company_size AS ENUM ('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+');
CREATE TYPE currency_type AS ENUM ('INR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL,
    profile_picture VARCHAR(500),
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Employee profiles table
CREATE TABLE employee_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    headline VARCHAR(200),
    summary TEXT,
    skills TEXT[],
    experience_years INTEGER,
    availability VARCHAR(50),
    expected_salary_min INTEGER,
    expected_salary_max INTEGER,
    expected_salary_currency currency_type DEFAULT 'INR',
    willing_to_relocate BOOLEAN DEFAULT FALSE,
    remote_work BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Employer profiles table
CREATE TABLE employer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(100) NOT NULL,
    description TEXT,
    website VARCHAR(255),
    industry VARCHAR(100),
    size company_size,
    founded_year INTEGER,
    headquarters VARCHAR(200),
    logo VARCHAR(500),
    culture TEXT,
    values TEXT[],
    benefits TEXT[],
    linkedin VARCHAR(255),
    twitter VARCHAR(255),
    facebook VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2),
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Companies table (separate from employer profiles for better normalization)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    website VARCHAR(255),
    industry VARCHAR(100),
    size company_size,
    founded_year INTEGER,
    headquarters VARCHAR(200),
    logo VARCHAR(500),
    culture TEXT,
    values TEXT[],
    benefits TEXT[],
    social_media JSONB,
    is_verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2),
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Jobs table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    requirements TEXT[] NOT NULL,
    skills TEXT[] NOT NULL,
    location VARCHAR(200) NOT NULL,
    is_remote BOOLEAN DEFAULT FALSE,
    type job_type NOT NULL,
    experience_min INTEGER NOT NULL,
    experience_max INTEGER NOT NULL,
    salary_min INTEGER NOT NULL,
    salary_max INTEGER NOT NULL,
    salary_currency currency_type NOT NULL,
    salary_negotiable BOOLEAN DEFAULT FALSE,
    salary_confidential BOOLEAN DEFAULT FALSE,
    benefits TEXT[],
    posted_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    application_deadline TIMESTAMP WITH TIME ZONE,
    category VARCHAR(50) NOT NULL,
    status job_status DEFAULT 'draft',
    tags TEXT[],
    applicant_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    shortlisted_count INTEGER DEFAULT 0,
    hired_count INTEGER DEFAULT 0,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Work experience table
CREATE TABLE work_experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    achievements TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Education table
CREATE TABLE education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    degree VARCHAR(100) NOT NULL,
    field VARCHAR(100) NOT NULL,
    institution VARCHAR(200) NOT NULL,
    graduation_year INTEGER NOT NULL,
    gpa VARCHAR(10),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    technologies TEXT[],
    url VARCHAR(500),
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Certifications table
CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    issuer VARCHAR(100) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    credential_id VARCHAR(100),
    url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Personal details table
CREATE TABLE personal_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date_of_birth DATE,
    gender VARCHAR(20),
    marital_status VARCHAR(20),
    languages TEXT[],
    address JSONB,
    passport_number VARCHAR(50),
    work_permit VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Resumes table
CREATE TABLE resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(10) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    version INTEGER DEFAULT 1,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Job applications table
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status application_status DEFAULT 'submitted',
    cover_letter TEXT,
    resume_id UUID REFERENCES resumes(id),
    additional_documents JSONB,
    answers JSONB,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES users(id),
    notes TEXT,
    score INTEGER,
    is_shortlisted BOOLEAN DEFAULT FALSE,
    interview_scheduled_at TIMESTAMP WITH TIME ZONE,
    interview_notes TEXT,
    UNIQUE(job_id, applicant_id)
);

-- Saved jobs table
CREATE TABLE saved_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    notes TEXT,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, job_id)
);

-- Job alerts table
CREATE TABLE job_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    keywords TEXT[] NOT NULL,
    location VARCHAR(100),
    job_type job_type,
    experience VARCHAR(10),
    salary_min INTEGER,
    salary_max INTEGER,
    currency currency_type DEFAULT 'INR',
    frequency VARCHAR(20) DEFAULT 'daily',
    is_active BOOLEAN DEFAULT TRUE,
    last_sent TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_important BOOLEAN DEFAULT FALSE,
    priority notification_priority DEFAULT 'medium',
    data JSONB,
    action_url VARCHAR(500),
    action_text VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Notification preferences table
CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email_enabled BOOLEAN DEFAULT TRUE,
    email_frequency VARCHAR(20) DEFAULT 'daily',
    email_types TEXT[],
    push_enabled BOOLEAN DEFAULT TRUE,
    push_types TEXT[],
    sms_enabled BOOLEAN DEFAULT FALSE,
    sms_phone VARCHAR(20),
    sms_types TEXT[],
    quiet_hours_enabled BOOLEAN DEFAULT FALSE,
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    quiet_hours_timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- File uploads table
CREATE TABLE file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(20) NOT NULL,
    upload_type VARCHAR(50) NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Refresh tokens table
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_posted_date ON jobs(posted_date);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_type ON jobs(type);
CREATE INDEX idx_jobs_salary_min ON jobs(salary_min);
CREATE INDEX idx_jobs_salary_max ON jobs(salary_max);
CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_job_applications_applicant_id ON job_applications(applicant_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);
CREATE INDEX idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX idx_saved_jobs_job_id ON saved_jobs(job_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_work_experience_user_id ON work_experience(user_id);
CREATE INDEX idx_education_user_id ON education(user_id);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_certifications_user_id ON certifications(user_id);
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_file_uploads_user_id ON file_uploads(user_id);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Create full-text search indexes
CREATE INDEX idx_jobs_search ON jobs USING gin(to_tsvector('english', title || ' ' || description || ' ' || array_to_string(skills, ' ')));
CREATE INDEX idx_companies_search ON companies USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employee_profiles_updated_at BEFORE UPDATE ON employee_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employer_profiles_updated_at BEFORE UPDATE ON employer_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_work_experience_updated_at BEFORE UPDATE ON work_experience FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON certifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_personal_details_updated_at BEFORE UPDATE ON personal_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update job statistics
CREATE OR REPLACE FUNCTION update_job_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND TG_TABLE_NAME = 'job_applications' THEN
        UPDATE jobs SET applicant_count = applicant_count + 1 WHERE id = NEW.job_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' AND TG_TABLE_NAME = 'job_applications' THEN
        IF OLD.status != NEW.status AND NEW.status = 'shortlisted' THEN
            UPDATE jobs SET shortlisted_count = shortlisted_count + 1 WHERE id = NEW.job_id;
        ELSIF OLD.status != NEW.status AND NEW.status = 'hired' THEN
            UPDATE jobs SET hired_count = hired_count + 1 WHERE id = NEW.job_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' AND TG_TABLE_NAME = 'job_applications' THEN
        UPDATE jobs SET applicant_count = applicant_count - 1 WHERE id = OLD.job_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_job_applicant_count AFTER INSERT OR DELETE ON job_applications FOR EACH ROW EXECUTE FUNCTION update_job_stats();
CREATE TRIGGER update_job_shortlisted_count AFTER UPDATE ON job_applications FOR EACH ROW EXECUTE FUNCTION update_job_stats();

-- Create function to update job view count
CREATE OR REPLACE FUNCTION increment_job_view_count(job_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE jobs SET view_count = view_count + 1 WHERE id = job_uuid;
END;
$$ language 'plpgsql';

-- Insert sample data
INSERT INTO companies (id, name, description, website, industry, size, founded_year, headquarters, is_verified, rating) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'TechCorp Solutions', 'Leading technology company specializing in web development', 'https://techcorp.com', 'Technology', '100-500', 2015, 'Mumbai, India', true, 4.5),
('550e8400-e29b-41d4-a716-446655440002', 'DesignStudio Pro', 'Creative design agency focused on UI/UX', 'https://designstudio.com', 'Design', '11-50', 2018, 'Bangalore, India', true, 4.2),
('550e8400-e29b-41d4-a716-446655440003', 'DataFlow Systems', 'Data analytics and machine learning solutions', 'https://dataflow.com', 'Technology', '51-200', 2016, 'Delhi, India', true, 4.0);

-- Insert sample users
INSERT INTO users (id, name, email, password_hash, phone, role, is_email_verified) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'John Doe', 'john.doe@example.com', '$2b$10$example_hash', '+91 98765 43210', 'employee', true),
('550e8400-e29b-41d4-a716-446655440011', 'Jane Smith', 'jane.smith@example.com', '$2b$10$example_hash', '+91 98765 43211', 'employee', true),
('550e8400-e29b-41d4-a716-446655440012', 'TechCorp HR', 'hr@techcorp.com', '$2b$10$example_hash', '+91 98765 43212', 'employer', true);

-- Insert sample jobs
INSERT INTO jobs (id, title, company_id, description, requirements, skills, location, is_remote, type, experience_min, experience_max, salary_min, salary_max, salary_currency, benefits, category, status, created_by) VALUES
('550e8400-e29b-41d4-a716-446655440020', 'Senior Frontend Developer', '550e8400-e29b-41d4-a716-446655440001', 'We are looking for a Senior Frontend Developer to join our growing team...', ARRAY['3+ years of experience in React.js', 'Strong knowledge of TypeScript', 'Experience with modern CSS frameworks'], ARRAY['React', 'TypeScript', 'CSS', 'JavaScript', 'Git'], 'Mumbai, India', true, 'full-time', 3, 6, 800000, 1200000, 'INR', ARRAY['Health Insurance', 'Flexible Working Hours', 'Remote Work'], 'technology', 'active', '550e8400-e29b-41d4-a716-446655440012'),
('550e8400-e29b-41d4-a716-446655440021', 'UI/UX Designer', '550e8400-e29b-41d4-a716-446655440002', 'We are seeking a creative UI/UX Designer to create amazing user experiences...', ARRAY['1+ years of UI/UX design experience', 'Proficiency in Figma and Adobe Creative Suite'], ARRAY['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Prototyping'], 'Bangalore, India', true, 'full-time', 1, 4, 500000, 800000, 'INR', ARRAY['Health Insurance', 'Professional Development'], 'design', 'active', '550e8400-e29b-41d4-a716-446655440012');

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mcb_job_portal_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO mcb_job_portal_user;
