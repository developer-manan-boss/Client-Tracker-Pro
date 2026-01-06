import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { ClientList } from './components/ClientList';
import { ClientLookup } from './components/ClientLookup';
import { ActivityLog } from './components/ActivityLog';
import { DealsTracker } from './components/DealsTracker';
import { InvoiceManager } from './components/InvoiceManager';
import { TaskTracker } from './components/TaskTracker';
import { GiftsRegister } from './components/GiftsRegister';
import { Settings } from './components/Settings';
import { DataProvider } from './components/DataContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Lock, ShieldCheck } from 'lucide-react';

type Tab = 'dashboard' | 'client-list' | 'client-lookup' | 'activity' | 'deals' | 'invoices' | 'tasks' | 'gifts' | 'settings';

// --- SECURITY CONFIGURATION ---
// In a real production app, this should be in an environment variable.
const ACCESS_KEY = "admin123"; 

function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState('');

  // Check if already logged in this session
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('crm_auth_token');
    if (sessionAuth === ACCESS_KEY) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey === ACCESS_KEY) {
      setIsAuthenticated(true);
      sessionStorage.setItem('crm_auth_token', ACCESS_KEY); // Keep logged in until browser close
      setError('');
    } else {
      setError('Invalid Access Key. Access Denied.');
      setInputKey('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#1e293b] p-8 rounded-lg shadow-2xl border border-slate-700 w-full max-w-md text-center"
        >
           <div className="bg-indigo-500/20 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 border border-indigo-500/50">
             <Lock className="text-indigo-400" size={40} />
           </div>
           <h1 className="text-2xl font-light text-white mb-2">Secure Access Gateway</h1>
           <p className="text-slate-400 text-sm mb-8">This system is protected. Please enter your authorized access key to continue.</p>
           
           <form onSubmit={handleLogin} className="space-y-4">
             <input 
               type="password" 
               value={inputKey}
               onChange={(e) => setInputKey(e.target.value)}
               className="w-full bg-[#0f172a] border border-slate-600 rounded px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-center tracking-widest"
               placeholder="ENTER ACCESS KEY"
             />
             {error && <div className="text-red-400 text-xs font-bold">{error}</div>}
             <button 
               type="submit"
               className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded shadow-lg transition-colors flex items-center justify-center gap-2"
             >
               <ShieldCheck size={18} />
               AUTHENTICATE
             </button>
           </form>
           <div className="mt-6 text-[10px] text-slate-600 uppercase tracking-widest">
             Authorized Personnel Only
           </div>
        </motion.div>
      </div>
    );
  }

  return (
    <DataProvider>
      <div className="min-h-screen bg-[#0f172a] text-white selection:bg-indigo-500 selection:text-white flex flex-col font-sans">
        {/* Top Navigation Bar */}
        <nav className="bg-[#1e293b] border-b border-slate-700 sticky top-0 z-50 shadow-lg">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex items-center h-16 gap-8 overflow-x-auto no-scrollbar">
              <div className="font-bold text-xl tracking-tight text-white flex items-center gap-2 flex-shrink-0">
                 <div className="w-7 h-7 bg-indigo-500 rounded flex items-center justify-center text-sm shadow-indigo-500/20 shadow-lg">P</div>
                 <span className="hidden sm:inline">ClientTrackerPro</span>
              </div>
              <div className="flex h-full gap-1">
                <NavButton label="Dashboard" active={currentTab === 'dashboard'} onClick={() => setCurrentTab('dashboard')} />
                <NavButton label="Client List" active={currentTab === 'client-list'} onClick={() => setCurrentTab('client-list')} />
                <NavButton label="Lookup" active={currentTab === 'client-lookup'} onClick={() => setCurrentTab('client-lookup')} />
                <NavButton label="Activities" active={currentTab === 'activity'} onClick={() => setCurrentTab('activity')} />
                <NavButton label="Deals" active={currentTab === 'deals'} onClick={() => setCurrentTab('deals')} />
                <NavButton label="Invoices" active={currentTab === 'invoices'} onClick={() => setCurrentTab('invoices')} />
                <NavButton label="Tasks" active={currentTab === 'tasks'} onClick={() => setCurrentTab('tasks')} />
                <NavButton label="Gifts" active={currentTab === 'gifts'} onClick={() => setCurrentTab('gifts')} />
                <NavButton label="Settings" active={currentTab === 'settings'} onClick={() => setCurrentTab('settings')} />
              </div>
              <div className="ml-auto">
                 <button 
                    onClick={() => { setIsAuthenticated(false); sessionStorage.removeItem('crm_auth_token'); }}
                    className="text-xs text-red-400 hover:text-red-300 font-bold uppercase tracking-wider border border-red-500/30 px-3 py-1 rounded"
                 >
                    Logout
                 </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto bg-[#0f172a]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                >
                  {currentTab === 'dashboard' && <Dashboard />}
                  {currentTab === 'client-list' && <ClientList />}
                  {currentTab === 'client-lookup' && <ClientLookup />}
                  {currentTab === 'activity' && <ActivityLog />}
                  {currentTab === 'deals' && <DealsTracker />}
                  {currentTab === 'invoices' && <InvoiceManager />}
                  {currentTab === 'tasks' && <TaskTracker />}
                  {currentTab === 'gifts' && <GiftsRegister />}
                  {currentTab === 'settings' && <Settings />}
                </motion.div>
            </AnimatePresence>
        </div>
      </div>
    </DataProvider>
  );
}

const NavButton = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`h-full px-3 text-[13px] font-medium transition-all border-b-2 flex items-center whitespace-nowrap relative overflow-hidden ${
      active 
        ? 'border-indigo-500 text-white bg-slate-800/50 shadow-[inset_0_-2px_10px_rgba(99,102,241,0.1)]' 
        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
    }`}
  >
    {label}
    {active && (
        <motion.div 
            layoutId="activeTabIndicator"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" 
        />
    )}
  </button>
);

export default App;