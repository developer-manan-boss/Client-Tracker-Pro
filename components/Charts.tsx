import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// --- Custom Tooltip to match dark theme ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 p-2 rounded shadow-lg">
        <p className="text-slate-200 text-xs font-semibold">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

// --- Horizontal Bar Chart ---
interface HorizontalBarChartProps {
  data: any[];
  color: string;
  dataKey?: string;
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ data, color, dataKey = "value" }) => {
  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={80} 
            tick={{ fill: '#cbd5e1', fontSize: 10 }} 
            interval={0}
          />
          <Tooltip content={<CustomTooltip />} cursor={{fill: '#334155', opacity: 0.2}} />
          <Bar dataKey={dataKey} fill={color} radius={[0, 4, 4, 0]} barSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- Donut Chart ---
interface DonutChartProps {
  data: any[];
}

export const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
    // Custom label to show number inside segment if large enough, or just rely on legend
    // Screenshot has numbers inside the donut segments sometimes, but they are small. 
    // We will stick to a clean legend below.
  return (
    <div className="w-full h-48 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
       {/* Simple Legend Overlay similar to screenshot if needed, but the screenshot has a Legend below */}
    </div>
  );
};

// --- Legend Helper ---
export const ChartLegend: React.FC<{ items: { label: string; color: string }[] }> = ({ items }) => {
    return (
        <div className="flex flex-wrap justify-center gap-2 mt-2 px-2">
            {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-[9px] text-slate-300">{item.label}</span>
                </div>
            ))}
        </div>
    )
}
