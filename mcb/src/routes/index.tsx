import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Lazy load components for better performance
const Home = React.lazy(() => import('../pages/Home'));
const About = React.lazy(() => import('../pages/About'));
const Contact = React.lazy(() => import('../pages/Contact'));
const Login = React.lazy(() => import('../pages/Login'));
const Signup = React.lazy(() => import('../pages/Signup'));
const Jobs = React.lazy(() => import('../pages/Jobs'));
const JobDetails = React.lazy(() => import('../pages/JobDetails'));
const BrowseJobs = React.lazy(() => import('../pages/BrowseJobs'));
const Apply = React.lazy(() => import('../pages/Apply'));
const NotFound = React.lazy(() => import('../pages/NotFound'));

// New Job Section Pages
const JobSearch = React.lazy(() => import('../pages/jobs/JobSearch'));
const JobCategories = React.lazy(() => import('../pages/jobs/JobCategories'));
const FreeJobAlerts = React.lazy(() => import('../pages/jobs/FreeJobAlerts'));
const RecentJobs = React.lazy(() => import('../pages/jobs/RecentJobs'));

// Employee Dashboard Components
const DashboardLayout = React.lazy(() => import('../pages/dashboard/DashboardLayout'));
const Profile = React.lazy(() => import('../pages/dashboard/Profile'));
const EmployeeResume = React.lazy(() => import('../pages/dashboard/Resume'));
const SavedJobs = React.lazy(() => import('../pages/dashboard/SavedJobs'));
const AppliedJobs = React.lazy(() => import('../pages/dashboard/AppliedJobs'));
const JobAlerts = React.lazy(() => import('../pages/dashboard/JobAlerts'));
const CVManager = React.lazy(() => import('../pages/dashboard/CVManager'));
const ChangePassword = React.lazy(() => import('../pages/dashboard/ChangePassword'));

// Employer Dashboard Components
const EmployerDashboard = React.lazy(() => import('../pages/Employer Access/EmployerDashboard'));
const PostJob = React.lazy(() => import('../pages/Employer Access/PostJob'));
const CompanyProfile = React.lazy(() => import('../pages/Employer Access/CompanyProfile'));
const CompanyOverview = React.lazy(() => import('../pages/Employer Access/CompanyOverview'));
const ManageJobs = React.lazy(() => import('../pages/Employer Access/ManageJobs'));
const Transactions = React.lazy(() => import('../pages/Employer Access/Transactions'));
const BrowseCandidates = React.lazy(() => import('../pages/Employer Access/BrowseCandidates'));
const EmployerResume = React.lazy(() => import('../pages/Employer Access/Resume'));

// Registration Components
const CompanyRegister = React.lazy(() => import('../pages/CompanyRegister'));
const EmployersRegister = React.lazy(() => import('../pages/Employer Access/EmployersRegister'));
const EmployerRegisterSelection = React.lazy(() => import('../pages/Employer Access/EmployerRegisterSelection'));
const RegisterProfessional = React.lazy(() => import('../pages/Employer Access/RegisterProfessional'));
const RegisterFresher = React.lazy(() => import('../pages/Employer Access/RegisterFresher'));

// Test Components
const JobsTest = React.lazy(() => import('../components/jobs/JobsTest'));
const CandidatesTest = React.lazy(() => import('../components/candidates/CandidatesTest'));
const ApplicationsTest = React.lazy(() => import('../components/applications/ApplicationsTest'));
const SavedJobsTest = React.lazy(() => import('../components/savedJobs/SavedJobsTest'));
const CandidateManagement = React.lazy(() => import('../pages/CandidateManagement'));
const ApplicationManagement = React.lazy(() => import('../pages/ApplicationManagement'));
const SavedJobsManagement = React.lazy(() => import('../pages/SavedJobsManagement'));

