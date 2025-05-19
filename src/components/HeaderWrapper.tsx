
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from './Header';

/**
 * HeaderWrapper component that wraps the original Header component
 * to provide additional functionality like auth error handling.
 */
const HeaderWrapper: React.FC = () => {
  const auth = useAuth();
  
  useEffect(() => {
    // If user info appears corrupted or inconsistent, force logout
    if (auth.user && (!auth.user.id || !auth.user.email)) {
      console.warn("Detected potentially corrupted user data in Header, cleaning up...");
      try {
        auth.logout();
      } catch (error) {
        console.error("Error during logout:", error);
      }
    }
  }, [auth.user]);
  
  // Fallback to the original header, which will show login options
  // when the user is not authenticated
  return <Header />;
};

export default HeaderWrapper;
