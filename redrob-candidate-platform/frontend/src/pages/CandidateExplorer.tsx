import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function CandidateExplorer() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCandidates();
  }, [page]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/data/candidates?page=${page}&limit=12`);
      const data = await response.json();
      setCandidates(data.candidates);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-7xl mx-auto w-full text-purple-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black gradient-text">Candidate Dataset</h1>
        <div className="flex items-center space-x-4">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 disabled:opacity-50"
          >
            Prev
          </button>
          <span>Page {page} of {totalPages}</span>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass-card p-6 h-[250px] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {candidates.map((c: any) => (
            <Link to={`/candidate/${c.candidate_id}`} key={c.candidate_id}>
              <motion.div whileHover={{ y: -5 }} className="glass-card p-6 h-full flex flex-col justify-between cursor-pointer group">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl group-hover:text-pink-400 transition-colors">
                      {c.profile?.anonymized_name || 'Unknown Candidate'}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-white/10 rounded-md">
                      {c.profile?.years_of_experience || 0} YOE
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{c.profile?.headline}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {c.skills?.slice(0, 4).map((s: any, idx: number) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                        {s.name}
                      </span>
                    ))}
                    {c.skills?.length > 4 && <span className="text-xs px-2 py-1 text-gray-500">+{c.skills.length - 4}</span>}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Behavior Score</span>
                    <span className="text-sm font-mono font-bold text-cyan-400">
                      {Math.floor(c.redrob_signals?.profile_completeness_score || 0)}/100
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    →
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}
