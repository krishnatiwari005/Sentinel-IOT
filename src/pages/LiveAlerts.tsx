import { useEffect, useState } from 'react';

import { supabase } from '../lib/supabase';
import { Detection } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ImageViewerModal } from '../components/ImageViewerModal';
import { Filter } from 'lucide-react';

export const LiveAlerts = () => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [filter, setFilter] = useState<'All' | 'UNKNOWN' | 'VIP'>('All');
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);

  useEffect(() => {
    fetchHistory();

    const channel = supabase
      .channel('public:detections')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'detections' }, (payload) => {
        const newDetection = payload.new as Detection;
        setDetections((prev) => [newDetection, ...prev].slice(0, 50)); // keep last 50
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchHistory = async () => {
    const { data } = await supabase
      .from('detections')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);
    if (data) setDetections(data);
  };

  const handleMarkSafe = async (id: string) => {
    await supabase.from('detections').update({ status: 'safe' }).eq('id', id);
  };

  const handleMarkIntruder = async (id: string) => {
    await supabase.from('detections').update({ status: 'intruder' }).eq('id', id);
  };

  const filteredDetections = detections.filter(d => filter === 'All' || d.face_type === filter);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Live Alerts</h1>
          <p className="text-white/60">Real-time monitoring feed of all captures</p>
        </div>
        
        <div className="flex items-center gap-2 bg-card border border-white/10 rounded-xl p-1">
          <Filter size={16} className="ml-2 text-white/40" />
          {['All', 'UNKNOWN', 'VIP'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence initial={false}>
          {filteredDetections.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="glass rounded-2xl overflow-hidden cursor-pointer group"
              onClick={() => setSelectedDetection(item)}
            >
              <div className="h-48 bg-black relative overflow-hidden">
                <img 
                  src={item.image_url} 
                  alt="Capture" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-md backdrop-blur-md ${
                    item.face_type === 'UNKNOWN' 
                      ? 'bg-accent-red/20 text-accent-red border border-accent-red/30' 
                      : 'bg-accent-green/20 text-accent-green border border-accent-green/30'
                  }`}>
                    {item.face_type}
                  </span>
                  <span className="text-sm font-medium text-white/80">
                    {format(new Date(item.timestamp), "h:mm:ss a")}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-lg font-medium mb-3">
                  {item.face_type === 'VIP' ? item.vip_name : 'Unrecognized Person'}
                </h4>
                <div className="grid grid-cols-2 gap-2" onClick={e => e.stopPropagation()}>
                  <button 
                    onClick={() => handleMarkSafe(item.id)}
                    className="py-2 text-sm font-medium bg-accent-green/10 text-accent-green rounded-lg hover:bg-accent-green/20 transition-colors"
                  >
                    Mark Safe
                  </button>
                  <button 
                    onClick={() => handleMarkIntruder(item.id)}
                    className="py-2 text-sm font-medium bg-accent-red/10 text-accent-red rounded-lg hover:bg-accent-red/20 transition-colors"
                  >
                    Flag
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredDetections.length === 0 && (
        <div className="text-center py-24">
          <p className="text-white/40">No alerts found matching your criteria.</p>
        </div>
      )}

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
