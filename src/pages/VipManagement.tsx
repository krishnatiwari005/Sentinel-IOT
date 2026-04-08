import { useEffect, useState, useRef } from 'react';

import { supabase } from '../lib/supabase';
import { Vip } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, UploadCloud, Loader2, Clock, UserCheck } from 'lucide-react';

import { format } from 'date-fns';

export const VipManagement = () => {
  const [vips, setVips] = useState<Vip[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [newName, setNewName] = useState('');
  const [newFile, setNewFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchVips();
  }, []);

  const fetchVips = async () => {
    setLoading(true);
    const { data } = await supabase.from('vips').select('*').order('created_at', { ascending: false });
    if (data) setVips(data);
    setLoading(false);
  };

  const handleAddVip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newFile) return;

    setIsUploading(true);
    try {
      const fileExt = newFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('vip-faces')
        .upload(filePath, newFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('vip-faces')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase.from('vips').insert({
        name: newName,
        image_url: publicUrl,
      });

      if (dbError) throw dbError;

      setIsModalOpen(false);
      setNewName('');
      setNewFile(null);
      fetchVips();
    } catch (err) {
      console.error('Error adding VIP:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Authorize permanent removal. This subject will no longer be identified as VIP. Proceed?")) return;
    await supabase.from('vips').delete().eq('id', id);
    fetchVips();
  };

  return (
    <div className="font-body">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-extrabold text-white mb-2 tracking-tight uppercase">
            Personnel Registry
          </h1>
          <p className="text-white/40 font-medium">Clearance level: High-Value Subjects. Manage authorized biometric profiles.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-neon text-background px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-accent-blue/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Enroll New VIP
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {vips.map((vip, i) => (
             <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={vip.id}
              className="sentinel-card group"
            >
              <div className="aspect-[4/5] bg-black relative overflow-hidden">
                <img src={vip.image_url} alt={vip.name} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                
                <div className="absolute top-4 left-4">
                   <div className="px-2 py-1 bg-accent-green/10 border border-accent-green/30 rounded-md flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-green shadow-[0_0_5px_#4ADE80]"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-accent-green">Authorized</span>
                   </div>
                </div>

                <button 
                  onClick={() => handleDelete(vip.id)}
                  className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-accent-red/20 text-white/40 hover:text-accent-red rounded-lg transition-all opacity-0 group-hover:opacity-100 border border-white/5 hover:border-accent-red/20 backdrop-blur-md"
                >
                  <Trash2 size={16} />
                </button>
                
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-accent-blue transition-colors truncate">{vip.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-[10px] font-black uppercase tracking-widest text-white/40">
                    <Clock size={12}/>
                    {format(new Date(vip.created_at), "MMM yyyy")}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!loading && vips.length === 0 && (
          <div className="sentinel-card p-24 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <UserCheck size={32} className="text-white/10" />
            </div>
            <p className="text-white/30 font-display font-bold uppercase text-xs tracking-[0.2em] max-w-xs">Registry Empty. No authorized biometric signatures found.</p>
          </div>
      )}

      {/* Add VIP Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="w-full max-w-md bg-surface/90 border border-white/10 rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.6)] p-8 relative overflow-hidden"
             >
               <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/5 blur-[100px] rounded-full pointer-events-none"></div>
               
               <button 
                 onClick={() => setIsModalOpen(false)}
                 className="absolute top-6 right-6 p-2 text-white/20 hover:text-white transition-colors hover:bg-white/5 rounded-xl"
               >
                 <X size={20} />
               </button>
               
               <h2 className="text-2xl font-display font-black uppercase tracking-tight text-white mb-8 pr-8">
                 Biometric Enrollment
               </h2>
               
               <form onSubmit={handleAddVip} className="space-y-8 relative z-10">
                 <div>
                   <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">Personnel Name</label>
                   <input 
                     type="text" 
                     required
                     value={newName}
                     onChange={(e) => setNewName(e.target.value)}
                     className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-accent-blue/50 focus:bg-white/[0.08] transition-all text-white font-bold"
                     placeholder="Identified Subject Name"
                   />
                 </div>

                 <div>
                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">Optical Reference</label>
                   <div 
                     onClick={() => fileInputRef.current?.click()}
                     className="w-full h-40 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-accent-blue/40 hover:bg-accent-blue/5 transition-all group overflow-hidden relative"
                   >
                     {newFile ? (
                       <div className="absolute inset-0">
                         <img src={URL.createObjectURL(newFile)} className="w-full h-full object-cover grayscale opacity-40" alt="Preview"/>
                         <div className="absolute inset-0 flex items-center justify-center">
                           <span className="bg-black/60 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 text-white">Re-Scan Data</span>
                         </div>
                       </div>
                     ) : (
                       <>
                         <div className="p-4 bg-white/5 rounded-2xl mb-4 group-hover:text-accent-blue transition-colors">
                           <UploadCloud size={32} />
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Select Visual Reference</span>
                       </>
                     )}
                   </div>
                   <input 
                     type="file" 
                     accept="image/*" 
                     className="hidden" 
                     ref={fileInputRef}
                     onChange={(e) => {
                       if (e.target.files && e.target.files[0]) {
                         setNewFile(e.target.files[0]);
                       }
                     }}
                   />
                 </div>

                 <button 
                   type="submit" 
                   disabled={isUploading}
                   className="w-full bg-gradient-neon text-background py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-accent-blue/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                   {isUploading ? (
                     <><Loader2 className="animate-spin" size={18} /> Synching...</>
                   ) : (
                     'Register Subject'
                   )}
                 </button>
               </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
