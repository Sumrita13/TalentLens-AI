import React, { useState, useEffect } from 'react';
import { Trophy, Star, ShieldAlert, Zap, Info, PlayCircle, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const RankingCard = ({ candidate }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="glass-card mb-4 overflow-hidden rounded-2xl group border border-white/5 hover:border-pink-500/20"
    >
      <div className="p-6">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${
              candidate.rank === 1 ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 
              candidate.rank === 2 ? 'bg-slate-400/20 text-slate-400 border border-slate-400/30' : 
              'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
            }`}>
              #{candidate.rank}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-pink-400 transition-colors uppercase tracking-tight font-mono tracking-wider text-base">
                {candidate.candidateLabel}
              </h3>
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 bg-pink-500/10 text-pink-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-pink-500/10">
                  Score: {candidate.matchScore}%
                </span>
                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-500/10">
                  Behavior: {candidate.behaviorScore}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-10">
            <div className="text-right">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">Match Score</p>
              <p className="text-3xl font-black gradient-text mt-1">{candidate.displayScore}%</p>
            </div>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-3 bg-white/5 hover:bg-pink-500/10 rounded-xl transition-all border border-white/5"
            >
              <Info className={`w-5 h-5 text-slate-400 ${isExpanded ? 'text-pink-400' : ''}`} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-6 pt-6 border-t border-white/5 space-y-8 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-500">
                    <span>Technical Alignment</span>
                    <span className="text-emerald-400">{candidate.matchScore}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full" style={{ width: `${candidate.matchScore}%` }} />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-500">
                    <span>Behavioral Logic</span>
                    <span className="text-indigo-400">{candidate.behaviorScore}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full" style={{ width: `${candidate.behaviorScore}%` }} />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-500">
                    <span>Risk Spectrum</span>
                    <span className={candidate.risk === 'Low' ? 'text-emerald-400' : 'text-rose-400'}>{candidate.risk}</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full ${
                        i <= (candidate.risk === 'Low' ? 1 : 4) 
                          ? (candidate.risk === 'Low' ? 'bg-emerald-500' : 'bg-rose-500') 
                          : 'bg-white/5'
                      }`} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-pink-500/5 p-6 rounded-2xl border border-pink-500/10">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-pink-400 mb-3">AI Reasoning & Justification</h4>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "{candidate.justification}"
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const Rankings = () => {
  const [rankings, setRankings] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRanking, setIsRanking] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_URL}/jobs`);
      setJobs(response.data);
      if (response.data.length > 0) {
        setSelectedJobId(response.data[0]._id);
        fetchRankings(response.data[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };

  const fetchRankings = async (jobId: string) => {
    if (!jobId) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/ranking/results/${jobId}`);
      setRankings(response.data);
    } catch (error) {
      console.error('Failed to load rankings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerRanking = async () => {
    if (!selectedJobId) return;
    setIsRanking(true);
    try {
      await axios.post(`${API_URL}/ranking/execute`, {
        jobId: selectedJobId,
        limit: 100
      });
      fetchRankings(selectedJobId);
    } catch (error) {
      console.error('Ranking failed:', error);
    } finally {
      setIsRanking(false);
    }
  };

  const handleExportRankings = () => {
    if (!selectedJobId) return;
    window.open(`${API_URL}/ranking/export/${selectedJobId}`, '_blank');
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Neural <span className="gradient-text">Rankings</span></h1>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            value={selectedJobId}
            onChange={(e) => {
              setSelectedJobId(e.target.value);
              fetchRankings(e.target.value);
            }}
            className="bg-[#1a1a25] border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500/50 transition-all flex-1 md:w-64"
          >
            <option value="">Select Target Job</option>
            {jobs.map(job => (
              <option key={job._id} value={job._id}>{job.title}</option>
            ))}
          </select>
          
          <button 
            onClick={handleTriggerRanking}
            disabled={isRanking || !selectedJobId}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-pink-600/20"
          >
            {isRanking ? 'Processing...' : (
              <>
                <PlayCircle className="w-4 h-4" />
                Trigger Ranking
              </>
            )}
          </button>

          <button 
            onClick={handleExportRankings}
            disabled={rankings.length === 0 || !selectedJobId}
            className="flex items-center gap-2 bg-[#1a1a25] border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            <Download className="w-4 h-4" />
            Export XLSX
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-purple-300/40 font-black uppercase tracking-widest text-[10px]">Accessing Database...</p>
        </div>
      ) : rankings.length > 0 ? (
        <div className="space-y-4">
          {rankings.map((r, index) => (
            <RankingCard key={r._id} candidate={{
              ...r,
              rank: index + 1,
              candidateLabel: r.candidate_name || r.candidate_id_str || `Candidate #${index + 1}`,
              displayScore: (r.final_score * 100).toFixed(1),
              justification: r.justification?.ranking_justification || 'Strong semantic match with job requirements.',
              risk: (r.scores?.penalties || 0) > 0.3 ? 'High' : (r.scores?.penalties || 0) > 0.1 ? 'Medium' : 'Low',
              behaviorScore: Math.min(100, ((r.scores?.behavioral_score || 0) * 100)).toFixed(0),
              matchScore: Math.min(100, ((r.scores?.skill_match || 0) * 100)).toFixed(0)
            }} />
          ))}
        </div>
      ) : (
        <div className="glass-card p-20 flex flex-col items-center justify-center text-center border-dashed border-white/10">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Trophy className="w-10 h-10 text-purple-500/30" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">No Rankings Detected</h2>
          <p className="text-purple-300/40 text-sm max-w-sm mt-3">
            Select a job description and trigger the neural engine to start discovering top talent.
          </p>
        </div>
      )}
    </div>
  );
};

export default Rankings;
