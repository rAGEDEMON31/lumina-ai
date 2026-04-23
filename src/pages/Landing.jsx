import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, Box, Camera } from 'lucide-react';

export default function Landing() {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8 inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-bold uppercase tracking-widest text-indigo-600"
          >
            <Sparkles size={12} className="mr-2" />
            AI-Powered Interior Design
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6"
          >
            Design your space <br />
            <span className="text-indigo-600/40">beyond imagination.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="max-w-2xl mx-auto text-lg text-slate-500 mb-10 font-medium"
          >
            Lumina+ combines 2D professional layout tools, AI-driven room redesign, 
            and web-based AR to help you visualize your dream home in minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/dashboard"
              className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold border border-indigo-500 hover:bg-indigo-700 transition-all group shadow-xl shadow-indigo-100 flex items-center justify-center"
            >
              Get Started
              <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/inspiration"
              className="w-full sm:w-auto bg-white text-slate-600 border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center"
            >
              Learn More
            </Link>
          </motion.div>
        </div>

        {/* Hero Image Mockup */}
        <div className="mt-20 max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100"
          >
            <img 
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000" 
              alt="Premium Interior"
              className="w-full h-[400px] md:h-[600px] object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                <Box className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">2D Canvas Editor</h3>
              <p className="text-gray-600 leading-relaxed">
                Precise furniture placement and room layout with our professional-grade 2D engine.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                <Sparkles className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">AI Redesign</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload a photo of your existing room and let our AI generate stunning new concepts instantly.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                <Camera className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Web AR Viewing</h3>
              <p className="text-gray-600 leading-relaxed">
                Visualize selected furniture in your real environment using our zero-install web AR viewer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 text-center text-gray-400 text-sm">
        <p>&copy; 2026 Lumina+ Interior Design Lab. All rights reserved.</p>
      </footer>
    </div>
  );
}
