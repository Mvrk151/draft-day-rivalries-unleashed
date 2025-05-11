
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-team-blue text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">FootballDraft</h3>
            <p className="text-sm text-gray-300">
              Create your dream football team with friends in our interactive draft experience.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-team-gold transition-colors">Home</Link></li>
              <li><Link to="/dashboard" className="hover:text-team-gold transition-colors">Dashboard</Link></li>
              <li><Link to="/draft/new" className="hover:text-team-gold transition-colors">Create Draft</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-sm text-gray-300">
              Have questions or feedback? <br />
              Email us at: <a href="mailto:info@footballdraft.com" className="text-team-gold hover:underline">info@footballdraft.com</a>
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} FootballDraft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
