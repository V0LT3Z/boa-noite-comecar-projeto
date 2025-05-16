
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <Link to="/admin" className={`flex items-center ${className || ''}`}>
      <span className="text-lg font-gooddog font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        NOKTA TICKETS Admin
      </span>
    </Link>
  );
};

export default Logo;
