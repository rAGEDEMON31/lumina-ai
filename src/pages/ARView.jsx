import { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, useGLTF, Center, Html } from '@react-three/drei';
import { motion } from 'motion/react';
import { ChevronLeft, Camera, Box, RotateCcw, Maximize, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const SofaModel = () => {
  // Simulating a sofa with a group of boxes since we don't have a GLB
  return (
    <group position={[0, -0.5, 0]}>
      {/* Base */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[2, 0.5, 1]} />
        <meshStandardMaterial color="#444" roughness={0.8} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.75, -0.4]}>
        <boxGeometry args={[2, 0.75, 0.2]} />
        <meshStandardMaterial color="#444" roughness={0.8} />
      </mesh>
      {/* Left Arm */}
      <mesh position={[-0.9, 0.5, 0]}>
        <boxGeometry args={[0.2, 0.5, 1]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Right Arm */}
      <mesh position={[0.9, 0.5, 0]}>
        <boxGeometry args={[0.2, 0.5, 1]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
};

const ARScene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 5]} />
      <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
      
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      
      <Suspense fallback={<Html center>Loading Model...</Html>}>
        <Center>
          <SofaModel />
        </Center>
      </Suspense>

      <ContactShadows 
        position={[0, -0.5, 0]} 
        opacity={0.4} 
        scale={10} 
        blur={2.5} 
        far={4} 
      />
      <Environment preset="city" />
    </>
  );
};

export default function ARView() {
  const videoRef = useRef(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [error, setError] = useState(null);
  const [isStarting, setIsStarting] = useState(false);

  async function startCamera() {
    setIsStarting(true);
    setError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Browser does not support camera access. Please use a modern browser like Chrome or Safari.");
      setIsStarting(false);
      return;
    }

    // Try environment mode first (rear camera), then fallback to any camera
    const constraints = [
      { video: { facingMode: { exact: 'environment' } } },
      { video: { facingMode: 'environment' } },
      { video: true }
    ];

    let lastError = null;
    let stream = null;

    for (const constraint of constraints) {
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraint);
        if (stream) break; // Success!
      } catch (err) {
        lastError = err;
        console.warn(`Constraint ${JSON.stringify(constraint)} failed:`, err.name);
        continue;
      }
    }

    if (stream) {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasCamera(true);
      }
    } else {
      console.error("All camera constraints failed:", lastError);
      if (lastError?.name === 'NotAllowedError' || lastError?.name === 'PermissionDeniedError') {
        setError("Camera permission was denied. Try clicking the camera icon in your address bar or open the app in a new tab.");
      } else {
        setError(`Could not access camera: ${lastError?.message || "Unknown error"}`);
      }
    }
    setIsStarting(false);
  }

  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col">
      {/* Camera Feed Backdrop */}
      <div className="absolute inset-0 overflow-hidden">
        {hasCamera ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-900 flex items-center justify-center p-8 text-center">
            <div className="text-white max-w-xs">
              <div className="w-20 h-20 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera size={40} className="text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold mb-2">AR Environment</h2>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                {error || "Place virtual furniture in your real room. Requires camera access to project 3D models."}
              </p>
              
              {!hasCamera && !isStarting && (
                <button 
                  onClick={startCamera}
                  className="w-full bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-900/40 hover:bg-indigo-700 transition-all flex items-center justify-center space-x-2"
                >
                  <Sparkles size={20} />
                  <span>Start AR Camera</span>
                </button>
              )}

              {isStarting && (
                <div className="flex flex-col items-center">
                   <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                   <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Waiting for permission...</p>
                </div>
              )}

              {error && !isStarting && (
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 text-xs font-bold text-slate-400 hover:text-white transition-colors underline underline-offset-4"
                >
                  Refresh Page
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3D Canvas Overlay */}
      <div className="absolute inset-0 pointer-events-auto">
        <Canvas shadows alpha>
          <ARScene />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
        <div className="flex justify-between items-start">
          <Link 
            to="/canvas" 
            className="pointer-events-auto w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all"
          >
            <ChevronLeft size={24} />
          </Link>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-[10px] uppercase font-bold text-white tracking-widest">AR Simulation</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center space-x-4">
             <button className="pointer-events-auto p-4 bg-white/10 backdrop-blur-md rounded-2xl text-white border border-white/20">
               <RotateCcw size={20} />
             </button>
             <button className="pointer-events-auto p-4 bg-white rounded-2xl text-black">
               <Box size={24} />
             </button>
             <button className="pointer-events-auto p-4 bg-white/10 backdrop-blur-md rounded-2xl text-white border border-white/20">
               <Maximize size={20} />
             </button>
          </div>
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-[32px] text-center pointer-events-auto">
             <p className="text-sm font-bold text-gray-900 mb-1">Place Sofa in Room</p>
             <p className="text-xs text-gray-500">Pinch to scale, drag horizontally to rotate. Tap anywhere to lock position.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
