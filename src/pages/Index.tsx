
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-team-blue text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Build Your Dream Football Team</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Create a fantasy draft with friends and pick from the best footballers across the world's top leagues.
            </p>
            {isAuthenticated ? (
              <Link to="/draft/new">
                <Button size="lg" className="bg-team-gold hover:bg-amber-500 text-black font-bold px-8 py-6 text-lg">
                  Start New Draft
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button size="lg" className="bg-team-gold hover:bg-amber-500 text-black font-bold px-8 py-6 text-lg">
                  Sign Up Now
                </Button>
              </Link>
            )}
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-pitch rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Create Your Draft</h3>
                <p className="text-gray-600">
                  Set up your draft by choosing the number of teams and selecting your mode: Champions League, Premier League, or Top 5 Leagues.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-pitch rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Pick Your Players</h3>
                <p className="text-gray-600">
                  Take turns drafting players to build your 4-3-3 formation. Remember, only 2 players from the same real team allowed!
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-pitch rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Share Your Team</h3>
                <p className="text-gray-600">
                  When the draft is complete, view your team in a realistic 4-3-3 formation and share with friends.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-pitch-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Your Draft?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of football fans creating their dream teams through our interactive draft platform.
            </p>
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" className="bg-white text-team-blue hover:bg-gray-100">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <Link to="/login">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-team-blue">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" className="bg-team-gold hover:bg-amber-500 text-black">
                    Register Now
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
