import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CandidateComparison() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [candAId, setCandAId] = useState('');
  const [candBId, setCandBId] = useState('');
  const [jdText, setJdText] = useState('Looking for a Senior Python Engineer with AWS experience.');
  
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    // Fetch a short list of candidates for the dropdowns
    const fetchCandidates = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/data/candidates?limit=50');
        const data = await response.json();
        setCandidates(data.candidates);
        if (data.candidates.length >= 2) {
          setCandAId(data.candidates[0].candidate_id);
          setCandBId(data.candidates[1].candidate_id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCandidates();
  }, []);

  const handleCompare = async () => {
    if (!candAId || !candBId || candAId === candBId) {
      alert("Please select two different candidates.");
      return;
    }
    
    setIsComparing(true);
    try {
      // Find the full candidate objects
      const candA = candidates.find(c => c.candidate_id === candAId);
      const candB = candidates.find(c => c.candidate_id === candBId);
      
      const response = await fetch('http://localhost:5000/api/ai/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateA: candA, candidateB: candB, jd: jdText })
      });
      const data = await response.json();
      setComparisonResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-7xl mx-auto w-full text-purple-50">
      <h1 className="text-4xl font-black gradient-text mb-8 text-center">AI Candidate Comparison</h1>
      
      <div className="glass-card p-6 mb-8 max-w-3xl mx-auto">
        <h2 className="text-lg font-bold mb-4">Job Description Context</h2>
        <textarea 
          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-pink-500/50 mb-4"
          rows={3}
          value={jdText}
          onChange={e => setJdText(e.target.value)}
        />
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Candidate A</label>
            <select 
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none"
              value={candAId}
              onChange={e => setCandAId(e.target.value)}
            >
              {candidates.map(c => (
                <option key={c.candidate_id} value={c.candidate_id}>{c.profile?.anonymized_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Candidate B</label>
            <select 
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none"
              value={candBId}
              onChange={e => setCandBId(e.target.value)}
            >
              {candidates.map(c => (
                <option key={c.candidate_id} value={c.candidate_id}>{c.profile?.anonymized_name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <button 
          className="glow-btn w-full text-center block"
          onClick={handleCompare}
          disabled={isComparing}
        >
          {isComparing ? 'Analyzing Candidates...' : 'Run AI Comparison'}
        </button>
      </div>

      {comparisonResult && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="glass-card p-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20 mb-8 border-pink-500/30">
            <h2 className="text-2xl font-black mb-4">AI Verdict</h2>
            <p className="text-xl font-bold text-pink-300 mb-2">{comparisonResult.explanation.who_is_better}</p>
            <p className="text-gray-300 leading-relaxed">{comparisonResult.explanation.why}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {comparisonResult.detailed_scores.map((cand: any, idx: number) => {
              const isWinner = cand.candidate_id === comparisonResult.winner_id;
              
              return (
                <div key={idx} className={`glass-card p-6 border-t-4 ${isWinner ? 'border-t-green-400' : 'border-t-red-400'}`}>
                  <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                    <h3 className="text-xl font-bold">{candidates.find(c => c.candidate_id === cand.candidate_id)?.profile?.anonymized_name}</h3>
                    <div className="text-right">
                      <span className="text-xs text-gray-400 block">Final Match Score</span>
                      <span className={`text-2xl font-black ${isWinner ? 'text-green-400' : 'text-white'}`}>
                        {(cand.final_score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-gray-300 mb-2">Metrics</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-black/20 p-2 rounded">
                          <span className="block text-gray-500 text-[10px] uppercase">Skill Match</span>
                          <span className="font-mono">{(cand.scores.skill_match * 100).toFixed(0)}%</span>
                        </div>
                        <div className="bg-black/20 p-2 rounded">
                          <span className="block text-gray-500 text-[10px] uppercase">Behavior</span>
                          <span className="font-mono">{(cand.scores.behavioral_score * 100).toFixed(0)}%</span>
                        </div>
                        <div className="bg-black/20 p-2 rounded">
                          <span className="block text-gray-500 text-[10px] uppercase">Semantic</span>
                          <span className="font-mono">{(cand.scores.semantic_similarity * 100).toFixed(0)}%</span>
                        </div>
                        <div className="bg-black/20 p-2 rounded">
                          <span className="block text-red-400 text-[10px] uppercase">Risk</span>
                          <span className="font-mono text-red-300">{(cand.scores.risk_score * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-bold text-green-300 mb-2">Strengths</h4>
                      <ul className="list-disc pl-4 space-y-1 text-sm text-gray-400">
                        {cand.justification.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-bold text-orange-300 mb-2">Weaknesses</h4>
                      <ul className="list-disc pl-4 space-y-1 text-sm text-gray-400">
                        {cand.justification.weaknesses.map((w: string, i: number) => <li key={i}>{w}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
