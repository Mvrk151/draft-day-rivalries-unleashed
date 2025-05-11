
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-6">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
              <circle cx="60" cy="60" r="60" fill="#F6F6F7"/>
              <path d="M50 30L70 30L60 50L50 30Z" fill="#0FA866"/>
              <path d="M50 90L70 90L60 70L50 90Z" fill="#0FA866"/>
              <text x="60" y="65" fontFamily="Arial" fontSize="36" fontWeight="bold" fill="#1A365D" textAnchor="middle">404</text>
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-team-blue mb-4">Page Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">
            We couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="bg-team-blue">
                Return to Home
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
