import { motion } from 'framer-motion';
import { Camera, Activity, Zap, ShieldCheck } from 'lucide-react';

export const LiveStream = () => {
  return (
    <div className="sentinel-card group overflow-hidden border-accent-blue/30 w-full">
      <div className="fui-bracket fui-bracket-tl"></div>
      <div className="fui-bracket fui-bracket-tr"></div>
      <div className="fui-bracket fui-bracket-bl"></div>
      <div className="fui-bracket fui-bracket-br"></div>
      
      <div className="p-4 border-b border-white/5 bg-accent-blue/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Camera size={16} className="text-accent-blue" />
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-accent-blue rounded-full shadow-[0_0_8px_#00D1FF]"
            />
          </div>
          <span className="text-sm tech-mono !opacity-100 text-white/80 font-medium tracking-[0.2em]">
            Primary_Optical_Link <span className="text-accent-blue">[LIVE]</span>
          </span>
        </div>
        <div className="flex items-center gap-4 tech-mono text-[9px]">
           <div className="flex items-center gap-1.5">
             <Activity size={10} className="text-accent-green" />
             <span className="text-accent-green">Bitrate_8.2Mb/s</span>
           </div>
           <div className="hidden sm:flex items-center gap-1.5 opacity-40">
             <Zap size={10} />
             <span>Latency_42ms</span>
           </div>
        </div>
      </div>

      <div className="relative aspect-video bg-black overflow-hidden group-hover:shadow-[0_0_50px_rgba(0,209,255,0.1)] transition-all duration-700">
        {/* The Live Stream Image */}
        <img
          src="http://10.93.223.134:81/stream"
          alt="Live Feed"
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-1000"
          onError={(e) => {
            // Fallback for when the stream is unavailable
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop";
          }}
        />
        
        {/* Tactical Overlays */}
        <div className="scanner-line"></div>
        
        {/* Vignette & Noise */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>

        {/* HUD Elements */}
        <div className="absolute top-6 left-6 tech-mono bg-black/40 backdrop-blur-md px-3 py-1.5 rounded border border-white/10 flex items-center gap-3">
           <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse"></div>
           REC_08:24:12_UHF
        </div>

        <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
           <div className="tech-mono bg-accent-blue/10 border border-accent-blue/30 text-accent-blue px-2 py-1 rounded backdrop-blur-md">
             ISO_800
           </div>
           <div className="tech-mono bg-white/5 border border-white/10 text-white/40 px-2 py-1 rounded backdrop-blur-md">
             FPS_30.0
           </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div className="space-y-2">
               <div className="flex items-center gap-2 tech-mono !opacity-100">
                  <ShieldCheck size={14} className="text-accent-green" />
                  <span className="text-white/60">Node_ID:</span>
                  <span className="text-accent-blue">ESP32-CAM-01</span>
               </div>
               <div className="text-[10px] tech-mono">
                  SRC: 10.93.223.134:81/STREAM
               </div>
            </div>
            
            <div className="flex gap-1">
               {[...Array(5)].map((_, i) => (
                 <motion.div 
                   key={i}
                   animate={{ height: [4, 12, 4] }}
                   transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                   className="w-[2px] bg-accent-blue/40"
                 />
               ))}
            </div>
        </div>

        {/* Corner Decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-accent-blue/20"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-accent-blue/20"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-accent-blue/20"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-accent-blue/20"></div>
      </div>
      
      <div className="p-4 bg-white/[0.02] flex items-center justify-between">
         <div className="flex gap-6">
            <div className="flex flex-col">
               <span className="text-[8px] tech-mono !opacity-30">Status</span>
               <span className="text-[10px] font-black uppercase text-accent-green tracking-tighter">Link_Stable</span>
            </div>
            <div className="flex flex-col">
               <span className="text-[8px] tech-mono !opacity-30">Security</span>
               <span className="text-[10px] font-black uppercase text-white/60 tracking-tighter">WPA3_Encrypted</span>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 animate={{ x: [-48, 48] }}
                 transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                 className="w-1/2 h-full bg-accent-blue"
               />
            </div>
            <span className="text-[8px] tech-mono">Syncing...</span>
         </div>
      </div>
    </div>
  );
};
