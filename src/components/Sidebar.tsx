import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Bell, 
  Clock, 
  Users, 
  Settings, 
  Cpu, 
  LogOut,
  Activity,
  Zap
} from 'lucide-react';


import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const Sidebar = () => {
  const { signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [telemetry, setTelemetry] = useState({ ping: 42, throughput: 1.2, cpu: 14 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry({
        ping: Math.floor(Math.random() * 20) + 30,
        throughput: parseFloat((Math.random() * 2 + 0.5).toFixed(1)),
        cpu: Math.floor(Math.random() * 10) + 12
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Live Alerts', path: '/alerts', icon: Bell },
    { name: 'History Log', path: '/history', icon: Clock },
    { name: 'VIP Management', path: '/vips', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
    ...(isAdmin ? [{ name: 'Device Setup', path: '/setup', icon: Cpu }] : []),
  ];

  return (
    <aside className="w-64 h-screen bg-surface-dim/80 backdrop-blur-3xl border-r border-white/5 hidden md:flex flex-col fixed left-0 top-0 z-[100] font-body overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      
      <div className="p-6 flex items-center h-24 relative border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 shadow-lg shadow-accent-blue/30 ring-1 ring-white/10">
            <img src="/sentinel-logo.png" alt="Sentinel Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-mono font-bold text-lg tracking-[0.15em] text-white uppercase leading-none">Sentinel</h1>
            <p className="text-[9px] font-mono tracking-[0.35em] text-accent-blue uppercase opacity-70 mt-0.5">IoT Guard v2.0</p>
          </div>
        </div>
        {/* Live pulse indicator */}
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-green shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto scrollbar-hide relative z-10">
        <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] pl-4 mb-4">Nav Main_</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "group flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300 relative overflow-hidden",
                  isActive 
                    ? "text-accent-blue bg-accent-blue/10" 
                    : "text-white/40 hover:bg-white/5 hover:text-white"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon 
                    size={18} 
                    className={cn(
                      "mr-4 transition-all duration-300", 
                      isActive ? "text-accent-blue scale-110" : "group-hover:text-white"
                    )} 
                  />
                  <span className="tracking-tight">{item.name}</span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTabSidebar"
                      className="absolute left-0 top-2 bottom-2 w-1 bg-accent-blue rounded-r-full shadow-[0_0_15px_#00D1FF]"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-6 mt-auto border-t border-white/5 space-y-6 relative z-10">
        {/* Telemetry Panel */}
        <div className="space-y-3">
           <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-white/20">
              <span>Telemetry Node</span>
              <Activity size={10} className="text-accent-blue" />
           </div>
           
           <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                 <div className="text-[10px] font-bold text-white/40 mb-1">LATENCY</div>
                 <div className="text-xs font-mono text-accent-blue">{telemetry.ping}ms</div>
              </div>
              <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                 <div className="text-[10px] font-bold text-white/40 mb-1">LOAD</div>
                 <div className="text-xs font-mono text-accent-green">{telemetry.cpu}%</div>
              </div>
           </div>
           
           <div className="bg-white/5 rounded-lg p-2 border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-white/40 mb-1">TRAFFIC_OUT</div>
                <div className="text-xs font-mono text-white/80">{telemetry.throughput} MB/s</div>
              </div>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="p-1 rounded bg-accent-blue/10"
              >
                <Zap size={10} className="text-accent-blue" />
              </motion.div>
           </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black text-white/20 transition-all uppercase tracking-[0.2em] border border-transparent hover:border-accent-red/20 hover:text-accent-red hover:bg-accent-red/5 group"
        >
          <LogOut size={16} className="transition-transform group-hover:-translate-x-1" />
          Terminate_
        </button>
      </div>
    </aside>
  );
};
