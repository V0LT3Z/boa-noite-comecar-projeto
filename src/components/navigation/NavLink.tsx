
import { Link } from 'react-router-dom';
import React from 'react';

interface NavLinkProps {
  href: string;
  active: boolean;
  children: React.ReactNode;
}

export const NavLink: React.FC<NavLinkProps> = ({ href, active, children }) => {
  return (
    <Link
      to={href}
      className={`text-sm font-medium transition-colors hover:text-primary ${
        active ? 'text-primary relative after:content-[""] after:absolute after:left-0 after:right-0 after:-bottom-5 after:h-0.5 after:bg-primary after:rounded-full' : 'text-gray-600'
      }`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
