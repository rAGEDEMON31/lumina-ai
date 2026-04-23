import { motion } from 'motion/react';
import { 
  Plus, 
  ArrowRight, 
  Box, 
  Sparkles, 
  Image as ImageIcon, 
  Clock, 
  Camera,
  ChevronRight,
  TrendingUp,
  Layout,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'projects'), 
          where('userId', '==', user.uid),
          orderBy('updatedAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(data);
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [user]);

  const deleteProject = async (id, e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const quickTools = [
    { name: 'Canvas Designer', desc: 'Create 2D room layouts', icon: Box, path: '/canvas', color: 'bg-indigo-50 text-indigo-600' },
    { name: 'AI Redesign', desc: 'Transform photos with AI', icon: Sparkles, path: '/ai-design', color: 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' },
    { name: 'AR Preview', desc: 'Visualize furniture in 3D', icon: Camera, path: '/ar-view', color: 'bg-slate-900 text-white shadow-xl shadow-slate-100' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
             <span className="w-8 h-[2px] bg-indigo-600"></span>
             <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none">Your Creative Studio</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Greetings, {user?.displayName?.split(' ')[0] || 'Designer'}
          </h1>
        </div>
        <p className="text-slate-500 font-medium max-w-sm">Manage your interior projects and explore AI-driven spatial design concepts.</p>
      </div>

      {/* Quick Tools */}
      <div className="grid md:grid-cols-3 gap-6">
        {quickTools.map((tool, i) => (
          <motion.div
            key={tool.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link to={tool.path} className={`group block p-8 rounded-[2.5rem] h-full border border-slate-100 transition-all hover:scale-[1.02] active:scale-95 ${tool.color}`}>
              <tool.icon className="mb-6 group-hover:scale-110 transition-transform" size={28} />
              <h3 className="text-xl font-bold mb-2 tracking-tight">{tool.name}</h3>
              <p className="text-sm opacity-80 font-medium">{tool.desc}</p>
              <ArrowRight className="mt-8 transition-transform group-hover:translate-x-2" size={20} />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Projects Section */}
      <section className="space-y-8 pt-8 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 tracking-tight">
             <Layout className="text-indigo-600" size={24} />
             Your Projects
             <span className="ml-2 px-2 py-0.5 bg-slate-100 rounded-full text-[10px] text-slate-400">{projects.length}</span>
          </h2>
          <Link to="/canvas" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 tracking-widest uppercase flex items-center group">
            New Canvas <Plus size={14} className="ml-1 transition-transform group-hover:rotate-90" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-50 rounded-3xl animate-pulse border border-slate-100" />)}
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-slate-50 rounded-[3rem] p-16 text-center border border-slate-100 border-dashed">
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                <Box className="text-slate-200" size={32} />
             </div>
             <h4 className="font-bold text-slate-900 mb-2 tracking-tight italic text-lg text-slate-400 uppercase tracking-widest">The canvas is currently empty</h4>
             <p className="text-sm text-slate-400 mb-8 max-w-xs mx-auto">Start your first room design project to see it appear here in your dashboard.</p>
             <Link to="/canvas" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                <Plus size={18} /> Create Project
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                whileHover={{ y: -5 }}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-canvas transition-all"
              >
                <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden bg-dots">
                   {project.thumbnail ? (
                     <img src={project.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={project.name} />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-200"><Layout size={48} /></div>
                   )}
                   <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold text-slate-900 uppercase tracking-widest border border-white/50 shadow-sm">
                      Active Design
                   </div>
                   <button 
                    onClick={(e) => deleteProject(project.id, e)}
                    className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
                <div className="p-8">
                  <h3 className="font-bold text-slate-900 mb-4 tracking-tight group-hover:text-indigo-600 transition-colors uppercase text-sm tracking-widest">{project.name}</h3>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                    <span className="flex items-center gap-1"><Clock size={12} /> {project.updatedAt ? new Date(project.updatedAt.seconds * 1000).toLocaleDateString() : 'Just now'}</span>
                    <Link to="/canvas" className="text-indigo-600 hover:translate-x-1 transition-transform">Edit Project</Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
