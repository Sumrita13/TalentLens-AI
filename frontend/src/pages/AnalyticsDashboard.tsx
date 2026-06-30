import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#ec4899', '#a855f7', '#06b6d4', '#3b82f6', '#10b981'];

export default function AnalyticsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/data/analytics');
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-8 text-white">Loading Analytics...</div>;
  }

  // Mocking some distributions for the charts since the backend only returns top 5 skills currently.
  // In a real app, these would come directly from complex MongoDB aggregations.
  const experienceData = [
    { name: '0-2 Yrs', count: Math.floor(data.stats.candidates * 0.15) },
    { name: '3-5 Yrs', count: Math.floor(data.stats.candidates * 0.35) },
    { name: '6-9 Yrs', count: Math.floor(data.stats.candidates * 0.30) },
    { name: '10+ Yrs', count: Math.floor(data.stats.candidates * 0.20) },
  ];

  const qualityData = [
    { name: 'Poor', match: 20 },
    { name: 'Fair', match: 45 },
    { name: 'Good', match: 70 },
    { name: 'Excellent', match: 90 },
    { name: 'Perfect', match: 98 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-7xl mx-auto w-full text-purple-50">
      <h1 className="text-4xl font-black gradient-text mb-8">Platform Analytics</h1>
      
      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6 border-pink-500/30">
          <h3 className="text-sm text-gray-400 uppercase tracking-widest mb-2">Total Candidates</h3>
          <p className="text-4xl font-black text-white">{data.stats.candidates.toLocaleString()}</p>
        </div>
        <div className="glass-card p-6 border-purple-500/30">
          <h3 className="text-sm text-gray-400 uppercase tracking-widest mb-2">Active Jobs</h3>
          <p className="text-4xl font-black text-white">{data.stats.jobs}</p>
        </div>
        <div className="glass-card p-6 border-cyan-500/30">
          <h3 className="text-sm text-gray-400 uppercase tracking-widest mb-2">Rankings Run</h3>
          <p className="text-4xl font-black text-white">{data.stats.rankings}</p>
        </div>
        <div className="glass-card p-6 border-blue-500/30">
          <h3 className="text-sm text-gray-400 uppercase tracking-widest mb-2">Avg Match</h3>
          <p className="text-4xl font-black text-white">{data.stats.matchRate}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Skill Distribution */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-6">Top Skill Distribution</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.skillDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid rgba(236,72,153,0.3)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Experience Distribution */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-6">Experience Demographics</h2>
          <div className="h-72 w-full flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={experienceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {experienceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid rgba(236,72,153,0.3)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4 text-xs text-gray-400 flex-wrap">
            {experienceData.map((entry, index) => (
              <div key={entry.name} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-xl font-bold mb-6">Historical Candidate Quality Curve</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={qualityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid rgba(236,72,153,0.3)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="match" stroke="#06b6d4" strokeWidth={3} dot={{ r: 6, fill: '#1a1a24', stroke: '#06b6d4', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
