import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Shield, Eye, EyeOff, Loader2, Fingerprint, Lock, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [matrixText, setMatrixText] = useState('AUTHENTICATION_REQUIRED');

  useEffect(() => {
    const texts = ['AUTHENTICATION_REQUIRED', 'ENTER_CREDENTIALS', 'SECURE_UHF_LINK_ACTIVE'];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % texts.length;
      setMatrixText(texts[idx]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isRegistering) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        // Optional: show a message to check email for confirmation
        setError("Registration successful! You can now log in.");
        setIsRegistering(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative overflow-hidden font-body">
      {/* Dynamic Grid Background overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>

      {/* Decorative ambient gradients */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-green/10 rounded-full blur-[120px] pointer-events-none"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10 relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 border border-accent-blue/20 rounded-full border-dashed pointer-events-none"
          />
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent-blue/10 text-accent-blue relative mb-6 border border-accent-blue/20 backdrop-blur-md shadow-[0_0_30px_rgba(0,255,255,0.15)]">
             <Shield size={36} className="relative z-10" />
             <motion.div 
               animate={{ opacity: [0, 1, 0] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="absolute inset-0 bg-accent-blue/20 rounded-full blur-md"
             />
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-black tech-mono tracking-[0.2em] text-white uppercase mb-2 flex items-center gap-2">
              <span className="text-accent-blue opacity-50">[</span>
              A.E.G.I.S
              <span className="text-accent-blue opacity-50">]</span>
            </h1>
            <div className="flex items-center gap-3 text-xs tech-mono text-accent-green tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse shadow-[0_0_8px_rgba(0,255,255,0.8)]"></span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={matrixText}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-accent-blue"
                >
                  {matrixText}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="sentinel-card rounded-2xl p-8 relative overflow-hidden bg-[#0a0f1e]/80">
          <div className="scanner-line"></div>
          
          <div className="flex bg-black/60 rounded-xl p-1.5 mb-8 border border-white/5 relative z-10 box-border">
            <button
              type="button"
              onClick={() => { setIsRegistering(false); setError(null); }}
              className={`flex-1 py-2.5 text-xs tech-mono tracking-widest uppercase rounded-lg transition-all duration-300 relative ${!isRegistering ? 'text-white' : 'text-white/40 hover:text-white/80'}`}
            >
              {!isRegistering && (
                <motion.div layoutId="loginTab" className="absolute inset-0 bg-accent-blue/20 border border-accent-blue/30 rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.2)]" />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Lock size={14} /> Link
              </span>
            </button>
            <button
              type="button"
              onClick={() => { setIsRegistering(true); setError(null); }}
              className={`flex-1 py-2.5 text-xs tech-mono tracking-widest uppercase rounded-lg transition-all duration-300 relative ${isRegistering ? 'text-white' : 'text-white/40 hover:text-white/80'}`}
            >
              {isRegistering && (
                <motion.div layoutId="loginTab" className="absolute inset-0 bg-accent-blue/20 border border-accent-blue/30 rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.2)]" />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Fingerprint size={14} /> Create
              </span>
            </button>
          </div>

          <motion.form 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            onSubmit={handleSubmit} 
            className="space-y-6 relative z-10"
          >
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  className={`p-4 rounded-xl text-xs font-mono border ${
                    error.includes('successful') 
                      ? 'bg-accent-green/10 text-accent-green border-accent-green/20' 
                      : 'bg-accent-red/10 text-accent-red border-accent-red/20'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Terminal size={16} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-[10px] tech-mono tracking-widest uppercase text-white/50 ml-1">Identity <span className="text-accent-blue">*</span></label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-accent-blue transition-colors">
                  <Fingerprint size={16} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 outline-none focus:border-accent-blue/50 focus:bg-accent-blue/5 focus:ring-1 focus:ring-accent-blue/50 transition-all text-sm font-mono text-white placeholder:text-white/20"
                  placeholder="sys.admin@aegis.net"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-[10px] tech-mono tracking-widest uppercase text-white/50 ml-1">Access Key <span className="text-accent-blue">*</span></label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-accent-blue transition-colors">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-11 pr-12 py-3.5 outline-none focus:border-accent-blue/50 focus:bg-accent-blue/5 focus:ring-1 focus:ring-accent-blue/50 transition-all text-sm font-mono text-white tracking-widest placeholder:text-white/20 placeholder:tracking-normal"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors bg-black/50 p-1 rounded-md"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </motion.div>

            <motion.button
              variants={itemVariants}
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={isLoading}
              className="w-full relative group overflow-hidden rounded-xl bg-accent-blue/10 border border-accent-blue/20 mt-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/20 to-accent-green/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative font-bold tech-mono tracking-widest px-4 py-4 flex items-center justify-center gap-3 transition-colors text-accent-blue group-hover:text-white uppercase text-sm">
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Shield size={18} className="group-hover:animate-pulse" />
                    <span>{isRegistering ? 'Initialize' : 'Engage Link'}</span>
                  </>
                )}
              </div>
            </motion.button>
          </motion.form>
          
          {/* Decorative Corner Brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent-blue/30 rounded-tl-xl pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent-blue/30 rounded-tr-xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent-blue/30 rounded-bl-xl pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent-blue/30 rounded-br-xl pointer-events-none"></div>
        </div>
      </motion.div>
    </div>
  );
};
