import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, AuthContextType } from '../types/user';
import { authAPI } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    // Check if user is logged in and validate token
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          // Verify token is still valid by fetching current user
          const currentUser = await authAPI.getCurrentUser();
          setUser(currentUser);
        } catch (error: any) {
          console.log('Token validation failed:', error);
          // Token is invalid, clear storage
          authAPI.logout();
          setUser(null);
          
          // If it's a 401 error, show a message to the user
          if (error.status === 401) {
            console.log('Session expired, user needs to login again');
            setSessionExpired(true);
          }
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.token && response.user) {
        let userToStore = { ...response.user };
        
        // Frontend fix: If backend didn't return companyName for employer, try to get it from localStorage
        if (userToStore.role === 'employer' && !userToStore.companyName) {
          const storedCompanyName = localStorage.getItem('employerCompanyName');
          if (storedCompanyName) {
            userToStore.companyName = storedCompanyName;
            console.log('Frontend: Added companyName from localStorage to user object during login:', userToStore.companyName);
          }
        }
        
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(userToStore));
        setUser(userToStore);
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific error cases
      if (error.status === 401) {
        throw new Error('Invalid email or password. Please try again.');
      } else if (error.status === 403) {
        throw new Error('Account is disabled. Please contact support.');
      } else if (error.status === 429) {
        throw new Error('Too many login attempts. Please try again later.');
      } else if (error.status === 0) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      } else if (error.message && error.message.includes('temporarily unavailable')) {
        throw new Error('Login service is temporarily unavailable. Please try registering a new account or contact support.');
      } else {
        throw new Error(error.message || 'Login failed. Please try again.');
      }
    }
  };

  const signup = async (name: string, email: string, password: string, role: UserRole, additionalData: Partial<User> = {}): Promise<boolean> => {
    try {
      const registrationData = {
        name,
        email,
        password,
        role,
        phone: additionalData.phone,
        companyName: additionalData.companyName,
        skills: additionalData.skills,
      };
      
      console.log('Registration data being sent:', registrationData);
      
      const response = await authAPI.register(registrationData);
      
      console.log('Registration response received:', response);

      if (response.token && response.user) {
        let userToStore = { ...response.user };
        
        // Frontend fix: If backend didn't return companyName for employer, add it manually
        if (role === 'employer' && additionalData.companyName && !userToStore.companyName) {
          userToStore.companyName = additionalData.companyName;
          console.log('Frontend: Added companyName to user object:', userToStore.companyName);
        }
        
        // Store company name separately for robustness
        if (role === 'employer' && additionalData.companyName) {
          localStorage.setItem('employerCompanyName', additionalData.companyName);
          console.log('Frontend: Stored companyName in localStorage:', additionalData.companyName);
        }
        
        console.log('User data from registration:', userToStore);
        console.log('Company name in user data:', userToStore.companyName);
        
        // Store token and user data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(userToStore));
        setUser(userToStore);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Handle specific error cases
      if (error.status === 409) {
        throw new Error('Email already exists. Please try a different email.');
      } else if (error.status === 422) {
        throw new Error('Invalid input data. Please check your information.');
      } else if (error.status === 0) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      } else {
        throw new Error(error.message || 'Registration failed. Please try again.');
      }
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setSessionExpired(false);
  };

  const handleSessionExpired = () => {
    console.log('Handling session expiration');
    authAPI.logout();
    setUser(null);
    setSessionExpired(true);
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const isEmployee = (): boolean => {
    return user?.role === 'employee';
  };

  const isEmployer = (): boolean => {
    return user?.role === 'employer';
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isLoading,
    hasRole,
    isEmployee,
    isEmployer,
    sessionExpired,
    handleSessionExpired
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
