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
    { name: 'Dashboard', path: '/dashboard', icon: Layout },
    { name: 'Canvas Designer', path: '/canvas', icon: Box },
    { name: 'AI Redesign', path: '/ai-design', icon: Sparkles },
    { name: 'Inspiration', path: '/inspiration', icon: ImageIcon },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-indigo-600 uppercase">LUMINA<span className="text-slate-300">+</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-slate-900 ${
                  isActive(link.path) ? 'text-indigo-600' : 'text-slate-500'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="w-px h-4 bg-slate-100 mx-2" />

            {user ? (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={logout}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  SIGN OUT
                </button>
                <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                   {user.photoURL ? (
                     <img src={user.photoURL} className="w-8 h-8 rounded-full" alt="avatar" />
                   ) : (
                     <User size={16} />
                   )}
                </div>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors"
              >
                <LogIn size={16} />
                <span>SIGN IN</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-500">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
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
    transition={{ duration: 0.4, ease: 'easeOut' }}
    className="min-h-screen pt-16 bg-white"
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
