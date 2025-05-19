
// We need to make sure the Header component handles auth errors gracefully
// by showing the login/register options when auth state is corrupted.
// Since Header.tsx is read-only, we'll create a wrapper component to handle this.

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import OriginalHeader from './Header';

const Header: React.FC = () => {
  // Simply render the original header
  // The error handling is now done in the HeaderWrapper component
  return <OriginalHeader />;
};

export default Header;
