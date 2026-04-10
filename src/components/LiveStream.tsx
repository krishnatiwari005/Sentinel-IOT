import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Activity, Zap, ShieldCheck, WifiOff, Settings } from 'lucide-react';
import { IpDiscovery } from './IpDiscovery';

export const LiveStream = () => {
  const [streamIp, setStreamIp] = useState(import.meta.env.VITE_ESP32_IP || '10.93.223.134');
  const [isError, setIsError] = useState(false);
  const [showDiscovery, setShowDiscovery] = useState(false);
  const [streamUrl, setStreamUrl] = useState(`http://${streamIp}:81/stream`);

  useEffect(() => {
    setStreamUrl(`http://${streamIp}:81/stream?t=${Date.now()}`);
    setIsError(false);
  }, [streamIp]);

  const handleDiscoveryFound = (newIp: string) => {
    setStreamIp(newIp);
    setShowDiscovery(false);
    setIsError(false);
  };

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
            Primary_Optical_Link <span className="text-accent-blue">[{isError ? 'RETRY' : 'LIVE'}]</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setShowDiscovery(!showDiscovery)}
             className={`p-1.5 rounded-lg border transition-all ${showDiscovery ? 'bg-accent-blue/20 border-accent-blue text-accent-blue' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
           >
              <Settings size={14} />
           </button>
           <div className="h-4 w-[1px] bg-white/10" />
           <div className="flex items-center gap-4 tech-mono text-[9px]">
              <div className="flex items-center gap-1.5">
                <Activity size={10} className="text-accent-green" />
                <span className="text-accent-green">Bitrate_8.2Mb/s</span>
              </div>
           </div>
        </div>
      </div>

      <div className="relative aspect-video bg-black overflow-hidden group-hover:shadow-[0_0_50px_rgba(0,209,255,0.1)] transition-all duration-700">
        <AnimatePresence mode="wait">
          {showDiscovery ? (
            <motion.div 
              key="discovery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-black/80 backdrop-blur-md"
            >
              <div className="w-full max-w-sm">
                <IpDiscovery onFound={handleDiscoveryFound} currentIp={streamIp} />
                <button 
                  onClick={() => setShowDiscovery(false)}
                  className="w-full mt-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white/60 transition-colors"
                >
                  Return to Feed
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* The Live Stream Image */}
        <img
          src={streamUrl}
          alt="Live Feed"
          className={`w-full h-full object-cover transition-all duration-1000 ${isError ? 'opacity-20 blur-sm grayscale' : 'opacity-80 group-hover:opacity-100'}`}
          onError={() => {
            if (!isError) {
              setIsError(true);
              // Don't set fallback URL immediately to allow Discovery UI to be useful
            }
          }}
        />

        {isError && !showDiscovery && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <WifiOff size={48} className="text-accent-red mb-4 opacity-50" />
            <h3 className="text-sm tech-mono text-white mb-2 tracking-widest">SIGNAL_LOST_UHF</h3>
            <p className="text-[10px] tech-mono text-white/40 mb-6 uppercase">Target: {streamIp}:81</p>
            <button 
              onClick={() => setShowDiscovery(true)}
              className="px-6 py-2.5 bg-accent-blue/10 hover:bg-accent-blue/20 text-accent-blue rounded-xl border border-accent-blue/20 transition-all font-black uppercase text-[10px] tracking-[0.2em]"
            >
              Initialize Auto-Discovery
            </button>
          </div>
        )}
        
        {/* Tactical Overlays */}
        <div className="scanner-line"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>

        {/* HUD Elements */}
        <div className="absolute top-6 left-6 tech-mono bg-black/40 backdrop-blur-md px-3 py-1.5 rounded border border-white/10 flex items-center gap-3">
           <div className={`w-2 h-2 rounded-full ${isError ? 'bg-accent-red' : 'bg-accent-blue'} animate-pulse`}></div>
           {isError ? 'ERR_OFFLINE' : 'REC_08:24:12_UHF'}
        </div>

        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div className="space-y-2">
               <div className="flex items-center gap-2 tech-mono !opacity-100">
                  <ShieldCheck size={14} className={isError ? "text-accent-red" : "text-accent-green"} />
                  <span className="text-white/60">Node_ID:</span>
                  <span className="text-accent-blue">ESP32-CAM-01</span>
               </div>
               <div className="text-[10px] tech-mono uppercase">
                  SRC: {streamIp}:81/STREAM
               </div>
            </div>
            
            <div className="flex gap-1">
               {[...Array(5)].map((_, i) => (
                 <motion.div 
                   key={i}
                   animate={{ height: isError ? 2 : [4, 12, 4] }}
                   transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                   className={`w-[2px] ${isError ? 'bg-accent-red/40' : 'bg-accent-blue/40'}`}
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
               <span className={`text-[10px] font-black uppercase ${isError ? 'text-accent-red' : 'text-accent-green'} tracking-tighter`}>
                 {isError ? 'Link_Broken' : 'Link_Stable'}
               </span>
            </div>
            <div className="flex flex-col">
               <span className="text-[8px] tech-mono !opacity-30">Security</span>
               <span className="text-[10px] font-black uppercase text-white/60 tracking-tighter">WPA3_Encrypted</span>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <div className={`h-1 w-12 bg-white/5 rounded-full overflow-hidden`}>
               <motion.div 
                 animate={{ x: [-48, 48] }}
                 transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                 className={`w-1/2 h-full ${isError ? 'bg-accent-red' : 'bg-accent-blue'}`}
               />
            </div>
            <span className="text-[8px] tech-mono">{isError ? 'Reconnecting...' : 'Syncing...'}</span>
         </div>
      </div>
    </div>
  );
};
