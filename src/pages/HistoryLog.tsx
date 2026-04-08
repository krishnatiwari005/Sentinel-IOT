import { useEffect, useState } from 'react';

import { supabase } from '../lib/supabase';
import { Detection } from '../types';
import { format } from 'date-fns';
import { Search, SearchX } from 'lucide-react';

export const HistoryLog = () => {
  const [logs, setLogs] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [filterType, setFilterType] = useState<string>('All');
  const [search, setSearch] = useState('');
  
  const LIMIT = 20;

  useEffect(() => {
    fetchLogs();
  }, [page, filterType, search]);

  const fetchLogs = async () => {
    setLoading(true);
    let query = supabase
      .from('detections')
      .select('*', { count: 'exact' })
      .order('timestamp', { ascending: false })
      .range(page * LIMIT, (page + 1) * LIMIT - 1);

    if (filterType !== 'All') {
      query = query.eq('face_type', filterType);
    }
    
    if (search) {
      // Assuming vip_name is where search makes sense
      query = query.ilike('vip_name', `%${search}%`);
    }

    const { data, count, error } = await query;
    if (!error && data) {
      setLogs(data);
      setHasNext((count ?? 0) > (page + 1) * LIMIT);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">History Log</h1>
          <p className="text-white/60">Comprehensive archive of all system events</p>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/10 flex flex-wrap gap-4 items-center justify-between bg-black/20">
          <div className="flex gap-2">
            {['All', 'UNKNOWN', 'VIP'].map((f) => (
              <button
                key={f}
                onClick={() => { setFilterType(f); setPage(0); }}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterType === f ? 'bg-accent-blue/20 text-accent-blue' : 'hover:bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                {f} Only
              </button>
            ))}
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <input 
              type="text" 
              placeholder="Search VIP name..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-sm focus:border-accent-blue/50 outline-none w-64 text-white"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/5 text-sm text-white/50">
                <th className="p-4 font-medium">Photo</th>
                <th className="p-4 font-medium">Face Type</th>
                <th className="p-4 font-medium">Identity</th>
                <th className="p-4 font-medium">Timestamp</th>
                <th className="p-4 font-medium">Status / Action</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="w-12 h-12 bg-black rounded-lg overflow-hidden border border-white/10">
                      <img src={log.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${
                      log.face_type === 'UNKNOWN' 
                        ? 'bg-accent-red/10 text-accent-red border-accent-red/20' 
                        : 'bg-accent-green/10 text-accent-green border-accent-green/20'
                    }`}>
                      {log.face_type}
                    </span>
                  </td>
                  <td className="p-4 font-medium">
                    {log.face_type === 'VIP' ? log.vip_name : <span className="text-white/30">—</span>}
                  </td>
                  <td className="p-4 text-white/70">
                    {format(new Date(log.timestamp), "MMM dd, yyyy HH:mm:ss")}
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium capitalize text-white/60">
                      {log.status || 'Pending'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {!loading && logs.length === 0 && (
            <div className="p-12 text-center flex flex-col items-center justify-center text-white/40">
              <SearchX size={48} className="mb-4 opacity-20" />
              <p>No records found matching the current filters.</p>
            </div>
          )}
          
          {loading && (
            <div className="p-12 text-center text-accent-blue/50 animate-pulse">
              Loading records...
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-white/10 flex justify-between items-center bg-black/20">
          <button 
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 font-medium text-sm rounded-lg hover:bg-white/5 disabled:opacity-50 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-white/50">Page {page + 1}</span>
          <button 
            disabled={!hasNext}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 font-medium text-sm rounded-lg hover:bg-white/5 disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
