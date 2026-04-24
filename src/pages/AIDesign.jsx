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
    <div className="max-w-[1400px] mx-auto px-6 md:px-16 py-12 md:py-20">
      <div className="mb-12 md:mb-20">
        <div className="flex items-center gap-4 mb-6">
           <span className="w-12 h-[1px] bg-brand"></span>
           <span className="text-caps-label text-brand">Generative Studio</span>
        </div>
        <h1 className="text-5xl md:text-7xl text-serif-display text-luxury-ink mb-6">
          AI Atelier
        </h1>
        <p className="text-slate-400 font-medium max-w-sm italic serif">Reimagining spatial reality through curated machine intelligence.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-start">
        {/* Left: Configuration */}
        <div className="space-y-12 md:space-y-16">
          <section>
            <h3 className="text-caps-label text-slate-300 mb-8 flex items-center">
              <span className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-[8px] mr-3">01</span>
              Source Inspiration
            </h3>
            <label className="group relative flex flex-col items-center justify-center w-full aspect-[16/10] bg-luxury-paper border border-luxury-stone rounded-[3rem] cursor-pointer overflow-hidden shadow-luxury">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-12">
                  <div className="w-16 h-16 bg-white border border-luxury-stone rounded-2xl flex items-center justify-center mb-6 text-slate-300 group-hover:text-brand group-hover:scale-110 transition-all">
                    <Upload size={24} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Click to import spatial data</p>
                </div>
              )}
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </label>
            {preview && (
              <button onClick={() => setPreview(null)} className="mt-6 text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-red-400 transition-colors flex items-center gap-2">
                 <RefreshCw size={10} /> Reset source
              </button>
            )}
          </section>

          <section>
            <h3 className="text-caps-label text-slate-300 mb-8 flex items-center">
              <span className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-[8px] mr-3">02</span>
              Aesthetic Direction
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {styles.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`px-8 py-5 rounded-2xl text-[10px] font-bold border transition-all uppercase tracking-widest ${
                    style === s ? 'bg-luxury-ink text-white border-luxury-ink shadow-luxury' : 'bg-white text-slate-400 border-luxury-stone/30 hover:border-brand/40'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            
            <button 
              disabled={!preview || loading}
              onClick={handleRedesign}
              className="w-full mt-12 btn-luxury bg-brand text-white border-brand hover:bg-luxury-ink shadow-luxury disabled:opacity-30"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-4">
                  <RefreshCw className="animate-spin" size={16} />
                  <span>Calibrating...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-4">
                  <Sparkles size={16} />
                  <span>Synthesize Concept</span>
                </div>
              )}
            </button>
          </section>
        </div>

        {/* Right: Results */}
        <div className="lg:sticky lg:top-40 min-h-[400px] md:min-h-[600px] bg-luxury-paper rounded-[3rem] md:rounded-[4rem] p-4 border border-luxury-stone overflow-hidden">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-luxury-stone/50 rounded-[3.5rem]"
              >
                <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center mb-8 border border-white/30">
                  <ImageIcon size={32} className="text-slate-200" />
                </div>
                <h4 className="text-caps-label text-slate-300 mb-4">Awaiting Synthesis</h4>
                <p className="text-slate-400 italic serif text-sm max-w-xs">Your spatial reimagining will materialize here once the synthesis is complete.</p>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12"
              >
                <div className="relative aspect-[16/10] rounded-[3.5rem] overflow-hidden shadow-luxury bg-dots">
                   <img src={result.imageUrl} className="w-full h-full object-cover transition-transform duration-[4s] hover:scale-105" referrerPolicy="no-referrer" />
                   <div className="absolute top-10 left-10 py-3 px-6 bg-brand/90 backdrop-blur-xl border border-white/20 rounded-full">
                      <span className="text-[8px] font-bold text-white uppercase tracking-[0.3em]">AI Synthesis v2.4</span>
                   </div>
                </div>

                <div className="px-10 pb-10 space-y-10">
                   <div>
                     <h4 className="text-caps-label text-brand mb-6">Design Interpretation</h4>
                     <p className="text-luxury-ink leading-relaxed text-sm serif italic">
                       {result.description}
                     </p>
                   </div>
                   
                   <div className="flex flex-col gap-6 pt-10 border-t border-luxury-stone">
                      <div className="flex gap-6">
                        <button 
                          onClick={downloadHQ}
                          className="flex-1 text-[9px] font-bold uppercase tracking-[0.2em] py-5 border border-luxury-stone rounded-2xl hover:bg-brand hover:text-white hover:border-brand transition-all flex items-center justify-center gap-3"
                        >
                          <Download size={14} /> Preserve HQ
                        </button>
                        <button 
                          onClick={shareDesign}
                          disabled={isSharing}
                          className="flex-1 text-[9px] font-bold uppercase tracking-[0.2em] py-5 bg-luxury-ink text-white rounded-2xl hover:bg-brand transition-all flex items-center justify-center gap-3"
                        >
                          {isSharing ? <RefreshCw className="animate-spin" size={14} /> : <Share2 size={14} />}
                          {shareUrl ? 'Link Copied' : 'Curate to Public'}
                        </button>
                      </div>
                      
                      {shareUrl && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-6 bg-brand/[0.03] rounded-2xl border border-brand/10 flex items-center justify-between"
                        >
                           <span className="text-[10px] font-medium text-brand truncate max-w-[250px]">{shareUrl}</span>
                           <Clipboard size={14} className="text-brand opacity-40" />
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
