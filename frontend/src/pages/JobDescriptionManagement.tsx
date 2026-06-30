import { useState } from 'react';
import { motion } from 'framer-motion';

export default function JobDescriptionManagement() {
  const [jobTitle, setJobTitle] = useState('');
  const [jdText, setJdText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  const handleExtract = async () => {
    if (!jdText) return;
    setIsExtracting(true);
    try {
      const response = await fetch('http://localhost:5000/api/ai/extract-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: jdText })
      });
      const data = await response.json();
      setExtractedData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSave = async () => {
    if (!extractedData || !jobTitle) {
      alert("Please provide a Job Title and extract data first.");
      return;
    }
    try {
      await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recruiterId: 'recruiter-123', // Hardcoded for demo
          title: jobTitle,
          description: jdText,
          parsed_text: jdText,
          requirements: extractedData
        })
      });
      alert('Job Description saved successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-6xl mx-auto w-full text-purple-50">
      <h1 className="text-4xl font-black gradient-text mb-8">Job Description Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Col: Input */}
        <div className="glass-card p-6 flex flex-col space-y-4">
          <h2 className="text-xl font-bold">Paste JD or Upload Markdown</h2>
          
          <div>
            <label className="block text-xs text-gray-400 mb-1 uppercase tracking-widest">Job Title</label>
            <input 
              type="text" 
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500/50"
              placeholder="e.g. Lead DevOps Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>

          <textarea
            className="w-full h-[320px] bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-pink-500/50 transition-colors"
            placeholder="Paste your job description here..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />
          <button 
            className="glow-btn self-end w-full"
            onClick={handleExtract}
            disabled={isExtracting}
          >
            {isExtracting ? 'Extracting via AI...' : 'Parse & Extract AI Insights'}
          </button>
        </div>

        {/* Right Col: Output */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4">AI Extraction Results</h2>
          
          {extractedData ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm text-gray-400 uppercase tracking-widest mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {extractedData.skills.map((s: string) => (
                    <span key={s} className="px-3 py-1 bg-purple-500/20 rounded-full text-xs text-purple-200 border border-purple-500/30">{s}</span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-400 uppercase tracking-widest mb-2">Preferred Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {extractedData.preferred_skills.map((s: string) => (
                    <span key={s} className="px-3 py-1 bg-pink-500/20 rounded-full text-xs text-pink-200 border border-pink-500/30">{s}</span>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                  <span className="text-xs text-gray-400 block mb-1">Experience</span>
                  <span className="font-bold">{extractedData.experience_years}+ Years</span>
                </div>
                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                  <span className="text-xs text-gray-400 block mb-1">Education Level</span>
                  <span className="font-bold">{extractedData.education_level}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm text-gray-400 uppercase tracking-widest mb-2">Responsibilities</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
                  {extractedData.responsibilities.map((r: string, i: number) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <button 
                className="w-full mt-4 bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                onClick={handleSave}
              >
                Save Job Description
              </button>
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-gray-500 border border-dashed border-white/10 rounded-xl">
              Results will appear here
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
