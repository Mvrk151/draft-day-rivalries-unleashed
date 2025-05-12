
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Swords, Users } from "lucide-react";
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
        <section className="relative overflow-hidden bg-team-blue text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="pitch-background w-full h-full"></div>
          </div>
          <div className="container mx-auto px-4 py-24 text-center relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">Fantasy Football Draft</h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
              Build your dream team in a 4-3-3 formation with friends. Choose from the best players in world football.
            </p>
            {isAuthenticated ? (
              <Link to="/draft/new">
                <Button size="lg" className="bg-team-gold hover:bg-amber-500 text-black font-bold px-8 py-6 text-lg">
                  <Swords className="mr-2 h-6 w-6" />
                  Start New Draft
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button size="lg" className="bg-team-gold hover:bg-amber-500 text-black font-bold px-8 py-6 text-lg">
                  <Users className="mr-2 h-6 w-6" />
                  Sign Up Now
                </Button>
              </Link>
            )}
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-10">
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center transform transition hover:-translate-y-2">
                <div className="w-20 h-20 bg-pitch rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <span className="text-white text-3xl font-bold">1</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Create Your Draft</h3>
                <p className="text-gray-600">
                  Set up your draft by choosing the number of teams and selecting your preferred mode: Champions League, Premier League, or Top 5 Leagues.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center transform transition hover:-translate-y-2">
                <div className="w-20 h-20 bg-pitch rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <span className="text-white text-3xl font-bold">2</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Draft Your Squad</h3>
                <p className="text-gray-600">
                  Take turns with your friends selecting players position by position to build your 4-3-3 formation on the same device.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center transform transition hover:-translate-y-2">
                <div className="w-20 h-20 bg-pitch rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <span className="text-white text-3xl font-bold">3</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Share Your Team</h3>
                <p className="text-gray-600">
                  When the draft is complete, view all teams in a realistic 4-3-3 formation on the pitch and share results with your friends.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Formation Preview Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <h2 className="text-4xl font-bold mb-6">Build Your Perfect Formation</h2>
                <p className="text-lg mb-8">
                  Our interactive draft board lets you click on positions to select players. Build your dream team in a 4-3-3 formation, carefully selecting each position.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-team-blue text-white rounded-full p-1 mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Select 1 Goalkeeper (GK)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-team-blue text-white rounded-full p-1 mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">4 Defenders (LB, LCB, RCB, RB)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-team-blue text-white rounded-full p-1 mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">3 Midfielders (LCM, CM, RCM)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-team-blue text-white rounded-full p-1 mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">3 Forwards (LW, ST, RW)</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 mt-10 md:mt-0">
                <div className="pitch-background h-[400px] max-w-md mx-auto rounded-xl shadow-xl overflow-hidden relative">
                  {/* Basic field lines */}
                  <div className="absolute inset-0">
                    <div className="border-2 border-white opacity-50 h-full w-full"></div>
                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-0.5 bg-white opacity-50"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white rounded-full opacity-50"></div>
                  </div>
                  
                  {/* Example players in formation */}
                  <div className="absolute top-[15%] left-1/2 -translate-x-1/2">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                      <span className="font-bold text-sm">ST</span>
                    </div>
                  </div>
                  <div className="absolute top-[20%] left-[15%]">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                      <span className="font-bold text-sm">LW</span>
                    </div>
                  </div>
                  <div className="absolute top-[20%] right-[15%]">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                      <span className="font-bold text-sm">RW</span>
                    </div>
                  </div>
                  {/* More positions... */}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-pitch-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Your Draft?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Gather your friends around one screen and build your ultimate football teams together!
            </p>
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" className="bg-white text-team-blue hover:bg-gray-100 font-bold">
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
                  <Button size="lg" className="bg-team-gold hover:bg-amber-500 text-black font-bold">
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
