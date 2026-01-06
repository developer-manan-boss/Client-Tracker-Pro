import React from 'react';

// Common header style
const SectionHeader = ({ title }: { title: string }) => (
  <div className="bg-[#4f46e5] text-white py-1 px-3 text-xs font-bold uppercase tracking-wide">
    {title}
  </div>
);

// --- Recent Activity Table ---
export const RecentActivityTable = ({ data }: { data: any[] }) => {
  return (
    <div className="flex flex-col h-full bg-[#1e293b] rounded overflow-hidden">
      <SectionHeader title="Recent Activity" />
      <div className="overflow-auto custom-scrollbar flex-1 p-2">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#334155] text-xs text-white sticky top-0">
            <tr>
              <th className="py-2 px-2 font-semibold">DATE</th>
              <th className="py-2 px-2 font-semibold">NAME / COMPANY</th>
              <th className="py-2 px-2 font-semibold">NOTE</th>
            </tr>
          </thead>
          <tbody className="text-[10px] text-slate-300">
            {data.map((item, idx) => (
              <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/50">
                <td className="py-2 px-2 align-top whitespace-nowrap">{item.date}</td>
                <td className="py-2 px-2 align-top">
                  <div className="font-bold text-white">{item.name}</div>
                  <div className="text-slate-400 text-[9px]">{item.company}</div>
                </td>
                <td className="py-2 px-2 align-top leading-tight">{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Upcoming Tasks Table ---
export const UpcomingTasksTable = ({ data }: { data: any[] }) => {
  return (
    <div className="flex flex-col h-full bg-[#1e293b] rounded overflow-hidden">
      <SectionHeader title="Upcoming Tasks" />
      <div className="overflow-auto custom-scrollbar flex-1 p-2">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#334155] text-xs text-white sticky top-0">
            <tr>
              <th className="py-2 px-2 font-semibold">DUE DATE</th>
              <th className="py-2 px-2 font-semibold">CATEGORY</th>
              <th className="py-2 px-2 font-semibold">OWNER</th>
              <th className="py-2 px-2 font-semibold">TASK</th>
            </tr>
          </thead>
          <tbody className="text-[10px] text-slate-300">
            {data.map((item, idx) => (
              <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/50">
                <td className="py-2 px-2 align-top">
                    {item.overdue ? (
                        <span className="bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded text-[9px] font-bold border border-red-500/50">
                            {item.dueDate}
                        </span>
                    ) : (
                        item.dueDate
                    )}
                </td>
                <td className="py-2 px-2 align-top">{item.category}</td>
                <td className="py-2 px-2 align-top">{item.owner}</td>
                <td className="py-2 px-2 align-top">{item.task}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Recent Deals Table ---
export const RecentDealsTable = ({ data }: { data: any[] }) => {
  return (
    <div className="flex flex-col h-full bg-[#1e293b] rounded overflow-hidden">
      <SectionHeader title="Recent Deals" />
      <div className="overflow-auto custom-scrollbar flex-1 p-2">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#334155] text-xs text-white sticky top-0">
            <tr>
              <th className="py-2 px-2 font-semibold">LAST UPDATED</th>
              <th className="py-2 px-2 font-semibold">VALUE</th>
              <th className="py-2 px-2 font-semibold">STATUS</th>
              <th className="py-2 px-2 font-semibold">DESCRIPTION</th>
            </tr>
          </thead>
          <tbody className="text-[10px] text-slate-300">
            {data.map((item, idx) => (
              <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/50">
                <td className="py-2 px-2 align-top">{item.date}</td>
                <td className="py-2 px-2 align-top font-mono">{item.value}</td>
                <td className="py-2 px-2 align-top">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium 
                    ${item.status === 'Closed-Won' ? 'bg-green-500/20 text-green-400' : 
                      item.status === 'Closed-Lost' ? 'bg-slate-600/30 text-slate-400' :
                      item.status === 'Pending' ? 'bg-pink-500/20 text-pink-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-2 px-2 align-top">{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Upcoming Invoices Table ---
export const UpcomingInvoicesTable = ({ data }: { data: any[] }) => {
  return (
    <div className="flex flex-col h-full bg-[#1e293b] rounded overflow-hidden">
      <SectionHeader title="Upcoming Invoices" />
      <div className="overflow-auto custom-scrollbar flex-1 p-2">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#334155] text-xs text-white sticky top-0">
            <tr>
              <th className="py-2 px-2 font-semibold">DUE DATE</th>
              <th className="py-2 px-2 font-semibold">VALUE</th>
              <th className="py-2 px-2 font-semibold">COMPANY</th>
              <th className="py-2 px-2 font-semibold">DESCRIPTION</th>
            </tr>
          </thead>
          <tbody className="text-[10px] text-slate-300">
            {data.map((item, idx) => (
              <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/50">
                <td className="py-2 px-2 align-top">{item.date}</td>
                <td className="py-2 px-2 align-top font-mono">{item.value}</td>
                <td className="py-2 px-2 align-top">{item.company}</td>
                <td className="py-2 px-2 align-top">{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};