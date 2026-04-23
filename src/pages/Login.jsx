import { motion } from 'motion/react';
import { signInWithGoogle } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { LogIn, Sparkles, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      if (error.code === 'auth/cancelled-popup-request') {
        console.warn("Authentication popup was cancelled or interrupted.");
      } else {
        console.error("Login failed", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-dots">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-canvas border border-slate-100 p-12 text-center"
      >
        <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
           <span className="text-3xl font-extrabold text-indigo-600 uppercase">L+</span>
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to Lumina+</h1>
        <p className="text-slate-500 font-medium mb-12">Sign in to save your designs and collaborate with AI.</p>

        <button 
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all group disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <RefreshCw size={20} className="animate-spin" />
          ) : (
            <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
          )}
          <span>{loading ? 'Connecting...' : 'Continue with Google'}</span>
        </button>

        <div className="mt-10 flex items-center justify-center gap-2 text-indigo-600/60 font-bold text-[10px] uppercase tracking-widest">
           <Sparkles size={14} /> <span>Powered by Gemini AI</span>
        </div>
      </motion.div>
    </div>
  );
}
