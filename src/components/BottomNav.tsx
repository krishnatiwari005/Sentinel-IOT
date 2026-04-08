import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Bell, Clock, Users, Settings, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

export const BottomNav = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Alerts', path: '/alerts', icon: Bell },
    { name: 'History', path: '/history', icon: Clock },
    { name: 'VIPs', path: '/vips', icon: Users },
    { name: 'Setup', path: '/settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#0a0f1e] border-t border-white/10 md:hidden z-[100]">
      <nav className="flex items-center justify-around h-full max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 w-full h-full relative group transition-all duration-300",
                  isActive ? "text-accent-blue scale-110" : "text-white/40"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} className={cn("transition-transform", isActive ? "fill-accent-blue/10" : "")} />
                  <span className="text-[9px] font-medium tracking-wide uppercase">{item.name}</span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      className="absolute -top-1 w-8 h-[2px] bg-accent-blue rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  {item.name === 'Alerts' && (
                    <span className="absolute top-2 right-[25%] w-2 h-2 rounded-full bg-accent-red border-2 border-[#111827]"></span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
        
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center gap-1 w-full h-full text-accent-red hover:bg-accent-red/5 transition-all duration-300"
        >
          <LogOut size={20} />
          <span className="text-[9px] font-medium tracking-wide uppercase">Exit</span>
        </button>
      </nav>
    </div>
  );
};
