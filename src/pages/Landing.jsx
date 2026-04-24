import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Box, 
  ArrowRight,
  Layout,
  ChevronDown
} from 'lucide-react';
import { useRef } from 'react';

const NarrativeBlock = ({ title, description, align = 'left', img, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    viewport={{ once: true, margin: "-100px" }}
    className={`flex flex-col ${align === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-20 py-32`}
  >
    <div className="flex-1 space-y-8">
      <span className="text-caps-label text-brand">Chapter 0{index}</span>
      <h3 className="text-5xl md:text-7xl text-serif-display leading-tight text-luxury-ink">
        {title}
      </h3>
      <p className="text-slate-500 text-lg leading-relaxed max-w-md">
        {description}
      </p>
      <Link to="/dashboard" className="inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-ink group">
        Explore Design <ArrowRight size={14} className="transition-transform group-hover:translate-x-2" />
      </Link>
    </div>
    <div className="flex-1 relative aspect-[4/5] overflow-hidden rounded-[4rem] group shadow-luxury">
      <img 
        src={img} 
        className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-[3s] group-hover:scale-110" 
        alt={title} 
      />
      <div className="absolute inset-0 bg-brand/5 group-hover:bg-transparent transition-all duration-1000" />
    </div>
  </motion.div>
);

export default function Landing() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="bg-luxury-cream min-h-screen">
      {/* Hero: The Intent */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <motion.div 
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="text-center z-10 max-w-6xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-caps-label mb-10 block text-brand">Spatial Intelligence Studio</span>
            <h1 className="text-[14vw] md:text-[10vw] text-serif-display leading-[0.8] mb-12 text-luxury-ink">
              Lumina<span className="text-brand">+</span>
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.5 }}
            className="text-slate-400 text-lg md:text-2xl font-light max-w-2xl mx-auto leading-relaxed mb-16 serif italic"
          >
            Where intuition meets artificial intelligence. A bespoke digital atelier for the architectural avant-garde.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            <Link to="/dashboard" className="btn-luxury bg-luxury-ink text-white hover:bg-brand shadow-luxury">
              Open The Atelier
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating Narrative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            animate={{ y: [0, -30, 0], rotate: [-6, -4, -6] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] right-[5%] w-[35vw] md:w-[25vw] aspect-[4/5] bg-luxury-paper rounded-[4rem] overflow-hidden opacity-20 md:opacity-100 shadow-luxury"
          >
            <img 
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200" 
              className="w-full h-full object-cover grayscale mix-blend-multiply opacity-80"
              alt="Design detail"
            />
          </motion.div>
          <motion.div 
            animate={{ y: [0, 30, 0], rotate: [8, 10, 8] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[5%] left-[5%] w-[30vw] md:w-[20vw] aspect-square bg-luxury-paper rounded-[3rem] overflow-hidden opacity-10 md:opacity-60"
          >
            <img 
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200" 
              className="w-full h-full object-cover contrast-125"
              alt="Materiality"
            />
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 flex flex-col items-center gap-3 text-slate-300"
        >
          <span className="text-[9px] uppercase tracking-[0.4em] font-bold">Inhale</span>
          <ChevronDown size={14} />
        </motion.div>
      </section>

      {/* Narrative Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <NarrativeBlock 
          index={1}
          title="The Canvas of Intent."
          description="Precision tools crafted for spatial clarity. Design without the noise of generic interfaces."
          img="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800"
        />
        <NarrativeBlock 
          index={2}
          align="right"
          title="Generative Elegance."
          description="Our curated AI models interpret your aesthetic cues to suggest textures and forms that breathe."
          img="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800"
        />
        <NarrativeBlock 
          index={3}
          title="Living Gallery."
          description="Explore a visual design archive that serves as a mirror to your own architectural intuition."
          img="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800"
        />
      </section>

      {/* Philosophy Callout */}
      <section className="py-60 px-6 text-center bg-luxury-paper">
         <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1.5 }}
           className="max-w-4xl mx-auto"
         >
            <span className="text-caps-label text-brand block mb-12">Studio Creed</span>
            <h2 className="text-4xl md:text-6xl text-serif-display leading-tight text-luxury-ink mb-16 italic">
              "Space is the breath of art. We provide the tools for the silence."
            </h2>
            <div className="w-20 h-[1px] bg-luxury-stone mx-auto" />
         </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-luxury-ink text-white py-40 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-20 items-end">
            <div className="space-y-12">
              <h3 className="text-6xl md:text-8xl text-serif-display leading-none">
                Begin the <br/> odyssey.
              </h3>
              <p className="text-slate-500 max-w-sm text-lg font-light leading-relaxed">
                Step away from the ordinary. Embrace a spatial workflow designed for the artist within.
              </p>
              <Link to="/dashboard" className="btn-luxury bg-brand text-white hover:bg-white hover:text-luxury-ink inline-block">
                Enter Atelier
              </Link>
            </div>
            
            <div className="flex flex-col md:items-end gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
               <div className="flex gap-10">
                  <a href="#" className="hover:text-white transition-colors">Instagram</a>
                  <a href="#" className="hover:text-white transition-colors">Pinterest</a>
                  <a href="#" className="hover:text-white transition-colors">Journal</a>
               </div>
               <p className="md:text-right border-t border-white/10 pt-10">© 2026 LUMINA+ ARCHITECTURAL COLLECTIVE</p>
            </div>
          </div>
        </div>
        
        {/* Subtle Brand Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-serif italic text-white opacity-[0.02] pointer-events-none select-none">
          Lumina
        </div>
      </footer>
    </div>
  );
}

