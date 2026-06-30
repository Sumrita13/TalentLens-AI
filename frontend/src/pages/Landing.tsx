import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="relative overflow-hidden min-h-[90vh]">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-600/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-32 relative z-10">
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-pink-400 text-xs font-black uppercase tracking-widest mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
            </span>
            Neural Engine v4.0 Active
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[1.1]">
            Hire with <span className="gradient-text">Precision.</span>
          </h1>
          <p className="text-xl md:text-2xl text-purple-200/60 font-medium mb-12 max-w-2xl mx-auto">
            TalentLens AI uses deep behavioral intelligence to match the top 1% of talent with your company's unique culture and technical needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/register" 
              className="px-8 py-4 bg-gradient-to-r from-pink-600 to-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform flex items-center gap-3 w-full sm:w-auto justify-center"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/login" 
              className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all w-full sm:w-auto justify-center flex"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="glass-card p-8 border border-white/5 hover:border-pink-500/30 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-7 h-7 text-pink-400" />
            </div>
            <h3 className="text-xl font-black text-white mb-3">Neural Ranking</h3>
            <p className="text-purple-200/60 font-medium leading-relaxed">
              Our ML models analyze thousands of data points to predict long-term success and cultural fit with 94% accuracy.
            </p>
          </div>
          
          <div className="glass-card p-8 border border-white/5 hover:border-indigo-500/30 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-xl font-black text-white mb-3">Instant Matching</h3>
            <p className="text-purple-200/60 font-medium leading-relaxed">
              Process over 100,000+ candidates in seconds. Find your perfect hire before your competitors even post the job.
            </p>
          </div>

          <div className="glass-card p-8 border border-white/5 hover:border-fuchsia-500/30 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-7 h-7 text-fuchsia-400" />
            </div>
            <h3 className="text-xl font-black text-white mb-3">Bias Elimination</h3>
            <p className="text-purple-200/60 font-medium leading-relaxed">
              Focus purely on skills and behavioral affinity. Our engine blinds demographic data to ensure fair, equitable hiring.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Landing;
