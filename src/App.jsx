import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Layout, Sparkles, Image as ImageIcon, Box, Menu, X, ChevronRight, Camera, LogIn, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { logout } from './lib/firebase';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import CanvasDesigner from './pages/CanvasDesigner';
import AIDesign from './pages/AIDesign';
import Inspiration from './pages/Inspiration';
import ARView from './pages/ARView';
import Login from './pages/Login';
import ShareView from './pages/ShareView';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const navLinks = [
    { name: 'Studio', path: '/dashboard' },
    { name: 'Canvas', path: '/canvas' },
    { name: 'Atelier', path: '/ai-design' },
    { name: 'Curations', path: '/inspiration' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-luxury-cream/80 backdrop-blur-xl border-b border-luxury-stone/20">
      <div className="max-w-[1800px] mx-auto px-8 md:px-16">
        <div className="flex justify-between h-24 items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-bold tracking-[0.4em] text-luxury-ink uppercase group-hover:text-brand transition-colors">
              LUMINA<span className="text-brand">+</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-12">
            <div className="flex items-center space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-[9px] font-bold uppercase tracking-[0.2em] transition-all hover:text-brand ${
                    isActive(link.path) ? 'text-brand' : 'text-slate-400'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="w-px h-6 bg-luxury-stone/30" />

            {user ? (
              <div className="flex items-center space-x-8">
                <button 
                  onClick={logout}
                  className="text-[9px] font-bold text-slate-300 hover:text-red-400 transition-colors uppercase tracking-[0.2em]"
                >
                  Leave
                </button>
                <Link to="/dashboard" className="w-10 h-10 rounded-full bg-luxury-stone/20 p-[2px] hover:scale-110 transition-transform">
                   <div className="w-full h-full rounded-full overflow-hidden bg-white">
                      {user.photoURL ? (
                        <img src={user.photoURL} className="w-full h-full object-cover" alt="avatar" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand"><User size={16} /></div>
                      )}
                   </div>
                </Link>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-ink hover:text-brand transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-luxury-ink">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-24 left-0 right-0 bg-luxury-cream border-b border-luxury-stone p-8 space-y-8 shadow-luxury"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block text-sm font-bold uppercase tracking-[0.2em] text-luxury-ink"
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className="min-h-screen pt-20 bg-luxury-cream"
  >
    {children}
  </motion.div>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>} />
          <Route path="/canvas" element={<ProtectedRoute><PageWrapper><CanvasDesigner /></PageWrapper></ProtectedRoute>} />
          <Route path="/ai-design" element={<ProtectedRoute><PageWrapper><AIDesign /></PageWrapper></ProtectedRoute>} />
          <Route path="/inspiration" element={<PageWrapper><Inspiration /></PageWrapper>} />
          <Route path="/ar-view" element={<ARView />} />
          <Route path="/share/:shareId" element={<ShareView />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
