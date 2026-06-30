import React, { useEffect, useState, useContext } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Users, FileText, Target, Activity, Code, Star, ShieldAlert } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const StatsCard = ({ title, value, icon: Icon, color, shadowColor, glowColor }: any) => (
  <div className="glass-card p-6 flex items-center gap-4 group cursor-pointer border border-white/5 hover:border-pink-500/30 transition-all duration-500">
    <div className={`p-4 rounded-2xl ${color} shadow-lg ${shadowColor} transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${glowColor}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-[10px] text-purple-400/60 font-black uppercase tracking-[0.2em]">{title}</p>
      <h3 className="text-3xl font-black text-white mt-1 group-hover:text-pink-400 transition-colors">{value}</h3>
    </div>
  </div>
);

const RecruiterDashboard = ({ analytics }: any) => {
  return (
    <>
      <div className="relative">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-pink-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <h1 className="text-5xl font-black tracking-tighter text-white mb-3">
          Candidate <span className="gradient-text">Discovery</span>
        </h1>
        <p className="text-purple-200/60 text-lg max-w-2xl font-medium">
          Deep neural ranking across {analytics?.stats?.candidates?.toLocaleString() || '100,000+'} candidates using behavioral intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Candidate Pool" 
          value={analytics?.stats?.candidates?.toLocaleString() || '0'} 
          icon={Users} 
          color="bg-pink-600" 
          shadowColor="shadow-pink-500/20" 
          glowColor="pink-blue-glow"
        />
        <StatsCard 
          title="Active Jobs" 
          value={analytics?.stats?.jobs || '0'} 
          icon={FileText} 
          color="bg-purple-600" 
          shadowColor="shadow-purple-500/20"
        />
        <StatsCard 
          title="Total Rankings" 
          value={analytics?.stats?.rankings || '0'} 
          icon={Target} 
          color="bg-blue-600" 
          shadowColor="shadow-blue-500/20" 
          glowColor="pink-blue-glow"
        />
        <StatsCard 
          title="Match Avg" 
          value={analytics?.stats?.matchRate || '78%'} 
          icon={Activity} 
          color="bg-fuchsia-600" 
          shadowColor="shadow-fuchsia-500/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="glass-card p-10 border border-white/5">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-black text-white uppercase tracking-widest border-l-4 border-pink-500 pl-4">Skill Affinity</h2>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-75" />
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.skillDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1b4b" vertical={false} />
                <XAxis dataKey="name" stroke="#6b21a8" fontSize={11} fontWeight="900" tickLine={false} axisLine={false} />
                <YAxis stroke="#6b21a8" fontSize={11} fontWeight="900" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0c0a1a', border: '1px solid #c026d3', borderRadius: '16px' }}
                  itemStyle={{ color: '#ec4899', fontWeight: '900' }}
                  cursor={{ fill: 'rgba(236, 72, 153, 0.05)' }}
                />
                <Bar dataKey="count" fill="url(#neonGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="neonGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-10 border border-white/5">
          <h2 className="text-xl font-black text-white uppercase tracking-widest mb-10 border-l-4 border-blue-500 pl-4">Recently Ranked</h2>
          <div className="space-y-6">
            {analytics?.recentRankings && analytics.recentRankings.length > 0 ? (
              analytics.recentRankings.map((ranking: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-purple-500/5 border border-purple-500/10 hover:bg-purple-500/10 hover:border-pink-500/30 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-600/20 to-blue-600/20 flex items-center justify-center group-hover:from-pink-600/40 group-hover:to-blue-600/40 transition-all border border-pink-500/10">
                      <FileText className="w-6 h-6 text-pink-400" />
                    </div>
                    <div>
                      <p className="font-black text-lg text-white">{ranking.job_id?.title || 'Unknown Job'}</p>
                      <p className="text-xs text-purple-300/40 font-bold uppercase tracking-widest">Candidate: {ranking.candidate_name || ranking.candidate_id_str || 'Unknown'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-4 py-1.5 bg-pink-500/20 text-pink-400 font-bold uppercase tracking-widest text-[10px] rounded-lg">{(ranking.final_score * 100).toFixed(0)}% Match</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-between p-5 rounded-2xl bg-purple-500/5 border border-purple-500/10 hover:bg-purple-500/10 hover:border-pink-500/30 transition-all group">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-600/20 to-blue-600/20 flex items-center justify-center group-hover:from-pink-600/40 group-hover:to-blue-600/40 transition-all border border-pink-500/10">
                    <FileText className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <p className="font-black text-lg text-white">System Standby</p>
                    <p className="text-xs text-purple-300/40 font-bold uppercase tracking-widest">Waiting for ranking trigger...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const CandidateDashboard = ({ user, analytics }: any) => {
  return (
    <>
      <div className="relative mb-12">
        <h1 className="text-5xl font-black tracking-tighter text-white mb-3">
          Welcome back, <span className="gradient-text">{user?.name}</span>
        </h1>
        <p className="text-purple-200/60 text-lg max-w-2xl font-medium">
          Your profile is currently active in the TalentLens talent pool.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatsCard 
          title="Profile Views" 
          value={analytics?.stats?.profileViews || '0'} 
          icon={Activity} 
          color="bg-pink-600" 
          shadowColor="shadow-pink-500/20" 
        />
        <StatsCard 
          title="Skill Matches" 
          value={analytics?.stats?.skillMatches || '0'} 
          icon={Code} 
          color="bg-indigo-600" 
          shadowColor="shadow-indigo-500/20"
        />
        <StatsCard 
          title="Behavioral Score" 
          value={analytics?.stats?.behavioralScore || '0%'} 
          icon={Star} 
          color="bg-emerald-600" 
          shadowColor="shadow-emerald-500/20" 
        />
      </div>

      <div className="glass-card p-10 border border-white/5">
        <h2 className="text-xl font-black text-white uppercase tracking-widest mb-10 border-l-4 border-indigo-500 pl-4">Recommended Jobs</h2>
        <div className="space-y-4">
          {analytics?.recommendedJobs && analytics.recommendedJobs.length > 0 ? (
            analytics.recommendedJobs.map((job: any) => (
              <div key={job.id} className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-pink-500/30 transition-all flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black text-white mb-1">{job.title}</h3>
                  <p className="text-sm text-purple-300/60 font-medium">Neural Engine Match</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-4 py-1.5 bg-emerald-500/20 text-emerald-400 font-bold uppercase tracking-widest text-[10px] rounded-lg">{job.matchPercent}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-purple-300/40 font-bold uppercase tracking-widest text-center py-6">
              No recommended jobs yet. Recruiters are actively searching the platform!
            </p>
          )}
        </div>
      </div>
    </>
  );
};

const Dashboard = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        if (user?.role === 'candidate') {
          const response = await axios.get(`${API_URL}/data/candidate-analytics/${user.candidateId || user.email}`);
          setAnalytics(response.data);
        } else {
          const response = await axios.get(`${API_URL}/data/analytics`);
          setAnalytics(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchAnalytics();
  }, [user]);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-pink-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {user?.role === 'candidate' ? (
        <CandidateDashboard user={user} analytics={analytics} />
      ) : (
        <RecruiterDashboard analytics={analytics} />
      )}
    </div>
  );
};

export default Dashboard;
