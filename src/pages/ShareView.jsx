import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import * as fabric from 'fabric';
import { motion } from 'motion/react';
import { Download, Share2, Sparkles, Box, ChevronLeft } from 'lucide-react';

export default function ShareView() {
  const { shareId } = useParams();
  const canvasRef = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchShared() {
      try {
        const docRef = doc(db, 'shares', shareId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          setError("Share link not found or expired.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load shared design.");
      } finally {
        setLoading(false);
      }
    }
    fetchShared();
  }, [shareId]);

  const containerRef = useRef(null);

  useEffect(() => {
    if (data?.type === 'canvas' && canvasRef.current && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const scale = Math.min(containerWidth / 800, 1);
      
      const initCanvas = new fabric.StaticCanvas(canvasRef.current, {
         width: 800 * scale,
         height: 600 * scale,
         backgroundColor: '#ffffff'
      });

      initCanvas.loadFromJSON(JSON.parse(data.canvasData), () => {
         initCanvas.setZoom(scale);
         initCanvas.renderAll();
      });
      return () => initCanvas.dispose();
    }
  }, [data]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm">
        <X className="text-red-400" size={32} />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Oops!</h1>
      <p className="text-slate-500 mb-8">{error}</p>
      <Link to="/" className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold">Return Home</Link>
    </div>
  );

  const isCanvas = data?.type === 'canvas';

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 bg-dots">
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="inline-flex items-center space-x-2 text-slate-400 hover:text-indigo-600 font-bold text-[10px] uppercase tracking-widest mb-8 transition-colors">
          <ChevronLeft size={14} /> <span>Back to Lumina+</span>
        </Link>
        
        <div className="bg-white rounded-[3rem] shadow-canvas border border-slate-100 overflow-hidden">
          <div className="p-8 md:p-12 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 text-[10px] font-bold uppercase tracking-widest mb-2">
                <Sparkles size={14} /> Shared Design Concept
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                {isCanvas ? 'Custom Layout Concept' : `${data.style} Redesign`}
              </h1>
            </div>
            <Link to="/login" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
              <Box size={18} /> Design Your Own
            </Link>
          </div>

          <div className="p-4 bg-slate-50 flex items-center justify-center min-h-[300px] md:min-h-[400px]" ref={containerRef}>
             {isCanvas ? (
               <div className="bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden">
                  <canvas ref={canvasRef} />
               </div>
             ) : (
               <div className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-white p-2 bg-white">
                  <img src={data.redesignUrl} className="w-full h-auto rounded-2xl" referrerPolicy="no-referrer" />
               </div>
             )}
          </div>

          {!isCanvas && data.description && (
            <div className="p-12 bg-white">
               <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Designer Notes</h4>
               <p className="text-slate-600 font-medium leading-relaxed">{data.description}</p>
            </div>
          )}
        </div>

        <div className="mt-12 text-center text-slate-400 font-bold text-[10px] uppercase tracking-widest">
           Generated with Lumina+ AI Interior Design
        </div>
      </div>
    </div>
  );
}

const X = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
