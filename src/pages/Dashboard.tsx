import { useEffect, useState } from 'react';

import { supabase } from '../lib/supabase';
import { Detection } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ShieldAlert, Cpu, CheckCircle, Clock, AlertTriangle, Scan, Maximize2, Activity, Lock } from 'lucide-react';


import { ImageViewerModal } from '../components/ImageViewerModal';

export const Dashboard = () => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [stats, setStats] = useState({ today: 0, unknown: 0, vips: 0, isOnline: true });
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);

  useEffect(() => {
    fetchInitialData();

    const channel = supabase
      .channel('public:detections')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'detections' }, (payload) => {
        const newDetection = payload.new as Detection;
        setDetections((prev) => [newDetection, ...prev].slice(0, 10));
        updateStatsOnNew(newDetection);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchInitialData = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: recentDetections } = await supabase
      .from('detections')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(10);

    if (recentDetections) setDetections(recentDetections);

    const { count: todayCount } = await supabase
      .from('detections')
      .select('id', { count: 'exact' })
      .gte('timestamp', today.toISOString());
      
    const { count: unknownCount } = await supabase
      .from('detections')
      .select('id', { count: 'exact' })
      .eq('face_type', 'UNKNOWN')
      .gte('timestamp', today.toISOString());

    const { count: vipsCount } = await supabase
      .from('detections')
      .select('id', { count: 'exact' })
      .eq('face_type', 'VIP')
      .gte('timestamp', today.toISOString());

    setStats({
      today: todayCount || 0,
      unknown: unknownCount || 0,
      vips: vipsCount || 0,
      isOnline: true,
    });
  };

  const updateStatsOnNew = (det: Detection) => {
    setStats(prev => ({
      ...prev,
      today: prev.today + 1,
      unknown: prev.unknown + (det.face_type === 'UNKNOWN' ? 1 : 0),
      vips: prev.vips + (det.face_type === 'VIP' ? 1 : 0),
    }));
  };

  const handleMarkSafe = async (id: string) => {
    await supabase.from('detections').update({ status: 'safe' }).eq('id', id);
  };

  const handleMarkIntruder = async (id: string) => {
    await supabase.from('detections').update({ status: 'intruder' }).eq('id', id);
  };

  return (
    <div className="font-body">
      <div className="mb-12 relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent-blue/5 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="tech-mono text-accent-blue">Node_Status: 01</span>
              <div className="h-0.5 w-12 bg-white/5 rounded-full overflow-hidden">
                <motion.div animate={{ x: [-50, 50] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-1/2 h-full bg-accent-blue" />
              </div>
              <span className="tech-mono">UHF_Protocol_Active</span>
            </div>
            <h1 className="text-4xl tech-mono font-medium text-white mb-2 tracking-[0.05em] uppercase leading-none">
              Tactical Command
            </h1>
            <p className="text-white/40 font-medium tracking-tight">System Integrity: <span className="text-accent-green">Optimized (100%)</span>. Multi-node cluster online.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-5 py-3 rounded-2xl glass border-accent-blue/20 flex items-center gap-3 group cursor-pointer hover:bg-accent-blue/5 transition-all">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-accent-blue shadow-[0_0_15px_#00D1FF]"></div>
                <div className="absolute inset-0 rounded-full bg-accent-blue animate-ping opacity-50"></div>
              </div>
              <span className="text-xs font-black text-accent-blue uppercase tracking-[0.2em]">Quantum Link Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Network Scan', value: stats.today, icon: Activity, color: 'accent-blue' },
          { label: 'Threat Pulse', value: stats.unknown, icon: AlertTriangle, color: 'accent-red' },
          { label: 'Biometric Safe', value: stats.vips, icon: CheckCircle, color: 'accent-green' },
          { label: 'Uptime Nodes', value: '1.0k', icon: Cpu, color: 'accent-blue' }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 100 }}
              className="sentinel-card p-6 group group/card"
            >
              <div className="fui-bracket fui-bracket-tl"></div>
              <div className="fui-bracket fui-bracket-tr"></div>
              <div className="fui-bracket fui-bracket-bl"></div>
              <div className="fui-bracket fui-bracket-br"></div>
              
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div>
                   <h3 className="text-white/20 text-[9px] font-black uppercase tracking-[0.3em] mb-1">{stat.label}_</h3>
                   <div className="h-1 w-6 bg-white/5 rounded-full group-hover/card:bg-accent-blue/30 transition-colors"></div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover/card:bg-accent-blue/5 transition-all">
                  <Icon size={18} className="text-white/40 group-hover/card:text-accent-blue transition-colors"/>
                </div>
              </div>
              
              <div className="flex items-baseline gap-3 relative z-10 transition-transform group-hover/card:translate-x-1 duration-500">
                <span className="text-5xl font-display font-black tracking-tighter text-white group-hover/card:text-accent-blue transition-colors">{stat.value}</span>
                <span className="text-accent-green text-[10px] font-black">PROT_V2</span>
              </div>
              
              <div className="mt-6 flex flex-col gap-1 relative z-10">
                <div className="flex justify-between items-center text-[9px] font-black text-white/20 uppercase tracking-widest">
                  <span>Throughput</span>
                  <span>94%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: i % 2 === 0 ? "85%" : "60%" }}
                     className={`h-full ${i === 1 ? 'bg-accent-red' : 'bg-accent-blue'} opacity-40`}
                   />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl tech-mono font-medium flex items-center gap-4 uppercase tracking-[0.1em]">
              <div className="w-1 h-6 bg-accent-blue rounded-full shadow-[0_0_20px_#00D1FF] animate-pulse"></div>
              Visual Intel <span className="text-white/20 hidden sm:inline">[STREAM_01]</span>
            </h2>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2 tech-mono">
                  <Scan size={12} className="text-accent-blue" />
                  Live_Scan
               </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[900px] overflow-y-auto pr-4 scrollbar-hide py-2">
            <AnimatePresence initial={false}>
              {detections.length === 0 ? (
                <div className="col-span-2 sentinel-card p-32 flex flex-col items-center justify-center text-center">
                  <div className="relative mb-8">
                    <ShieldAlert size={64} className="text-white/5" />
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                      className="absolute -inset-4 border border-dashed border-white/10 rounded-full"
                    />
                  </div>
                  <p className="text-white/20 font-black uppercase text-[10px] tracking-[0.4em] max-w-xs">Establishing Secure Feed. Awaiting Optical Data...</p>
                </div>
              ) : (
                detections.map((item, i) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.03, type: "spring", stiffness: 100 }}
                    key={item.id}
                    className="sentinel-card group cursor-pointer"
                    onClick={() => setSelectedDetection(item)}
                  >
                    <div className="relative aspect-video bg-black overflow-hidden group-hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all">
                      <img 
                        src={item.image_url} 
                        alt="Capture" 
                        className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105" 
                      />
                      <div className="scanner-line"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                      
                      <div className="absolute top-4 left-4 tech-mono bg-black/60 px-2 py-1 rounded border border-white/10 backdrop-blur-md">
                        CAM_SR_09
                      </div>
                      
                      <div className="absolute bottom-4 left-4 flex items-center gap-3">
                        <div className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest backdrop-blur-md transition-colors ${
                          item.face_type === 'UNKNOWN' ? 'bg-accent-red/20 text-accent-red border-accent-red/30' : 'bg-accent-green/20 text-accent-green border-accent-green/30'
                        }`}>
                          {item.face_type}
                        </div>
                        <span className="text-[10px] font-black text-white/50 tracking-widest uppercase bg-black/40 px-2 py-1.5 rounded border border-white/5 backdrop-blur-md">
                          CONF_ {Math.round(item.confidence * 100)}%
                        </span>
                      </div>

                      <div className="absolute top-4 right-4 p-2 bg-black/60 rounded-lg border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                         <Maximize2 size={14} className="text-white/60" />
                      </div>
                    </div>
                    
                    <div className="p-5 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base tech-mono font-medium tracking-tight mb-1 truncate text-white/90 group-hover:text-accent-blue transition-colors">
                          {item.face_type === 'VIP' ? item.vip_name : 'OBJ_SIG: '+item.id.slice(0,6)}
                        </h4>
                        <div className="flex items-center gap-3 tech-mono !opacity-30">
                          <Clock size={10}/> {formatDistanceToNow(new Date(item.timestamp))} ago
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0" onClick={e => e.stopPropagation()}>
                        <button onClick={() => handleMarkSafe(item.id)} className="p-2.5 bg-accent-green/10 text-accent-green rounded-lg hover:bg-accent-green/20 transition-all border border-accent-green/20"><CheckCircle size={14}/></button>
                        <button onClick={() => handleMarkIntruder(item.id)} className="p-2.5 bg-accent-red/10 text-accent-red rounded-lg hover:bg-accent-red/20 transition-all border border-accent-red/20"><ShieldAlert size={14}/></button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <h2 className="text-xl tech-mono font-medium mb-8 flex items-center gap-4 uppercase tracking-[0.1em]">
              <div className="w-1 h-6 bg-accent-red rounded-full shadow-[0_0_20px_#FF3B30] animate-pulse"></div>
              Node Logs
            </h2>
            <div className="sentinel-card p-8 group/logs">
              <div className="fui-bracket fui-bracket-tl"></div>
              <div className="fui-bracket fui-bracket-tr"></div>
              <div className="space-y-8 relative z-10">
                {[
                  { time: '10:42:01', event: 'UHF_PROTOCOL_ESTABLISHED', sub: 'Cluster sync verified', status: 'normal' },
                  { time: '09:15:24', event: 'BIO_ALERT: UNKNOWN_SUBJECT', sub: 'Sector A-92 / Entry_01', status: 'warning' },
                  { time: '08:02:12', event: 'ENCRYPTION_KEY_ROTATED', sub: 'Node secure / AES-256', status: 'normal' }
                ].map((log, i) => (
                  <div key={i} className="flex gap-6 group/log relative">
                    <div className="flex flex-col items-center">
                       <div className={`w-2 h-2 rounded-full mb-2 ${log.status === 'warning' ? 'bg-accent-red animate-pulse' : 'bg-accent-blue/40'}`}></div>
                       {i !== 2 && <div className="w-[1px] h-12 bg-white/5"></div>}
                    </div>
                    <div>
                      <span className="tech-mono !opacity-20 block mb-1">{log.time}</span>
                      <p className={`text-xs font-black uppercase tracking-wider mb-1 ${log.status === 'warning' ? 'text-accent-red' : 'text-white/80'}`}>
                        {log.event}
                      </p>
                      <p className="text-[10px] font-bold text-white/30 tracking-tight">{log.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-12 py-5 text-[10px] font-black uppercase tracking-[0.4em] bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 hover:text-accent-blue transition-all rounded-2xl relative overflow-hidden group/btn">
                <span className="relative z-10">Historical_Data_Access</span>
                <motion.div 
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-white/5"
                />
              </button>
            </div>
          </div>
          
          <div className="sentinel-card p-10 bg-accent-blue/[0.02] border-accent-blue/10 group/node overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent-blue/5 blur-[100px] rounded-full group-hover/node:bg-accent-blue/10 transition-all duration-1000"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                 <div className="p-3 bg-accent-blue/10 rounded-2xl border border-accent-blue/20">
                   <Lock size={20} className="text-accent-blue" />
                 </div>
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-blue">Crypto Node Secure</h3>
              </div>
              <p className="text-xs text-white/40 mb-8 leading-loose font-bold uppercase tracking-wider">Session Token: <span className="text-white/60">SNTL_0x71F...829</span>. End-to-end telemetry sync active.</p>

              <div className="space-y-2">
                 <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">
                    <span>Memory Cluster 01</span>
                    <span>81%</span>
                 </div>
                 <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                   <motion.div animate={{ width: "81%" }} className="h-full bg-accent-blue opacity-50 shadow-[0_0_10px_#00D1FF]" />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedDetection && (
          <ImageViewerModal
            detection={selectedDetection}
            onClose={() => setSelectedDetection(null)}
            onMarkSafe={handleMarkSafe}
            onMarkIntruder={handleMarkIntruder}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
