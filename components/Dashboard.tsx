import React from 'react';
import { StatCard, SalesRepCard } from './StatCard';
import { HorizontalBarChart, DonutChart, ChartLegend } from './Charts';
import { RecentActivityTable, UpcomingTasksTable, RecentDealsTable, UpcomingInvoicesTable } from './Tables';
import { useData } from './DataContext';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
    clientStatusData, 
    clientActivityData, 
    clientSourceData, 
    dealStatusData, 
    activeTaskStatusData, 
    invoiceStatusData,
} from '../data';

// Updated FilterDropdown with the requested Light Purple color
const FilterDropdown = ({ label }: { label: string }) => (
    <motion.div 
        whileHover={{ scale: 1.02 }}
        className="flex-1 min-w-[150px]"
    >
        <div className="bg-[#8b5cf6] text-white text-[10px] font-bold px-2 py-1.5 rounded-t uppercase tracking-wider text-center shadow-sm">
            {label}
        </div>
        <div className="bg-[#1e293b] text-white text-xs px-3 py-2 rounded-b flex justify-between items-center cursor-pointer border-t border-indigo-700/30 hover:bg-slate-700 transition-colors">
            <span className="text-slate-200">All</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    </motion.div>
);

const ChartCard = ({ title, children, legendItems }: { title: string; children?: React.ReactNode; legendItems?: any[] }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#1e293b] rounded flex flex-col p-2 h-full shadow-lg border border-slate-700/50 hover:border-slate-600 transition-colors"
    >
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-2">{title}</h3>
        <div className="flex-1 flex flex-col justify-center relative">
            {children}
        </div>
        {legendItems && <ChartLegend items={legendItems} />}
    </motion.div>
);

// New Trend Data Mock
const growthData = [
    { name: 'Jan', clients: 4 },
    { name: 'Feb', clients: 7 },
    { name: 'Mar', clients: 9 },
    { name: 'Apr', clients: 12 },
    { name: 'May', clients: 15 },
    { name: 'Jun', clients: 18 },
];

export const Dashboard: React.FC = () => {
    const { clients, activities, tasks, deals, invoices, settings } = useData();
    const totalClients = clients.length;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };
    
    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-[1400px] mx-auto p-4 space-y-4"
        >
            {/* Header */}
            <motion.header variants={itemVariants} className="flex justify-between items-end pb-2 border-b border-slate-700 mb-4">
                <h1 className="text-2xl font-light tracking-wide text-white">{settings.dashboardTitle}</h1>
                <div className="text-sm text-slate-400 font-medium">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </motion.header>

            {/* Filters */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-6">
                <FilterDropdown label="Filter By Company" />
                <FilterDropdown label="Filter By Sales Rep" />
                <FilterDropdown label="Filter By Product/Service" />
                <FilterDropdown label="Filter By Client Status" />
            </motion.div>

            {/* KPIs */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-6">
                <StatCard label="TOTAL CLIENTS" value={totalClients} />
                <StatCard label="ACTIVITIES LAST 7 DAYS" value={activities.length} />
                <StatCard label="ACTIVITIES LAST 30 DAYS" value={activities.length + 5} />
                <StatCard label="ACTIVE DEALS" value={deals.filter(d => d.status !== 'Closed-Won' && d.status !== 'Closed-Lost').length} />
                <StatCard label="CLOSED-WON DEALS" value={deals.filter(d => d.status === 'Closed-Won').length} />
                <StatCard label="CLOSED-LOST DEALS" value={deals.filter(d => d.status === 'Closed-Lost').length} />
                <SalesRepCard />
            </motion.div>

            {/* NEW: Growth & Targets Section - Easy Tracking Enhancements */}
            <motion.div variants={itemVariants} className="grid grid-cols-12 gap-4 mb-2">
                 <div className="col-span-12 md:col-span-8 bg-[#1e293b] p-3 rounded border border-slate-700/50 shadow-lg">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Client Acquisition Trend</h3>
                    <div className="h-40 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={growthData}>
                                <defs>
                                    <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{backgroundColor: '#1e293b', borderColor: '#475569', color: '#fff'}} itemStyle={{color: '#fff'}} />
                                <Area type="monotone" dataKey="clients" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorClients)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                 </div>
                 <div className="col-span-12 md:col-span-4 bg-[#1e293b] p-3 rounded border border-slate-700/50 shadow-lg flex flex-col items-center justify-center">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Revenue vs Target</h3>
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="56" stroke="#334155" strokeWidth="12" fill="transparent" />
                            <motion.circle 
                                initial={{ strokeDasharray: "351.86", strokeDashoffset: "351.86" }}
                                animate={{ strokeDashoffset: "87.96" }} // 75%
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                cx="64" cy="64" r="56" 
                                stroke="#34d399" 
                                strokeWidth="12" 
                                fill="transparent" 
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-2xl font-bold text-white">75%</span>
                            <span className="text-[9px] text-slate-400">ACHIEVED</span>
                        </div>
                    </div>
                 </div>
            </motion.div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-12 gap-4">
                {/* Left Column - Charts */}
                <div className="col-span-12 lg:col-span-3 space-y-4 flex flex-col">
                    <div className="flex-1 min-h-[250px]">
                        <ChartCard title="Client Status">
                            <HorizontalBarChart data={clientStatusData} color="#2dd4bf" />
                        </ChartCard>
                    </div>
                    <div className="flex-1 min-h-[250px]">
                        <ChartCard title="Client Source" legendItems={clientSourceData.map(d => ({ label: d.name, color: d.fill }))}>
                            <DonutChart data={clientSourceData} />
                        </ChartCard>
                    </div>
                     <div className="flex-1 min-h-[250px]">
                        <ChartCard title="Active Task Status">
                            <HorizontalBarChart data={activeTaskStatusData} color="#60a5fa" />
                        </ChartCard>
                    </div>
                </div>

                {/* Middle Column - Charts */}
                <div className="col-span-12 lg:col-span-3 space-y-4 flex flex-col">
                     <div className="flex-1 min-h-[250px]">
                        <ChartCard title="Client Activity">
                            <HorizontalBarChart data={clientActivityData} color="#60a5fa" />
                        </ChartCard>
                    </div>
                    <div className="flex-1 min-h-[250px]">
                        <ChartCard title="Deal Status" legendItems={dealStatusData.map(d => ({ label: d.name, color: d.fill }))}>
                            <DonutChart data={dealStatusData} />
                        </ChartCard>
                    </div>
                     <div className="flex-1 min-h-[250px]">
                        <ChartCard title="Invoice Status">
                            <HorizontalBarChart data={invoiceStatusData} color="#f472b6" />
                        </ChartCard>
                    </div>
                </div>

                {/* Right Column - Tables */}
                <div className="col-span-12 lg:col-span-6 space-y-4 flex flex-col">
                    <motion.div variants={itemVariants} className="flex-1 min-h-[250px]">
                        <RecentActivityTable data={activities.slice(0, 5)} />
                    </motion.div>
                     <motion.div variants={itemVariants} className="flex-1 min-h-[250px]">
                        <UpcomingTasksTable data={tasks.slice(0, 5)} />
                    </motion.div>
                     <motion.div variants={itemVariants} className="flex-1 min-h-[250px]">
                        <RecentDealsTable data={deals.slice(0, 5)} />
                    </motion.div>
                     <motion.div variants={itemVariants} className="flex-1 min-h-[250px]">
                        <UpcomingInvoicesTable data={invoices.slice(0, 5)} />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};
