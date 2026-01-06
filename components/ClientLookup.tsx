import React, { useState, useEffect } from 'react';
import { useData, Client } from './DataContext';
import { motion } from 'framer-motion';

export const ClientLookup: React.FC = () => {
  const { clients, deals, updateClient } = useData();
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [showEditModal, setShowEditModal] = useState(false);
  
  // State for the edit form
  const [editingClient, setEditingClient] = useState<Partial<Client>>({});

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];

  useEffect(() => {
    if (selectedClient) {
      setEditingClient(selectedClient);
    }
  }, [selectedClient]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditingClient({ ...editingClient, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClient && editingClient.id) {
        updateClient(editingClient as Client);
        setShowEditModal(false);
    }
  };

  // Mock data specifically for the lookup view to match the screenshot layout
  // In a real app, this would filter the 'activities' and 'deals' context by ID
  const clientDeals = deals.slice(0, 3); 

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-[1400px] mx-auto p-4 space-y-4"
    >
        {/* Search Header */}
        <div className="bg-[#1e293b] p-4 rounded-lg border border-slate-700 shadow-md">
            <h1 className="text-xl font-light text-white mb-2">Client Profile Lookup</h1>
            <p className="text-xs text-slate-400 mb-4">View detailed client profiles, including contact information, recent activity, associated deals, and records.</p>
            <div className="flex items-center gap-4">
                <div className="bg-[#3b82f6] text-white text-xs font-bold px-4 py-2 rounded-l uppercase tracking-wider">
                    SELECT CLIENT CONTACT
                </div>
                <div className="flex-1 relative">
                    <select 
                        className="w-full bg-[#0f172a] text-white border border-slate-600 rounded p-2 text-sm focus:border-blue-500 outline-none appearance-none"
                        value={selectedClientId}
                        onChange={(e) => setSelectedClientId(e.target.value)}
                    >
                        {clients.map(c => (
                            <option key={c.id} value={c.id}>{c.contact} [{c.id}] - {c.company}</option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-2.5 pointer-events-none text-slate-400">▼</div>
                </div>
            </div>
        </div>

        {/* Result Area */}
        {selectedClient && (
            <motion.div 
                key={selectedClient.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-12 gap-6"
            >
                {/* Left Col: Personal & Contact */}
                <div className="col-span-12 md:col-span-6 bg-[#1e293b] border border-slate-700 rounded-lg overflow-hidden flex flex-col shadow-lg">
                    <div className="bg-[#6366f1] text-white py-2 px-4 text-sm font-bold uppercase tracking-wider">
                        Personal & Contact
                    </div>
                    <div className="p-4 space-y-0">
                        <InfoRow label="ID" value={selectedClient.id} />
                        <InfoRow label="NAME" value={selectedClient.contact} />
                        <InfoRow label="COMPANY" value={selectedClient.company} />
                        <InfoRow label="TITLE" value={selectedClient.jobTitle} />
                        <InfoRow label="EMAIL" value={selectedClient.email} highlight />
                        <InfoRow label="PHONE" value={selectedClient.phone} />
                        <InfoRow label="LOCATION" value={selectedClient.location} />
                        <InfoRow label="SOURCE" value={selectedClient.source} />
                        <InfoRow label="STATUS" value={selectedClient.status} />
                        <InfoRow label="PRIMARY REP" value={selectedClient.salesRep} />
                        <InfoRow label="NEXT CONTACT" value={selectedClient.nextContactDate} />
                    </div>
                    <div className="bg-[#334155] p-3 mt-auto">
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">NOTES</div>
                        <div className="bg-[#0f172a] p-2 rounded text-xs text-slate-300 min-h-[60px]">
                            Key client for Q3. Interested in bundled service discounts. Prefers communication via email only.
                        </div>
                    </div>
                </div>

                {/* Right Col: Activity & Deals */}
                <div className="col-span-12 md:col-span-6 space-y-6">
                    {/* Recent Activity Table */}
                    <div className="bg-[#1e293b] border border-slate-700 rounded-lg overflow-hidden shadow-lg">
                        <div className="bg-[#3b82f6] text-white py-2 px-4 text-sm font-bold uppercase tracking-wider flex justify-between">
                            <span>Activity Log</span>
                            <span className="opacity-75 text-[10px] mt-1">LAST 5 INTERACTIONS</span>
                        </div>
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#334155] text-slate-200">
                                <tr>
                                    <th className="p-2">DATE</th>
                                    <th className="p-2">METHOD</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-300">
                                <tr className="border-b border-slate-700">
                                    <td className="p-2">5/27/2025</td>
                                    <td className="p-2">Contact Form</td>
                                </tr>
                                <tr className="border-b border-slate-700">
                                    <td className="p-2">5/26/2025</td>
                                    <td className="p-2">Text Message</td>
                                </tr>
                                <tr className="border-b border-slate-700">
                                    <td className="p-2">5/20/2025</td>
                                    <td className="p-2">Meeting-In Person</td>
                                </tr>
                                <tr className="border-b border-slate-700">
                                    <td className="p-2">5/19/2025</td>
                                    <td className="p-2">Phone</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Associated Deals */}
                    <div className="bg-[#1e293b] border border-slate-700 rounded-lg overflow-hidden shadow-lg">
                         <div className="bg-[#3b82f6] text-white py-2 px-4 text-sm font-bold uppercase tracking-wider">
                            Recent Deals
                        </div>
                         <table className="w-full text-left text-xs">
                            <thead className="bg-[#334155] text-slate-200">
                                <tr>
                                    <th className="p-2">LAST UPDATED</th>
                                    <th className="p-2 text-right">VALUE</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-300">
                                {clientDeals.map((deal, idx) => (
                                    <tr key={idx} className="border-b border-slate-700">
                                        <td className="p-2">{deal.date}</td>
                                        <td className="p-2 text-right font-mono text-emerald-400">{deal.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Large Action Button */}
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowEditModal(true)}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded shadow-lg font-bold tracking-wide transition-colors"
                    >
                        EDIT CLIENT PROFILE
                    </motion.button>
                </div>
            </motion.div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1e293b] rounded-lg shadow-2xl w-full max-w-lg border border-slate-600"
          >
            <div className="flex justify-between items-center p-4 border-b border-slate-700">
              <h2 className="text-lg font-medium text-white">Edit Client Profile</h2>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Company Name</label>
                  <input required name="company" value={editingClient.company} onChange={handleEditChange} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm focus:border-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Contact Person</label>
                  <input required name="contact" value={editingClient.contact} onChange={handleEditChange} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm focus:border-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Job Title</label>
                  <input name="jobTitle" value={editingClient.jobTitle} onChange={handleEditChange} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm focus:border-indigo-500 outline-none" />
                </div>
                 <div>
                  <label className="block text-xs text-slate-400 mb-1">Phone</label>
                  <input name="phone" value={editingClient.phone} onChange={handleEditChange} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm focus:border-indigo-500 outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">Email</label>
                  <input required name="email" type="email" value={editingClient.email} onChange={handleEditChange} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm focus:border-indigo-500 outline-none" />
                </div>
                <div>
                   <label className="block text-xs text-slate-400 mb-1">Status</label>
                   <select name="status" value={editingClient.status} onChange={handleEditChange} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm focus:border-indigo-500 outline-none">
                     <option>Prospect</option>
                     <option>Cold Lead</option>
                     <option>Warm Lead</option>
                     <option>Buying</option>
                     <option>Onboarding</option>
                     <option>Inactive</option>
                   </select>
                </div>
                <div>
                   <label className="block text-xs text-slate-400 mb-1">Source</label>
                   <select name="source" value={editingClient.source} onChange={handleEditChange} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm focus:border-indigo-500 outline-none">
                     <option>Referral</option>
                     <option>LinkedIn</option>
                     <option>WebForm</option>
                     <option>Cold Outreach</option>
                     <option>Job Fair</option>
                   </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                 <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-sm text-slate-300 hover:text-white">Cancel</button>
                 <button type="submit" className="bg-[#4f46e5] hover:bg-indigo-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-indigo-500">Save Changes</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

const InfoRow = ({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) => (
    <div className="flex border-b border-slate-700/50 last:border-0 group hover:bg-slate-700/20 transition-colors">
        <div className="w-1/3 bg-[#334155]/30 p-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
            {label}
        </div>
        <div className={`w-2/3 p-2 text-xs font-medium flex items-center ${highlight ? 'text-blue-400' : 'text-slate-200'}`}>
            {value}
        </div>
    </div>
);