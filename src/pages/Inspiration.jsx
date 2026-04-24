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
    
    // Better fallback behavior using source.unsplash.com pattern or high-quality static ids
    const fallbackIds = [
      '1616486338812-3dadae4b4ace', '1524758631624-e2822e304c36', '1618221195710-dd6b41faaea6',
      '1515542706656-8e6ef17a1521', '1566665797739-1674de7a421a', '1556911220-e15b29be8c8f',
      '1524230507669-5ff97982bb5e', '1493663212050-b7dc42a1d0ee', '1616486338812-3dadae4b4ace'
    ];

    if (!accessKey || accessKey === 'YOUR_KEY_HERE') {
      const results = Array.from({ length: 12 }).map((_, i) => ({
        id: `${category}-${i}`,
        url: `https://images.unsplash.com/photo-${fallbackIds[i % fallbackIds.length]}?auto=format&fit=crop&q=80&w=800&sig=${i}`
      }));
      setGallery(results);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${category} architectural interior photography&client_id=${accessKey}&per_page=16&orientation=portrait`
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 mb-20">
        <div className="max-w-2xl">
           <span className="text-luxury-label mb-4 block">Visual Board</span>
           <h1 className="text-5xl md:text-7xl text-luxury-display text-luxury-ink mb-6">Gallery of Inspiration</h1>
           <p className="text-slate-500 font-medium leading-relaxed max-w-xl">
             Explore over 30 bespoke architectural and interior categories. Curate your vision from thousands of professionally designed spaces.
           </p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm">
           {Object.keys(CATEGORIES).map(tab => (
             <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setActiveCategory(CATEGORIES[tab][0]);
              }}
              className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-luxury-ink text-white shadow-xl' : 'text-slate-400 hover:text-luxury-ink'
              }`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      {/* Category Ribbon */}
      <div className="mb-20 overflow-x-auto pb-6 hide-scrollbar">
        <div className="flex gap-4 min-w-max px-2">
           {CATEGORIES[activeTab].map(cat => (
             <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap border transition-all ${
                activeCategory === cat 
                  ? 'bg-brand text-white border-brand scale-105 shadow-lg shadow-brand/20' 
                  : 'bg-white text-slate-400 border-slate-100 hover:border-brand/30 hover:text-brand'
              }`}
             >
               {cat}
             </button>
           ))}
        </div>
      </div>

      {/* Pinterest Masonry Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[500px]">
           <Loader2 className="animate-spin text-brand mb-8" size={48} strokeWidth={1.5} />
           <p className="text-slate-300 font-bold uppercase tracking-[0.3em] text-[10px]">Curating your bespoke gallery...</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
          <AnimatePresence>
            {gallery.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (i % 8) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative rounded-[3rem] overflow-hidden bg-white border border-slate-50 break-inside-avoid shadow-clean hover:shadow-luxury transition-all duration-700"
              >
                <img 
                  src={item.url} 
                  alt={activeCategory} 
                  className="w-full h-auto transition-transform duration-[2000ms] group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-luxury-ink/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-between p-10 backdrop-blur-[4px]">
                   <div className="flex justify-end">
                      <button 
                        onClick={() => toggleFavorite(item.id)}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${
                          favorites.has(item.id) ? 'bg-red-500 text-white' : 'bg-white/10 backdrop-blur-md text-white hover:bg-brand'
                        }`}
                      >
                         <Heart size={24} fill={favorites.has(item.id) ? "currentColor" : "none"} strokeWidth={1.5} />
                      </button>
                   </div>
                   
                   <div className="space-y-6">
                      <div className="flex items-center gap-3 text-white/70 text-[9px] font-bold uppercase tracking-[0.2em]">
                         <Zap size={14} className="text-brand" /> AI Aesthetic curation
                      </div>
                      <h3 className="text-3xl text-luxury-display text-white italic leading-tight">
                        {activeCategory}
                      </h3>
                      <div className="flex gap-3">
                         <button className="flex-1 bg-white text-luxury-ink py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand hover:text-white transition-all duration-300">
                            Save Concept
                         </button>
                         <button className="w-14 h-14 bg-white/10 backdrop-blur-md text-white rounded-2xl flex items-center justify-center hover:bg-white hover:text-luxury-ink transition-all duration-300">
                            <Share2 size={20} strokeWidth={1.5} />
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
