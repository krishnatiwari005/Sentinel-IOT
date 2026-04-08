import { useEffect, useState } from 'react';

import { supabase } from '../lib/supabase';
import { Settings as SettingsType } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Save, AlertOctagon, Loader2 } from 'lucide-react';

export const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSettings();
    } else {
      // No active session — still render with defaults so page is never blank
      setSettings({
        id: '',
        user_id: '',
        vip_mode: true,
        sensitivity: 'High',
        storage_quality: 'High'
      });
    }
  }, [user]);

  const fetchSettings = async () => {
    const { data } = await supabase.from('settings').select('*').eq('user_id', user?.id).single();
    if (data) {
      setSettings(data);
    } else {
      setSettings({
        id: '',
        user_id: user?.id || '',
        vip_mode: true,
        sensitivity: 'High',
        storage_quality: 'High'
      });
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    await supabase.from('settings').upsert({
      user_id: settings.user_id,
      vip_mode: settings.vip_mode,
      sensitivity: settings.sensitivity,
      storage_quality: settings.storage_quality
    });
    await new Promise(r => setTimeout(r, 600));
    setIsSaving(false);
  };

  const handleDeleteLogs = async () => {
    if (!window.confirm("CRITICAL WARNING: This will permanently delete ALL detection logs and captures. This action CANNOT be undone. Proceed?")) return;
    setIsDeleting(true);
    await supabase.from('detections').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    setIsDeleting(false);
    alert('All logs deleted successfully.');
  };

  // Animated skeleton instead of blank page
  if (!settings) {
    return (
      <div className="max-w-3xl animate-pulse space-y-6">
        <div>
          <div className="h-8 w-48 bg-white/5 rounded-lg mb-2"></div>
          <div className="h-4 w-72 bg-white/5 rounded-lg"></div>
        </div>
        <div className="h-64 bg-white/5 rounded-2xl"></div>
        <div className="h-32 bg-white/5 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-10 relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent-blue/5 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="flex items-center gap-3 mb-4">
          <span className="tech-mono text-accent-blue">System_Config: 01</span>
          <div className="h-0.5 w-12 bg-white/5 rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-accent-blue animate-pulse"></div>
          </div>
          <span className="tech-mono">Node_Settings_Active</span>
        </div>
        <h1 className="text-3xl tech-mono font-medium tracking-[0.05em] mb-2 text-white uppercase leading-none">
          System Settings
        </h1>
        <p className="text-white/40 font-medium tracking-tight text-sm">Configure IoT device behaviors and dashboard preferences</p>
      </div>

      {/* Recognition Engine Card */}
      <div className="bg-[#10141a]/60 backdrop-blur-3xl border border-white/5 rounded-2xl p-6 md:p-8 mb-6 shadow-2xl">
        <h2 className="tech-mono text-xs font-medium tracking-[0.2em] mb-6 flex items-center gap-3">
          <div className="w-1 h-5 bg-accent-blue rounded-full shadow-[0_0_15px_rgba(0,209,255,0.5)]"></div>
          Recognition Engine
        </h2>

        <div className="space-y-4">
          {/* VIP Bypass */}
          <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <div>
              <h3 className="font-medium text-white/90 text-sm tracking-wide mb-1">VIP Bypass Mode</h3>
              <p className="text-xs text-white/40 font-mono leading-relaxed">Automatically marks known VIP faces as Safe from hardware.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-6">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.vip_mode}
                onChange={e => setSettings({ ...settings, vip_mode: e.target.checked })}
              />
              <div className="w-14 h-7 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-accent-blue transition-colors"></div>
            </label>
          </div>

          {/* Sensitivity */}
          <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <div>
              <h3 className="font-medium text-white/90 text-sm tracking-wide mb-1">Detection Sensitivity</h3>
              <p className="text-xs text-white/40 font-mono leading-relaxed">Model confidence threshold for recognizing faces.</p>
            </div>
            <select
              value={settings.sensitivity}
              onChange={e => setSettings({ ...settings, sensitivity: e.target.value as any })}
              className="bg-black/60 border border-white/10 text-white/90 text-xs font-mono rounded-lg px-4 py-2 outline-none focus:border-accent-blue transition-colors ml-6 flex-shrink-0"
            >
              <option value="Low">Low — Permissive</option>
              <option value="Medium">Medium — Balanced</option>
              <option value="High">High — Strict</option>
            </select>
          </div>

          {/* Storage Quality */}
          <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <div>
              <h3 className="font-medium text-white/90 text-sm tracking-wide mb-1">Storage Quality</h3>
              <p className="text-xs text-white/40 font-mono leading-relaxed">Resolution of saved camera captures in Supabase Storage.</p>
            </div>
            <select
              value={settings.storage_quality}
              onChange={e => setSettings({ ...settings, storage_quality: e.target.value as any })}
              className="bg-black/60 border border-white/10 text-white/90 text-xs font-mono rounded-lg px-4 py-2 outline-none focus:border-accent-blue transition-colors ml-6 flex-shrink-0"
            >
              <option value="Low">Low — Fast Upload</option>
              <option value="Medium">Medium — Balanced</option>
              <option value="High">High — Max Detail</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-accent-blue/20 hover:bg-accent-blue text-accent-blue hover:text-white border border-accent-blue/30 hover:border-accent-blue px-6 py-2.5 rounded-xl font-mono text-xs tracking-widest uppercase transition-all flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,209,255,0.3)]"
          >
            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#10141a]/60 backdrop-blur-3xl border border-accent-red/20 rounded-2xl p-6 md:p-8 shadow-2xl">
        <h2 className="tech-mono text-xs font-medium tracking-[0.2em] mb-2 flex items-center gap-3 text-accent-red">
          <div className="w-1 h-5 bg-accent-red rounded-full shadow-[0_0_15px_rgba(255,59,48,0.5)] animate-pulse flex-shrink-0"></div>
          <AlertOctagon size={12} /> Danger Zone
        </h2>
        <p className="text-xs text-white/40 font-mono mb-6 leading-relaxed">Operations here cannot be reversed. Proceed with extreme caution.</p>

        <div className="flex items-center justify-between p-4 bg-accent-red/5 rounded-xl border border-accent-red/10">
          <div>
            <h3 className="font-medium text-white/90 text-sm tracking-wide mb-1">Purge Database</h3>
            <p className="text-xs text-white/40 font-mono">Permanently delete all detection logs from history.</p>
          </div>
          <button
            onClick={handleDeleteLogs}
            disabled={isDeleting}
            className="px-5 py-2.5 bg-accent-red/10 text-accent-red border border-accent-red/20 rounded-xl font-mono text-xs tracking-widest uppercase hover:bg-accent-red hover:text-white transition-all flex items-center gap-2 ml-6 flex-shrink-0"
          >
            {isDeleting ? <Loader2 className="animate-spin" size={14} /> : null}
            {isDeleting ? 'Erasing...' : 'Delete All Logs'}
          </button>
        </div>
      </div>
    </div>
  );
};
