
// We need to make sure the Header component handles auth errors gracefully
// by showing the login/register options when auth state is corrupted.
// Since Header.tsx is read-only, we'll create a wrapper component to handle this.

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import OriginalHeader from './Header';

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
  return <OriginalHeader />;
};

export default HeaderWrapper;
