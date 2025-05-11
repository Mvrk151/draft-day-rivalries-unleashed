
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, LogIn, User, Home, Menu, X } from "lucide-react";

const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-team-blue text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
          <div className="flex items-center justify-center w-10 h-10 bg-pitch rounded-full">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" stroke="white" strokeWidth="2" />
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" fill="white" />
            </svg>
          </div>
          <span>FootballDraft</span>
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/" className="hover:text-team-gold transition-colors">
            <Home className="h-5 w-5 inline-block mr-1" />
            Home
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:text-team-gold transition-colors">Dashboard</Link>
              <div className="flex items-center gap-2">
                <div className="text-sm">
                  <span>Hi, </span>
                  <span className="font-bold">{user?.username}</span>
                </div>
                <Button variant="secondary" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary" size="sm">
                  <LogIn className="h-4 w-4 mr-2" /> Login
                </Button>
              </Link>
              <Link to="/register">
                <Button>
                  <User className="h-4 w-4 mr-2" /> Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4">
          <div className="flex flex-col gap-4">
            <Link to="/" className="hover:text-team-gold transition-colors" onClick={toggleMenu}>
              <Home className="h-5 w-5 inline-block mr-1" />
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-team-gold transition-colors" onClick={toggleMenu}>
                  Dashboard
                </Link>
                <div className="text-sm py-2">
                  <span>Hi, </span>
                  <span className="font-bold">{user?.username}</span>
                </div>
                <Button variant="secondary" size="sm" onClick={() => { logout(); toggleMenu(); }}>
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={toggleMenu}>
                  <Button variant="secondary" size="sm" className="w-full">
                    <LogIn className="h-4 w-4 mr-2" /> Login
                  </Button>
                </Link>
                <Link to="/register" onClick={toggleMenu}>
                  <Button className="w-full">
                    <User className="h-4 w-4 mr-2" /> Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
