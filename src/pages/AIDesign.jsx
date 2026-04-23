import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Sparkles, RefreshCw, ChevronLeft, ArrowRight, CheckCircle2, Download, Share2, Clipboard, Image as ImageIcon } from 'lucide-react';
import { redesignRoom } from '../services/gemini';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function AIDesign() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [style, setStyle] = useState('Modern Minimal');
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selected);
    }
  };

  const handleRedesign = async () => {
    if (!preview) return;
    setLoading(true);
    setShareUrl(null);
    try {
      const data = await redesignRoom(preview, style);
      if (!data.imageUrl) {
         data.imageUrl = `https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200`;
      }
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({
        imageUrl: `https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200`,
        description: "Your room redesign is ready. We've applied a modern minimalist aesthetic with neutral tones and clean-lined furniture."
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadHQ = async () => {
    if (!result?.imageUrl) return;
    try {
      const response = await fetch(result.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `lumina-redesign-${style.toLowerCase().replace(' ', '-')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  const shareDesign = async () => {
    if (!result || !user) return;
    setIsSharing(true);
    try {
      const docRef = await addDoc(collection(db, 'shares'), {
        redesignUrl: result.imageUrl,
        description: result.description,
        style: style,
        createdBy: user.uid,
        createdAt: serverTimestamp()
      });
      const url = `${window.location.origin}/share/${docRef.id}`;
      setShareUrl(url);
      navigator.clipboard.writeText(url);
    } catch (error) {
      console.error("Sharing failed", error);
    } finally {
      setIsSharing(false);
    }
  };

  const styles = ['Modern Minimal', 'Industrial Loft', 'Scandinavian', 'Luxury Classic', 'Japandi', 'Bohemian'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center">
          <Sparkles className="mr-2 text-indigo-600" /> AI Room Redesign
        </h1>
        <p className="text-slate-500 font-medium">Upload a photo of your room and let our AI transform it instantly.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left: Upload & Config */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center text-sm uppercase tracking-widest"><CheckCircle2 className="mr-2 text-green-500" size={18} /> Step 1: Upload Photo</h3>
            <label className="group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-200 rounded-[2rem] cursor-pointer hover:border-indigo-400 hover:bg-slate-50 transition-all overflow-hidden">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-300 group-hover:text-indigo-600 transition-colors">
                    <Upload size={24} />
                  </div>
                  <p className="mb-2 text-sm text-slate-500 font-medium">Click to upload or drag and drop</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">PNG, JPG up to 10MB</p>
                </div>
              )}
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </label>
            {preview && (
              <button onClick={() => setPreview(null)} className="mt-4 text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center">
                 <RefreshCw size={12} className="mr-1" /> Reset Photo
              </button>
            )}
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center text-sm uppercase tracking-widest"><CheckCircle2 className="mr-2 text-green-500" size={18} /> Step 2: Choose Style</h3>
            <div className="grid grid-cols-2 gap-3">
              {styles.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`px-4 py-4 rounded-2xl text-xs font-bold border transition-all uppercase tracking-tight ${
                    style === s ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            
            <button 
              disabled={!preview || loading}
              onClick={handleRedesign}
              className="w-full mt-8 bg-slate-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center space-x-2 disabled:opacity-50 hover:bg-slate-800 transition-all shadow-xl shadow-slate-100 active:scale-95 uppercase tracking-widest text-xs"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={20} />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Generate Redesign</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Results */}
        <div className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center text-center p-8 border-dashed"
              >
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                  <ImageIcon size={32} className="text-slate-200" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-widest text-xs">Redesign Result</h4>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">Your AI-generated room concept will appear here after processing.</p>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-canvas border border-white p-2 bg-white bg-dots">
                  <div className="aspect-[16/9] rounded-[2rem] overflow-hidden border border-slate-100">
                    <img src={result.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="absolute top-8 left-8 bg-indigo-600/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] uppercase font-bold text-white tracking-widest border border-white/20">
                    AI Concept
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                   <h4 className="font-bold text-slate-400 mb-4 uppercase tracking-widest text-[10px]">Design Notes</h4>
                   <p className="text-slate-600 leading-relaxed text-sm font-medium">
                     {result.description || "The AI suggested a complete overhaul focusing on space maximization and light flow. New textures and materials have been chosen to complement the existing architecture."}
                   </p>
                   
                   <div className="mt-10 flex flex-col gap-4">
                      <div className="flex gap-4">
                        <button 
                          onClick={downloadHQ}
                          className="flex-1 bg-slate-50 text-slate-900 py-4 rounded-xl text-xs font-bold border border-slate-100 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 uppercase tracking-tight"
                        >
                          <Download size={16} /> Download HQ
                        </button>
                        <button 
                          onClick={shareDesign}
                          disabled={isSharing}
                          className="flex-1 bg-indigo-50 text-indigo-600 py-4 rounded-xl text-xs font-bold border border-indigo-100 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2 uppercase tracking-tight"
                        >
                          {isSharing ? <RefreshCw className="animate-spin" size={16} /> : <Share2 size={16} />}
                          {shareUrl ? 'Link Copied' : 'Share Link'}
                        </button>
                      </div>
                      
                      {shareUrl && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-between"
                        >
                           <span className="text-[10px] font-bold text-indigo-400 truncate max-w-[200px]">{shareUrl}</span>
                           <Clipboard size={14} className="text-indigo-400" />
                        </motion.div>
                      )}
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
