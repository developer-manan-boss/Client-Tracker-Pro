import React, { useState } from 'react';
import { useData, Client } from './DataContext';
import { Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ClientList: React.FC = () => {
  const { clients, addClient, deleteClient } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form State
  const [newClient, setNewClient] = useState<Partial<Client>>({
    company: '', contact: '', jobTitle: '', email: '', phone: '', location: '', source: 'Referral', status: 'Prospect', salesRep: 'David Smith'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClient.company && newClient.contact) {
      addClient({
        id: `ID-${String(clients.length + 1).padStart(4, '0')}`,
        company: newClient.company || '',
        contact: newClient.contact || '',
        jobTitle: newClient.jobTitle || '',
        email: newClient.email || '',
        phone: newClient.phone || '',
        location: newClient.location || '',
        source: newClient.source || 'Referral',
        status: newClient.status || 'Prospect',
        salesRep: newClient.salesRep || 'David Smith',
        nextContactDate: '6/20/2025' 
      });
      setShowAddModal(false);
      setNewClient({ company: '', contact: '', jobTitle: '', email: '', phone: '', location: '', source: 'Referral', status: 'Prospect', salesRep: 'David Smith' });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[1400px] mx-auto p-4 h-[calc(100vh-60px)] flex flex-col"
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-light text-white">Client List</h1>
          <p className="text-sm text-slate-400">Manage your central list of client details</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#4f46e5] hover:bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
        >
          + Add New Client
        </button>
      </div>

      <div className="bg-[#1e293b] rounded-md overflow-hidden flex-1 border border-slate-700 flex flex-col shadow-xl">
        {/* Table Header */}
        <div className="bg-[#334155] text-white text-[10px] font-bold uppercase tracking-wider grid grid-cols-12 gap-2 p-3 border-b border-slate-600 sticky top-0 z-10">
           <div className="col-span-1">Unique ID</div>
           <div className="col-span-2">Client Company</div>
           <div className="col-span-2">Contact</div>
           <div className="col-span-2">Email</div>
           <div className="col-span-1">Phone</div>
           <div className="col-span-1">Status</div>
           <div className="col-span-1">Source</div>
           <div className="col-span-1">Sales Rep</div>
           <div className="col-span-1 text-center">Action</div>
        </div>

        {/* Table Body */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          <AnimatePresence>
          {clients.map((client, idx) => (
            <motion.div 
              key={client.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="grid grid-cols-12 gap-2 p-3 border-b border-slate-700/50 hover:bg-slate-700/30 text-xs text-slate-300 items-center group"
            >
              <div className="col-span-1 font-mono text-slate-400">{client.id}</div>
              <div className="col-span-2 font-medium text-white truncate">{client.company}</div>
              <div className="col-span-2">
                <div className="text-white">{client.contact}</div>
                <div className="text-[9px] text-slate-500">{client.jobTitle}</div>
              </div>
              <div className="col-span-2 truncate text-blue-400 group-hover:underline cursor-pointer">{client.email}</div>
              <div className="col-span-1">{client.phone}</div>
              <div className="col-span-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold 
                    ${client.status === 'Prospect' ? 'bg-indigo-500/20 text-indigo-300' : 
                      client.status === 'Cold Lead' ? 'bg-slate-600/30 text-slate-400' :
                      client.status === 'Buying' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {client.status}
                </span>
              </div>
              <div className="col-span-1 text-[10px]">{client.source}</div>
              <div className="col-span-1">{client.salesRep}</div>
              <div className="col-span-1 flex justify-center">
                <button 
                    onClick={() => {
                        if(window.confirm(`Are you sure you want to delete ${client.company}?`)) {
                            deleteClient(client.id);
                        }
                    }}
                    className="text-slate-500 hover:text-red-400 transition-colors p-1"
                >
                    <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1e293b] rounded-lg shadow-2xl w-full max-w-lg border border-slate-600"
          >
            <div className="flex justify-between items-center p-4 border-b border-slate-700">
              <h2 className="text-lg font-medium text-white">Add New Client</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Company Name</label>
                  <input required name="company" value={newClient.company} onChange={handleInputChange} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm focus:border-indigo-500 outline-none" placeholder="Acme Corp" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Contact Person</label>
                  <input required name="contact" value={newClient.contact} onChange={handleInputChange} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm focus:border-indigo-500 outline-none" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Job Title</label>
                  <input name="jobTitle" value={newClient.jobTitle} onChange={handleInputChange} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm focus:border-indigo-500 outline-none" />
                </div>
                 <div>
                  <label className="block text-xs text-slate-400 mb-1">Phone</label>
                  <input name="phone" value={newClient.phone} onChange={handleInputChange} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm focus:border-indigo-500 outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">Email</label>
                  <input required name="email" type="email" value={newClient.email} onChange={handleInputChange} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm focus:border-indigo-500 outline-none" />
                </div>
                <div>
                   <label className="block text-xs text-slate-400 mb-1">Status</label>
                   <select name="status" value={newClient.status} onChange={handleInputChange} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm focus:border-indigo-500 outline-none">
                     <option>Prospect</option>
                     <option>Cold Lead</option>
                     <option>Warm Lead</option>
                     <option>Buying</option>
                     <option>Onboarding</option>
                   </select>
                </div>
                <div>
                   <label className="block text-xs text-slate-400 mb-1">Source</label>
                   <select name="source" value={newClient.source} onChange={handleInputChange} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm focus:border-indigo-500 outline-none">
                     <option>Referral</option>
                     <option>LinkedIn</option>
                     <option>WebForm</option>
                     <option>Cold Outreach</option>
                   </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                 <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm text-slate-300 hover:text-white">Cancel</button>
                 <button type="submit" className="bg-[#4f46e5] hover:bg-indigo-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-indigo-500">Add Client</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};