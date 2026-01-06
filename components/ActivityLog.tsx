import React, { useState } from 'react';
import { useData, Activity } from './DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter } from 'lucide-react';

export const ActivityLog: React.FC = () => {
  const { activities, addActivity } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    date: new Date().toLocaleDateString(), name: '', company: '', description: '', type: 'Call'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addActivity({
      id: `ACT-${Date.now()}`,
      date: newActivity.date || '',
      name: newActivity.name || '',
      company: newActivity.company || '',
      description: newActivity.description || '',
      type: newActivity.type || 'Call'
    });
    setShowAddModal(false);
    setNewActivity({ date: new Date().toLocaleDateString(), name: '', company: '', description: '', type: 'Call' });
  };

  const filteredActivities = activities.filter(item => {
    const matchesType = filterType === 'All' || item.type === filterType;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const types = ['All', 'Call', 'Email', 'Meeting', 'Contact Form', 'Text Message'];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-[1400px] mx-auto p-4 h-[calc(100vh-60px)] flex flex-col"
    >
       <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-light text-white">Activity Log</h1>
          <p className="text-sm text-slate-400">Track client interactions, calls, meetings, and emails.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium transition-colors shadow-lg shadow-blue-500/20">
          + Log New Activity
        </button>
      </div>

      {/* Tracking Tools Bar */}
      <div className="flex gap-4 mb-4 bg-[#1e293b] p-2 rounded border border-slate-700 items-center">
        <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-2.5 text-slate-400 h-4 w-4" />
            <input 
                type="text" 
                placeholder="Search interactions..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-600 rounded pl-9 pr-2 py-2 text-xs text-white focus:border-blue-500 outline-none"
            />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <Filter className="text-slate-400 h-4 w-4 ml-2" />
            {types.map(type => (
                <button 
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-colors ${
                        filterType === type 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                >
                    {type}
                </button>
            ))}
        </div>
      </div>

      <div className="bg-[#1e293b] rounded-md overflow-hidden flex-1 border border-slate-700 flex flex-col shadow-xl">
        <div className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider grid grid-cols-12 gap-2 p-3 border-b border-blue-700 sticky top-0 z-10">
           <div className="col-span-2">Date</div>
           <div className="col-span-2">Contact Name</div>
           <div className="col-span-2">Company</div>
           <div className="col-span-1">Type</div>
           <div className="col-span-5">Notes/Description</div>
        </div>
        <div className="overflow-y-auto flex-1 custom-scrollbar">
            <AnimatePresence initial={false}>
               {filteredActivities.map((item) => (
                 <motion.div 
                   key={item.id}
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   transition={{ duration: 0.3 }}
                   className="grid grid-cols-12 gap-2 p-3 border-b border-slate-700/50 hover:bg-slate-700/30 text-xs text-slate-300 items-center"
                 >
                   <div className="col-span-2 text-white">{item.date}</div>
                   <div className="col-span-2 font-medium text-slate-200">{item.name}</div>
                   <div className="col-span-2 text-slate-400">{item.company}</div>
                   <div className="col-span-1">
                     <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-[10px] border border-blue-500/30">{item.type}</span>
                   </div>
                   <div className="col-span-5 text-slate-300">{item.description}</div>
                 </motion.div>
               ))}
           </AnimatePresence>
           {filteredActivities.length === 0 && (
               <div className="p-8 text-center text-slate-500 text-sm">No activities found matching your filters.</div>
           )}
        </div>
      </div>

       {/* Add Modal */}
       {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1e293b] rounded-lg shadow-2xl w-full max-w-md border border-slate-600"
          >
            <h2 className="text-lg font-medium text-white p-4 border-b border-slate-700">Log Activity</h2>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
               <div>
                  <label className="block text-xs text-slate-400 mb-1">Date</label>
                  <input type="text" value={newActivity.date} onChange={e => setNewActivity({...newActivity, date: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm" />
               </div>
               <div>
                  <label className="block text-xs text-slate-400 mb-1">Contact Name</label>
                  <input value={newActivity.name} onChange={e => setNewActivity({...newActivity, name: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm" />
               </div>
               <div>
                  <label className="block text-xs text-slate-400 mb-1">Company</label>
                  <input value={newActivity.company} onChange={e => setNewActivity({...newActivity, company: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm" />
               </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Type</label>
                  <select value={newActivity.type} onChange={e => setNewActivity({...newActivity, type: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm">
                    <option>Call</option>
                    <option>Email</option>
                    <option>Meeting</option>
                    <option>Note</option>
                    <option>Text Message</option>
                    <option>Contact Form</option>
                  </select>
               </div>
               <div>
                  <label className="block text-xs text-slate-400 mb-1">Description</label>
                  <textarea value={newActivity.description} onChange={e => setNewActivity({...newActivity, description: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm h-24" />
               </div>
               <div className="flex justify-end gap-3 pt-2">
                 <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 text-sm hover:text-white">Cancel</button>
                 <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-500">Save</button>
               </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}