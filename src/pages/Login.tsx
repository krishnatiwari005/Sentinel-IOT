import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';


export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-red/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-blue/20 text-accent-blue mb-4">
            <Shield size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Secure Portal
          </h1>
          <p className="text-white/60">
            {isRegistering ? 'Create your new administrator account' : 'Sign in to access your dashboard'}
          </p>
        </div>

        <div className="glass rounded-2xl p-8 relative">
          {/* Tabs */}
          <div className="flex bg-black/40 rounded-xl p-1 mb-8">
            <button
              onClick={() => { setIsRegistering(false); setError(null); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${!isRegistering ? 'bg-white/10 text-white shadow' : 'text-white/50 hover:text-white'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsRegistering(true); setError(null); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${isRegistering ? 'bg-white/10 text-white shadow' : 'text-white/50 hover:text-white'}`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-3 rounded-xl text-sm ${
                    error.includes('successful') 
                      ? 'bg-accent-green/20 text-accent-green' 
                      : 'bg-accent-red/20 text-accent-red'
                  }`}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/50 transition-all text-white placeholder:text-white/30"
                placeholder="admin@example.com"
              />
            </div>

            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-white/80">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-12 py-3 outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/50 transition-all text-white placeholder:text-white/30"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative group overflow-hidden rounded-xl p-[1px] pt-2 mt-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent-blue to-blue-400 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-[#0a0f1e] text-white font-medium px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors group-hover:bg-transparent">
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  isRegistering ? 'Create Account' : 'Sign In'
                )}
              </div>
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
