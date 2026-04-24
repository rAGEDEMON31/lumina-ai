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
    { name: 'Design Studio', desc: 'Craft bespoke 2D room layouts', icon: Box, path: '/canvas', color: 'bg-white text-luxury-ink border-slate-100' },
    { name: 'AI Atelier', desc: 'Reimagine spaces with creative AI', icon: Sparkles, path: '/ai-design', color: 'bg-brand text-white shadow-luxury' },
    { name: 'AR View', desc: 'Visualize furniture in your space', icon: Camera, path: '/ar-view', color: 'bg-luxury-ink text-white shadow-luxury' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4 mb-6">
             <span className="w-12 h-[1px] bg-brand"></span>
             <span className="text-luxury-label">Private Studio</span>
          </div>
          <h1 className="text-5xl md:text-7xl text-luxury-display text-luxury-ink mb-2">
            Greetings, {user?.displayName?.split(' ')[0] || 'Designer'}
          </h1>
          <p className="text-slate-400 font-medium text-lg italic serif">Welcome back to your creative sanctuary.</p>
        </div>
        <p className="text-slate-400 font-medium max-w-xs text-sm leading-relaxed">Curate your portfolio, refine your concepts, and explore the future of spatial design.</p>
      </div>

      {/* Quick Tools */}
      <div className="grid md:grid-cols-3 gap-8">
        {quickTools.map((tool, i) => (
          <motion.div
            key={tool.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to={tool.path} className={`group block p-10 rounded-[3rem] h-full border transition-all hover:scale-[1.02] active:scale-98 ${tool.color}`}>
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <tool.icon size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3 tracking-tight">{tool.name}</h3>
              <p className="text-sm opacity-70 font-medium leading-relaxed">{tool.desc}</p>
              <div className="mt-12 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
                Explore Tool <ArrowRight size={14} className="transition-transform group-hover:translate-x-2" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Projects Section */}
      <section className="space-y-12 pt-16 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl text-luxury-display text-luxury-ink flex items-center gap-4">
             Your Portfolio
             <span className="text-[10px] uppercase font-sans tracking-[0.2em] px-3 py-1 bg-luxury-paper rounded-full text-slate-400 font-bold">{projects.length} Entries</span>
          </h2>
          <Link to="/canvas" className="text-[10px] font-bold text-brand hover:text-luxury-ink tracking-[0.2em] uppercase flex items-center group transition-colors">
            New Concept <Plus size={14} className="ml-2 transition-transform group-hover:rotate-90" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
             {[1,2,3].map(i => <div key={i} className="h-80 bg-luxury-paper rounded-[3rem] animate-pulse" />)}
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-[4rem] p-24 text-center border border-slate-50 shadow-sm">
             <div className="w-20 h-20 bg-luxury-paper rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                <Box className="text-slate-200" size={40} />
             </div>
             <h4 className="text-3xl text-luxury-display text-luxury-ink mb-4">The gallery awaits your vision.</h4>
             <p className="text-slate-400 font-medium mb-12 max-w-sm mx-auto leading-relaxed">Begin your first architectural concept or interior design to see it reflected here in your private studio.</p>
             <Link to="/canvas" className="inline-flex items-center gap-3 bg-brand text-white px-12 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-brand/20 hover:bg-luxury-ink transition-all">
                <Plus size={18} /> Compose Design
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -10 }}
                className="group bg-white rounded-[3rem] overflow-hidden border border-slate-50 shadow-clean hover:shadow-luxury transition-all duration-700"
              >
                <div className="aspect-[4/5] bg-luxury-paper relative overflow-hidden bg-dots">
                   {project.thumbnail ? (
                     <img src={project.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" alt={project.name} />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-200"><Layout size={64} strokeWidth={1} /></div>
                   )}
                   <div className="absolute top-6 left-6 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                      <span className="text-[9px] font-bold text-white uppercase tracking-[0.2em]">Archived Concept</span>
                   </div>
                   <button 
                    onClick={(e) => deleteProject(project.id, e)}
                    className="absolute bottom-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
                   >
                     <Trash2 size={18} />
                   </button>
                </div>
                <div className="p-10">
                  <h3 className="text-2xl text-luxury-display text-luxury-ink mb-6 group-hover:text-brand transition-colors">{project.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
                       <Clock size={12} /> {project.updatedAt ? new Date(project.updatedAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                    </span>
                    <Link to="/canvas" className="text-[10px] font-bold text-brand hover:gap-3 transition-all uppercase tracking-widest flex items-center gap-2">
                      Review <ArrowRight size={12} />
                    </Link>
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
