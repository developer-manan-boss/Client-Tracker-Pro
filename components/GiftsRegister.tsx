import React, { useState, useMemo } from 'react';
import { useData, Gift } from './DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift as GiftIcon, DollarSign, Pencil, Trash2 } from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

export const GiftsRegister: React.FC = () => {
  const { gifts, addGift, updateGift, deleteGift } = useData();
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newGift, setNewGift] = useState<Partial<Gift>>({
    date: new Date().toLocaleDateString(), client: '', recipient: '', description: '', value: '', occasion: ''
  });

  const handleEdit = (gift: Gift) => {
      setNewGift(gift);
      setIsEditing(true);
      setShowModal(true);
  }

  const handleDelete = (id: string) => {
      if(confirm('Delete this gift entry?')) {
          deleteGift(id);
      }
  }

  const openAddModal = () => {
      setNewGift({ date: new Date().toLocaleDateString(), client: '', recipient: '', description: '', value: '', occasion: '' });
      setIsEditing(false);
      setShowModal(true);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && newGift.id) {
        updateGift(newGift as Gift);
    } else {
        addGift({
            id: `GFT-${Date.now()}`,
            date: newGift.date || '',
            client: newGift.client || '',
            recipient: newGift.recipient || '',
            description: newGift.description || '',
            value: newGift.value || '',
            occasion: newGift.occasion || ''
        });
    }
    setShowModal(false);
  };

  const totalSpent = useMemo(() => gifts.reduce((acc, curr) => acc + parseFloat(curr.value.replace(/,/g, '')), 0), [gifts]);

  // Mock trend data based on gift count for visualization
  const trendData = useMemo(() => {
     return gifts.map((g, i) => ({ name: g.date, value: parseFloat(g.value) }));
  }, [gifts]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-[1400px] mx-auto p-4 h-[calc(100vh-60px)] flex flex-col"
    >
       <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-light text-white">Gifts Register</h1>
          <p className="text-sm text-slate-400">Keep a clear record of client-facing gifts and rewards.</p>
        </div>
        <button onClick={openAddModal} className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded text-sm font-medium transition-colors shadow-lg shadow-cyan-500/20">
          + Log Gift
        </button>
      </div>

      <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-12 md:col-span-4 bg-[#1e293b] border border-cyan-500/30 p-3 rounded flex items-center gap-3 shadow-lg">
                <div className="bg-cyan-500/20 p-2 rounded text-cyan-400"><DollarSign size={18} /></div>
                <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total Spent</div>
                    <div className="text-lg font-mono text-white">${totalSpent.toLocaleString()}</div>
                </div>
           </div>
           {/* Mini Sparkline Chart */}
           <div className="col-span-12 md:col-span-8 bg-[#1e293b] border border-slate-700 rounded p-2">
                <div className="h-12 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} />
                            <Area type="monotone" dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
           </div>
      </div>

      <div className="bg-[#1e293b] rounded-md overflow-hidden flex-1 border border-slate-700 flex flex-col shadow-xl">
        <div className="bg-cyan-600 text-white text-[10px] font-bold uppercase tracking-wider grid grid-cols-12 gap-2 p-3 border-b border-cyan-700 sticky top-0 z-10">
           <div className="col-span-2">Date Given</div>
           <div className="col-span-3">Client Company</div>
           <div className="col-span-2">Recipient</div>
           <div className="col-span-3">Gift Description</div>
           <div className="col-span-1">Occasion</div>
           <div className="col-span-1 text-right">Action</div>
        </div>
        <div className="overflow-y-auto flex-1 custom-scrollbar">
           <AnimatePresence>
           {gifts.map((item, idx) => (
             <motion.div 
               key={item.id}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, height: 0 }}
               transition={{ delay: idx * 0.05 }}
               className="grid grid-cols-12 gap-2 p-3 border-b border-slate-700/50 hover:bg-slate-700/30 text-xs text-slate-300 items-center group"
             >
               <div className="col-span-2 text-white">{item.date}</div>
               <div className="col-span-3 font-medium text-slate-200">{item.client}</div>
               <div className="col-span-2 text-slate-400">{item.recipient}</div>
               <div className="col-span-3 text-slate-300">
                   <div>{item.description}</div>
                   <div className="text-[10px] text-emerald-400 font-mono">${item.value}</div>
               </div>
               <div className="col-span-1 text-slate-400 italic">{item.occasion}</div>
               <div className="col-span-1 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-[#1e293b] rounded-lg shadow-2xl w-full max-w-md border border-slate-600"
          >
            <h2 className="text-lg font-medium text-white p-4 border-b border-slate-700">{isEditing ? 'Edit Gift Log' : 'Log Client Gift'}</h2>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
               <div>
                  <label className="block text-xs text-slate-400 mb-1">Date</label>
                  <input value={newGift.date} onChange={e => setNewGift({...newGift, date: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm" />
               </div>
               <div>
                  <label className="block text-xs text-slate-400 mb-1">Client Company</label>
                  <input value={newGift.client} onChange={e => setNewGift({...newGift, client: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm" />
               </div>
               <div>
                  <label className="block text-xs text-slate-400 mb-1">Recipient Name</label>
                  <input value={newGift.recipient} onChange={e => setNewGift({...newGift, recipient: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm" />
               </div>
               <div>
                  <label className="block text-xs text-slate-400 mb-1">Gift Description</label>
                  <input value={newGift.description} onChange={e => setNewGift({...newGift, description: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-xs text-slate-400 mb-1">Occasion</label>
                      <input value={newGift.occasion} onChange={e => setNewGift({...newGift, occasion: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm" />
                   </div>
                   <div>
                      <label className="block text-xs text-slate-400 mb-1">Value ($)</label>
                      <input value={newGift.value} onChange={e => setNewGift({...newGift, value: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm" />
                   </div>
               </div>
               <div className="flex justify-end gap-3 pt-2">
                 <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 text-sm hover:text-white">Cancel</button>
                 <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded text-sm hover:bg-cyan-500">Save</button>
               </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}