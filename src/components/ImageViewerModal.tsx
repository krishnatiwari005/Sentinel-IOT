import { motion } from 'framer-motion';
import { X, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Detection } from '../types';
import { format } from 'date-fns';

interface ImageViewerModalProps {
  detection: Detection | null;
  onClose: () => void;
  onMarkSafe: (id: string) => void;
  onMarkIntruder: (id: string) => void;
}

export const ImageViewerModal = ({ detection, onClose, onMarkSafe, onMarkIntruder }: ImageViewerModalProps) => {
  if (!detection) return null;

  const isUnknown = detection.face_type === 'UNKNOWN';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl glass rounded-2xl overflow-hidden shadow-2xl border border-white/20 flex flex-col md:flex-row"
      >
        {/* Image Section */}
        <div className="flex-1 bg-black relative max-h-[70vh] md:max-h-none flex items-center justify-center">
          <img 
            src={detection.image_url} 
            alt="Capture full size" 
            className="w-full h-full object-contain"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Info Section */}
        <div className="w-full md:w-80 bg-card p-6 flex flex-col border-t md:border-t-0 md:border-l border-white/10">
          <h2 className="text-xl font-semibold mb-4">Detection Details</h2>
          
          <div className="space-y-6 flex-1">
            <div>
              <p className="text-sm text-white/50 mb-1">Status Classification</p>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${isUnknown ? 'bg-accent-red/20 text-accent-red' : 'bg-accent-green/20 text-accent-green'}`}>
                {isUnknown ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
                {isUnknown ? 'Unknown Identity' : 'Verified VIP'}
              </div>
            </div>

            {!isUnknown && detection.vip_name && (
              <div>
                <p className="text-sm text-white/50 mb-1">Identified As</p>
                <p className="text-lg font-medium">{detection.vip_name}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-white/50 mb-1">Time of Capture</p>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-white/60" />
                <p className="font-medium">
                  {format(new Date(detection.timestamp), "MMM dd, yyyy 'at' HH:mm:ss")}
                </p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-white/50 mb-1">Capture ID</p>
              <p className="text-xs font-mono text-white/40 truncate">{detection.id}</p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
             <button 
                onClick={() => { onMarkSafe(detection.id); onClose(); }}
                className="w-full py-3 rounded-xl bg-accent-green/10 hover:bg-accent-green/20 text-accent-green font-medium transition-colors border border-accent-green/20"
              >
                Mark as Safe
              </button>
              <button 
                onClick={() => { onMarkIntruder(detection.id); onClose(); }}
                className="w-full py-3 rounded-xl bg-accent-red/10 hover:bg-accent-red/20 text-accent-red font-medium transition-colors border border-accent-red/20"
              >
                Flag as Suspicious
              </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
