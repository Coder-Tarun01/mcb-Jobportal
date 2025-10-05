import { Job, JobFilter } from '../types/job';
import { User } from '../types/user';

// Additional TypeScript interfaces for API responses
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  isImportant: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  data?: any;
  actionUrl?: string;
  actionText?: string;
  createdAt: string;
  readAt?: string;
  expiresAt?: string;
}

export interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'interviewed' | 'rejected' | 'hired' | 'withdrawn';
  coverLetter?: string;
  resumeId?: string;
  additionalDocuments?: any;
  answers?: any;
  appliedAt: string;
  lastUpdated: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
  score?: number;
  isShortlisted: boolean;
  interviewScheduledAt?: string;
  interviewNotes?: string;
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  foundedYear?: number;
  headquarters?: string;
  logo?: string;
  culture?: string;
  values?: string[];
  benefits?: string[];
  socialMedia?: any;
  isVerified: boolean;
  rating?: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsData {
  overview: {
    totalJobs?: number;
    activeJobs?: number;
    totalApplications?: number;
    newApplications?: number;
    profileViews?: number;
    responseRate?: number;
  };
  recentActivity?: any[];
  jobStats?: any[];
  monthlyStats?: {
    applications: number[];
    views: number[];
    months: string[];
  };
}

export interface SearchFilters {
  locations: string[];
  types: string[];
  categories: string[];
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Enhanced error handling interface
interface APIError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

// Helper function to make authenticated requests with enhanced error handling
const makeRequest = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch (parseError) {
        // If response is not JSON, create a basic error structure
        errorData = {
          message: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status
        };
      }

      const apiError: APIError = {
        message: errorData.message || `HTTP error! status: ${response.status}`,
        status: response.status,
        code: errorData.code,
        details: errorData.details
      };

      // Handle specific HTTP status codes
      switch (response.status) {
        case 401:
          // Token expired or invalid - clear local storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          apiError.message = 'Session expired. Please login again.';
          // Dispatch a custom event to notify components about session expiration
          window.dispatchEvent(new CustomEvent('sessionExpired'));
          break;
        case 403:
          apiError.message = 'Access denied. You do not have permission to perform this action.';
          break;
        case 404:
          apiError.message = 'Resource not found.';
          break;
        case 422:
          apiError.message = 'Validation failed. Please check your input.';
          break;
        case 429:
          apiError.message = 'Too many requests. Please try again later.';
          break;
        case 500:
          apiError.message = 'Server error. Please try again later.';
          break;
      }

      throw apiError;
    }

    return response;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const networkError: APIError = {
        message: 'Unable to connect to the server. Please make sure the backend is running.',
        status: 0,
        code: 'NETWORK_ERROR'
      };
      throw networkError;
    }
    throw error;
  }
};

// Helper function to make requests without JSON content-type (for file uploads)
const makeFormRequest = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAuthToken();
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please make sure the backend is running.');
    }
    throw error;
  }
};

