import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';

export const useCompanyProfile = () => {
  const { user, isEmployer } = useAuth();
  const [companyProfile, setCompanyProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCompanyProfile = async () => {
    if (!user || !isEmployer()) return;
    
    setIsLoadingProfile(true);
    setError(null);
    
    try {
      const userData = await usersAPI.fetchUserById(user.id);
      console.log('Company profile data loaded:', userData);
      
      // Ensure we have company name data - use stored company name if available
      if (!userData.companyName) {
        const storedCompanyName = localStorage.getItem('employerCompanyName');
        if (storedCompanyName) {
          userData.companyName = storedCompanyName;
          console.log('No companyName found, using stored company name:', storedCompanyName);
        } else if (userData.name) {
          userData.companyName = userData.name;
          console.log('No companyName found, using name as fallback:', userData.name);
        }
      }
      
      setCompanyProfile(userData);
    } catch (err) {
      console.error('Error loading company profile:', err);
      setError('Failed to load company profile');
      setCompanyProfile(null);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const refreshCompanyProfile = async () => {
    await loadCompanyProfile();
  };

  useEffect(() => {
    loadCompanyProfile();
  }, [user]);

  const getCompanyName = () => {
    if (isLoadingProfile) return 'Loading...';
    
    // Enhanced company name resolution with better fallbacks
    const storedCompanyName = localStorage.getItem('employerCompanyName');
    const name = companyProfile?.companyName || 
                 companyProfile?.name ||
                 user?.companyName || 
                 user?.name ||
                 storedCompanyName || // Use stored company name as strong fallback
                 'COMPANY';
    
    console.log('Company name resolution (ENHANCED):', {
      companyProfileCompanyName: companyProfile?.companyName,
      companyProfileName: companyProfile?.name,
      userCompanyName: user?.companyName,
      userName: user?.name,
      storedCompanyName: storedCompanyName,
      finalName: name,
      note: 'Using multiple fallback sources for company name'
    });
    
    return name;
  };

  const getCompanyLogo = () => {
    return companyProfile?.companyLogo || null;
  };

  // Force refresh company profile
  const forceRefresh = async () => {
    console.log('Force refreshing company profile...');
    await loadCompanyProfile();
  };

  return {
    companyProfile,
    isLoadingProfile,
    error,
    loadCompanyProfile,
    refreshCompanyProfile,
    forceRefresh,
    getCompanyName,
    getCompanyLogo
  };
};
