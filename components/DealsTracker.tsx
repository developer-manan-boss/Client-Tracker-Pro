import React, { useState, useMemo } from 'react';
import { useData, Deal } from './DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Briefcase, TrendingUp, Filter, Pencil, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const DealsTracker: React.FC = () => {
  const { deals, addDeal, updateDeal, deleteDeal } = useData();
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [currentDeal, setCurrentDeal] = useState<Partial<Deal>>({
    date: new Date().toLocaleDateString(), value: '', status: 'Pending', description: '', company: ''
  });

  const handleEdit = (deal: Deal) => {
    setCurrentDeal(deal);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this deal?')) {
        deleteDeal(id);
    }
  };

  const openAddModal = () => {
      setCurrentDeal({ date: new Date().toLocaleDateString(), value: '', status: 'Pending', description: '', company: '' });
      setIsEditing(false);
      setShowModal(true);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && currentDeal.id) {
        updateDeal(currentDeal as Deal);
    } else {
        addDeal({
            id: `DL-${Date.now()}`,
            date: currentDeal.date || '',
            value: currentDeal.value || '0.00',
            status: currentDeal.status || 'Pending',
            description: currentDeal.description || '',
            company: currentDeal.company || '',
            contact: ''
        });
    }
    setShowModal(false);
  };

  const filteredDeals = deals.filter(d => statusFilter === 'All' || d.status === statusFilter);

  // Tracking Metrics - Calculated from actual data
  const summary = useMemo(() => {
    const total = deals.reduce((acc, curr) => acc + parseFloat(curr.value.replace(/,/g, '')), 0);
    const won = deals.filter(d => d.status === 'Closed-Won').length;
    const count = deals.length;
    const winRate = count > 0 ? Math.round((won / count) * 100) : 0;
    return { total, count, winRate };
  }, [deals]);

  // Chart Data
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    deals.forEach(d => { counts[d.status] = (counts[d.status] || 0) + 1 });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [deals]);

  const COLORS: Record<string, string> = {
      'Closed-Won': '#10b981', // emerald
      'Closed-Lost': '#64748b', // slate
      'Pending': '#ec4899', // pink
      'Under Review': '#3b82f6', // blue
      'On Hold': '#f59e0b' // amber
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-[1400px] mx-auto p-4 h-[calc(100vh-60px)] flex flex-col"
    >
       <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-light text-white">Deals Tracker</h1>
          <p className="text-sm text-slate-400">Manage your sales pipeline and track deal values.</p>
        </div>
        <button onClick={openAddModal} className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded text-sm font-medium transition-colors shadow-lg shadow-pink-500/20">
          + Add New Deal
        </button>
      </div>

      {/* Summary Metrics Bar */}
      <div className="grid grid-cols-12 gap-4 mb-4">
        <div className="col-span-12 md:col-span-8 grid grid-cols-3 gap-4">
            <div className="bg-[#1e293b] border border-pink-500/30 p-3 rounded flex items-center gap-3 shadow-lg">
                <div className="bg-pink-500/20 p-2 rounded text-pink-400"><DollarSign size={18} /></div>
                <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total Pipeline Value</div>
                    <div className="text-lg font-mono text-white">${summary.total.toLocaleString()}</div>
                </div>
            </div>
            <div className="bg-[#1e293b] border border-slate-700 p-3 rounded flex items-center gap-3 shadow-lg">
                <div className="bg-slate-700/50 p-2 rounded text-slate-300"><Briefcase size={18} /></div>
                <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total Deals</div>
                    <div className="text-lg font-mono text-white">{summary.count}</div>
                </div>
            </div>
            <div className="bg-[#1e293b] border border-slate-700 p-3 rounded flex items-center gap-3 shadow-lg">
                <div className="bg-emerald-500/20 p-2 rounded text-emerald-400"><TrendingUp size={18} /></div>
                <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Win Rate</div>
                    <div className="text-lg font-mono text-white">{summary.winRate}%</div>
                </div>
            </div>
        </div>
        {/* Simple Chart Area */}
        <div className="col-span-12 md:col-span-4 bg-[#1e293b] border border-slate-700 rounded p-2 flex flex-col">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-1">Deal Status Distribution</h4>
            <div className="flex-1 min-h-[80px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" hide />
                        <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px'}} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#ec4899'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 mb-2">
          <Filter size={14} className="text-slate-400" />
          <span className="text-xs text-slate-400 font-bold uppercase">Filter:</span>
          {['All', 'Pending', 'Under Review', 'Closed-Won', 'Closed-Lost'].map(status => (
              <button 
                key={status} 
                onClick={() => setStatusFilter(status)}
                className={`text-[10px] px-2 py-1 rounded border transition-colors ${statusFilter === status ? 'bg-pink-600 border-pink-500 text-white' : 'bg-transparent border-slate-700 text-slate-400 hover:border-pink-500/50'}`}
              >
                  {status}
              </button>
          ))}
      </div>

      <div className="bg-[#1e293b] rounded-md overflow-hidden flex-1 border border-slate-700 flex flex-col shadow-xl">
        <div className="bg-pink-600 text-white text-[10px] font-bold uppercase tracking-wider grid grid-cols-12 gap-2 p-3 border-b border-pink-700 sticky top-0 z-10">
           <div className="col-span-2">Date Updated</div>
           <div className="col-span-3">Deal Name/Desc</div>
           <div className="col-span-3">Client Company</div>
           <div className="col-span-2 text-right">Value ($)</div>
           <div className="col-span-1 text-center">Stage</div>
           <div className="col-span-1 text-center">Actions</div>
        </div>
        <div className="overflow-y-auto flex-1 custom-scrollbar">
           <AnimatePresence>
           {filteredDeals.map((item, idx) => (
             <motion.div 
               key={item.id}
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, height: 0 }}
               transition={{ delay: idx * 0.05 }}
               className="grid grid-cols-12 gap-2 p-3 border-b border-slate-700/50 hover:bg-slate-700/30 text-xs text-slate-300 items-center group"
             >
               <div className="col-span-2 text-white">{item.date}</div>
               <div className="col-span-3 font-medium text-slate-200">{item.description}</div>
               <div className="col-span-3 text-slate-400">{item.company}</div>
               <div className="col-span-2 text-right font-mono text-emerald-400">{item.value}</div>
               <div className="col-span-1 text-center">
                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    item.status === 'Closed-Won' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                    item.status === 'Closed-Lost' ? 'bg-slate-500/20 text-slate-400 border-slate-500/30' :
                    'bg-pink-500/20 text-pink-300 border-pink-500/30'
                 }`}>
                    {item.status}
                 </span>
               </div>
               <div className="col-span-1 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => handleEdit(item)} className="text-blue-400 hover:text-blue-300"><Pencil size={14}/></button>
                   <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300"><Trash2 size={14}/></button>
               </div>
             </motion.div>
           ))}
           </AnimatePresence>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-[#1e293b] rounded-lg shadow-2xl w-full max-w-md border border-slate-600"
          >
            <h2 className="text-lg font-medium text-white p-4 border-b border-slate-700">{isEditing ? 'Edit Deal' : 'Add Deal'}</h2>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
               <div>
                  <label className="block text-xs text-slate-400 mb-1">Date</label>
                  <input value={currentDeal.date} onChange={e => setCurrentDeal({...currentDeal, date: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm" />
               </div>
               <div>
                  <label className="block text-xs text-slate-400 mb-1">Deal Name</label>
                  <input value={currentDeal.description} onChange={e => setCurrentDeal({...currentDeal, description: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm" placeholder="e.g. Q3 Marketing Contract" />
               </div>
               <div>
                  <label className="block text-xs text-slate-400 mb-1">Client Company</label>
                  <input value={currentDeal.company} onChange={e => setCurrentDeal({...currentDeal, company: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm" />
               </div>
               <div>
                  <label className="block text-xs text-slate-400 mb-1">Value</label>
                  <input value={currentDeal.value} onChange={e => setCurrentDeal({...currentDeal, value: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm" placeholder="5,000.00" />
               </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Status</label>
                  <select value={currentDeal.status} onChange={e => setCurrentDeal({...currentDeal, status: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm">
                    <option>Pending</option>
                    <option>Under Review</option>
                    <option>On Hold</option>
                    <option>Closed-Won</option>
                    <option>Closed-Lost</option>
                  </select>
               </div>
               <div className="flex justify-end gap-3 pt-2">
                 <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 text-sm hover:text-white">Cancel</button>
                 <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded text-sm hover:bg-pink-500">Save</button>
               </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}