// Enhanced Auth API calls with proper error handling
export const authAPI = {
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role: 'employee' | 'employer';
    phone?: string;
    companyName?: string;
    skills?: string[];
  }): Promise<{ token: string; user: User }> => {
    try {
      const response = await makeRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      // Handle different response structures
      if (data.token && data.user) {
        return data;
      } else if (data.data && data.data.token && data.data.user) {
        return data.data;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  login: async (credentials: { email: string; password: string }): Promise<{ token: string; user: User }> => {
    try {
      const response = await makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      // Handle different response structures
      if (data.token && data.user) {
        return data;
      } else if (data.data && data.data.token && data.data.user) {
        return data.data;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await makeRequest('/auth/me');
      const data = await response.json();
      
      // Handle different response structures
      if (data.user) {
        return data.user;
      } else if (data.data && data.data.user) {
        return data.data.user;
      } else if (data.id) {
        // If the response is the user object directly
        return data;
      } else {
        throw new Error('Invalid user data format');
      }
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Enhanced auth functions
  refreshToken: async (): Promise<{ token: string; user: User }> => {
    try {
      const response = await makeRequest('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: localStorage.getItem('refreshToken') }),
      });
      
      const data = await response.json();
      
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
      } else {
        throw new Error('Invalid refresh token response');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout user
      authAPI.logout();
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get stored user data
  getStoredUser: (): User | null => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  }
};

// Enhanced Jobs API calls with comprehensive functionality
export const jobsAPI = {
  // Get all jobs with advanced filtering and pagination
  fetchJobs: async (filters?: JobFilter & { 
    page?: number; 
    limit?: number;
    search?: string;
    location?: string;
    type?: string;
    category?: string;
    company?: string;
    isRemote?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    jobs: Job[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response = await makeRequest(`/jobs?${queryParams.toString()}`);
      const data = await response.json();
      console.log('Jobs API Response:', data);
      
      // Handle different response structures
      if (Array.isArray(data)) {
        return { jobs: data };
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  // Get job by ID
  fetchJobById: async (id: string): Promise<Job> => {
    try {
      const response = await makeRequest(`/jobs/${id}`);
      return response.json();
    } catch (error) {
      console.error('Error fetching job by ID:', error);
      throw error;
    }
  },

  // Create new job
  createJob: async (jobData: Partial<Job>): Promise<Job> => {
    try {
      const response = await makeRequest('/jobs', {
        method: 'POST',
        body: JSON.stringify(jobData),
      });
      return response.json();
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  },

  // Update existing job
  updateJob: async (id: string, jobData: Partial<Job>): Promise<Job> => {
    try {
      const response = await makeRequest(`/jobs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(jobData),
      });
      return response.json();
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  },

  // Delete job
  deleteJob: async (id: string): Promise<{ success: boolean; deleted: number }> => {
    try {
      const response = await makeRequest(`/jobs/${id}`, {
        method: 'DELETE',
      });
      return response.json();
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  },

  // Search jobs with advanced filters
  searchJobs: async (filters: JobFilter): Promise<Job[]> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.keyword) queryParams.append('q', filters.keyword);
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.jobType) queryParams.append('type', filters.jobType);
      if (filters.company) queryParams.append('company', filters.company);
      if (filters.salaryMin) queryParams.append('minSalary', filters.salaryMin.toString());
      if (filters.salaryMax) queryParams.append('maxSalary', filters.salaryMax.toString());
      
      const response = await makeRequest(`/search/jobs?${queryParams.toString()}`);
      return response.json();
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  },

  // Get jobs by company
  getJobsByCompany: async (companyId: string): Promise<Job[]> => {
    try {
      const response = await makeRequest(`/companies/${companyId}/jobs`);
      return response.json();
    } catch (error) {
      console.error('Error fetching company jobs:', error);
      throw error;
    }
  },

  // Get job statistics
  getJobStats: async (): Promise<{
    totalJobs: number;
    activeJobs: number;
    expiredJobs: number;
    totalApplications: number;
  }> => {
    try {
      const response = await makeRequest('/jobs/stats');
      return response.json();
    } catch (error) {
      console.error('Error fetching job stats:', error);
      throw error;
    }
  },

  // Bulk operations
  bulkDeleteJobs: async (jobIds: string[]): Promise<{ success: boolean; deleted: number }> => {
    try {
      const response = await makeRequest('/jobs/bulk-delete', {
        method: 'POST',
        body: JSON.stringify({ jobIds }),
      });
      return response.json();
    } catch (error) {
      console.error('Error bulk deleting jobs:', error);
      throw error;
    }
  },

  // Update job status
  updateJobStatus: async (id: string, status: 'active' | 'inactive' | 'expired'): Promise<Job> => {
    try {
      const response = await makeRequest(`/jobs/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      return response.json();
    } catch (error) {
      console.error('Error updating job status:', error);
      throw error;
    }
  },

  // Get job applications
  getJobApplications: async (jobId: string): Promise<any[]> => {
    try {
      const response = await makeRequest(`/jobs/${jobId}/applications`);
      return response.json();
    } catch (error) {
      console.error('Error fetching job applications:', error);
      throw error;
    }
  },
};

// Enhanced Users API calls with proper error handling
export const usersAPI = {
  // Get all users with pagination and filtering
  fetchUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    users: User[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.role) queryParams.append('role', params.role);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await makeRequest(`/users?${queryParams.toString()}`);
      const data = await response.json();
      
      // Handle different response structures
      if (data.users && Array.isArray(data.users)) {
        return data;
      } else if (Array.isArray(data)) {
        return { users: data };
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID
  fetchUserById: async (id: string): Promise<User> => {
    try {
      const response = await makeRequest(`/users/${id}`);
      const data = await response.json();
      
      // Handle different response structures
      if (data.user) {
        return data.user;
      } else if (data.id) {
        return data;
      } else {
        throw new Error('Invalid user data format');
      }
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  },

  // Create new user
  createUser: async (userData: {
    name: string;
    email: string;
    password: string;
    role: 'employee' | 'employer';
    phone?: string;
    companyName?: string;
    skills?: string[];
  }): Promise<User> => {
    try {
      const response = await makeRequest('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      // Handle different response structures
      if (data.user) {
        return data.user;
      } else if (data.id) {
        return data;
      } else {
        throw new Error('Invalid user creation response');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    try {
      const response = await makeRequest(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      // Handle different response structures
      if (data.user) {
        return data.user;
      } else if (data.id) {
        return data;
      } else {
        throw new Error('Invalid user update response');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (id: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await makeRequest(`/users/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Enhanced user management functions
  searchUsers: async (searchTerm: string, filters?: {
    role?: string;
    location?: string;
    skills?: string[];
  }): Promise<User[]> => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('search', searchTerm);
      
      if (filters?.role) queryParams.append('role', filters.role);
      if (filters?.location) queryParams.append('location', filters.location);
      if (filters?.skills) queryParams.append('skills', filters.skills.join(','));

      const response = await makeRequest(`/users/search?${queryParams.toString()}`);
      const data = await response.json();
      
      return Array.isArray(data) ? data : data.users || [];
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },

  // Get user statistics
  getUserStats: async (): Promise<{
    totalUsers: number;
    employees: number;
    employers: number;
    activeUsers: number;
    newUsersThisMonth: number;
  }> => {
    try {
      const response = await makeRequest('/users/stats');
      return response.json();
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },

  // Bulk operations
  bulkDeleteUsers: async (userIds: string[]): Promise<{ success: boolean; deletedCount: number }> => {
    try {
      const response = await makeRequest('/users/bulk-delete', {
        method: 'POST',
        body: JSON.stringify({ userIds }),
      });
      
      return response.json();
    } catch (error) {
      console.error('Error bulk deleting users:', error);
      throw error;
    }
  },

  // Update user role
  updateUserRole: async (id: string, role: 'employee' | 'employer'): Promise<User> => {
    try {
      const response = await makeRequest(`/users/${id}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role }),
      });
      
      const data = await response.json();
      return data.user || data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  // Deactivate/Activate user
  toggleUserStatus: async (id: string, isActive: boolean): Promise<User> => {
    try {
      const response = await makeRequest(`/users/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ isActive }),
      });
      
      const data = await response.json();
      return data.user || data;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  }
};

// Applications API calls
export const applicationsAPI = {
  applyToJob: async (jobId: string, applicationData: {
    coverLetter?: string;
    resumeUrl?: string;
  }): Promise<{ success: boolean; applicationId?: string }> => {
    const response = await makeRequest('/applications', {
      method: 'POST',
      body: JSON.stringify({
        jobId,
        coverLetter: applicationData.coverLetter,
        resumeUrl: applicationData.resumeUrl,
      }),
    });

    const result = await response.json();
    return { success: true, applicationId: result.id };
  },

  getUserApplications: async (): Promise<Application[]> => {
    const response = await makeRequest('/applications');
    return response.json();
  },

  getJobApplications: async (jobId: string): Promise<Application[]> => {
    const response = await makeRequest(`/applications/job/${jobId}`);
    return response.json();
  },

  getApplication: async (applicationId: string): Promise<Application> => {
    const response = await makeRequest(`/applications/${applicationId}`);
    return response.json();
  },

  updateApplication: async (applicationId: string, data: Partial<Application>): Promise<Application> => {
    const response = await makeRequest(`/applications/${applicationId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  withdrawApplication: async (applicationId: string): Promise<{ success: boolean }> => {
    const response = await makeRequest(`/applications/${applicationId}`, {
      method: 'DELETE',
    });
    const result = await response.json();
    return { success: result.deleted };
  },

  // Update application status (employer only)
  updateApplicationStatus: async (applicationId: string, status: 'pending' | 'reviewed' | 'accepted' | 'rejected'): Promise<Application> => {
    try {
      const response = await makeRequest(`/applications/${applicationId}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      return response.json();
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  },

  // Bulk update application statuses (employer only)
  bulkUpdateApplicationStatus: async (applicationIds: string[], status: 'pending' | 'reviewed' | 'accepted' | 'rejected'): Promise<{ success: boolean; updated: number }> => {
    try {
      const response = await makeRequest('/applications/bulk-update', {
        method: 'POST',
        body: JSON.stringify({ applicationIds, status }),
      });
      return response.json();
    } catch (error) {
      console.error('Error bulk updating application statuses:', error);
      throw error;
    }
  },

  // Get application statistics
  getApplicationStats: async (): Promise<{
    totalApplications: number;
    pendingApplications: number;
    reviewedApplications: number;
    acceptedApplications: number;
    rejectedApplications: number;
    applicationsThisMonth: number;
  }> => {
    try {
      const response = await makeRequest('/applications/stats');
      return response.json();
    } catch (error) {
      console.error('Error fetching application stats:', error);
      throw error;
    }
  },

  // Search applications
  searchApplications: async (filters: {
    keyword?: string;
    status?: string;
    jobTitle?: string;
    company?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Application[]> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.keyword) queryParams.append('q', filters.keyword);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.jobTitle) queryParams.append('jobTitle', filters.jobTitle);
      if (filters.company) queryParams.append('company', filters.company);
      if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
      
      const response = await makeRequest(`/search/applications?${queryParams.toString()}`);
      return response.json();
    } catch (error) {
      console.error('Error searching applications:', error);
      throw error;
    }
  },

  // Get application analytics
  getApplicationAnalytics: async (): Promise<{
    applicationsByStatus: { [key: string]: number };
    applicationsByMonth: { month: string; count: number }[];
    topJobs: { jobTitle: string; applications: number }[];
  }> => {
    try {
      const response = await makeRequest('/applications/analytics');
      return response.json();
    } catch (error) {
      console.error('Error fetching application analytics:', error);
      throw error;
    }
  }
};

// Search API calls
export const searchAPI = {
  searchJobs: async (filters: JobFilter): Promise<Job[]> => {
    const queryParams = new URLSearchParams();
    
    if (filters.keyword) queryParams.append('q', filters.keyword);
    if (filters.location) queryParams.append('location', filters.location);
    if (filters.jobType) queryParams.append('type', filters.jobType);
    if (filters.company) queryParams.append('company', filters.company);
    if (filters.salaryMin) queryParams.append('minSalary', filters.salaryMin.toString());
    if (filters.salaryMax) queryParams.append('maxSalary', filters.salaryMax.toString());
    
    const response = await makeRequest(`/search/jobs?${queryParams.toString()}`);
    return response.json();
  },

  getFilterOptions: async (): Promise<SearchFilters> => {
    const response = await makeRequest('/search/filters');
    return response.json();
  },

  getRecommendedJobs: async (): Promise<Job[]> => {
    const response = await makeRequest('/search/recommended');
    return response.json();
  },
};

// Enhanced Saved Jobs API calls with comprehensive functionality
export const savedJobsAPI = {
  // Get user's saved jobs with advanced filtering and pagination
  getSavedJobs: async (filters?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: 'savedAt' | 'jobTitle' | 'company' | 'location';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    savedJobs: any[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response = await makeRequest(`/saved-jobs?${queryParams.toString()}`);
      const data = await response.json();
      console.log('Saved Jobs API Response:', data);
      
      // Handle different response structures
      if (Array.isArray(data)) {
        return { savedJobs: data };
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      throw error;
    }
  },

  // Save a job
  saveJob: async (jobId: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await makeRequest('/saved-jobs', {
        method: 'POST',
        body: JSON.stringify({ jobId }),
      });
      const result = await response.json();
      return { success: true, message: 'Job saved successfully' };
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  },

  // Unsave a job
  unsaveJob: async (jobId: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await makeRequest(`/saved-jobs/${jobId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      return { success: result.deleted, message: 'Job removed from saved jobs' };
    } catch (error) {
      console.error('Error unsaving job:', error);
      throw error;
    }
  },

  // Check if a job is saved
  isJobSaved: async (jobId: string): Promise<boolean> => {
    try {
      const response = await makeRequest(`/saved-jobs/check/${jobId}`);
      const result = await response.json();
      return result.isSaved || false;
    } catch (error) {
      console.error('Error checking if job is saved:', error);
      return false;
    }
  },

  // Bulk save jobs
  bulkSaveJobs: async (jobIds: string[]): Promise<{ success: boolean; saved: number; errors: string[] }> => {
    try {
      const response = await makeRequest('/saved-jobs/bulk-save', {
        method: 'POST',
        body: JSON.stringify({ jobIds }),
      });
      return response.json();
    } catch (error) {
      console.error('Error bulk saving jobs:', error);
      throw error;
    }
  },

  // Bulk unsave jobs
  bulkUnsaveJobs: async (jobIds: string[]): Promise<{ success: boolean; removed: number }> => {
    try {
      const response = await makeRequest('/saved-jobs/bulk-unsave', {
        method: 'POST',
        body: JSON.stringify({ jobIds }),
      });
      return response.json();
    } catch (error) {
      console.error('Error bulk unsaving jobs:', error);
      throw error;
    }
  },

  // Get saved jobs statistics
  getSavedJobsStats: async (): Promise<{
    totalSavedJobs: number;
    savedThisWeek: number;
    savedThisMonth: number;
    mostSavedCompany: string;
    mostSavedCategory: string;
  }> => {
    try {
      const response = await makeRequest('/saved-jobs/stats');
      return response.json();
    } catch (error) {
      console.error('Error fetching saved jobs stats:', error);
      throw error;
    }
  },

  // Search saved jobs
  searchSavedJobs: async (filters: {
    keyword?: string;
    company?: string;
    location?: string;
    jobType?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<any[]> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.keyword) queryParams.append('q', filters.keyword);
      if (filters.company) queryParams.append('company', filters.company);
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.jobType) queryParams.append('jobType', filters.jobType);
      if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
      
      const response = await makeRequest(`/search/saved-jobs?${queryParams.toString()}`);
      return response.json();
    } catch (error) {
      console.error('Error searching saved jobs:', error);
      throw error;
    }
  },

  // Get saved jobs analytics
  getSavedJobsAnalytics: async (): Promise<{
    savedJobsByMonth: { month: string; count: number }[];
    topCompanies: { company: string; count: number }[];
    topCategories: { category: string; count: number }[];
    savedJobsByLocation: { location: string; count: number }[];
  }> => {
    try {
      const response = await makeRequest('/saved-jobs/analytics');
      return response.json();
    } catch (error) {
      console.error('Error fetching saved jobs analytics:', error);
      throw error;
    }
  },

  // Clear all saved jobs
  clearAllSavedJobs: async (): Promise<{ success: boolean; cleared: number }> => {
    try {
      const response = await makeRequest('/saved-jobs/clear-all', {
        method: 'DELETE',
      });
      return response.json();
    } catch (error) {
      console.error('Error clearing all saved jobs:', error);
      throw error;
    }
  }
};

// Profile API calls
export const profileAPI = {
  getProfile: async (): Promise<any> => {
    const response = await makeRequest('/profile');
    return response.json();
  },

  updateProfile: async (profileData: any): Promise<any> => {
    const response = await makeRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response.json();
  },

  uploadResume: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response = await makeFormRequest('/profile/upload-resume', {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  uploadAvatar: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await makeFormRequest('/profile/upload-avatar', {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  getSkills: async (): Promise<string[]> => {
    const response = await makeRequest('/profile/skills');
    return response.json();
  },

  updateSkills: async (skills: string[]): Promise<any> => {
    const response = await makeRequest('/profile/skills', {
      method: 'PUT',
      body: JSON.stringify({ skills }),
    });
    return response.json();
  },
};

// Companies API calls
export const companiesAPI = {
  getCompanies: async (): Promise<Company[]> => {
    const response = await makeRequest('/companies');
    return response.json();
  },

  getCompany: async (id: string): Promise<Company> => {
    const response = await makeRequest(`/companies/${id}`);
    return response.json();
  },

  getCompanyJobs: async (id: string): Promise<Job[]> => {
    const response = await makeRequest(`/companies/${id}/jobs`);
    return response.json();
  },
};

// Notifications API calls
export const notificationsAPI = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await makeRequest('/notifications');
    return response.json();
  },

  markAsRead: async (notificationId: string): Promise<Notification> => {
    const response = await makeRequest(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
    return response.json();
  },

  updateNotification: async (notificationId: string, data: Partial<Notification>): Promise<Notification> => {
    const response = await makeRequest(`/notifications/${notificationId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteNotification: async (notificationId: string): Promise<{ success: boolean }> => {
    const response = await makeRequest(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  createNotification: async (notificationData: {
    userId: string;
    type: string;
    title: string;
    message: string;
    data?: any;
  }): Promise<Notification> => {
    const response = await makeRequest('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
    return response.json();
  }
};

// Analytics API calls
export const analyticsAPI = {
  getApplicationAnalytics: async (): Promise<AnalyticsData> => {
    const response = await makeRequest('/analytics/applications');
    return response.json();
  },

  getJobAnalytics: async (): Promise<AnalyticsData> => {
    const response = await makeRequest('/analytics/jobs');
    return response.json();
  },

  getUserAnalytics: async (): Promise<AnalyticsData> => {
    const response = await makeRequest('/analytics/user');
    return response.json();
  }
};

// Enhanced Candidates API calls with comprehensive functionality
export const candidatesAPI = {
  // Get all candidates with advanced filtering and pagination
  fetchCandidates: async (filters?: {
    page?: number;
    limit?: number;
    search?: string;
    location?: string;
    skills?: string[];
    experience?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    candidates: any[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
              value.forEach(v => queryParams.append(key, v));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });
      }

      const response = await makeRequest(`/candidates?${queryParams.toString()}`);
      const data = await response.json();
      console.log('Candidates API Response:', data);
      
      // Handle different response structures
      if (Array.isArray(data)) {
        return { candidates: data };
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
  },

  // Get candidate by ID
  fetchCandidateById: async (id: string): Promise<any> => {
    try {
      const response = await makeRequest(`/candidates/${id}`);
      return response.json();
    } catch (error) {
      console.error('Error fetching candidate by ID:', error);
      throw error;
    }
  },

  // Create new candidate
  createCandidate: async (candidateData: any): Promise<any> => {
    try {
      const response = await makeRequest('/candidates', {
        method: 'POST',
        body: JSON.stringify(candidateData),
      });
      return response.json();
    } catch (error) {
      console.error('Error creating candidate:', error);
      throw error;
    }
  },

  // Update existing candidate
  updateCandidate: async (id: string, candidateData: any): Promise<any> => {
    try {
      const response = await makeRequest(`/candidates/${id}`, {
        method: 'PUT',
        body: JSON.stringify(candidateData),
      });
      return response.json();
    } catch (error) {
      console.error('Error updating candidate:', error);
      throw error;
    }
  },

  // Delete candidate
  deleteCandidate: async (id: string): Promise<{ success: boolean; deleted: number }> => {
    try {
      const response = await makeRequest(`/candidates/${id}`, {
        method: 'DELETE',
      });
      return response.json();
    } catch (error) {
      console.error('Error deleting candidate:', error);
      throw error;
    }
  },

  // Search candidates with advanced filters
  searchCandidates: async (filters: {
    keyword?: string;
    location?: string;
    skills?: string[];
    experience?: string;
    salaryMin?: number;
    salaryMax?: number;
  }): Promise<any[]> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.keyword) queryParams.append('q', filters.keyword);
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.skills) filters.skills.forEach(skill => queryParams.append('skills', skill));
      if (filters.experience) queryParams.append('experience', filters.experience);
      if (filters.salaryMin) queryParams.append('minSalary', filters.salaryMin.toString());
      if (filters.salaryMax) queryParams.append('maxSalary', filters.salaryMax.toString());
      
      const response = await makeRequest(`/search/candidates?${queryParams.toString()}`);
      return response.json();
    } catch (error) {
      console.error('Error searching candidates:', error);
      throw error;
    }
  },

  // Get candidate statistics
  getCandidateStats: async (): Promise<{
    totalCandidates: number;
    activeCandidates: number;
    newCandidates: number;
    totalApplications: number;
  }> => {
    try {
      const response = await makeRequest('/candidates/stats');
      return response.json();
    } catch (error) {
      console.error('Error fetching candidate stats:', error);
      throw error;
    }
  },

  // Bulk operations
  bulkDeleteCandidates: async (candidateIds: string[]): Promise<{ success: boolean; deleted: number }> => {
    try {
      const response = await makeRequest('/candidates/bulk-delete', {
        method: 'POST',
        body: JSON.stringify({ candidateIds }),
      });
      return response.json();
    } catch (error) {
      console.error('Error bulk deleting candidates:', error);
      throw error;
    }
  },

  // Update candidate status
  updateCandidateStatus: async (id: string, status: 'active' | 'inactive' | 'archived'): Promise<any> => {
    try {
      const response = await makeRequest(`/candidates/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      return response.json();
    } catch (error) {
      console.error('Error updating candidate status:', error);
      throw error;
    }
  },

  // Get candidate applications
  getCandidateApplications: async (candidateId: string): Promise<any[]> => {
    try {
      const response = await makeRequest(`/candidates/${candidateId}/applications`);
      return response.json();
    } catch (error) {
      console.error('Error fetching candidate applications:', error);
      throw error;
    }
  },

  // Legacy functions for backward compatibility
  getCandidates: async (): Promise<any[]> => {
    const response = await candidatesAPI.fetchCandidates();
    return response.candidates || response;
  },

  getCandidate: async (id: string): Promise<any> => {
    return await candidatesAPI.fetchCandidateById(id);
  }
};

// Legacy functions for backward compatibility
export const fetchJobs = async (): Promise<Job[]> => {
  const { jobs } = await jobsAPI.fetchJobs();
  return jobs;
};

export const fetchJobById = async (id: string): Promise<Job | null> => {
  try {
    return await jobsAPI.fetchJobById(id);
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
};

export const searchJobs = async (filters: JobFilter): Promise<Job[]> => {
  return await searchAPI.searchJobs(filters);
};

// Utility function for handling API responses with better error handling
export const handleAPIResponse = async <T>(apiCall: () => Promise<T>): Promise<{ data?: T; error?: APIError }> => {
  try {
    const data = await apiCall();
    return { data };
  } catch (error) {
    console.error('API Error:', error);
    return { error: error as APIError };
  }
};

// Enhanced job application with better error handling
export const applyToJob = async (jobId: string, applicationData: {
  name: string;
  email: string;
  resume: File | null;
}): Promise<{ success: boolean; error?: string; applicationId?: string }> => {
  try {
    const result = await applicationsAPI.applyToJob(jobId, {
      coverLetter: `Application from ${applicationData.name} (${applicationData.email})`,
      resumeUrl: applicationData.resume ? URL.createObjectURL(applicationData.resume) : undefined,
    });
    return { success: true, applicationId: result.applicationId };
  } catch (error) {
    console.error('Error applying to job:', error);
    const apiError = error as APIError;
    return { success: false, error: apiError.message };
  }
};

// Enhanced API functions with better error handling
export const enhancedAPI = {
  // Get notifications with unread count
  getNotificationsWithCount: async (): Promise<{ notifications: Notification[]; unreadCount: number }> => {
    const response = await makeRequest('/notifications');
    const data = await response.json();
    const notifications = Array.isArray(data) ? data : data.notifications || [];
    const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;
    return { notifications, unreadCount };
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: async (): Promise<{ success: boolean }> => {
    const response = await makeRequest('/notifications/read-all', {
      method: 'PUT',
    });
    return response.json();
  },

  // Get user dashboard data
  getDashboardData: async (): Promise<{
    user: User;
    notifications: Notification[];
    recentApplications: Application[];
    savedJobs: Job[];
  }> => {
    const [user, notifications, applications, savedJobsResponse] = await Promise.all([
      authAPI.getCurrentUser(),
      notificationsAPI.getNotifications(),
      applicationsAPI.getUserApplications(),
      savedJobsAPI.getSavedJobs()
    ]);

    // Extract savedJobs array from the response
    const savedJobs = savedJobsResponse.savedJobs || savedJobsResponse || [];

    return {
      user,
      notifications,
      recentApplications: applications.slice(0, 5), // Get last 5 applications
      savedJobs
    };
  },

  // Search with advanced filters
  advancedJobSearch: async (filters: JobFilter & {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    jobs: Job[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }> => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await makeRequest(`/search/jobs?${queryParams.toString()}`);
    return response.json();
  }
};
