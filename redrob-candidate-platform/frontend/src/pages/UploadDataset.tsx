import React, { useState } from 'react';
import { FileText, CheckCircle2, Activity, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const UploadDataset = () => {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleProcess = async () => {
    if (!jobTitle || !jobDescription) return;
    setIsProcessing(true);
    setStatus('idle');
    
    try {
      // 1. Create Job in DB
      const jobResponse = await axios.post(`${API_URL}/jobs`, {
        title: jobTitle,
        description: jobDescription,
        requirements: {
          skills: [], // We can extract these or leave empty for the engine to find
          experience_years: 0,
          education_level: 'Degree',
          keywords: []
        }
      });

      const jobId = jobResponse.data._id;

      // 2. Trigger Ranking
      await axios.post(`${API_URL}/ranking/execute`, {
        jobId: jobId,
        limit: 100
      });
      
      setStatus('success');
      
      setTimeout(() => {
        setIsProcessing(false);
        navigate('/rankings');
      }, 1500);
    } catch (error) {
      console.error('Neural processing failed:', error);
      setIsProcessing(false);
      setStatus('error');
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-12 pb-20">
      <div className="relative">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-pink-600/10 blur-[120px] rounded-full pointer-events-none" />
        <h1 className="text-4xl font-black tracking-tighter text-white mb-2">
          Job <span className="gradient-text">Configuration</span>
        </h1>
        <p className="text-purple-300/40 text-lg font-medium">Define your target role to begin the neural ranking process across 100,000+ candidates.</p>
      </div>

      <div className="glass-card p-10 border border-white/5 space-y-8">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-500 ml-1">Target Position</label>
          <input 
            type="text" 
            placeholder="e.g. Senior Frontend Architect"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full bg-[#1a1a25]/50 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-pink-500/50 transition-all text-lg font-bold"
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-500 ml-1">Job Description & Requirements</label>
          <textarea 
            placeholder="Paste the full job description here. The neural engine will extract key semantic markers..."
            rows={10}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full bg-[#1a1a25]/50 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-pink-500/50 transition-all text-sm leading-relaxed"
          />
        </div>

        <div className="flex flex-col items-center gap-8 pt-6">
          <button
            onClick={handleProcess}
            disabled={isProcessing || !jobTitle || !jobDescription}
            className="glow-btn px-20 py-8 text-sm disabled:opacity-30 disabled:hover:scale-100"
          >
            {isProcessing ? (
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                RANKING 100,000 PROFILES...
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Activity className="w-6 h-6" />
                EXECUTE NEURAL DISCOVERY
              </div>
            )}
          </button>

          <AnimatePresence>
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-10 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-400 font-extrabold text-xs tracking-widest uppercase"
              >
                <CheckCircle2 className="w-5 h-5" />
                Sequence Initialized Successfully
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-10 py-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 font-extrabold text-xs tracking-widest uppercase"
              >
                <Activity className="w-5 h-5" />
                Neural Engine Connection Failed
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem] space-y-6">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-pink-500" />
          <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">Advanced Processing Layer</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { t: "LLM Extraction", d: "Automatic identification of hard and soft skills from unstructured text." },
            { t: "Global Benchmarking", d: "Candidates are scored against a global talent baseline." },
            { t: "Fraud Detection", d: "Inconsistencies in career timelines are flagged automatically." },
            { t: "Diversity Safeguards", d: "Neural bias filter ensures rankings focus on technical merit." }
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              <p className="text-xs font-black text-purple-400 uppercase tracking-widest">{item.t}</p>
              <p className="text-sm text-purple-200/40 leading-relaxed font-medium">{item.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadDataset;
