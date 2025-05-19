
import React from 'react';
import Header from './Header';

/**
 * HeaderWrapper component that wraps the original Header component
 * to provide additional functionality like auth error handling.
 */
const HeaderWrapper: React.FC = () => {
  // Here we can add any additional logic we need
  // before rendering the original Header component
  
  return <Header />;
};

export default HeaderWrapper;