// Loading component
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Job Routes */}
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/jobs/browse" element={<BrowseJobs />} />
        <Route path="/jobs/browse/list" element={<BrowseJobs />} />
        <Route path="/jobs/browse/grid" element={<BrowseJobs />} />
        <Route path="/jobs/browse/filter-list" element={<BrowseJobs />} />
        <Route path="/jobs/browse/filter-grid" element={<BrowseJobs />} />
        <Route path="/jobs/company" element={<BrowseJobs />} />
        <Route path="/jobs/designations" element={<BrowseJobs />} />
        <Route path="/jobs/category" element={<BrowseJobs />} />
        <Route path="/jobs/location" element={<BrowseJobs />} />
        <Route path="/jobs/skills" element={<BrowseJobs />} />
        <Route path="/apply/:id" element={<Apply />} />
        <Route path="/jobs-test" element={<JobsTest />} />
        <Route path="/candidates-test" element={<CandidatesTest />} />
        <Route path="/candidates-management" element={<CandidateManagement />} />
        <Route path="/applications-test" element={<ApplicationsTest />} />
        <Route path="/applications-management" element={<ApplicationManagement />} />
        <Route path="/saved-jobs-test" element={<SavedJobsTest />} />
        <Route path="/saved-jobs-management" element={<SavedJobsManagement />} />

        {/* New Job Section Routes */}
        <Route path="/job-search" element={<JobSearch />} />
        <Route path="/job-categories" element={<JobCategories />} />
        <Route path="/free-job-alerts" element={<FreeJobAlerts />} />
        <Route path="/recent-jobs" element={<RecentJobs />} />

        {/* Employee Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requiredRole="employee">
              <DashboardLayout />
            </ProtectedRoute>
          } 
        >
          <Route index element={<Profile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="resume" element={<EmployeeResume />} />
          <Route path="resume/headline" element={<EmployeeResume />} />
          <Route path="resume/skills" element={<EmployeeResume />} />
          <Route path="resume/employment" element={<EmployeeResume />} />
          <Route path="resume/education" element={<EmployeeResume />} />
          <Route path="resume/it-skills" element={<EmployeeResume />} />
          <Route path="resume/projects" element={<EmployeeResume />} />
          <Route path="resume/summary" element={<EmployeeResume />} />
          <Route path="resume/accomplishments" element={<EmployeeResume />} />
          <Route path="resume/career" element={<EmployeeResume />} />
          <Route path="resume/personal" element={<EmployeeResume />} />
          <Route path="resume/attach" element={<EmployeeResume />} />
          <Route path="saved" element={<SavedJobs />} />
          <Route path="applied" element={<AppliedJobs />} />
          <Route path="alerts" element={<JobAlerts />} />
          <Route path="cv-manager" element={<CVManager />} />
          <Route path="password" element={<ChangePassword />} />
        </Route>

        {/* Employer Dashboard Routes */}
        <Route 
          path="/employer/dashboard" 
          element={
            <ProtectedRoute requiredRole="employer">
              <EmployerDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/employer/post-job" 
          element={
            <ProtectedRoute requiredRole="employer">
              <PostJob />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/employer/profile" 
          element={
            <ProtectedRoute requiredRole="employer">
              <CompanyProfile />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/employer/overview" 
          element={
            <ProtectedRoute requiredRole="employer">
              <CompanyOverview />
            </ProtectedRoute>
          } 
        />
        
        <Route
          path="/employer/jobs"
          element={
            <ProtectedRoute requiredRole="employer">
              <ManageJobs />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/employer/transactions"
          element={
            <ProtectedRoute requiredRole="employer">
              <Transactions />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/employer/candidates"
          element={
            <ProtectedRoute requiredRole="employer">
              <BrowseCandidates />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/employer/resume"
          element={
            <ProtectedRoute requiredRole="employer">
              <EmployerResume />
            </ProtectedRoute>
          }
        />

        {/* Registration Routes */}
        <Route path="/register" element={<EmployersRegister />} />
        <Route path="/register/professional" element={<RegisterProfessional />} />
        <Route path="/register/fresher" element={<RegisterFresher />} />
        <Route path="/employer/register" element={<EmployerRegisterSelection />} />
        <Route path="/employer/company-register" element={<CompanyRegister />} />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
