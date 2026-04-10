import React, { useState, useEffect } from 'react';
import { Search, Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface IpDiscoveryProps {
  onFound: (ip: string) => void;
  currentIp: string;
}

export const IpDiscovery: React.FC<IpDiscoveryProps> = ({ onFound, currentIp }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'found' | 'not_found'>('idle');
  const [discoveredIp, setDiscoveredIp] = useState<string | null>(null);

  const subnets = [
    '10.101.174.',
    '10.93.223.',
    '192.168.1.',
    '192.168.0.'
  ];

  const scanNetwork = async () => {
    setIsScanning(true);
    setStatus('scanning');
    setProgress(0);
    setDiscoveredIp(null);

    const totalIps = subnets.length * 254;
    let checkedCount = 0;
    let found = false;

    for (const subnet of subnets) {
      if (found) break;
      
      const promises = [];
      for (let i = 1; i < 255; i++) {
        const ip = `${subnet}${i}`;
        promises.push(testIp(ip).then(isWorking => {
          checkedCount++;
          setProgress(Math.round((checkedCount / totalIps) * 100));
          if (isWorking && !found) {
            found = true;
            setDiscoveredIp(ip);
            setStatus('found');
            onFound(ip);
          }
        }));

        // Batch requests to avoid crashing the browser
        if (promises.length >= 20) {
          await Promise.all(promises);
          promises.length = 0;
          if (found) break;
        }
      }
      if (found) break;
      await Promise.all(promises);
    }

    if (!found) {
      setStatus('not_found');
    }
    setIsScanning(false);
  };

  const testIp = (ip: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      const timer = setTimeout(() => {
        img.src = "";
        resolve(false);
      }, 1500); // 1.5s timeout per IP

      img.onload = () => {
        clearTimeout(timer);
        resolve(true);
      };

      img.onerror = () => {
        clearTimeout(timer);
        resolve(false);
      };

      // Specifically check the stream port
      img.src = `http://${ip}:81/stream?t=${Date.now()}`;
    });
  };

  return (
    <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Search size={16} className="text-accent-blue" />
          <h3 className="text-xs font-black uppercase tracking-widest text-white/80">Net_Discovery</h3>
        </div>
        {status === 'found' && (
          <div className="flex items-center gap-1.5 text-accent-green">
            <CheckCircle2 size={12} />
            <span className="text-[10px] font-bold">LINK_SYNCED</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-white/30 uppercase font-black tracking-tighter">Current Target</span>
            <span className="text-sm tech-mono text-accent-blue">{discoveredIp || currentIp}</span>
          </div>
          <button 
            onClick={scanNetwork}
            disabled={isScanning}
            className="p-2.5 bg-accent-blue/10 hover:bg-accent-blue/20 text-accent-blue rounded-xl border border-accent-blue/20 transition-all disabled:opacity-50"
          >
            {isScanning ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          </button>
        </div>

        {isScanning && (
          <div className="space-y-2">
            <div className="flex justify-between text-[8px] font-black uppercase text-white/20">
              <span>Scanning Subnets...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: `${progress}%` }}
                className="h-full bg-accent-blue shadow-[0_0_10px_#00D1FF]"
              />
            </div>
          </div>
        )}

        {status === 'not_found' && (
          <div className="flex items-center gap-2 text-accent-red mt-2">
            <AlertCircle size={14} />
            <span className="text-[9px] font-black uppercase">No Camera Found. Check WiFi.</span>
          </div>
        )}
      </div>
    </div>
  );
};
