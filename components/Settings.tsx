import React, { useRef, useState } from 'react';
import { useData } from './DataContext';
import { motion } from 'framer-motion';
import { Upload, Settings as SettingsIcon, Database, AlertCircle, FileSpreadsheet } from 'lucide-react';

export const Settings: React.FC = () => {
  const { settings, updateSettings, clients, activities, deals, tasks, invoices, gifts } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSettings({ ...settings, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper to parse currency strings "$1,200.00" -> 1200.00
  const parseCurrency = (val: string | number | undefined) => {
    if (!val) return 0;
    return parseFloat(val.toString().replace(/[^0-9.-]+/g, ""));
  };

  const handleExportBackup = async () => {
    setIsExporting(true);
    try {
        console.log("Starting comprehensive export...");
        
        // Dynamic import for performance/reliability
        const xlsxModule = await import('xlsx');
        // @ts-ignore
        const XLSX = xlsxModule.default || xlsxModule;

        if (!XLSX.utils || !XLSX.writeFile) {
            throw new Error("XLSX library loaded but functions are missing.");
        }
        
        const wb = XLSX.utils.book_new();

        // --- SHEET 1: EXECUTIVE SUMMARY (DASHBOARD SNAPSHOT) ---
        // Calculate totals for the summary sheet
        const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + parseCurrency(i.value), 0);
        const outstandingRevenue = invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue').reduce((sum, i) => sum + parseCurrency(i.value), 0);
        const pipelineValue = deals.reduce((sum, d) => sum + parseCurrency(d.value), 0);
        const totalGiftsValue = gifts.reduce((sum, g) => sum + parseCurrency(g.value), 0);
        const openTasks = tasks.filter(t => t.status !== 'Completed').length;

        const summaryData = [
            { "Category": "DATA GENERATED ON", "Value": new Date().toLocaleString() },
            { "Category": "Total Clients", "Value": clients.length },
            { "Category": "Total Revenue Collected (Paid Invoices)", "Value": totalRevenue },
            { "Category": "Outstanding Payments (Pending/Overdue)", "Value": outstandingRevenue },
            { "Category": "Total Sales Pipeline Value", "Value": pipelineValue },
            { "Category": "Total Spending on Gifts", "Value": totalGiftsValue },
            { "Category": "Active Open Tasks", "Value": openTasks },
            { "Category": "Total Recorded Activities", "Value": activities.length },
        ];
        const wsSummary = XLSX.utils.json_to_sheet(summaryData);
        // Adjust column width
        wsSummary['!cols'] = [{ wch: 40 }, { wch: 20 }];
        XLSX.utils.book_append_sheet(wb, wsSummary, "Dashboard Summary");


        // --- SHEET 2: INVOICE FINANCE LOG (Detailed) ---
        const cleanInvoices = invoices.map(i => ({
            "Invoice Number": i.invoiceNumber,
            "Date Issued": i.date || '',
            "Client Company": i.company || '',
            "Description of Work": i.description || '',
            "Status": i.status || '',
            "Amount ($)": parseCurrency(i.value), // Number format for Excel Sums
            "Payment Status": i.status === 'Paid' ? 'RECEIVED' : 'NOT RECEIVED'
        }));
        const wsInvoices = XLSX.utils.json_to_sheet(cleanInvoices);
        wsInvoices['!cols'] = [{ wch: 15 }, { wch: 12 }, { wch: 25 }, { wch: 40 }, { wch: 10 }, { wch: 12 }, { wch: 15 }];
        XLSX.utils.book_append_sheet(wb, wsInvoices, "Invoices & Finance");


        // --- SHEET 3: CLIENT MASTER LIST ---
        const cleanClients = clients.map(c => ({
            "Client ID": c.id,
            "Company Name": c.company || '',
            "Primary Contact": c.contact || '',
            "Job Title": c.jobTitle || '',
            "Email Address": c.email || '',
            "Phone Number": c.phone || '',
            "Client Status": c.status || '',
            "Acquisition Source": c.source || '',
            "Sales Rep": c.salesRep || '',
            "Location": c.location || '',
            "Next Scheduled Contact": c.nextContactDate || ''
        }));
        const wsClients = XLSX.utils.json_to_sheet(cleanClients);
        wsClients['!cols'] = [{ wch: 10 }, { wch: 25 }, { wch: 20 }, { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 12 }];
        XLSX.utils.book_append_sheet(wb, wsClients, "Client Database");


        // --- SHEET 4: DEALS & PIPELINE ---
        const cleanDeals = deals.map(d => ({
            "Deal ID": d.id,
            "Last Updated": d.date || '',
            "Deal Name / Description": d.description || '',
            "Client": d.company || '',
            "Pipeline Stage": d.status || '',
            "Deal Value ($)": parseCurrency(d.value)
        }));
        const wsDeals = XLSX.utils.json_to_sheet(cleanDeals);
        wsDeals['!cols'] = [{ wch: 10 }, { wch: 12 }, { wch: 35 }, { wch: 25 }, { wch: 15 }, { wch: 15 }];
        XLSX.utils.book_append_sheet(wb, wsDeals, "Sales Pipeline");


        // --- SHEET 5: TASKS & FUTURE WORKINGS ---
        const cleanTasks = tasks.map(t => ({
            "Task Description": t.task || '',
            "Category": t.category || '',
            "Assigned To": t.owner || '',
            "Due Date": t.dueDate || '',
            "Priority Level": t.priority || '',
            "Current Status": t.status || '',
            "Overdue Alert": t.overdue ? "YES - OVERDUE" : ""
        }));
        const wsTasks = XLSX.utils.json_to_sheet(cleanTasks);
        wsTasks['!cols'] = [{ wch: 40 }, { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 15 }];
        XLSX.utils.book_append_sheet(wb, wsTasks, "Tasks & To-Do");


        // --- SHEET 6: GIFTS & HOSPITALITY ---
        const cleanGifts = gifts.map(g => ({
            "Date Given": g.date || '',
            "Client Company": g.client || '',
            "Recipient Name": g.recipient || '',
            "Gift Item": g.description || '',
            "Occasion": g.occasion || '',
            "Cost / Value ($)": parseCurrency(g.value)
        }));
        const wsGifts = XLSX.utils.json_to_sheet(cleanGifts);
        wsGifts['!cols'] = [{ wch: 12 }, { wch: 25 }, { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 15 }];
        XLSX.utils.book_append_sheet(wb, wsGifts, "Gifts Register");


        // --- SHEET 7: FULL ACTIVITY LOG ---
        const cleanActivities = activities.map(a => ({
            "Date": a.date || '',
            "Interaction Type": a.type || '',
            "Contact Name": a.name || '',
            "Company": a.company || '',
            "Detailed Notes": a.description || ''
        }));
        const wsActivities = XLSX.utils.json_to_sheet(cleanActivities);
        wsActivities['!cols'] = [{ wch: 12 }, { wch: 15 }, { wch: 20 }, { wch: 25 }, { wch: 60 }];
        XLSX.utils.book_append_sheet(wb, wsActivities, "Activity Log");


        // Generate filename with date
        const dateStr = new Date().toISOString().split('T')[0];
        const fileName = `CRM_FULL_BACKUP_${dateStr}.xlsx`;

        // Force download
        XLSX.writeFile(wb, fileName);
        console.log("Detailed Export complete.");
        
    } catch (error) {
        console.error("Export failed", error);
        alert(`Export failed: ${(error as Error).message}.`);
    } finally {
        setIsExporting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-[1400px] mx-auto p-4 flex flex-col items-center"
    >
        <div className="w-full max-w-2xl bg-[#1e293b] rounded-lg border border-slate-700 shadow-xl p-8">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-700 pb-4">
                <div className="bg-indigo-600 p-2 rounded-lg text-white">
                    <SettingsIcon size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-light text-white">System Settings</h1>
                    <p className="text-sm text-slate-400">Manage branding and backup your data.</p>
                </div>
            </div>

            <div className="space-y-8">
                
                {/* Section 1: Data Management */}
                <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-5">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Database size={16} className="text-emerald-400" />
                        Data Management & Backup
                    </h3>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-xs text-slate-400 flex-1">
                            <p className="mb-2"><strong className="text-slate-200">Local Storage Status:</strong> Your data is saved automatically in your browser.</p>
                            <p className="flex items-start gap-2">
                                <AlertCircle size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                                <span>Risk Prevention: It is highly recommended to download an Excel backup regularly to prevent data loss if browser cache is cleared.</span>
                            </p>
                        </div>
                        <button 
                            onClick={handleExportBackup}
                            disabled={isExporting}
                            className={`flex items-center gap-2 px-6 py-3 rounded shadow-lg font-bold transition-all text-sm whitespace-nowrap
                                ${isExporting 
                                    ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-emerald-500/20'
                                }`}
                        >
                            {isExporting ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    <FileSpreadsheet size={18} />
                                    Download Full Excel Backup
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Section 2: Branding */}
                <div className="space-y-6 pt-4 border-t border-slate-700">
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Branding & details</h3>
                        <label className="block text-sm font-medium text-slate-300 mb-2 uppercase tracking-wide">Dashboard Header Title</label>
                        <input name="dashboardTitle" value={settings.dashboardTitle} onChange={handleChange} className="w-full bg-[#0f172a] border border-slate-600 rounded p-3 text-white focus:border-indigo-500 outline-none transition-colors" placeholder="e.g. ABC Consulting Dashboard" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2 uppercase tracking-wide">Business Logo</label>
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-600 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-slate-700/50 transition-all h-40 bg-slate-800/50"
                        >
                            {settings.logo ? (
                                <div className="relative w-full h-full flex items-center justify-center group">
                                    <img src={settings.logo} alt="Logo" className="max-h-full object-contain" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                                        <span className="text-white text-xs font-bold">CHANGE LOGO</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                <Upload className="text-slate-400 mb-2" size={32} />
                                <span className="text-sm text-slate-300 font-medium">Upload Business Logo</span>
                                <span className="text-xs text-slate-500 mt-1">PNG, JPG recommended</span>
                                </>
                            )}
                            <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleLogoUpload} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-slate-400 mb-1 uppercase font-bold tracking-wider">Company Name (For Invoices)</label>
                            <input name="companyName" value={settings.companyName} onChange={handleChange} className="w-full bg-[#0f172a] border border-slate-600 rounded p-3 text-white focus:border-indigo-500 outline-none transition-colors" placeholder="e.g. Acme Corp" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1 uppercase font-bold tracking-wider">Address Line 1</label>
                            <input name="address" value={settings.address} onChange={handleChange} className="w-full bg-[#0f172a] border border-slate-600 rounded p-3 text-white focus:border-indigo-500 outline-none transition-colors" placeholder="123 Business Rd" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1 uppercase font-bold tracking-wider">City, State Zip</label>
                                <input name="cityStateZip" value={settings.cityStateZip} onChange={handleChange} className="w-full bg-[#0f172a] border border-slate-600 rounded p-3 text-white focus:border-indigo-500 outline-none transition-colors" placeholder="New York, NY 10012" />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1 uppercase font-bold tracking-wider">Country</label>
                                <input name="country" value={settings.country} onChange={handleChange} className="w-full bg-[#0f172a] border border-slate-600 rounded p-3 text-white focus:border-indigo-500 outline-none transition-colors" placeholder="USA" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-700">
                    <p className="text-xs text-emerald-400 italic flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block"></span>
                        All changes are saved automatically.
                    </p>
                </div>
            </div>
        </div>
    </motion.div>
  );
};