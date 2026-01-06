import React, { useState, useMemo } from 'react';
import { useData, Invoice } from './DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, AlertCircle, CheckCircle, FilePlus, Pencil, Trash2, Filter } from 'lucide-react';
import { InvoiceGenerator } from './InvoiceGenerator';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export const InvoiceManager: React.FC = () => {
  const { invoices, addInvoice, updateInvoice, deleteInvoice } = useData();
  const [showModal, setShowModal] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');

  const [currentInvoice, setCurrentInvoice] = useState<Partial<Invoice>>({
    date: new Date().toLocaleDateString(), value: '', status: 'Pending', description: '', company: '', invoiceNumber: ''
  });

  const handleEdit = (invoice: Invoice) => {
      setCurrentInvoice(invoice);
      setIsEditing(true);
      setShowModal(true);
  }

  const handleDelete = (id: string) => {
      if(confirm('Delete this invoice log?')) {
          deleteInvoice(id);
      }
  }

  const openAddModal = () => {
      setCurrentInvoice({ date: new Date().toLocaleDateString(), value: '', status: 'Pending', description: '', company: '', invoiceNumber: '' });
      setIsEditing(false);
      setShowModal(true);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(isEditing && currentInvoice.id) {
        updateInvoice(currentInvoice as Invoice);
    } else {
        addInvoice({
            id: `INV-${Date.now()}`,
            invoiceNumber: currentInvoice.invoiceNumber || `INV-${Math.floor(Math.random()*1000)}`,
            date: currentInvoice.date || '',
            value: currentInvoice.value || '0.00',
            status: currentInvoice.status || 'Pending',
            description: currentInvoice.description || '',
            company: currentInvoice.company || ''
        });
    }
    setShowModal(false);
  };

  const filteredInvoices = invoices.filter(i => statusFilter === 'All' || i.status === statusFilter);

  // Dynamic Stats
  const stats = useMemo(() => {
    const totalPending = invoices.filter(i => i.status === 'Pending').reduce((acc, curr) => acc + parseFloat(curr.value.replace(/,/g, '')), 0);
    const totalOverdue = invoices.filter(i => i.status === 'Overdue').reduce((acc, curr) => acc + parseFloat(curr.value.replace(/,/g, '')), 0);
    const paidCount = invoices.filter(i => i.status === 'Paid').length;
    return { totalPending, totalOverdue, paidCount };
  }, [invoices]);

  // Chart Data
  const chartData = useMemo(() => {
      const counts = { Pending: 0, Paid: 0, Overdue: 0 };
      invoices.forEach(i => {
          if (counts[i.status as keyof typeof counts] !== undefined) {
              counts[i.status as keyof typeof counts]++;
          }
      });
      return Object.keys(counts).map(k => ({ name: k, value: counts[k as keyof typeof counts] }));
  }, [invoices]);

  const COLORS: Record<string, string> = { 'Pending': '#f59e0b', 'Paid': '#10b981', 'Overdue': '#ef4444' };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-[1400px] mx-auto p-4 h-[calc(100vh-60px)] flex flex-col"
    >
       <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-light text-white">Invoice Manager</h1>
          <p className="text-sm text-slate-400">Track invoices, due dates, and payment statuses.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setShowGenerator(true)} 
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20 flex items-center gap-2"
            >
                <FilePlus size={16} />
                Create Sending Invoice
            </button>
            <button onClick={openAddModal} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded text-sm font-medium transition-colors shadow-lg shadow-emerald-500/20">
            + Quick Log Invoice
            </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 mb-4">
        {/* Stats */}
        <div className="col-span-12 md:col-span-8 grid grid-cols-3 gap-4">
            <div className="bg-[#1e293b] border border-amber-500/30 p-3 rounded flex items-center gap-3 shadow-lg">
                <div className="bg-amber-500/20 p-2 rounded text-amber-400"><CreditCard size={18} /></div>
                <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Pending Amount</div>
                    <div className="text-lg font-mono text-white">${stats.totalPending.toLocaleString()}</div>
                </div>
            </div>
            <div className="bg-[#1e293b] border border-red-500/30 p-3 rounded flex items-center gap-3 shadow-lg">
                <div className="bg-red-500/20 p-2 rounded text-red-400"><AlertCircle size={18} /></div>
                <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Overdue Amount</div>
                    <div className="text-lg font-mono text-white">${stats.totalOverdue.toLocaleString()}</div>
                </div>
            </div>
            <div className="bg-[#1e293b] border border-slate-700 p-3 rounded flex items-center gap-3 shadow-lg">
                <div className="bg-emerald-500/20 p-2 rounded text-emerald-400"><CheckCircle size={18} /></div>
                <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Invoices Paid</div>
                    <div className="text-lg font-mono text-white">{stats.paidCount}</div>
                </div>
            </div>
        </div>
        {/* Chart */}
        <div className="col-span-12 md:col-span-4 bg-[#1e293b] border border-slate-700 rounded p-2 flex items-center justify-between">
            <div className="flex-1 h-full">
                <ResponsiveContainer width="100%" height={80}>
                    <PieChart>
                        <Pie data={chartData} dataKey="value" cx="50%" cy="50%" innerRadius={25} outerRadius={35} paddingAngle={5}>
                             {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />)}
                        </Pie>
                        <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '10px'}} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-1 pr-4">
                {chartData.map(d => (
                    <div key={d.name} className="flex items-center gap-2 text-[10px] text-slate-300">
                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[d.name]}}></div>
                        <span>{d.name}: {d.value}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>

       {/* Filter Bar */}
       <div className="flex items-center gap-2 mb-2">
          <Filter size={14} className="text-slate-400" />
          <span className="text-xs text-slate-400 font-bold uppercase">Filter:</span>
          {['All', 'Pending', 'Paid', 'Overdue'].map(status => (
              <button 
                key={status} 
                onClick={() => setStatusFilter(status)}
                className={`text-[10px] px-2 py-1 rounded border transition-colors ${statusFilter === status ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-transparent border-slate-700 text-slate-400 hover:border-emerald-500/50'}`}
              >
                  {status}
              </button>
          ))}
      </div>

      <div className="bg-[#1e293b] rounded-md overflow-hidden flex-1 border border-slate-700 flex flex-col shadow-xl">
        <div className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider grid grid-cols-12 gap-2 p-3 border-b border-emerald-700 sticky top-0 z-10">
           <div className="col-span-2">Invoice #</div>
           <div className="col-span-2">Due Date</div>
           <div className="col-span-3">Client Company</div>
           <div className="col-span-3">Description</div>
           <div className="col-span-1 text-right">Amount</div>
           <div className="col-span-1 text-center">Status</div>
           <div className="col-span-1 text-center">Action</div>
        </div>
        <div className="overflow-y-auto flex-1 custom-scrollbar">
           <AnimatePresence>
           {filteredInvoices.map((item, idx) => (
             <motion.div 
               key={item.id}
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, height: 0 }}
               transition={{ delay: idx * 0.05 }}
               className="grid grid-cols-12 gap-2 p-3 border-b border-slate-700/50 hover:bg-slate-700/30 text-xs text-slate-300 items-center group"
             >
               <div className="col-span-2 font-mono text-slate-400">{item.invoiceNumber}</div>
               <div className="col-span-2 text-white">{item.date}</div>
               <div className="col-span-3 font-medium text-slate-200">{item.company}</div>
               <div className="col-span-3 text-slate-400">{item.description}</div>
               <div className="col-span-1 text-right font-mono text-white">{item.value}</div>
               <div className="col-span-1 text-center">
                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    item.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                    item.status === 'Overdue' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    'bg-amber-500/20 text-amber-300 border-amber-500/30'
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

      {/* Manual Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1e293b] rounded-lg shadow-2xl w-full max-w-md border border-slate-600"
          >
            <h2 className="text-lg font-medium text-white p-4 border-b border-slate-700">{isEditing ? 'Edit Invoice Log' : 'Quick Log Invoice'}</h2>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
               <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-xs text-slate-400 mb-1">Invoice #</label>
                      <input value={currentInvoice.invoiceNumber} onChange={e => setCurrentInvoice({...currentInvoice, invoiceNumber: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm" placeholder="INV-00XX" />
                   </div>
                   <div>
                      <label className="block text-xs text-slate-400 mb-1">Due Date</label>
                      <input value={currentInvoice.date} onChange={e => setCurrentInvoice({...currentInvoice, date: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm" />
                   </div>
               </div>
               <div>
                  <label className="block text-xs text-slate-400 mb-1">Client Company</label>
                  <input value={currentInvoice.company} onChange={e => setCurrentInvoice({...currentInvoice, company: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm" />
               </div>
               <div>
                  <label className="block text-xs text-slate-400 mb-1">Description</label>
                  <input value={currentInvoice.description} onChange={e => setCurrentInvoice({...currentInvoice, description: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm" />
               </div>
               <div>
                  <label className="block text-xs text-slate-400 mb-1">Amount</label>
                  <input value={currentInvoice.value} onChange={e => setCurrentInvoice({...currentInvoice, value: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm" placeholder="0.00" />
               </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Status</label>
                  <select value={currentInvoice.status} onChange={e => setCurrentInvoice({...currentInvoice, status: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm">
                    <option>Pending</option>
                    <option>Paid</option>
                    <option>Overdue</option>
                  </select>
               </div>
               <div className="flex justify-end gap-3 pt-2">
                 <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 text-sm hover:text-white">Cancel</button>
                 <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded text-sm hover:bg-emerald-500">Save</button>
               </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Render the Generator Modal if active */}
      {showGenerator && (
          <InvoiceGenerator onClose={() => setShowGenerator(false)} />
      )}
    </motion.div>
  );
}