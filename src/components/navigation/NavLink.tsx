
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}

const NavLink = ({ href, active, children }: NavLinkProps) => {
  return (
    <Link 
      to={href} 
      className={cn(
        "relative py-2 font-gooddog",
        active
          ? "text-primary font-medium"
          : "text-gray-600 hover:text-gray-900"
      )}
    >
      {children}
      {active && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-secondary" />
      )}
    </Link>
  );
};

export default NavLink;
