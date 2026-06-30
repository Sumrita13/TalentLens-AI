import { useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

export default function Settings() {
  const { user } = useContext(AuthContext);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-4xl mx-auto w-full text-purple-50">
      <h1 className="text-4xl font-black gradient-text mb-8">Platform Settings</h1>
      
      <div className="glass-card p-8">
        <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Recruiter Profile</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2 uppercase tracking-widest">Name</label>
            <input 
              type="text" 
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500/50"
              value={user?.name || ''}
              disabled
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2 uppercase tracking-widest">Email</label>
            <input 
              type="email" 
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500/50"
              value={user?.email || ''}
              disabled
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2 uppercase tracking-widest">Role</label>
            <div className="px-4 py-2 bg-pink-500/20 text-pink-300 rounded border border-pink-500/30 inline-block uppercase tracking-widest text-xs font-bold">
              {user?.role}
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/10">
          <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-sm font-bold">
            Reset Password
          </button>
        </div>
      </div>
    </motion.div>
  );
}
