import { useState } from 'react';

import { Copy, Eye, EyeOff, CheckCircle2 } from 'lucide-react';


export const DeviceSetup = () => {
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xxxxxxxx.supabase.co';


  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Hardware Setup</h1>
        <p className="text-white/60">Configure your ESP32-CAM to connect to this dashboard</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 border border-accent-blue/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/10 blur-[50px]"></div>
            <h2 className="text-xl font-semibold mb-6">Database Credentials</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white/50 mb-1">Supabase URL</label>
                <div className="flex bg-black/40 border border-white/10 rounded-xl p-1 relative">
                  <div className="flex-1 px-3 py-2 text-sm font-mono text-white/80 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    {supabaseUrl}
                  </div>
                  <button 
                    onClick={() => handleCopy(supabaseUrl, 'url')}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors ml-2"
                  >
                    {copied === 'url' ? <CheckCircle2 size={16} className="text-accent-green" /> : <Copy size={16} className="text-white/60" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/50 mb-1">Service Key</label>
                <div className="flex bg-black/40 border border-white/10 rounded-xl p-1 relative">
                  <div className="flex-1 px-3 py-2 text-sm font-mono text-white/80 overflow-hidden flex items-center">
                    {showSecret ? import.meta.env.VITE_SUPABASE_ANON_KEY : '••••••••••••••••••••••••••••••••••••••••'}
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button 
                      onClick={() => setShowSecret(!showSecret)}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {showSecret ? <EyeOff size={16} className="text-white/60" /> : <Eye size={16} className="text-white/60" />}
                    </button>
                    <button 
                      onClick={() => handleCopy(import.meta.env.VITE_SUPABASE_ANON_KEY || '', 'key')}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {copied === 'key' ? <CheckCircle2 size={16} className="text-accent-green" /> : <Copy size={16} className="text-white/60" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
             <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-sm text-accent-red flex items-center gap-2">
                  <span>⚠️</span> Keep your service key completely secure. Do not share it.
                </p>
             </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">Next Steps Guide</h2>
          
          <div className="space-y-6 relative before:content-[''] before:absolute before:left-[15px] before:top-4 before:bottom-4 before:w-[2px] before:bg-white/10">
            {/* Step 1 */}
            <div className="relative pl-12">
              <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-accent-blue flex items-center justify-center font-bold text-sm text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                1
              </div>
              <h3 className="font-semibold text-lg">Flash ESP32 Firmware</h3>
              <p className="text-sm text-white/60 mt-1">
                Upload the provided `IoT_Facial_Recognition.ino` sketch using Arduino IDE. Make sure to select "AI Thinker ESP32-CAM" as the board.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="relative pl-12">
              <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-sm text-white/50">
                2
              </div>
              <h3 className="font-medium text-lg text-white/80">Configure WiFi</h3>
              <p className="text-sm text-white/50 mt-1">
                Open `secrets.h` in your sketch and input your local WiFi SSID and password so the camera can reach the internet.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative pl-12">
              <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-sm text-white/50">
                3
              </div>
              <h3 className="font-medium text-lg text-white/80">Paste Database Keys</h3>
              <p className="text-sm text-white/50 mt-1">
                Copy the Supabase URL and Service Key from the panel on the left and paste them into the respective fields in `secrets.h`.
              </p>
              
              <div className="mt-3 bg-black/50 border border-white/5 p-3 rounded-xl font-mono text-xs text-accent-green/80 overflow-x-auto">
                #define SUPABASE_URL "YOUR_URL" <br />
                #define SUPABASE_KEY "YOUR_KEY"
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="relative pl-12">
              <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-sm text-white/50">
                4
              </div>
              <h3 className="font-medium text-lg text-white/80">Reboot & Test</h3>
              <p className="text-sm text-white/50 mt-1">
                Press the physical reset button on the ESP32. Check the Live Alerts dashboard for incoming connection handshakes.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
