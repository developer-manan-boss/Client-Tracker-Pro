import React, { useState, useMemo } from 'react';
import { useData, Task } from './DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Clock, AlertTriangle, Pencil, Trash2, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const TaskTracker: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask } = useData();
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');

  const [currentTask, setCurrentTask] = useState<Partial<Task>>({
    dueDate: new Date().toLocaleDateString(), task: '', owner: 'David Smith', priority: 'Medium', status: 'Pending', category: 'General'
  });

  const handleEdit = (task: Task) => {
      setCurrentTask(task);
      setIsEditing(true);
      setShowModal(true);
  }

  const handleDelete = (id: string) => {
      if(confirm('Delete this task?')) {
          deleteTask(id);
      }
  }

  const openAddModal = () => {
      setCurrentTask({ dueDate: new Date().toLocaleDateString(), task: '', owner: 'David Smith', priority: 'Medium', status: 'Pending', category: 'General' });
      setIsEditing(false);
      setShowModal(true);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(isEditing && currentTask.id) {
        updateTask(currentTask as Task);
    } else {
        addTask({
            id: `TSK-${Date.now()}`,
            dueDate: currentTask.dueDate || '',
            task: currentTask.task || '',
            owner: currentTask.owner || '',
            priority: currentTask.priority || 'Medium',
            status: currentTask.status || 'Pending',
            category: currentTask.category || 'General',
            overdue: false
        });
    }
    setShowModal(false);
  };

  const filteredTasks = tasks.filter(t => statusFilter === 'All' || t.status === statusFilter);

  const pendingCount = tasks.filter(t => t.status === 'Pending').length;
  const highPriorityCount = tasks.filter(t => t.priority === 'High').length;
  const overdueCount = tasks.filter(t => t.overdue).length;

  const chartData = useMemo(() => {
    const data = { 'High': 0, 'Medium': 0, 'Low': 0 };
    tasks.forEach(t => { if(data[t.priority as keyof typeof data] !== undefined) data[t.priority as keyof typeof data]++ });
    return Object.keys(data).map(k => ({ name: k, value: data[k as keyof typeof data] }));
  }, [tasks]);

  const COLORS = { 'High': '#f97316', 'Medium': '#3b82f6', 'Low': '#10b981' };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-[1400px] mx-auto p-4 h-[calc(100vh-60px)] flex flex-col"
    >
       <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-light text-white">Task Tracker & Professional To-Do</h1>
          <p className="text-sm text-slate-400">Organize, assign, and track team tasks and priorities.</p>
        </div>
        <button onClick={openAddModal} className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded text-sm font-medium transition-colors shadow-lg shadow-teal-500/20">
          + Add New Task
        </button>
      </div>

       {/* Task Stats Bar */}
       <div className="grid grid-cols-12 gap-4 mb-4">
        <div className="col-span-12 md:col-span-8 grid grid-cols-3 gap-4">
            <div className="bg-[#1e293b] border border-slate-700 p-3 rounded flex items-center gap-3 shadow-lg">
                <div className="bg-slate-700/50 p-2 rounded text-slate-300"><Clock size={18} /></div>
                <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Pending Tasks</div>
                    <div className="text-lg font-mono text-white">{pendingCount}</div>
                </div>
            </div>
            <div className="bg-[#1e293b] border border-orange-500/30 p-3 rounded flex items-center gap-3 shadow-lg">
                <div className="bg-orange-500/20 p-2 rounded text-orange-400"><AlertTriangle size={18} /></div>
                <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">High Priority</div>
                    <div className="text-lg font-mono text-white">{highPriorityCount}</div>
                </div>
            </div>
            <div className="bg-[#1e293b] border border-red-500/30 p-3 rounded flex items-center gap-3 shadow-lg">
                <div className="bg-red-500/20 p-2 rounded text-red-400"><AlertTriangle size={18} /></div>
                <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Overdue</div>
                    <div className="text-lg font-mono text-white">{overdueCount}</div>
                </div>
            </div>
        </div>
        {/* Chart */}
        <div className="col-span-12 md:col-span-4 bg-[#1e293b] border border-slate-700 rounded p-2 flex flex-col">
             <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-1">Priority Distribution</h4>
             <div className="flex-1 h-[60px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" hide />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px'}} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
             </div>
        </div>
      </div>

       {/* Filter */}
       <div className="flex items-center gap-2 mb-2">
          <Filter size={14} className="text-slate-400" />
          <span className="text-xs text-slate-400 font-bold uppercase">Filter:</span>
          {['All', 'Pending', 'In Progress', 'Completed'].map(status => (
              <button 
                key={status} 
                onClick={() => setStatusFilter(status)}
                className={`text-[10px] px-2 py-1 rounded border transition-colors ${statusFilter === status ? 'bg-teal-600 border-teal-500 text-white' : 'bg-transparent border-slate-700 text-slate-400 hover:border-teal-500/50'}`}
              >
                  {status}
              </button>
          ))}
      </div>

      <div className="bg-[#1e293b] rounded-md overflow-hidden flex-1 border border-slate-700 flex flex-col shadow-xl">
        <div className="bg-teal-600 text-white text-[10px] font-bold uppercase tracking-wider grid grid-cols-12 gap-2 p-3 border-b border-teal-700 sticky top-0 z-10">
           <div className="col-span-4">Task Description</div>
           <div className="col-span-2">Category</div>
           <div className="col-span-2">Assigned To</div>
           <div className="col-span-2">Due Date</div>
           <div className="col-span-1">Priority</div>
           <div className="col-span-1">Action</div>
        </div>
        <div className="overflow-y-auto flex-1 custom-scrollbar">
           <AnimatePresence>
           {filteredTasks.map((item, idx) => (
             <motion.div 
               key={item.id}
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               exit={{ opacity: 0, height: 0 }}
               transition={{ duration: 0.3, delay: idx * 0.03 }}
               className="grid grid-cols-12 gap-2 p-3 border-b border-slate-700/50 hover:bg-slate-700/30 text-xs text-slate-300 items-center group"
             >
               <div className="col-span-4 font-medium text-white group-hover:text-teal-300 transition-colors flex items-center gap-2">
                   {item.status === 'Completed' ? <div className="text-teal-500 font-bold">✓</div> : null}
                   <span className={item.status === 'Completed' ? 'line-through opacity-50' : ''}>{item.task}</span>
               </div>
               <div className="col-span-2 text-slate-400">{item.category}</div>
               <div className="col-span-2 text-slate-200">{item.owner}</div>
               <div className="col-span-2">
                 {item.overdue ? <span className="text-red-400 font-bold">{item.dueDate}</span> : item.dueDate}
               </div>
               <div className="col-span-1">
                  <span className={`text-[10px] font-bold uppercase ${item.priority === 'High' ? 'text-orange-400' : 'text-slate-500'}`}>{item.priority}</span>
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
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1e293b] rounded-lg shadow-2xl w-full max-w-md border border-slate-600"
          >
            <h2 className="text-lg font-medium text-white p-4 border-b border-slate-700">{isEditing ? 'Edit Task' : 'Add Task'}</h2>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
               <div>
                  <label className="block text-xs text-slate-400 mb-1">Task Description</label>
                  <input value={currentTask.task} onChange={e => setCurrentTask({...currentTask, task: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-xs text-slate-400 mb-1">Category</label>
                      <input value={currentTask.category} onChange={e => setCurrentTask({...currentTask, category: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm" />
                   </div>
                   <div>
                      <label className="block text-xs text-slate-400 mb-1">Due Date</label>
                      <input value={currentTask.dueDate} onChange={e => setCurrentTask({...currentTask, dueDate: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm" />
                   </div>
               </div>
               <div>
                  <label className="block text-xs text-slate-400 mb-1">Assigned To</label>
                  <input value={currentTask.owner} onChange={e => setCurrentTask({...currentTask, owner: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-xs text-slate-400 mb-1">Priority</label>
                      <select value={currentTask.priority} onChange={e => setCurrentTask({...currentTask, priority: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm">
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-xs text-slate-400 mb-1">Status</label>
                      <select value={currentTask.status} onChange={e => setCurrentTask({...currentTask, status: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white text-sm">
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                        <option>Overdue</option>
                      </select>
                   </div>
               </div>
               <div className="flex justify-end gap-3 pt-2">
                 <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 text-sm hover:text-white">Cancel</button>
                 <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded text-sm hover:bg-teal-500">Save</button>
               </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}