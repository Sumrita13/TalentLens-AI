import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CandidateDetails() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiQuestions, setAiQuestions] = useState<any[]>([]);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/data/candidates/${id}`);
        const data = await response.json();
        setCandidate(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [id]);

  const handleGenerateQuestions = async () => {
    setGeneratingQuestions(true);
    try {
      // Fetch a JD or mock one for the demo
      const jd = "Looking for a Senior Python Engineer with AWS and Machine Learning experience.";
      const response = await fetch('http://localhost:5000/api/ai/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate, jd })
      });
      const data = await response.json();
      setAiQuestions(data.questions);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingQuestions(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Loading Candidate...</div>;
  if (!candidate) return <div className="p-8 text-white">Candidate Not Found</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-7xl mx-auto w-full text-purple-50">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-black gradient-text mb-2">{candidate.profile?.anonymized_name || 'Anonymous Candidate'}</h1>
          <p className="text-xl text-gray-400">{candidate.profile?.headline}</p>
          <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
            <span>📍 {candidate.profile?.location}</span>
            <span>💼 {candidate.profile?.years_of_experience} YOE</span>
            <span>🏛️ {candidate.education?.[0]?.institution || 'Unknown University'}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="glass-card p-4 inline-block text-center border-pink-500/30">
            <span className="block text-xs uppercase tracking-wider text-gray-400 mb-1">TalentLens Behavior Score</span>
            <span className="text-3xl font-black text-pink-400">{Math.floor(candidate.redrob_signals?.profile_completeness_score || 0)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Resume Details */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Summary</h2>
            <p className="text-gray-300 leading-relaxed text-sm">
              {candidate.profile?.summary || "No summary provided."}
            </p>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Experience</h2>
            <div className="space-y-6">
              {candidate.career_history?.map((job: any, i: number) => (
                <div key={i} className="relative pl-6 border-l border-white/10">
                  <div className="absolute w-3 h-3 bg-pink-500 rounded-full -left-[6.5px] top-1"></div>
                  <h3 className="font-bold text-lg text-white">{job.title}</h3>
                  <div className="text-sm text-pink-400 mb-2">{job.company} • {job.start_date} - {job.is_current ? 'Present' : job.end_date}</div>
                  <p className="text-sm text-gray-400 leading-relaxed">{job.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: AI Insights & Skills */}
        <div className="space-y-8">
          
          <div className="glass-card p-6 bg-gradient-to-br from-indigo-900/20 to-purple-900/20">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">🧠</span> AI Intelligence
            </h2>
            
            <div className="space-y-4">
              <div>
                <span className="text-xs text-gray-400 block mb-1">Risk Factors</span>
                {candidate.redrob_signals?.interview_completion_rate < 0.5 ? (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-200">
                    High drop-off rate in interviews ({(candidate.redrob_signals?.interview_completion_rate * 100).toFixed(0)}%). Flight risk.
                  </div>
                ) : (
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-sm text-green-200">
                    Low historical risk. Good interview completion rate.
                  </div>
                )}
              </div>
              
              <div>
                <span className="text-xs text-gray-400 block mb-1">Behavioral Signals</span>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-black/30 p-2 rounded">
                    <span className="block text-gray-500 text-xs">Response Rate</span>
                    <span className="font-mono">{(candidate.redrob_signals?.recruiter_response_rate * 100).toFixed(0)}%</span>
                  </div>
                  <div className="bg-black/30 p-2 rounded">
                    <span className="block text-gray-500 text-xs">GitHub Activity</span>
                    <span className="font-mono">{candidate.redrob_signals?.github_activity_score}/100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-4">Skills Matrix</h2>
            <div className="flex flex-wrap gap-2">
              {candidate.skills?.map((s: any, idx: number) => (
                <div key={idx} className={`px-3 py-1 rounded border text-xs flex flex-col
                  ${s.proficiency === 'expert' ? 'bg-pink-500/20 border-pink-500/50 text-pink-200' : 
                    s.proficiency === 'advanced' ? 'bg-purple-500/20 border-purple-500/50 text-purple-200' :
                    'bg-white/5 border-white/10 text-gray-300'}`}>
                  <span className="font-bold">{s.name}</span>
                  <span className="text-[10px] opacity-70 uppercase tracking-widest">{s.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass-card p-6 border-cyan-500/30">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">AI Interview Copilot</h2>
            
            {aiQuestions.length > 0 ? (
              <div className="space-y-4">
                {aiQuestions.map((q: any, i: number) => (
                  <div key={i} className="bg-black/40 p-4 rounded-xl border border-white/5">
                    <span className="text-xs font-black text-cyan-400 uppercase tracking-widest block mb-2">{q.type}</span>
                    <p className="text-sm font-bold text-white mb-2">{q.question}</p>
                    <p className="text-xs text-gray-500 italic">Rationale: {q.rationale}</p>
                  </div>
                ))}
              </div>
            ) : (
              <button 
                className="w-full py-3 bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/50 rounded-xl text-cyan-300 font-bold transition-colors text-sm"
                onClick={handleGenerateQuestions}
                disabled={generatingQuestions}
              >
                {generatingQuestions ? 'Generating...' : 'Generate Questions'}
              </button>
            )}
          </div>

        </div>

      </div>
    </motion.div>
  );
}
