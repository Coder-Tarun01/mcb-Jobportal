import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

// Lazy load components for better performance
const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));
const Jobs = lazy(() => import('../pages/Jobs'));
const JobDetails = lazy(() => import('../pages/JobDetails'));
const BrowseJobs = lazy(() => import('../pages/BrowseJobs'));
const Apply = lazy(() => import('../pages/Apply'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Employee Dashboard Components
const DashboardLayout = lazy(() => import('../pages/dashboard/DashboardLayout'));
const Profile = lazy(() => import('../pages/dashboard/Profile'));
const EmployeeResume = lazy(() => import('../pages/dashboard/Resume'));
const SavedJobs = lazy(() => import('../pages/dashboard/SavedJobs'));
const AppliedJobs = lazy(() => import('../pages/dashboard/AppliedJobs'));
const JobAlerts = lazy(() => import('../pages/dashboard/JobAlerts'));
const CVManager = lazy(() => import('../pages/dashboard/CVManager'));
const ChangePassword = lazy(() => import('../pages/dashboard/ChangePassword'));

// Employer Dashboard Components
const EmployerDashboard = lazy(() => import('../pages/Employer Access/EmployerDashboard'));
const PostJob = lazy(() => import('../pages/Employer Access/PostJob'));
const CompanyProfile = lazy(() => import('../pages/Employer Access/CompanyProfile'));
const CompanyOverview = lazy(() => import('../pages/Employer Access/CompanyOverview'));
const ManageJobs = lazy(() => import('../pages/Employer Access/ManageJobs'));
const Transactions = lazy(() => import('../pages/Employer Access/Transactions'));
const BrowseCandidates = lazy(() => import('../pages/Employer Access/BrowseCandidates'));
const EmployerResume = lazy(() => import('../pages/Employer Access/Resume'));

// Registration Components
const CompanyRegister = lazy(() => import('../pages/CompanyRegister'));
const EmployersRegister = lazy(() => import('../pages/Employer Access/EmployersRegister'));
const EmployerRegisterSelection = lazy(() => import('../pages/Employer Access/EmployerRegisterSelection'));
const RegisterProfessional = lazy(() => import('../pages/Employer Access/RegisterProfessional'));
const RegisterFresher = lazy(() => import('../pages/Employer Access/RegisterFresher'));

// Route configuration
export const routeConfig: RouteObject[] = [
  // Public Routes
  {
    path: '/',
    element: <Home />,
    errorElement: <NotFound />,
  },
  {
    path: '/about',
    element: <About />,
    errorElement: <NotFound />,
  },
  {
    path: '/contact',
    element: <Contact />,
    errorElement: <NotFound />,
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <NotFound />,
  },
  {
    path: '/signup',
    element: <Signup />,
    errorElement: <NotFound />,
  },

  // Job Routes
  {
    path: '/jobs',
    element: <Jobs />,
    errorElement: <NotFound />,
  },
  {
    path: '/jobs/:id',
    element: <JobDetails />,
    errorElement: <NotFound />,
  },
  {
    path: '/jobs/browse',
    element: <BrowseJobs />,
    errorElement: <NotFound />,
  },
  {
    path: '/jobs/browse/list',
    element: <BrowseJobs />,
    errorElement: <NotFound />,
  },
  {
    path: '/jobs/browse/grid',
    element: <BrowseJobs />,
    errorElement: <NotFound />,
  },
  {
    path: '/jobs/browse/filter-list',
    element: <BrowseJobs />,
    errorElement: <NotFound />,
  },
  {
    path: '/jobs/browse/filter-grid',
    element: <BrowseJobs />,
    errorElement: <NotFound />,
  },
  {
    path: '/jobs/company',
    element: <BrowseJobs />,
    errorElement: <NotFound />,
  },
  {
    path: '/jobs/designations',
    element: <BrowseJobs />,
    errorElement: <NotFound />,
  },
  {
    path: '/jobs/category',
    element: <BrowseJobs />,
    errorElement: <NotFound />,
  },
  {
    path: '/jobs/location',
    element: <BrowseJobs />,
    errorElement: <NotFound />,
  },
  {
    path: '/jobs/skills',
    element: <BrowseJobs />,
    errorElement: <NotFound />,
  },
  {
    path: '/apply/:id',
    element: <Apply />,
    errorElement: <NotFound />,
  },

  // Employee Dashboard Routes
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Profile />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'resume',
        element: <EmployeeResume />,
      },
      {
        path: 'resume/headline',
        element: <EmployeeResume />,
      },
      {
        path: 'resume/skills',
        element: <EmployeeResume />,
      },
      {
        path: 'resume/employment',
        element: <EmployeeResume />,
      },
      {
        path: 'resume/education',
        element: <EmployeeResume />,
      },
      {
        path: 'resume/it-skills',
        element: <EmployeeResume />,
      },
      {
        path: 'resume/projects',
        element: <EmployeeResume />,
      },
      {
        path: 'resume/summary',
        element: <EmployeeResume />,
      },
      {
        path: 'resume/accomplishments',
        element: <EmployeeResume />,
      },
      {
        path: 'resume/career',
        element: <EmployeeResume />,
      },
      {
        path: 'resume/personal',
        element: <EmployeeResume />,
      },
      {
        path: 'resume/attach',
        element: <EmployeeResume />,
      },
      {
        path: 'saved',
        element: <SavedJobs />,
      },
      {
        path: 'applied',
        element: <AppliedJobs />,
      },
      {
        path: 'alerts',
        element: <JobAlerts />,
      },
      {
        path: 'cv-manager',
        element: <CVManager />,
      },
      {
        path: 'password',
        element: <ChangePassword />,
      },
    ],
  },

  // Employer Dashboard Routes
  {
    path: '/employer/dashboard',
    element: <EmployerDashboard />,
    errorElement: <NotFound />,
  },
  {
    path: '/employer/post-job',
    element: <PostJob />,
    errorElement: <NotFound />,
  },
  {
    path: '/employer/profile',
    element: <CompanyProfile />,
    errorElement: <NotFound />,
  },
  {
    path: '/employer/overview',
    element: <CompanyOverview />,
    errorElement: <NotFound />,
  },
  {
    path: '/employer/jobs',
    element: <ManageJobs />,
    errorElement: <NotFound />,
  },
  {
    path: '/employer/transactions',
    element: <Transactions />,
    errorElement: <NotFound />,
  },
  {
    path: '/employer/candidates',
    element: <BrowseCandidates />,
    errorElement: <NotFound />,
  },
  {
    path: '/employer/resume',
    element: <EmployerResume />,
    errorElement: <NotFound />,
  },

  // Registration Routes
  {
    path: '/register',
    element: <EmployersRegister />,
    errorElement: <NotFound />,
  },
  {
    path: '/register/professional',
    element: <RegisterProfessional />,
    errorElement: <NotFound />,
  },
  {
    path: '/register/fresher',
    element: <RegisterFresher />,
    errorElement: <NotFound />,
  },
  {
    path: '/employer/register',
    element: <EmployerRegisterSelection />,
    errorElement: <NotFound />,
  },
  {
    path: '/employer/company-register',
    element: <CompanyRegister />,
    errorElement: <NotFound />,
  },

  // 404 Route
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routeConfig;
