import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  RotateCw, 
  Search, 
  Download, 
  Box, 
  Grid, 
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Move,
  Save,
  Share2,
  Sparkles,
  Clipboard,
  Check,
  RefreshCw,
  X,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Link, useParams } from 'react-router-dom';

const DEFAULT_FURNITURE = [
  { id: 'sofa-1', name: 'Velvet Sofa', type: 'sofa', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800' },
  { id: 'table-1', name: 'Handcrafted Table', type: 'table', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&q=80&w=800' },
  { id: 'chair-1', name: 'Nordic Chair', type: 'chair', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800' },
  { id: 'lamp-1', name: 'Minimalist Lamp', type: 'lamp', image: 'https://images.unsplash.com/photo-1507473885765-e6ed6576c0ad?auto=format&fit=crop&q=80&w=800' },
];

export default function CanvasDesigner() {
  const { user } = useAuth();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState(DEFAULT_FURNITURE);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState(null);
  const [projectId, setProjectId] = useState(null);

  // Fetch initial relevant furniture items from Unsplash if key is present
  useEffect(() => {
    const fetchInitialCatalog = async () => {
      const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
      if (!accessKey || accessKey === 'YOUR_KEY_HERE') return;

      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=luxury furniture interior&client_id=${accessKey}&per_page=12&orientation=squarish`
        );
        const data = await response.json();
        if (data.results?.length > 0) {
          const results = data.results.map(img => ({
            id: img.id,
            name: img.description?.split(' ').slice(0, 3).join(' ') || "Designer Piece",
            type: 'curated',
            image: img.urls.regular
          }));
          setSearchResults(results);
        }
      } catch (error) {
        console.error("Initial catalog fetch failed", error);
      }
    };

    fetchInitialCatalog();
  }, []);

  useEffect(() => {
    const initCanvas = new fabric.Canvas(canvasRef.current, {
      width: containerRef.current.clientWidth,
      height: 600,
      backgroundColor: 'transparent',
    });

    initCanvas.on('selection:created', (e) => setSelectedObject(e.target));
    initCanvas.on('selection:updated', (e) => setSelectedObject(e.target));
    initCanvas.on('selection:cleared', () => setSelectedObject(null));

    setCanvas(initCanvas);

    return () => initCanvas.dispose();
  }, []);

  // Handle canvas responsiveness
  useEffect(() => {
    if (!canvas || !containerRef.current) return;

    const resizeCanvas = () => {
      window.requestAnimationFrame(() => {
        if (!containerRef.current || !canvas) return;
        const width = containerRef.current.clientWidth;
        const height = window.innerWidth < 768 ? 400 : 600;
        canvas.setDimensions({ width, height });
        canvas.renderAll();
      });
    };

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [canvas]);

  const searchFurniture = async (e) => {
    e.preventDefault();
    const query = search.trim();
    if (!query) {
      setSearchResults(DEFAULT_FURNITURE);
      return;
    }

    const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
    if (!accessKey || accessKey === 'YOUR_KEY_HERE') {
      alert("Please add your VITE_UNSPLASH_ACCESS_KEY to the Secrets panel to use dynamic search.");
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query} furniture isolation&client_id=${accessKey}&per_page=16&orientation=squarish`
      );
      const data = await response.json();
      const results = data.results.map(img => ({
        id: img.id,
        name: img.alt_description || query,
        type: 'search',
        image: img.urls.regular
      }));
      setSearchResults(results.length > 0 ? results : DEFAULT_FURNITURE);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  const addToCanvas = async (item) => {
    try {
      const htmlImg = new Image();
      htmlImg.crossOrigin = 'anonymous';
      htmlImg.src = item.image;
      
      await new Promise((resolve, reject) => {
        htmlImg.onload = resolve;
        htmlImg.onerror = reject;
      });

      const fabImg = new fabric.FabricImage(htmlImg);
      fabImg.scale(0.3);
      fabImg.set({
        left: 100,
        top: 100,
        cornerColor: '#4f46e5',
        cornerStrokeColor: 'white',
        transparentCorners: false,
        cornerSize: 10,
      });
      canvas.add(fabImg);
      canvas.setActiveObject(fabImg);
      canvas.renderAll();
    } catch (error) {
      console.error("Failed to load image:", error);
    }
  };

  const deleteSelected = () => {
    if (selectedObject) {
      canvas.remove(selectedObject);
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    }
  };

  const rotateSelected = () => {
    if (selectedObject) {
      selectedObject.rotate((selectedObject.angle || 0) + 45);
      canvas.requestRenderAll();
    }
  };

  const saveProject = async () => {
    if (!user || !canvas) return;
    setIsSaving(true);
    const canvasJSON = JSON.stringify(canvas.toJSON());
    const thumbnail = canvas.toDataURL({ quality: 0.2 });
    
    try {
      if (projectId) {
        await updateDoc(doc(db, 'projects', projectId), {
          canvasData: canvasJSON,
          thumbnail,
          updatedAt: serverTimestamp()
        });
      } else {
        const docRef = await addDoc(collection(db, 'projects'), {
          userId: user.uid,
          name: 'Untitled Room',
          canvasData: canvasJSON,
          thumbnail,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        setProjectId(docRef.id);
      }
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setIsSaving(false);
    }
  };

  const shareProject = async () => {
    if (!canvas || !user) return;
    setIsSharing(true);
    try {
      // Always save first
      await saveProject();
      const docRef = await addDoc(collection(db, 'shares'), {
        canvasData: JSON.stringify(canvas.toJSON()),
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        type: 'canvas'
      });
      const url = `${window.location.origin}/share/${docRef.id}`;
      setShareUrl(url);
      navigator.clipboard.writeText(url);
    } catch (error) {
      console.error("Share failed", error);
    } finally {
      setIsSharing(false);
    }
  };

  const exportCanvas = () => {
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1
    });
    const link = document.createElement('a');
    link.download = 'lumina-design.png';
    link.href = dataURL;
    link.click();
  };

  const [isCatalogOpen, setIsCatalogOpen] = useState(true);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-96px)] overflow-hidden lg:overflow-hidden bg-slate-50">
      {/* Sidebar - Assets */}
      <div className={`
        ${isCatalogOpen ? 'flex' : 'hidden lg:flex'} 
        w-full lg:w-80 h-[40vh] lg:h-full bg-white border-r border-slate-100 flex-col shadow-sm z-20 transition-all
      `}>
        <div className="p-6 border-b border-slate-50">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
            Furniture Catalog
          </h2>
          <form onSubmit={searchFurniture} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              type="text" 
              placeholder="Search e.g. 'Blue Sofa'"
              className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {isSearching && (
              <RefreshCw className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 animate-spin" size={14} />
            )}
          </form>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {searchResults.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ y: -2 }}
                onClick={() => addToCanvas(item)}
                className="group relative bg-white p-2 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all text-left shadow-sm"
              >
                <div className="aspect-square bg-slate-50 rounded-xl flex items-center justify-center p-2 mb-2 overflow-hidden border border-slate-50">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-contain" 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=400';
                    }}
                  />
                </div>
                <div className="px-1">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none truncate">{item.type}</p>
                  <p className="text-xs font-semibold text-slate-900 truncate mt-1">{item.name}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative flex flex-col overflow-hidden min-h-[400px] lg:min-h-0" ref={containerRef}>
        {/* Mobile Toggle Buttons */}
        <div className="lg:hidden flex border-b border-luxury-stone/10 bg-white">
          <button 
            onClick={() => { setIsCatalogOpen(!isCatalogOpen); setIsPropertiesOpen(false); }}
            className={`flex-1 py-4 text-[9px] font-bold uppercase tracking-widest ${isCatalogOpen ? 'text-brand border-b-2 border-brand' : 'text-slate-400'}`}
          >
            Catalog
          </button>
          <button 
            onClick={() => { setIsPropertiesOpen(!isPropertiesOpen); setIsCatalogOpen(false); }}
            className={`flex-1 py-4 text-[9px] font-bold uppercase tracking-widest ${isPropertiesOpen ? 'text-brand border-b-2 border-brand' : 'text-slate-400'}`}
          >
            Properties
          </button>
        </div>

        {/* Toolbar */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur-md px-4 md:px-6 py-3 rounded-2xl border border-slate-100 shadow-xl flex items-center space-x-4 md:space-x-6 w-[90%] md:w-auto overflow-x-auto hide-scrollbar">
          <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 uppercase">
             <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> {projectId ? 'Saved' : 'Auto-save Ready'}
          </div>
          <div className="w-px h-4 bg-slate-100" />
          
          <div className="flex items-center space-x-4">
            <Link to="/ar-view" className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-slate-500 hover:text-indigo-600 transition-all">
              <Camera size={14} /> <span>AR View</span>
            </Link>
            <div className="w-px h-4 bg-slate-100" />
            <button onClick={saveProject} disabled={isSaving} className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-slate-500 hover:text-indigo-600 transition-all">
              {isSaving ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />} 
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
            <button onClick={shareProject} disabled={isSharing} className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-slate-500 hover:text-indigo-600 transition-all">
              {isSharing ? <RefreshCw className="animate-spin" size={14} /> : <Share2 size={14} />}
              <span>{shareUrl ? 'Shared' : 'Share'}</span>
            </button>
            <button onClick={exportCanvas} className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-indigo-600 hover:text-indigo-700 transition-all">
              <Download size={14} /> <span>Export</span>
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-12">
           <div className="bg-white rounded-[2rem] shadow-canvas overflow-hidden border border-slate-200 relative bg-dots">
             <canvas ref={canvasRef} id="main-canvas" />
           </div>
        </div>
        
        {/* Share Feedback */}
        <AnimatePresence>
          {shareUrl && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-2xl z-20"
            >
               <Check size={16} className="text-green-400" />
               <span className="text-xs font-bold uppercase tracking-widest">Link Copied to Clipboard</span>
               <button onClick={() => setShareUrl(null)} className="ml-4 text-slate-400 hover:text-white"><X size={14} /></button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Sidebar - Properties */}
      <div className={`
        ${isPropertiesOpen ? 'flex' : 'hidden'} 
        ${selectedObject ? 'lg:flex' : 'lg:hidden'}
        w-full lg:w-72 h-[40vh] lg:h-full bg-white border-l border-slate-100 p-6 flex-col shadow-sm z-20 transition-all
      `}>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Object Details</h3>
        
        {selectedObject ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-4">
               <div className="w-12 h-12 bg-white rounded-xl p-2 border border-slate-100">
                  <img src={selectedObject._element?.src} className="w-full h-full object-contain" />
               </div>
               <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Layer</p>
                  <p className="text-sm font-bold text-slate-900">Furniture Item</p>
               </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-1">Adjust Scene</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={rotateSelected}
                  className="flex flex-col items-center justify-center p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 hover:border-indigo-100 transition-all group"
                >
                  <RotateCw size={18} className="mb-2 text-slate-400 group-hover:text-indigo-600" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Rotate</span>
                </button>
                <button 
                   onClick={deleteSelected}
                   className="flex flex-col items-center justify-center p-4 bg-white border border-slate-100 rounded-2xl hover:bg-red-50 hover:border-red-100 transition-all group"
                >
                  <Trash2 size={18} className="mb-2 text-slate-400 group-hover:text-red-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase group-hover:text-red-500">Remove</span>
                </button>
              </div>
            </div>

            <div className="mt-auto space-y-4 pt-6">
               <Link 
                to="/ai-design"
                className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-3 group hover:bg-indigo-100 transition-all"
               >
                  <Sparkles size={16} className="text-indigo-600" />
                  <div>
                    <p className="text-[10px] font-bold text-indigo-600 uppercase">AI Redesign</p>
                    <p className="text-[9px] text-indigo-500 leading-tight">Create variants of this style</p>
                  </div>
               </Link>
               <Link 
                to="/ar-view"
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center space-x-2"
               >
                 <Maximize2 size={18} />
                 <span>Preview in AR</span>
               </Link>
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-200 border border-slate-100">
              <Box size={24} />
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Select an element</p>
            <p className="text-[10px] text-slate-300 mt-2 font-medium">To edit or move objects, click on them directly in the canvas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
