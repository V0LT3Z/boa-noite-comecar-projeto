
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showAdmin?: boolean;
}

export const Logo = ({ className, showAdmin = false }: LogoProps) => {
  return (
    <Link to="/admin" className={`flex items-center ${className || ''}`}>
      <span className="text-lg font-gooddog font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        NOKTA TICKETS{showAdmin ? ' Admin' : ''}
      </span>
    </Link>
  );
};

export default Logo;
