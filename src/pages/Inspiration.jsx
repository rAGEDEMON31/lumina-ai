import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Zap, Loader2, Download, Heart, LayoutGrid, ChevronRight, Share2 } from 'lucide-react';

const CATEGORIES = {
  'Living Room': [
    'Modern Minimalist', 'Industrial Loft', 'Scandinavian', 'Boho Chic', 'Mid-Century Modern', 
    'Japandi', 'Art Deco', 'Contemporary', 'Coastal', 'Traditional'
  ],
  'Bedroom': [
    'Cozy Sanctuary', 'Master Luxury', 'Kids Playful', 'Guest Chic', 'Zen Retreat', 
    'Rustic Barn', 'Urban Studio', 'Romantic Suite', 'Dark Academic', 'Organic Modern'
  ],
  'Kitchen': [
    'Gourmet Chef', 'Farmhouse Style', 'Sleek Black', 'Colorful Pastel', 'Small Space Logic', 
    'Open Concept', 'Marble Luxury', 'Wood Accents', 'Vintage Charm', 'Bistro Vibes'
  ]
};

export default function Inspiration() {
  const [activeTab, setActiveTab] = useState('Living Room');
  const [activeCategory, setActiveCategory] = useState('Modern Minimalist');
  const [loading, setLoading] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [favorites, setFavorites] = useState(new Set());

  // Function to fetch dynamic images based on category
  const fetchImages = async (category) => {
    const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
    if (!accessKey || accessKey === 'YOUR_KEY_HERE') {
      // Fallback behavior if key is missing
      const results = Array.from({ length: 12 }).map((_, i) => ({
        id: `${category}-${i}`,
        url: `https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800&sig=${i}`
      }));
      setGallery(results);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${category} interior design&client_id=${accessKey}&per_page=16`
      );
      const data = await response.json();
      const results = data.results.map(img => ({
        id: img.id,
        url: img.urls.regular
      }));
      setGallery(results);
    } catch (error) {
      console.error("Gallery fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(activeCategory);
  }, [activeCategory]);

  const toggleFavorite = (id) => {
    const newFavs = new Set(favorites);
    if (newFavs.has(id)) newFavs.delete(id);
    else newFavs.add(id);
    setFavorites(newFavs);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div className="max-w-xl">
           <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">Design Inspiration</h1>
           <p className="text-slate-500 font-medium leading-relaxed">
             Explore 30+ curated categories across Living, Bedroom, and Kitchen. Your digital vision board for a more beautiful home.
           </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
           {Object.keys(CATEGORIES).map(tab => (
             <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setActiveCategory(CATEGORIES[tab][0]);
              }}
              className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'
              }`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      {/* Category Ribbon */}
      <div className="mb-12 overflow-x-auto pb-4 hide-scrollbar">
        <div className="flex gap-3 min-w-max">
           {CATEGORIES[activeTab].map(cat => (
             <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-3 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                activeCategory === cat 
                  ? 'bg-slate-900 text-white border-slate-900 scale-105' 
                  : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
              }`}
             >
               {cat}
             </button>
           ))}
        </div>
      </div>

      {/* Pinterest Masonry Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
           <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
           <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Curating your gallery...</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          <AnimatePresence>
            {gallery.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: (i % 8) * 0.05 }}
                className="group relative rounded-[2.5rem] overflow-hidden bg-white border border-slate-100 break-inside-avoid shadow-sm hover:shadow-2xl transition-all"
              >
                <img 
                  src={item.url} 
                  alt={activeCategory} 
                  className="w-full h-auto transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-8 backdrop-blur-[2px]">
                   <div className="flex justify-end">
                      <button 
                        onClick={() => toggleFavorite(item.id)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          favorites.has(item.id) ? 'bg-red-500 text-white' : 'bg-white/20 backdrop-blur-md text-white hover:bg-white'
                        }`}
                      >
                         <Heart size={20} fill={favorites.has(item.id) ? "currentColor" : "none"} />
                      </button>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-widest">
                         <Zap size={14} /> AI Curated Style
                      </div>
                      <h3 className="text-xl font-bold text-white tracking-tight leading-tight">
                        {activeCategory} {activeTab} Concept
                      </h3>
                      <div className="flex gap-2">
                         <button className="flex-1 bg-white text-slate-900 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-50 transition-colors">
                            Download
                         </button>
                         <button className="w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-xl flex items-center justify-center hover:bg-white/30 transition-all">
                            <Share2 size={18} />
                         </button>
                      </div>
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-24 text-center pb-12">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="inline-block p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[3rem]"
        >
          <div className="bg-white px-12 py-8 rounded-[2.9rem] flex flex-col items-center">
             <LayoutGrid className="text-indigo-600 mb-4" size={32} />
             <h4 className="text-2xl font-bold text-slate-900 mb-2">Want to try this in your room?</h4>
             <p className="text-slate-400 text-sm font-medium mb-8">Use our AI Redesign tool to apply these styles to your own photos.</p>
             <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-slate-200">
               Go to AI Redesign
             </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
